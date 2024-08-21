import Binance from "binance-api-node"
import {dataType, symbolStatus} from "./NodeBinanceClientServiceInterfaces";

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
}