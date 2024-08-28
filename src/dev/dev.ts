// import {CandleChartResult, CandleDataResult, pumpDump, PumpDumpResult} from "../NodeBinanceClientServiceInterfaces";
// import {CandlesOptions} from "binance-api-node";
//
// calcInclinedLine (candles: CandleDataResult, pumpsDumps: PumpDumpResult) {
//     const lastPump = pumpsDumps.pumps[pumpsDumps.pumps.length - 1]
//     const lastDumb = pumpsDumps.dumps[pumpsDumps.dumps.length - 1]
//
//     console.log(lastPump)
//     console.log(lastDumb)
//
//     let firstPoint: CandleChartResult = {
//         openTime: 0,
//         open: 0,
//         high: 0,
//         low: 0,
//         close: 0,
//         volume: 0,
//         closeTime: 0,
//         quoteVolume: 0,
//         trades: 0,
//         baseAssetVolume: 0,
//         quoteAssetVolume: 0
//     }
//
//     let secondPoint: CandleChartResult = {
//         openTime: 0,
//         open: 0,
//         high: 0,
//         low: 0,
//         close: 0,
//         volume: 0,
//         closeTime: 0,
//         quoteVolume: 0,
//         trades: 0,
//         baseAssetVolume: 0,
//         quoteAssetVolume: 0
//     }
//     let pumpOrDump: pumpDump
//
//     if (lastPump.closeTime > lastDumb.closeTime) {
//         const filteredCandlesArray = candles.candlesData.filter(candle => candle.closeTime >= lastPump.closeTime)
//
//         filteredCandlesArray.forEach(candle => {
//             console.log(firstPoint)
//             if (candle.high > firstPoint.high) firstPoint = candle
//         })
//
//         const secondPointCandleArray = filteredCandlesArray.filter(candle => candle.closeTime > firstPoint.closeTime)
//
//         secondPointCandleArray.forEach(candle => {
//             if (candle.high > secondPoint.high) secondPoint = candle
//         })
//
//         pumpOrDump = "PUMP"
//
//     } else {
//         const filteredCandlesArray = candles.candlesData.filter(candle => candle.closeTime >= lastDumb.closeTime)
//
//         filteredCandlesArray.forEach(candle => {
//             console.log(firstPoint)
//             if (candle.low < firstPoint.low) firstPoint = candle
//         })
//
//         const secondPointCandleArray = filteredCandlesArray.filter(candle => candle.closeTime > firstPoint.closeTime)
//
//         secondPointCandleArray.forEach(candle => {
//             if (candle.low < secondPoint.low) secondPoint = candle
//         })
//
//         pumpOrDump = "DUMP"
//     }
//
//     return {
//         symbol: candles.symbol,
//         symbolType: candles.symbolType,
//         interval: candles.interval,
//         limit: candles.limit,
//         startTime: candles.startTime,
//         endTime: candles.endTime,
//         pumpOrDump: pumpOrDump,
//         firstCandle: firstPoint,
//         secondCandle: secondPoint
//     }
// }
//
// async getFuturesInclinedLine (tickerOption: CandlesOptions, touchesNumber: number, pumpCoefficient: number) {
//     const candles = await this.getFuturesTickerCandles(tickerOption)
//     const pumpsDumps = this.calcPumpsDumps(candles, pumpCoefficient)
//
//     return this.calcInclinedLine(candles, pumpsDumps)
// }