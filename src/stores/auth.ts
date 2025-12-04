import authService, { type User } from '@/services/auth'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)
  const error = ref('')

  const isAuthenticated = computed(() => !!token.value)

  async function login(identifier: string, pass: string) {
    isLoading.value = true
    error.value = ''
    try {
      const data = await authService.login(identifier, pass)

      // Salva no estado e no LocalStorage (para persistir F5)
      user.value = data
      token.value = data.token
      localStorage.setItem('token', data.token)

      return true // Sucesso
    } catch {
      error.value = 'E-mail ou senha incorretos'
      return false // Falha
    } finally {
      isLoading.value = false
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function register(formData: any) {
    isLoading.value = true
    try {
      // Geralmente registrar já loga o usuário ou manda confirmar email
      await authService.register(formData)
      return true
    } catch {
      error.value = 'Erro ao cadastrar'
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function updateProfile(updatedData: any) {
    if (user.value) {
      // Mescla os dados atuais com os novos
      user.value = { ...user.value, ...updatedData }
      // await api.put('/profile', updatedData)
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
  }
})
