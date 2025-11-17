<script setup lang="ts">
import AppLogoIcon from '@/components/icons/AppLogoIcon.vue'
import { ref } from 'vue'
import { VSpacer } from 'vuetify/components'

const isDrawerOpen = ref(false)

const navItems = [
  { title: 'Landing', icon: 'mdi-application', to: '/' },
  { title: 'Login', icon: 'mdi-login', to: '/login' },
  { title: 'Cadastrar-se', icon: 'mdi-account-plus-outline', to: '/register' },
  { title: 'Portfolio', icon: 'mdi-wallet', to: '/app/portfolio' },
  { title: 'Trade', icon: 'mdi-chart-line', to: '/app/trade' },
  { title: 'Ordens', icon: 'mdi-format-list-bulleted', to: '/app/orders' },
]
</script>

<template>
  <VNavigationDrawer v-model="isDrawerOpen" temporary>
    <VList nav>
      <VListItem
        v-for="item in navItems"
        :key="item.title"
        :title="item.title"
        :prepend-icon="item.icon"
        :to="item.to"
      />
    </VList>
  </VNavigationDrawer>
  <VAppBar color="surface" flat class="pa-2 position-relative">
    <slot name="actionsLeft">
      <VBtn
        variant="text"
        @click="isDrawerOpen = !isDrawerOpen"
        class="ma-2 text-none"
        append-icon="mdi-triangle-small-down"
      >
        <AppLogoIcon />
      </VBtn>
    </slot>

    <VSpacer />

    <slot name="actionsRight">
      <VBtn
        variant="text"
        density="compact"
        class="ma-2"
        icon="mdi-account-circle-outline"
        size="x-large"
        to="/app/profile"
      ></VBtn>
    </slot>
  </VAppBar>
</template>

<style scoped></style>
