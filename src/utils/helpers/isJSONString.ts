/**
 * 判断一个字符串是否是 json 字符串
 * @param str
 */
export function isJSONString(str: string): boolean {
  try {
    if (/^\d+$/.test(str))
      return false
    JSON.parse(str)
    return true
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (error) {
    return false
  }
}
