import type { User } from '@/types/User'

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

export default {
  async login(identifier: string, password: string): Promise<User> {
    await delay()

    if (password === '123456') {
      return {
        id: '1',
        name: 'Usuário Kairos',
        email: identifier.includes('@') ? identifier : 'user@kairos.com',
        token: 'mock-jwt-token-xyz',
      }
    }
    throw new Error('Credenciais inválidas')
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async register(data: any): Promise<User> {
    await delay(1500)
    return {
      id: '2',
      name: data.name,
      email: data.email,
      token: 'mock-jwt-token-new-user',
    }
  },
}
