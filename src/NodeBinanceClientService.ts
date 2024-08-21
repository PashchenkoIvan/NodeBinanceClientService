import Binance, {CandleChartResult, CandlesOptions} from "binance-api-node"
import {
    candleDataResult,
    dataType,
    symbolStatus,
    resultOrderBookObject,
    densityObject,
    Bid, allDensities
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
        const candle: CandleChartResult[] = await this.binance_client.candles(options)

        const result: candleDataResult = {
            symbol: options.symbol,
            symbolType: "spot",
            interval: options.interval,
            limit: options.limit,
            startTime: options.startTime,
            endTime: options.endTime,
            candlesData: candle
        }

        return result
    }

    async getFuturesTickerCandles(options: CandlesOptions) {
        const candle: CandleChartResult[] = await this.binance_client.futuresCandles(options)

        const result: candleDataResult = {
            symbol: options.symbol,
            symbolType: "futures",
            interval: options.interval,
            limit: options.limit,
            startTime: options.startTime,
            endTime: options.endTime,
            candlesData: candle
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
}