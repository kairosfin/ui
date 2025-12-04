<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'

import logoForDarkTheme from '@/assets/logo-kairos-light.svg'
import logoForLightTheme from '@/assets/logo-kairos.svg'

defineProps({
  height: { type: [String, Number], default: 40 },
  width: { type: [String, Number], default: 120 },
})

const theme = useTheme()

const currentLogo = computed(() => {
  return theme.global.current.value.dark ? logoForDarkTheme : logoForLightTheme
})
</script>

<template>
  <VImg :src="currentLogo" :height="height" :width="width" alt="Logo Kairos" eager />
</template>
