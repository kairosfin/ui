<script setup lang="ts">
import BankDepositSheet from '@/components/bank/BankDepositSheet.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppFilterActions from '@/components/common/AppFilterActions.vue'
import AppFilterSheet from '@/components/common/AppFilterSheet.vue'
import BackButton from '@/components/common/ArrowButton.vue'
import OrderCard from '@/components/orders/OrderCard.vue'
import OrderDetailSheet from '@/components/orders/OrderDetailSheet.vue'
// Importamos a interface para tipagem correta (opcional, mas bom)
import { useBankStore } from '@/stores/bank'
import type { BankTransaction } from '@/types/Bank'
import { computed, onMounted, ref } from 'vue'

const bankStore = useBankStore()

// --- ESTADOS ---
const isFilterOpen = ref(false)
const isDepositOpen = ref(false)
const isDetailOpen = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedTransaction = ref<any>({})

// Filtros Ativos
const activeFilters = ref({
  search: '',
  type: null as string | null, // 'Débito' | 'Crédito'
  period: null as string | null,
  status: null as string | null,
})

function currency(val: number) {
  return val?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Recebe os filtros do Modal
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onApplyFilter(filters: any) {
  activeFilters.value = filters
}

// --- LÓGICA DE FILTRAGEM ---

// 1. Primeiro filtramos a lista plana (flat array)
const filteredList = computed(() => {
  let result = [...bankStore.transactions]
  const { search, type, period } = activeFilters.value

  // A. Busca
  if (search) {
    const term = search.toLowerCase()
    result = result.filter(
      (t) => t.title.toLowerCase().includes(term) || t.subtitle.toLowerCase().includes(term),
    )
  }

  // B. Tipo (Débito vs Crédito) - AGORA FUNCIONA COM OS MOCKS CORRIGIDOS
  if (type) {
    if (type === 'Crédito') {
      result = result.filter((t) => t.price >= 0)
    } else if (type === 'Débito') {
      result = result.filter((t) => t.price < 0)
    }
  }

  // C. Período
  if (period && period !== 'Escolher período') {
    const now = new Date()
    const cutoff = new Date()

    if (period === 'Última semana') cutoff.setDate(now.getDate() - 7)
    else if (period === 'Último mês') cutoff.setMonth(now.getMonth() - 1)
    else if (period === '3 meses') cutoff.setMonth(now.getMonth() - 3)

    result = result.filter((t) => new Date(t.date) >= cutoff)
  }

  return result
})

// 2. Agrupamento da lista JÁ FILTRADA
const filteredGroupedTransactions = computed(() => {
  const groups: Record<string, BankTransaction[]> = {}

  filteredList.value.forEach((t) => {
    if (!groups[t.displayDate]) groups[t.displayDate] = []
    groups[t.displayDate]!.push(t)
  })

  return groups
})

// 3. Contagem
const activeFiltersCount = computed(() => {
  let count = 0
  if (activeFilters.value.type) count++
  if (activeFilters.value.period) count++
  return count
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function openTransactionDetails(transaction: any) {
  selectedTransaction.value = {
    id: transaction.id,
    symbol: transaction.title,
    type: transaction.type,
    date: transaction.displayDate + ' ' + transaction.time,
    price: Math.abs(transaction.price),
    qty: 0,
    fees: 0,
    status: 'Concluída',
    timeline: [{ date: transaction.time, label: 'Transação realizada' }],
  }
  isDetailOpen.value = true
}

onMounted(() => {
  bankStore.fetchTransactions()
})
</script>

<template>
  <VContainer class="align-start">
    <div class="w-100">
      <BackButton title="Portfólio" to="/app" class="mb-4" />
      <div class="d-flex justify-space-between align-end">
        <div>
          <div class="text-h6 font-weight-medium mb-1">Saldo</div>
          <div class="text-h5 text-sm-h4 font-weight-black">{{ currency(bankStore.balance) }}</div>
        </div>
        <AppButton text="Depositar" :block="false" class="px-6" @click="isDepositOpen = true" />
      </div>
    </div>

    <div class="w-100 py-5">
      <h3 class="text-h6 font-weight-bold mb-2">Extrato</h3>
      <AppFilterActions
        :count="activeFiltersCount"
        @click-filter="isFilterOpen = true"
        :show-sort="false"
      />
    </div>

    <div v-if="bankStore.isLoading" class="w-100 d-flex justify-center mt-10">
      <VProgressCircular indeterminate color="primary" />
    </div>

    <div v-else class="w-100 pb-10">
      <div v-if="filteredList.length === 0" class="text-center py-8 text-medium-emphasis text-h6">
        Nenhuma transação encontrada.
      </div>

      <div v-for="(items, date) in filteredGroupedTransactions" :key="date" class="mb-6">
        <div class="d-flex justify-space-between align-center mb-2">
          <span class="text-primary text-h6">{{ date }}</span>
          <span class="text-primary text-h6">Saldo {{ currency(bankStore.balance) }}</span>
        </div>

        <div class="d-flex flex-column">
          <OrderCard
            v-for="transaction in items"
            :key="transaction.id"
            :symbol="transaction.title"
            :order="{
              id: transaction.id,
              type: transaction.type,
              status: transaction.subtitle,
              date: transaction.time,
              price: transaction.price,
              color: transaction.color,
              qty: 0,
            }"
            @click="openTransactionDetails(transaction)"
          />
        </div>
      </div>
    </div>

    <BankDepositSheet v-model="isDepositOpen" />
    <OrderDetailSheet v-model="isDetailOpen" :order="selectedTransaction" />

    <AppFilterSheet
      v-model="isFilterOpen"
      title="Filtrar extrato"
      :type-options="['Débito', 'Crédito']"
      :period-options="['Última semana', 'Último mês', '3 meses', 'Escolher período']"
      :status-options="[]"
      @apply="onApplyFilter"
    />
  </VContainer>
</template>
