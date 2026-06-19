import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import zhCN from '../src/locales/zh-CN.js'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN
  }
})

config.global.plugins = [i18n]

global.scrollTo = vi.fn()
global.window.open = vi.fn()

vi.mock('../src/services/api', () => ({
  cityApi: {
    getCities: vi.fn().mockResolvedValue([
      { id: 1, name: '北京', nameEn: 'Beijing' },
      { id: 2, name: '上海', nameEn: 'Shanghai' },
      { id: 3, name: '广州', nameEn: 'Guangzhou' }
    ]),
    detectCity: vi.fn().mockResolvedValue({ id: 1, name: '北京', nameEn: 'Beijing' }),
    getStores: vi.fn().mockResolvedValue([])
  },
  bannerApi: {
    getBanners: vi.fn().mockResolvedValue([
      { id: 1, title: '测试Banner', imageUrl: 'test.jpg', linkUrl: 'https://example.com', type: 'global' }
    ]),
    getAdminBanners: vi.fn().mockResolvedValue([]),
    createBanner: vi.fn().mockResolvedValue({}),
    updateBanner: vi.fn().mockResolvedValue({}),
    deleteBanner: vi.fn().mockResolvedValue({}),
    applyBanner: vi.fn().mockResolvedValue({}),
    approveBanner: vi.fn().mockResolvedValue({}),
    rejectBanner: vi.fn().mockResolvedValue({})
  },
  productApi: {
    getHotProducts: vi.fn().mockResolvedValue([
      { id: 1, name: '商品A', price: 100, sales: 500, sort: 1 },
      { id: 2, name: '商品B', price: 200, sales: 300, sort: 2 },
      { id: 3, name: '商品C', price: 150, sales: 800, sort: 3 }
    ]),
    getAdminProducts: vi.fn().mockResolvedValue([]),
    createProduct: vi.fn().mockResolvedValue({}),
    updateProduct: vi.fn().mockResolvedValue({}),
    deleteProduct: vi.fn().mockResolvedValue({}),
    batchUpdateSort: vi.fn().mockResolvedValue({})
  }
}))
