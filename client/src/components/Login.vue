<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // Simulate login - in a real app, you'd call an API
    // For now, we'll just store the user data in localStorage
    const userData = {
      email: email.value,
      name: email.value.split('@')[0],
      token: 'dummy-token-' + Date.now(),
    }

    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('isAuthenticated', 'true')

    // Redirect to dashboard
    await router.push('/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Login failed'
  } finally {
    loading.value = false
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleLogin()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center px-4">
    <!-- Login Card -->
    <div class="w-full max-w-md">
      <div class="bg-white rounded-lg shadow-xl p-8">
        <!-- Logo -->
        <div class="flex justify-center mb-8">
          <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-wallet text-white text-xl"></i>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-3xl font-bold text-gray-900 text-center mb-2">BudgetFlow</h1>
        <p class="text-gray-600 text-center mb-8">Finance Manager</p>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>

        <!-- Email Input -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            @keydown="handleKeyDown"
          />
        </div>

        <!-- Password Input -->
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            @keydown="handleKeyDown"
          />
        </div>

        <!-- Login Button -->
        <button
          @click="handleLogin"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <i v-if="loading" class="fas fa-spinner animate-spin"></i>
          <span>{{ loading ? 'Logging in...' : 'Login' }}</span>
        </button>

        <!-- Demo Credentials Info -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-900 font-medium mb-2">Demo Credentials:</p>
          <p class="text-xs text-blue-700">Email: <span class="font-mono">demo@example.com</span></p>
          <p class="text-xs text-blue-700">Password: <span class="font-mono">password</span></p>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-blue-100 mt-8 text-sm">
        © 2025 BudgetFlow. All rights reserved.
      </p>
    </div>
  </div>
</template>

<style scoped></style>
