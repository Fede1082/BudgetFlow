<template>
  <header class="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between py-6">
        <div>
          <h1 class="text-4xl font-bold tracking-tight">BudgetFlow</h1>
          <p class="text-blue-100 text-sm mt-1">Manage your finances with ease</p>
        </div>
        <div class="text-right">
          <div class="text-sm text-blue-100">Welcome back!</div>
        </div>
      </div>

      <nav class="border-t border-blue-500">
        <ul class="flex gap-1 py-3">
          <li>
            <router-link to="/" :class="[
              'px-4 py-2 rounded-t-lg font-medium transition-all duration-200',
              $route.path === '/' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'text-blue-100 hover:bg-blue-700'
            ]">
              <i class="fas fa-home mr-2"></i>Dashboard
            </router-link>
          </li>
          <li>
            <router-link to="/transactions" :class="[
              'px-4 py-2 rounded-t-lg font-medium transition-all duration-200',
              $route.path === '/transactions' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'text-blue-100 hover:bg-blue-700'
            ]">
              <i class="fas fa-exchange-alt mr-2"></i>Transactions
            </router-link>
          </li>
          <li>
            <router-link to="/accounts" :class="[
              'px-4 py-2 rounded-t-lg font-medium transition-all duration-200',
              $route.path === '/accounts' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'text-blue-100 hover:bg-blue-700'
            ]">
              <i class="fas fa-piggy-bank mr-2"></i>Accounts
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
/* header-specific styles */
</style>
