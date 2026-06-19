<template>
  <div class="hot-admin-page">
    <div class="page-header">
      <div>
        <h2>{{ $t('hotAdmin.title') }}</h2>
        <p class="page-subtitle">{{ $t('hotAdmin.subtitle') }}</p>
      </div>
      <button class="btn-primary" @click="openCreateModal">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
        </svg>
        {{ $t('hotAdmin.addProduct') }}
      </button>
    </div>

    <div class="filter-bar">
      <div class="filter-group">
        <span class="filter-label">{{ $t('hotAdmin.filterCity') }}:</span>
        <select v-model="filterCityId" class="filter-select" @change="handleCityChange">
          <option value="">{{ $t('hotAdmin.filterAll') }}</option>
          <option v-for="city in cities" :key="city.id" :value="city.id">
            {{ getCityName(city) }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <span class="filter-label">{{ $t('hotAdmin.filterStore') }}:</span>
        <select v-model="filterStoreId" class="filter-select">
          <option value="">{{ $t('hotAdmin.filterAll') }}</option>
          <option v-for="store in filteredStores" :key="store.id" :value="store.id">
            {{ getStoreName(store) }}
          </option>
        </select>
      </div>
    </div>

    <div class="table-container">
      <table class="admin-table">
        <thead>
          <tr>
            <th>{{ $t('hotAdmin.columns.preview') }}</th>
            <th>{{ $t('hotAdmin.columns.name') }}</th>
            <th>{{ $t('hotAdmin.columns.city') }}</th>
            <th>{{ $t('hotAdmin.columns.store') }}</th>
            <th>{{ $t('hotAdmin.columns.price') }}</th>
            <th>{{ $t('hotAdmin.columns.sort') }}</th>
            <th>{{ $t('hotAdmin.columns.sales') }}</th>
            <th>{{ $t('hotAdmin.columns.tag') }}</th>
            <th>{{ $t('hotAdmin.columns.createdAt') }}</th>
            <th>{{ $t('hotAdmin.columns.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td>
              <img :src="product.imageUrl" :alt="getProductName(product)" class="preview-img" />
            </td>
            <td class="title-cell">{{ getProductName(product) }}</td>
            <td>{{ product.cityName || '-' }}</td>
            <td>{{ product.storeName || '-' }}</td>
            <td class="price-cell">
              <span class="price-current">¥{{ product.price.toLocaleString() }}</span>
              <span v-if="product.originalPrice" class="price-original">¥{{ product.originalPrice.toLocaleString() }}</span>
            </td>
            <td>
              <input
                type="number"
                :value="product.sort"
                class="sort-input"
                @change="updateSort(product.id, $event.target.value)"
                @blur="updateSort(product.id, $event.target.value)"
              />
            </td>
            <td>{{ product.sales.toLocaleString() }}</td>
            <td>
              <span v-if="product.tag" class="tag-badge">{{ product.tag }}</span>
              <span v-else class="text-muted">-</span>
            </td>
            <td class="date-cell">{{ formatDate(product.createdAt) }}</td>
            <td>
              <div class="action-buttons">
                <button class="action-btn edit" @click="openEditModal(product)">
                  {{ $t('hotAdmin.actions.edit') }}
                </button>
                <button class="action-btn delete" @click="deleteProduct(product.id)">
                  {{ $t('hotAdmin.actions.delete') }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ editingProduct ? $t('hotAdmin.form.update') : $t('hotAdmin.form.create') }}</h3>
        <form @submit.prevent="submitForm" class="modal-form">
          <div class="form-row">
            <label>{{ $t('hotAdmin.form.name') }} *</label>
            <input v-model="formData.name" type="text" :placeholder="$t('hotAdmin.form.placeholder.name')" required />
          </div>
          <div class="form-row">
            <label>{{ $t('hotAdmin.form.nameEn') }}</label>
            <input v-model="formData.nameEn" type="text" :placeholder="$t('hotAdmin.form.placeholder.nameEn')" />
          </div>
          <div class="form-row">
            <label>{{ $t('hotAdmin.form.imageUrl') }} *</label>
            <input v-model="formData.imageUrl" type="text" :placeholder="$t('hotAdmin.form.placeholder.imageUrl')" required />
          </div>
          <div class="form-row two-col">
            <div class="form-col">
              <label>{{ $t('hotAdmin.form.city') }} *</label>
              <select v-model="formData.cityId" @change="handleFormCityChange" required>
                <option value="">{{ $t('hotAdmin.form.placeholder.selectCity') }}</option>
                <option v-for="city in cities" :key="city.id" :value="city.id">
                  {{ getCityName(city) }}
                </option>
              </select>
            </div>
            <div class="form-col">
              <label>{{ $t('hotAdmin.form.store') }} *</label>
              <select v-model="formData.storeId" required>
                <option value="">{{ $t('hotAdmin.form.placeholder.selectStore') }}</option>
                <option v-for="store in formStores" :key="store.id" :value="store.id">
                  {{ getStoreName(store) }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-row two-col">
            <div class="form-col">
              <label>{{ $t('hotAdmin.form.price') }} *</label>
              <input v-model.number="formData.price" type="number" step="0.01" :placeholder="$t('hotAdmin.form.placeholder.price')" required />
            </div>
            <div class="form-col">
              <label>{{ $t('hotAdmin.form.originalPrice') }}</label>
              <input v-model.number="formData.originalPrice" type="number" step="0.01" :placeholder="$t('hotAdmin.form.placeholder.originalPrice')" />
            </div>
          </div>
          <div class="form-row two-col">
            <div class="form-col">
              <label>{{ $t('hotAdmin.form.sort') }}</label>
              <input v-model.number="formData.sort" type="number" :placeholder="$t('hotAdmin.form.placeholder.sort')" />
            </div>
            <div class="form-col">
              <label>{{ $t('hotAdmin.form.tag') }}</label>
              <input v-model="formData.tag" type="text" :placeholder="$t('hotAdmin.form.placeholder.tag')" />
            </div>
          </div>
          <div v-if="formData.imageUrl" class="form-row preview-row">
            <label>{{ $t('hotAdmin.form.imagePreview') }}</label>
            <img :src="formData.imageUrl" alt="preview" class="form-preview" />
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeModal">
              {{ $t('hotAdmin.form.cancel') }}
            </button>
            <button type="submit" class="btn-primary">
              {{ editingProduct ? $t('hotAdmin.form.update') : $t('hotAdmin.form.create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const products = ref([])
const cities = ref([])
const stores = ref([])
const filterCityId = ref('')
const filterStoreId = ref('')
const showModal = ref(false)
const editingProduct = ref(null)

const formData = ref({
  name: '',
  nameEn: '',
  imageUrl: '',
  cityId: '',
  storeId: '',
  price: '',
  originalPrice: '',
  sort: 100,
  tag: ''
})

const filteredStores = computed(() => {
  if (!filterCityId.value) return stores.value
  const cid = parseInt(filterCityId.value)
  return stores.value.filter(s => s.cityId === cid)
})

const formStores = computed(() => {
  if (!formData.value.cityId) return []
  const cid = parseInt(formData.value.cityId)
  return stores.value.filter(s => s.cityId === cid)
})

const filteredProducts = computed(() => {
  let result = products.value

  if (filterCityId.value) {
    const cid = parseInt(filterCityId.value)
    result = result.filter(p => p.cityId === cid)
  }
  if (filterStoreId.value) {
    const sid = parseInt(filterStoreId.value)
    result = result.filter(p => p.storeId === sid)
  }

  return result.sort((a, b) => {
    if (a.sort !== b.sort) return a.sort - b.sort
    return b.sales - a.sales
  })
})

function getCityName(city) {
  return locale.value === 'en-US' && city.nameEn ? city.nameEn : city.name
}

function getStoreName(store) {
  return locale.value === 'en-US' && store.nameEn ? store.nameEn : store.name
}

function getProductName(product) {
  return locale.value === 'en-US' && product.nameEn ? product.nameEn : product.name
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString().slice(0, 5)
}

async function fetchProducts() {
  try {
    const params = new URLSearchParams()
    if (filterCityId.value) params.append('cityId', filterCityId.value)
    if (filterStoreId.value) params.append('storeId', filterStoreId.value)

    const url = `/api/hot-products/admin${params.toString() ? '?' + params.toString() : ''}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.success) {
      products.value = data.data
    }
  } catch (e) {
    console.error(e)
  }
}

async function fetchCities() {
  try {
    const res = await fetch('/api/cities')
    const data = await res.json()
    if (data.success) {
      cities.value = data.data
    }
  } catch (e) {
    console.error(e)
  }
}

async function fetchStores() {
  try {
    const res = await fetch('/api/stores')
    const data = await res.json()
    if (data.success) {
      stores.value = data.data
    }
  } catch (e) {
    console.error(e)
  }
}

function handleCityChange() {
  filterStoreId.value = ''
}

function handleFormCityChange() {
  formData.value.storeId = ''
}

async function updateSort(id, value) {
  const sort = parseInt(value)
  if (isNaN(sort)) return
  try {
    const res = await fetch(`/api/hot-products/sort/batch`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id, sort }] })
    })
    const data = await res.json()
    if (data.success) {
      fetchProducts()
    }
  } catch (e) {
    console.error(e)
  }
}

function openCreateModal() {
  editingProduct.value = null
  formData.value = {
    name: '',
    nameEn: '',
    imageUrl: '',
    cityId: '',
    storeId: '',
    price: '',
    originalPrice: '',
    sort: 100,
    tag: ''
  }
  showModal.value = true
}

function openEditModal(product) {
  editingProduct.value = product
  formData.value = {
    name: product.name,
    nameEn: product.nameEn || '',
    imageUrl: product.imageUrl,
    cityId: product.cityId,
    storeId: product.storeId,
    price: product.price,
    originalPrice: product.originalPrice || '',
    sort: product.sort,
    tag: product.tag || ''
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingProduct.value = null
}

async function submitForm() {
  try {
    if (editingProduct.value) {
      const res = await fetch(`/api/hot-products/${editingProduct.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.value)
      })
      const data = await res.json()
      if (data.success) {
        closeModal()
        fetchProducts()
      }
    } else {
      const res = await fetch('/api/hot-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.value)
      })
      const data = await res.json()
      if (data.success) {
        closeModal()
        fetchProducts()
      }
    }
  } catch (e) {
    console.error(e)
  }
}

async function deleteProduct(id) {
  if (!confirm(t('hotAdmin.deleteConfirm'))) return
  try {
    const res = await fetch(`/api/hot-products/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) fetchProducts()
  } catch (e) {
    console.error(e)
  }
}

watch([filterCityId, filterStoreId], () => {
  fetchProducts()
})

onMounted(() => {
  fetchProducts()
  fetchCities()
  fetchStores()
})
</script>

<style scoped>
.hot-admin-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  color: #1f2937;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  gap: 20px;
}

.page-header h2 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 6px 0;
}

.page-subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
  border: none;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.35);
}

.btn-primary svg {
  width: 18px;
  height: 18px;
}

.btn-secondary {
  padding: 10px 20px;
  background: #fff;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
}

.filter-select {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
  background: #fff;
  cursor: pointer;
  outline: none;
  font-family: inherit;
}

.filter-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.table-container {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}

.admin-table thead {
  background: #f9fafb;
}

.admin-table th {
  padding: 14px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.admin-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  color: #374151;
  vertical-align: middle;
}

.admin-table tbody tr:hover {
  background: #fafbff;
}

.preview-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.title-cell {
  font-weight: 600;
  color: #111827;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price-cell {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.price-cell .price-current {
  font-size: 16px;
  font-weight: 700;
  color: #ef4444;
}

.price-cell .price-original {
  font-size: 12px;
  color: #9ca3af;
  text-decoration: line-through;
}

.sort-input {
  width: 70px;
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  text-align: center;
  outline: none;
  font-family: inherit;
}

.sort-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.tag-badge {
  display: inline-block;
  padding: 3px 8px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.text-muted {
  color: #9ca3af;
}

.date-cell {
  color: #6b7280;
  font-size: 13px;
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
  white-space: nowrap;
}

.action-btn.edit {
  background: #eef2ff;
  color: #667eea;
}

.action-btn.edit:hover {
  background: #e0e7ff;
}

.action-btn.delete {
  background: #f3f4f6;
  color: #6b7280;
}

.action-btn.delete:hover {
  background: #fee2e2;
  color: #dc2626;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-content h3 {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 24px 0;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row.two-col {
  flex-direction: row;
  gap: 16px;
}

.form-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.form-row input,
.form-row select,
.form-row textarea {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  outline: none;
  font-family: inherit;
  resize: vertical;
}

.form-row input:focus,
.form-row select:focus,
.form-row textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.preview-row img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.form-preview {
  border: 1px solid #e5e7eb;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

@media (max-width: 900px) {
  .page-header {
    flex-direction: column;
  }

  .admin-table {
    font-size: 12px;
  }

  .preview-img {
    width: 50px;
    height: 50px;
  }

  .form-row.two-col {
    flex-direction: column;
    gap: 18px;
  }
}
</style>
