export enum QuoteRange {
  Day = 'Day',
  FiveDays = 'FiveDays',
  Week = 'Week',
  Month = 'Month',
  Quarter = 'Quarter',
  Semester = 'Semester',
  Year = 'Year',
  TwoYears = 'TwoYears',
  FiveYears = 'FiveYears',
  Decade = 'Decade',
  YearToDate = 'YearToDate',
  Max = 'Max',
}

export interface Stock {
  ticker: string
  name: string
  price: number
  dailyYield: number
  marketCap: number
  tradeVolume: number
  logo: string
  sector: string
  updatedAt: string
}

export interface Quote {
  date: string
  close: number
  closeWithEvents: number
}
