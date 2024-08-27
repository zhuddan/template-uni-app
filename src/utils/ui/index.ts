import { createToast } from './toast'
import { createLoading } from './loading'

/**
 * toast
 */
export const showToast = createToast('none')
export const showToastSuccess = createToast('success')
export const showToastError = createToast('none')

/**
 * loading
 */
let isLoading = false

export function getLoadingStatus() {
  return isLoading
}
const _showLoading = createLoading()

export function showLoading(title = '加载中...', options?: Omit<UniNamespace.ShowLoadingOptions, 'title'> | boolean) {
  if (!isLoading) {
    isLoading = true
    _showLoading(title, options)
  }
}

export async function hideLoading() {
  if (isLoading) {
    uni.hideLoading()
    await nextTick()
    isLoading = false
  }
}
