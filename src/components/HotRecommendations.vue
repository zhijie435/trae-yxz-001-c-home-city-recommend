<template>
  <section class="hot-recommendations-section" id="hot-recommendations">
    <div class="section-header">
      <div class="header-left">
        <h2 class="section-title">{{ $t('hotRecommend.title') }}</h2>
        <span class="section-subtitle">
          {{ selectedCityName ? `${selectedCityName}${$t('hotRecommend.subtitleCity')}` : $t('hotRecommend.subtitleAll') }}
        </span>
      </div>
      <div class="header-actions">
        <div class="sort-dropdown" :class="{ active: showSortMenu }">
          <button class="sort-trigger" @click.stop="toggleSortMenu">
            <svg class="sort-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="sort-label">{{ currentSortLabel }}</span>
            <svg class="chevron" :class="{ rotated: showSortMenu }" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <transition name="dropdown">
            <ul v-if="showSortMenu" class="sort-menu">
              <li
                v-for="option in sortOptions"
                :key="option.value"
                class="sort-option"
                :class="{ active: store.product.sortBy === option.value }"
                @click.stop="handleSortChange(option.value)"
              >
                <span>{{ option.label }}</span>
                <svg v-if="store.product.sortBy === option.value" class="check-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </li>
            </ul>
          </transition>
        </div>
        <div class="header-badge">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.5s4 4 4 8.5a4 4 0 0 1-8 0c0-2 1.5-3.5 1.5-3.5S8 9 8 11a4 4 0 0 0 8 0c0-2-2-4.5-4-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>

    <div v-if="store.product.loading" class="loading-container">
      <div class="loading-spinner"></div>
    </div>

    <div v-else-if="store.product.list.length === 0" class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-icon">
        <path d="M20 7h-3V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a1 1 0 0 0-1-1zM9 5h6v2H9V5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
      <p class="empty-text">{{ $t('hotRecommend.empty') }}</p>
    </div>

    <div v-else class="product-grid">
      <div
        v-for="(product, index) in store.product.list"
        :key="product.id"
        class="product-card"
        @click="handleProductClick(product)"
      >
        <div class="product-rank" :class="`rank-${index + 1}`">
          {{ index + 1 }}
        </div>
        <div v-if="product.tag" class="product-tag">
          {{ getProductTagLabel(product.tag) }}
        </div>
        <div class="product-image-wrap">
          <img :src="product.imageUrl" :alt="getProductName(product)" class="product-image" />
        </div>
        <div class="product-info">
          <h3 class="product-name">{{ getProductName(product) }}</h3>
          <p v-if="getStoreName(product)" class="product-store">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="store-icon">
              <path d="M3 9l1.5-5h15L21 9M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9M3 9h18M9 21v-6h6v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ getStoreName(product) }}
          </p>
          <div class="product-price-row">
            <span class="product-price">¥{{ product.price.toLocaleString() }}</span>
            <span class="product-original-price" v-if="product.originalPrice > product.price">
              ¥{{ product.originalPrice.toLocaleString() }}
            </span>
          </div>
          <div class="product-sales">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="sales-icon">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ product.sales.toLocaleString() }} {{ $t('hotRecommend.sold') }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { store, getters, actions } from '../store'
import { navigationService } from '../services/navigation'

const { t, locale } = useI18n()

const showSortMenu = ref(false)

const sortOptions = computed(() => [
  { value: 'sort', label: t('hotRecommend.sortDefault') },
  { value: 'sales', label: t('hotRecommend.sortSales') },
  { value: 'price', label: t('hotRecommend.sortPrice') },
  { value: 'name', label: t('hotRecommend.sortName') }
])

const currentSortLabel = computed(() => {
  const option = sortOptions.value.find(o => o.value === store.product.sortBy)
  return option ? option.label : sortOptions.value[0].label
})

const selectedCityName = computed(() => {
  if (!getters.isCitySelected.value) return ''
  const city = getters.currentCity.value
  if (!city) return ''
  return locale.value === 'en-US' ? city.nameEn : city.name
})

function getProductName(product) {
  return locale.value === 'en-US' && product.nameEn ? product.nameEn : product.name
}

function getStoreName(product) {
  return locale.value === 'en-US' && product.storeNameEn ? product.storeNameEn : product.storeName
}

function getProductTagLabel(tag) {
  const tagMap = {
    '热销': t('hotRecommend.tagHot'),
    '爆款': t('hotRecommend.tagBest'),
    '新品': t('hotRecommend.tagNew'),
    '推荐': t('hotRecommend.tagRecommend')
  }
  return tagMap[tag] || tag
}

function toggleSortMenu() {
  showSortMenu.value = !showSortMenu.value
}

function handleSortChange(sortBy) {
  actions.setProductSort(sortBy, store.product.sortOrder)
  showSortMenu.value = false
}

function handleProductClick(product) {
  navigationService.handleProductClick(product)
}

function handleClickOutside() {
  showSortMenu.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.hot-recommendations-section {
  margin-bottom: 48px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
  color: #fff;
}

.section-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
}

.sort-dropdown {
  position: relative;
}

.sort-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.sort-trigger:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.35);
}

.sort-trigger:active {
  transform: scale(0.97);
}

.sort-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.sort-label {
  white-space: nowrap;
}

.chevron {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.sort-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 160px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08);
  list-style: none;
  margin: 0;
  padding: 6px;
  z-index: 50;
}

.sort-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.sort-option:hover {
  background: #f5f3ff;
  color: #667eea;
}

.sort-option.active {
  background: #eef2ff;
  color: #667eea;
}

.check-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.header-badge {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(250, 112, 154, 0.3);
}

.header-badge svg {
  width: 22px;
  height: 22px;
  color: #fff;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 16px;
}

.empty-text {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  animation: fadeInUp 0.5s ease backwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-card:nth-child(1) { animation-delay: 0.05s; }
.product-card:nth-child(2) { animation-delay: 0.1s; }
.product-card:nth-child(3) { animation-delay: 0.15s; }
.product-card:nth-child(4) { animation-delay: 0.2s; }
.product-card:nth-child(5) { animation-delay: 0.25s; }
.product-card:nth-child(6) { animation-delay: 0.3s; }
.product-card:nth-child(7) { animation-delay: 0.35s; }
.product-card:nth-child(8) { animation-delay: 0.4s; }

.product-card:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.35);
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.product-card:active {
  transform: translateY(-2px) scale(0.985);
  transition-duration: 0.1s;
}

.product-rank {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  z-index: 2;
}

.product-rank.rank-1 {
  background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
  box-shadow: 0 4px 12px rgba(241, 39, 17, 0.35);
}

.product-rank.rank-2 {
  background: linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%);
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.35);
}

.product-rank.rank-3 {
  background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);
  box-shadow: 0 4px 12px rgba(247, 151, 30, 0.35);
}

.product-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: #fff;
  z-index: 2;
}

.product-image-wrap {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-image {
  transform: scale(1.06);
}

.product-info {
  padding: 16px;
}

.product-name {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
}

.product-store {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 10px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.store-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.product-price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
}

.product-price {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.product-original-price {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: line-through;
}

.product-sales {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.sales-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
}

@media (max-width: 640px) {
  .section-title {
    font-size: 20px;
  }

  .section-subtitle {
    font-size: 12px;
  }

  .product-info {
    padding: 12px;
  }

  .product-name {
    font-size: 14px;
    min-height: 38px;
  }

  .product-price {
    font-size: 18px;
  }
}
</style>
