import type { User } from '@/types/User'

const MOCK_USERS: User[] = [
  {
    id: '1001',
    name: 'Thiago Tester',
    email: 'user@kairos.com',
    token: 'mock-jwt-token-thiago',
    document: '123.456.789-00',
    phoneNumber: '(11) 98765-4321',
    birthdate: '25/08/1990',
    genderType: 'Masculino',
    address: 'Rua das Flores, 100 - SP',
  },
]

export default {
  getMockUser() {
    return MOCK_USERS.find((u) => u.id === '1001') || null
  },

  async login(identifier: string, password: string): Promise<User> {
    return MOCK_USERS[0]
  },

  async register(data: any): Promise<User> {
    return MOCK_USERS[0]
  },
}
