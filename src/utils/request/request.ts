import {
  ContentTypeEnum,
  RequestMethodsEnum,
  UniRequest,
  type UniRequestConfig,
} from '@zd~/request'
import type { ResponseResult } from '@zd~/request/shared'
import {
  type HttpRequestUserConfig,
  tokenKey,
  tokenKeyScheme,
} from './util'
import {
  getCacheToken,
  isLink,
  isString,
  joinTimestamp,
  removeUndefinedKeys,
  setParams,
  showToastError,
  toAuth,
} from '@/utils/index'

export const request = new UniRequest<HttpRequestUserConfig>({
  baseUrl: API_URL,
  timeout: 60 * 1000,
  header: {
    'Content-Type': ContentTypeEnum.JSON,
  },
  getResponse: false,
  withToken: true,
  showErrorMsg: true,
}, {
  request(_config) {
    const config = Object.assign({
      ..._config,
    }) as UniRequestConfig<HttpRequestUserConfig>

    // 1. 处理 url 不是 http 或者 https 开头则加上 baseUrl
    if (!isLink(config.url))
      config.url = `${config.baseUrl || ''}${config.url}`

    if (config.params !== undefined) {
      if (config.method?.toUpperCase() === RequestMethodsEnum.GET) {
        if (!isString(config.params)) {
          const params = removeUndefinedKeys(config.params)
          const _params = Object.assign(params || {}, params || {}, joinTimestamp(true, false))
          config.data = removeUndefinedKeys(_params)
        }
        else {
          config.url = `${config.url + config.params}${joinTimestamp(true, true)}`
        }
      }
      else {
        if (!isString(config.params)) {
          config.url = setParams(config.url as string, Object.assign({}, config.params))
        }
        else {
        // 兼容restful风格
          config.url = config.url + config.params
        }
      }
    }

    /**
     * token
     */
    const token = getCacheToken()
    const whiteUrlPrefix = `${config.baseUrl}/api/`
    const isWhiteUrl = config.url!.startsWith(whiteUrlPrefix)
    const withToken = config.withToken && `${config.withToken}` === 'true'

    if (withToken && !isWhiteUrl) {
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
    if (config.data && typeof config.data === 'object') {
      config.data = removeUndefinedKeys(config.data)
    }
    return config
  },

  requestError(e) {
    if (e.message === 'no token') {
      toAuth()
    }
  },

  async response({ config, response }) {
    const { data, statusCode } = response
    if (statusCode !== 200) {
      const msg = getSystemErrorMessage(statusCode)
      return handleError(msg)
    }

    if (config.getResponse) {
      return response
    }

    const responseData = data as ResponseResult<object>

    if (responseData.code === 200) {
      return responseData as any
    }

    if (responseData.code === 401) {
      toAuth()
    }

    const msg = responseData.msg || getSystemErrorMessage(responseData.code)
    return handleError(msg, responseData.code !== 401 && !config?.showErrorMsg)
  },

  responseError(error: any) {
    if (error) {
      const err = error?.errMsg || error?.msg || error?.message || ''
      return handleError(err)
    }
  },
})

function getSystemErrorMessage(status: number) {
  switch (status) {
    case 400:
      return '错误请求，服务器无法理解请求的格式'
    case 401:
      return '无效的会话，或者会话已过期，请重新登录。'
    case 403:
      return '当前操作没有权限'
    case 404:
      return '服务器无法根据客户端的请求找到资源'
    case 405:
      return '网络请求错误,请求方法未允许!'
    case 408:
      return '网络请求超时!'
    case 500:
      return '服务器内部错误，无法完成请求'
    case 502:
      return '网关错误'
    case 503:
      return '服务器目前无法使用（由于超载或停机维护）'
    case 504:
      return '网络超时!'
    case 505:
      return 'http版本不支持该请求!'
    default:
      return '未知错误'
  }
}

function handleError(msg: string, showErrorMsg = true) {
  // eslint-disable-next-line ts/no-unused-expressions
  showErrorMsg && showToastError(msg)
  throw new Error(msg)
}
