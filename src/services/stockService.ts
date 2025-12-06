import type { ApiResponse } from '@/types/Api'
import type { Quote, Stock } from '@/types/Stock'
import { QuoteRange } from '@/types/Stock'
import api from './api'

export default {
  async search(terms: string[]): Promise<Stock[]> {
    try {
      const { data } = await api.get<ApiResponse<Stock[]>>('/v1/stocks/search', {
        params: { q: terms, limit: 20 },
        paramsSerializer: {
          serialize: (params) => {
            const searchParams = new URLSearchParams()
            Object.keys(params).forEach((key) => {
              const val = params[key]
              if (Array.isArray(val)) val.forEach((v) => searchParams.append(key, v))
              else searchParams.append(key, val)
            })
            return searchParams.toString()
          },
        },
      })

      return data.data || []
    } catch {
      return []
    }
  },

  async getHistory(ticker: string, range: QuoteRange = QuoteRange.FiveDays): Promise<Quote[]> {
    try {
      const { data } = await api.get<ApiResponse<Quote[]>>(`/v1/stocks/${ticker}/quote`, {
        params: { range },
      })
      return data.data || []
    } catch {
      return []
    }
  },
}
