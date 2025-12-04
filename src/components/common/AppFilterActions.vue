<script setup lang="ts">
defineProps({
  count: {
    type: Number,
    default: 0,
  },
  showSort: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['click-filter', 'click-sort'])
</script>

<template>
  <div class="d-flex ga-2 mb-4">
    <VChip
      size="small"
      variant="flat"
      :color="count > 0 ? 'primary' : 'border'"
      class="text-body-2 font-weight-bold"
      @click="emit('click-filter')"
    >
      Filtrar {{ count > 0 ? `(${count})` : '' }}
      <VIcon icon="mdi-filter-variant" end size="small" />
    </VChip>

    <VChip
      v-if="showSort"
      size="small"
      variant="flat"
      color="border"
      class="text-body-2 font-weight-bold"
      @click="emit('click-sort')"
    >
      Ordenar
      <VIcon icon="mdi-sort-variant" end size="small" />
    </VChip>
  </div>
</template>
