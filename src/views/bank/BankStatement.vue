<script setup lang="ts">
import BankDepositSheet from '@/components/bank/BankDepositSheet.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppFilterActions from '@/components/common/AppFilterActions.vue'
import AppFilterSheet from '@/components/common/AppFilterSheet.vue'
import BackButton from '@/components/common/ArrowButton.vue'
import OrderCard from '@/components/orders/OrderCard.vue'
import OrderDetailSheet from '@/components/orders/OrderDetailSheet.vue'
import { useBankStore } from '@/stores/bank'
import type { BankTransaction } from '@/types/Bank'
import type { Order } from '@/types/Order'
import { computed, onMounted, ref } from 'vue'

const bankStore = useBankStore()

const isFilterOpen = ref(false)
const isDepositOpen = ref(false)
const isDetailOpen = ref(false)
// Inicializa como Order para evitar erro
const selectedTransaction = ref<Order>({} as Order)

const activeFilters = ref({
  search: '',
  type: null as string | null,
  period: null as string | null,
  status: null as string | null,
})

function currency(val: number) {
  return val?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onApplyFilter(filters: any) {
  activeFilters.value = filters
}

// 1. Filtragem (Mantida)
const filteredList = computed(() => {
  let result = [...bankStore.transactions]
  const { search, type, period } = activeFilters.value

  if (search) {
    const term = search.toLowerCase()
    result = result.filter(
      (t) => t.title.toLowerCase().includes(term) || t.subtitle.toLowerCase().includes(term),
    )
  }
  if (type) {
    if (type === 'Crédito') result = result.filter((t) => t.amount >= 0)
    else if (type === 'Débito') result = result.filter((t) => t.amount < 0)
  }
  if (period && period !== 'Escolher período') {
    const now = new Date()
    const cutoff = new Date()
    if (period === 'Última semana') cutoff.setDate(now.getDate() - 7)
    else if (period === 'Último mês') cutoff.setMonth(now.getMonth() - 1)
    else if (period === '3 meses') cutoff.setMonth(now.getMonth() - 3)

    // Converte ISO string para Date para comparar
    result = result.filter((t) => new Date(t.date) >= cutoff)
  }
  return result
})

// 2. Agrupamento com Cálculo de Saldo Retroativo
const groupedWithBalance = computed(() => {
  const groups: Record<string, { transactions: BankTransaction[]; dayBalance: number }> = {}

  let runningBalance = bankStore.balance
  const allTransactions = [...bankStore.transactions]

  const balanceByDay: Record<string, number> = {}
  let currentDay = ''

  for (const t of allTransactions) {
    const day = t.displayDate
    if (day !== currentDay) {
      balanceByDay[day] = runningBalance
      currentDay = day
    }
    runningBalance -= t.amount
  }

  filteredList.value.forEach((t) => {
    const day = t.displayDate
    if (!groups[day]) {
      groups[day] = {
        transactions: [],
        dayBalance: balanceByDay[day] ?? 0,
      }
    }
    groups[day].transactions.push(t)
  })

  return groups
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (activeFilters.value.type) count++
  if (activeFilters.value.period) count++
  return count
})

function openTransactionDetails(transaction: BankTransaction) {
  // Transforma BankTransaction em Order para o modal
  selectedTransaction.value = {
    id: transaction.id,
    type: transaction.type as Order['type'], // Cast seguro
    status: transaction.subtitle,
    date: transaction.displayDate,
    dateISO: transaction.date, // Preenchido para satisfazer a interface Order
    price: transaction.amount,
    qty: 0,
    fees: 0,
    total: transaction.amount, // Preenchido para satisfazer a interface Order
    color: transaction.color,
    timeline: [{ date: transaction.time, label: 'Transação realizada' }],
    ticker: transaction.title,
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
          <div class="text-body-1">Saldo Atual</div>
          <div class="text-h6 text-sm-h5 font-weight-black line-height-1">
            {{ currency(bankStore.balance) }}
          </div>
        </div>
        <AppButton text="Depositar" :block="false" class="px-6" @click="isDepositOpen = true" />
      </div>
    </div>

    <div class="w-100 py-5">
      <h3 class="text-body-1 font-weight-bold mb-2">Extrato</h3>
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
      <div v-if="filteredList.length === 0" class="text-center py-8 text-h6">
        Nenhuma transação encontrada.
      </div>

      <div v-for="(group, date) in groupedWithBalance" :key="date" class="mb-6">
        <div class="d-flex justify-space-between align-center mb-2">
          <span class="text-primary text-body-2 font-weight-medium">{{ date }}</span>
          <span class="text-primary text-body-2 font-weight-medium"
            >Saldo {{ currency(group.dayBalance) }}</span
          >
        </div>

        <div class="d-flex flex-column">
          <OrderCard
            v-for="transaction in group.transactions"
            :key="transaction.id"
            :ticker="transaction.title"
            :order="
              {
                id: transaction.id,
                type: transaction.type as any,
                status: transaction.subtitle,
                date: transaction.time,
                dateISO: transaction.date,
                price: transaction.amount,
                color: transaction.color,
                qty: 0,
                fees: 0,
                total: transaction.amount,
                timeline: [],
                ticker: transaction.title,
              } as Order
            "
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
