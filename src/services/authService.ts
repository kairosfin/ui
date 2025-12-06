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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async login(data: any): Promise<any> {
    console.log(data)
    return MOCK_USERS[0]
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async register(data: any): Promise<any> {
    console.log(data)
    return MOCK_USERS[0]
  },
}
