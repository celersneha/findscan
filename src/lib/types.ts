// OHLCV Data Structure
export interface OHLCVData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// MA Types
export type MAType = "SMA";

// Source Types
export type SourceType = "close" | "open" | "high" | "low";

// Line Styles
export type LineStyle = "solid" | "dashed";

// Bollinger Bands Settings
export interface BollingerBandsSettings {
  // Input settings
  length: number;
  basicMAType: MAType;
  source: SourceType;
  stdDevMultiplier: number;
  offset: number;

  // Style settings
  basicBand: {
    visible: boolean;
    color: string;
    lineWidth: number;
    lineStyle: LineStyle;
  };
  upperBand: {
    visible: boolean;
    color: string;
    lineWidth: number;
    lineStyle: LineStyle;
  };
  lowerBand: {
    visible: boolean;
    color: string;
    lineWidth: number;
    lineStyle: LineStyle;
  };
  backgroundFill: {
    visible: boolean;
    opacity: number;
  };
}

// Bollinger Bands Data Point
export interface BollingerBandsData {
  timestamp: number;
  basis: number;
  upper: number;
  lower: number;
}

// Chart Data Point for KLineChart
export interface ChartDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Default Bollinger Bands Settings
export const DEFAULT_BOLLINGER_SETTINGS: BollingerBandsSettings = {
  length: 20,
  basicMAType: "SMA",
  source: "close",
  stdDevMultiplier: 2,
  offset: 0,
  basicBand: {
    visible: true,
    color: "#2196F3",
    lineWidth: 1,
    lineStyle: "solid",
  },
  upperBand: {
    visible: true,
    color: "#2196F3",
    lineWidth: 1,
    lineStyle: "solid",
  },
  lowerBand: {
    visible: true,
    color: "#2196F3",
    lineWidth: 1,
    lineStyle: "solid",
  },
  backgroundFill: {
    visible: true,
    opacity: 0.1,
  },
};
