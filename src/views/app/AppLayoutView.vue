<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppModal from '@/components/AppModal.vue'
</script>

<template>
  <AppHeader />

  <AppModal>
    <template #title> Filtrar extrato </template>
    <template #content>
      <VTextField label="Título ou descrição" variant="filled" bg-color="field-bg" />
    </template>
    <template #actions>
      <VBtn block variant="flat"> Filtrar </VBtn>
    </template>
  </AppModal>

  <RouterView />
</template>

<style scoped></style>
