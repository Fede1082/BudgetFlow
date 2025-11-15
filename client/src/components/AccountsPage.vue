<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Accounts</h2>
      <p class="text-gray-600">Manage your bank accounts and savings</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <h3 class="text-lg font-bold text-white">Main Account</h3>
        </div>
        <div class="p-6">
          <p class="text-gray-600 text-sm mb-3">Checking Account</p>
          <p class="text-3xl font-bold text-blue-600">€2,500.00</p>
          <div class="mt-4 pt-4 border-t border-gray-200">
            <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors duration-150">
              <i class="fas fa-edit mr-2"></i>Manage
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        <div class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
          <h3 class="text-lg font-bold text-white">Savings Account</h3>
        </div>
        <div class="p-6">
          <p class="text-gray-600 text-sm mb-3">High Yield Savings</p>
          <p class="text-3xl font-bold text-green-600">€5,000.00</p>
          <div class="mt-4 pt-4 border-t border-gray-200">
            <button class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors duration-150">
              <i class="fas fa-edit mr-2"></i>Manage
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border-2 border-dashed border-gray-300">
        <div class="px-6 py-4 flex items-center justify-center h-32 cursor-pointer hover:bg-gray-50 transition-colors duration-150">
          <div class="text-center">
            <i class="fas fa-plus text-3xl text-gray-400 mb-2 block"></i>
            <p class="text-gray-600 font-medium">Add New Account</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-8 border-l-4 border-blue-600">
      <h3 class="text-xl font-bold text-gray-900 mb-4">Coming Soon</h3>
      <p class="text-gray-700">More features for accounts management are being developed. Stay tuned!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
