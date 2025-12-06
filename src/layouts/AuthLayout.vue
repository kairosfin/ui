<script setup lang="ts">
import RegisterSheet from '@/components/auth/RegisterSheet.vue'
import AuthNavbar from '@/components/layout/AuthNavbar.vue'
import { provide, ref } from 'vue'

const isRegisterOpen = ref(false)

function openRegister() {
  isRegisterOpen.value = true
}

provide('openRegisterModal', openRegister)
</script>

<template>
  <VApp>
    <AuthNavbar @click-register="openRegister" role="navigation" aria-label="Menu principal" />

    <VMain class="pa-0 fill-height" role="main" aria-label="Conteúdo principal">
      <RouterView />
    </VMain>

    <RegisterSheet v-model="isRegisterOpen" />
  </VApp>
</template>
