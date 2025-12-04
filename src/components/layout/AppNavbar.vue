<script setup lang="ts">
import AppLogoIcon from '@/components/common/AppLogoIcon.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  color: {
    type: String,
    default: 'surface',
  },
  flat: {
    type: Boolean,
    default: true,
  },
})

const router = useRouter()
const isDrawerOpen = ref(false)

const navItems = [
  { title: 'Portfolio', icon: 'mdi-wallet-outline', to: '/app' },
  { title: 'Trade', icon: 'mdi-chart-line', to: '/app/trade' },
  { title: 'Ordens', icon: 'mdi-format-list-bulleted', to: '/app/orders' },
  { title: 'Extrato', icon: 'mdi-bank-outline', to: '/app/bank' },
  { title: 'Perfil', icon: 'mdi-account-outline', to: '/app/profile' },
]

function handleLogout() {
  router.push('/login')
}

function goToProfile() {
  router.push('/app/profile')
}
</script>

<template>
  <VNavigationDrawer v-model="isDrawerOpen" temporary>
    <div class="pa-4">
      <span class="text-h5 font-weight-bold">Menu</span>
    </div>

    <VDivider />

    <VList nav>
      <VListItem
        v-for="item in navItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :to="item.to"
        class="py-2 text-h6"
      >
        <template v-slot:title>
          <div class="text-h6 font-weight-regular">{{ item.title }}</div>
        </template>
      </VListItem>
    </VList>

    <template v-slot:append>
      <div class="pa-2">
        <VBtn
          block
          color="error"
          variant="text"
          class="text-h6 text-uppercase"
          prepend-icon="mdi-logout"
          @click="handleLogout"
        >
          Sair
        </VBtn>
      </div>
    </template>
  </VNavigationDrawer>

  <VAppBar :color="color" :flat="flat" class="pa-2 pl-1 pl-md-4 pr-5 pr-md-10">
    <VBtn
      variant="plain"
      class="text-none opacity-100"
      :ripple="false"
      append-icon="mdi-triangle-small-down"
      @click="isDrawerOpen = !isDrawerOpen"
    >
      <AppLogoIcon />
    </VBtn>

    <VSpacer />

    <div>
      <VBtn icon class="mr-2">
        <VBadge dot color="error">
          <VIcon icon="mdi-bell-outline" />
        </VBadge>
      </VBtn>

      <VAvatar
        size="40"
        image="https://i.pravatar.cc/150?img=12"
        class="cursor-pointer elevation-2"
        @click="goToProfile"
      />
    </div>
  </VAppBar>
</template>
