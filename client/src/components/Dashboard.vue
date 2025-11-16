<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TransactionsTable from './TransactionsTable.vue'
import CashflowChart from './CashflowChart.vue'
import SpendingByCategory from './SpendingByCategory.vue'
import { useTransactionsStore } from '../stores/transactions'
import { TransactionAPI, StatsAPI, HealthAPI } from '../services/api'
import type { Transaction } from '../services/api'

const store = useTransactionsStore()
const router = useRouter()

// Stats state
const stats = ref({
  totalIncome: 0,
  totalExpenses: 0,
  netBalance: 0,
})
const recentTransactions = ref<Transaction[]>([])
const statsLoading = ref(false)

function goToTransactions() {
  router.push({ path: '/transactions' })
}

function handleEdit(tx: any) {
  // Navigate to transactions page with the transaction to edit
  router.push({ path: '/transactions' })
}

function handleDelete(tx: any) {
  store.remove(tx.id || tx)
}

/**
 * Load statistics from API
 */
async function loadStats() {
  statsLoading.value = true

  await HealthAPI.check().then((res) => {
    console.log('API Health:', res)
  })
  try {
    const summary = await StatsAPI.getSummary()
    stats.value = {
      totalIncome: summary.totalIncome || 0,
      totalExpenses: summary.totalExpenses || 0,
      netBalance: (summary.totalIncome || 0) - (summary.totalExpenses || 0),
    }
  } catch (err) {
    console.error('Error loading stats:', err)
    // Fall back to store data
    stats.value = {
      totalIncome: 3000,
      totalExpenses: 920.5,
      netBalance: 3000 - 920.5,
    }
  }
}

/**
 * Load recent transactions
 */
async function loadRecentTransactions() {
  try {
    const transactions = await TransactionAPI.getAll()
    // Get only the 5 most recent
    recentTransactions.value = Array.isArray(transactions) 
      ? transactions.slice(0, 5) 
      : []
  } catch (err) {
    console.error('Error loading recent transactions:', err)
    // Fall back to store data
    recentTransactions.value = store.transactions.slice(0, 5)
  } finally {
    statsLoading.value = false
  }
}

// Load data on component mount
onMounted(() => {
  loadStats()
  loadRecentTransactions()
})
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
      <p class="text-gray-600">Welcome to your budget overview</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-600">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-600 text-sm font-semibold">Total Income</p>
            <p class="text-3xl font-bold text-green-700 mt-2">+{{ stats.totalIncome.toFixed(2) }}€</p>
          </div>
          <i class="fas fa-arrow-up text-4xl text-green-200"></i>
        </div>
      </div>
      <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-md p-6 border-l-4 border-red-600">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-red-600 text-sm font-semibold">Total Expenses</p>
            <p class="text-3xl font-bold text-red-700 mt-2">-{{ stats.totalExpenses.toFixed(2) }}€</p>
          </div>
          <i class="fas fa-arrow-down text-4xl text-red-200"></i>
        </div>
      </div>
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-blue-600">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-600 text-sm font-semibold">Net Balance</p>
            <p class="text-3xl font-bold text-blue-700 mt-2">+{{ stats.netBalance.toFixed(2) }}€</p>
          </div>
          <i class="fas fa-wallet text-4xl text-blue-200"></i>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <CashflowChart />
      <SpendingByCategory />
    </div>

    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
        <h3 class="text-xl font-bold text-white">Recent Transactions</h3>
        <button @click="goToTransactions" class="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm">
          <i class="fas fa-eye mr-2"></i>View All
        </button>
      </div>
      <div class="p-6">
        <TransactionsTable
          :transactions="recentTransactions.length > 0 ? recentTransactions : store.transactions"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* small scoped styles if needed */
</style>
