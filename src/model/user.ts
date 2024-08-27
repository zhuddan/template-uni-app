export interface UserModel {
  createBy: string
  createTime: string
  updateBy?: any
  updateTime?: any
  remark?: any
  userId: number
  openId?: any
  deptId: number
  userName: string
  name?: string
  nickName: string
  email: string
  phonenumber: string
  sex: string
  avatar: string
  password: string
  status: string
  delFlag: string
  loginIp: string
  loginDate?: any
  // dept: DeptModel;
  roleIds?: any
  postIds?: any
  roleId?: any
  admin: boolean
  intro?: string
  idCard?: string
  //
  id: number
  /**
   * '0主班', '1副班', '2保育', '3保洁'
   */
  type: string
  /**
   * 家长端姓名
   */
  folkName?: string
  folkPhone?: string
  folkType?: string
}
