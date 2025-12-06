<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue'
import ArrowButton from '@/components/common/ArrowButton.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const password = ref('')
const showPassword = ref(false)

function goBackLogin() {
  router.push('/login')
}
</script>

<template>
  <VContainer class="fill-height justify-center">
    <VCard width="400" max-width="100%" flat color="transparent">
      <ArrowButton title="Login" to="/login" />

      <VCardTitle class="text-center text-h5 font-weight-bold mb-15"> Definir senha </VCardTitle>

      <VForm @submit.prevent="goBackLogin">
        <VTextField
          v-model="password"
          label="Senha"
          bg-color="border"
          variant="filled"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
        />
        <VTextField
          v-model="password"
          label="Confirmar senha"
          bg-color="border"
          variant="filled"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
        />
        <AppButton text="Continuar" @click="goBackLogin" class="mt-4" />
      </VForm>
    </VCard>
  </VContainer>
</template>
