<script setup lang="ts">
import PublicNavbar from '@/components/layout/PublicNavbar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToRegister() {
  router.push('/register')
}
</script>

<template>
  <VApp>
    <PublicNavbar @click-register="goToRegister" />

    <VMain class="pa-0 fill-height">
      <RouterView />
    </VMain>
  </VApp>
</template>
