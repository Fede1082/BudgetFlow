<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Accounts</h2>
        <p class="text-gray-600">Manage your bank accounts and savings</p>
      </div>
      <button
        @click="openAddAccountModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-150 flex items-center gap-2"
      >
        <i class="fas fa-plus"></i>
        Add Account
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-gray-600">
        <i class="fas fa-spinner animate-spin text-3xl mb-2 block"></i>
        Loading accounts...
      </div>
    </div>

    <!-- Error state -->
    <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <!-- Accounts Grid -->
    <div v-if="!isLoading && accounts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="account in accounts"
        :key="account.id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
      >
        <div :class="`bg-gradient-to-r ${getBankIcon(account.name).bgColor} px-6 py-4 flex items-center gap-4`">
          <i :class="`${getBankIcon(account.name).icon} text-3xl text-white`"></i>
          <div>
            <h3 class="text-lg font-bold text-white">{{ account.name }}</h3>
            <p class="text-blue-100 text-sm">{{ account.type }}</p>
          </div>
        </div>
        <div class="p-6">
          <p class="text-gray-600 text-sm mb-3">Balance</p>
          <p class="text-3xl font-bold" :class="account.balance >= 0 ? 'text-blue-600' : 'text-red-600'">
            €{{ account.balance.toFixed(2) }}
          </p>
          <div class="mt-4 pt-4 border-t border-gray-200 flex gap-2">
            <button
              @click="openEditAccountModal(account)"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors duration-150 flex items-center justify-center gap-2"
            >
              <i class="fas fa-edit"></i>Edit
            </button>
            <button
              @click="deleteAccount(account.id)"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors duration-150 flex items-center justify-center gap-2"
            >
              <i class="fas fa-trash"></i>Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="!isLoading && accounts.length === 0"
      class="bg-white rounded-lg shadow-md p-12 text-center"
    >
      <i class="fas fa-inbox text-4xl text-gray-400 mb-4 block"></i>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No accounts yet</h3>
      <p class="text-gray-600 mb-6">Create your first account to get started</p>
      <button
        @click="openAddAccountModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-150 inline-flex items-center gap-2"
      >
        <i class="fas fa-plus"></i>
        Add Account
      </button>
    </div>

    <!-- Account Modal -->
    <AccountModal
      :is-open="isModalOpen"
      :account="selectedAccount"
      @close="closeModal"
      @save="handleAccountSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AccountAPI, type Account } from '../services/api'
import AccountModal from './AccountModal.vue'
import { getBankIcon } from '../utils/bankIcons'

const accounts = ref<Account[]>([])
const isLoading = ref(false)
const error = ref('')
const isModalOpen = ref(false)
const selectedAccount = ref<Account | null>(null)

// Load accounts on component mount
const loadAccounts = async () => {
  isLoading.value = true
  error.value = ''
  try {
    accounts.value = await AccountAPI.getAll()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error loading accounts'
    console.error('Error loading accounts:', err)
  } finally {
    isLoading.value = false
  }
}

// Open modal for adding new account
const openAddAccountModal = () => {
  selectedAccount.value = null
  isModalOpen.value = true
}

// Open modal for editing account
const openEditAccountModal = (account: Account) => {
  selectedAccount.value = account
  isModalOpen.value = true
}

// Close modal
const closeModal = () => {
  isModalOpen.value = false
  selectedAccount.value = null
}

// Handle account saved (create or update)
const handleAccountSaved = async (account: Account) => {
  await loadAccounts()
  closeModal()
}

// Delete account
const deleteAccount = async (id: string) => {
  if (!confirm('Are you sure you want to delete this account?')) {
    return
  }

  try {
    await AccountAPI.delete(id)
    await loadAccounts()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error deleting account'
    console.error('Error deleting account:', err)
  }
}

// Load accounts on mount
onMounted(() => {
  loadAccounts()
})
</script>

<style scoped>
</style>
