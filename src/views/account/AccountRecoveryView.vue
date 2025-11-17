<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
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
  <AppHeader />

  <VContainer class="fill-height justify-center mb-16">
    <VSheet width="400" max-width="100%" color="transparent" class="pa-2">
      <VCardTitle class="text-center text-h5 font-weight-bold mb-15"> Redefinir senha </VCardTitle>

      <VForm @submit.prevent="goBackLogin">
        <VTextField
          v-model="password"
          label="Senha"
          variant="filled"
          density="compact"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
          class="mb-2"
        />
        <VTextField
          v-model="password"
          label="Confirmar senha"
          variant="filled"
          density="compact"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
          class="mb-2"
        />
        <VBtn color="surface" block variant="flat" @click="goBackLogin" class="mt-4">
          Continuar
        </VBtn>
      </VForm>
    </VSheet>
  </VContainer>
</template>

<style scoped></style>
