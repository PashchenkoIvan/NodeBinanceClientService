import {CandleChartInterval_LT} from "binance-api-node";

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

export type trendType =
    | "Up"
    | "Down"
    | "Not changed"

export interface candleDataResult {
    symbol: string,
    symbolType: dataType,
    interval: CandleChartInterval_LT,
    limit: number,
    startTime: number,
    endTime: number,
    candlesData: CandleChartResult[]
}

export interface CandleChartResult {
    openTime: number
    open: number
    high: number
    low: number
    close: number
    volume: number
    closeTime: number
    quoteVolume: number
    trades: number
    baseAssetVolume: number
    quoteAssetVolume: number
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

export interface trendResult {
    trend: trendType,
    percentChange: number
}