<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'

import logoLight from '@/assets/logo-kairos-icon-light.svg'
import logoDark from '@/assets/logo-kairos-icon.svg'

defineProps({
  height: { type: [String, Number], default: 35 },
  width: { type: [String, Number], default: 35 },
})

const theme = useTheme()

const currentLogo = computed(() => {
  return theme.global.current.value.dark ? logoDark : logoLight
})
</script>

<template>
  <VImg :src="currentLogo" :height="height" :width="width" alt="Logo Kairos" eager />
</template>
