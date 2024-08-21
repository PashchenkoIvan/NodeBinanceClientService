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