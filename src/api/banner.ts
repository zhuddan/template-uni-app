import { request } from '@/utils/request/index'
/**
 * 获取轮播图
 */
export function wxLogin(params: { code: string }) {
  return request.post<ResponseList<any[]>>(
    {
      url: `/wxLogin`,
      params,
      header: {
        withToken: false,
        isReturnNativeResponse: true,
      },
    },
  )
}
