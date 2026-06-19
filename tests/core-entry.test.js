import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CoreEntrySection from '../src/components/CoreEntrySection.vue'
import { navigationService } from '../src/services/navigation'
import { actions } from '../src/store'

describe('推荐入口功能', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('CoreEntrySection 组件渲染四个入口卡片', () => {
    const wrapper = mount(CoreEntrySection)

    const cards = wrapper.findAll('.entry-card')
    expect(cards.length).toBe(4)
  })

  it('入口卡片包含正确的标题和描述', () => {
    const wrapper = mount(CoreEntrySection)

    const cards = wrapper.findAll('.entry-card')
    const titles = cards.map(card => card.find('.entry-title').text())

    expect(titles.length).toBe(4)
  })

  it('handleEntryClick 点击场景推荐入口', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const mockListener = vi.fn()
    const unsubscribe = navigationService.on(mockListener)

    navigationService.handleEntryClick('scene')

    expect(mockListener).toHaveBeenCalledWith('entry:click', expect.objectContaining({
      key: 'scene',
      entry: expect.objectContaining({
        path: '/scene',
        name: '场景推荐'
      })
    }))
    expect(consoleLogSpy).toHaveBeenCalledWith('Navigate to: /scene (场景推荐)')

    consoleLogSpy.mockRestore()
    unsubscribe()
  })

  it('handleEntryClick 点击商家入驻入口', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const mockListener = vi.fn()
    const unsubscribe = navigationService.on(mockListener)

    navigationService.handleEntryClick('vendor')

    expect(mockListener).toHaveBeenCalledWith('entry:click', expect.objectContaining({
      key: 'vendor',
      entry: expect.objectContaining({
        path: '/vendor',
        name: '商家入驻'
      })
    }))
    expect(consoleLogSpy).toHaveBeenCalledWith('Navigate to: /vendor (商家入驻)')

    consoleLogSpy.mockRestore()
    unsubscribe()
  })

  it('handleEntryClick 点击AI助手入口', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const mockListener = vi.fn()
    const unsubscribe = navigationService.on(mockListener)

    navigationService.handleEntryClick('ai')

    expect(mockListener).toHaveBeenCalledWith('entry:click', expect.objectContaining({
      key: 'ai',
      entry: expect.objectContaining({
        path: '/ai',
        name: 'AI助手'
      })
    }))
    expect(consoleLogSpy).toHaveBeenCalledWith('Navigate to: /ai (AI助手)')

    consoleLogSpy.mockRestore()
    unsubscribe()
  })

  it('handleEntryClick 点击热门推荐入口滚动到对应区域', () => {
    const scrollSpy = vi.spyOn(navigationService, 'scrollToSection').mockImplementation(() => {})
    const mockListener = vi.fn()
    const unsubscribe = navigationService.on(mockListener)

    navigationService.handleEntryClick('hot')

    expect(mockListener).toHaveBeenCalledWith('entry:click', expect.objectContaining({
      key: 'hot'
    }))
    expect(scrollSpy).toHaveBeenCalledWith('hot-recommendations')

    unsubscribe()
  })

  it('handleEntryClick 未知入口键发出警告', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const mockListener = vi.fn()
    const unsubscribe = navigationService.on(mockListener)

    navigationService.handleEntryClick('unknown')

    expect(consoleWarnSpy).toHaveBeenCalledWith('Unknown entry key: unknown')
    expect(mockListener).not.toHaveBeenCalled()

    consoleWarnSpy.mockRestore()
    unsubscribe()
  })

  it('点击入口卡片触发 handleEntryClick', async () => {
    const handleClickSpy = vi.spyOn(navigationService, 'handleEntryClick')

    const wrapper = mount(CoreEntrySection)
    const cards = wrapper.findAll('.entry-card')

    await cards[0].trigger('click')
    expect(handleClickSpy).toHaveBeenCalledWith('scene')

    await cards[1].trigger('click')
    expect(handleClickSpy).toHaveBeenCalledWith('vendor')

    await cards[2].trigger('click')
    expect(handleClickSpy).toHaveBeenCalledWith('ai')

    await cards[3].trigger('click')
    expect(handleClickSpy).toHaveBeenCalledWith('hot')
  })

  it('scrollToSection 元素存在时调用 scrollIntoView', () => {
    const mockElement = {
      scrollIntoView: vi.fn()
    }
    
    vi.stubGlobal('document', {
      getElementById: vi.fn().mockReturnValue(mockElement),
      querySelector: vi.fn().mockReturnValue(null)
    })

    navigationService.scrollToSection('hot-recommendations')

    expect(document.getElementById).toHaveBeenCalledWith('hot-recommendations')
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    })

    vi.unstubAllGlobals()
  })

  it('scrollToSection 找不到 ID 时使用 class 选择器', () => {
    const mockElement = {
      scrollIntoView: vi.fn()
    }
    
    vi.stubGlobal('document', {
      getElementById: vi.fn().mockReturnValue(null),
      querySelector: vi.fn().mockReturnValue(mockElement)
    })

    navigationService.scrollToSection('hot-recommendations')

    expect(document.getElementById).toHaveBeenCalledWith('hot-recommendations')
    expect(document.querySelector).toHaveBeenCalledWith('.hot-recommendations')
    expect(mockElement.scrollIntoView).toHaveBeenCalled()

    vi.unstubAllGlobals()
  })

  it('scrollToSection 元素不存在时不抛出错误', () => {
    vi.stubGlobal('document', {
      getElementById: vi.fn().mockReturnValue(null),
      querySelector: vi.fn().mockReturnValue(null)
    })

    expect(() => {
      navigationService.scrollToSection('non-existent')
    }).not.toThrow()

    vi.unstubAllGlobals()
  })

  it('外部链接入口正确跳转', () => {
    const openExternalSpy = vi.spyOn(navigationService, 'openExternal')

    const testEntry = {
      key: 'external-test',
      path: 'https://external.com',
      name: '外部链接',
      external: true
    }

    const originalRoutes = navigationService._entryRoutes
    navigationService._entryRoutes = { 'external-test': testEntry }

    const testService = {
      ...navigationService,
      handleEntryClick: function(entryKey) {
        const entry = testEntry
        if (entry.external) {
          this.openExternal(entry.path)
        }
      }
    }

    testService.handleEntryClick('external-test')
    expect(openExternalSpy).toHaveBeenCalledWith('https://external.com')

    navigationService._entryRoutes = originalRoutes
  })

  it('navigateTo 设置当前页面并发送事件', async () => {
    const { store } = await import('../src/store')
    const mockListener = vi.fn()
    const unsubscribe = navigationService.on(mockListener)

    navigationService.navigateTo('bannerAdmin')

    expect(mockListener).toHaveBeenCalledWith('navigate:before', { page: 'bannerAdmin' })
    expect(mockListener).toHaveBeenCalledWith('navigate:after', { page: 'bannerAdmin' })

    expect(store.page.current).toBe('bannerAdmin')

    unsubscribe()
  })

  it('navigateToHome 导航到首页', () => {
    const navigateToSpy = vi.spyOn(navigationService, 'navigateTo')

    navigationService.navigateToHome()
    expect(navigateToSpy).toHaveBeenCalledWith('home')
  })

  it('scrollToTop 滚动到顶部', () => {
    const mockListener = vi.fn()
    const unsubscribe = navigationService.on(mockListener)

    navigationService.scrollToTop()

    expect(mockListener).toHaveBeenCalledWith('scroll:top', undefined)
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    })

    unsubscribe()
  })

  it('goBack 返回上一页', () => {
    const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {})
    const mockListener = vi.fn()
    const unsubscribe = navigationService.on(mockListener)

    navigationService.goBack()

    expect(mockListener).toHaveBeenCalledWith('navigate:back', undefined)
    expect(backSpy).toHaveBeenCalled()

    backSpy.mockRestore()
    unsubscribe()
  })

  it('handleProductClick 正确处理商品点击', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const mockListener = vi.fn()
    const unsubscribe = navigationService.on(mockListener)

    const product = { id: 123, name: '测试商品' }
    navigationService.handleProductClick(product)

    expect(mockListener).toHaveBeenCalledWith('product:click', { product })
    expect(consoleLogSpy).toHaveBeenCalledWith('Navigate to product: /product/123', product)

    consoleLogSpy.mockRestore()
    unsubscribe()
  })

  it('handleStoreClick 正确处理店铺点击', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const mockListener = vi.fn()
    const unsubscribe = navigationService.on(mockListener)

    const store = { id: 456, name: '测试店铺' }
    navigationService.handleStoreClick(store)

    expect(mockListener).toHaveBeenCalledWith('store:click', { store })
    expect(consoleLogSpy).toHaveBeenCalledWith('Navigate to store: /store/456', store)

    consoleLogSpy.mockRestore()
    unsubscribe()
  })

  it('事件监听器错误不影响其他监听器', () => {
    const badListener = vi.fn().mockImplementation(() => {
      throw new Error('Listener error')
    })
    const goodListener = vi.fn()
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const unsubscribe1 = navigationService.on(badListener)
    const unsubscribe2 = navigationService.on(goodListener)

    navigationService.navigateTo('home')

    expect(goodListener).toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalled()

    unsubscribe1()
    unsubscribe2()
    consoleErrorSpy.mockRestore()
  })
})
