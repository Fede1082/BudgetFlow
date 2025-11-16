<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TransactionAPI } from '../services/api'
import type { Transaction } from '../services/api'
import VueApexCharts from 'vue3-apexcharts'

// Chart state
const isLoading = ref(false)
const error = ref('')

// Series and options
const series = ref<number[]>([])
const chartOptions = ref<any>({})

// Color palette for categories
const categoryColors: Record<string, string> = {
  salary: '#10b981',
  food: '#f59e0b',
  housing: '#3b82f6',
  transport: '#8b5cf6',
  entertainment: '#ec4899',
  utilities: '#6366f1',
  healthcare: '#d946ef',
  other: '#6b7280',
}

/**
 * Load transactions and aggregate by category
 */
async function loadData() {
  isLoading.value = true
  error.value = ''

  try {
    const transactions = await TransactionAPI.getAll()

    // Aggregate expenses by category
    const categoryMap: Record<string, number> = {}
    const labels: string[] = []

    transactions.forEach((tx: Transaction) => {
      // Only count expenses (negative amounts)
      if (tx.amount < 0) {
        const category = tx.category || 'other'
        const amount = Math.abs(tx.amount)
        categoryMap[category] = (categoryMap[category] || 0) + amount
      }
    })

    // Sort by amount descending
    const sortedCategories = Object.entries(categoryMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8) // Limit to 8 categories for readability

    const data = sortedCategories.map(([, amount]) => Math.round(amount * 100) / 100)
    const categoryLabels = sortedCategories.map(([cat]) => cat)

    series.value = data

    chartOptions.value = {
      chart: {
        type: 'donut',
        toolbar: {
          show: true,
        },
      },
      labels: categoryLabels,
      colors: categoryLabels.map((cat) => categoryColors[cat.toLowerCase()] || '#9ca3af'),
      legend: {
        position: 'right',
      },
      dataLabels: {
        formatter: (val: any) => {
          return Math.round(val) + '%'
        },
      },
      tooltip: {
        y: {
          formatter: (val: any) => '€' + val.toFixed(2),
        },
      },
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error loading data'
    console.error('Error loading spending data:', err)
  } finally {
    isLoading.value = false
  }
}

// Load data on mount
onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <!-- Header -->
    <div class="mb-6">
      <h3 class="text-xl font-bold text-gray-900">Spending by Category</h3>
      <p class="text-gray-600 text-sm mt-1">Your expense breakdown</p>
    </div>

    <!-- Error state -->
    <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-700 text-sm">{{ error }}</p>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-gray-600">
        <i class="fas fa-spinner animate-spin text-2xl mb-2 block"></i>
        Loading chart...
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="series.length === 0" class="flex items-center justify-center py-12">
      <div class="text-center text-gray-600">
        <i class="fas fa-chart-pie text-4xl mb-2 block text-gray-400"></i>
        <p>No expenses yet</p>
      </div>
    </div>

    <!-- Chart -->
    <div v-else>
      <VueApexCharts
        type="donut"
        height="350"
        :series="series"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
