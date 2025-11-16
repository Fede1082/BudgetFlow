<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">All Transactions</h2>
        <p class="text-gray-600">Manage and view all your transactions</p>
      </div>
      <div class="flex gap-3">
        <button
          @click="openAddTransactionModal"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-150 flex items-center gap-2"
        >
          <i class="fas fa-plus"></i>
          Add Transaction
        </button>
        <button
          @click="clearAllTransactions"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-150 flex items-center gap-2"
        >
          <i class="fas fa-trash"></i>
          Clear All
        </button>
      </div>
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

    <!-- Transaction Modal -->
    <TransactionModal
      :is-open="isModalOpen"
      :transaction="selectedTransaction"
      @close="closeModal"
      @save="handleTransactionSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TransactionsTable from './TransactionsTable.vue'
import TransactionModal from './TransactionModal.vue'
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
const isModalOpen = ref(false)
const selectedTransaction = ref<Transaction | null>(null)

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
 * Open modal for adding new transaction
 */
function openAddTransactionModal() {
  selectedTransaction.value = null
  isModalOpen.value = true
}

/**
 * Handle edit action (open modal with transaction)
 */
function handleEdit(tx: Transaction) {
  selectedTransaction.value = tx
  isModalOpen.value = true
}

/**
 * Close modal
 */
function closeModal() {
  isModalOpen.value = false
  selectedTransaction.value = null
}

/**
 * Handle transaction saved (create or update)
 */
async function handleTransactionSaved(tx: Transaction) {
  await loadTransactions()
  closeModal()
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

/**
 * Clear all transactions
 */
async function clearAllTransactions() {
  if (!confirm('Are you sure you want to delete ALL transactions? This cannot be undone!')) {
    return
  }

  try {
    for (const tx of transactions.value) {
      await TransactionAPI.delete(tx.id)
    }
    transactions.value = []
    store.transactions.length = 0
    console.log('All transactions deleted successfully')
  } catch (err) {
    alert(`Failed to clear transactions: ${ApiUtils.formatError(err)}`)
    console.error('Error clearing transactions:', err)
  }
}

// Load transactions on component mount
onMounted(() => {
  loadTransactions()
})
</script>

<style scoped>
</style>
