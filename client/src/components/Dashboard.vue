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
  totalSavings: 0,
})
const recentTransactions = ref<Transaction[]>([])
const statsLoading = ref(false)
const userName = ref('User')
const timeframeFilter = ref('This month')

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
    const income = summary.totalIncome || 0
    const expenses = summary.totalExpenses || 0
    stats.value = {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses,
      totalSavings: Math.max(0, income - expenses),
    }
  } catch (err) {
    console.error('Error loading stats:', err)
    // Fall back to store data
    stats.value = {
      totalIncome: 3000,
      totalExpenses: 920.5,
      netBalance: 3000 - 920.5,
      totalSavings: 2079.5,
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
  <div>
    <!-- Header with Welcome Message -->
    <div class="mb-8">
      <h2 class="text-4xl font-bold text-gray-900 mb-1">Welcome back, Federico!</h2>
      <p class="text-gray-600">It is the best time to manage your finances</p>
    </div>

    <!-- Controls Row -->
    <div class="flex items-center justify-between mb-8">
      <button class="flex items-center gap-2 text-gray-700 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
        <i class="fas fa-calendar"></i>
        <span class="text-sm font-medium">This month</span>
      </button>
      <div class="flex items-center gap-3">
        <button class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <i class="fas fa-sliders-h"></i>
          <span class="text-sm font-medium">Manage widgets</span>
        </button>
        <button class="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <i class="fas fa-plus"></i>
          <span class="text-sm font-medium">Add new widget</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards Grid (4 columns) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Balance Card -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between mb-4">
          <div>
            <p class="text-gray-600 text-sm font-medium">Total balance</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.netBalance.toFixed(2) }}€</p>
          </div>
          <a href="#" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-arrow-up-right text-lg"></i>
          </a>
        </div>
        <p class="text-xs text-green-600 font-medium">↑ 13.1% <span class="text-gray-500">vs last month</span></p>
      </div>

      <!-- Income Card -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between mb-4">
          <div>
            <p class="text-gray-600 text-sm font-medium">Income</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalIncome.toFixed(2) }}€</p>
          </div>
          <a href="#" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-arrow-up-right text-lg"></i>
          </a>
        </div>
        <p class="text-xs text-green-600 font-medium">↑ 6.3% <span class="text-gray-500">vs last month</span></p>
      </div>

      <!-- Expense Card -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between mb-4">
          <div>
            <p class="text-gray-600 text-sm font-medium">Expense</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalExpenses.toFixed(2) }}€</p>
          </div>
          <a href="#" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-arrow-up-right text-lg"></i>
          </a>
        </div>
        <p class="text-xs text-red-600 font-medium">↑ 2.4% <span class="text-gray-500">vs last month</span></p>
      </div>

      <!-- Total Savings Card -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between mb-4">
          <div>
            <p class="text-gray-600 text-sm font-medium">Total savings</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalSavings.toFixed(2) }}€</p>
          </div>
          <a href="#" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-arrow-up-right text-lg"></i>
          </a>
        </div>
        <p class="text-xs text-green-600 font-medium">↑ 12.1% <span class="text-gray-500">vs last month</span></p>
      </div>
    </div>

    <!-- Charts Grid - Money Flow takes 2/3, Budget & Savings on right -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Money Flow Chart - 2 columns -->
      <div class="lg:col-span-2">
        <CashflowChart />
      </div>
      
      <!-- Right Column: Budget and Spending By Category -->
      <div class="flex flex-col gap-6">
        <!-- Budget Widget -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="bg-gradient-to-r from-blue-100 to-blue-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">
            <h3 class="text-lg font-bold text-gray-900">Budget</h3>
            <a href="#" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-arrow-up-right"></i>
            </a>
          </div>
          <div class="p-6">
            <div class="text-center">
              <p class="text-sm text-gray-600 mb-2">Used Budget</p>
              <p class="text-3xl font-bold text-gray-900 mb-4">$400</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div class="bg-blue-600 h-2 rounded-full" style="width: 65%"></div>
              </div>
              <p class="text-xs text-gray-500">Total: $5,950</p>
            </div>
          </div>
        </div>

        <!-- Spending By Category -->
        <SpendingByCategory />
      </div>
    </div>

    <!-- Recent Transactions - Full Width Below -->
    <div class="mb-8">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="bg-gradient-to-r from-blue-100 to-blue-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <h3 class="text-lg font-bold text-gray-900">Recent transactions</h3>
          <button @click="goToTransactions" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
            See all <i class="fas fa-arrow-right ml-1"></i>
          </button>
        </div>
        <div class="p-6">
          <TransactionsTable
            :transactions="recentTransactions.length > 0 ? recentTransactions.slice(0, 5) : store.transactions.slice(0, 5)"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* small scoped styles if needed */
</style>
