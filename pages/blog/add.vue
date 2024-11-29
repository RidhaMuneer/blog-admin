<template>
  <div class="add-blog-container">
    <BlogPostForm />
  </div>
</template>

<script lang="ts" setup>
import BlogPostForm from "~/components/BlogPostForm.vue";
</script>

<style scoped>
.add-blog-container {
  margin: 0 auto;
  padding: 32px 16px;
  max-width: 100%;
}
</style>