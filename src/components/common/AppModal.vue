<script setup lang="ts">
import { computed } from 'vue'
import AppButton from './AppButton.vue'
import ArrowButton from './ArrowButton.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  backText: { type: String, default: '' },
  actionText: { type: String, default: '' },
  actionDisabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'action'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function close() {
  isOpen.value = false
}

function handleAction() {
  emit('action')
}
</script>

<template>
  <VBottomSheet max-width="500" v-model="isOpen" inset>
    <VCard
      class="rounded-t-lg bg-background h-auto d-flex flex-column px-5 pt-2 pb-6"
      style="max-height: 90vh"
    >
      <ArrowButton :title="backText" direction="left" :action="close" class="mt-0" />
      <div class="d-flex align-center justify-center position-relative">
        <span class="text-h6 font-weight-bold text-center text-truncate pb-5 pt-3">
          {{ title }}
        </span>
      </div>

      <div class="py-2 overflow-y-auto flex-grow-1">
        <slot></slot>
      </div>

      <div class="pb-6 pt-2" v-if="actionText">
        <AppButton
          :text="actionText"
          block
          size="large"
          :disabled="actionDisabled"
          @click="handleAction"
        />
      </div>
    </VCard>
  </VBottomSheet>
</template>
