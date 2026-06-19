export default {
  header: {
    slogan: '機器人服務於人',
    language: '語言'
  },
  nav: {
    home: '首頁',
    bannerAdmin: 'Banner管理',
    bannerApply: 'Banner申請'
  },
  home: {
    title: '發現您的理想城市',
    description: '基於智能算法，為您推薦最適合居住、工作和旅行的城市'
  },
  banner: {
    title: '精彩活動',
    global: '全國活動',
    city: '城市專屬',
    store: '門店',
    empty: '暫無Banner'
  },
  bannerAdmin: {
    title: 'Banner管理',
    subtitle: '總部配置全國Banner，審核門店申請',
    addGlobal: '新增全國Banner',
    filterAll: '全部',
    filterApproved: '已通過',
    filterPending: '待審核',
    filterRejected: '已拒絕',
    filterGlobal: '全國Banner',
    filterCity: '城市Banner',
    columns: {
      title: '標題',
      type: '類型',
      city: '城市',
      store: '門店',
      status: '狀態',
      link: '跳轉鏈接',
      sort: '排序',
      createdAt: '創建時間',
      actions: '操作'
    },
    statusMap: {
      approved: '已通過',
      pending: '待審核',
      rejected: '已拒絕'
    },
    typeMap: {
      global: '全國',
      city: '城市'
    },
    actions: {
      edit: '編輯',
      delete: '刪除',
      approve: '通過',
      reject: '拒絕'
    },
    form: {
      title: '標題',
      imageUrl: '圖片URL',
      linkUrl: '跳轉鏈接',
      sort: '排序權重',
      placeholder: {
        title: '請輸入Banner標題',
        imageUrl: '請輸入圖片URL',
        linkUrl: '請輸入跳轉鏈接（選填）',
        sort: '數字越小越靠前，默認100'
      },
      create: '創建Banner',
      update: '更新Banner',
      cancel: '取消',
      confirm: '確認'
    },
    deleteConfirm: '確定要刪除這個Banner嗎？'
  },
  bannerApply: {
    title: '申請城市Banner',
    subtitle: '門店可以申請所在城市的專屬Banner',
    form: {
      title: 'Banner標題',
      imageUrl: '圖片URL',
      linkUrl: '跳轉鏈接',
      cityId: '所屬城市',
      storeName: '門店名稱',
      placeholder: {
        title: '請輸入Banner標題',
        imageUrl: '請輸入圖片URL',
        linkUrl: '請輸入跳轉鏈接（選填）',
        cityId: '請選擇城市',
        storeName: '請輸入門店名稱'
      },
      submit: '提交申請',
      success: '申請已提交，等待總部審核'
    },
    myApplications: '我的申請記錄',
    statusMap: {
      approved: '已通過',
      pending: '審核中',
      rejected: '已拒絕'
    }
  },
  languages: {
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'en-US': 'English'
  },
  rental: {
    selectCity: '選擇城市',
    selectDate: '選擇租賃時間',
    selectDateHint: '請選擇起止日期',
    days: '天',
    reset: '重置',
    confirm: '確認'
  }
}
