<script setup lang="ts">
import hourhglassBg from '@/assets/hourglass-bg-landing-page.jpeg'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <AppHeader>
    <template #actionsRight>
      <VBtn to="/register" color="background" variant="flat" class="font-weight-bold ma-5">
        Abra sua conta
      </VBtn>
    </template>
  </AppHeader>

  <VImg
    :src="hourhglassBg"
    cover
    height="100vh"
    gradient="to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.8)"
  >
    <VContainer class="fill-height">
      <VRow>
        <VCol class="text-background mb-16">
          <h1 class="text-h4 text-md-h2 font-weight-bold mb-4">Tempo é dinheiro.</h1>

          <VBtn to="/register" variant="plain" class="text-h9 text-md-h5 font-weight-light">
            Não perca a chance de abrir sua conta &rarr;
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </VImg>
</template>

<style scoped></style>
