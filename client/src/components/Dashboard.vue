<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TransactionsTable from './TransactionsTable.vue'
import { useTransactionsStore } from '../stores/transactions'

const store = useTransactionsStore()
const router = useRouter()

function goToTransactions() {
  router.push({ path: '/transactions' })
}

function handleEdit(tx: any) {
  // navigate to transaction detail/edit page (detail implemented)
  router.push({ path: `/transactions/${tx.id}` })
}

function handleDelete(tx: any) {
  store.remove(tx.id || tx)
}

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
            <p class="text-3xl font-bold text-green-700 mt-2">+3,000€</p>
          </div>
          <i class="fas fa-arrow-up text-4xl text-green-200"></i>
        </div>
      </div>
      <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-md p-6 border-l-4 border-red-600">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-red-600 text-sm font-semibold">Total Expenses</p>
            <p class="text-3xl font-bold text-red-700 mt-2">-920.5€</p>
          </div>
          <i class="fas fa-arrow-down text-4xl text-red-200"></i>
        </div>
      </div>
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-blue-600">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-600 text-sm font-semibold">Net Balance</p>
            <p class="text-3xl font-bold text-blue-700 mt-2">+2,079.5€</p>
          </div>
          <i class="fas fa-wallet text-4xl text-blue-200"></i>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
        <h3 class="text-xl font-bold text-white">Recent Transactions</h3>
        <div class="flex gap-3">
          <button @click="goToTransactions" class="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm">
            <i class="fas fa-plus mr-2"></i>Add Transaction
          </button>
          <button @click="store.clear" class="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
            <i class="fas fa-trash mr-2"></i>Clear All
          </button>
        </div>
      </div>
      <div class="p-6">
        <TransactionsTable
          :transactions="store.transactions"
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
