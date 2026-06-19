import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3002

app.use(cors())
app.use(express.json())

const cities = [
  { id: 1, name: '北京', nameEn: 'Beijing', country: '中国', score: 95, lat: 39.9042, lng: 116.4074 },
  { id: 2, name: '上海', nameEn: 'Shanghai', country: '中国', score: 94, lat: 31.2304, lng: 121.4737 },
  { id: 3, name: '深圳', nameEn: 'Shenzhen', country: '中国', score: 92, lat: 22.5431, lng: 114.0579 },
  { id: 4, name: '杭州', nameEn: 'Hangzhou', country: '中国', score: 90, lat: 30.2741, lng: 120.1551 },
  { id: 5, name: '成都', nameEn: 'Chengdu', country: '中国', score: 88, lat: 30.5728, lng: 104.0668 }
]

const stores = [
  { id: 1, name: '北京朝阳旗舰店', nameEn: 'Beijing Chaoyang Flagship', cityId: 1, address: '北京市朝阳区建国路88号' },
  { id: 2, name: '北京海淀体验店', nameEn: 'Beijing Haidian Experience', cityId: 1, address: '北京市海淀区中关村大街1号' },
  { id: 3, name: '上海浦东旗舰店', nameEn: 'Shanghai Pudong Flagship', cityId: 2, address: '上海市浦东新区陆家嘴环路1000号' },
  { id: 4, name: '上海静安体验店', nameEn: 'Shanghai Jing\'an Experience', cityId: 2, address: '上海市静安区南京西路1266号' },
  { id: 5, name: '深圳南山旗舰店', nameEn: 'Shenzhen Nanshan Flagship', cityId: 3, address: '深圳市南山区科技园南路1号' },
  { id: 6, name: '杭州西湖体验店', nameEn: 'Hangzhou West Lake Experience', cityId: 4, address: '杭州市西湖区文三路100号' },
  { id: 7, name: '成都春熙路旗舰店', nameEn: 'Chengdu Chunxi Road Flagship', cityId: 5, address: '成都市锦江区春熙路8号' }
]

let hotProductIdCounter = 13
const hotProducts = [
  { id: 1, name: '智能清洁机器人Pro', nameEn: 'Smart Cleaning Robot Pro', price: 2999, originalPrice: 3999, imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20cleaning%20robot%20white%20modern%20design%20product%20photo%20on%20white%20background&image_size=square_hd', storeId: 1, cityId: 1, sort: 2, sales: 1280, tag: '热销' },
  { id: 2, name: '家用服务机器人S1', nameEn: 'Home Service Robot S1', price: 4999, originalPrice: 5999, imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=home%20service%20robot%20friendly%20design%20white%20modern%20product%20photo&image_size=square_hd', storeId: 1, cityId: 1, sort: 1, sales: 2150, tag: '爆款' },
  { id: 3, name: 'AI教育陪伴机器人', nameEn: 'AI Education Companion Robot', price: 1899, originalPrice: 2499, imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20AI%20education%20robot%20for%20kids%20colorful%20friendly%20product%20photo&image_size=square_hd', storeId: 2, cityId: 1, sort: 3, sales: 890, tag: '新品' },
  { id: 4, name: '商用配送机器人', nameEn: 'Commercial Delivery Robot', price: 19999, originalPrice: 24999, imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=commercial%20delivery%20robot%20restaurant%20hotel%20professional%20white%20product&image_size=square_hd', storeId: 3, cityId: 2, sort: 1, sales: 350, tag: '热销' },
  { id: 5, name: '智能迎宾机器人', nameEn: 'Smart Welcome Robot', price: 15999, originalPrice: 18999, imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20welcome%20greeting%20robot%20humanoid%20white%20modern%20lobby&image_size=square_hd', storeId: 3, cityId: 2, sort: 2, sales: 520, tag: '推荐' },
  { id: 6, name: '家庭安防机器人', nameEn: 'Home Security Robot', price: 3599, originalPrice: 4299, imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=home%20security%20patrol%20robot%20camera%20smart%20modern%20design%20product&image_size=square_hd', storeId: 4, cityId: 2, sort: 3, sales: 680, tag: '新品' },
  { id: 7, name: '儿童编程机器人套件', nameEn: 'Kids Coding Robot Kit', price: 1299, originalPrice: 1699, imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20kids%20coding%20robot%20kit%20educational%20toy%20STEM%20product%20photo&image_size=square_hd', storeId: 5, cityId: 3, sort: 1, sales: 1560, tag: '爆款' },
  { id: 8, name: '智能老人陪护机器人', nameEn: 'Elderly Care Robot', price: 6999, originalPrice: 8999, imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elderly%20care%20companion%20robot%20friendly%20warm%20design%20product%20photo&image_size=square_hd', storeId: 5, cityId: 3, sort: 2, sales: 420, tag: '推荐' },
  { id: 9, name: '桌面级机械臂', nameEn: 'Desktop Robotic Arm', price: 8999, originalPrice: 10999, imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=desktop%20robotic%20arm%20industrial%20design%20black%20precise%20product%20photo&image_size=square_hd', storeId: 6, cityId: 4, sort: 2, sales: 280, tag: '新品' },
  { id: 10, name: '宠物陪伴机器人', nameEn: 'Pet Companion Robot', price: 1599, originalPrice: 1999, imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20pet%20companion%20robot%20interactive%20toy%20white%20round%20product%20photo&image_size=square_hd', storeId: 6, cityId: 4, sort: 1, sales: 980, tag: '热销' },
  { id: 11, name: '餐厅送餐机器人', nameEn: 'Restaurant Food Delivery Robot', price: 25999, originalPrice: 29999, imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=restaurant%20food%20delivery%20robot%20trays%20professional%20white%20product%20photo&image_size=square_hd', storeId: 7, cityId: 5, sort: 1, sales: 180, tag: '爆款' },
  { id: 12, name: '户外巡检机器人', nameEn: 'Outdoor Patrol Robot', price: 49999, originalPrice: 59999, imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=outdoor%20security%20patrol%20robot%20industrial%20rugged%20design%20product&image_size=square_hd', storeId: 7, cityId: 5, sort: 2, sales: 95, tag: '推荐' }
]

let banners = [
  {
    id: 1,
    title: '全国品牌大促',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20retail%20sale%20banner%20with%20gradient%20purple%20and%20blue%20colors%20clean%20design&image_size=landscape_16_9',
    linkUrl: 'https://example.com/promotion',
    type: 'global',
    cityId: null,
    storeName: null,
    status: 'approved',
    sort: 1,
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z'
  },
  {
    id: 2,
    title: '新品上市',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=new%20product%20launch%20banner%20tech%20style%20with%20purple%20gradient%20modern%20aesthetic&image_size=landscape_16_9',
    linkUrl: 'https://example.com/new-products',
    type: 'global',
    cityId: null,
    storeName: null,
    status: 'approved',
    sort: 2,
    createdAt: '2026-06-02T10:00:00Z',
    updatedAt: '2026-06-02T10:00:00Z'
  },
  {
    id: 3,
    title: '北京门店周年庆',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anniversary%20celebration%20banner%20festive%20golden%20and%20purple%20theme%20elegant&image_size=landscape_16_9',
    linkUrl: 'https://example.com/beijing-anniversary',
    type: 'city',
    cityId: 1,
    storeName: '北京朝阳旗舰店',
    status: 'approved',
    sort: 3,
    createdAt: '2026-06-10T10:00:00Z',
    updatedAt: '2026-06-10T10:00:00Z'
  },
  {
    id: 4,
    title: '上海浦东店开业特惠',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=grand%20opening%20special%20offer%20banner%20shanghai%20skyline%20inspired%20purple%20theme&image_size=landscape_16_9',
    linkUrl: 'https://example.com/shanghai-opening',
    type: 'city',
    cityId: 2,
    storeName: '上海浦东新店',
    status: 'pending',
    sort: 4,
    createdAt: '2026-06-15T10:00:00Z',
    updatedAt: '2026-06-15T10:00:00Z'
  }
]

let bannerIdCounter = 5

app.get('/api/cities', (req, res) => {
  res.json({ success: true, data: cities })
})

app.get('/api/city/detect', (req, res) => {
  const { lat, lng } = req.query
  if (!lat || !lng) {
    return res.json({ success: true, data: cities.find(c => c.id === 1) })
  }
  const userLat = parseFloat(lat)
  const userLng = parseFloat(lng)
  let nearest = cities[0]
  let minDist = Infinity
  for (const city of cities) {
    const d = Math.sqrt(Math.pow(city.lat - userLat, 2) + Math.pow(city.lng - userLng, 2))
    if (d < minDist) {
      minDist = d
      nearest = city
    }
  }
  res.json({ success: true, data: nearest })
})

app.get('/api/banners', (req, res) => {
  const { cityId } = req.query
  let result = banners.filter(b => b.status === 'approved')
  
  if (cityId) {
    const cid = parseInt(cityId)
    result = result.filter(b => b.type === 'global' || (b.type === 'city' && b.cityId === cid))
  } else {
    result = result.filter(b => b.type === 'global')
  }
  
  result.sort((a, b) => a.sort - b.sort)
  res.json({ success: true, data: result })
})

app.get('/api/banners/admin', (req, res) => {
  const { status, type } = req.query
  let result = [...banners]
  
  if (status) {
    result = result.filter(b => b.status === status)
  }
  if (type) {
    result = result.filter(b => b.type === type)
  }
  
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json({ success: true, data: result })
})

app.post('/api/banners', (req, res) => {
  const { title, imageUrl, linkUrl, sort } = req.body
  
  if (!title || !imageUrl) {
    return res.status(400).json({ success: false, message: '标题和图片不能为空' })
  }
  
  const newBanner = {
    id: bannerIdCounter++,
    title,
    imageUrl,
    linkUrl: linkUrl || '',
    type: 'global',
    cityId: null,
    storeName: null,
    status: 'approved',
    sort: sort || 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  banners.push(newBanner)
  res.json({ success: true, data: newBanner })
})

app.put('/api/banners/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const { title, imageUrl, linkUrl, sort, status } = req.body
  
  const banner = banners.find(b => b.id === id)
  if (!banner) {
    return res.status(404).json({ success: false, message: 'Banner不存在' })
  }
  
  if (title !== undefined) banner.title = title
  if (imageUrl !== undefined) banner.imageUrl = imageUrl
  if (linkUrl !== undefined) banner.linkUrl = linkUrl
  if (sort !== undefined) banner.sort = sort
  if (status !== undefined) banner.status = status
  banner.updatedAt = new Date().toISOString()
  
  res.json({ success: true, data: banner })
})

app.delete('/api/banners/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = banners.findIndex(b => b.id === id)
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Banner不存在' })
  }
  
  const deleted = banners.splice(index, 1)[0]
  res.json({ success: true, data: deleted })
})

app.post('/api/banners/apply', (req, res) => {
  const { title, imageUrl, linkUrl, cityId, storeName } = req.body
  
  if (!title || !imageUrl || !cityId || !storeName) {
    return res.status(400).json({ success: false, message: '标题、图片、城市和门店名称不能为空' })
  }
  
  const city = cities.find(c => c.id === parseInt(cityId))
  if (!city) {
    return res.status(400).json({ success: false, message: '城市不存在' })
  }
  
  const newBanner = {
    id: bannerIdCounter++,
    title,
    imageUrl,
    linkUrl: linkUrl || '',
    type: 'city',
    cityId: parseInt(cityId),
    storeName,
    status: 'pending',
    sort: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  banners.push(newBanner)
  res.json({ success: true, data: newBanner })
})

app.put('/api/banners/:id/approve', (req, res) => {
  const id = parseInt(req.params.id)
  const banner = banners.find(b => b.id === id)
  
  if (!banner) {
    return res.status(404).json({ success: false, message: 'Banner不存在' })
  }
  
  banner.status = 'approved'
  banner.updatedAt = new Date().toISOString()
  res.json({ success: true, data: banner })
})

app.put('/api/banners/:id/reject', (req, res) => {
  const id = parseInt(req.params.id)
  const banner = banners.find(b => b.id === id)
  
  if (!banner) {
    return res.status(404).json({ success: false, message: 'Banner不存在' })
  }
  
  banner.status = 'rejected'
  banner.updatedAt = new Date().toISOString()
  res.json({ success: true, data: banner })
})

app.get('/api/hot-products', (req, res) => {
  const { cityId, limit, sortBy = 'sort', sortOrder = 'asc' } = req.query
  let result = [...hotProducts]

  if (cityId) {
    const cid = parseInt(cityId)
    result = result.filter(p => p.cityId === cid)
  }

  result.sort((a, b) => {
    let comparison = 0
    if (sortBy === 'sort') {
      comparison = a.sort - b.sort
      if (comparison === 0) {
        comparison = b.sales - a.sales
      }
    } else if (sortBy === 'sales') {
      comparison = b.sales - a.sales
    } else if (sortBy === 'price') {
      comparison = a.price - b.price
    } else if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name, 'zh-CN')
    } else {
      comparison = a.sort - b.sort
    }
    return sortOrder === 'desc' ? -comparison : comparison
  })

  if (limit) {
    result = result.slice(0, parseInt(limit))
  }

  const data = result.map(p => {
    const store = stores.find(s => s.id === p.storeId)
    return {
      ...p,
      storeName: store ? store.name : '',
      storeNameEn: store ? store.nameEn : ''
    }
  })

  res.json({ success: true, data })
})

app.get('/api/hot-products/admin', (req, res) => {
  const { cityId, storeId } = req.query
  let result = [...hotProducts]

  if (cityId) {
    const cid = parseInt(cityId)
    result = result.filter(p => p.cityId === cid)
  }

  if (storeId) {
    const sid = parseInt(storeId)
    result = result.filter(p => p.storeId === sid)
  }

  result.sort((a, b) => {
    if (a.sort !== b.sort) {
      return a.sort - b.sort
    }
    return b.sales - a.sales
  })

  const data = result.map(p => {
    const store = stores.find(s => s.id === p.storeId)
    const city = cities.find(c => c.id === p.cityId)
    return {
      ...p,
      storeName: store ? store.name : '',
      storeNameEn: store ? store.nameEn : '',
      cityName: city ? city.name : '',
      cityNameEn: city ? city.nameEn : ''
    }
  })

  res.json({ success: true, data })
})

app.post('/api/hot-products', (req, res) => {
  const { name, nameEn, price, originalPrice, imageUrl, storeId, cityId, sort, tag, sales } = req.body

  if (!name || !price || !imageUrl || !storeId || !cityId) {
    return res.status(400).json({ success: false, message: '商品名称、价格、图片、门店和城市不能为空' })
  }

  const store = stores.find(s => s.id === parseInt(storeId))
  if (!store) {
    return res.status(400).json({ success: false, message: '门店不存在' })
  }

  const newProduct = {
    id: hotProductIdCounter++,
    name,
    nameEn: nameEn || '',
    price: parseFloat(price),
    originalPrice: originalPrice ? parseFloat(originalPrice) : null,
    imageUrl,
    storeId: parseInt(storeId),
    cityId: parseInt(cityId),
    sort: sort !== undefined ? parseInt(sort) : 100,
    sales: sales ? parseInt(sales) : 0,
    tag: tag || '',
    createdAt: new Date().toISOString()
  }

  hotProducts.push(newProduct)

  const data = {
    ...newProduct,
    storeName: store.name,
    storeNameEn: store.nameEn,
    cityName: cities.find(c => c.id === newProduct.cityId)?.name || '',
    cityNameEn: cities.find(c => c.id === newProduct.cityId)?.nameEn || ''
  }

  res.json({ success: true, data })
})

app.put('/api/hot-products/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const { name, nameEn, price, originalPrice, imageUrl, storeId, cityId, sort, tag } = req.body

  const product = hotProducts.find(p => p.id === id)
  if (!product) {
    return res.status(404).json({ success: false, message: '商品不存在' })
  }

  if (name !== undefined) product.name = name
  if (nameEn !== undefined) product.nameEn = nameEn
  if (price !== undefined) product.price = parseFloat(price)
  if (originalPrice !== undefined) product.originalPrice = originalPrice ? parseFloat(originalPrice) : null
  if (imageUrl !== undefined) product.imageUrl = imageUrl
  if (storeId !== undefined) product.storeId = parseInt(storeId)
  if (cityId !== undefined) product.cityId = parseInt(cityId)
  if (sort !== undefined) product.sort = parseInt(sort)
  if (tag !== undefined) product.tag = tag

  const store = stores.find(s => s.id === product.storeId)
  const city = cities.find(c => c.id === product.cityId)
  const data = {
    ...product,
    storeName: store ? store.name : '',
    storeNameEn: store ? store.nameEn : '',
    cityName: city ? city.name : '',
    cityNameEn: city ? city.nameEn : ''
  }

  res.json({ success: true, data })
})

app.delete('/api/hot-products/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = hotProducts.findIndex(p => p.id === id)

  if (index === -1) {
    return res.status(404).json({ success: false, message: '商品不存在' })
  }

  const deleted = hotProducts.splice(index, 1)[0]
  res.json({ success: true, data: deleted })
})

app.put('/api/hot-products/sort/batch', (req, res) => {
  const { items } = req.body

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ success: false, message: '参数格式错误' })
  }

  const updated = []
  for (const item of items) {
    const product = hotProducts.find(p => p.id === item.id)
    if (product) {
      product.sort = parseInt(item.sort)
      updated.push(product)
    }
  }

  res.json({ success: true, data: updated, count: updated.length })
})

app.get('/api/stores', (req, res) => {
  const { cityId } = req.query
  let result = [...stores]

  if (cityId) {
    const cid = parseInt(cityId)
    result = result.filter(s => s.cityId === cid)
  }

  res.json({ success: true, data: result })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
