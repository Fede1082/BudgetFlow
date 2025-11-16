<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userName = ref('User')
const showUserMenu = ref(false)

onMounted(() => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    const userData = JSON.parse(userStr)
    userName.value = userData.name || 'User'
  }
})

function handleLogout() {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('user')
  router.push('/login')
}

function getUserInitial() {
  return userName.value.charAt(0).toUpperCase()
}
</script>

<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="px-8 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="text-gray-600">
            <i class="fas fa-search text-lg"></i>
          </div>
          <input 
            type="text" 
            placeholder="Search..." 
            class="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        
        <div class="flex items-center gap-6">
          <!-- Notifications -->
          <button class="relative text-gray-600 hover:text-gray-900 transition-colors">
            <i class="fas fa-bell text-lg"></i>
            <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <!-- User Profile Dropdown -->
          <div class="relative">
            <button 
              @click="showUserMenu = !showUserMenu"
              class="flex items-center gap-3 pl-6 border-l border-gray-200 hover:opacity-80 transition-opacity"
            >
              <div class="text-right">
                <p class="text-sm font-semibold text-gray-900">{{ userName }}</p>
                <p class="text-xs text-gray-500">Admin</p>
              </div>
              <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {{ getUserInitial() }}
              </div>
            </button>

            <!-- User Menu Dropdown -->
            <div 
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              <div class="px-4 py-2 border-b border-gray-200">
                <p class="text-sm font-semibold text-gray-900">{{ userName }}</p>
                <p class="text-xs text-gray-500">admin@budgetflow.com</p>
              </div>
              <button
                class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <i class="fas fa-user text-gray-600"></i>
                <span class="text-sm">Profile</span>
              </button>
              <button
                class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <i class="fas fa-cog text-gray-600"></i>
                <span class="text-sm">Settings</span>
              </button>
              <div class="border-t border-gray-200"></div>
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <i class="fas fa-sign-out-alt text-red-600"></i>
                <span class="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* header-specific styles */
</style>
