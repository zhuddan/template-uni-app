import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  // 你也可以定义 pages 字段，它具有最高的优先级。
  // pages: [],
  globalStyle: {
    navigationBarTextStyle: 'white',
    navigationBarTitleText: 'template-uni-app',
    navigationBarBackgroundColor: '#459d76',
    backgroundColor: '#F8F8F8',
  },
  // tabBar: {
  //   color: '#707070',
  //   selectedColor: '#007aff',
  //   backgroundColor: '#ffffff',
  //   borderStyle: 'black',
  //   fontSize: '10px',
  //   height: '50px',
  //   iconWidth: '24px',
  //   spacing: '3px',
  //   position: 'bottom',
  //   list: [
  //     {
  //       pagePath: 'pages/home/index',
  //       iconPath: 'static/tabbar/home-off.png',
  //       selectedIconPath: 'static/tabbar/home-on.png',
  //       text: '首页',
  //     },
  //     {
  //       pagePath: 'pages/mine/index',
  //       iconPath: 'static/tabbar/mine-off.png',
  //       selectedIconPath: 'static/tabbar/mine-on.png',
  //       text: '我的',
  //     },
  //   ],
  // },
  easycom: {
    autoscan: true,
    custom: {
      '^uni-(.*)': '@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue',
    },
  },
  // 分包自动导入配置请在vite中 UniPages 配置
  subPackages: [
    {
      root: 'feature',
      pages: [
        {
          path: 'pages/sub-test/index',
        },
      ],
    },
  ],
})
