<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  initiallyOpen: {
    type: Boolean,
    default: true,
  },
})

const isOpen = ref(props.initiallyOpen)
</script>

<template>
  <div class="w-100">
    <div
      class="d-flex justify-space-between align-center pa-5 mb-5 bg-border cursor-pointer rounded-lg"
      @click="isOpen = !isOpen"
    >
      <span class="text-h6 font-weight-bold">
        {{ title }}
      </span>

      <VIcon :icon="isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
    </div>

    <VExpandTransition>
      <div v-show="isOpen">
        <slot></slot>
      </div>
    </VExpandTransition>
  </div>
</template>
