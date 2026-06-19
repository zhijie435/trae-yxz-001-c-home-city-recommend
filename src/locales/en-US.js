export default {
  header: {
    slogan: 'Robots Serve Humanity',
    language: 'Language'
  },
  nav: {
    home: 'Home',
    bannerAdmin: 'Banner Admin',
    bannerApply: 'Apply Banner',
    productSort: 'Sort Products'
  },
  home: {
    title: 'Discover Your Ideal City',
    description: 'Intelligent algorithm-based recommendations for the best cities to live, work and travel'
  },
  banner: {
    title: 'Featured Events',
    global: 'National',
    city: 'City Exclusive',
    store: 'Store',
    empty: 'No banners available'
  },
  bannerAdmin: {
    title: 'Banner Management',
    subtitle: 'HQ configures national banners and reviews store applications',
    addGlobal: 'Add National Banner',
    filterAll: 'All',
    filterApproved: 'Approved',
    filterPending: 'Pending',
    filterRejected: 'Rejected',
    filterGlobal: 'National Banners',
    filterCity: 'City Banners',
    columns: {
      title: 'Title',
      type: 'Type',
      city: 'City',
      store: 'Store',
      status: 'Status',
      link: 'Link',
      sort: 'Sort',
      createdAt: 'Created At',
      actions: 'Actions'
    },
    statusMap: {
      approved: 'Approved',
      pending: 'Pending',
      rejected: 'Rejected'
    },
    typeMap: {
      global: 'National',
      city: 'City'
    },
    actions: {
      edit: 'Edit',
      delete: 'Delete',
      approve: 'Approve',
      reject: 'Reject'
    },
    form: {
      title: 'Title',
      imageUrl: 'Image URL',
      linkUrl: 'Redirect Link',
      sort: 'Sort Order',
      placeholder: {
        title: 'Enter banner title',
        imageUrl: 'Enter image URL',
        linkUrl: 'Enter redirect link (optional)',
        sort: 'Lower number appears first, default 100'
      },
      create: 'Create Banner',
      update: 'Update Banner',
      cancel: 'Cancel',
      confirm: 'Confirm'
    },
    deleteConfirm: 'Are you sure you want to delete this banner?'
  },
  bannerApply: {
    title: 'Apply for City Banner',
    subtitle: 'Stores can apply for exclusive banners for their city',
    form: {
      title: 'Banner Title',
      imageUrl: 'Image URL',
      linkUrl: 'Redirect Link',
      cityId: 'City',
      storeName: 'Store Name',
      placeholder: {
        title: 'Enter banner title',
        imageUrl: 'Enter image URL',
        linkUrl: 'Enter redirect link (optional)',
        cityId: 'Select a city',
        storeName: 'Enter store name'
      },
      submit: 'Submit Application',
      success: 'Application submitted, awaiting HQ review'
    },
    myApplications: 'My Applications',
    statusMap: {
      approved: 'Approved',
      pending: 'Under Review',
      rejected: 'Rejected'
    }
  },
  languages: {
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'en-US': 'English'
  },
  rental: {
    selectCity: 'Select City',
    selectDate: 'Select Rental Period',
    selectDateHint: 'Please select start and end dates',
    days: ' days',
    reset: 'Reset',
    confirm: 'Confirm'
  },
  coreEntry: {
    title: 'Core Entries',
    subtitle: 'Featured service portals',
    scene: {
      title: 'Scene Select',
      desc: 'Match by usage scenario'
    },
    vendor: {
      title: 'Top Vendors',
      desc: 'Quality brand manufacturers'
    },
    ai: {
      title: 'AI Academy',
      desc: 'Learn smart tech easily'
    },
    hot: {
      title: 'Hot Deals',
      desc: 'Trending accessories nearby'
    }
  },
  hotRecommend: {
    title: 'Hot Recommendations',
    subtitleCity: ' Featured Products',
    subtitleAll: 'Featured Products Nationwide',
    empty: 'No hot recommended products',
    sold: ' sold',
    tagHot: 'Hot',
    tagBest: 'Best',
    tagNew: 'New',
    tagRecommend: 'Pick'
  },
  productSort: {
    title: 'Product Sort Management',
    subtitle: 'Stores can customize the display order of hot recommended products',
    filterCity: 'Select City',
    filterStore: 'Select Store',
    allCities: 'All Cities',
    allStores: 'All Stores',
    columns: {
      sort: 'Rank',
      image: 'Image',
      name: 'Product Name',
      city: 'City',
      store: 'Store',
      price: 'Price',
      sales: 'Sales',
      tag: 'Tag',
      actions: 'Actions'
    },
    actions: {
      moveUp: 'Move Up',
      moveDown: 'Move Down',
      moveTop: 'Top',
      moveBottom: 'Bottom',
      edit: 'Edit Sort'
    },
    tips: 'Tip: Lower number = higher rank. Adjust by dragging or entering a number.',
    save: 'Save Sort',
    saved: 'Sort order saved',
    empty: 'No products found',
    sortDialog: {
      title: 'Adjust Sort Number',
      currentSort: 'Current Rank',
      newSort: 'New Sort Number',
      placeholder: 'Enter sort number',
      cancel: 'Cancel',
      confirm: 'Confirm'
    }
  }
}
