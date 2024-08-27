import { request } from '@/utils/request/index'
// 获取验证码
export function getCode() {
  return request.get<{ img: string, uuid: string }>({
    url: '/captchaImage',
    withToken: false,
  })
}

// 登录方法
export function loginPhone(data:
{
  username: string
  password: string
  code: string
  uuid: string
}) {
  return request.post<{ token: string }>({
    url: '/login',
    data,
    withToken: false,
  })
}
