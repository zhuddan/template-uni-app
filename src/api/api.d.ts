declare namespace Api{
  interface OperlogModel {
    /**
     * 操作类型
     */
    businessType: string
    /**
     * 日志编号
     */
    operId: number
    /**
     * 操作类型
     */
    businessType: number
    /**
     * 操作人员
     */
    operName: string
    /**
     * 操作地址
     */
    operIp: string
    /**
     * 操作地点
     */
    operLocation: string
    /**
     * 操作日期
     */
    operTime: string
    /**
     * 消耗时间
     */
    costTime: string
    /**
     * 系统模块
     */
    title: string

  }
  interface GenModel {

    /**
     * 表名称
     */
    tableName: string
    /**
     * 表描述
     */
    functionName: string
    /**
     * id
     */
    tableId: number

  }
  /**
   * 登录注册返回
   */
  interface LoginRegisterResponse {
    token: string
  }
}
