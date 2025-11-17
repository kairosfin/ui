<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppLogo from '@/components/icons/AppLogo.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const email = ref('')
const telephone = ref('')
const cpfCnpj = ref('')
const birthDate = ref('')
const isValid = ref(false)

function cancel() {
  router.push('/')
}

function register() {
  router.push('/login')
}
</script>

<template>
  <AppHeader>
    <template #actionsLeft>
      <VBtn variant="text" @click="cancel">
        <VIcon icon="mdi-arrow-left" start />
        Cancelar
      </VBtn>
    </template>

    <template #actionsRight>
      <div></div>
    </template>
  </AppHeader>

  <VContainer class="fill-height justify-center">
    <VCard color="background" max-width="500px" width="100%" flat class="pa-2">
      <AppLogo :height="60" :width="180" class="mx-auto mb-10" />

      <VCardTitle class="text-center text-h5 font-weight-bold mb-5"> Abrir conta </VCardTitle>

      <VCardText>
        <VForm @submit.prevent="register">
          <VTextField
            v-model="name"
            label="Nome completo"
            color="kairosWhite"
            variant="filled"
            density="compact"
            class="mb-2"
          />
          <VTextField
            v-model="email"
            label="E-mail"
            variant="filled"
            density="compact"
            class="mb-2"
          />
          <VTextField
            v-model="telephone"
            label="Telefone"
            variant="filled"
            density="compact"
            class="mb-2"
          />
          <VTextField
            v-model="cpfCnpj"
            label="CPF ou CNPJ"
            variant="filled"
            density="compact"
            class="mb-2"
          />
          <VTextField
            v-model="birthDate"
            label="Data de nascimento"
            variant="filled"
            density="compact"
            type="date"
            class="mb-2"
          />

          <VCheckbox v-model="isValid">
            <template #label>
              <div class="text-caption">
                Autorizo o Kairos a tratar meus dados pessoais para envio de comunicações sobre seus
                produtos e também estou de acordo com a
                <a href="#" @click.stop>Política de Privacidade.</a>
              </div>
            </template>
          </VCheckbox>
        </VForm>
      </VCardText>

      <VCardActions class="pa-4">
        <VBtn color="surface" block variant="flat" @click="register" :disabled="!isValid">
          Continuar
        </VBtn>
      </VCardActions>
    </VCard>
  </VContainer>
</template>

<style scoped></style>
