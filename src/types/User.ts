export interface User {
  id: string
  name: string
  email: string
  token: string
  document?: string
  phoneNumber?: string
  birthdate?: string
  genderType?: string | null
  address?: string
}
