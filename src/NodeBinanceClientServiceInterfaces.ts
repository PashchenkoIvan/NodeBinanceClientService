import {CandleChartInterval_LT, CandleChartResult} from "binance-api-node";

export interface findAllTickersInterface {
    ticker: string,
    tickSize: number
}

export interface Bid {
    price: number;
    quantity: number;
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

export interface resultOrderBookObject {
    symbol: string,
    orderBookType: dataType,
    currentPrice: number,
    orderBook: orderBookObject
}

export interface orderBookObject {
    asks: Bid[],
    bids: Bid[]
}

export interface densityObject {
    averageDensity: number
    densities: Bid[]
}

export interface allDensities {
    asks: densityObject;
    bids: densityObject
}