export default [
  { path: '/login', name: '登录', layout: false, component: './Login' },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },

  {
    path: '/product',
    name: '产品管理',
    icon: 'Crown',
    access: 'canAdmin',
    routes: [
      { path: '', redirect: '/product/list' },
      { path: 'category', name: '产品类别', component: './Category' },
      { path: 'list', name: '产品列表', component: './Product' },
      { path: 'sets', name: '套装管理', component: './Sets' },
    ],
  },
  {
    path: '/order',
    name: '订单管理',
    icon: 'SolutionOutlined',
    access: 'canAdmin',
    routes: [
      { path: '', redirect: '/order/list' },
      { path: 'list', name: '订单列表', component: './Order' },
      { path: 'comments', name: '评论管理', component: './Comments' },
    ],
  },
  {
    path: '/promotion',
    name: '营销管理',
    icon: 'GiftOutlined',
    access: 'canAdmin',
    routes: [
      { path: '', redirect: '/order/list' },
      { path: 'coupon', name: '优惠券管理', component: './Coupon' },
      { path: 'advertisement', name: '广告活动', component: './Coupon' },
    ],
  },
  {
    name: '用户管理',
    icon: 'User',
    access: 'canAdmin',
    path: '/user',
    component: './User',
  },
  {
    name: '系统配置',
    icon: 'BarsOutlined',
    access: 'canAdmin',
    path: '/system',
    component: './SystemConfig',
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
