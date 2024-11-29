<template>
  <div>
    <!-- Global Navigation -->
    <NavBar />

    <!-- Main Content Area -->
    <main class="content">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from '~/components/NavBar.vue';
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  color: #2c3e50;
  line-height: 1.6;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: #f4f5f7;
}

.content {
  max-width: 100%;
  padding: 32px 16px;
}
</style>