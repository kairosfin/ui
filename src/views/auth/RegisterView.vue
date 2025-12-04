<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue'
import ArrowButton from '@/components/common/ArrowButton.vue'
import { useAuthStore } from '@/stores/auth' // Import Store
import { masks } from '@/utils/masks'
import { rules } from '@/utils/rules'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref()

const form = ref({
  name: '',
  email: '',
  phone: '',
  document: '',
  birthdate: '',
  terms: false,
})

async function handleContinue() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const success = await authStore.register(form.value)

  if (success) {
    router.push('/login')
  }
}

const onCPFInput = (e: Event) => {
  form.value.document = masks.cpf((e.target as HTMLInputElement).value)
}
const onPhoneInput = (e: Event) => {
  form.value.phone = masks.phone((e.target as HTMLInputElement).value)
}
const onDateInput = (e: Event) => {
  form.value.birthdate = masks.date((e.target as HTMLInputElement).value)
}
</script>

<template>
  <VContainer class="fill-height justify-center pa-4">
    <VCard width="400" max-width="100%" flat color="transparent">
      <ArrowButton title="Cancelar" to="/" />

      <VCardTitle class="text-center mb-8 text-h4 font-weight-bold">Abrir conta</VCardTitle>

      <VForm ref="formRef" @submit.prevent="handleContinue">
        <VTextField
          v-model="form.name"
          label="Nome completo"
          bg-color="border"
          variant="filled"
          :rules="[rules.required, rules.minLen]"
        />

        <VTextField
          v-model="form.email"
          label="E-mail"
          type="email"
          bg-color="border"
          variant="filled"
          :rules="[rules.required, rules.email]"
        />

        <VTextField
          v-model="form.phone"
          label="Telefone"
          bg-color="border"
          variant="filled"
          maxlength="15"
          @input="onPhoneInput"
          :rules="[rules.required, rules.phone]"
        />

        <VTextField
          v-model="form.document"
          label="CPF"
          bg-color="border"
          variant="filled"
          maxlength="14"
          @input="onCPFInput"
          :rules="[rules.required, rules.cpf]"
        />

        <VTextField
          v-model="form.birthdate"
          label="Data de nascimento"
          placeholder="dd/mm/aaaa"
          bg-color="border"
          variant="filled"
          maxlength="10"
          @input="onDateInput"
          :rules="[rules.required]"
        />

        <VCheckbox v-model="form.terms" color="primary" :rules="[rules.terms]">
          <template v-slot:label>
            <div class="text-body-2 text-secondary">
              Autorizo o Kairos a tratar meus dados pessoais e concordo com a
              <a href="#" class="font-weight-bold text-primary text-decoration-none"
                >Política de Privacidade</a
              >.
            </div>
          </template>
        </VCheckbox>

        <AppButton
          text="Continuar"
          :disabled="!form.terms"
          :loading="authStore.isLoading"
          @click="handleContinue"
        />
      </VForm>
    </VCard>
  </VContainer>
</template>
