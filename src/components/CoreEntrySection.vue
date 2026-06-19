<template>
  <section class="core-entry-section">
    <div class="section-header">
      <h2 class="section-title">{{ $t('coreEntry.title') }}</h2>
      <span class="section-subtitle">{{ $t('coreEntry.subtitle') }}</span>
    </div>
    <div class="entry-grid">
      <div
        v-for="(entry, index) in entries"
        :key="index"
        class="entry-card"
        @click="handleEntryClick(entry.key)"
      >
        <div class="entry-icon-wrap" :style="{ background: entry.gradient }">
          <svg v-html="entry.icon" class="entry-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>
        </div>
        <div class="entry-content">
          <h3 class="entry-title">{{ entry.title }}</h3>
          <p class="entry-desc">{{ entry.desc }}</p>
        </div>
        <svg class="entry-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const entries = computed(() => [
  {
    key: 'scene',
    title: t('coreEntry.scene.title'),
    desc: t('coreEntry.scene.desc'),
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
           <path d="M9 22V12h6v10" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
           <circle cx="12" cy="7" r="1.5" fill="currentColor"/>`
  },
  {
    key: 'vendor',
    title: t('coreEntry.vendor.title'),
    desc: t('coreEntry.vendor.desc'),
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: `<rect x="3" y="7" width="18" height="14" rx="3" stroke="currentColor" stroke-width="1.8" fill="none"/>
           <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
           <circle cx="12" cy="14" r="3" stroke="currentColor" stroke-width="1.8" fill="none"/>
           <path d="M12 11v2l1.5 1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`
  },
  {
    key: 'ai',
    title: t('coreEntry.ai.title'),
    desc: t('coreEntry.ai.desc'),
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: `<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" fill="none"/>
           <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
           <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
           <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
           <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`
  },
  {
    key: 'hot',
    title: t('coreEntry.hot.title'),
    desc: t('coreEntry.hot.desc'),
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    icon: `<path d="M12 2.5s4 4 4 8.5a4 4 0 0 1-8 0c0-2 1.5-3.5 1.5-3.5S8 9 8 11a4 4 0 0 0 8 0c0-2-2-4.5-4-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
           <path d="M8 18s1.5-1 4-1 4 1 4 1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
           <path d="M9 21s1-.5 3-.5 3 .5 3 .5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`
  }
])

function handleEntryClick(key) {
  console.log('Entry clicked:', key)
}
</script>

<style scoped>
.core-entry-section {
  margin-bottom: 48px;
}

.section-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 24px;
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

.entry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.entry-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 24px 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.entry-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.entry-card:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.35);
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.entry-card:hover::before {
  opacity: 1;
}

.entry-card:active {
  transform: translateY(-2px) scale(0.985);
  transition-duration: 0.1s;
}

.entry-card:active .entry-icon-wrap {
  transform: scale(1.05) rotate(1deg);
  transition-duration: 0.1s;
}

.entry-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.entry-card:hover .entry-icon-wrap {
  transform: scale(1.08) rotate(3deg);
}

.entry-icon {
  width: 32px;
  height: 32px;
  color: #fff;
}

.entry-content {
  flex: 1;
}

.entry-title {
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 6px 0;
  letter-spacing: 0.3px;
}

.entry-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  margin: 0;
  line-height: 1.5;
}

.entry-arrow {
  display: none;
  width: 18px;
  height: 18px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 12px;
  transition: all 0.3s ease;
}

.entry-card:hover .entry-arrow {
  color: #fff;
  transform: translateX(4px);
}

@media (max-width: 900px) {
  .entry-grid {
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

  .entry-card {
    padding: 18px 14px;
    border-radius: 16px;
  }

  .entry-icon-wrap {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    margin-bottom: 12px;
  }

  .entry-icon {
    width: 26px;
    height: 26px;
  }

  .entry-title {
    font-size: 15px;
  }

  .entry-desc {
    font-size: 12px;
  }
}
</style>
