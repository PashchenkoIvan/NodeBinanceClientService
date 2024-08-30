import {CandleChartInterval_LT} from "binance-api-node";

export interface FindAllTickersInterface {
    ticker: string,
    tickSize: number
}

export interface Bid {
    price: number;
    quantity: number;
}

export type DataType =
    | "spot"
    | "futures"

export type SymbolStatus =
    | "TRADING"
    | "SETTLING"
    | "PENDING_TRADING"

export type TrendType =
    | "Up"
    | "Down"
    | "Not changed"

export type PumpDump =
    | "PUMP"
    | "DUMP"

export interface CandleDataResult {
    symbol: string,
    symbolType: DataType,
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

export interface ResultOrderBookObject {
    symbol: string,
    orderBookType: DataType,
    currentPrice: number,
    orderBook: OrderBookObject
}

export interface OrderBookObject {
    asks: Bid[],
    bids: Bid[]
}

export interface DensityObject {
    averageDensity: number
    densities: Bid[]
}

export interface AllDensities {
    asks: DensityObject;
    bids: DensityObject
}

export interface TrendResult {
    trend: TrendType,
    percentChange: number
}

export interface TickerCorrelation {
    symbol: string,
    correlation: number
}

export interface GetCorrelationResult {
    symbol: string,
    correlationArray: TickerCorrelation[]
}

export interface ApisData {
    binanceApiKey: string,
    binanceSecretKey: string
}

export interface PumpDumpResult {
    symbol: string,
    symbolType: DataType,
    interval: CandleChartInterval_LT,
    limit: number,
    startTime: number,
    endTime: number,
    pumps: CandleChartResult[],
    dumps: CandleChartResult[]
}