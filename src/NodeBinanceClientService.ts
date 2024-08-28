import Binance, {CandlesOptions} from "binance-api-node"
import {
    CandleDataResult,
    dataType,
    symbolStatus,
    resultOrderBookObject,
    densityObject,
    Bid,
    allDensities,
    trendType,
    trendResult,
    CandleChartResult,
    tickerCorrelation,
    getCorrelationResult,
    PumpDumpResult,
    pumpDump
} from "./NodeBinanceClientServiceInterfaces";

class NodeBinanceClientService {

    private binance_client

    constructor(options: {binance_api_key: string, binance_secret_key: string} = {binance_api_key: "", binance_secret_key: ""}) {
        this.binance_client = Binance({
            apiKey: options.binance_api_key,
            apiSecret: options.binance_secret_key,
            getTime: () => new Date().getTime()
        })
    }

    calcPercentChange (openPrice: number, closePrice: number, includeMinus: boolean) {
        if (includeMinus) {
            return ((closePrice - openPrice) / openPrice) * 100
        } else {
            return Math.abs(((closePrice - openPrice) / openPrice) * 100)
        }
    }

    async getAllFuturesTickers(symbolStatus: symbolStatus) {
        return (await this.binance_client
            .futuresExchangeInfo())
            .symbols.filter(symbol => symbol.status === symbolStatus);
    }

    async getAllSpotTickers(symbolStatus: symbolStatus) {
        return (await this.binance_client
            .exchangeInfo())
            .symbols.filter(symbol => symbol.status === symbolStatus);
    }

    async getSpotTickerCandles(options: CandlesOptions) {
        const candles: CandleChartResult[] = await this.binance_client.candles(options)

        const result: CandleDataResult = {
            symbol: options.symbol,
            symbolType: "spot",
            interval: options.interval,
            limit: options.limit,
            startTime: options.startTime,
            endTime: options.endTime,
            candlesData: candles.map(candle => ({
                openTime: Number(candle.openTime),
                open: Number(candle.open),
                high: Number(candle.high),
                low: Number(candle.low),
                close: Number(candle.close),
                volume: Number(candle.volume),
                closeTime: Number(candle.closeTime),
                quoteVolume: Number(candle.quoteVolume),
                trades: Number(candle.trades),
                baseAssetVolume: Number(candle.baseAssetVolume),
                quoteAssetVolume: Number(candle.quoteAssetVolume)
            }))
        }

        return result
    }

    async getFuturesTickerCandles(options: CandlesOptions) {
        const candles: CandleChartResult[] = await this.binance_client.futuresCandles(options)

        const result: CandleDataResult = {
            symbol: options.symbol,
            symbolType: "futures",
            interval: options.interval,
            limit: options.limit,
            startTime: options.startTime,
            endTime: options.endTime,
            candlesData: candles.map(candle => ({
                openTime: Number(candle.openTime),
                open: Number(candle.open),
                high: Number(candle.high),
                low: Number(candle.low),
                close: Number(candle.close),
                volume: Number(candle.volume),
                closeTime: Number(candle.closeTime),
                quoteVolume: Number(candle.quoteVolume),
                trades: Number(candle.trades),
                baseAssetVolume: Number(candle.baseAssetVolume),
                quoteAssetVolume: Number(candle.quoteAssetVolume)
            }))
        }

        return result
    }

    async getSpotOrderBook(symbol: string, orderBookLimit: number) {
        const currentPrice = await this.binance_client.prices({symbol: symbol})
        const spotOrderBook = await this.binance_client.book({symbol: symbol, limit: orderBookLimit})

        const resultObject: resultOrderBookObject = {
            symbol: symbol,
            orderBookType: "spot",
            currentPrice: parseFloat(currentPrice[symbol]),
            orderBook: {
                asks: spotOrderBook.asks.map(bid => ({ price: Number(bid.price), quantity: Number(bid.quantity) })),
                bids: spotOrderBook.bids.map(bid => ({ price: Number(bid.price), quantity: Number(bid.quantity) }))
            }
        }

        return resultObject
    }

    async getFuturesOrderBook(symbol: string, orderBookLimit: number) {
        const currentPrice = await this.binance_client.futuresPrices({symbol: symbol})
        const futuresOrderBook = await this.binance_client.futuresBook({symbol: symbol, limit: orderBookLimit})

        const resultObject: resultOrderBookObject = {
            symbol: symbol,
            orderBookType: "futures",
            currentPrice: parseFloat(currentPrice[symbol]),
            orderBook: {
                asks: futuresOrderBook.asks.map(bid => ({ price: Number(bid.price), quantity: Number(bid.quantity) })),
                bids: futuresOrderBook.bids.map(bid => ({ price: Number(bid.price), quantity: Number(bid.quantity) }))
            }
        }

        return resultObject
    }

    calcAllTickerDensitiesWithInputData(inputData: resultOrderBookObject, coefficient: number) {

        const asksDensities: Bid[] = []
        const bidsDensities: Bid[] = []

        const asksArray = inputData.orderBook.asks
        const bidsArray = inputData.orderBook.bids

        let asks_quantity_sum: number = 0
        asksArray.forEach(ask => {
            asks_quantity_sum += ask.quantity
        })
        const average_asks_quantity_sum = asks_quantity_sum / asksArray.length

        asksArray.forEach(ask => {
            if (ask.quantity >= (average_asks_quantity_sum * coefficient)) {
                asksDensities.push(ask)
            }
        })


        let bids_quantity_sum: number = 0
        bidsArray.forEach(bid => {
            bids_quantity_sum += bid.quantity
        })
        const average_bids_quantity_sum = bids_quantity_sum / bidsArray.length

        bidsArray.forEach(bid => {
            if (bid.quantity >= (average_bids_quantity_sum * coefficient)) {
                bidsDensities.push(bid)
            }
        })

        const result: allDensities = {
            asks: {
                averageDensity: average_asks_quantity_sum,
                densities: asksDensities
            },
            bids: {
                averageDensity: average_bids_quantity_sum,
                densities: bidsDensities
            }
        }

        return result
    }

    async getAllSpotTickerDensities(symbol: string, densityCoefficient: number, orderBookLimit: number) {
        const orderBook = await this.getSpotOrderBook(symbol, orderBookLimit)
        const allDensities = this.calcAllTickerDensitiesWithInputData(orderBook, densityCoefficient)

        return {symbol: symbol, dataType: "spot", asks: allDensities.asks, bids: allDensities.bids}
    }

    async getAllFuturesTickerDensities(symbol: string, densityCoefficient: number, orderBookLimit: number) {
        const orderBook = await this.getFuturesOrderBook(symbol, orderBookLimit)
        const allDensities = this.calcAllTickerDensitiesWithInputData(orderBook, densityCoefficient)

        return {symbol: symbol, dataType: "futures", asks: allDensities.asks, bids: allDensities.bids}
    }

    calcTrend(inputData: CandleChartResult[]):trendResult {
        const calcChange = inputData[inputData.length - 1].close - inputData[0].open
        const percentChange: number = Math.abs((inputData[inputData.length - 1].close - inputData[0].open) / inputData[0].open) * 100

        if (calcChange > 0) {
            return {trend: "Up", percentChange: percentChange}
        } else if (calcChange < 0) {
            return {trend: "Down", percentChange: percentChange}
        } else {
            return {trend: "Not changed", percentChange: percentChange}
        }
    }

    async getSpotTrend(options: CandlesOptions) {
        const candles = await this.binance_client.candles(options)
        return this.calcTrend(candles)
    }

    async getFuturesTrend(options: CandlesOptions) {
        const candles = await this.binance_client.futuresCandles(options)
        return this.calcTrend(candles)
    }

    calcCorrelation(firstTickerCandlesData: CandleDataResult, secondTickerCandlesData: CandleDataResult) {
        const n = firstTickerCandlesData.candlesData.length;
        const meanX = firstTickerCandlesData.candlesData.reduce((sum, val) => sum + val.close, 0) / n;
        const meanY = secondTickerCandlesData.candlesData.reduce((sum, val) => sum + val.close, 0) / n;

        let numerator = 0;
        let sumXDiffSquared = 0;
        let sumYDiffSquared = 0;

        for (let i = 0; i < n; i++) {
            const xDiff = firstTickerCandlesData.candlesData[i].close - meanX;
            const yDiff = secondTickerCandlesData.candlesData[i].close - meanY;
            numerator += xDiff * yDiff;
            sumXDiffSquared += xDiff ** 2;
            sumYDiffSquared += yDiff ** 2;
        }

        return numerator / Math.sqrt(sumXDiffSquared * sumYDiffSquared);
    }

    async getSpotCorrelation(tickersArrayOptions: CandlesOptions[], secondTickerOptions: CandlesOptions) {
        const maxGroupLength: number = 20;
        const tickersCandlesDataArray: CandleDataResult[] = []

        for (let i = 0; i < tickersArrayOptions.length; i += maxGroupLength) {
            const tickerGroup =
                tickersArrayOptions.length - i > maxGroupLength ?
                    tickersArrayOptions.slice(i, i + maxGroupLength) :
                    tickersArrayOptions.slice(i, tickersArrayOptions.length);

            await Promise.all(
                tickerGroup.map(async (symbol) => {
                    tickersCandlesDataArray.push(await this.getSpotTickerCandles(symbol))
                })
            );
        }

        const secondCandlesDataArray: CandleDataResult = await this.getSpotTickerCandles(secondTickerOptions);
        const tickerCorrelationArray: tickerCorrelation[] = []

        tickersCandlesDataArray.forEach(tickerData => {
            tickerCorrelationArray.push({
                symbol: tickerData.symbol,
                correlation: this.calcCorrelation(tickerData, secondCandlesDataArray)
            })
        })

        const result: getCorrelationResult = {
            symbol: secondCandlesDataArray.symbol,
            correlationArray: tickerCorrelationArray
        }

        return result
    }

    async getFuturesCorrelation(tickersArrayOptions: CandlesOptions[], secondTickerOptions: CandlesOptions) {
        const maxGroupLength: number = 20;
        const tickersCandlesDataArray: CandleDataResult[] = []

        for (let i = 0; i < tickersArrayOptions.length; i += maxGroupLength) {
            const tickerGroup =
                tickersArrayOptions.length - i > maxGroupLength ?
                    tickersArrayOptions.slice(i, i + maxGroupLength) :
                    tickersArrayOptions.slice(i, tickersArrayOptions.length);

            await Promise.all(
                tickerGroup.map(async (symbol) => {
                    tickersCandlesDataArray.push(await this.getFuturesTickerCandles(symbol))
                })
            );
        }

        const secondCandlesDataArray: CandleDataResult = await this.getFuturesTickerCandles(secondTickerOptions);
        const tickerCorrelationArray: tickerCorrelation[] = []

        tickersCandlesDataArray.forEach(tickerData => {
            tickerCorrelationArray.push({
                symbol: tickerData.symbol,
                correlation: this.calcCorrelation(tickerData, secondCandlesDataArray)
            })
        })

        const result: getCorrelationResult = {
            symbol: secondCandlesDataArray.symbol,
            correlationArray: tickerCorrelationArray
        }

        return result
    }

    calcPumpsDumps (candleData: CandleDataResult, coefficient: number): PumpDumpResult {
        const result: PumpDumpResult = {
            symbol: candleData.symbol,
            symbolType: candleData.symbolType,
            interval: candleData.interval,
            limit: candleData.limit,
            startTime: candleData.startTime,
            endTime: candleData.endTime,
            pumps: [],
            dumps: []
        }

        let percentsSum: number = 0
        candleData.candlesData.forEach(candle => {
            percentsSum += this.calcPercentChange(candle.open, candle.close, false)
        })

        const averageChange = percentsSum / candleData.candlesData.length

        candleData.candlesData.forEach(candle => {
            if (this.calcPercentChange(candle.open, candle.close, false) >= averageChange * coefficient) {
                if (candle.open < candle.close) result.pumps.push(candle)
                else result.dumps.push(candle)
            }
        })

        return result
    }

    async getSpotPumpsDumps (tickerOption: CandlesOptions, coefficient: number) {
        const tickerCandles = await this.getSpotTickerCandles(tickerOption)
        return this.calcPumpsDumps(tickerCandles, coefficient)
    }

    async getFuturesPumpsDumps (tickerOption: CandlesOptions, coefficient: number) {
        const tickerCandles = await this.getFuturesTickerCandles(tickerOption)
        return this.calcPumpsDumps(tickerCandles, coefficient)
    }
}

module.exports(NodeBinanceClientService)
