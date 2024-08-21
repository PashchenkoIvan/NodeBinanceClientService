import Binance, {CandleChartInterval_LT, CandleChartResult} from "binance-api-node"
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

    async getTickerCandles(symbol: string, interval:CandleChartInterval_LT = "1d", limit:number = 1) {
        const candle: CandleChartResult[] = await this.binance_client.futuresCandles({
            symbol: symbol,
            interval: interval,
            limit: limit
        })

        const result: candleDataResult = {symbol: symbol, interval: interval, limit: limit, candlesData: candle}

        return result
    }
}
