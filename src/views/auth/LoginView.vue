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

const loginType = ref('E-mail')
const identifier = ref('')
const password = ref('')
const showPassword = ref(false)

const dynamicLabel = computed(() =>
  loginType.value === 'CPF' ? 'Digite seu CPF' : 'Digite seu e-mail',
)
const dynamicRules = computed(() =>
  loginType.value === 'CPF' ? [rules.required, rules.cpf] : [rules.required, rules.email],
)
const dynamicMaxLength = computed(() => (loginType.value === 'CPF' ? 14 : undefined))

function handleInput(event: Event) {
  if (loginType.value !== 'CPF') return
  const input = event.target as HTMLInputElement
  identifier.value = masks.cpf(input.value)
}

watch(loginType, () => {
  identifier.value = ''
  if (formRef.value) formRef.value.resetValidation()
})

async function signIn() {
  const { valid } = await formRef.value.validate()

  if (valid) {
    const success = await authStore.login(identifier.value, password.value)

    if (success) {
      router.push('/app')
    }
  }
}

function goToForgotPassword() {
  router.push('/forgot-password')
}
</script>

<template>
  <VContainer class="fill-height justify-center mb-16">
    <VCard width="400" max-width="100%" flat color="transparent">
      <AppLogo :height="60" :width="180" class="mx-auto mb-16" />

      <VAlert v-if="authStore.error" color="error" variant="tonal" class="mb-4" density="compact">
        {{ authStore.error }}
      </VAlert>

      <VForm ref="formRef" @submit.prevent="signIn">
        <VSelect
          v-model="loginType"
          :items="['E-mail', 'CPF']"
          label="Tipo de acesso"
          bg-color="border"
          variant="filled"
          class="mb-7"
          hide-details="auto"
        />

        <VTextField
          v-model="identifier"
          :label="dynamicLabel"
          bg-color="border"
          variant="filled"
          class="mb-2"
          :rules="dynamicRules"
          :maxlength="dynamicMaxLength"
          @input="handleInput"
        />

        <VTextField
          v-model="password"
          label="Senha"
          bg-color="border"
          variant="filled"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
          class="mb-2"
          :rules="[rules.required, rules.minLen]"
        />

        <AppButton text="Acessar" @click="signIn" :loading="authStore.isLoading" />
      </VForm>

      <ArrowButton
        title="Redefinir senha"
        class="mt-5"
        direction="right"
        :action="goToForgotPassword"
      />
    </VCard>
  </VContainer>
</template>
