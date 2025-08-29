"use client";

import React, { useState } from "react";
import {
  BollingerBandsSettings,
  MAType,
  SourceType,
  LineStyle,
  DEFAULT_BOLLINGER_SETTINGS,
} from "../lib/types";

interface BollingerSettingsProps {
  settings: BollingerBandsSettings;
  onChange: (settings: BollingerBandsSettings) => void;
  onClose: () => void;
}

export default function BollingerSettings({
  settings,
  onChange,
  onClose,
}: BollingerSettingsProps) {
  const [activeTab, setActiveTab] = useState<"inputs" | "style">("inputs");

  const updateSettings = (updates: Partial<BollingerBandsSettings>) => {
    onChange({ ...settings, ...updates });
  };

  const updateBandSettings = (
    band: "basicBand" | "upperBand" | "lowerBand",
    updates: Partial<BollingerBandsSettings["basicBand"]>
  ) => {
    onChange({
      ...settings,
      [band]: { ...settings[band], ...updates },
    });
  };

  const updateBackgroundFill = (
    updates: Partial<BollingerBandsSettings["backgroundFill"]>
  ) => {
    onChange({
      ...settings,
      backgroundFill: { ...settings.backgroundFill, ...updates },
    });
  };

  const resetToDefaults = () => {
    onChange(DEFAULT_BOLLINGER_SETTINGS);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-h-[90vh] min-h-[60vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Bollinger Bands Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("inputs")}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === "inputs"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Inputs
          </button>
          <button
            onClick={() => setActiveTab("style")}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === "style"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Style
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto min-h-0">
          {activeTab === "inputs" && (
            <div className="space-y-4">
              {/* Length */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Length
                </label>
                <input
                  type="number"
                  value={settings.length}
                  onChange={(e) =>
                    updateSettings({ length: parseInt(e.target.value) || 20 })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="200"
                />
              </div>

              {/* Basic MA Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Basic MA Type
                </label>
                <select
                  value={settings.basicMAType}
                  onChange={(e) =>
                    updateSettings({ basicMAType: e.target.value as MAType })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="SMA">SMA</option>
                </select>
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Source
                </label>
                <select
                  value={settings.source}
                  onChange={(e) =>
                    updateSettings({ source: e.target.value as SourceType })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="close">Close</option>
                  <option value="open">Open</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* StdDev Multiplier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  StdDev (multiplier)
                </label>
                <input
                  type="number"
                  value={settings.stdDevMultiplier}
                  onChange={(e) =>
                    updateSettings({
                      stdDevMultiplier: parseFloat(e.target.value) || 2,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0.1"
                  max="5"
                  step="0.1"
                />
              </div>

              {/* Offset */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Offset
                </label>
                <input
                  type="number"
                  value={settings.offset}
                  onChange={(e) =>
                    updateSettings({ offset: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="-50"
                  max="50"
                />
              </div>
            </div>
          )}

          {activeTab === "style" && (
            <div className="space-y-6">
              {/* Basic Band */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Basic (Middle Band)
                </h3>
                <div className="space-y-3 pl-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.basicBand.visible}
                      onChange={(e) =>
                        updateBandSettings("basicBand", {
                          visible: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Visible
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={settings.basicBand.color}
                      onChange={(e) =>
                        updateBandSettings("basicBand", {
                          color: e.target.value,
                        })
                      }
                      className="w-8 h-8 rounded border border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Color
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={settings.basicBand.lineWidth}
                      onChange={(e) =>
                        updateBandSettings("basicBand", {
                          lineWidth: parseInt(e.target.value),
                        })
                      }
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 w-12">
                      {settings.basicBand.lineWidth}px
                    </span>
                  </div>

                  <select
                    value={settings.basicBand.lineStyle}
                    onChange={(e) =>
                      updateBandSettings("basicBand", {
                        lineStyle: e.target.value as LineStyle,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                  </select>
                </div>
              </div>

              {/* Upper Band */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Upper Band
                </h3>
                <div className="space-y-3 pl-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.upperBand.visible}
                      onChange={(e) =>
                        updateBandSettings("upperBand", {
                          visible: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Visible
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={settings.upperBand.color}
                      onChange={(e) =>
                        updateBandSettings("upperBand", {
                          color: e.target.value,
                        })
                      }
                      className="w-8 h-8 rounded border border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Color
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={settings.upperBand.lineWidth}
                      onChange={(e) =>
                        updateBandSettings("upperBand", {
                          lineWidth: parseInt(e.target.value),
                        })
                      }
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 w-12">
                      {settings.upperBand.lineWidth}px
                    </span>
                  </div>

                  <select
                    value={settings.upperBand.lineStyle}
                    onChange={(e) =>
                      updateBandSettings("upperBand", {
                        lineStyle: e.target.value as LineStyle,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                  </select>
                </div>
              </div>

              {/* Lower Band */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Lower Band
                </h3>
                <div className="space-y-3 pl-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.lowerBand.visible}
                      onChange={(e) =>
                        updateBandSettings("lowerBand", {
                          visible: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Visible
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={settings.lowerBand.color}
                      onChange={(e) =>
                        updateBandSettings("lowerBand", {
                          color: e.target.value,
                        })
                      }
                      className="w-8 h-8 rounded border border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Color
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={settings.lowerBand.lineWidth}
                      onChange={(e) =>
                        updateBandSettings("lowerBand", {
                          lineWidth: parseInt(e.target.value),
                        })
                      }
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 w-12">
                      {settings.lowerBand.lineWidth}px
                    </span>
                  </div>

                  <select
                    value={settings.lowerBand.lineStyle}
                    onChange={(e) =>
                      updateBandSettings("lowerBand", {
                        lineStyle: e.target.value as LineStyle,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                  </select>
                </div>
              </div>

              {/* Background Fill */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Background Fill
                </h3>
                <div className="space-y-3 pl-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.backgroundFill.visible}
                      onChange={(e) =>
                        updateBackgroundFill({ visible: e.target.checked })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Visible
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.backgroundFill.opacity}
                      onChange={(e) =>
                        updateBackgroundFill({
                          opacity: parseFloat(e.target.value),
                        })
                      }
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 w-12">
                      {Math.round(settings.backgroundFill.opacity * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Reset to Defaults
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 
                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
