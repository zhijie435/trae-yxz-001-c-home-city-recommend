export default {
  header: {
    slogan: '机器人服务于人',
    language: '语言'
  },
  nav: {
    home: '首页',
    bannerAdmin: 'Banner管理',
    bannerApply: 'Banner申请',
    hotAdmin: '商品排序',
    productSort: '商品排序'
  },
  home: {
    title: '发现您的理想城市',
    description: '基于智能算法，为您推荐最适合居住、工作和旅行的城市'
  },
  banner: {
    title: '精彩活动',
    global: '全国活动',
    city: '城市专属',
    store: '门店',
    empty: '暂无Banner'
  },
  bannerAdmin: {
    title: 'Banner管理',
    subtitle: '总部配置全国Banner，审核门店申请',
    addGlobal: '新增全国Banner',
    filterAll: '全部',
    filterApproved: '已通过',
    filterPending: '待审核',
    filterRejected: '已拒绝',
    filterGlobal: '全国Banner',
    filterCity: '城市Banner',
    columns: {
      title: '标题',
      type: '类型',
      city: '城市',
      store: '门店',
      status: '状态',
      link: '跳转链接',
      sort: '排序',
      createdAt: '创建时间',
      actions: '操作'
    },
    statusMap: {
      approved: '已通过',
      pending: '待审核',
      rejected: '已拒绝'
    },
    typeMap: {
      global: '全国',
      city: '城市'
    },
    actions: {
      edit: '编辑',
      delete: '删除',
      approve: '通过',
      reject: '拒绝'
    },
    form: {
      title: '标题',
      imageUrl: '图片URL',
      linkUrl: '跳转链接',
      sort: '排序权重',
      placeholder: {
        title: '请输入Banner标题',
        imageUrl: '请输入图片URL',
        linkUrl: '请输入跳转链接（选填）',
        sort: '数字越小越靠前，默认100'
      },
      create: '创建Banner',
      update: '更新Banner',
      cancel: '取消',
      confirm: '确认'
    },
    deleteConfirm: '确定要删除这个Banner吗？'
  },
  bannerApply: {
    title: '申请城市Banner',
    subtitle: '门店可以申请所在城市的专属Banner',
    form: {
      title: 'Banner标题',
      imageUrl: '图片URL',
      linkUrl: '跳转链接',
      cityId: '所属城市',
      storeName: '门店名称',
      placeholder: {
        title: '请输入Banner标题',
        imageUrl: '请输入图片URL',
        linkUrl: '请输入跳转链接（选填）',
        cityId: '请选择城市',
        storeName: '请输入门店名称'
      },
      submit: '提交申请',
      success: '申请已提交，等待总部审核'
    },
    myApplications: '我的申请记录',
    statusMap: {
      approved: '已通过',
      pending: '审核中',
      rejected: '已拒绝'
    }
  },
  languages: {
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'en-US': 'English'
  },
  rental: {
    selectCity: '选择城市',
    selectDate: '选择租赁时间',
    selectDateHint: '请选择起止日期',
    days: '天',
    reset: '重置',
    confirm: '确认'
  },
  coreEntry: {
    title: '核心推荐',
    subtitle: '精选服务入口',
    scene: {
      title: '场景选择',
      desc: '按使用场景精准匹配'
    },
    vendor: {
      title: '厂商推荐',
      desc: '优质品牌厂商入驻'
    },
    ai: {
      title: 'AI科普',
      desc: '智能知识轻松了解'
    },
    hot: {
      title: '周边热销',
      desc: '热门配件周边推荐'
    }
  },
  hotRecommend: {
    title: '热门推荐',
    subtitleCity: '门店商品精选',
    subtitleAll: '全国门店精选商品',
    empty: '暂无热门推荐商品',
    sold: '人已购买',
    tagHot: '热销',
    tagBest: '爆款',
    tagNew: '新品',
    tagRecommend: '推荐',
    sortDefault: '默认排序',
    sortSales: '销量优先',
    sortPrice: '价格优先',
    sortName: '名称排序'
  },
  productSort: {
    title: '商品排序管理',
    subtitle: '门店可自定义热门推荐商品的展示顺序',
    filterCity: '选择城市',
    filterStore: '选择门店',
    allCities: '全部城市',
    allStores: '全部门店',
    columns: {
      sort: '排序',
      image: '商品图',
      name: '商品名称',
      city: '城市',
      store: '门店',
      price: '价格',
      sales: '销量',
      tag: '标签',
      actions: '操作'
    },
    actions: {
      moveUp: '上移',
      moveDown: '下移',
      moveTop: '置顶',
      moveBottom: '置底',
      edit: '编辑排序'
    },
    tips: '提示：数字越小排名越靠前，可通过拖拽或输入数字调整排序',
    save: '保存排序',
    saved: '排序已保存',
    empty: '暂无商品数据',
    sortDialog: {
      title: '调整排序序号',
      currentSort: '当前排序',
      newSort: '新排序号',
      placeholder: '请输入排序号',
      cancel: '取消',
      confirm: '确认'
    }
  }
}
