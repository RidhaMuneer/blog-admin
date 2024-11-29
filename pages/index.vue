<template>
  <div class="dashboard">
    <h1 class="dashboard-title">Dashboard</h1>
    <BlogPostCards />
  </div>
</template>

<script lang="ts" setup>
import BlogPostCards from '~/components/BlogPostCards.vue';
</script>

<style scoped>
.dashboard {
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
}

.dashboard-title {
  text-align: left;
  width: 100%;
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 32px;
}
</style>