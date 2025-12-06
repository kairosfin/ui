<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue'
import AppLogo from '@/components/common/AppLogo.vue'
import ArrowButton from '@/components/common/ArrowButton.vue'
import { useAuthStore } from '@/stores/auth'
import { masks } from '@/utils/masks'
import { rules } from '@/utils/rules'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref()
const identifierRef = ref()

const loginType = ref('E-mail')
const identifier = ref('')
const password = ref('')
const showPassword = ref(false)

const loginOptions = ['E-mail', 'CPF', 'Telefone', 'Número de Conta']

const dynamicLabel = computed(() => {
  switch (loginType.value) {
    case 'CPF':
      return 'Digite seu CPF'
    case 'Telefone':
      return 'Seu celular com DDD'
    case 'Número de Conta':
      return 'Número da conta (sem dígito)'
    default:
      return 'Digite seu e-mail'
  }
})

const dynamicRules = computed(() => {
  switch (loginType.value) {
    case 'CPF':
      return [rules.required, rules.cpf]
    case 'Telefone':
      return [rules.required, rules.phone]
    case 'E-mail':
      return [rules.required, rules.email]
    default:
      return [rules.required]
  }
})

const dynamicMaxLength = computed(() => {
  switch (loginType.value) {
    case 'CPF':
      return 14
    case 'Telefone':
      return 15
    case 'Número de Conta':
      return 10
    default:
      return undefined
  }
})

const dynamicInputMode = computed(() => {
  return loginType.value === 'E-mail' ? 'email' : 'numeric'
})

function handleInput(event: Event) {
  const input = event.target as HTMLInputElement
  const val = input.value

  if (loginType.value === 'CPF') {
    identifier.value = masks.cpf(val)
  } else if (loginType.value === 'Telefone') {
    identifier.value = masks.phone(val)
  } else if (loginType.value === 'Número de Conta') {
    identifier.value = val.replace(/\D/g, '')
  } else {
    identifier.value = val
  }
}

watch(loginType, () => {
  identifier.value = ''
  if (formRef.value) formRef.value.resetValidation()
})

// MUDANÇA CRÍTICA: Bypass da autenticação
async function signIn() {
  const { valid } = await formRef.value.validate()
  if (valid) {
    // 1. Removido: const success = await authStore.login(...)
    // 2. A navegação acontece direto se a validação do formulário for válida.
    router.push('/app')
  }
}

function goToForgotPassword() {
  router.push({
    path: '/forgot-password',
    query: { type: loginType.value, identifier: identifier.value },
  })
}
</script>

<template>
  <VContainer class="fill-height justify-center mb-16">
    <VCard
      width="400"
      max-width="100%"
      flat
      color="transparent"
      role="region"
      aria-label="Formulário de acesso"
    >
      <AppLogo :height="60" :width="180" class="mx-auto mb-16" />

      <VAlert
        v-if="authStore.error"
        color="error"
        variant="tonal"
        class="mb-4"
        density="compact"
        role="alert"
        aria-live="assertive"
      >
        {{ authStore.error }}
      </VAlert>

      <VForm ref="formRef" @submit.prevent="signIn">
        <VSelect
          v-model="loginType"
          :items="loginOptions"
          label="Tipo de acesso"
          bg-color="border"
          variant="filled"
          class="mb-7"
          hide-details="auto"
          aria-label="Selecione o tipo de acesso: e-mail, CPF, telefone ou número de conta"
        />

        <VTextField
          ref="identifierRef"
          v-model="identifier"
          :label="dynamicLabel"
          bg-color="border"
          variant="filled"
          class="mb-2"
          :rules="dynamicRules"
          :maxlength="dynamicMaxLength"
          :inputmode="dynamicInputMode"
          @input="handleInput"
          aria-required="true"
          :autocomplete="loginType === 'E-mail' ? 'username email' : 'off'"
        />

        <VTextField
          v-model="password"
          label="Senha"
          bg-color="border"
          variant="filled"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
          :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
          class="mb-2"
          :rules="[rules.required, rules.minLen]"
          autocomplete="current-password"
        />

        <AppButton
          text="Acessar"
          @click="signIn"
          :loading="authStore.isLoading"
          aria-label="Acessar sua conta"
        />
      </VForm>

      <div class="mt-10">
        <ArrowButton
          title="Redefinir senha"
          class="mt-5"
          direction="right"
          :action="goToForgotPassword"
          role="link"
          aria-label="Ir para a página de redefinição de senha"
        />
      </div>
    </VCard>
  </VContainer>
</template>
