<template>
  <div class="blog-posts-container">
    <div class="blog-posts-header">
      <h2 class="blog-posts-title">Blog Posts</h2>
      <!-- Filter by status -->
      <select v-model="selectedStatus" class="status-filter">
        <option value="all">All Posts</option>
        <option value="published">Published</option>
        <option value="unpublished">Unpublished</option>
      </select>
    </div>

    <!-- Loading spinner for data fetching -->
    <div v-if="isLoading" class="loading-spinner">
      <div class="spinner"></div>
      <p>Loading blog posts...</p>
    </div>
    
    <!-- Blog Post Cards -->
    <div v-if="filteredBlogPosts.length > 0" class="blog-posts-grid">
      <div
        v-for="post in filteredBlogPosts"
        :key="post.id"
        class="blog-post-card"
      >
        <div class="blog-post-content">
          <h3 class="blog-post-title">{{ post.title }}</h3>
          <p class="blog-post-author">By {{ post.author }}</p>
          <p class="blog-post-excerpt">{{ truncateContent(post.content) }}</p>
        </div>
        <div class="blog-post-footer">
          <span :class="['blog-post-status', post.status]">
            {{ post.status }}
          </span>
          <div class="blog-post-actions">
            <button @click="editPost(post.id)" class="btn edit-btn">
              Edit
            </button>
            <button @click="confirmDelete(post.id)" class="btn delete-btn">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete this blog post?</p>
        <div class="modal-actions">
          <button
            @click="cancelDelete"
            class="btn cancel-btn"
            :disabled="isDeleting"
          >
            Cancel
          </button>
          <button
            @click="proceedDelete"
            class="btn confirm-btn"
            :disabled="isDeleting"
          >
            <span v-if="!isDeleting">Delete</span>
            <div v-else class="spinner spinner-small"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useApi } from "~/composables/useApi";
import { BlogPost } from "~/types/BlogPost";

/**
 * The loading state of the component.
 */
const isLoading = ref(true);

/**
 * The deleting state of the modal.
 */
const isDeleting = ref(false);

/**
 * The blogPosts array to store the fetched blog posts.
 */
const blogPosts = ref<BlogPost[]>([]);

/**
 * Composable for making API requests.
 */
const { fetchData, clearCache } = useApi();

/**
 * the state for showing the delete confirmation model
 */
const showConfirmModal = ref(false);

/**
 * The ID of the post to be deleted.
 */
const postToDelete = ref<number | null>(null);

/**
 * The blog post to be filtered.
 */
const selectedStatus = ref("all");

/**
 * Fetches the blog posts from the API and stores them in the component state.
 * The blog posts are stored in the blogPosts array.
 * If there is an error while fetching, the error message is logged to the console.
 */
const fetchBlogPosts = async () => {
  isLoading.value = true;
  try {
    const response = await fetchData("blogs");
    blogPosts.value = response.data || [];
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
  } finally {
    isLoading.value = false;
  }
};

const filteredBlogPosts = computed(() => {
  if (selectedStatus.value === "all") {
    return blogPosts.value;
  }
  return blogPosts.value.filter((post) => post.status === selectedStatus.value);
});

/**
 * Fetches the blog posts when the component is mounted.
 */
onMounted(() => {
  fetchBlogPosts();
});

/**
 * Navigates to the page for editing the blog post with the given ID.
 * @param {number} id The ID of the blog post to edit.
 */
const editPost = (id: number) => {
  navigateTo(`/blog/${id}`);
};

/**
 * Sets the ID of the post to be deleted and displays the confirmation modal.
 * @param {number} id - The ID of the blog post to delete.
 */
const confirmDelete = (id: number) => {
  postToDelete.value = id;
  showConfirmModal.value = true;
};

/**
 * Cancels the deletion of a blog post and hides the confirmation modal.
 * @public
 */
const cancelDelete = () => {
  showConfirmModal.value = false;
  postToDelete.value = null;
};

/**
 * Deletes the blog post with the given ID, and then fetches the blog posts
 * again to update the UI. If the deletion is successful, the confirmation
 * modal is hidden and the ID of the post to be deleted is reset to null.
 * @public
 */
const proceedDelete = async () => {
  if (postToDelete.value) {
    isDeleting.value = true;
    try {
      await fetchData(`blogs/${postToDelete.value}`, { method: "DELETE" });
      clearCache("blogs"); // Clear the cache
      await fetchBlogPosts(); // Re-fetch the data
      showConfirmModal.value = false;
      postToDelete.value = null;
    } catch (error) {
      console.error("Failed to delete the post:", error);
    } finally {
      isDeleting.value = false;
    }
  }
};

/**
 * Truncates the content to the specified maximum length and adds ellipsis if necessary.
 *
 * @param {string} content - The content to be truncated.
 * @param {number} [maxLength=100] - The maximum length of the truncated content.
 * @returns {string} - The truncated content with ellipsis appended if truncated.
 */
const truncateContent = (content: string, maxLength: number = 100) => {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + "...";
};
</script>

<style scoped>
.blog-posts-container {
  padding: 10px 20px;
  width: 100%;
  position: relative;
}

.blog-posts-title {
  font-size: 36px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 40px;
  color: #2c3e50;
  letter-spacing: -1px;
}

.blog-posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.blog-post-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.blog-post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.blog-post-content {
  padding: 25px;
  flex-grow: 1;
}

.blog-post-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #34495e;
  line-height: 1.3;
}

.blog-post-author {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 15px;
  font-weight: 500;
}

.blog-post-excerpt {
  font-size: 16px;
  color: #5d6d7e;
  line-height: 1.6;
  margin-bottom: 20px;
}

.blog-post-footer {
  background-color: #f1f3f5;
  padding: 15px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.blog-post-status {
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.blog-post-status.published {
  background-color: #27ae60;
  color: white;
}

.blog-post-status.unpublished {
  background-color: #e74c3c;
  color: white;
}

.blog-post-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
  border: none;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.edit-btn {
  background-color: #3498db;
  color: white;
}

.edit-btn:hover {
  background-color: #2980b9;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.no-posts {
  text-align: center;
  font-size: 20px;
  color: #7f8c8d;
  margin-top: 40px;
  font-weight: 500;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #ffffff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.modal-content h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
}

.modal-content p {
  font-size: 16px;
  color: #34495e;
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  background-color: #95a5a6;
  color: white;
}

.cancel-btn:hover {
  background-color: #7f8c8d;
}

.confirm-btn {
  background-color: #e74c3c;
  color: white;
}

.confirm-btn:hover {
  background-color: #c0392b;
}

@media (max-width: 768px) {
  .blog-posts-grid {
    grid-template-columns: 1fr;
  }

  .blog-post-card {
    max-width: 100%;
  }

  .modal-content {
    margin: 0 16px;
  }
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-spinner p {
  margin-top: 16px;
  font-size: 16px;
  color: #34495e;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.blog-posts-header {
  position: relative;
}

.status-filter {
  margin-bottom: 20px;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #333;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 20px;
}

.status-filter:focus {
  outline: none;
  border-color: #3498db;
}
</style>
