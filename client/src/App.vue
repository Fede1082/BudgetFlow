<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'

const route = useRoute()
const isAuthenticated = ref(false)

onMounted(() => {
  isAuthenticated.value = localStorage.getItem('isAuthenticated') === 'true'
})
</script>

<template>
  <div v-if="route.path === '/login'" class="min-h-screen">
    <router-view />
  </div>
  <div v-else class="flex min-h-screen bg-gray-50">
    <!-- Sidebar Navigation -->
    <Sidebar />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col">
      <!-- Top Header -->
      <Header />

      <!-- Page Content -->
      <div class="flex-1 overflow-auto">
        <div class="p-8 max-w-7xl">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
