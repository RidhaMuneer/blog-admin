<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Navbar content -->
      <div class="navbar-content">
        <div class="navbar-brand">
          <a href="/" class="navbar-logo">BlogDash</a>
        </div>
        <div class="navbar-links">
          <a href="/" class="navbar-link">Dashboard</a>
          <a href="/blog/add" class="navbar-button">New Post</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  left: 0;
  z-index: 999;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.navbar-logo {
  font-size: 24px;
  font-weight: bold;
  color: #3498db;
  text-decoration: none;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 16px;
}

.navbar-link {
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.3s ease;
}

.navbar-link:hover {
  color: #3498db;
}

.navbar-button {
  background-color: #3498db;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.navbar-button:hover {
  background-color: #2980b9;
}
</style>