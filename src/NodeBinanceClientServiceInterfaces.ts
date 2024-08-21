import {CandleChartInterval_LT, CandleChartResult} from "binance-api-node";

export interface findAllTickersInterface {
    ticker: string,
    tickSize: number
}

export type dataType =
    | "spot"
    | "futures"

export type symbolStatus =
    | "TRADING"
    | "SETTLING"
    | "PENDING_TRADING"

export interface candleDataResult {
    symbol: string,
    symbolType: dataType,
    interval: CandleChartInterval_LT,
    limit: number,
    startTime: number,
    endTime: number,
    candlesData: CandleChartResult[]
}