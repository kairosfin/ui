<script setup lang="ts">
import { computed } from 'vue'
import AppButton from './AppButton.vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: 'Sucesso!' },
  subtitle: { type: String, default: '' },
  buttonText: { type: String, default: 'Continuar' },

  icon: { type: String, default: 'mdi-check-circle' },
  iconColor: { type: String, default: 'success' },
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function handleConfirm() {
  isOpen.value = false
  emit('confirm')
}

const avatarBgColor = computed(() => `${props.iconColor}-lighten-5`)
</script>

<template>
  <VDialog v-model="isOpen" max-width="400" persistent>
    <VCard
      class="pa-6 text-center rounded-lg bg-background"
      role="alertdialog"
      aria-labelledby="success-modal-title"
      aria-describedby="success-modal-desc"
    >
      <div class="mb-4">
        <VAvatar :color="avatarBgColor" size="80" class="mb-2">
          <VIcon :icon="props.icon" :color="iconColor" size="48" aria-hidden="true" />
        </VAvatar>
      </div>

      <h3 id="success-modal-title" class="text-h5 font-weight-bold mb-2">{{ title }}</h3>

      <p id="success-modal-desc" class="text-body-1 mb-6">
        {{ subtitle }}
      </p>

      <AppButton :text="buttonText" block :color="iconColor" @click="handleConfirm" />
    </VCard>
  </VDialog>
</template>
