<script setup lang="ts">
import hourhglassBg from '@/assets/hourglass-bg-landing-page.jpeg'
import AppButton from '@/components/common/AppButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToRegister() {
  router.push('/register')
}
</script>

<template>
  <VImg
    class="h-screen overflow-hidden"
    :src="hourhglassBg"
    cover
    gradient="to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.8)"
  >
    <VContainer class="fill-height">
      <VRow>
        <VCol class="text-background">
          <h1 class="text-h4 text-md-h2 font-weight-bold mb-4 text-background">
            Tempo é dinheiro.
          </h1>
          <p class="text-h5 font-weight-regular mb-6">
            Não perca a chance de abrir sua conta
            <VIcon icon="mdi-arrow-right" class="ml-1" />
          </p>
          <AppButton
            text="Abra sua conta"
            variant="outlined"
            color="background"
            :block="false"
            @click="goToRegister"
          />
        </VCol>
      </VRow>
    </VContainer>
  </VImg>
</template>
