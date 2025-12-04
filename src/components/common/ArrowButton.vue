<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    default: '',
  },
  direction: {
    type: String as () => 'left' | 'right',
    default: 'left',
  },
  action: {
    type: Function,
    default: null,
  },
})

function handleClick() {
  if (props.action) {
    props.action()
  } else if (props.to) {
    router.push(props.to)
  } else {
    router.back()
  }
}
</script>

<template>
  <div class="d-flex" :class="direction === 'left' ? 'justify-start' : 'justify-end'">
    <VBtn
      variant="plain"
      class="text-body-1 font-weight-medium px-0 opacity-100 mt-3"
      :ripple="false"
      @click="handleClick"
    >
      <VIcon v-if="direction === 'left'" icon="mdi-arrow-left" start />

      {{ title }}

      <VIcon v-if="direction === 'right'" icon="mdi-arrow-right" end />
    </VBtn>
  </div>
</template>
