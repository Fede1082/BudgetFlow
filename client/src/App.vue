<script setup lang="ts">
import Header from './components/Header.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Header />
    <div class="p-6">
      <router-view />
    </div>
  </div>
</template>

<style scoped></style>
