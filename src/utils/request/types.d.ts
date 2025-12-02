declare global {
  /**
   * 全局 默认响应结构
   */
  interface ResponseResult<T> {
    /**
     * 开发者服务器 状态码
     */
    code: number
    /**
     * 开发者服务器 消息
     */
    msg: string
    /**
     * data
     */
    data: T
  }
}

export {}
