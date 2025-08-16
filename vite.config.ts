export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    rollupOptions: {
      input: 'public/index.html'
    }
  }
});
