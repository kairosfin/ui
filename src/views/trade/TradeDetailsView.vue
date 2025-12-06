<script setup lang="ts">
import PortfolioChart from '@/components/charts/PortfolioChart.vue'
import AppAccordion from '@/components/common/AppAccordion.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppQuantitySelector from '@/components/common/AppQuantitySelector.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import BackButton from '@/components/common/ArrowButton.vue'
import AssetHeader from '@/components/common/AssetHeader.vue'
import BalanceCard from '@/components/common/BalanceCard.vue'
import PositionCard from '@/components/portfolio/PositionCard.vue'
import OrderBook from '@/components/trade/OrderBook.vue'
// IMPORT DO SERVICE SINGLETON
import stockService from '@/services/stockService'
import { usePortfolioStore } from '@/stores/portfolio'
// NOVOS TIPOS
import type { Position } from '@/types/Position'
import type { Stock } from '@/types/Stock'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const portfolioStore = usePortfolioStore()

const isLoading = ref(true)
// Tipagem correta
const stock = ref<Stock | null>(null)
const currentPosition = ref<Position | null>(null)

const quantity = ref(1)
const orderType = ref('A mercado')
const tradeType = ref<'Compra' | 'Venda'>('Compra')

const showConfirmModal = ref(false)

const totalEstimated = computed(() => {
  if (!stock.value) return 0
  // CORREÇÃO: regularMarketPrice -> price
  return stock.value.price * quantity.value
})

const estimatedFee = 0.05
const totalWithFee = computed(() => totalEstimated.value + estimatedFee)

function currency(val: number) {
  return val?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const orderBookData = computed(() => {
  if (!stock.value) return []
  // CORREÇÃO: regularMarketPrice -> price
  const basePrice = stock.value.price
  return [
    { qtdBuy: 24, buy: basePrice - 0.02, sell: basePrice + 0.01, qtdSell: 24 },
    { qtdBuy: 73, buy: basePrice - 0.1, sell: basePrice + 0.05, qtdSell: 73 },
    { qtdBuy: 156, buy: basePrice - 0.18, sell: basePrice + 0.08, qtdSell: 156 },
    { qtdBuy: 12, buy: basePrice - 0.31, sell: basePrice + 0.12, qtdSell: 12 },
  ]
})

onMounted(async () => {
  const ticker = route.params.ticker as string
  if (ticker) {
    isLoading.value = true

    // 1. Busca dados do Mercado (Usando search pois não temos getByTicker)
    const results = await stockService.search([ticker])
    stock.value = results.find((s) => s.ticker === ticker) || null

    // 2. Busca dados da Posição (Seu bolso)
    // cast para null se undefined
    const pos = await portfolioStore.getPositionByTicker(ticker)
    currentPosition.value = pos || null

    isLoading.value = false
  }
})

function confirmTrade() {
  console.log(`Ordem de ${tradeType.value} enviada!`)
  showConfirmModal.value = false
}
</script>

<template>
  <VContainer class="align-start pa-4 bg-background" v-if="stock">
    <div class="w-100 mb-4 d-flex justify-space-between align-center">
      <BackButton title="Negociar" to="/app/trade" />
      <VBtn icon variant="text" color="medium-emphasis">
        <VIcon icon="mdi-heart-outline" />
      </VBtn>
    </div>

    <AssetHeader :position="{ ...stock } as any" />

    <div class="mb-4">
      <PortfolioChart :ticker="stock.ticker" />
    </div>

    <PositionCard v-if="currentPosition" :position="currentPosition" minimal class="mb-4" />

    <div class="mb-4">
      <BalanceCard :balance="portfolioStore.balance" />
    </div>

    <VRow dense>
      <VCol cols="12" md="6">
        <AppSelect
          v-model="orderType"
          :items="['A mercado', 'Limitada', 'Stop Loss']"
          class="mb-1"
        />
      </VCol>

      <VCol cols="12" md="6">
        <AppQuantitySelector v-model="quantity" :min="1" btn-size="x-small" class="mb-3">
          <span class="font-weight-bold">Qtd: {{ quantity }}</span>
        </AppQuantitySelector>
      </VCol>
    </VRow>

    <div class="d-flex ga-2 mb-3 bg-border pa-2 rounded-lg">
      <div class="w-50">
        <AppButton
          text="Compra"
          block
          color="success"
          variant="flat"
          :ripple="false"
          @click="tradeType = 'Compra'"
          :class="tradeType === 'Compra' ? 'elevation-16' : ''"
        />
      </div>
      <div class="w-50">
        <AppButton
          text="Venda"
          block
          color="error"
          variant="flat"
          :ripple="false"
          @click="tradeType = 'Venda'"
          :class="tradeType === 'Venda' ? 'elevation-16' : ''"
        />
      </div>
    </div>

    <AppAccordion title="Ofertas" :initially-open="true">
      <OrderBook :items="orderBookData" />
    </AppAccordion>

    <AppModal
      v-model="showConfirmModal"
      :title="`Confirmar ${tradeType.toLowerCase()}`"
      back-text="Cancelar"
      action-text="Confirmar"
      @action="confirmTrade"
      class="text-body-1 font-weight-medium"
    >
      <div class="d-flex flex-column ga-3 mt-2">
        <div class="d-flex justify-space-between">
          <span>Ativo</span>
          <span>{{ stock.ticker }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <span>Preço</span>
          <span>{{ orderType }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <span>Quantidade</span>
          <span>{{ quantity }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <span>Custo estimado</span>
          <span>{{ currency(totalEstimated) }}</span>
        </div>
      </div>

      <VDivider class="my-4" />

      <div class="d-flex justify-space-between mb-2">
        <span>Taxa prevista</span>
        <span>{{ currency(estimatedFee) }}</span>
      </div>
      <div class="d-flex justify-space-between mb-5">
        <span class="font-weight-black text-body-1">Total previsto</span>
        <span class="font-weight-black text-body-1">{{ currency(totalWithFee) }}</span>
      </div>

      <div v-if="orderType === 'A mercado'" class="bg-border pa-4 rounded-lg mb-4">
        <div class="d-flex align-center mb-2 font-weight-bold text-body-1">
          <VIcon icon="mdi-alert" size="large" class="mr-2" />
          Importante
        </div>
        <p class="text-body-2 mb-0 lh-tight">
          O total previsto não inclui taxas da B3, pois elas serão adicionadas após a execução.
        </p>
      </div>

      <p class="text-body-2 text-justify mb-2 lh-tight">
        O custo estimado é baseado no último preço negociado, pelo tipo de execução ser "{{
          orderType
        }}". Logo, o preço realmente pago pode ser diferente do estimado.
      </p>
    </AppModal>

    <VFooter
      app
      fixed
      class="bg-secondary text-primary elevation-10 px-md-16 py-3 d-flex align-center justify-space-between"
    >
      <div>
        <div class="text-h6 lh-1">Total estimado</div>
        <div class="text-h6 font-weight-bold lh-1">{{ currency(totalEstimated) }}</div>
      </div>

      <div class="w-50">
        <AppButton
          :text="tradeType === 'Compra' ? 'Comprar' : 'Vender'"
          block
          @click="showConfirmModal = true"
        />
      </div>
    </VFooter>
  </VContainer>
</template>

<style scoped>
.lh-1 {
  line-height: 1.2;
}
.lh-tight {
  line-height: 1.4;
}
</style>
