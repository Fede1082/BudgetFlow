<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TransactionAPI } from '../services/api'
import type { Transaction } from '../services/api'
import VueApexCharts from 'vue3-apexcharts'

// Chart state
const isLoading = ref(false)
const error = ref('')
const timeframe = ref<'month' | 'year'>('month')

// Series data
const series = ref<any[]>([])
const chartOptions = ref<any>({})

/**
 * Load transactions and aggregate by month/year
 */
async function loadData() {
  isLoading.value = true
  error.value = ''

  try {
    const transactions = await TransactionAPI.getAll()

    // Calculate current month and year
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    if (timeframe.value === 'month') {
      // Process monthly data (last 12 months)
      const monthlyIncome: number[] = []
      const monthlyExpenses: number[] = []
      const monthlyLabels: string[] = []

      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - i, 1)
        const month = date.toLocaleDateString('en-US', { month: 'short' })
        monthlyLabels.push(month)

        const monthTransactions = transactions.filter((tx: Transaction) => {
          const txDate = new Date(tx.date)
          return (
            txDate.getMonth() === date.getMonth() &&
            txDate.getFullYear() === date.getFullYear()
          )
        })

        const income = monthTransactions
          .filter((tx: Transaction) => tx.amount > 0)
          .reduce((sum, tx: Transaction) => sum + tx.amount, 0)

        const expenses = monthTransactions
          .filter((tx: Transaction) => tx.amount < 0)
          .reduce((sum, tx: Transaction) => sum + Math.abs(tx.amount), 0)

        monthlyIncome.push(Math.round(income * 100) / 100)
        monthlyExpenses.push(Math.round(expenses * 100) / 100)
      }

      series.value = [
        {
          name: 'Income',
          data: monthlyIncome,
        },
        {
          name: 'Expenses',
          data: monthlyExpenses,
        },
      ]

      chartOptions.value = {
        chart: {
          type: 'bar',
          toolbar: {
            show: true,
          },
          stacked: false,
          sparkline: {
            enabled: false,
          },
        },
        colors: ['#3b82f6', '#ef4444'],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '65%',
            borderRadius: 3,
            borderRadiusApplication: 'end',
            dataLabels: {
              position: 'top',
            },
            distributed: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        xaxis: {
          categories: monthlyLabels,
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          title: {
            text: undefined,
          },
        },
        yaxis: {
          title: {
            text: 'Amount (€)',
            style: {
              fontSize: '12px',
              fontWeight: 600,
              color: '#374151',
            },
          },
          axisBorder: {
            show: false,
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: (val: any) => {
              return '€ ' + val.toFixed(2)
            },
          },
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          fontSize: '13px',
          fontFamily: 'inherit',
          offsetY: 5,
        },
        grid: {
          borderColor: '#e5e7eb',
          strokeDashArray: 0,
          yaxis: {
            lines: {
              show: true,
            },
          },
          xaxis: {
            lines: {
              show: false,
            },
          },
        },
      }
    } else {
      // Process yearly data (last 5 years)
      const yearlyIncome: number[] = []
      const yearlyExpenses: number[] = []
      const yearlyLabels: string[] = []

      for (let i = 4; i >= 0; i--) {
        const year = currentYear - i
        yearlyLabels.push(year.toString())

        const yearTransactions = transactions.filter((tx: Transaction) => {
          const txDate = new Date(tx.date)
          return txDate.getFullYear() === year
        })

        const income = yearTransactions
          .filter((tx: Transaction) => tx.amount > 0)
          .reduce((sum, tx: Transaction) => sum + tx.amount, 0)

        const expenses = yearTransactions
          .filter((tx: Transaction) => tx.amount < 0)
          .reduce((sum, tx: Transaction) => sum + Math.abs(tx.amount), 0)

        yearlyIncome.push(Math.round(income * 100) / 100)
        yearlyExpenses.push(Math.round(expenses * 100) / 100)
      }

      series.value = [
        {
          name: 'Income',
          data: yearlyIncome,
        },
        {
          name: 'Expenses',
          data: yearlyExpenses,
        },
      ]

      chartOptions.value = {
        chart: {
          type: 'bar',
          toolbar: {
            show: true,
          },
          stacked: false,
          sparkline: {
            enabled: false,
          },
        },
        colors: ['#3b82f6', '#ef4444'],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '65%',
            borderRadius: 3,
            borderRadiusApplication: 'end',
            dataLabels: {
              position: 'top',
            },
            distributed: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        xaxis: {
          categories: yearlyLabels,
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          title: {
            text: undefined,
          },
        },
        yaxis: {
          title: {
            text: 'Amount (€)',
            style: {
              fontSize: '12px',
              fontWeight: 600,
              color: '#374151',
            },
          },
          axisBorder: {
            show: false,
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: (val: any) => {
              return '€ ' + val.toFixed(2)
            },
          },
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          fontSize: '13px',
          fontFamily: 'inherit',
          offsetY: 5,
        },
        grid: {
          borderColor: '#e5e7eb',
          strokeDashArray: 0,
          yaxis: {
            lines: {
              show: true,
            },
          },
          xaxis: {
            lines: {
              show: false,
            },
          },
        },
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error loading data'
    console.error('Error loading cashflow data:', err)
  } finally {
    isLoading.value = false
  }
}

/**
 * Change timeframe and update chart
 */
async function changeTimeframe(newTimeframe: 'month' | 'year') {
  timeframe.value = newTimeframe
  await loadData()
}

// Load data on mount
onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-gray-900">Cashflow Trend</h3>
      <div class="flex gap-2">
        <button
          @click="changeTimeframe('month')"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            timeframe === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          Last 12 Months
        </button>
        <button
          @click="changeTimeframe('year')"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            timeframe === 'year'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          Last 5 Years
        </button>
      </div>
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

    <!-- Chart -->
    <div v-else>
      <VueApexCharts
        type="bar"
        height="350"
        :series="series"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
