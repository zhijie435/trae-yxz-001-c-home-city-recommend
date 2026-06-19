import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../src/App.vue'
import { store, actions, getters } from '../src/store'
import { cityApi, bannerApi, productApi } from '../src/services/api'

describe('城市切换功能', () => {
  beforeEach(() => {
    store.city.list = []
    store.city.selectedId = ''
    store.banner.list = []
    store.product.list = []
    vi.clearAllMocks()
  })

  it('初始状态下 selectedId 为空，显示全国', () => {
    expect(store.city.selectedId).toBe('')
    expect(getters.currentCityName.value).toBe('全国')
    expect(getters.isCitySelected.value).toBe(false)
  })

  it('fetchCities 成功获取城市列表', async () => {
    const cities = await actions.fetchCities()
    expect(cityApi.getCities).toHaveBeenCalled()
    expect(store.city.list.length).toBe(3)
    expect(store.city.list[0].name).toBe('北京')
    expect(store.city.loading).toBe(false)
  })

  it('setSelectedCity 设置城市ID并刷新数据', async () => {
    await actions.fetchCities()
    
    const refreshSpy = vi.spyOn(actions, 'refreshCityDependentData').mockResolvedValue()
    
    await actions.setSelectedCity('1')
    
    expect(store.city.selectedId).toBe('1')
    expect(refreshSpy).toHaveBeenCalled()
    expect(getters.currentCity.value).toEqual({ id: 1, name: '北京', nameEn: 'Beijing' })
    expect(getters.currentCityName.value).toBe('北京')
    expect(getters.isCitySelected.value).toBe(true)
  })

  it('setSelectedCity 传入空字符串时重置为全国', async () => {
    await actions.fetchCities()
    await actions.setSelectedCity('1')
    expect(store.city.selectedId).toBe('1')
    
    await actions.setSelectedCity('')
    expect(store.city.selectedId).toBe('')
    expect(getters.currentCityName.value).toBe('全国')
    expect(getters.isCitySelected.value).toBe(false)
  })

  it('setSelectedCity 调用 refreshCityDependentData', async () => {
    await actions.fetchCities()
    
    const originalRefresh = actions.refreshCityDependentData
    let refreshCalled = false
    
    actions.refreshCityDependentData = async () => { refreshCalled = true }
    
    await actions.setSelectedCity('1')
    
    expect(refreshCalled).toBe(true)
    expect(store.city.selectedId).toBe('1')
    
    actions.refreshCityDependentData = originalRefresh
  })

  it('城市ID类型转换正确（数字转字符串）', async () => {
    await actions.fetchCities()
    await actions.setSelectedCity(2)
    
    expect(store.city.selectedId).toBe('2')
    expect(getters.currentCity.value).toEqual({ id: 2, name: '上海', nameEn: 'Shanghai' })
  })

  it('getters.currentCity 找不到城市时返回 null', async () => {
    await actions.fetchCities()
    store.city.selectedId = '999'
    
    expect(getters.currentCity.value).toBeNull()
    expect(getters.currentCityName.value).toBe('全国')
  })

  it('App 组件中城市选择器切换城市', async () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          BannerCarousel: { template: '<div class="banner-carousel"></div>' },
          HotRecommendations: { template: '<div class="hot-recommendations"></div>' },
          BannerAdmin: { template: '<div></div>' },
          BannerApply: { template: '<div></div>' },
          HotRecommendAdmin: { template: '<div></div>' },
          RentalTimeSelector: { template: '<div></div>' },
          CoreEntrySection: { template: '<div></div>' }
        }
      }
    })

    await actions.fetchCities()
    await wrapper.vm.$nextTick()

    const select = wrapper.find('.city-selector select')
    expect(select.exists()).toBe(true)
    
    const options = select.findAll('option')
    expect(options.length).toBe(4)
    expect(options[0].text()).toBe('全国')
    expect(options[1].text()).toBe('北京')
    expect(options[2].text()).toBe('上海')
    expect(options[3].text()).toBe('广州')

    await select.setValue('1')
    expect(store.city.selectedId).toBe('1')
  })

  it('detectCity 定位成功后设置选中城市', async () => {
    const city = await actions.detectCity(39.9, 116.4)
    
    expect(cityApi.detectCity).toHaveBeenCalledWith(39.9, 116.4)
    expect(store.city.selectedId).toBe('1')
    expect(city.name).toBe('北京')
  })

  it('fetchCities 失败时设置 error', async () => {
    const mockError = new Error('网络错误')
    cityApi.getCities.mockRejectedValueOnce(mockError)
    
    await expect(actions.fetchCities()).rejects.toThrow('网络错误')
    expect(store.city.error).toBe(mockError)
    expect(store.city.loading).toBe(false)
  })
})
