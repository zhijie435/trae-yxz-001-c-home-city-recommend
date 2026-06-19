<template>
  <div class="banner-carousel" v-if="banners.length > 0">
    <div class="carousel-container" ref="carouselRef">
      <div
        class="carousel-track"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(banner, index) in banners"
          :key="banner.id"
          class="carousel-slide"
        >
          <a
            class="banner-link"
            :href="banner.linkUrl || 'javascript:void(0)'"
            :target="banner.linkUrl ? '_blank' : '_self'"
          >
            <img :src="banner.imageUrl" :alt="banner.title" class="banner-image" />
            <div class="banner-overlay">
              <div class="banner-info">
                <span v-if="banner.type === 'global'" class="banner-tag global">
                  {{ $t('banner.global') }}
                </span>
                <span v-else class="banner-tag city">
                  {{ $t('banner.city') }}
                </span>
                <h3 class="banner-title">{{ banner.title }}</h3>
                <p v-if="banner.storeName" class="banner-store">
                  {{ $t('banner.store') }}: {{ banner.storeName }}
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>

      <button
        class="carousel-arrow prev"
        @click="prevSlide"
        :disabled="banners.length <= 1"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button
        class="carousel-arrow next"
        @click="nextSlide"
        :disabled="banners.length <= 1"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <div class="carousel-dots">
        <button
          v-for="(banner, index) in banners"
          :key="banner.id"
          class="carousel-dot"
          :class="{ active: currentIndex === index }"
          @click="goToSlide(index)"
        />
      </div>
    </div>
  </div>
  <div class="banner-empty" v-else>
    <p>{{ $t('banner.empty') }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, defineProps } from 'vue'

const props = defineProps({
  banners: {
    type: Array,
    default: () => []
  },
  autoPlay: {
    type: Boolean,
    default: true
  },
  interval: {
    type: Number,
    default: 4000
  }
})

const currentIndex = ref(0)
let timer = null

function nextSlide() {
  if (props.banners.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % props.banners.length
}

function prevSlide() {
  if (props.banners.length === 0) return
  currentIndex.value = (currentIndex.value - 1 + props.banners.length) % props.banners.length
}

function goToSlide(index) {
  currentIndex.value = index
}

function startAutoPlay() {
  if (!props.autoPlay || props.banners.length <= 1) return
  stopAutoPlay()
  timer = setInterval(nextSlide, props.interval)
}

function stopAutoPlay() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

watch(
  () => props.banners,
  () => {
    currentIndex.value = 0
    stopAutoPlay()
    startAutoPlay()
  },
  { deep: true, immediate: false }
)

onMounted(() => {
  startAutoPlay()
})

onBeforeUnmount(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.banner-carousel {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.carousel-container {
  position: relative;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.carousel-track {
  display: flex;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.carousel-slide {
  flex-shrink: 0;
  width: 100%;
}

.banner-link {
  display: block;
  position: relative;
  width: 100%;
  padding-top: 42%;
  overflow: hidden;
}

.banner-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 60%);
  display: flex;
  align-items: flex-end;
  padding: 40px;
}

.banner-info {
  color: #fff;
  max-width: 600px;
}

.banner-tag {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 14px;
  letter-spacing: 0.5px;
}

.banner-tag.global {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.banner-tag.city {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.banner-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 10px 0;
  line-height: 1.2;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.banner-store {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 2;
}

.carousel-arrow:hover:not(:disabled) {
  background: #fff;
  color: #667eea;
  transform: translateY(-50%) scale(1.08);
}

.carousel-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-arrow.prev {
  left: 20px;
}

.carousel-arrow.next {
  right: 20px;
}

.carousel-arrow svg {
  width: 24px;
  height: 24px;
}

.carousel-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 2;
}

.carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid transparent;
}

.carousel-dot:hover {
  background: rgba(255, 255, 255, 0.8);
}

.carousel-dot.active {
  background: #fff;
  width: 30px;
  border-radius: 5px;
}

.banner-empty {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
}

@media (max-width: 768px) {
  .banner-link {
    padding-top: 55%;
  }

  .banner-overlay {
    padding: 20px;
  }

  .banner-title {
    font-size: 22px;
  }

  .banner-store {
    font-size: 12px;
  }

  .carousel-arrow {
    width: 36px;
    height: 36px;
  }

  .carousel-arrow.prev {
    left: 10px;
  }

  .carousel-arrow.next {
    right: 10px;
  }

  .carousel-arrow svg {
    width: 18px;
    height: 18px;
  }

  .banner-tag {
    padding: 4px 10px;
    font-size: 11px;
  }
}
</style>
