/**
 Compute Bollinger Bands Utility
 *
 This module provides a clean, modular utility for computing Bollinger Bands
 
 Basis (middle band) = SMA(source, length)
 StdDev = standard deviation of the last length values of source (sample standard deviation)
 Upper = Basis + (StdDev multiplier * StdDev)
 Lower = Basis - (StdDev multiplier * StdDev)
 Offset: shift the three series by offset bars on the chart
 */

export interface BollingerBandsInput {
  values: number[];
  length: number;
  stdDevMultiplier: number;
  offset?: number;
}

export interface BollingerBandsOutput {
  basis: number | null;
  upper: number | null;
  lower: number | null;
  stdDev: number | null;
}

function calculateSMAAtIndex(
  values: number[],
  index: number,
  length: number
): number | null {
  if (index < length - 1) return null;

  let sum = 0;
  for (let i = index - length + 1; i <= index; i++) {
    sum += values[i];
  }

  return sum / length;
}

function calculateStdDevAtIndex(
  values: number[],
  index: number,
  length: number,
  mean: number
): number | null {
  if (index < length - 1) return null;

  let sumSquaredDiffs = 0;
  for (let i = index - length + 1; i <= index; i++) {
    const diff = values[i] - mean;
    sumSquaredDiffs += diff * diff;
  }

  // Sample standard deviation uses N-1
  const variance = sumSquaredDiffs / (length - 1);
  return Math.sqrt(variance);
}

export function computeBollingerBandsAtIndex(
  input: BollingerBandsInput,
  index: number
): BollingerBandsOutput {
  const { values, length, stdDevMultiplier } = input;

  // Calculate basis (SMA)
  const basis = calculateSMAAtIndex(values, index, length);
  if (basis === null) {
    return { basis: null, upper: null, lower: null, stdDev: null };
  }

  // Calculate standard deviation
  const stdDev = calculateStdDevAtIndex(values, index, length, basis);
  if (stdDev === null) {
    return { basis, upper: null, lower: null, stdDev: null };
  }

  // Calculate upper and lower bands
  const upper = basis + stdDevMultiplier * stdDev;
  const lower = basis - stdDevMultiplier * stdDev;

  return { basis, upper, lower, stdDev };
}

export function computeBollingerBands(
  input: BollingerBandsInput
): BollingerBandsOutput[] {
  const { values, offset = 0 } = input;
  const results: BollingerBandsOutput[] = [];

  // Calculate for all points
  for (let i = 0; i < values.length; i++) {
    const result = computeBollingerBandsAtIndex(input, i);
    results.push(result);
  }

  // Apply offset if specified
  if (offset !== 0) {
    return applyOffset(results, offset);
  }

  return results;
}

function applyOffset(
  results: BollingerBandsOutput[],
  offset: number
): BollingerBandsOutput[] {
  if (offset === 0) return results;

  const shifted: BollingerBandsOutput[] = new Array(results.length)
    .fill(null)
    .map(() => ({
      basis: null,
      upper: null,
      lower: null,
      stdDev: null,
    }));

  for (let i = 0; i < results.length; i++) {
    const newIndex = i + offset;
    if (newIndex >= 0 && newIndex < results.length) {
      shifted[newIndex] = results[i];
    }
  }

  return shifted;
}

export function validateBollingerBandsInput(input: BollingerBandsInput): void {
  if (!Array.isArray(input.values) || input.values.length === 0) {
    throw new Error("Values array must be non-empty");
  }

  if (!Number.isInteger(input.length) || input.length < 2) {
    throw new Error("Length must be an integer >= 2");
  }

  if (
    typeof input.stdDevMultiplier !== "number" ||
    input.stdDevMultiplier <= 0
  ) {
    throw new Error("Standard deviation multiplier must be a positive number");
  }

  if (input.offset !== undefined && !Number.isInteger(input.offset)) {
    throw new Error("Offset must be an integer");
  }

  if (input.values.some((v) => typeof v !== "number" || !isFinite(v))) {
    throw new Error("All values must be finite numbers");
  }
}
