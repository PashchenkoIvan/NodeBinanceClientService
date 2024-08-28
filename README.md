# NodeBinanceClientService
NodeBinanceClientService is Node.ts library with convenient Binance api functionality for writing trading strategies and indicators. 
The library is designed for comfortable writing of trading strategies and indicators in the Node.js environment.

# Installation
```
npm i nodebinanceclientservice
```

# Getting Started
To get started with this module, import it and create a client instance. API keys are optional unless you need to make authenticated requests. You can generate an API key here.
```TypeScript
const binanceClient = new NodeBinanceClientService({
    binance_api_key: "YOUR_API_KEY",
    binance_secret_key: "YOUR_SECRET_KEY"
})
