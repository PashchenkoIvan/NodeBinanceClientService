# NodeBinanceClientService
This module is an extended extension of the popular [binance-api-node](https://github.com/ViewBlock/binance-api-node.git) library. It provides a set of additional tools and functions that simplify interaction with the Binance exchange and allow for deeper analysis of market data. The module is based on proven and reliable methods, ensuring the stability and accuracy of the results obtained.

# Installation
```
npm i node-binance-client-service
```

# Getting Started
To get started with this module, import it and create a client instance. API keys are optional unless you need to make authenticated requests. You can generate an API key here.
```typescript
const binanceClient = new NodeBinanceClientService({
    binance_api_key: "YOUR_API_KEY",
    binance_secret_key: "YOUR_SECRET_KEY"
})
```

# Calc functions
## calcPercentChange
This JavaScript function, calcPercentChange, calculates the percentage change between an initial value (opening price) and a final value (closing price). It is commonly used in financial applications to determine the price change of an asset over a specific period.

| Parameter     | Type    | Description                                                                 |
|---------------|---------|-----------------------------------------------------------------------------|
| `openPrice`   | number  | The starting value, such as the opening price of a stock.                   |
| `closePrice`  | number  | The ending value, such as the closing price of a stock.                     |
| `includeMinus`| boolean | A flag that determines whether to include a negative sign in the result if the percentage change is negative. |

### Usage
```typescript
const percentChange = binanceClient.calcPercentChange(openPrice, closePrice, isIncludeMinus)
```
### Return
| Type    | Description                                                                                   |
|---------|-----------------------------------------------------------------------------------------------|
| number  | The percentage change between `openPrice` and `closePrice`. The sign of the result depends on the value of the `includeMinus` flag and the direction of the change. |

## calcAllTickerDensitiesWithInputData
This JavaScript function, `calcAllTickerDensitiesWithInputData`, calculates the densities of bids and asks from the order book data. It filters out the bids and asks that meet a certain density threshold based on a coefficient.

| Parameter     | Type    | Description                                                                 |
|---------------|---------|-----------------------------------------------------------------------------|
| `inputData`   | object  | The input data containing the order book information.                       |
| `coefficient` | number  | A coefficient used to determine the density threshold for filtering bids and asks. |

### Usage
```typescript
const result = binanceClient.calcAllTickerDensitiesWithInputData(inputData, coefficient);
```
### Return
| Type         | Description                                                                                   |
|--------------|-----------------------------------------------------------------------------------------------|
| `AllDensities` | An object containing the average densities and filtered densities for both asks and bids.     |

## calcTrend
This TypeScript function, `calcTrend`, calculates the trend and percentage change based on the input candle chart data. It determines whether the trend is "Up", "Down", or "Not changed" based on the opening and closing prices.

### Parameters
| Parameter     | Type                  | Description                                                                 |
|---------------|-----------------------|-----------------------------------------------------------------------------|
| `inputData`   | `CandleChartResult[]` | An array of objects containing the candle chart data.                       |

### Usage
```typescript
const result = calcTrend(inputData);
```
### Result

| Property        | Type    | Description                                      |
|-----------------|---------|--------------------------------------------------|
| `trend`         | string  | The trend direction: "Up", "Down", or "Not changed" |
| `percentChange` | number  | The percentage change from the opening to the closing price |

# calcCorrelation

This TypeScript function, `calcCorrelation`, calculates the correlation coefficient between the closing prices of two sets of candle chart data. The correlation coefficient measures the strength and direction of the linear relationship between the two datasets.

## Parameters

| Parameter                | Type                | Description                                                                 |
|--------------------------|---------------------|-----------------------------------------------------------------------------|
| `firstTickerCandlesData` | `CandleDataResult`  | An object containing the first set of candle chart data.                    |
| `secondTickerCandlesData`| `CandleDataResult`  | An object containing the second set of candle chart data.                   |

## Usage
```typescript
const correlation = calcCorrelation(firstTickerCandlesData, secondTickerCandlesData);
```

## Result
| Type    | Description                                                                                   |
|---------|-----------------------------------------------------------------------------------------------|
| number  | The correlation coefficient between the closing prices of the two ticker candle data sets. This value ranges from -1 to 1, indicating the strength and direction of the linear relationship. |

# Interfaces

### FindAllTickersInterface

| Property  | Type   | Description           |
|-----------|--------|-----------------------|
| ticker    | string | Ticker symbol         |
| tickSize  | number | Tick size of the ticker|

### Bid

| Property  | Type   | Description           |
|-----------|--------|-----------------------|
| price     | number | Bid price             |
| quantity  | number | Bid quantity          |

### CandleDataResult

| Property      | Type                    | Description                        |
|---------------|-------------------------|------------------------------------|
| symbol        | string                  | Symbol of the asset                |
| symbolType    | DataType                | Type of the symbol (spot/futures)  |
| interval      | CandleChartInterval_LT  | Interval of the candle data        |
| limit         | number                  | Limit of the data points           |
| startTime     | number                  | Start time of the data             |
| endTime       | number                  | End time of the data               |
| candlesData   | CandleChartResult[]     | Array of candle data results       |

### CandleChartResult

| Property          | Type   | Description                        |
|-------------------|--------|------------------------------------|
| openTime          | number | Opening time of the candle         |
| open              | number | Opening price                      |
| high              | number | Highest price                      |
| low               | number | Lowest price                       |
| close             | number | Closing price                      |
| volume            | number | Volume of the asset                |
| closeTime         | number | Closing time of the candle         |
| quoteVolume       | number | Quote volume                       |
| trades            | number | Number of trades                   |
| baseAssetVolume   | number | Base asset volume                  |
| quoteAssetVolume  | number | Quote asset volume                 |

### ResultOrderBookObject

| Property       | Type            | Description                        |
|----------------|-----------------|------------------------------------|
| symbol         | string          | Symbol of the asset                |
| orderBookType  | DataType        | Type of the order book (spot/futures)|
| currentPrice   | number          | Current price of the asset         |
| orderBook      | OrderBookObject | Order book data                    |

### OrderBookObject

| Property  | Type  | Description           |
|-----------|-------|-----------------------|
| asks      | Bid[] | Array of ask bids     |
| bids      | Bid[] | Array of bid bids     |

### DensityObject

| Property        | Type  | Description           |
|-----------------|-------|-----------------------|
| averageDensity  | number| Average density       |
| densities       | Bid[] | Array of densities    |

### AllDensities

| Property  | Type          | Description           |
|-----------|---------------|-----------------------|
| asks      | DensityObject | Ask densities         |
| bids      | DensityObject | Bid densities         |

### TrendResult

| Property      | Type      | Description           |
|---------------|-----------|-----------------------|
| trend         | TrendType | Trend type            |
| percentChange | number    | Percentage change     |

### TickerCorrelation

| Property  | Type   | Description           |
|-----------|--------|-----------------------|
| symbol    | string | Symbol of the asset   |
| correlation| number| Correlation value     |

### GetCorrelationResult

| Property        | Type              | Description           |
|-----------------|-------------------|-----------------------|
| symbol          | string            | Symbol of the asset   |
| correlationArray| TickerCorrelation[]| Array of correlations |

### ApisData

| Property         | Type   | Description           |
|------------------|--------|-----------------------|
| binanceApiKey    | string | Binance API key       |
| binanceSecretKey | string | Binance secret key    |

### PumpDumpResult

| Property      | Type                    | Description                        |
|---------------|-------------------------|------------------------------------|
| symbol        | string                  | Symbol of the asset                |
| symbolType    | DataType                | Type of the symbol (spot/futures)  |
| interval      | CandleChartInterval_LT  | Interval of the candle data        |
| limit         | number                  | Limit of the data points           |
| startTime     | number                  | Start time of the data             |
| endTime       | number                  | End time of the data               |
| pumps         | CandleChartResult[]     | Array of pump candle data          |
| dumps         | CandleChartResult[]     | Array of dump candle data          |

# Types

### DataType

| Value    | Description           |
|----------|-----------------------|
| spot     | Spot market data      |
| futures  | Futures market data   |

### SymbolStatus

| Value            | Description           |
|------------------|-----------------------|
| TRADING          | Trading status        |
| SETTLING         | Settling status       |
| PENDING_TRADING  | Pending trading status|

### TrendType

| Value        | Description           |
|--------------|-----------------------|
| Up           | Upward trend          |
| Down         | Downward trend        |
| Not changed  | No change in trend    |

### PumpDump

| Value  | Description           |
|--------|-----------------------|
| PUMP   | Pump event            |
| DUMP   | Dump event            |

