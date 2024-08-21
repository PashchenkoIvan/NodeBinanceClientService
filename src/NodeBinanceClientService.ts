import Binance from "binance-api-node"

class NodeBinanceClientService {

    private binance_client: Binance

    constructor(binance_api_key: string, binance_secret_key: string) {
        this.binance_client = Binance({
            apiKey: binance_api_key,
            apiSecret: binance_secret_key,
            getTime: () => new Date().getTime()
        })
    }
}

module.exports = NodeBinanceClientService