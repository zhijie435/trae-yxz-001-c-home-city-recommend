<template>
  <div class="banner-apply-page">
    <div class="page-header">
      <div>
        <h2>{{ $t('bannerApply.title') }}</h2>
        <p class="page-subtitle">{{ $t('bannerApply.subtitle') }}</p>
      </div>
    </div>

    <div class="content-grid">
      <div class="apply-form-card">
        <form @submit.prevent="submitApplication" class="apply-form">
          <div class="form-row">
            <label>{{ $t('bannerApply.form.title') }} *</label>
            <input v-model="formData.title" type="text" :placeholder="$t('bannerApply.form.placeholder.title')" required />
          </div>
          <div class="form-row">
            <label>{{ $t('bannerApply.form.imageUrl') }} *</label>
            <input v-model="formData.imageUrl" type="text" :placeholder="$t('bannerApply.form.placeholder.imageUrl')" required />
          </div>
          <div v-if="formData.imageUrl" class="form-row preview-row">
            <label>图片预览</label>
            <img :src="formData.imageUrl" alt="preview" class="form-preview" />
          </div>
          <div class="form-row">
            <label>{{ $t('bannerApply.form.linkUrl') }}</label>
            <input v-model="formData.linkUrl" type="text" :placeholder="$t('bannerApply.form.placeholder.linkUrl')" />
          </div>
          <div class="form-row">
            <label>{{ $t('bannerApply.form.cityId') }} *</label>
            <select v-model="formData.cityId" :placeholder="$t('bannerApply.form.placeholder.cityId')" required>
              <option value="" disabled>{{ $t('bannerApply.form.placeholder.cityId') }}</option>
              <option v-for="city in cities" :key="city.id" :value="city.id">
                {{ city.name }} ({{ city.nameEn }})
              </option>
            </select>
          </div>
          <div class="form-row">
            <label>{{ $t('bannerApply.form.storeName') }} *</label>
            <input v-model="formData.storeName" type="text" :placeholder="$t('bannerApply.form.placeholder.storeName')" required />
          </div>

          <div v-if="successMsg" class="success-message">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ successMsg }}
          </div>

          <button type="submit" class="btn-primary submit-btn" :disabled="submitting">
            <span v-if="!submitting">{{ $t('bannerApply.form.submit') }}</span>
            <span v-else>提交中...</span>
          </button>
        </form>
      </div>

      <div class="applications-card">
        <h3 class="card-title">{{ $t('bannerApply.myApplications') }}</h3>
        <div v-if="myApplications.length === 0" class="empty-state">
          <p>暂无申请记录</p>
        </div>
        <div v-else class="applications-list">
          <div v-for="app in myApplications" :key="app.id" class="application-item">
            <img :src="app.imageUrl" :alt="app.title" class="app-image" />
            <div class="app-info">
              <h4 class="app-title">{{ app.title }}</h4>
              <p class="app-meta">
                <span class="city-badge">{{ getCityName(app.cityId) }}</span>
                <span class="store-name">{{ app.storeName }}</span>
              </p>
              <p v-if="app.linkUrl" class="app-link">{{ app.linkUrl }}</p>
            </div>
            <span class="status-badge" :class="app.status">
              {{ $t(`bannerApply.statusMap.${app.status}`) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const cities = ref([])
const myApplications = ref([])
const submitting = ref(false)
const successMsg = ref('')

const formData = ref({
  title: '',
  imageUrl: '',
  linkUrl: '',
  cityId: '',
  storeName: ''
})

function getCityName(cityId) {
  const city = cities.value.find(c => c.id === cityId)
  return city ? city.name : ''
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

async function fetchApplications() {
  try {
    const res = await fetch('/api/banners/admin?type=city')
    const data = await res.json()
    if (data.success) {
      const stored = localStorage.getItem('myAppliedBannerIds')
      const ids = stored ? JSON.parse(stored) : []
      myApplications.value = data.data.filter(b => ids.includes(b.id))
    }
  } catch (e) {
    console.error(e)
  }
}

function resetForm() {
  formData.value = {
    title: '',
    imageUrl: '',
    linkUrl: '',
    cityId: '',
    storeName: ''
  }
}

async function submitApplication() {
  submitting.value = true
  successMsg.value = ''
  try {
    const res = await fetch('/api/banners/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.value)
    })
    const data = await res.json()
    if (data.success) {
      const stored = localStorage.getItem('myAppliedBannerIds')
      const ids = stored ? JSON.parse(stored) : []
      ids.push(data.data.id)
      localStorage.setItem('myAppliedBannerIds', JSON.stringify(ids))

      successMsg.value = t('bannerApply.form.success')
      resetForm()
      fetchApplications()

      setTimeout(() => {
        successMsg.value = ''
      }, 3000)
    }
  } catch (e) {
    console.error(e)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchCities()
  fetchApplications()
})
</script>

<style scoped>
.banner-apply-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  color: #1f2937;
}

.page-header {
  margin-bottom: 28px;
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

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.apply-form-card,
.applications-card {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 20px 0;
}

.apply-form {
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
  padding: 11px 14px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s ease;
  outline: none;
  font-family: inherit;
  background: #fff;
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
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #d1fae5;
  color: #059669;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
}

.success-message svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.35);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn {
  margin-top: 4px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-size: 14px;
}

.applications-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.application-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: #f9fafb;
  border-radius: 12px;
  transition: background 0.2s ease;
}

.application-item:hover {
  background: #f3f4f6;
}

.app-image {
  width: 90px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.app-info {
  flex: 1;
  min-width: 0;
}

.app-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: #111827;
}

.app-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 4px 0;
  flex-wrap: wrap;
}

.city-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #eef2ff;
  color: #667eea;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.store-name {
  font-size: 12px;
  color: #6b7280;
}

.app-link {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
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

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
