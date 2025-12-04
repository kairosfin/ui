export interface StockQuote {
  symbol: string
  shortName: string
  regularMarketPrice: number
  regularMarketChangePercent: number
  logoUrl: string
}

export interface PortfolioPosition {
  symbol: string
  quantity: number
  averagePrice: number
  currentPrice: number
}
