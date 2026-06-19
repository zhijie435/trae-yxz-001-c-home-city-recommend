import { actions } from '../store/index.js'

const ENTRY_ROUTES = {
  scene: {
    path: '/scene',
    name: '场景推荐',
    external: false
  },
  vendor: {
    path: '/vendor',
    name: '商家入驻',
    external: false
  },
  ai: {
    path: '/ai',
    name: 'AI助手',
    external: false
  },
  hot: {
    action: 'scrollToHot',
    name: '热门推荐'
  }
}

const listeners = new Set()

function emit(event, data) {
  listeners.forEach(listener => {
    try {
      listener(event, data)
    } catch (e) {
      console.error('Navigation listener error:', e)
    }
  })
}

export const navigationService = {
  on(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  navigateTo(page) {
    emit('navigate:before', { page })
    actions.setCurrentPage(page)
    emit('navigate:after', { page })
  },

  navigateToHome() {
    this.navigateTo('home')
  },

  navigateToBannerAdmin() {
    this.navigateTo('bannerAdmin')
  },

  navigateToBannerApply() {
    this.navigateTo('bannerApply')
  },

  navigateToHotAdmin() {
    this.navigateTo('hotAdmin')
  },

  handleEntryClick(entryKey) {
    const entry = ENTRY_ROUTES[entryKey]
    if (!entry) {
      console.warn(`Unknown entry key: ${entryKey}`)
      return
    }

    emit('entry:click', { key: entryKey, entry })

    if (entry.action === 'scrollToHot') {
      this.scrollToSection('hot-recommendations')
      return
    }

    if (entry.external) {
      this.openExternal(entry.path)
      return
    }

    console.log(`Navigate to: ${entry.path} (${entry.name})`)
  },

  handleBannerClick(banner) {
    emit('banner:click', { banner })

    if (!banner.linkUrl) {
      console.warn('Banner has no linkUrl:', banner.id)
      return
    }

    this.openExternal(banner.linkUrl)
  },

  handleProductClick(product) {
    emit('product:click', { product })

    const productUrl = `/product/${product.id}`
    console.log(`Navigate to product: ${productUrl}`, product)
  },

  handleStoreClick(store) {
    emit('store:click', { store })

    const storeUrl = `/store/${store.id}`
    console.log(`Navigate to store: ${storeUrl}`, store)
  },

  openExternal(url, target = '_blank') {
    emit('external:open', { url, target })

    if (url.startsWith('http')) {
      window.open(url, target, 'noopener,noreferrer')
    } else {
      window.open(url, target)
    }
  },

  scrollToSection(sectionId) {
    emit('scroll', { sectionId })

    const element = document.getElementById(sectionId) || document.querySelector(`.${sectionId}`)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  },

  scrollToTop() {
    emit('scroll:top')
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  },

  goBack() {
    emit('navigate:back')
    window.history.back()
  }
}

export function useNavigation() {
  return navigationService
}

export default navigationService
