<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">All Transactions</h2>
      <p class="text-gray-600">Manage and view all your transactions</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4 block"></i>
      <p class="text-gray-600">Loading transactions...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-600 p-4 mb-6 rounded">
      <div class="flex items-start">
        <i class="fas fa-exclamation-circle text-red-600 mr-4 mt-0.5"></i>
        <div>
          <h3 class="font-bold text-red-800">Error Loading Transactions</h3>
          <p class="text-red-700 text-sm mt-1">{{ error }}</p>
          <button @click="loadTransactions" class="mt-2 text-red-600 hover:text-red-800 font-medium underline">
            Try again
          </button>
        </div>
      </div>
    </div>

    <!-- Transactions table -->
    <div v-else class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-white">Transaction List ({{ transactions.length }})</h3>
        <button @click="refreshTransactions" class="bg-white text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg font-medium transition-colors duration-200 text-sm">
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': refreshing }"></i>
          <span class="ml-2">Refresh</span>
        </button>
      </div>
      <div class="p-6">
        <TransactionsTable :transactions="transactions" @edit="handleEdit" @delete="handleDelete" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TransactionsTable from './TransactionsTable.vue'
import { useTransactionsStore } from '../stores/transactions'
import { TransactionAPI, ApiUtils } from '../services/api'
import type { Transaction } from '../services/api'

const router = useRouter()
const store = useTransactionsStore()

// State
const transactions = ref<Transaction[]>([])
const loading = ref(false)
const error = ref('')
const refreshing = ref(false)

/**
 * Load transactions from API
 */
async function loadTransactions() {
  loading.value = true
  error.value = ''

  try {
    const data = await TransactionAPI.getAll()
    transactions.value = Array.isArray(data) ? data : []
    // Also sync with local store if needed
    store.transactions.length = 0
    store.transactions.push(...transactions.value)
  } catch (err) {
    error.value = ApiUtils.formatError(err)
    console.error('Error loading transactions:', err)
  } finally {
    loading.value = false
  }
}

/**
 * Refresh transactions (with loading indicator)
 */
async function refreshTransactions() {
  refreshing.value = true
  await loadTransactions()
  refreshing.value = false
}

/**
 * Handle edit action (navigate to detail/edit page)
 */
function handleEdit(tx: Transaction) {
  console.log('Edit transaction:', tx)
  // TODO: Navigate to edit modal or edit page when implemented
  // router.push({ path: `/transactions/${tx.id}/edit` })
}

/**
 * Handle delete action
 */
async function handleDelete(tx: Transaction) {
  if (!confirm(`Are you sure you want to delete "${tx.title}"?`)) {
    return
  }

  try {
    await TransactionAPI.delete(tx.id)
    // Remove from local state
    transactions.value = transactions.value.filter(t => t.id !== tx.id)
    // Also sync with store
    store.remove(tx.id)
    
    // Show success message
    console.log('Transaction deleted successfully')
  } catch (err) {
    alert(`Failed to delete transaction: ${ApiUtils.formatError(err)}`)
    console.error('Error deleting transaction:', err)
  }
}

// Load transactions on component mount
onMounted(() => {
  loadTransactions()
})
</script>

<style scoped>
</style>
