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

## calcCorrelation

This TypeScript function, `calcCorrelation`, calculates the correlation coefficient between the closing prices of two sets of candle chart data. The correlation coefficient measures the strength and direction of the linear relationship between the two datasets.

### Parameters

| Parameter                | Type                | Description                                                                 |
|--------------------------|---------------------|-----------------------------------------------------------------------------|
| `firstTickerCandlesData` | `CandleDataResult`  | An object containing the first set of candle chart data.                    |
| `secondTickerCandlesData`| `CandleDataResult`  | An object containing the second set of candle chart data.                   |

### Usage
```typescript
const correlation = calcCorrelation(firstTickerCandlesData, secondTickerCandlesData);
```

### Result
| Type    | Description                                                                                   |
|---------|-----------------------------------------------------------------------------------------------|
| number  | The correlation coefficient between the closing prices of the two ticker candle data sets. This value ranges from -1 to 1, indicating the strength and direction of the linear relationship. |

## calcPumpsDumps
This TypeScript function, calcPumpsDumps, identifies significant price movements (pumps and dumps) in a set of candle chart data based on a specified coefficient. It calculates the average percentage change in price and then determines which candles exceed this average change by the given coefficient.

### Parameters
| Parameter     | Type             | Description                                                                               |
|---------------|------------------|-------------------------------------------------------------------------------------------|
| `candleData`  | CandleDataResult | An object containing the candle chart data, including symbol, interval, and candles data. |
| `coefficient` | number           | A multiplier used to determine the threshold for significant price changes.               |

### Usage
```typescript
const result = calcPumpsDumps(candleData, coefficient);
```

### Result
| Type            | Description                                                                                                                                |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| PumpDumpResult  | An object containing the symbol, symbol type, interval, limit, start time, end time, and arrays of candles identified as pumps and dumps.  |


# (Async) GET functions

## getAllFuturesTickers
This asynchronous TypeScript function, getAllFuturesTickers, retrieves all futures tickers from the Binance API and filters them based on their status.

### Parameters
| Parameter     | Type             | Description                                                                              |
|---------------|------------------|------------------------------------------------------------------------------------------|
| `symbolStatus`  | SymbolStatus | The status of the symbols to filter by (e.g., TRADING, BREAK, etc.).|

### Usage
```typescript
const tickers = await getAllFuturesTickers('TRADING');
```

### Result
| Type  | Description                                                                                                                                |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Array | An array of symbols that match the specified status.  |

## getAllSpotTickers
This asynchronous TypeScript function, getAllSpotTickers, retrieves all spot tickers from the Binance API and filters them based on their status.

### Parameters
| Parameter     | Type             | Description                                                                              |
|---------------|------------------|------------------------------------------------------------------------------------------|
| `symbolStatus`  | SymbolStatus | The status of the symbols to filter by (e.g., TRADING, BREAK, etc.).|

### Usage
```typescript
const tickers = await getAllSpotTickers('TRADING');
```

### Result
| Type  | Description                                                                                                                                |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Array | An array of symbols that match the specified status.  |

## getSpotTickerCandles
This asynchronous TypeScript function, getSpotTickerCandles, retrieves candle chart data for a specified spot ticker from the Binance API and formats it into a structured result.

### Parameters
| Parameter     | Type             | Description                                                                              |
|---------------|------------------|------------------------------------------------------------------------------------------|
| `options`  | CandlesOptions | An object containing options for retrieving the candle data, such as symbol, interval, limit, start time, and end time.|

### Usage
```typescript
const options = {
    symbol: "BTCUSDT",
    interval: "1h",
    limit: 100,
    startTime: 1622505600000,
    endTime: 1622592000000
};
const result = await getSpotTickerCandles(options);
```

### Result
| Type  | Description                                                                                                                                |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------|
| CandleDataResult | An object containing the symbol, symbol type, interval, limit, start time, end time, and an array of formatted candle data.  |

## getFuturesTickerCandles
This asynchronous TypeScript function, getFuturesTickerCandles, retrieves candle chart data for a specified futures ticker from the Binance API and formats it into a structured result.

### Parameters
| Parameter     | Type             | Description                                                                              |
|---------------|------------------|------------------------------------------------------------------------------------------|
| `options`  | CandlesOptions | An object containing options for retrieving the candle data, such as symbol, interval, limit, start time, and end time.|

### Usage
```typescript
const options = {
    symbol: "BTCUSDT",
    interval: "1h",
    limit: 100,
    startTime: 1622505600000,
    endTime: 1622592000000
};
const result = await getFuturesTickerCandles(options);
```

### Result
| Type  | Description                                                                                                                                |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------|
| CandleDataResult | An object containing the symbol, symbol type, interval, limit, start time, end time, and an array of formatted candle data.  |

## getSpotOrderBook
This asynchronous TypeScript function, getSpotOrderBook, retrieves the current price and order book for a specified spot ticker from the Binance API and formats it into a structured result.

### Parameters
| Parameter     | Type   | Description                                                                              |
|---------------|--------|------------------------------------------------------------------------------------------|
| `symbol`  | string | The symbol for which to retrieve the order book (e.g., BTCUSDT).|
| `orderBookLimit`  | number | The limit on the number of orders to retrieve for the order book.|

### Usage
```typescript
const orderBook = await getSpotOrderBook('BTCUSDT', 100);
```

### Result
| Type  | Description                                                                                                                               |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------|
| ResultOrderBookObject | An object containing the symbol, order book type, current price, and the order book data (asks and bids).|

## getFuturesOrderBook
This asynchronous TypeScript function, getFuturesOrderBook, retrieves the current price and order book for a specified futures ticker from the Binance API and formats it into a structured result.

### Parameters
| Parameter     | Type   | Description                                                                              |
|---------------|--------|------------------------------------------------------------------------------------------|
| `symbol`  | string | The symbol for which to retrieve the order book (e.g., BTCUSDT).|
| `orderBookLimit`  | number | The limit on the number of orders to retrieve for the order book.|

### Usage
```typescript
const orderBook = await getFuturesOrderBook('BTCUSDT', 100);
```

### Result
| Type  | Description                                                                                                                               |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------|
| ResultOrderBookObject | An object containing the symbol, order book type, current price, and the order book data (asks and bids).|

## getAllSpotTickerDensities
This asynchronous TypeScript function, getAllSpotTickerDensities, retrieves the order book for a specified spot ticker, calculates the density of orders, and returns the results.

### Parameters
| Parameter     | Type   | Description                                                                              |
|---------------|--------|------------------------------------------------------------------------------------------|
| `symbol`  | string | The symbol for which to retrieve the order book (e.g., BTCUSDT).|
| `densityCoefficient`  | number | A coefficient used to calculate the density of orders.|
| `orderBookLimit`  | number | The limit on the number of orders to retrieve for the order book.|

### Usage
```typescript
const densities = await getAllSpotTickerDensities('BTCUSDT', 1.5, 100);
```

### Result
| Type  | Description                                                                                                                               |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------|
| Object | An object containing the symbol, data type (spot), and arrays of calculated densities for asks and bids.|

## getAllFuturesTickerDensities
This asynchronous TypeScript function, getAllFuturesTickerDensities, retrieves the order book for a specified futures ticker, calculates the density of orders, and returns the results.

### Parameters
| Parameter     | Type   | Description                                                                              |
|---------------|--------|------------------------------------------------------------------------------------------|
| `symbol`  | string | The symbol for which to retrieve the order book (e.g., BTCUSDT).|
| `densityCoefficient`  | number | A coefficient used to calculate the density of orders.|
| `orderBookLimit`  | number | The limit on the number of orders to retrieve for the order book.|

### Usage
```typescript
const densities = await getAllFuturesTickerDensities('BTCUSDT', 1.5, 100);
```

### Result
| Type  | Description                                                                                                                               |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------|
| Object | An object containing the symbol, data type (futures), and arrays of calculated densities for asks and bids.|


## getSpotTrend
This asynchronous TypeScript function, getSpotTrend, retrieves candle chart data for a specified spot ticker from the Binance API and calculates the trend based on the retrieved data.

### Parameters
| Parameter     | Type   | Description                                                                              |
|---------------|--------|------------------------------------------------------------------------------------------|
| `options`  | CandlesOptions | An object containing options for retrieving the candle data, such as symbol, interval, limit, start time, and end time.|

### Usage
```typescript
const options = {
    symbol: "BTCUSDT",
    interval: "1h",
    limit: 100,
    startTime: 1622505600000,
    endTime: 1622592000000
};
const trend = await getSpotTrend(options);
```

### Result
| Type  | Description                                                                                                                               |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------|
| TrendResult | The result of the trend calculation based on the candle data.|

## getFuturesTrend
This asynchronous TypeScript function, getFuturesTrend, retrieves candle chart data for a specified futures ticker from the Binance API and calculates the trend based on the retrieved data.

### Parameters
| Parameter     | Type   | Description                                                                              |
|---------------|--------|------------------------------------------------------------------------------------------|
| `options`  | CandlesOptions | An object containing options for retrieving the candle data, such as symbol, interval, limit, start time, and end time.|

### Usage
```typescript
const options = {
    symbol: "BTCUSDT",
    interval: "1h",
    limit: 100,
    startTime: 1622505600000,
    endTime: 1622592000000
};
const trend = await getFuturesTrend(options);
```

### Result
| Type  | Description                                                                                                                               |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------|
| TrendResult | The result of the trend calculation based on the candle data.|

## getSpotCorrelation
This asynchronous TypeScript function, getSpotCorrelation, retrieves candle chart data for multiple spot tickers from the Binance API, calculates the correlation between each ticker and a specified second ticker, and returns the results.

### Parameters
| Parameter     | Type           | Description                                                                              |
|---------------|----------------|------------------------------------------------------------------------------------------|
| `tickersArrayOptions`  | CandlesOptions[] | An array of options for retrieving the candle data for multiple tickers.|
| `secondTickerOptions`  | CandlesOptions | Options for retrieving the candle data for the second ticker.|

### Usage
```typescript
const tickersArrayOptions = [
    { symbol: "BTCUSDT", interval: "1h", limit: 100, startTime: 1622505600000, endTime: 1622592000000 },
    // more options...
];
const secondTickerOptions = { symbol: "ETHUSDT", interval: "1h", limit: 100, startTime: 1622505600000, endTime: 1622592000000 };
const correlationResult = await getSpotCorrelation(tickersArrayOptions, secondTickerOptions);
```

### Result
| Type  | Description                                                                                                                               |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------|
| GetCorrelationResult | An object containing the symbol of the second ticker and an array of correlation results for each ticker.|

## getFuturesCorrelation
This asynchronous TypeScript function, getFuturesCorrelation, retrieves candle chart data for multiple futures tickers from the Binance API, calculates the correlation between each ticker and a specified second ticker, and returns the results.

### Parameters
| Parameter     | Type           | Description                                                                              |
|---------------|----------------|------------------------------------------------------------------------------------------|
| `tickersArrayOptions`  | CandlesOptions[] | An array of options for retrieving the candle data for multiple tickers.|
| `secondTickerOptions`  | CandlesOptions | Options for retrieving the candle data for the second ticker.|

### Usage
```typescript
const tickersArrayOptions = [
    { symbol: "BTCUSDT", interval: "1h", limit: 100, startTime: 1622505600000, endTime: 1622592000000 },
    // more options...
];
const secondTickerOptions = { symbol: "ETHUSDT", interval: "1h", limit: 100, startTime: 1622505600000, endTime: 1622592000000 };
const correlationResult = await getFuturesCorrelation(tickersArrayOptions, secondTickerOptions);
```

### Result
| Type  | Description                                                                                                                               |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------|
| GetCorrelationResult | An object containing the symbol of the second ticker and an array of correlation results for each ticker.|

## getSpotPumpsDumps
This asynchronous TypeScript function, getSpotPumpsDumps, retrieves candle chart data for a specified spot ticker from the Binance API, calculates significant price movements (pumps and dumps) based on a specified coefficient, and returns the results.

### Parameters
| Parameter     | Type           | Description                                                                              |
|---------------|----------------|------------------------------------------------------------------------------------------|
| `tickerOption`  | CandlesOptions | Options for retrieving the candle data, such as symbol, interval, limit, start time, and end time.|
| `coefficient`  | number | A multiplier used to determine the threshold for significant price changes.|

### Usage
```typescript
const tickerOption = {
    symbol: "BTCUSDT",
    interval: "1h",
    limit: 100,
    startTime: 1622505600000,
    endTime: 1622592000000
};
const coefficient = 1.5;
const pumpsDumps = await getSpotPumpsDumps(tickerOption, coefficient);
```

### Result
| Type  | Description                                                                                                                               |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------|
| PumpDumpResult | An object containing the symbol, symbol type, interval, limit, start time, end time, and arrays of candles identified as pumps and dumps.|

## getFuturesPumpsDumps
This asynchronous TypeScript function, getFuturesPumpsDumps, retrieves candle chart data for a specified futures ticker from the Binance API, calculates significant price movements (pumps and dumps) based on a specified coefficient, and returns the results.
### Parameters
| Parameter     | Type           | Description                                                                              |
|---------------|----------------|------------------------------------------------------------------------------------------|
| `tickerOption`  | CandlesOptions | Options for retrieving the candle data, such as symbol, interval, limit, start time, and end time.|
| `coefficient`  | number | A multiplier used to determine the threshold for significant price changes.|

### Usage
```typescript
const tickerOption = {
    symbol: "BTCUSDT",
    interval: "1h",
    limit: 100,
    startTime: 1622505600000,
    endTime: 1622592000000
};
const coefficient = 1.5;
const pumpsDumps = await getFuturesPumpsDumps(tickerOption, coefficient);
```

### Result
| Type  | Description                                                                                                                               |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------|
| PumpDumpResult | An object containing the symbol, symbol type, interval, limit, start time, end time, and arrays of candles identified as pumps and dumps.|

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

