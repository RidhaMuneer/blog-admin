export default defineNuxtConfig({
  typescript: {
    strict: true,
  },
  app: {
    head: {
      title: 'Blog Admin',
    },
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
      apiKey: process.env.API_KEY,
    },
  },
});
