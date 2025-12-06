<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'
// Assumindo que você importa 'rules' de '@/utils/rules'
// import { rules } from '@/utils/rules'
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // Dados passados (não usados na validação, mas usados no display)
  type: { type: String, default: '' },
  identifier: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

// Referência ao formulário para disparar a validação
const formRef = ref()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// 1. REGRA: Checa se a confirmação de senha é igual à senha original
const passwordConfirmationRule = computed(() => [
  (v: string) => v === password.value || 'As senhas não coincidem.',
])

async function handlePasswordReset() {
  // 2. Dispara a validação do formulário (incluindo as regras de campo)
  const { valid } = await formRef.value.validate()

  if (!valid) return // Bloqueia se houver erro de campo ou senhas diferentes

  // 3. Sucesso: Fecha o modal
  isOpen.value = false
}
</script>

<template>
  <AppModal v-model="isOpen" title="Definir senha" back-text="Cancelar">
    <div class="mb-4 text-center">
      <p class="text-body-2">
        Redefinindo senha para:
        <span class="font-weight-bold">{{ props.identifier }}</span>
      </p>
    </div>

    <VForm ref="formRef" @submit.prevent="handlePasswordReset">
      <VTextField
        v-model="password"
        label="Nova Senha"
        bg-color="border"
        variant="filled"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
        class="mb-2"
        autocomplete="new-password"
        :rules="[
          (v) => !!v || 'Senha é obrigatória',
          (v) => v.length >= 6 || 'Mínimo de 6 caracteres',
        ]"
      />

      <VTextField
        v-model="confirmPassword"
        label="Confirmar nova senha"
        bg-color="border"
        variant="filled"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
        class="mb-4"
        autocomplete="new-password"
        :rules="passwordConfirmationRule"
      />

      <AppButton text="Continuar" type="submit" block />
    </VForm>
  </AppModal>
</template>
