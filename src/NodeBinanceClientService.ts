import Binance, {CandlesOptions} from "binance-api-node"
import {
    candleDataResult,
    dataType,
    symbolStatus,
    resultOrderBookObject,
    densityObject,
    Bid, allDensities, trendType, trendResult, CandleChartResult
} from "./NodeBinanceClientServiceInterfaces";

class NodeBinanceClientService {

    private binance_client

    constructor(binance_api_key: string, binance_secret_key: string) {
        this.binance_client = Binance({
            apiKey: binance_api_key,
            apiSecret: binance_secret_key,
            getTime: () => new Date().getTime()
        })
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

        const result: candleDataResult = {
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

        const result: candleDataResult = {
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
}