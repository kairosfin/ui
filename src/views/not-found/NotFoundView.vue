<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <VContainer class="fill-height d-flex flex-column align-center justify-center text-center">
    <div class="text-h1 font-weight-black text-primary mb-4">404</div>
    <div class="text-h5 font-weight-bold mb-2">Página não encontrada</div>
    <p class="text-body-1 text-medium-emphasis mb-8" style="max-width: 400px">
      A página que você está procurando pode ter sido removida ou não existe.
    </p>
    <AppButton text="Voltar para o Início" block @click="router.push('/')" />
  </VContainer>
</template>
