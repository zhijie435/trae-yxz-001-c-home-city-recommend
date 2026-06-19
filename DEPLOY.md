# C端首页城市推荐 - 部署文档

## 目录

- [1. 环境变量配置](#1-环境变量配置)
- [2. H5 静态服务器部署（Nginx）](#2-h5-静态服务器部署nginx)
- [3. 小程序部署与提交](#3-小程序部署与提交)

---

## 1. 环境变量配置

### 1.1 环境说明

项目支持三套环境，对应不同的接口地址和配置：

| 环境 | 配置文件 | 命令模式 | 说明 |
|------|---------|---------|------|
| 开发环境 | `.env.development` | `development` | 本地开发，使用 Mock 或本地代理 |
| 测试环境 | `.env.test` | `test` | 测试服务器，对接测试接口 |
| 生产环境 | `.env.production` | `production` | 正式上线，对接生产接口 |

### 1.2 环境变量清单

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `VITE_APP_ENV` | 当前环境标识 | `development` / `test` / `production` |
| `VITE_API_BASE_URL` | API 接口基础路径 | `https://api.example.com/api` |
| `VITE_APP_TITLE` | 应用标题 | `城市推荐` |
| `VITE_ENABLE_MOCK` | 是否启用 Mock | `true` / `false` |

### 1.3 使用方式

#### 开发模式

```bash
# 开发环境（默认）
npm run dev

# 测试环境
npm run dev:test

# 生产环境
npm run dev:prod
```

#### 构建打包

```bash
# 测试环境构建
npm run build:test

# 生产环境构建（默认）
npm run build
# 或
npm run build:prod
```

### 1.4 代码中使用环境变量

在 Vue 组件或 JS 文件中通过 `import.meta.env` 访问：

```javascript
// 获取 API 基础地址
const baseUrl = import.meta.env.VITE_API_BASE_URL

// 获取当前环境
const env = import.meta.env.VITE_APP_ENV

// 判断是否为生产环境
const isProd = import.meta.env.VITE_APP_ENV === 'production'
```

---

## 2. H5 静态服务器部署（Nginx）

### 2.1 构建产物

执行构建命令后，产物将输出到 `dist` 目录：

```bash
# 生产环境构建
npm run build

# 构建产物目录
dist/
├── index.html
├── assets/
│   ├── index.abc123.js
│   ├── index.def456.css
│   └── ...
└── vite.svg
```

### 2.2 服务器要求

- Nginx 1.18+
- 服务器已配置域名解析
- HTTPS 证书（生产环境建议）

### 2.3 Nginx 配置示例

#### 基础配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 重定向到 HTTPS（生产环境建议）
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL 证书配置
    ssl_certificate /path/to/your/cert.pem;
    ssl_certificate_key /path/to/your/key.pem;

    # 项目根目录
    root /var/www/city-recommendation/dist;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/json
        application/xml
        application/xml+rss
        image/svg+xml;

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 主页面 - 支持 SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理（如需要）
    location /api/ {
        proxy_pass https://api.example.com/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 安全相关 Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### 多环境部署（测试/生产）

在同一台服务器上部署多套环境，使用不同的端口或域名：

```nginx
# 测试环境
server {
    listen 80;
    server_name test.your-domain.com;

    root /var/www/city-recommendation/test/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass https://test-api.example.com/api/;
    }
}

# 生产环境
server {
    listen 80;
    server_name www.your-domain.com;

    root /var/www/city-recommendation/prod/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass https://api.example.com/api/;
    }
}
```

### 2.4 部署步骤

#### 方式一：手动部署

1. **本地构建**

```bash
# 安装依赖（首次）
npm install

# 构建生产版本
npm run build
```

2. **上传文件到服务器**

```bash
# 使用 scp 上传
scp -r dist/* user@your-server:/var/www/city-recommendation/

# 或使用 rsync 增量同步
rsync -avz --delete dist/ user@your-server:/var/www/city-recommendation/
```

3. **重启 Nginx**

```bash
# 测试配置
nginx -t

# 重载配置
nginx -s reload
```

#### 方式二：CI/CD 自动部署（推荐）

以下是 GitHub Actions 示例：

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_APP_ENV: production
          VITE_API_BASE_URL: https://api.example.com/api
          VITE_APP_TITLE: 城市推荐
          VITE_ENABLE_MOCK: false

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/city-recommendation
            # 备份当前版本
            cp -r dist dist.backup-$(date +%Y%m%d%H%M%S)
            # 清理旧文件
            rm -rf dist/*

      - name: Upload files
        uses: appleboy/scp-action@v0.1.4
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          source: "dist/*"
          target: "/var/www/city-recommendation/dist"
          strip_components: 1

      - name: Reload Nginx
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: nginx -s reload
```

### 2.5 验证部署

部署完成后，验证以下内容：

1. **页面正常访问**：访问 `https://your-domain.com`，页面正常加载
2. **静态资源加载**：检查浏览器控制台，无 404 错误
3. **API 接口正常**：验证接口请求返回正确数据
4. **路由刷新正常**：刷新页面不会出现 404
5. **HTTPS 证书有效**：浏览器地址栏显示安全锁标识

---

## 3. 小程序部署与提交

### 3.1 技术栈说明

小程序基于 **uni-app** 框架开发，一套代码可发布到多个平台（微信小程序、支付宝小程序、H5 等）。

### 3.2 环境准备

#### 开发工具

- **HBuilderX**：uni-app 官方 IDE（推荐）
- **微信开发者工具**：用于预览和发布微信小程序
- **Node.js 16+**：用于项目构建

#### 安装 HBuilderX

1. 访问 [HBuilderX 官网](https://www.dcloud.io/hbuilderx.html) 下载
2. 安装后启动，选择「uni-app」开发视角

### 3.3 项目结构

```
.
├── src/                    # 源码目录
│   ├── pages/              # 页面
│   ├── components/         # 组件
│   ├── services/           # API 服务
│   ├── store/              # 状态管理
│   ├── styles/             # 全局样式
│   ├── locales/            # 国际化
│   ├── App.vue             # 应用入口
│   └── main.js             # 主入口
├── static/                 # 静态资源（小程序专用）
├── public/                 # 公共资源（H5 专用）
├── manifest.json           # uni-app 配置
├── pages.json              # 页面路由配置
├── uni.scss                # uni-app 全局样式变量
├── .env.development        # 开发环境变量
├── .env.test               # 测试环境变量
├── .env.production         # 生产环境变量
└── package.json
```

### 3.4 环境变量配置

uni-app 环境变量配置与 H5 保持一致，通过 `.env.*` 文件管理。

#### 小程序特有配置

在 `manifest.json` 中配置各小程序平台信息：

```json
{
  "name": "城市推荐",
  "appid": "__UNI__XXXXXXX",
  "description": "C端首页城市推荐",
  "versionName": "1.0.0",
  "versionCode": "100",
  "transformPx": false,
  "app-plus": {
    "usingComponents": true,
    "nvueStyleCompiler": "uni-app",
    "compilerVersion": 3
  },
  "mp-weixin": {
    "appid": "wxXXXXXXXXXXXXXX",
    "setting": {
      "urlCheck": false,
      "es6": true,
      "enhance": true,
      "postcss": true,
      "preloadBackgroundData": false,
      "minified": true,
      "newFeature": false,
      "coverView": true,
      "nodeModules": false,
      "autoAudits": false,
      "showShadowRootInWxmlPanel": true,
      "scopeDataCheck": false,
      "uglifyFileName": false,
      "checkInvalidKey": true,
      "checkSiteMap": true,
      "uploadWithSourceMap": true,
      "compileHotReLoad": false,
      "useMultiFrameRuntime": true,
      "useApiHook": true,
      "useApiHostProcess": true,
      "babelSetting": {
        "ignore": [],
        "disablePlugins": [],
        "outputPath": ""
      },
      "enableEngineNative": false,
      "useIsolateContext": true,
      "userConfirmedBundleSwitch": false,
      "packNpmManually": false,
      "packNpmRelationList": [],
      "minifyWXSS": true,
      "disableUseStrict": false,
      "minifyWXML": true,
      "showES6CompileOption": false,
      "useCompilerPlugins": false
    },
    "usingComponents": true,
    "permission": {
      "scope.userLocation": {
        "desc": "获取当前位置用于推荐附近城市"
      }
    },
    "requiredPrivateInfos": [
      "getLocation"
    ],
    "lazyCodeLoading": "requiredComponents"
  },
  "mp-alipay": {
    "appid": "XXXXXXXXXXXXXXX",
    "usingComponents": true
  },
  "h5": {
    "title": "城市推荐",
    "router": {
      "mode": "hash"
    }
  },
  "vueVersion": "3"
}
```

### 3.5 小程序开发与调试

#### 使用 HBuilderX 运行

1. 打开 HBuilderX，导入项目
2. 点击菜单「运行」→「运行到小程序模拟器」→「微信开发者工具」
3. 首次运行需要配置微信开发者工具路径
4. 微信开发者工具自动打开并预览

#### 命令行方式

```bash
# 安装依赖
npm install

# 微信小程序 - 开发模式
npm run dev:mp-weixin

# 微信小程序 - 生产构建
npm run build:mp-weixin

# 支付宝小程序 - 开发模式
npm run dev:mp-alipay

# 支付宝小程序 - 生产构建
npm run build:mp-alipay
```

构建产物位于 `dist/dev/mp-weixin/` 或 `dist/build/mp-weixin/`。

### 3.6 微信小程序提交审核

#### 前置准备

1. **注册小程序账号**
   - 访问 [微信公众平台](https://mp.weixin.qq.com) 注册
   - 完成主体认证（企业/个人）

2. **获取 AppID**
   - 登录微信公众平台 → 开发 → 开发管理 → 开发设置
   - 复制 AppID，填入 `manifest.json` 的 `mp-weixin.appid`

3. **配置服务器域名**
   - 登录微信公众平台 → 开发 → 开发管理 → 开发设置 → 服务器域名
   - 配置以下域名：
     - `request合法域名`：API 接口域名（如 `https://api.example.com`）
     - `uploadFile合法域名`：文件上传域名
     - `downloadFile合法域名`：文件下载域名
     - `socket合法域名`：WebSocket 域名（如需要）

   > 注意：域名必须使用 HTTPS，不支持 IP 地址和 localhost

#### 提交审核步骤

**步骤 1：上传代码**

1. 在 HBuilderX 中点击「发行」→「小程序-微信」
2. 填写版本号和项目备注
3. 点击「上传」，等待上传完成

或使用命令行：

```bash
# 构建生产版本
npm run build:mp-weixin

# 使用微信开发者工具打开构建产物
# 路径：dist/build/mp-weixin
```

**步骤 2：在微信开发者工具中提交**

1. 打开微信开发者工具，导入项目
2. 点击右上角「上传」按钮
3. 填写版本号和项目备注
4. 确认上传

**步骤 3：提交审核**

1. 登录 [微信公众平台](https://mp.weixin.qq.com)
2. 进入「管理」→「版本管理」
3. 在「开发版本」中找到刚上传的版本
4. 点击「提交审核」
5. 填写审核信息：
   - **功能页面**：选择主要页面及功能描述
   - **测试账号**：如需要登录，提供测试账号
   - **备注说明**：版本更新内容

**步骤 4：等待审核**

- 审核通常需要 1-7 个工作日
- 审核结果会通过微信公众号通知
- 可在「版本管理」中查看审核状态

**步骤 5：发布上线**

1. 审核通过后，在「版本管理」中找到审核通过的版本
2. 点击「发布」
3. 确认发布，小程序正式上线

### 3.7 小程序发布规范

#### 命名规范

- 小程序名称：4-30 个字符，中文、英文、数字
- 版本号：三段式，如 `1.0.0`（主版本.次版本.修订版本）

#### 内容规范

- 不得涉及政治、色情、暴力等违规内容
- 功能需与小程序类目一致
- 用户隐私政策需清晰透明

#### 性能规范

- 首屏加载时间不超过 2 秒
- 包体大小不超过 2MB（主包）
- 图片资源建议压缩后使用

### 3.8 多环境发布策略

| 环境 | 小程序版本 | 接口环境 | 说明 |
|------|-----------|---------|------|
| 开发版 | 开发版 | 开发接口 | 开发者工具调试 |
| 体验版 | 体验版 | 测试接口 | 测试人员测试 |
| 正式版 | 正式版 | 生产接口 | 线上用户使用 |

#### 体验版配置

1. 上传代码后，在「版本管理」中设置为「体验版」
2. 在「成员管理」中添加体验者
3. 体验者扫码即可使用体验版

### 3.9 版本回滚

如需回滚到历史版本：

1. 登录微信公众平台
2. 进入「管理」→「版本管理」→「历史版本」
3. 选择要回滚的版本
4. 点击「回退」
5. 确认后，线上版本将回退到指定版本

---

## 附录

### A. 常见问题

**Q: H5 部署后刷新页面 404？**
A: Nginx 需配置 `try_files $uri $uri/ /index.html;` 支持 SPA 路由。

**Q: 小程序请求接口报错？**
A: 检查是否已在微信公众平台配置服务器域名，且域名支持 HTTPS。

**Q: 环境变量不生效？**
A: Vite 环境变量必须以 `VITE_` 开头，且修改后需要重启开发服务器。

### B. 相关链接

- [Vite 环境变量文档](https://cn.vitejs.dev/guide/env-and-mode.html)
- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [Nginx 官方文档](https://nginx.org/en/docs/)
