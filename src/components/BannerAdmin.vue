<template>
  <div class="banner-admin-page">
    <div class="page-header">
      <div>
        <h2>{{ $t('bannerAdmin.title') }}</h2>
        <p class="page-subtitle">{{ $t('bannerAdmin.subtitle') }}</p>
      </div>
      <button class="btn-primary" @click="openCreateModal">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
        </svg>
        {{ $t('bannerAdmin.addGlobal') }}
      </button>
    </div>

    <div class="filter-bar">
      <div class="filter-group">
        <span class="filter-label">状态:</span>
        <button
          v-for="opt in statusFilters"
          :key="opt.value"
          class="filter-btn"
          :class="{ active: filterStatus === opt.value }"
          @click="filterStatus = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
      <div class="filter-group">
        <span class="filter-label">类型:</span>
        <button
          v-for="opt in typeFilters"
          :key="opt.value"
          class="filter-btn"
          :class="{ active: filterType === opt.value }"
          @click="filterType = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="table-container">
      <table class="admin-table">
        <thead>
          <tr>
            <th>预览</th>
            <th>{{ $t('bannerAdmin.columns.title') }}</th>
            <th>{{ $t('bannerAdmin.columns.type') }}</th>
            <th>{{ $t('bannerAdmin.columns.city') }}</th>
            <th>{{ $t('bannerAdmin.columns.store') }}</th>
            <th>{{ $t('bannerAdmin.columns.status') }}</th>
            <th>{{ $t('bannerAdmin.columns.link') }}</th>
            <th>{{ $t('bannerAdmin.columns.sort') }}</th>
            <th>{{ $t('bannerAdmin.columns.createdAt') }}</th>
            <th>{{ $t('bannerAdmin.columns.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="banner in filteredBanners" :key="banner.id">
            <td>
              <img :src="banner.imageUrl" :alt="banner.title" class="preview-img" />
            </td>
            <td class="title-cell">{{ banner.title }}</td>
            <td>
              <span class="type-badge" :class="banner.type">
                {{ $t(`bannerAdmin.typeMap.${banner.type}`) }}
              </span>
            </td>
            <td>{{ getCityName(banner.cityId) || '-' }}</td>
            <td>{{ banner.storeName || '-' }}</td>
            <td>
              <span class="status-badge" :class="banner.status">
                {{ $t(`bannerAdmin.statusMap.${banner.status}`) }}
              </span>
            </td>
            <td class="link-cell">
              <a v-if="banner.linkUrl" :href="banner.linkUrl" target="_blank" class="link-text">
                {{ banner.linkUrl }}
              </a>
              <span v-else>-</span>
            </td>
            <td>{{ banner.sort }}</td>
            <td class="date-cell">{{ formatDate(banner.createdAt) }}</td>
            <td>
              <div class="action-buttons">
                <button v-if="banner.status === 'pending'" class="action-btn approve" @click="approveBanner(banner.id)">
                  {{ $t('bannerAdmin.actions.approve') }}
                </button>
                <button v-if="banner.status === 'pending'" class="action-btn reject" @click="rejectBanner(banner.id)">
                  {{ $t('bannerAdmin.actions.reject') }}
                </button>
                <button v-if="banner.type === 'global'" class="action-btn edit" @click="openEditModal(banner)">
                  {{ $t('bannerAdmin.actions.edit') }}
                </button>
                <button class="action-btn delete" @click="deleteBanner(banner.id)">
                  {{ $t('bannerAdmin.actions.delete') }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ editingBanner ? $t('bannerAdmin.form.update') : $t('bannerAdmin.form.create') }}</h3>
        <form @submit.prevent="submitForm" class="modal-form">
          <div class="form-row">
            <label>{{ $t('bannerAdmin.form.title') }} *</label>
            <input v-model="formData.title" type="text" :placeholder="$t('bannerAdmin.form.placeholder.title')" required />
          </div>
          <div class="form-row">
            <label>{{ $t('bannerAdmin.form.imageUrl') }} *</label>
            <input v-model="formData.imageUrl" type="text" :placeholder="$t('bannerAdmin.form.placeholder.imageUrl')" required />
          </div>
          <div class="form-row">
            <label>{{ $t('bannerAdmin.form.linkUrl') }}</label>
            <input v-model="formData.linkUrl" type="text" :placeholder="$t('bannerAdmin.form.placeholder.linkUrl')" />
          </div>
          <div class="form-row">
            <label>{{ $t('bannerAdmin.form.sort') }}</label>
            <input v-model.number="formData.sort" type="number" :placeholder="$t('bannerAdmin.form.placeholder.sort')" />
          </div>
          <div v-if="formData.imageUrl" class="form-row preview-row">
            <label>图片预览</label>
            <img :src="formData.imageUrl" alt="preview" class="form-preview" />
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeModal">
              {{ $t('bannerAdmin.form.cancel') }}
            </button>
            <button type="submit" class="btn-primary">
              {{ editingBanner ? $t('bannerAdmin.form.update') : $t('bannerAdmin.form.create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const banners = ref([])
const cities = ref([])
const filterStatus = ref('all')
const filterType = ref('all')
const showModal = ref(false)
const editingBanner = ref(null)

const formData = ref({
  title: '',
  imageUrl: '',
  linkUrl: '',
  sort: 100
})

const statusFilters = computed(() => [
  { value: 'all', label: t('bannerAdmin.filterAll') },
  { value: 'pending', label: t('bannerAdmin.filterPending') },
  { value: 'approved', label: t('bannerAdmin.filterApproved') },
  { value: 'rejected', label: t('bannerAdmin.filterRejected') }
])

const typeFilters = computed(() => [
  { value: 'all', label: t('bannerAdmin.filterAll') },
  { value: 'global', label: t('bannerAdmin.filterGlobal') },
  { value: 'city', label: t('bannerAdmin.filterCity') }
])

const filteredBanners = computed(() => {
  return banners.value.filter(b => {
    const statusMatch = filterStatus.value === 'all' || b.status === filterStatus.value
    const typeMatch = filterType.value === 'all' || b.type === filterType.value
    return statusMatch && typeMatch
  })
})

function getCityName(cityId) {
  if (!cityId) return null
  const city = cities.value.find(c => c.id === cityId)
  return city ? city.name : null
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString().slice(0, 5)
}

async function fetchBanners() {
  try {
    const res = await fetch('/api/banners/admin')
    const data = await res.json()
    if (data.success) {
      banners.value = data.data
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

function openCreateModal() {
  editingBanner.value = null
  formData.value = {
    title: '',
    imageUrl: '',
    linkUrl: '',
    sort: 100
  }
  showModal.value = true
}

function openEditModal(banner) {
  editingBanner.value = banner
  formData.value = {
    title: banner.title,
    imageUrl: banner.imageUrl,
    linkUrl: banner.linkUrl,
    sort: banner.sort
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingBanner.value = null
}

async function submitForm() {
  try {
    if (editingBanner.value) {
      const res = await fetch(`/api/banners/${editingBanner.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.value)
      })
      const data = await res.json()
      if (data.success) {
        closeModal()
        fetchBanners()
      }
    } else {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.value)
      })
      const data = await res.json()
      if (data.success) {
        closeModal()
        fetchBanners()
      }
    }
  } catch (e) {
    console.error(e)
  }
}

async function approveBanner(id) {
  try {
    const res = await fetch(`/api/banners/${id}/approve`, { method: 'PUT' })
    const data = await res.json()
    if (data.success) fetchBanners()
  } catch (e) {
    console.error(e)
  }
}

async function rejectBanner(id) {
  try {
    const res = await fetch(`/api/banners/${id}/reject`, { method: 'PUT' })
    const data = await res.json()
    if (data.success) fetchBanners()
  } catch (e) {
    console.error(e)
  }
}

async function deleteBanner(id) {
  if (!confirm(t('bannerAdmin.deleteConfirm'))) return
  try {
    const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) fetchBanners()
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchBanners()
  fetchCities()
})
</script>

<style scoped>
.banner-admin-page {
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

.filter-btn {
  padding: 6px 14px;
  background: #f3f4f6;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background: #e5e7eb;
}

.filter-btn.active {
  background: #eef2ff;
  color: #667eea;
  border-color: #c7d2fe;
  font-weight: 600;
}

.table-container {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
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
  width: 120px;
  height: 56px;
  object-fit: cover;
  border-radius: 6px;
}

.title-cell {
  font-weight: 600;
  color: #111827;
}

.type-badge,
.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.type-badge.global {
  background: #eef2ff;
  color: #667eea;
}

.type-badge.city {
  background: #fce7f3;
  color: #db2777;
}

.status-badge.approved {
  background: #d1fae5;
  color: #059669;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.rejected {
  background: #fee2e2;
  color: #dc2626;
}

.link-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-text {
  color: #667eea;
  text-decoration: none;
}

.link-text:hover {
  text-decoration: underline;
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
}

.action-btn.approve {
  background: #d1fae5;
  color: #059669;
}

.action-btn.approve:hover {
  background: #a7f3d0;
}

.action-btn.reject {
  background: #fee2e2;
  color: #dc2626;
}

.action-btn.reject:hover {
  background: #fecaca;
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
  max-width: 560px;
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

.form-row label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.form-row input,
.form-row select {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  outline: none;
  font-family: inherit;
}

.form-row input:focus,
.form-row select:focus {
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
    width: 80px;
    height: 40px;
  }
}
</style>
