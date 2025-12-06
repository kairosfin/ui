<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue'
import BackButton from '@/components/common/ArrowButton.vue'
import { useAuthStore } from '@/stores/auth'
import { masks } from '@/utils/masks'
import { rules } from '@/utils/rules'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const formRef = ref()

// 1. NOVO: Defina a interface que espelha os campos do formulário
interface UserProfileForm {
  name: string
  email: string
  document: string
  phoneNumber: string
  birthdate: string
  genderType: string | null // <--- Explicitamente permitimos STRING ou NULL
  address: string
}

// 2. Aplique a interface ao ref
const form = ref<UserProfileForm>({
  name: '',
  email: '',
  document: '',
  phoneNumber: '',
  birthdate: '',
  genderType: null,
  address: '',
})

onMounted(() => {
  if (authStore.user) {
    form.value = {
      ...form.value,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(authStore.user as any),
    }
  }
})

function backToApp() {
  router.push('/app')
}

async function saveProfile() {
  const { valid } = await formRef.value.validate()

  if (valid) {
    loading.value = true

    authStore.updateProfile(form.value)

    setTimeout(() => {
      loading.value = false
      backToApp()
    }, 1500)
  }
}

const onCPFInput = (e: Event) => {
  form.value.document = masks.cpf((e.target as HTMLInputElement).value)
}
const onPhoneInput = (e: Event) => {
  form.value.phoneNumber = masks.phone((e.target as HTMLInputElement).value)
}
const onDateInput = (e: Event) => {
  form.value.birthdate = masks.date((e.target as HTMLInputElement).value)
}
</script>

<template>
  <VContainer class="fill-height justify-center">
    <VCard width="400" max-width="100%" flat color="transparent">
      <BackButton title="Conta" to="/app" />

      <div class="text-center mb-8">
        <VAvatar color="border" size="120">
          <span class="text-h3 text-secondary font-weight-medium">
            {{ form.name ? form.name.substring(0, 2).toUpperCase() : 'US' }}
          </span>
        </VAvatar>
      </div>

      <VForm ref="formRef" @submit.prevent="saveProfile">
        <VTextField
          model-value="781779-3"
          label="Número da conta"
          bg-color="border"
          variant="filled"
          disabled
        />

        <VTextField
          v-model="form.name"
          label="Nome completo"
          bg-color="border"
          variant="filled"
          :rules="[rules.required]"
          disabled
        />

        <VTextField
          v-model="form.email"
          label="E-mail"
          bg-color="border"
          variant="filled"
          :rules="[rules.required, rules.email]"
          disabled
        />

        <VTextField
          v-model="form.document"
          label="Documento"
          bg-color="border"
          variant="filled"
          maxlength="14"
          @input="onCPFInput"
          :rules="[rules.required, rules.cpf]"
          disabled
        />

        <VTextField
          v-model="form.phoneNumber"
          label="Telefone"
          bg-color="border"
          variant="filled"
          maxlength="15"
          @input="onPhoneInput"
          :rules="[rules.required, rules.phone]"
          disabled
        />

        <VTextField
          v-model="form.birthdate"
          label="Data de nascimento"
          placeholder="dd/mm/aaaa"
          bg-color="border"
          variant="filled"
          maxlength="10"
          @input="onDateInput"
          :rules="[rules.required, rules.date]"
          disabled
        />

        <VSelect
          v-model="form.genderType"
          :items="['Masculino', 'Feminino', 'Outro', 'Prefiro não dizer']"
          bg-color="border"
          label="Gênero"
          variant="outlined"
          :rules="[rules.required]"
        />

        <VTextField
          v-model="form.address"
          label="Endereço"
          bg-color="border"
          variant="outlined"
          class="mb-6"
        />

        <AppButton text="Salvar" :loading="loading" @click="saveProfile" />
      </VForm>
    </VCard>
  </VContainer>
</template>
