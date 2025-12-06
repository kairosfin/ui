<script setup lang="ts">
import hourhglassBg from '@/assets/hourglass-bg-landing-page.jpeg'
import AppButton from '@/components/common/AppButton.vue'
import { computed, inject } from 'vue'
import { useDisplay } from 'vuetify'

const openRegister = inject('openRegisterModal') as () => void
const { mobile } = useDisplay()

const bgPosition = computed(() => {
  if (mobile.value) return '75% center'
  return 'center center'
})
</script>

<template>
  <VImg
    class="h-screen overflow-hidden"
    :src="hourhglassBg"
    cover
    :position="bgPosition"
    gradient="to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.8)"
    role="img"
    aria-label="Fundo decorativo mostrando uma ampulheta, simbolizando tempo"
  >
    <VContainer class="fill-height">
      <VRow>
        <VCol class="text-background" cols="12" md="7" lg="6">
          <h1 class="text-h4 text-md-h2 font-weight-bold mb-4 text-background">
            Tempo é dinheiro.
          </h1>
          <p class="text-h6 text-md-h5 font-weight-regular mb-6">
            Não perca a chance de abrir sua conta
            <VIcon icon="mdi-arrow-right" class="ml-1" aria-hidden="true" />
          </p>

          <AppButton
            text="Abra sua conta"
            variant="outlined"
            color="background"
            :block="false"
            @click="openRegister"
            aria-label="Abrir formulário para criar uma nova conta"
          />
        </VCol>
      </VRow>
    </VContainer>
  </VImg>
</template>
