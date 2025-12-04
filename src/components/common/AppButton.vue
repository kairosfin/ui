<script setup lang="ts">
defineProps({
  loading: Boolean,
  disabled: Boolean,
  text: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'primary',
  },
  variant: {
    type: String as () => 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain',
    default: 'flat',
  },
  textColor: {
    type: String,
    default: undefined,
  },
  block: { type: Boolean, default: true },
})

defineEmits(['click'])
</script>

<template>
  <VBtn
    :block="block"
    size="large"
    :variant="variant"
    class="font-weight-bold"
    :color="color"
    :class="textColor ? `text-${textColor}` : ''"
    :loading="loading"
    :disabled="disabled"
    @click="$emit('click')"
  >
    {{ text }}
  </VBtn>
</template>
