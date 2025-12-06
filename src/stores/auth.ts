import authService from '@/services/authService'
import type { User } from '@/types/User'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const user = ref<User | null>(authService.getMockUser())

  const token = ref<string | null>(user.value?.token || null)

  const isLoading = ref(false)
  const error = ref('')

  const isAuthenticated = computed(() => !!token.value)

  async function login(identifier: string, pass: string) {
    return true
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function register(formData: any) {
    isLoading.value = true
    try {
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
      user.value = { ...user.value, ...updatedData }
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
