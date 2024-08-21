import Binance, {CandleChartResult, CandlesOptions} from "binance-api-node"
import {candleDataResult, dataType, symbolStatus} from "./NodeBinanceClientServiceInterfaces";

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
}
