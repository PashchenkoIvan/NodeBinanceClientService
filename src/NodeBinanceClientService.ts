import Binance from "binance-api-node"

class NodeBinanceClientService {
    private binance_api_key: string
    private binance_secret_key: string

    constructor(binance_api_key: string, binance_secret_key: string) {
        this.binance_api_key = binance_api_key
        this.binance_secret_key = binance_secret_key
    }

    private client = Binance({
        apiKey: this.binance_api_key,
        apiSecret: this.binance_secret_key,
        getTime: () => new Date().getTime()
    })
}

module.exports = NodeBinanceClientService