<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

function changeOpen() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div>
    <VBtn @click="changeOpen" text="Click me"></VBtn>

    <VContainer>
      <VBottomSheet v-model="isOpen" inset>
        <VCard color="background" class="pa-2" rounded="t-xl">
          <VRow no-gutters justify="center">
            <VCol cols="12">
              <VBtn align-self="start" variant="plain" @click="changeOpen">
                <VIcon icon="mdi-arrow-left" start />
                Cancelar
              </VBtn>
            </VCol>
            <VCol cols="12">
              <VCardTitle class="text-center text-h5 font-weight-bold">
                <slot name="title"> Título Padrão </slot>
              </VCardTitle>
            </VCol>
            <VCol cols="12">
              <VCardText>
                <slot name="content"> Conteúdo Padrão </slot>
              </VCardText>
            </VCol>
            <VCol cols="12">
              <VCardActions cols="4">
                <VBtn block class="text-background" variant="flat" @click="changeOpen">
                  <slot name="submit-text">Confirmar </slot>
                </VBtn>
              </VCardActions>
            </VCol>
          </VRow>
        </VCard>
      </VBottomSheet>
    </VContainer>
  </div>
</template>
