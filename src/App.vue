<template>
  <div class="app-container">
    <AppHeader :currentPage="store.page.current" @navigate="navigationService.navigateTo" />
    <main class="main-content" :class="{ 'bg-white': store.page.current !== 'home' }">
      <Transition name="page-fade" mode="out-in">
        <div v-if="store.page.current === 'home'" key="home">
          <div class="page-inner">
            <section class="banner-section">
              <div class="section-header">
                <h2 class="section-title">{{ $t('banner.title') }}</h2>
                <div class="city-selector">
                  <label>选择城市:</label>
                  <select :value="store.city.selectedId" @change="handleCityChange($event.target.value || '')">
                    <option value="">全国</option>
                    <option v-for="city in store.city.list" :key="city.id" :value="String(city.id)">
                      {{ city.name }}
                    </option>
                  </select>
                </div>
              </div>
              <BannerCarousel :banners="store.banner.list" />
            </section>

            <HotRecommendations />

            <div class="hero-section">
              <h1>{{ $t('home.title') }}</h1>
              <p class="hero-desc">{{ $t('home.description') }}</p>
              <RentalTimeSelector />
            </div>
          </div>
        </div>
        <BannerAdmin v-else-if="store.page.current === 'bannerAdmin'" key="bannerAdmin" />
        <BannerApply v-else-if="store.page.current === 'bannerApply'" key="bannerApply" />
        <HotRecommendAdmin v-else-if="store.page.current === 'hotAdmin'" key="hotAdmin" />
      </Transition>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import BannerCarousel from './components/BannerCarousel.vue'
import BannerAdmin from './components/BannerAdmin.vue'
import BannerApply from './components/BannerApply.vue'
import RentalTimeSelector from './components/RentalTimeSelector.vue'
import HotRecommendations from './components/HotRecommendations.vue'
import HotRecommendAdmin from './components/HotRecommendAdmin.vue'
import { store, actions } from './store'
import { navigationService } from './services/navigation'

function handleCityChange(cityId) {
  actions.setSelectedCity(cityId)
}

onMounted(() => {
  actions.initHomeData()
})
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
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.main-content.bg-white {
  background: #f5f7fb;
}

.page-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 60px;
  color: #fff;
}

.banner-section {
  margin-bottom: 48px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
}

.city-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 10px;
}

.city-selector label {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
}

.city-selector select {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.95);
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  font-family: inherit;
}

.city-selector select:focus {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.hero-section {
  text-align: center;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  max-width: 700px;
  margin: 0 auto 32px;
}

@media (max-width: 640px) {
  .page-inner {
    padding: 20px 16px 40px;
  }

  .section-title {
    font-size: 20px;
  }

  .hero-section {
    padding: 40px 16px;
  }

  .hero-section h1 {
    font-size: 32px;
  }

  .hero-desc {
    font-size: 15px;
  }
}
</style>
