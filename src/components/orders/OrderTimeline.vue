<script setup lang="ts">
import { computed } from 'vue'
import AppAccordion from '../common/AppAccordion.vue'

interface TimelineEvent {
  date: string
  label: string
}

const props = defineProps({
  timeline: {
    type: Array as () => TimelineEvent[],
    default: () => [],
  },
})

const hasItems = computed(() => props.timeline && props.timeline.length > 0)
</script>

<template>
  <div v-if="hasItems">
    <AppAccordion title="Histórico" :initially-open="true">
      <VSheet color="border" class="pa-4 rounded-lg overflow-y-auto" max-height="250">
        <div
          v-for="(event, index) in timeline"
          :key="index"
          class="d-flex justify-space-between text-caption py-2 border-opacity-25"
          :class="{ 'border-b': index !== timeline.length - 1 }"
        >
          <span class="font-weight-bold">{{ event.date }}</span>
          <span class="font-weight-bold text-right">{{ event.label }}</span>
        </div>
      </VSheet>
    </AppAccordion>
  </div>
</template>
