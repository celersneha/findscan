import {
  BollingerBandsSettings,
  BollingerBandsData,
  OHLCVData,
} from "../types";
import {
  computeBollingerBands,
  validateBollingerBandsInput,
  type BollingerBandsInput,
} from "./computeBollingerBands";

/**
 * Calculate Bollinger Bands using the modular computeBollingerBands utility
 * @param ohlcvData Array of OHLCV data points
 * @param settings Bollinger Bands configuration
 * @returns Array of Bollinger Bands data points
 */
export function calculateBollingerBands(
  ohlcvData: OHLCVData[],
  settings: BollingerBandsSettings
): BollingerBandsData[] {
  if (ohlcvData.length === 0) return [];

  // Extract source data based on settings
  const sourceValues = ohlcvData.map((candle) =>
    getSourceValue(candle, settings.source)
  );

  // Prepare input for the compute utility
  const input: BollingerBandsInput = {
    values: sourceValues,
    length: settings.length,
    stdDevMultiplier: settings.stdDevMultiplier,
    offset: settings.offset,
  };

  // Validate input parameters
  try {
    validateBollingerBandsInput(input);
  } catch (error) {
    console.error("Invalid Bollinger Bands parameters:", error);
    return [];
  }

  // Compute Bollinger Bands
  const bollingerResults = computeBollingerBands(input);

  // Convert to BollingerBandsData format
  const result: BollingerBandsData[] = [];
  for (let i = 0; i < ohlcvData.length; i++) {
    const bollingerResult = bollingerResults[i];

    // Only include data points where all values are available
    if (
      bollingerResult.basis !== null &&
      bollingerResult.upper !== null &&
      bollingerResult.lower !== null
    ) {
      result.push({
        timestamp: ohlcvData[i].timestamp,
        basis: bollingerResult.basis,
        upper: bollingerResult.upper,
        lower: bollingerResult.lower,
      });
    }
  }

  return result;
}

/**
 * Get the source value from OHLCV data
 * @param candle OHLCV data point
 * @param source Source type
 * @returns Source value
 */
export function getSourceValue(candle: OHLCVData, source: string): number {
  switch (source) {
    case "open":
      return candle.open;
    case "high":
      return candle.high;
    case "low":
      return candle.low;
    case "close":
    default:
      return candle.close;
  }
}
