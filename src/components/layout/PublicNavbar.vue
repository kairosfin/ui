<script setup lang="ts">
import AppLogoIcon from '@/components/common/AppLogoIcon.vue'
import { ref } from 'vue'
import AppButton from '../common/AppButton.vue'

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

const emit = defineEmits(['click-register'])

const isDrawerOpen = ref(false)

const navItems = [
  { title: 'Home', icon: 'mdi-home-outline', to: '/' },
  { title: 'Login', icon: 'mdi-login', to: '/login' },
]
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
  </VNavigationDrawer>

  <VAppBar :color="color" :flat="flat" class="pa-2 pl-1 pl-md-5 pr-5 pr-md-10">
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

    <AppButton
      text="Abra sua conta"
      color="background"
      :block="false"
      @click="emit('click-register')"
    />
  </VAppBar>
</template>
