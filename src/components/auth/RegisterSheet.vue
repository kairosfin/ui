<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppSuccessModal from '@/components/common/AppSuccessModal.vue' // <--- 1. Import do novo componente
import { useAuthStore } from '@/stores/auth'
import { masks } from '@/utils/masks'
import { rules } from '@/utils/rules'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref()

const isSuccessOpen = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

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
    isOpen.value = false
    isSuccessOpen.value = true
  }
}

function handleSuccessConfirm() {
  isSuccessOpen.value = false
  router.push('/login')
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
  <AppModal
    v-model="isOpen"
    title="Abrir conta"
    back-text="Cancelar"
    aria-label="Janela de cadastro de nova conta"
  >
    <VForm ref="formRef" @submit.prevent="handleContinue" class="mt-4" novalidate>
      <VTextField
        v-model="form.name"
        label="Nome completo"
        bg-color="border"
        variant="filled"
        autocomplete="name"
        :rules="[rules.required, rules.minLen]"
        aria-required="true"
      />

      <VTextField
        v-model="form.email"
        label="E-mail"
        type="email"
        bg-color="border"
        variant="filled"
        autocomplete="email"
        :rules="[rules.required, rules.email]"
        aria-required="true"
      />

      <VTextField
        v-model="form.phone"
        label="Telefone"
        bg-color="border"
        variant="filled"
        maxlength="15"
        autocomplete="tel"
        @input="onPhoneInput"
        :rules="[rules.required, rules.phone]"
        aria-required="true"
      />

      <VTextField
        v-model="form.document"
        label="CPF ou CNPJ"
        bg-color="border"
        variant="filled"
        maxlength="14"
        autocomplete="off"
        @input="onCPFInput"
        :rules="[rules.required, rules.cpf]"
        aria-required="true"
      />

      <VTextField
        v-model="form.birthdate"
        label="Data de nascimento"
        placeholder="dd/mm/aaaa"
        bg-color="border"
        variant="filled"
        maxlength="10"
        autocomplete="bday"
        @input="onDateInput"
        :rules="[rules.required, rules.date]"
        aria-required="true"
        aria-label="Data de nascimento no formato dia, mês e ano"
      />

      <VCheckbox v-model="form.terms" color="primary" :rules="[rules.terms]" aria-required="true">
        <template v-slot:label>
          <div class="text-body-2">
            Autorizo o Kairos a tratar meus dados pessoais e concordo com a
            <a
              href="#"
              class="font-weight-bold text-primary text-decoration-none"
              aria-label="Ler a Política de Privacidade (abre em nova janela)"
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
        class="mt-4"
        aria-label="Finalizar cadastro e criar conta"
      />
    </VForm>
  </AppModal>

  <AppSuccessModal
    v-model="isSuccessOpen"
    title="Conta criada!"
    subtitle="Enviamos um link de confirmação para o seu e-mail. Por favor, verifique sua caixa de entrada."
    button-text="Ir para o Login"
    @confirm="handleSuccessConfirm"
  />
</template>
