<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="bg-gray-100 border-b-2 border-gray-300">
          <th class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Date</th>
          <th class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Title</th>
          <th class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Category</th>
          <th class="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Amount</th>
          <th class="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!transactions || transactions.length === 0" class="border-b border-gray-200 hover:bg-gray-50">
          <td colspan="5" class="px-6 py-8 text-center text-gray-500">
            <i class="fas fa-inbox text-3xl mb-2 block opacity-50"></i>
            <p>No transactions found. Start by adding one!</p>
          </td>
        </tr>
        <tr v-for="(tx, idx) in transactions" :key="tx.id" class="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150" :class="{ 'bg-gray-50': idx % 2 === 0 }">
          <td class="px-6 py-4 text-sm text-gray-600 font-medium">{{ formatDate(tx.date) }}</td>
          <td class="px-6 py-4 text-sm text-gray-900 font-semibold">{{ tx.title }}</td>
          <td class="px-6 py-4 text-sm">
            <span class="px-3 py-1 rounded-full text-xs font-medium" :class="getCategoryBadgeClass(tx.category)">
              {{ tx.category || 'N/A' }}
            </span>
          </td>
          <td class="px-6 py-4 text-sm font-bold text-right" :class="tx.amount >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ formatAmount(tx.amount) }}
          </td>
          <td class="px-6 py-4 text-sm text-center">
            <div class="inline-flex items-center gap-2">
              <button @click="view(tx)" class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded transition-colors duration-150">
                <i class="fas fa-eye mr-1"></i>View
              </button>
              <button @click="$emit('edit', tx)" class="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1 rounded transition-colors duration-150">
                <i class="fas fa-edit mr-1"></i>Edit
              </button>
              <button @click="$emit('delete', tx)" class="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded transition-colors duration-150">
                <i class="fas fa-trash mr-1"></i>Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ transactions: Array<Record<string, any>> }>()
const router = useRouter()

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('it-IT', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

function formatAmount(amount: number) {
  if (amount == null) return ''
  const sign = amount >= 0 ? '+' : ''
  return `${sign}${amount.toFixed(2)}€`
}

function getCategoryBadgeClass(category?: string) {
  const baseClass = 'inline-block px-3 py-1 rounded-full text-xs font-medium'
  const categoryLower = category?.toLowerCase() || ''
  
  if (categoryLower.includes('income') || categoryLower.includes('salary')) return `${baseClass} bg-green-100 text-green-800`
  if (categoryLower.includes('food') || categoryLower.includes('groceries')) return `${baseClass} bg-orange-100 text-orange-800`
  if (categoryLower.includes('housing') || categoryLower.includes('rent')) return `${baseClass} bg-purple-100 text-purple-800`
  if (categoryLower.includes('transport') || categoryLower.includes('car')) return `${baseClass} bg-blue-100 text-blue-800`
  return `${baseClass} bg-gray-100 text-gray-800`
}

function view(tx: any) {
  console.log('View transaction:', tx)
}
</script>

<style scoped>
</style>
