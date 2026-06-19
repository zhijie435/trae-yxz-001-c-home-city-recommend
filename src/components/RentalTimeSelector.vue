<template>
  <div class="rental-time-selector">
    <div class="selector-left">
      <div class="city-picker" :class="{ detecting: isDetecting }" @click="toggleCityDropdown">
        <svg class="city-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8" fill="none"/>
        </svg>
        <span class="city-name">{{ currentCityName }}</span>
        <svg v-if="isDetecting" class="spin-icon" viewBox="0 0 24 24" fill="none">
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <svg v-else class="chevron-icon" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <transition name="city-dropdown">
        <div v-if="showCityDropdown" class="city-dropdown">
          <div class="city-dropdown-header">
            <span>{{ $t('rental.selectCity') }}</span>
          </div>
          <ul class="city-list">
            <li
              v-for="city in store.city.list"
              :key="city.id"
              class="city-item"
              :class="{ active: String(store.city.selectedId) === String(city.id) }"
              @click="selectCity(city)"
            >
              <span class="city-item-name">{{ city.name }}</span>
              <span class="city-item-en">{{ city.nameEn }}</span>
              <svg v-if="String(store.city.selectedId) === String(city.id)" class="check-icon" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </li>
          </ul>
        </div>
      </transition>
    </div>

    <div class="selector-right">
      <div class="time-field" @click="showDatePicker = true">
        <svg class="time-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <path d="M3 9h18" stroke="currentColor" stroke-width="1.8"/>
          <path d="M8 2v4M16 2v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <span class="time-text">{{ displayDateRange }}</span>
      </div>
      <transition name="picker-dropdown">
        <div v-if="showDatePicker" class="date-picker-panel">
          <div class="picker-header">
            <button class="picker-nav" @click="prevMonth">
              <svg viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <span class="picker-month">{{ pickerYear }}年{{ pickerMonth + 1 }}月</span>
            <button class="picker-nav" @click="nextMonth">
              <svg viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
          <div class="picker-weekdays">
            <span v-for="d in weekdays" :key="d">{{ d }}</span>
          </div>
          <div class="picker-days">
            <button
              v-for="(day, idx) in calendarDays"
              :key="idx"
              class="picker-day"
              :class="{
                empty: !day,
                'start-date': day && isStartDate(day),
                'end-date': day && isEndDate(day),
                'in-range': day && isInRange(day),
                today: day && isToday(day),
                disabled: day && isPastDay(day)
              }"
              :disabled="!day || isPastDay(day)"
              @click="pickDate(day)"
            >
              {{ day || '' }}
            </button>
          </div>
          <div class="picker-footer">
            <div class="selected-range-hint" v-if="startDate && endDate">
              {{ formatDate(startDate) }} ~ {{ formatDate(endDate) }}
              <span class="range-count">（{{ dayCount }}{{ $t('rental.days') }}）</span>
            </div>
            <div class="selected-range-hint" v-else-if="startDate">
              {{ formatDate(startDate) }} ~ ?
            </div>
            <div v-else class="selected-range-hint placeholder">{{ $t('rental.selectDateHint') }}</div>
            <div class="picker-actions">
              <button class="btn-reset" @click="resetDates">{{ $t('rental.reset') }}</button>
              <button class="btn-confirm" :disabled="!startDate || !endDate" @click="confirmDates">{{ $t('rental.confirm') }}</button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { store, getters, actions } from '../store'

const { t } = useI18n()

const showCityDropdown = ref(false)
const showDatePicker = ref(false)
const startDate = ref(null)
const endDate = ref(null)
const pickingPhase = ref('start')
const pickerYear = ref(new Date().getFullYear())
const pickerMonth = ref(new Date().getMonth())

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

const isDetecting = computed(() => store.city.detecting)

const currentCityName = computed(() => {
  if (!getters.isCitySelected.value) return '全国'
  const city = getters.currentCity.value
  return city ? city.name : '全国'
})

const dayCount = computed(() => {
  if (!startDate.value || !endDate.value) return 0
  const diff = endDate.value.getTime() - startDate.value.getTime()
  return Math.round(diff / (1000 * 60 * 60 * 24)) + 1
})

const displayDateRange = computed(() => {
  if (startDate.value && endDate.value) {
    return `${formatDate(startDate.value)} ~ ${formatDate(endDate.value)} (${dayCount.value}${t('rental.days')})`
  }
  if (startDate.value) {
    return `${formatDate(startDate.value)} ~ ?`
  }
  return t('rental.selectDate')
})

const calendarDays = computed(() => {
  const year = pickerYear.value
  const month = pickerMonth.value
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d)
  }
  return days
})

function formatDate(date) {
  const m = date.getMonth() + 1
  const d = date.getDate()
  return `${m}月${d}日`
}

function isToday(day) {
  const today = new Date()
  return day === today.getDate() && pickerMonth.value === today.getMonth() && pickerYear.value === today.getFullYear()
}

function isPastDay(day) {
  const date = new Date(pickerYear.value, pickerMonth.value, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

function isStartDate(day) {
  if (!startDate.value) return false
  return day === startDate.value.getDate() && pickerMonth.value === startDate.value.getMonth() && pickerYear.value === startDate.value.getFullYear()
}

function isEndDate(day) {
  if (!endDate.value) return false
  return day === endDate.value.getDate() && pickerMonth.value === endDate.value.getMonth() && pickerYear.value === endDate.value.getFullYear()
}

function isInRange(day) {
  if (!startDate.value || !endDate.value) return false
  const date = new Date(pickerYear.value, pickerMonth.value, day)
  return date > startDate.value && date < endDate.value
}

function pickDate(day) {
  if (!day || isPastDay(day)) return
  const date = new Date(pickerYear.value, pickerMonth.value, day)
  date.setHours(0, 0, 0, 0)

  if (pickingPhase.value === 'start') {
    startDate.value = date
    endDate.value = null
    pickingPhase.value = 'end'
  } else {
    if (date <= startDate.value) {
      startDate.value = date
      endDate.value = null
      pickingPhase.value = 'end'
    } else {
      endDate.value = date
      pickingPhase.value = 'start'
    }
  }
}

function prevMonth() {
  if (pickerMonth.value === 0) {
    pickerMonth.value = 11
    pickerYear.value--
  } else {
    pickerMonth.value--
  }
}

function nextMonth() {
  if (pickerMonth.value === 11) {
    pickerMonth.value = 0
    pickerYear.value++
  } else {
    pickerMonth.value++
  }
}

function resetDates() {
  startDate.value = null
  endDate.value = null
  pickingPhase.value = 'start'
}

function confirmDates() {
  if (startDate.value && endDate.value) {
    showDatePicker.value = false
  }
}

function toggleCityDropdown() {
  showCityDropdown.value = !showCityDropdown.value
  if (showCityDropdown.value) {
    showDatePicker.value = false
  }
}

function selectCity(city) {
  actions.setSelectedCity(String(city.id))
  showCityDropdown.value = false
}

function handleClickOutside(e) {
  if (!e.target.closest('.selector-left')) {
    showCityDropdown.value = false
  }
  if (!e.target.closest('.selector-right')) {
    showDatePicker.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.rental-time-selector {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;
}

.selector-left,
.selector-right {
  position: relative;
}

.city-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  min-width: 140px;
  user-select: none;
}

.city-picker:hover {
  background: rgba(255, 255, 255, 0.28);
  border-color: rgba(255, 255, 255, 0.4);
}

.city-picker:active {
  transform: scale(0.97);
  transition-duration: 0.1s;
}

.city-picker.detecting {
  pointer-events: none;
  opacity: 0.7;
}

.city-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: #fff;
}

.city-name {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

.chevron-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.7);
  transition: transform 0.2s ease;
}

.spin-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: #fff;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.city-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 220px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  z-index: 50;
}

.city-dropdown-header {
  padding: 14px 18px 10px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #f3f4f6;
}

.city-list {
  list-style: none;
  margin: 0;
  padding: 6px;
}

.city-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.city-item:hover {
  background: #f5f3ff;
}

.city-item.active {
  background: #eef2ff;
  color: #667eea;
}

.city-item-name {
  font-size: 15px;
  font-weight: 600;
}

.city-item-en {
  font-size: 12px;
  color: #9ca3af;
  flex: 1;
}

.city-item.active .city-item-en {
  color: #667eea;
  opacity: 0.7;
}

.check-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #667eea;
}

.time-field {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  user-select: none;
}

.time-field:hover {
  background: rgba(255, 255, 255, 0.28);
  border-color: rgba(255, 255, 255, 0.4);
}

.time-field:active {
  transform: scale(0.97);
  transition-duration: 0.1s;
}

.time-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: #fff;
}

.time-text {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

.date-picker-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 340px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  z-index: 50;
  color: #1f2937;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
}

.picker-nav {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease;
  border: none;
  background: transparent;
  color: #374151;
}

.picker-nav:hover {
  background: #f3f4f6;
}

.picker-nav svg {
  width: 18px;
  height: 18px;
}

.picker-month {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.picker-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0 14px 8px;
  text-align: center;
}

.picker-weekdays span {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  padding: 4px 0;
}

.picker-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0 14px 14px;
  gap: 2px;
}

.picker-day {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
  background: transparent;
  color: #374151;
}

.picker-day.empty {
  pointer-events: none;
}

.picker-day:hover:not(.empty):not(.disabled) {
  background: #f5f3ff;
  color: #667eea;
}

.picker-day.today {
  color: #667eea;
  font-weight: 700;
}

.picker-day.disabled {
  color: #d1d5db;
  cursor: not-allowed;
}

.picker-day.start-date {
  background: #667eea;
  color: #fff;
  border-radius: 10px 4px 4px 10px;
  font-weight: 600;
}

.picker-day.end-date {
  background: #667eea;
  color: #fff;
  border-radius: 4px 10px 10px 4px;
  font-weight: 600;
}

.picker-day.start-date.end-date {
  border-radius: 10px;
}

.picker-day.in-range {
  background: #eef2ff;
  color: #667eea;
  border-radius: 4px;
}

.picker-footer {
  padding: 14px 18px;
  border-top: 1px solid #f3f4f6;
}

.selected-range-hint {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.selected-range-hint.placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.range-count {
  color: #667eea;
}

.picker-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-reset {
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #374151;
  transition: all 0.2s ease;
}

.btn-reset:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.btn-confirm {
  padding: 8px 22px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  transition: all 0.2s ease;
}

.btn-confirm:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.city-dropdown-enter-active,
.city-dropdown-leave-active,
.picker-dropdown-enter-active,
.picker-dropdown-leave-active {
  transition: all 0.2s ease;
}

.city-dropdown-enter-from,
.city-dropdown-leave-to,
.picker-dropdown-enter-from,
.picker-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 640px) {
  .rental-time-selector {
    flex-direction: column;
    gap: 10px;
  }

  .city-picker,
  .time-field {
    padding: 10px 14px;
    min-width: auto;
    width: 100%;
  }

  .city-dropdown,
  .date-picker-panel {
    width: 100%;
    min-width: auto;
  }

  .city-name,
  .time-text {
    font-size: 14px;
  }
}
</style>
