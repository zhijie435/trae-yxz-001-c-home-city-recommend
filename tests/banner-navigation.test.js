import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BannerCarousel from '../src/components/BannerCarousel.vue'
import { store, actions } from '../src/store'
import { navigationService } from '../src/services/navigation'

describe('Banner 跳转功能', () => {
  const mockBanners = [
    { id: 1, title: 'Banner1', imageUrl: '/banner1.jpg', linkUrl: 'https://example.com/page1', type: 'global', storeName: '店铺A' },
    { id: 2, title: 'Banner2', imageUrl: '/banner2.jpg', linkUrl: 'https://example.com/page2', type: 'city' },
    { id: 3, title: 'Banner3', imageUrl: '/banner3.jpg', linkUrl: '', type: 'global' }
  ]

  beforeEach(() => {
    store.banner.list = []
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('fetchBanners 成功获取 Banner 列表', async () => {
    const banners = await actions.fetchBanners()
    expect(banners.length).toBeGreaterThan(0)
    expect(store.banner.loading).toBe(false)
    expect(store.banner.list.length).toBe(1)
  })

  it('BannerCarousel 组件渲染 Banner 列表', () => {
    const wrapper = mount(BannerCarousel, {
      props: {
        banners: mockBanners,
        autoPlay: false
      }
    })

    expect(wrapper.find('.banner-carousel').exists()).toBe(true)
    const slides = wrapper.findAll('.carousel-slide')
    expect(slides.length).toBe(3)
  })

  it('BannerCarousel 无 Banner 时显示空状态', () => {
    const wrapper = mount(BannerCarousel, {
      props: {
        banners: [],
        autoPlay: false
      }
    })

    expect(wrapper.find('.banner-empty').exists()).toBe(true)
    expect(wrapper.find('.banner-carousel').exists()).toBe(false)
  })

  it('handleBannerClick 有 linkUrl 时打开外部链接', () => {
    const openExternalSpy = vi.spyOn(navigationService, 'openExternal')
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    navigationService.handleBannerClick(mockBanners[0])

    expect(openExternalSpy).toHaveBeenCalledWith('https://example.com/page1')
    expect(window.open).toHaveBeenCalledWith('https://example.com/page1', '_blank', 'noopener,noreferrer')
    consoleWarnSpy.mockRestore()
  })

  it('handleBannerClick 无 linkUrl 时发出警告不跳转', () => {
    const openExternalSpy = vi.spyOn(navigationService, 'openExternal')
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    navigationService.handleBannerClick(mockBanners[2])

    expect(openExternalSpy).not.toHaveBeenCalled()
    expect(window.open).not.toHaveBeenCalled()
    expect(consoleWarnSpy).toHaveBeenCalledWith('Banner has no linkUrl:', 3)
    consoleWarnSpy.mockRestore()
  })

  it('点击 Banner 触发跳转', async () => {
    const handleClickSpy = vi.spyOn(navigationService, 'handleBannerClick')

    const wrapper = mount(BannerCarousel, {
      props: {
        banners: mockBanners,
        autoPlay: false
      }
    })

    const firstBannerLink = wrapper.findAll('.banner-link')[0]
    await firstBannerLink.trigger('click')

    expect(handleClickSpy).toHaveBeenCalledWith(mockBanners[0])
  })

  it('导航服务事件监听机制正常', () => {
    const mockListener = vi.fn()
    const unsubscribe = navigationService.on(mockListener)

    navigationService.handleBannerClick(mockBanners[0])

    expect(mockListener).toHaveBeenCalledWith('banner:click', { banner: mockBanners[0] })
    expect(mockListener).toHaveBeenCalledWith('external:open', { url: 'https://example.com/page1', target: '_blank' })

    unsubscribe()
    mockListener.mockClear()

    navigationService.handleBannerClick(mockBanners[0])
    expect(mockListener).not.toHaveBeenCalled()
  })

  it('非 http 链接也能正确打开', () => {
    const banner = { id: 4, title: 'Internal', imageUrl: '/test.jpg', linkUrl: '/internal/page' }
    navigationService.handleBannerClick(banner)

    expect(window.open).toHaveBeenCalledWith('/internal/page', '_blank')
  })

  it('轮播图下一张功能正常', () => {
    const wrapper = mount(BannerCarousel, {
      props: {
        banners: mockBanners,
        autoPlay: false
      }
    })

    const vm = wrapper.vm
    expect(vm.currentIndex).toBe(0)

    vm.nextSlide()
    expect(vm.currentIndex).toBe(1)

    vm.nextSlide()
    expect(vm.currentIndex).toBe(2)

    vm.nextSlide()
    expect(vm.currentIndex).toBe(0)
  })

  it('轮播图上一张功能正常', () => {
    const wrapper = mount(BannerCarousel, {
      props: {
        banners: mockBanners,
        autoPlay: false
      }
    })

    const vm = wrapper.vm
    expect(vm.currentIndex).toBe(0)

    vm.prevSlide()
    expect(vm.currentIndex).toBe(2)

    vm.prevSlide()
    expect(vm.currentIndex).toBe(1)
  })

  it('轮播图跳转到指定位置', () => {
    const wrapper = mount(BannerCarousel, {
      props: {
        banners: mockBanners,
        autoPlay: false
      }
    })

    const vm = wrapper.vm
    vm.goToSlide(2)
    expect(vm.currentIndex).toBe(2)
  })

  it('自动轮播功能正常', async () => {
    const wrapper = mount(BannerCarousel, {
      props: {
        banners: mockBanners,
        autoPlay: true,
        interval: 3000
      }
    })

    const vm = wrapper.vm
    expect(vm.currentIndex).toBe(0)

    vi.advanceTimersByTime(3000)
    await wrapper.vm.$nextTick()
    expect(vm.currentIndex).toBe(1)

    vi.advanceTimersByTime(3000)
    await wrapper.vm.$nextTick()
    expect(vm.currentIndex).toBe(2)
  })

  it('单张 Banner 时禁用自动轮播和箭头', () => {
    const singleBanner = [mockBanners[0]]
    const wrapper = mount(BannerCarousel, {
      props: {
        banners: singleBanner,
        autoPlay: true,
        interval: 3000
      }
    })

    const prevBtn = wrapper.find('.carousel-arrow.prev')
    const nextBtn = wrapper.find('.carousel-arrow.next')

    expect(prevBtn.attributes('disabled')).toBeDefined()
    expect(nextBtn.attributes('disabled')).toBeDefined()

    vi.advanceTimersByTime(5000)
    expect(wrapper.vm.currentIndex).toBe(0)
  })

  it('点击轮播指示器跳转到对应 Banner', async () => {
    const wrapper = mount(BannerCarousel, {
      props: {
        banners: mockBanners,
        autoPlay: false
      }
    })

    const dots = wrapper.findAll('.carousel-dot')
    expect(dots.length).toBe(3)

    await dots[2].trigger('click')
    expect(wrapper.vm.currentIndex).toBe(2)
    expect(dots[2].classes()).toContain('active')
  })

  it('fetchBanners 根据城市ID获取对应 Banner', async () => {
    await actions.fetchBanners('1')
    expect(store.banner.list.length).toBe(1)
  })

  it('fetchBanners 失败时设置 error', async () => {
    const { bannerApi } = await import('../src/services/api')
    const mockError = new Error('获取Banner失败')
    bannerApi.getBanners.mockRejectedValueOnce(mockError)

    await expect(actions.fetchBanners()).rejects.toThrow('获取Banner失败')
    expect(store.banner.error).toBe(mockError)
    expect(store.banner.loading).toBe(false)
  })
})
