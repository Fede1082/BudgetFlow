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
            class="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
        </div>
        
        <div class="flex items-center gap-6">
          <!-- Notifications -->
          <button class="relative text-gray-600 hover:text-gray-900 transition-colors">
            <i class="fas fa-bell text-lg"></i>
            <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <!-- User Profile -->
          <div class="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-900">Federico</p>
              <p class="text-xs text-gray-500">Admin</p>
            </div>
            <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              F
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
