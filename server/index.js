import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3002

app.use(cors())
app.use(express.json())

const cities = [
  { id: 1, name: '北京', nameEn: 'Beijing', country: '中国', score: 95 },
  { id: 2, name: '上海', nameEn: 'Shanghai', country: '中国', score: 94 },
  { id: 3, name: '深圳', nameEn: 'Shenzhen', country: '中国', score: 92 },
  { id: 4, name: '杭州', nameEn: 'Hangzhou', country: '中国', score: 90 },
  { id: 5, name: '成都', nameEn: 'Chengdu', country: '中国', score: 88 }
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
