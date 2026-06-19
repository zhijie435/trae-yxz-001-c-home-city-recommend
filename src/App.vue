<template>
  <div class="app-container">
    <AppHeader />
    <main class="main-content">
      <div class="hero-section">
        <h1>{{ $t('home.title') }}</h1>
        <p class="hero-desc">{{ $t('home.description') }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.main-content {
  flex: 1;
  padding: 40px 24px;
  color: #fff;
}

.hero-section {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 80px 20px;
}

.hero-section h1 {
  font-size: 48px;
  margin-bottom: 24px;
  font-weight: 700;
  letter-spacing: 2px;
}

.hero-desc {
  font-size: 18px;
  opacity: 0.9;
  line-height: 1.8;
}
</style>
