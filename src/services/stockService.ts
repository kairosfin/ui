import type { ApiResponse } from '@/types/Api'
import type { Quote, Stock } from '@/types/Stock'
import { QuoteRange } from '@/types/Stock'
import api from './api'

const stockService = {
  /**
   * 1. ENDPOINT REAL: Pesquisa de Tickers
   */
  async search(terms: string[]): Promise<Stock[]> {
    try {
      console.log('🔍 Buscando na API:', terms)

      // Faz a requisição
      // Usamos 'any' para ter flexibilidade no tratamento da resposta
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await api.get<any>('/v1/stocks/search', {
        params: { q: terms, limit: 20 },
        // Garante formato ?q=VALE3&q=PETR4 para o .NET
        paramsSerializer: {
          serialize: (params) => {
            const searchParams = new URLSearchParams()
            for (const key in params) {
              const val = params[key]
              if (Array.isArray(val)) {
                val.forEach((v) => searchParams.append(key, v))
              } else {
                searchParams.append(key, val)
              }
            }
            return searchParams.toString()
          },
        },
      })

      console.log('📡 Resposta Bruta Axios:', response)

      // TENTATIVA 1: Padrão da sua API (response.data é o corpo, .data é o array)
      if (response.data && Array.isArray(response.data.data)) {
        console.log('✅ Dados encontrados em response.data.data')
        return response.data.data
      }

      // TENTATIVA 2: Se sua API retornar o array direto
      if (Array.isArray(response.data)) {
        console.log('✅ Dados encontrados em response.data')
        return response.data
      }

      // TENTATIVA 3: Se houver algum interceptor removendo o wrapper do axios
      if (response.data && Array.isArray(response.data)) {
        return response.data
      }

      // TENTATIVA 4: Algumas configs do axios retornam 'data' direto no response
      if (Array.isArray(response)) {
        return response
      }

      console.warn('⚠️ Nenhum array encontrado na resposta. Estrutura:', response)
      return []
    } catch (error) {
      console.error('❌ Erro no service stockService.search:', error)
      return []
    }
  },

  /**
   * 2. ENDPOINT REAL: Histórico
   */
  async getHistory(ticker: string, range: QuoteRange = QuoteRange.FiveDays): Promise<Quote[]> {
    try {
      const { data } = await api.get<ApiResponse<Quote[]>>(`/v1/stocks/${ticker}/quote`, {
        params: { range },
      })
      return data.data || []
    } catch (error) {
      console.error(`Erro ao buscar histórico de ${ticker}:`, error)
      return []
    }
  },
}

export default stockService
