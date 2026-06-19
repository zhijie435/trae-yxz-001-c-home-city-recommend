<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="header-left">
        <div class="logo-wrap" @click="$emit('navigate', 'home')">
          <svg class="logo-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="14" width="32" height="28" rx="6" fill="url(#logo-gradient)" />
            <circle cx="18" cy="28" r="3" fill="#fff" />
            <circle cx="30" cy="28" r="3" fill="#fff" />
            <path d="M18 36h12" stroke="#fff" stroke-width="2" stroke-linecap="round" />
            <circle cx="24" cy="10" r="3" fill="#667eea" />
            <defs>
              <linearGradient id="logo-gradient" x1="8" y1="14" x2="40" y2="42" gradientUnits="userSpaceOnUse">
                <stop stop-color="#667eea" />
                <stop offset="1" stop-color="#764ba2" />
              </linearGradient>
            </defs>
          </svg>
          <span class="slogan">{{ $t('header.slogan') }}</span>
        </div>
        <nav class="nav-menu">
          <button
            class="nav-item"
            :class="{ active: currentPage === 'home' }"
            @click="$emit('navigate', 'home')"
          >
            {{ $t('nav.home') }}
          </button>
          <button
            class="nav-item"
            :class="{ active: currentPage === 'bannerAdmin' }"
            @click="$emit('navigate', 'bannerAdmin')"
          >
            {{ $t('nav.bannerAdmin') }}
          </button>
          <button
            class="nav-item"
            :class="{ active: currentPage === 'bannerApply' }"
            @click="$emit('navigate', 'bannerApply')"
          >
            {{ $t('nav.bannerApply') }}
          </button>
          <button
            class="nav-item"
            :class="{ active: currentPage === 'hotAdmin' }"
            @click="$emit('navigate', 'hotAdmin')"
          >
            {{ $t('nav.hotAdmin') }}
          </button>
        </nav>
      </div>

      <div class="header-right">
        <div class="lang-switcher" :class="{ active: showLangMenu }">
          <button class="lang-trigger" @click.stop="toggleLangMenu">
            <svg class="globe-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
              <path d="M2 12h20" stroke="currentColor" stroke-width="1.5" />
              <path d="M12 2c3 3.5 3 16.5 0 20" stroke="currentColor" stroke-width="1.5" />
              <path d="M12 2c-3 3.5-3 16.5 0 20" stroke="currentColor" stroke-width="1.5" />
              <path d="M5 5c2.5 2 11.5 2 14 0" stroke="currentColor" stroke-width="1.5" />
              <path d="M5 19c2.5-2 11.5-2 14 0" stroke="currentColor" stroke-width="1.5" />
            </svg>
            <span class="current-lang">{{ currentLangLabel }}</span>
            <svg class="chevron" :class="{ rotated: showLangMenu }" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <transition name="dropdown">
            <ul v-if="showLangMenu" class="lang-dropdown">
              <li
                v-for="lang in languageOptions"
                :key="lang.value"
                class="lang-option"
                :class="{ selected: locale === lang.value }"
                @click.stop="changeLang(lang.value)"
              >
                <span class="lang-name">{{ $t(`languages.${lang.value}`) }}</span>
                <span class="lang-label">{{ lang.label }}</span>
                <svg v-if="locale === lang.value" class="check-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </li>
            </ul>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps({
  currentPage: {
    type: String,
    default: 'home'
  }
})

defineEmits(['navigate'])

const { locale, t } = useI18n()
const showLangMenu = ref(false)

const languageOptions = [
  { value: 'zh-CN', label: '简体' },
  { value: 'zh-TW', label: '繁體' },
  { value: 'en-US', label: 'EN' }
]

const currentLangLabel = computed(() => {
  const found = languageOptions.find(l => l.value === locale.value)
  return found ? found.label : languageOptions[0].label
})

function toggleLangMenu() {
  showLangMenu.value = !showLangMenu.value
}

function changeLang(lang) {
  locale.value = lang
  localStorage.setItem('locale', lang)
  showLangMenu.value = false
}

function handleClickOutside() {
  showLangMenu.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06), 0 4px 20px rgba(0, 0, 0, 0.04);
}

.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 14px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-item {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: transparent;
}

.nav-item:hover {
  color: #667eea;
  background: #f5f3ff;
}

.nav-item.active {
  color: #667eea;
  background: #eef2ff;
  font-weight: 600;
}

.logo-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.25));
}

.slogan {
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.lang-switcher {
  position: relative;
}

.lang-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.lang-trigger:hover {
  border-color: #667eea;
  color: #667eea;
  background: #fafaff;
}

.globe-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.current-lang {
  min-width: 32px;
  text-align: center;
}

.chevron {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.lang-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06);
  padding: 6px;
  margin: 0;
  list-style: none;
  overflow: hidden;
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.lang-option:hover {
  background: #f5f3ff;
}

.lang-option.selected {
  background: #eef2ff;
  color: #667eea;
}

.lang-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.lang-label {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 400;
}

.lang-option.selected .lang-label {
  color: #667eea;
  opacity: 0.7;
}

.check-icon {
  width: 18px;
  height: 18px;
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

@media (max-width: 900px) {
  .header-left {
    gap: 20px;
  }

  .nav-menu {
    gap: 0;
  }

  .nav-item {
    padding: 6px 10px;
    font-size: 13px;
  }
}

@media (max-width: 720px) {
  .nav-menu {
    display: none;
  }
}

@media (max-width: 640px) {
  .header-inner {
    padding: 12px 16px;
  }

  .slogan {
    font-size: 15px;
  }

  .logo-icon {
    width: 34px;
    height: 34px;
  }

  .current-lang {
    display: none;
  }

  .lang-trigger {
    padding: 8px 10px;
  }
}
</style>
