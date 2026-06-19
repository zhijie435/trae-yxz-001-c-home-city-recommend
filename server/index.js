import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.get('/api/cities', (req, res) => {
  const cities = [
    { id: 1, name: '北京', nameEn: 'Beijing', country: '中国', score: 95 },
    { id: 2, name: '上海', nameEn: 'Shanghai', country: '中国', score: 94 },
    { id: 3, name: '深圳', nameEn: 'Shenzhen', country: '中国', score: 92 },
    { id: 4, name: '杭州', nameEn: 'Hangzhou', country: '中国', score: 90 },
    { id: 5, name: '成都', nameEn: 'Chengdu', country: '中国', score: 88 }
  ]
  res.json({ success: true, data: cities })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
