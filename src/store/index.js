import { ref, reactive, computed, watch } from 'vue'
import { cityApi, bannerApi, productApi } from '../services/api'

export const cityState = reactive({
  list: [],
  selectedId: '',
  loading: false,
  detecting: false,
  error: null
})

export const bannerState = reactive({
  list: [],
  loading: false,
  error: null
})

export const productState = reactive({
  list: [],
  loading: false,
  error: null,
  sortBy: 'sort',
  sortOrder: 'asc',
  limit: 8
})

export const pageState = reactive({
  current: 'home'
})

export const store = {
  city: cityState,
  banner: bannerState,
  product: productState,
  page: pageState
}

export const getters = {
  currentCity: computed(() => {
    if (!store.city.selectedId) return null
    return store.city.list.find(c => String(c.id) === String(store.city.selectedId)) || null
  }),
  currentCityName: computed(() => {
    const city = getters.currentCity.value
    return city ? city.name : '全国'
  }),
  isCitySelected: computed(() => !!store.city.selectedId),
  sortedProducts: computed(() => {
    const products = [...store.product.list]
    const sortBy = store.product.sortBy
    const sortOrder = store.product.sortOrder
    
    return products.sort((a, b) => {
      let comparison = 0
      if (sortBy === 'sort') {
        comparison = a.sort - b.sort
      } else if (sortBy === 'sales') {
        comparison = b.sales - a.sales
      } else if (sortBy === 'price') {
        comparison = a.price - b.price
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name, 'zh-CN')
      }
      return sortOrder === 'desc' ? -comparison : comparison
    })
  })
}

export const actions = {
  async fetchCities() {
    store.city.loading = true
    store.city.error = null
    try {
      store.city.list = await cityApi.getCities()
      return store.city.list
    } catch (error) {
      store.city.error = error
      throw error
    } finally {
      store.city.loading = false
    }
  },

  async detectCity(lat, lng) {
    store.city.detecting = true
    try {
      const city = await cityApi.detectCity(lat, lng)
      if (city) {
        store.city.selectedId = String(city.id)
      }
      return city
    } catch (error) {
      console.error('Detect city failed:', error)
      throw error
    } finally {
      store.city.detecting = false
    }
  },

  async setSelectedCity(cityId) {
    store.city.selectedId = cityId ? String(cityId) : ''
    await actions.refreshCityDependentData()
  },

  async refreshCityDependentData() {
    await Promise.all([
      actions.fetchBanners(),
      actions.fetchHotProducts()
    ])
  },

  async fetchBanners() {
    store.banner.loading = true
    store.banner.error = null
    try {
      store.banner.list = await bannerApi.getBanners(store.city.selectedId)
      return store.banner.list
    } catch (error) {
      store.banner.error = error
      throw error
    } finally {
      store.banner.loading = false
    }
  },

  async fetchHotProducts() {
    store.product.loading = true
    store.product.error = null
    try {
      store.product.list = await productApi.getHotProducts(
        store.city.selectedId,
        store.product.limit,
        store.product.sortBy,
        store.product.sortOrder
      )
      return store.product.list
    } catch (error) {
      store.product.error = error
      throw error
    } finally {
      store.product.loading = false
    }
  },

  setProductSort(sortBy, sortOrder = 'asc') {
    store.product.sortBy = sortBy
    store.product.sortOrder = sortOrder
    return actions.fetchHotProducts()
  },

  toggleSortOrder() {
    store.product.sortOrder = store.product.sortOrder === 'asc' ? 'desc' : 'asc'
    return actions.fetchHotProducts()
  },

  setCurrentPage(page) {
    store.page.current = page
    window.scrollTo(0, 0)
  },

  async initHomeData() {
    await actions.fetchCities()
    await actions.refreshCityDependentData()
  }
}

watch(
  () => store.city.selectedId,
  () => {
    if (store.page.current === 'home') {
      actions.refreshCityDependentData()
    }
  }
)

export function useStore() {
  return {
    store,
    getters,
    actions
  }
}

export default useStore
