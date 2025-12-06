<script setup lang="ts">
import PortfolioChart from '@/components/charts/PortfolioChart.vue'
import AppAccordion from '@/components/common/AppAccordion.vue'
import BalanceCard from '@/components/common/BalanceCard.vue'
import PositionCard from '@/components/portfolio/PositionCard.vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { computed, onMounted } from 'vue'

const portfolioStore = usePortfolioStore()

const profitColor = computed(() =>
  portfolioStore.totalProfit >= 0 ? 'text-success' : 'text-error',
)

function currency(val: number) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

onMounted(() => {
  portfolioStore.fetchPortfolio()
})
</script>

<template>
  <VContainer class="pa-4 py-8 bg-background">
    <div class="mb-6" role="region" aria-label="Visão Geral do Portfólio e Saldo Total">
      <div class="d-flex align-center mb-4">
        <h2 class="text-h6 font-weight-bold">Portfólio</h2>
      </div>

      <div class="d-flex align-end justify-space-between">
        <div>
          <div class="text-body-1 font-weight-medium mb-1">Total Investido + Saldo</div>

          <VSkeletonLoader
            v-if="portfolioStore.isLoading"
            type="heading"
            width="180"
            color="transparent"
            class="ml-n3"
            aria-label="Carregando saldo total"
          />
          <div v-else class="text-h5 text-sm-h4 font-weight-black line-height-1">
            {{ currency(portfolioStore.totalPortfolio) }}
          </div>
        </div>

        <div class="text-right" role="status" aria-live="polite" aria-atomic="true">
          <div class="text-body-1 font-weight-medium mb-1">Atualizado hoje</div>

          <VSkeletonLoader
            v-if="portfolioStore.isLoading"
            type="text"
            width="100"
            class="ml-auto"
            aria-label="Carregando rentabilidade"
          />
          <div v-else class="text-h6 font-weight-bold" :class="profitColor">
            <span
              :aria-label="`Rentabilidade total de hoje: ${portfolioStore.totalProfitPercent} por cento`"
            >
              {{ portfolioStore.totalProfit >= 0 ? '+' : '' }}
              {{ currency(portfolioStore.totalProfit) }}
              ({{ portfolioStore.totalProfitPercent }}%)
            </span>
          </div>
        </div>
      </div>
    </div>

    <PortfolioChart
      class="mb-6"
      role="img"
      aria-label="Gráfico de histórico de valorização do portfólio"
    />

    <BalanceCard :balance="portfolioStore.balance" class="mb-6" />

    <AppAccordion
      title="Posições"
      :initially-open="true"
      role="region"
      aria-label="Lista de ativos em posse"
    >
      <VRow dense>
        <template v-if="portfolioStore.isLoading">
          <VCol v-for="n in 3" :key="n" cols="12" sm="6" lg="4">
            <VSkeletonLoader
              type="image, article"
              height="180"
              aria-label="Carregando posição do ativo"
            />
          </VCol>
        </template>

        <template v-else>
          <VCol v-for="pos in portfolioStore.positions" :key="pos.ticker" cols="12" md="6" lg="4">
            <PositionCard :position="pos" />
          </VCol>
        </template>
      </VRow>
    </AppAccordion>
  </VContainer>
</template>
