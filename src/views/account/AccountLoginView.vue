<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppLogo from '@/components/icons/AppLogo.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loginType = ref('E-mail')
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const dynamicLabel = computed(() => {
  if (loginType.value === 'CPF') return 'Digite seu CPF'

  return 'Digite seu e-mail'
})

function signIn() {
  router.push('/app')
}

function goToForgotPassword() {
  router.push('/forgot-password')
}
</script>

<template>
  <AppHeader>
    <template #actionsRight>
      <div></div>
    </template>
  </AppHeader>

  <VContainer class="fill-height justify-center mb-16">
    <VSheet width="400" max-width="100%" color="transparent" class="pa-2">
      <AppLogo :height="60" :width="180" class="mx-auto mb-16" />

      <VForm @submit.prevent="signIn">
        <VSelect
          v-model="loginType"
          :items="['E-mail', 'CPF']"
          label="E-mail"
          variant="filled"
          density="compact"
          class="mb-2"
          :single-line="true"
          auto-select-first="exact"
        />
        <VTextField
          v-model="email"
          :label="dynamicLabel"
          variant="filled"
          density="compact"
          class="mb-2"
        />
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
        <VBtn color="surface" block variant="flat" @click="signIn" class="mt-4"> Acessar </VBtn>
      </VForm>

      <div class="d-flex justify-end mt-4">
        <VBtn variant="text" @click="goToForgotPassword">
          Redefinir senha
          <VIcon icon="mdi-arrow-right" end />
        </VBtn>
      </div>
    </VSheet>
  </VContainer>
</template>

<style scoped></style>
