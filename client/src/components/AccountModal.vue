<script setup lang="ts">
import { ref, computed } from 'vue'
import { AccountAPI } from '../services/api'
import type { Account } from '../services/api'

interface Props {
  isOpen: boolean
  account?: Account | null
}

interface Emits {
  (e: 'close'): void
  (e: 'save', account: Account): void
}

const props = withDefaults(defineProps<Props>(), {
  account: null,
})

const emit = defineEmits<Emits>()

// Form state
const form = ref<{
  name: string
  type: string
  balance: number
}>({
  name: '',
  type: 'checking',
  balance: 0,
})

const isLoading = ref(false)
const error = ref('')

// Computed
const isEditMode = computed(() => !!props.account)
const modalTitle = computed(() => (isEditMode.value ? 'Edit Account' : 'Add Account'))

// Initialize form when account changes
const initializeForm = () => {
  if (props.account) {
    form.value = {
      name: props.account.name,
      type: props.account.type,
      balance: props.account.balance,
    }
  } else {
    form.value = {
      name: '',
      type: 'checking',
      balance: 0,
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

// Save account
const handleSave = async () => {
  if (!form.value.name.trim()) {
    error.value = 'Account name is required'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    let savedAccount: Account

    if (isEditMode.value && props.account) {
      // Update existing account
      savedAccount = await AccountAPI.update(props.account.id, {
        name: form.value.name,
        type: form.value.type,
        balance: form.value.balance,
      })
    } else {
      // Create new account
      savedAccount = await AccountAPI.create({
        name: form.value.name,
        type: form.value.type,
        balance: form.value.balance,
      })
    }

    emit('save', savedAccount)
    close()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error saving account'
    console.error('Error saving account:', err)
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
            <!-- Account Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                Account Name <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="e.g., Main Account, Savings"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Account Type -->
            <div>
              <label for="type" class="block text-sm font-medium text-gray-700 mb-1">
                Account Type <span class="text-red-500">*</span>
              </label>
              <select
                id="type"
                v-model="form.type"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="credit_card">Credit Card</option>
                <option value="investment">Investment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- Balance -->
            <div>
              <label for="balance" class="block text-sm font-medium text-gray-700 mb-1">
                Balance (€) <span class="text-red-500">*</span>
              </label>
              <input
                id="balance"
                v-model.number="form.balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
            <span v-else>{{ isEditMode ? 'Update' : 'Create' }}</span>
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
