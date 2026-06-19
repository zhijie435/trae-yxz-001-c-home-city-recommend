const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const APP_ENV = import.meta.env.VITE_APP_ENV || 'development'
const ENABLE_MOCK = import.meta.env.VITE_ENABLE_MOCK === 'true'

async function request(url, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    const data = await res.json()
    if (!data.success) {
      throw new Error(data.message || '请求失败')
    }
    return data.data
  } catch (error) {
    console.error(`API Error [${url}]:`, error)
    throw error
  }
}

export const cityApi = {
  getCities: () => request('/cities'),
  detectCity: (lat, lng) => {
    const params = new URLSearchParams()
    if (lat) params.append('lat', lat)
    if (lng) params.append('lng', lng)
    return request(`/city/detect?${params.toString()}`)
  },
  getStores: (cityId) => {
    const params = new URLSearchParams()
    if (cityId) params.append('cityId', cityId)
    return request(`/stores?${params.toString()}`)
  }
}

export const bannerApi = {
  getBanners: (cityId) => {
    const params = new URLSearchParams()
    if (cityId) params.append('cityId', cityId)
    return request(`/banners?${params.toString()}`)
  },
  getAdminBanners: (status, type) => {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    if (type) params.append('type', type)
    return request(`/banners/admin?${params.toString()}`)
  },
  createBanner: (data) => request('/banners', { method: 'POST', body: JSON.stringify(data) }),
  updateBanner: (id, data) => request(`/banners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBanner: (id) => request(`/banners/${id}`, { method: 'DELETE' }),
  applyBanner: (data) => request('/banners/apply', { method: 'POST', body: JSON.stringify(data) }),
  approveBanner: (id) => request(`/banners/${id}/approve`, { method: 'PUT' }),
  rejectBanner: (id) => request(`/banners/${id}/reject`, { method: 'PUT' })
}

export const productApi = {
  getHotProducts: (cityId, limit, sortBy = 'sort', sortOrder = 'asc') => {
    const params = new URLSearchParams()
    if (cityId) params.append('cityId', cityId)
    if (limit) params.append('limit', limit)
    params.append('sortBy', sortBy)
    params.append('sortOrder', sortOrder)
    return request(`/hot-products?${params.toString()}`)
  },
  getAdminProducts: (cityId, storeId) => {
    const params = new URLSearchParams()
    if (cityId) params.append('cityId', cityId)
    if (storeId) params.append('storeId', storeId)
    return request(`/hot-products/admin?${params.toString()}`)
  },
  createProduct: (data) => request('/hot-products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/hot-products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/hot-products/${id}`, { method: 'DELETE' }),
  batchUpdateSort: (items) => request('/hot-products/sort/batch', { method: 'PUT', body: JSON.stringify({ items }) })
}

export default {
  cityApi,
  bannerApi,
  productApi
}
