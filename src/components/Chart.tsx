"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  init,
  Chart as KLineChart,
  dispose,
  registerIndicator,
  LineType,
} from "klinecharts";
import { Button } from "@/components/ui/button";
import {
  BollingerBandsSettings,
  BollingerBandsData,
  OHLCVData,
  DEFAULT_BOLLINGER_SETTINGS,
} from "../lib/types";
import { calculateBollingerBands } from "../lib/indicators/bollinger";
import BollingerSettings from "./BollingerSettings";

interface ChartProps {
  width?: number;
  height?: number;
}

export default function Chart({ width = 800, height = 600 }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const klineChart = useRef<KLineChart | null>(null);
  const [ohlcvData, setOhlcvData] = useState<OHLCVData[]>([]);
  const [bollingerSettings, setBollingerSettings] =
    useState<BollingerBandsSettings>(DEFAULT_BOLLINGER_SETTINGS);
  const [bollingerData, setBollingerData] = useState<BollingerBandsData[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load OHLCV data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/data/ohlcv.json");
        if (!response.ok) {
          throw new Error("Failed to load OHLCV data");
        }
        const data: OHLCVData[] = await response.json();
        setOhlcvData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        console.error("Error loading OHLCV data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate Bollinger Bands when data or settings change
  useEffect(() => {
    if (ohlcvData.length > 0) {
      const bands = calculateBollingerBands(ohlcvData, bollingerSettings);
      setBollingerData(bands);
    }
  }, [ohlcvData, bollingerSettings]);

  // Initialize chart once and recreate when settings change significantly
  useEffect(() => {
    if (!chartRef.current || ohlcvData.length === 0) return;

    // Dispose existing chart completely to prevent duplicate indicators
    if (klineChart.current) {
      dispose(chartRef.current);
      klineChart.current = null;
    }

    // Register custom Bollinger Bands indicator with unique name to ensure updates
    const indicatorName = `BOLL_${Date.now()}_L${bollingerSettings.length}_S${
      bollingerSettings.stdDevMultiplier
    }_O${bollingerSettings.offset}`;
    try {
      registerIndicator({
        name: indicatorName,
        figures: [
          { key: "up", title: "UP", type: "line" },
          { key: "mid", title: "MID", type: "line" },
          { key: "dn", title: "DN", type: "line" },
        ],
        calc: (dataList: any[], indicator: any) => {
          // Use pre-calculated Bollinger data instead of recalculating
          const result = [];

          for (let i = 0; i < dataList.length; i++) {
            if (
              i < bollingerData.length &&
              bollingerData[i] &&
              bollingerData[i].basis !== null &&
              bollingerData[i].upper !== null &&
              bollingerData[i].lower !== null
            ) {
              result.push({
                up: bollingerData[i].upper,
                mid: bollingerData[i].basis,
                dn: bollingerData[i].lower,
              });
            } else {
              result.push({});
            }
          }

          return result;
        },
      });
    } catch (e) {
      // Indicator might already be registered
      console.log("Bollinger indicator already registered or error:", e);
    }

    // Create fresh chart instance
    const chart = init(chartRef.current);
    if (!chart) return;

    klineChart.current = chart;

    // Set chart data
    const chartData = ohlcvData.map((item) => ({
      timestamp: item.timestamp,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));

    chart.applyNewData(chartData);

    // Add Bollinger Bands indicator with current settings
    const indicatorId = chart.createIndicator({
      name: indicatorName,
      paneId: "candle_pane",
      calcParams: [
        bollingerSettings.length,
        bollingerSettings.stdDevMultiplier,
        bollingerSettings.source,
        bollingerSettings.offset, // Add offset parameter
      ],
      styles: {
        lines: [
          {
            color: bollingerSettings.upperBand.visible
              ? bollingerSettings.upperBand.color
              : "transparent",
            size: bollingerSettings.upperBand.lineWidth,
            style:
              bollingerSettings.upperBand.lineStyle === "dashed"
                ? LineType.Dashed
                : LineType.Solid,
            dashedValue:
              bollingerSettings.upperBand.lineStyle === "dashed" ? [5, 5] : [0],
            smooth: false,
          },
          {
            color: bollingerSettings.basicBand.visible
              ? bollingerSettings.basicBand.color
              : "transparent",
            size: bollingerSettings.basicBand.lineWidth,
            style:
              bollingerSettings.basicBand.lineStyle === "dashed"
                ? LineType.Dashed
                : LineType.Solid,
            dashedValue:
              bollingerSettings.basicBand.lineStyle === "dashed" ? [5, 5] : [0],
            smooth: false,
          },
          {
            color: bollingerSettings.lowerBand.visible
              ? bollingerSettings.lowerBand.color
              : "transparent",
            size: bollingerSettings.lowerBand.lineWidth,
            style:
              bollingerSettings.lowerBand.lineStyle === "dashed"
                ? LineType.Dashed
                : LineType.Solid,
            dashedValue:
              bollingerSettings.lowerBand.lineStyle === "dashed" ? [5, 5] : [0],
            smooth: false,
          },
        ],
      },
    });

    return () => {
      if (chartRef.current) {
        dispose(chartRef.current);
      }
      klineChart.current = null;
    };
  }, [ohlcvData, bollingerSettings, bollingerData]); // Now depends on data, settings AND calculated bollinger data

  const handleSettingsChange = useCallback(
    (newSettings: BollingerBandsSettings) => {
      // Force a complete new object to ensure React detects the change
      setBollingerSettings({
        ...DEFAULT_BOLLINGER_SETTINGS,
        ...newSettings,
        // Ensure nested objects are also new references
        basicBand: { ...newSettings.basicBand },
        upperBand: { ...newSettings.upperBand },
        lowerBand: { ...newSettings.lowerBand },
        backgroundFill: { ...newSettings.backgroundFill },
      });
    },
    [bollingerSettings]
  );

  const handleSettingsClose = useCallback(() => {
    setShowSettings(false);
  }, []);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading chart data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width, height }}
      >
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Chart Container */}
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        <div
          key={`chart-${bollingerSettings.length}-${bollingerSettings.stdDevMultiplier}-${bollingerSettings.source}-${bollingerSettings.offset}`}
          ref={chartRef}
          style={{ width, height }}
          className="bg-white dark:bg-gray-900"
        />
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            BTC/USDT with Bollinger Bands
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Length: {bollingerSettings.length} | StdDev:{" "}
            {bollingerSettings.stdDevMultiplier} | Source:{" "}
            {bollingerSettings.source.toUpperCase()} | Offset:{" "}
            {bollingerSettings.offset}
          </div>
        </div>

        <Button onClick={() => setShowSettings(true)} size="sm">
          Settings
        </Button>
      </div>

      {/* Legend */}
      <div className="mt-2 flex items-center space-x-6 text-sm">
        {bollingerSettings.upperBand.visible && (
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-0.5"
              style={{
                borderTop: `${bollingerSettings.upperBand.lineWidth}px ${bollingerSettings.upperBand.lineStyle} ${bollingerSettings.upperBand.color}`,
                background: "transparent",
              }}
            />
            <span className="text-gray-700 dark:text-gray-300">
              Upper Band ({bollingerSettings.upperBand.lineStyle})
            </span>
          </div>
        )}

        {bollingerSettings.basicBand.visible && (
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-0.5"
              style={{
                borderTop: `${bollingerSettings.basicBand.lineWidth}px ${bollingerSettings.basicBand.lineStyle} ${bollingerSettings.basicBand.color}`,
                background: "transparent",
              }}
            />
            <span className="text-gray-700 dark:text-gray-300">
              Basis (SMA) ({bollingerSettings.basicBand.lineStyle})
            </span>
          </div>
        )}

        {bollingerSettings.lowerBand.visible && (
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-0.5"
              style={{
                borderTop: `${bollingerSettings.lowerBand.lineWidth}px ${bollingerSettings.lowerBand.lineStyle} ${bollingerSettings.lowerBand.color}`,
                background: "transparent",
              }}
            />
            <span className="text-gray-700 dark:text-gray-300">
              Lower Band ({bollingerSettings.lowerBand.lineStyle})
            </span>
          </div>
        )}
      </div>

      {/* Data Summary */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div className="text-gray-600 dark:text-gray-400">Data Points</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {ohlcvData.length.toLocaleString()}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div className="text-gray-600 dark:text-gray-400">
            Bollinger Points
          </div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {bollingerData.length.toLocaleString()}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div className="text-gray-600 dark:text-gray-400">Latest Close</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            ${ohlcvData[ohlcvData.length - 1]?.close.toLocaleString() || "N/A"}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div className="text-gray-600 dark:text-gray-400">
            Latest Upper Band
          </div>
          <div className="font-semibold text-gray-900 dark:text-white">
            $
            {bollingerData[bollingerData.length - 1]?.upper?.toLocaleString() ||
              "N/A"}
          </div>
        </div>
      </div>

      {/* Bollinger Bands Data Table (for verification) */}
      {bollingerData.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            Latest Bollinger Bands Values
          </h4>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-600 dark:text-gray-400">
                  <th className="text-left py-2">Date</th>
                  <th className="text-right py-2">Close</th>
                  <th className="text-right py-2">Upper Band</th>
                  <th className="text-right py-2">Basis (SMA)</th>
                  <th className="text-right py-2">Lower Band</th>
                </tr>
              </thead>
              <tbody>
                {bollingerData
                  .filter(
                    (data) =>
                      data.basis !== null &&
                      data.upper !== null &&
                      data.lower !== null
                  )
                  .slice(-5)
                  .map((data, index) => {
                    const ohlcPoint = ohlcvData.find(
                      (d) => d.timestamp === data.timestamp
                    );
                    return (
                      <tr
                        key={data.timestamp}
                        className="text-gray-900 dark:text-white"
                      >
                        <td className="py-1">
                          {new Date(data.timestamp).toLocaleDateString()}
                        </td>
                        <td className="text-right py-1">
                          ${ohlcPoint?.close.toFixed(2) || "N/A"}
                        </td>
                        <td className="text-right py-1">
                          ${data.upper?.toFixed(2) || "N/A"}
                        </td>
                        <td className="text-right py-1">
                          ${data.basis?.toFixed(2) || "N/A"}
                        </td>
                        <td className="text-right py-1">
                          ${data.lower?.toFixed(2) || "N/A"}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <BollingerSettings
          settings={bollingerSettings}
          onChange={handleSettingsChange}
          onClose={handleSettingsClose}
        />
      )}
    </div>
  );
}
