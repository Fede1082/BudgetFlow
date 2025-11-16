<script setup lang="ts">
import { ref, computed } from 'vue'
import { TransactionAPI } from '../services/api'
import type { Transaction } from '../services/api'

interface Props {
  isOpen: boolean
  transaction?: Transaction | null
}

interface Emits {
  (e: 'close'): void
  (e: 'save', transaction: Transaction): void
}

const props = withDefaults(defineProps<Props>(), {
  transaction: null,
})

const emit = defineEmits<Emits>()

// Form state
const form = ref<{
  title: string
  amount: number
  date: string
  category: string
  notes: string
  type: 'income' | 'expense'
}>({
  title: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0] ?? '',
  category: 'other',
  notes: '',
  type: 'expense',
})

const isLoading = ref(false)
const error = ref('')

// Computed
const isEditMode = computed(() => !!props.transaction)
const modalTitle = computed(() => (isEditMode.value ? 'Edit Transaction' : 'Add Transaction'))

// Initialize form when transaction changes
const initializeForm = () => {
  if (props.transaction) {
    form.value = {
      title: props.transaction.title,
      amount: Math.abs(props.transaction.amount),
      date: props.transaction.date,
      category: props.transaction.category || 'other',
      notes: props.transaction.notes || '',
      type: props.transaction.amount > 0 ? 'income' : 'expense',
    }
  } else {
    form.value = {
      title: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0] ?? '',
      category: 'other',
      notes: '',
      type: 'expense',
    }
  }
  error.value = ''
}

// Watch for modal open
const handleOpenModal = () => {
  if (props.isOpen) {
    initializeForm()
  }
}

// Save transaction
const handleSave = async () => {
  if (!form.value.title.trim()) {
    error.value = 'Title is required'
    return
  }

  if (form.value.amount <= 0) {
    error.value = 'Amount must be greater than 0'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    let savedTransaction: Transaction

    if (isEditMode.value && props.transaction) {
      // Update existing transaction
      savedTransaction = await TransactionAPI.update(props.transaction.id, {
        title: form.value.title,
        amount: form.value.amount,
        date: form.value.date ?? new Date().toISOString().split('T')[0],
        category: form.value.category,
        notes: form.value.notes,
      })
    } else {
      // Create new transaction
      savedTransaction = await TransactionAPI.create({
        title: form.value.title,
        amount: form.value.amount,
        date: form.value.date ?? new Date().toISOString().split('T')[0],
        category: form.value.category,
        notes: form.value.notes,
      })
    }

    emit('save', savedTransaction)
    close()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error saving transaction'
    console.error('Error saving transaction:', err)
  } finally {
    isLoading.value = false
  }
}

// Close modal
const close = () => {
  emit('close')
}

// Expose for parent component
defineExpose({
  open: handleOpenModal,
})
</script>

<template>
  <!-- Backdrop -->
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="close"
    >
      <!-- Modal -->
      <div
        class="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4"
        @click.stop
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <h3 class="text-xl font-bold text-white">{{ modalTitle }}</h3>
          <button
            @click="close"
            class="text-white hover:text-blue-100 transition-colors"
            aria-label="Close modal"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Error message -->
          <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-700 text-sm">{{ error }}</p>
          </div>

          <!-- Form fields -->
          <div class="space-y-4">
            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                Title <span class="text-red-500">*</span>
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                placeholder="e.g., Salary, Groceries, Rent"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Type -->
            <div>
              <label for="type" class="block text-sm font-medium text-gray-700 mb-1">
                Type <span class="text-red-500">*</span>
              </label>
              <select
                id="type"
                v-model="form.type"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <!-- Amount -->
            <div>
              <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">
                Amount (€) <span class="text-red-500">*</span>
              </label>
              <input
                id="amount"
                v-model.number="form.amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Date -->
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700 mb-1">
                Date <span class="text-red-500">*</span>
              </label>
              <input
                id="date"
                v-model="form.date"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Category -->
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                v-model="form.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="salary">Salary</option>
                <option value="food">Food</option>
                <option value="housing">Housing</option>
                <option value="transport">Transport</option>
                <option value="entertainment">Entertainment</option>
                <option value="utilities">Utilities</option>
                <option value="healthcare">Healthcare</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- Notes -->
            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                v-model="form.notes"
                placeholder="Optional notes..."
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
          <button
            @click="close"
            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            :disabled="isLoading"
          >
            Cancel
          </button>
          <button
            @click="handleSave"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <i class="fas fa-spinner animate-spin"></i>
              Saving...
            </span>
            <span v-else>{{ isEditMode ? 'Update' : 'Save' }}</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
