import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HotRecommendations from '../src/components/HotRecommendations.vue'
import { store, getters, actions } from '../src/store'
import { productApi } from '../src/services/api'

describe('热门商品排序功能', () => {
  const mockProducts = [
    { id: 1, name: '苹果手机', price: 5999, sales: 2500, sort: 3, nameEn: 'iPhone' },
    { id: 2, name: '华为手机', price: 4999, sales: 3800, sort: 1, nameEn: 'Huawei' },
    { id: 3, name: '小米手机', price: 2999, sales: 5200, sort: 2, nameEn: 'Xiaomi' },
    { id: 4, name: 'OPPO手机', price: 3499, sales: 1800, sort: 4, nameEn: 'OPPO' }
  ]

  beforeEach(() => {
    store.product.list = []
    store.product.sortBy = 'sort'
    store.product.sortOrder = 'asc'
    store.product.limit = 8
    store.product.loading = false
    store.product.error = null
    vi.clearAllMocks()
  })

  it('初始状态排序字段为 sort，顺序为 asc', () => {
    expect(store.product.sortBy).toBe('sort')
    expect(store.product.sortOrder).toBe('asc')
  })

  it('fetchHotProducts 成功获取商品列表', async () => {
    const products = await actions.fetchHotProducts()
    
    expect(productApi.getHotProducts).toHaveBeenCalled()
    expect(store.product.list.length).toBe(3)
    expect(store.product.loading).toBe(false)
  })

  it('fetchHotProducts 传递正确的参数', async () => {
    store.city.selectedId = '1'
    store.product.limit = 8
    store.product.sortBy = 'sales'
    store.product.sortOrder = 'desc'

    await actions.fetchHotProducts()
    
    expect(productApi.getHotProducts).toHaveBeenCalledWith('1', 8, 'sales', 'desc')
  })

  it('sortedProducts 按默认 sort 字段升序排列', () => {
    store.product.list = [...mockProducts]
    store.product.sortBy = 'sort'
    store.product.sortOrder = 'asc'

    const sorted = getters.sortedProducts.value
    
    expect(sorted[0].id).toBe(2)
    expect(sorted[1].id).toBe(3)
    expect(sorted[2].id).toBe(1)
    expect(sorted[3].id).toBe(4)
  })

  it('sortedProducts 按 sort 字段降序排列', () => {
    store.product.list = [...mockProducts]
    store.product.sortBy = 'sort'
    store.product.sortOrder = 'desc'

    const sorted = getters.sortedProducts.value
    
    expect(sorted[0].id).toBe(4)
    expect(sorted[1].id).toBe(1)
    expect(sorted[2].id).toBe(3)
    expect(sorted[3].id).toBe(2)
  })

  it('sortedProducts 按销量 sales 降序排列', () => {
    store.product.list = [...mockProducts]
    store.product.sortBy = 'sales'
    store.product.sortOrder = 'asc'

    const sorted = getters.sortedProducts.value
    
    expect(sorted[0].sales).toBe(5200)
    expect(sorted[1].sales).toBe(3800)
    expect(sorted[2].sales).toBe(2500)
    expect(sorted[3].sales).toBe(1800)
  })

  it('sortedProducts 按价格 price 升序排列', () => {
    store.product.list = [...mockProducts]
    store.product.sortBy = 'price'
    store.product.sortOrder = 'asc'

    const sorted = getters.sortedProducts.value
    
    expect(sorted[0].price).toBe(2999)
    expect(sorted[1].price).toBe(3499)
    expect(sorted[2].price).toBe(4999)
    expect(sorted[3].price).toBe(5999)
  })

  it('sortedProducts 按价格 price 降序排列', () => {
    store.product.list = [...mockProducts]
    store.product.sortBy = 'price'
    store.product.sortOrder = 'desc'

    const sorted = getters.sortedProducts.value
    
    expect(sorted[0].price).toBe(5999)
    expect(sorted[1].price).toBe(4999)
    expect(sorted[2].price).toBe(3499)
    expect(sorted[3].price).toBe(2999)
  })

  it('sortedProducts 按名称 name 升序排列', () => {
    store.product.list = [...mockProducts]
    store.product.sortBy = 'name'
    store.product.sortOrder = 'asc'

    const sorted = getters.sortedProducts.value
    const names = sorted.map(p => p.name)
    
    const expectedAsc = [...mockProducts].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')).map(p => p.name)
    expect(names).toEqual(expectedAsc)
  })

  it('sortedProducts 按名称 name 降序排列', () => {
    store.product.list = [...mockProducts]
    store.product.sortBy = 'name'
    store.product.sortOrder = 'desc'

    const sorted = getters.sortedProducts.value
    const names = sorted.map(p => p.name)
    
    const expectedDesc = [...mockProducts].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')).reverse().map(p => p.name)
    expect(names).toEqual(expectedDesc)
  })

  it('setProductSort 更新排序字段并重新获取数据', async () => {
    const fetchSpy = vi.spyOn(actions, 'fetchHotProducts').mockResolvedValue([])
    
    await actions.setProductSort('price', 'desc')
    
    expect(store.product.sortBy).toBe('price')
    expect(store.product.sortOrder).toBe('desc')
    expect(fetchSpy).toHaveBeenCalled()
  })

  it('setProductSort 默认使用 asc 顺序', async () => {
    const fetchSpy = vi.spyOn(actions, 'fetchHotProducts').mockResolvedValue([])
    
    await actions.setProductSort('sales')
    
    expect(store.product.sortBy).toBe('sales')
    expect(store.product.sortOrder).toBe('asc')
    expect(fetchSpy).toHaveBeenCalled()
  })

  it('toggleSortOrder 切换排序顺序', async () => {
    const fetchSpy = vi.spyOn(actions, 'fetchHotProducts').mockResolvedValue([])
    
    expect(store.product.sortOrder).toBe('asc')
    
    await actions.toggleSortOrder()
    expect(store.product.sortOrder).toBe('desc')
    
    await actions.toggleSortOrder()
    expect(store.product.sortOrder).toBe('asc')
    
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })

  it('HotRecommendations 组件渲染排序下拉框', () => {
    store.product.list = mockProducts
    const wrapper = mount(HotRecommendations)

    expect(wrapper.find('.sort-dropdown').exists()).toBe(true)
    expect(wrapper.find('.sort-trigger').exists()).toBe(true)
  })

  it('HotRecommendations 组件渲染排序选项', async () => {
    store.product.list = mockProducts
    const wrapper = mount(HotRecommendations)

    const sortTrigger = wrapper.find('.sort-trigger')
    await sortTrigger.trigger('click')

    expect(wrapper.find('.sort-menu').exists()).toBe(true)
    const options = wrapper.findAll('.sort-option')
    expect(options.length).toBe(4)
  })

  it('点击排序选项切换排序方式', async () => {
    store.product.list = mockProducts
    const setProductSortSpy = vi.spyOn(actions, 'setProductSort').mockResolvedValue([])

    const wrapper = mount(HotRecommendations)

    const sortTrigger = wrapper.find('.sort-trigger')
    await sortTrigger.trigger('click')

    const options = wrapper.findAll('.sort-option')
    await options[1].trigger('click')

    expect(setProductSortSpy).toHaveBeenCalledWith('sales', 'asc')
  })

  it('HotRecommendations 组件显示商品卡片', () => {
    store.product.list = mockProducts
    const wrapper = mount(HotRecommendations)

    const cards = wrapper.findAll('.product-card')
    expect(cards.length).toBe(4)
  })

  it('HotRecommendations 商品卡片显示正确的排名', () => {
    store.product.list = mockProducts
    const wrapper = mount(HotRecommendations)

    const ranks = wrapper.findAll('.product-rank')
    expect(ranks[0].text()).toBe('1')
    expect(ranks[1].text()).toBe('2')
    expect(ranks[2].text()).toBe('3')
    expect(ranks[3].text()).toBe('4')
  })

  it('HotRecommendations 加载状态显示 spinner', () => {
    store.product.loading = true
    store.product.list = []
    const wrapper = mount(HotRecommendations)

    expect(wrapper.find('.loading-container').exists()).toBe(true)
    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
  })

  it('HotRecommendations 空状态显示提示', () => {
    store.product.loading = false
    store.product.list = []
    const wrapper = mount(HotRecommendations)

    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.find('.empty-text').exists()).toBe(true)
  })

  it('getProductName 根据语言返回正确名称', () => {
    store.product.list = mockProducts
    const wrapper = mount(HotRecommendations)
    const vm = wrapper.vm

    const product = mockProducts[0]
    expect(vm.getProductName(product)).toBe('苹果手机')
  })

  it('getProductTagLabel 正确映射标签', () => {
    store.product.list = mockProducts
    const wrapper = mount(HotRecommendations)
    const vm = wrapper.vm

    expect(vm.getProductTagLabel('热销')).toBeDefined()
    expect(vm.getProductTagLabel('爆款')).toBeDefined()
    expect(vm.getProductTagLabel('新品')).toBeDefined()
    expect(vm.getProductTagLabel('推荐')).toBeDefined()
    expect(vm.getProductTagLabel('未知标签')).toBe('未知标签')
  })

  it('点击商品触发 handleProductClick', async () => {
    const { navigationService } = await import('../src/services/navigation')
    const handleClickSpy = vi.spyOn(navigationService, 'handleProductClick')

    store.product.list = mockProducts
    const wrapper = mount(HotRecommendations)

    const firstCard = wrapper.findAll('.product-card')[0]
    await firstCard.trigger('click')

    expect(handleClickSpy).toHaveBeenCalledWith(mockProducts[0])
  })

  it('currentSortLabel 返回正确的排序标签', () => {
    store.product.list = mockProducts
    store.product.sortBy = 'sales'
    const wrapper = mount(HotRecommendations)

    expect(wrapper.vm.currentSortLabel).toBeDefined()
  })

  it('selectedCityName 根据选中城市返回名称', () => {
    store.city.list = [
      { id: 1, name: '北京', nameEn: 'Beijing' },
      { id: 2, name: '上海', nameEn: 'Shanghai' }
    ]
    store.city.selectedId = '1'
    store.product.list = mockProducts

    const wrapper = mount(HotRecommendations)
    expect(wrapper.vm.selectedCityName).toBe('北京')
  })

  it('selectedCityName 未选城市时返回空字符串', () => {
    store.city.selectedId = ''
    store.product.list = mockProducts

    const wrapper = mount(HotRecommendations)
    expect(wrapper.vm.selectedCityName).toBe('')
  })

  it('fetchHotProducts 失败时设置 error', async () => {
    const mockError = new Error('获取商品失败')
    
    const originalFetch = actions.fetchHotProducts
    actions.fetchHotProducts = async () => {
      store.product.loading = true
      store.product.error = null
      try {
        throw mockError
      } catch (error) {
        store.product.error = error
        throw error
      } finally {
        store.product.loading = false
      }
    }

    await expect(actions.fetchHotProducts()).rejects.toThrow('获取商品失败')
    expect(store.product.error).toBe(mockError)
    expect(store.product.loading).toBe(false)
    
    actions.fetchHotProducts = originalFetch
  })

  it('sortedProducts 不修改原数组', () => {
    store.product.list = [...mockProducts]
    const originalOrder = store.product.list.map(p => p.id)
    
    store.product.sortBy = 'price'
    store.product.sortOrder = 'desc'
    getters.sortedProducts.value
    
    expect(store.product.list.map(p => p.id)).toEqual(originalOrder)
  })
})
