<template>
  <div class="form-container">
    <h2 class="form-title">{{ isEditMode ? "Edit" : "Add" }} Blog Post</h2>
    <form @submit.prevent="submitForm" class="form">
      <!-- Display error messages -->
      <div v-if="errors.length" class="error-messages">
        <p v-for="(error, index) in errors" :key="index" class="error-text">
          {{ error }}
        </p>
      </div>

      <!-- Form fields -->
      <div class="form-group">
        <label for="title">Title:</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          placeholder="Enter the post title"
          required
        />
      </div>

      <div class="form-group">
        <label for="content">Content:</label>
        <textarea
          id="content"
          v-model="form.content"
          placeholder="Write the post content"
          required
          maxlength="100"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="author">Author:</label>
        <select id="author" v-model="form.author" required>
          <!-- Default option to select an author -->
          <option v-if="currentAuthor" :value="form.author" selected>{{ currentAuthor }}</option>
          <option value="Select an author" disabled selected>Select an author</option>
          <!-- Loop through the authors list -->
          <option
            v-for="author in authors"
            :key="author.id"
            :value="author"
          >
            {{ author.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="status">Status:</label>
        <select id="status" v-model="form.status" required>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
      </div>

      <!-- Submit button -->
      <button type="submit" class="submit-btn" :disabled="isSubmitting">
        <span v-if="!isSubmitting">{{ isEditMode ? "Update" : "Submit" }}</span>
        <div v-else class="spinner"></div>
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { useApi } from "~/composables/useApi";
import { BlogPost, Author, BlogPostCreateProps } from "~/types/BlogPost";
import { useRoute } from "vue-router";

/**
 * A ref to track if the form is submitting.
 */
const isSubmitting = ref(false);

/**
 * The route object from Vue Router.
 */
const route = useRoute();

/**
 * Composable for making API requests.
 */
const { fetchData, clearCache } = useApi();

/**
 * An array to store all authors fetched from the API.
 */
const authors = ref<Author[]>([]);

/**
 * The currently selected author for the blog post.
 */
const currentAuthor = ref<string>("");

/**
 * The blog post to be edited or created.
 */
const blogPost = ref<Partial<BlogPost> | null>(null);

/**
 * An array to store error messages.
 */
const errors = ref<string[]>([]);

/**
 * The form data for creating or updating a blog post.
 */
const form = ref<BlogPostCreateProps>({
  title: "",
  content: "",
  author: { id: 0, name: "" },
  status: "published",
});

/**
 * Checks if the blog post is in edit mode.
 *
 * @returns {boolean} True if the blog post is in edit mode, false otherwise.
 */
const isEditMode = computed(() => !!blogPost.value?.id);

/**
 * Fetches the blog post with the given ID from the API and stores it in the component state.
 * If the blog post is not found or there is an error while fetching, the error message is added to the
 * component state.
 */
const fetchBlogPost = async () => {
  const id = route.params.id as string;
  if (id) {
    try {
      const response = await fetchData(`blogs/${id}`);
      blogPost.value = response || null;
      currentAuthor.value = response?.author || "";
    } catch (error) {
      errors.value.push("Failed to fetch the blog post.");
    }
  }
};

/**
 * Fetches all authors from the API and stores them in the component state.
 * The fetched authors are used to populate the author selection dropdown.
 * If there is an error while fetching authors, the error message is added to the
 * component state's errors array.
 */
const fetchAuthors = async () => {
  try {
    const response = await fetchData("authors");
    authors.value = response.data;
  } catch (error) {
    errors.value.push("Failed to fetch authors.");
  }
};

/**
 * Watches for changes to the blogPost value and updates the form state accordingly.
 */
watch(
  blogPost,
  (newBlogPost) => {
    if (newBlogPost) {
      form.value = {
        title: newBlogPost.title || "",
        content: newBlogPost.content || "",
        author: newBlogPost.author || { id: 0, name: "" },
        status: newBlogPost.status || "published",
      };
    } else {
      form.value = {
        title: "",
        content: "",
        author: { id: 0, name: "" },
        status: "published",
      };
    }
  },
  { immediate: true },
);

/**
 * Fetches the blog post and authors when the component is mounted.
 */
onMounted(() => {
  fetchBlogPost();
  fetchAuthors();
});

/**
 * Submits the blog post form.
 *
 * If the form is in edit mode, this function sends a PUT request to the API to
 * update the existing blog post. Otherwise, it sends a POST request to create a
 * new blog post.
 *
 * If the request is successful, the user is redirected to the homepage. If the
 * request fails, the errors are displayed on the form.
 */
const submitForm = async () => {
  errors.value = [];
  isSubmitting.value = true;
  try {
    // Ensure the author has the correct id
    const selectedAuthor = authors.value.find(author => author.name === currentAuthor.value);
    const authorId = selectedAuthor ? selectedAuthor.id : form.value.author.id;

    if (!authorId) {
      errors.value.push("Author is required.");
      return;
    }

    const payload = {
      title: form.value.title,
      content: form.value.content,
      author_id: authorId, // Use the id of the selected author
      status: form.value.status,
    };

    if (isEditMode.value) {
      await fetchData(`blogs/${blogPost.value?.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else {
      await fetchData("blogs", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }
    navigateTo("/"); // Redirect to homepage or wherever you need
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.errors &&
      Array.isArray(error.response.data.errors)
    ) {
      errors.value = error.response.data.errors;
    } else {
      errors.value.push("An unexpected error occurred. Please try again.");
    }
  } finally {
    isSubmitting.value = false;
    clearCache('blogs');
  }
};
</script>

<style scoped>
.form-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 32px;
  width: 80%;
  max-width: 700px;
  margin: 0 auto;
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 24px;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  font-weight: 500;
  color: #34495e;
  margin-bottom: 8px;
}

input,
textarea,
select {
  padding: 10px 12px;
  font-size: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: #f8fafc;
  transition: border-color 0.3s ease;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-btn {
  background-color: #3498db;
  color: white;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-btn:hover {
  background-color: #2980b9;
}

.submit-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
}

@media (max-width: 640px) {
  .form-container {
    padding: 24px;
  }
}

.error-messages {
  background-color: #ffe6e6;
  border: 1px solid #ff0000;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 20px;
}

.error-text {
  color: #ff0000;
  font-size: 14px;
}

.spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
