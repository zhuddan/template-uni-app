import { getCacheToken } from '../cache/index'
import type { GetResponseConfig } from './shared'
import type { HttpRequestUserConfig } from './util'
import { tokenKey, tokenKeyScheme } from './util'

export interface UploadFileBaseConfig extends Partial<UniNamespace.UploadFileOption>, HttpRequestUserConfig {
  /**
   * 返回原始数据
   */
  getResponse?: boolean
  /**
   * 忽略 loading
   */
  ignoreLoading?: boolean
}

export type isReturnNativeResponseUploadFileOption = UploadFileBaseConfig & GetResponseConfig

interface UploadFileResult<T extends object = object> {
  /**
   * 开发者服务器返回的数据
   */
  data: ResponseResult<T>
  /**
   * 开发者服务器返回的 HTTP 状态码
   */
  statusCode: number
}

/**
 * 公共上传方法
 * @param {UploadFileBaseConfig} config
 */
export async function upload<T extends object = object>(config: isReturnNativeResponseUploadFileOption): Promise<UploadFileResult<T>>
export async function upload<T extends object = object>(config: UploadFileBaseConfig): Promise<ResponseResult<T>>
export async function upload<T extends object = object>(config: UploadFileBaseConfig = {}): Promise<UploadFileResult<T> | T> {
  const _url = config.url ? config.url : '/file/upload'
  const httpOrHttps = /^http|https:\/\//
  const url = httpOrHttps.test(_url) ? _url : `${_url}`
  const name = config.name ? config.name : 'file'
  const formData = {
    ...config.formData,
  }
  if (config.withToken) {
    const token = getCacheToken()
    if (token) {
      config.header = {
        [tokenKey]: `${tokenKeyScheme} ${token}`,
        ...config.header,
      }
    }
    else {
      throw new Error('no token')
    }
  }
  const res = await uni.uploadFile({
    url,
    name,
    filePath: config.filePath,
    header: config.header,
    formData,
  })
  try {
    if (res.statusCode !== 200) {
      throw new Error(res.errMsg)
    }
    if (config.getResponse) {
      return {
        ...res,
        data: JSON.parse(res.data),
      } as UploadFileResult<T>
    }

    const result = JSON.parse(res.data) as ResponseResult<T>

    if (result.code !== 200) {
      if (!config.showErrorMsg) {
        showToastError(result.msg)
      }
      throw new Error(result.msg)
    }
    return result as T
  }
  catch (error: any) {
    if (config.showErrorMsg) {
      showToastError(error?.message)
    }
    throw error
  }
}
