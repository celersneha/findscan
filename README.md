# FindScan - Bollinger Bands Technical Analysis

A Next.js application implementing Bollinger Bands technical indicators with a TradingView-style configuration interface.

## Features

### ✅ Bollinger Bands Implementation

- **Length**: Configurable period (default: 20)
- **Basic MA Type**: SMA support (Simple Moving Average)
- **Source**: Configurable data source (Close, Open, High, Low - default: Close)
- **StdDev Multiplier**: Configurable standard deviation multiplier (default: 2.0)
- **Offset**: Shift bands by N bars (default: 0)

### ✅ TradingView-Style Settings UI

- **Inputs Tab**: Configure all calculation parameters
- **Style Tab**: Configure visual appearance
  - Basic (Middle) Band: visibility, color, line width, line style
  - Upper Band: visibility, color, line width, line style
  - Lower Band: visibility, color, line width, line style
  - Background Fill: visibility and opacity between upper/lower bands

### ✅ Technical Implementation

- **Sample Standard Deviation**: Uses N-1 formula for consistency with trading platforms
- **Real-time Updates**: Recalculates on every setting change
- **Offset Support**: Positive values shift bands forward, negative shift backward
- **Performance Optimized**: Handles large datasets efficiently

## Project Structure

```
public/
└── screenshots/
    ├── Chart.png
    ├── Setting1.png
    └── Setting2.png

src/
├── app/
│   ├── page.tsx                 # Main page with chart display
│   ├── layout.tsx               # App layout
│   └── globals.css              # Global styles
├── components/
│   ├── Chart.tsx                # Main chart component with KLineChart
│   └── BollingerSettings.tsx    # TradingView-style settings modal
└── lib/
    ├── types.ts                 # TypeScript type definitions
    ├── utils.ts
    └── indicators/
        └── bollinger.ts         # Bollinger Bands calculation logic
        └── computeBollingerBands.ts
```

## Calculation Formulas

```
Basis (Middle Band) = SMA(source, length)
StdDev = √(Σ(source - SMA)² / (length - 1))  // Sample standard deviation
Upper Band = Basis + (StdDev Multiplier × StdDev)
Lower Band = Basis - (StdDev Multiplier × StdDev)
```

**Note**: Uses sample standard deviation (N-1) for consistency with most trading platforms.

## Data Format

The application expects OHLCV data in the following format:

```json
[
  {
    "timestamp": 1739232000000,
    "open": 97430.82,
    "high": 98478.42,
    "low": 94876.88,
    "close": 95778.2,
    "volume": 18647.76379
  }
]
```

## Quick Start

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

3. **Open browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **View Chart**: The main page displays a candlestick chart with Bollinger Bands

   ![Chart Screenshot](/public/screenshots/Chart.png)

2. **Open Settings**: Click the "Settings" button to configure Bollinger Bands

3. **Configure Inputs**:

   - Set Length (1-200)
   - Choose MA Type (SMA)
   - Select Source (Close/Open/High/Low)
   - Set StdDev Multiplier (0.1-5.0)
   - Set Offset (-50 to +50)

   ![Settings Inputs Screenshot](/public/screenshots/Setting1.png)

4. **Configure Style**:

   - Toggle visibility for each band
   - Choose colors for each band
   - Set line width (1-5px)
   - Choose line style (solid/dashed)
   - Configure background fill opacity

   ![Settings Modal Screenshot](/public/screenshots/Setting2.png)

5. **Apply Changes**: Settings update in real-time

## Key Features Implemented

### ✅ Requirements Compliance

- Length: 20 (configurable)
- Basic MA Type: SMA (with field exposed)
- Source: Close (configurable)
- StdDev Multiplier: 2 (configurable)
- Offset: 0 (configurable)

### ✅ Style Configuration

- Basic band: visibility + color + line width + line style
- Upper band: visibility + color + line width + line style
- Lower band: visibility + color + line width + line style
- Background fill: visibility + opacity

## Technology Stack

- **Framework**: Next.js 15.5.2 with TypeScript
- **Charts**: KLineCharts 10.0.0-alpha5
- **Styling**: Tailwind CSS 4
- **State Management**: React hooks (useState, useEffect)
- **Data Processing**: Custom Bollinger Bands calculations
