<template>
  <section class="hot-recommendations-section">
    <div class="section-header">
      <div class="header-left">
        <h2 class="section-title">{{ $t('hotRecommend.title') }}</h2>
        <span class="section-subtitle">
          {{ selectedCityName ? `${selectedCityName}${$t('hotRecommend.subtitleCity')}` : $t('hotRecommend.subtitleAll') }}
        </span>
      </div>
      <div class="header-badge">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.5s4 4 4 8.5a4 4 0 0 1-8 0c0-2 1.5-3.5 1.5-3.5S8 9 8 11a4 4 0 0 0 8 0c0-2-2-4.5-4-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
    </div>

    <div v-else-if="products.length === 0" class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="empty-icon">
        <path d="M20 7h-3V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a1 1 0 0 0-1-1zM9 5h6v2H9V5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
      <p class="empty-text">{{ $t('hotRecommend.empty') }}</p>
    </div>

    <div v-else class="product-grid">
      <div
        v-for="(product, index) in products"
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
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  cityId: {
    type: [String, Number],
    default: ''
  },
  cities: {
    type: Array,
    default: () => []
  }
})

const { t, locale } = useI18n()

const products = ref([])
const loading = ref(false)

const selectedCityName = computed(() => {
  if (!props.cityId) return ''
  const city = props.cities.find(c => String(c.id) === String(props.cityId))
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

async function fetchHotProducts() {
  loading.value = true
  try {
    const url = props.cityId
      ? `/api/hot-products?cityId=${props.cityId}&limit=8`
      : '/api/hot-products?limit=8'
    const res = await fetch(url)
    const data = await res.json()
    if (data.success) {
      products.value = data.data
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function handleProductClick(product) {
  console.log('Product clicked:', product)
}

watch(() => props.cityId, () => {
  fetchHotProducts()
})

onMounted(() => {
  fetchHotProducts()
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
}

.product-card:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.35);
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
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
