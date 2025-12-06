<script setup lang="ts">
import PortfolioChart from '@/components/charts/PortfolioChart.vue'
import AppAccordion from '@/components/common/AppAccordion.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppSuccessModal from '@/components/common/AppSuccessModal.vue' // <-- 1. Importado
import AppQuantitySelector from '@/components/common/AppQuantitySelector.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import BackButton from '@/components/common/ArrowButton.vue'
import AssetHeader from '@/components/common/AssetHeader.vue'
import BalanceCard from '@/components/common/BalanceCard.vue'
import PositionCard from '@/components/portfolio/PositionCard.vue'
import OrderBook from '@/components/trade/OrderBook.vue'
import stockService from '@/services/stockService'
import { usePortfolioStore } from '@/stores/portfolio'
import type { Position } from '@/types/Position'
import type { Stock } from '@/types/Stock'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const portfolioStore = usePortfolioStore()

// Estados
const isLoading = ref(true)
const isSubmitting = ref(false)
const stock = ref<Stock | null>(null)
const currentPosition = ref<Position | null>(null)

// Formulário
const quantity = ref(1)
const orderType = ref('A mercado')
const tradeType = ref<'Compra' | 'Venda'>('Compra')

// 2. Novo estado para o feedback de sucesso
const showConfirmModal = ref(false)
const showTradeSuccessModal = ref(false)

// Configurações (Mantidas)
const estimatedFee = 0.05

// ... (totalEstimated, totalWithFee, orderBookData, currency mantidos) ...
const totalEstimated = computed(() => {
  if (!stock.value) return 0
  const val = stock.value.price * quantity.value
  return parseFloat(val.toFixed(2))
})

const totalWithFee = computed(() => {
  const val =
    tradeType.value === 'Compra'
      ? totalEstimated.value + estimatedFee
      : totalEstimated.value - estimatedFee
  return parseFloat(val.toFixed(2))
})

const orderBookData = computed(() => {
  if (!stock.value) return []
  const basePrice = stock.value.price
  return [
    { qtdBuy: 24, buy: basePrice - 0.02, sell: basePrice + 0.01, qtdSell: 24 },
    { qtdBuy: 73, buy: basePrice - 0.1, sell: basePrice + 0.05, qtdSell: 73 },
    { qtdBuy: 156, buy: basePrice - 0.18, sell: basePrice + 0.08, qtdSell: 156 },
    { qtdBuy: 12, buy: basePrice - 0.31, sell: basePrice + 0.12, qtdSell: 12 },
  ]
})

function currency(val: number) {
  return val?.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

async function refreshPosition() {
  if (!stock.value) return
  await portfolioStore.fetchPortfolio()
  const pos = await portfolioStore.getPositionByTicker(stock.value.ticker)
  currentPosition.value = pos || null
}

// --- LÓGICA PRINCIPAL DE EXECUÇÃO ---

async function confirmTrade() {
  if (!stock.value) return

  isSubmitting.value = true

  const orderPayload = {
    ticker: stock.value.ticker,
    name: stock.value.name,
    logo: stock.value.logo,
    type: tradeType.value,
    qty: quantity.value,
    price: stock.value.price,
    total: totalEstimated.value,
    fees: estimatedFee,
    date: new Date().toISOString(),
  }

  try {
    await portfolioStore.executeTrade(orderPayload)
    await refreshPosition()

    showConfirmModal.value = false // Fecha a confirmação
    showTradeSuccessModal.value = true // <--- 3. Abre o modal de sucesso

    quantity.value = 1
  } catch (error) {
    console.error('Erro ao executar ordem', error)
    alert('Não foi possível executar a ordem. Verifique seu saldo.')
  } finally {
    isSubmitting.value = false
  }
}

// 4. Função para fechar o modal de sucesso (disparada pelo @confirm)
function handleTradeSuccess() {
  showTradeSuccessModal.value = false
}

// --- CICLO DE VIDA ---

onMounted(async () => {
  const ticker = route.params.ticker as string
  if (ticker) {
    isLoading.value = true
    try {
      const results = await stockService.search([ticker])
      stock.value = results.find((s) => s.ticker === ticker) || results[0] || null

      if (stock.value) {
        await refreshPosition()
      }
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }
})
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
      :loading="isSubmitting"
      class="text-body-1 font-weight-medium"
    >
      <div class="d-flex flex-column ga-3 mt-2">
        <div class="d-flex justify-space-between">
          <span>Ativo</span><span>{{ stock.ticker }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <span>Tipo</span
          ><span :class="tradeType === 'Compra' ? 'text-success' : 'text-error'">{{
            tradeType
          }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <span>Preço unit.</span><span>{{ currency(stock.price) }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <span>Quantidade</span><span>{{ quantity }}</span>
        </div>
      </div>

      <VDivider class="my-4" />

      <div class="d-flex justify-space-between mb-2">
        <span>Taxa corretagem</span><span>{{ currency(estimatedFee) }}</span>
      </div>
      <div class="d-flex justify-space-between mb-5">
        <span class="font-weight-black text-body-1">Total previsto</span>
        <span
          class="font-weight-black text-body-1"
          :class="tradeType === 'Compra' ? 'text-error' : 'text-success'"
        >
          {{ tradeType === 'Compra' ? '-' : '+' }} {{ currency(totalWithFee) }}
        </span>
      </div>

      <div
        v-if="tradeType === 'Compra' && totalWithFee > portfolioStore.balance"
        class="bg-error-lighten-5 text-error pa-3 rounded mb-4 text-center text-body-2"
      >
        Saldo insuficiente para realizar esta compra.
      </div>

      <div
        v-if="tradeType === 'Venda' && (!currentPosition || quantity > currentPosition.quantity)"
        class="bg-error-lighten-5 text-error pa-3 rounded mb-4 text-center text-body-2"
      >
        Quantidade indisponível para venda (Você tem {{ currentPosition?.quantity || 0 }}).
      </div>

      <p class="text-body-2 text-medium-emphasis text-justify mb-2 lh-tight">
        O custo estimado é baseado no último preço negociado. Ao confirmar, a ordem será enviada
        para execução imediata.
      </p>
    </AppModal>

    <AppSuccessModal
      v-model="showTradeSuccessModal"
      title="Ordem Executada!"
      :subtitle="`Sua ordem de ${tradeType.toLowerCase()} de ${quantity} ações de ${stock?.ticker} foi executada com sucesso.`"
      button-text="Fechar"
      @confirm="handleTradeSuccess"
    />

    <VFooter
      app
      fixed
      class="bg-border elevation-10 px-4 py-3 d-flex align-center justify-space-between"
    >
      <div>
        <div class="text-h6 lh-1">Total estimado</div>
        <div class="text-h6 font-weight-bold lh-1">{{ currency(totalWithFee) }}</div>
      </div>

      <div class="w-50">
        <AppButton
          :text="tradeType === 'Compra' ? 'Comprar' : 'Vender'"
          block
          @click="showConfirmModal = true"
          :disabled="
            (tradeType === 'Compra' && totalWithFee > portfolioStore.balance) ||
            (tradeType === 'Venda' && (!currentPosition || quantity > currentPosition.quantity))
          "
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
