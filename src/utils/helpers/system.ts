export function rpxToPx(rpx: number) {
  const screenWidth = uni.getSystemInfoSync().screenWidth
  return (screenWidth * rpx) / 750
}
export function pxToRpx(px: number) {
  const screenWidth = uni.getSystemInfoSync().screenWidth
  return (750 * px) / screenWidth
}

export function getSafeAreaHeight(type: 'rpx' | 'px' = 'rpx') {
  const bottom = uni.getSystemInfoSync().safeAreaInsets?.bottom || 0
  if (type === 'px')
    return bottom
  return pxToRpx(bottom)
}

export function getWindowHeight(type: 'rpx' | 'px' = 'rpx') {
  const bottom = uni.getSystemInfoSync().windowHeight || 0
  if (type === 'px')
    return bottom
  return pxToRpx(bottom)
}

export function getWindowSafeHeight(type: 'rpx' | 'px' = 'rpx') {
  const res = getWindowHeight(type) - getSafeAreaHeight(type)
  if (type === 'px')
    return res
  return pxToRpx(res)
}

export function getTabbarHeight() {
  const {
    pixelRatio,
    screenHeight,
    statusBarHeight,
    windowHeight,
  } = uni.getSystemInfoSync()

  const tabbarHeight = (screenHeight - windowHeight - (statusBarHeight || 0)) * pixelRatio
  return tabbarHeight
}

const { platform, uniPlatform } = uni.getSystemInfoSync()

export const isAndroid = platform.toLocaleLowerCase() === 'android'

export const isIOS = platform.toLocaleLowerCase() === 'ios'

export const isWeb = uniPlatform.toLocaleLowerCase() === 'web'

export const isApp = uniPlatform.toLocaleLowerCase() === 'app'

export const isDevtools = platform.toLocaleLowerCase() === 'devtools'
