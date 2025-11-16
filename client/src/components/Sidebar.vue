<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  { icon: 'fas fa-chart-line', label: 'Dashboard', path: '/' },
  { icon: 'fas fa-exchange-alt', label: 'Transactions', path: '/transactions' },
  { icon: 'fas fa-credit-card', label: 'Wallet', path: '/accounts' },
  { icon: 'fas fa-bullseye', label: 'Goals', path: '/goals' },
  { icon: 'fas fa-calculator', label: 'Budget', path: '/budget' },
  { icon: 'fas fa-bar-chart', label: 'Analytics', path: '/analytics' },
  { icon: 'fas fa-cog', label: 'Settings', path: '/settings' },
]

const bottomItems = [
  { icon: 'fas fa-circle-question', label: 'Help', path: '/help' },
  { icon: 'fas fa-right-from-bracket', label: 'Log out', path: '/logout' },
]
</script>

<template>
  <div class="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white min-h-screen flex flex-col shadow-xl">
    <!-- Logo Section -->
    <div class="px-6 py-8 border-b border-blue-500">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
          <i class="fas fa-wallet text-blue-600 text-lg"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold">BudgetFlow</h1>
          <p class="text-xs text-blue-200">Finance Manager</p>
        </div>
      </div>
    </div>

    <!-- Main Menu Items -->
    <nav class="flex-1 px-4 py-8">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.path">
          <router-link
            :to="item.path"
            :class="[
              'flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all duration-200',
              route.path === item.path
                ? 'bg-blue-100 text-blue-700 shadow-md'
                : 'text-blue-100 hover:bg-blue-500/50 hover:text-white'
            ]"
          >
            <i :class="[item.icon, 'text-lg w-5 text-center']"></i>
            <span class="text-sm">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Bottom Menu Items -->
    <div class="border-t border-blue-500 px-4 py-4 space-y-2">
      <ul class="space-y-2">
        <li v-for="item in bottomItems" :key="item.path">
          <router-link
            :to="item.path"
            :class="[
              'flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all duration-200',
              route.path === item.path
                ? 'bg-blue-100 text-blue-700 shadow-md'
                : 'text-blue-100 hover:bg-blue-500/50 hover:text-white'
            ]"
          >
            <i :class="[item.icon, 'text-lg w-5 text-center']"></i>
            <span class="text-sm">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- User Profile Section (Bottom) -->
    <div class="border-t border-blue-500 px-4 py-4 flex items-center justify-between">
      <button class="w-10 h-10 rounded-full bg-blue-400 hover:bg-blue-300 flex items-center justify-center transition-colors" title="Profile">
        <i class="fas fa-user text-sm"></i>
      </button>
      <button class="w-10 h-10 rounded-full bg-blue-400 hover:bg-blue-300 flex items-center justify-center transition-colors" title="Theme">
        <i class="fas fa-moon text-sm"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Sidebar specific styles */
</style>
