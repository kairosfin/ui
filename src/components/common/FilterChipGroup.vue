<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
  options: { type: Array as () => string[], required: true },
  modelValue: { type: [String, null], default: null },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="mb-6">
    <div class="text-subtitle-2 font-weight-bold mb-3">{{ title }}</div>

    <div class="d-flex flex-wrap ga-2">
      <VChip
        v-for="option in options"
        :key="option"
        :color="modelValue === option ? 'primary' : 'border'"
        :variant="modelValue === option ? 'flat' : 'flat'"
        :class="modelValue === option ? 'text-white' : 'text-medium-emphasis'"
        class="font-weight-bold border-0"
        size="default"
        @click="emit('update:modelValue', option === modelValue ? null : option)"
      >
        {{ option }}
      </VChip>
    </div>
  </div>
</template>
