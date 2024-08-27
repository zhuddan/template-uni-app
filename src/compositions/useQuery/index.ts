import type { Ref } from 'vue'

import { onLoad } from '@dcloudio/uni-app'
import { ref, toRaw, unref } from 'vue'
import { isJSONString, logger, mergeDeep } from '@/utils/index'

function parse(value: any): any {
  if (typeof value == 'string' && isJSONString(value)) {
    value = JSON.parse(value)
    return parse(value)
  }
  return value
}

/**
 * 获取当前页面 url 参数
 * 建议使用 const router = useRouter() 获取
 * @param defaultValue
 */
export function useQuery<T extends object = object>(defaultValue: T = {} as T, debugMsg = true) {
  // defaultValue 仅在 dev 环境下生效
  const query = ref<T>(__DEV__ ? defaultValue : {} as T) as Ref<T>
  onLoad((_query) => {
    if (!_query)
      return
    // if (__DEV__) {
    //   console.log('<query>');
    //   console.log(JSON.stringify(_query));
    // }
    if (Object.keys(_query).length) {
      const data = getJson(_query)
      query.value = toRaw(unref(mergeDeep({ ...query.value }, { ...data })))
    }

    if (debugMsg) {
      if (Object.keys(toRaw(unref(query))).length) {
        const route = getCurrentPages()?.[getCurrentPages().length - 1].route
        logger.info(`[useQuery] ${route}`)
        const data = JSON.parse(JSON.stringify(toRaw(unref(query))))
        console.log(data)
      }
    }
  })
  return query
}

function getJson(_query: object) {
  const data: Record<string, any> = {}
  for (const key in _query) {
    if (Object.prototype.hasOwnProperty.call(_query, key)) {
      const value = decodeURIComponent(decodeURIComponent(_query[key as keyof typeof _query]))
      // const value = _value.replace(/^\"{/g, '{').replace(/}\"$/g, '}');
      // let jsonStringWithUnicodeReplaced = value.replace(/\\u([\d\w]{4})/g, (match, grp) => String.fromCharCode(parseInt(grp, 16)));

      // // 替换转义双引号
      // jsonStringWithUnicodeReplaced = jsonStringWithUnicodeReplaced.replace(/\\"/g, '"');
      if (isJSONString(value)) {
        data[key] = parse(value)
      }
      else {
        data[key] = value
      }
    }
  }
  return data
}
// console.log('debug test');
// console.log(getJson({ classInfo: '%7B%5C%22createBy%5C%22%3A%5C%22%5C%22%2C%5C%22createTime%5C%22%3A%5C%222023-12-01+15%3A16%3A39%5C%22%2C%5C%22updateBy%5C%22%3A%5C%22%5C%22%2C%5C%22updateTime%5C%22%3A%5C%222023-12-19+02%3A09%3A53%5C%22%2C%5C%22id%5C%22%3A32%2C%5C%22avatar%5C%22%3A%5C%221%5C%22%2C%5C%22name%5C%22%3A%5C%22%5Cu732B%5Cu54AA%5Cu73ED%5C%22%2C%5C%22deptId%5C%22%3A104%2C%5C%22enterTime%5C%22%3A%5C%2201%3A00%5C%22%2C%5C%22outTime%5C%22%3A%5C%2209%3A30%5C%22%2C%5C%22delFlag%5C%22%3A%5C%220%5C%22%7D', childInfo: '%7B%5C%22createBy%5C%22%3A%5C%22%5C%22%2C%5C%22createTime%5C%22%3A%5C%222023-12-01+15%3A26%3A06%5C%22%2C%5C%22updateBy%5C%22%3A%5C%22%5C%22%2C%5C%22updateTime%5C%22%3A%5C%222023-12-08+08%3A42%3A23%5C%22%2C%5C%22remark%5C%22%3A%5C%22%5C%22%2C%5C%22id%5C%22%3A291%2C%5C%22endDate%5C%22%3A%5C%222023-12-26%5C%22%2C%5C%22startDate%5C%22%3A%5C%222023-11-30%5C%22%2C%5C%22deptId%5C%22%3A104%2C%5C%22childName%5C%22%3A%5C%22%5Cu8499%5Cu5947D%7E%5Cu8DEF%5Cu98DE%5C%22%2C%5C%22nickName%5C%22%3A%5C%22%5Cu8349%5Cu5E3D%5Cu5C0F%5Cu5B50%5C%22%2C%5C%22sex%5C%22%3A%5C%221%5C%22%2C%5C%22birthday%5C%22%3A%5C%222015-12-01%5C%22%2C%5C%22idCard%5C%22%3A%5C%22123456%5C%22%2C%5C%22cardType%5C%22%3A%5C%222%5C%22%2C%5C%22childPic%5C%22%3A%5C%22%5C%2Fyuntyu%5C%2Fnull%5C%2F_yuntyu_wx_unknown_tmp_bacd9b73b5d17d4a1416cf67d70286db1c1e601cbe0e32aa_20231201232040A917_20231205114718A233.jpg%5C%22%2C%5C%22deviceNo%5C%22%3A%5C%22AF6823Q0719024%5C%22%2C%5C%22facePic%5C%22%3A%5C%22%5C%2Fyuntyu%5C%2Fwx%5C%2Funknown%5C%2Ftmp_06ee6daeac840b136bca03bd1d97636f2ec09e6dc192d0f3_20231206174831A634.jpg%5C%22%2C%5C%22addr%5C%22%3A%5C%22%5Cu7A9D%5Cu7A9D%5Cu6751%5C%22%2C%5C%22allergy%5C%22%3A%5C%22%5C%22%2C%5C%22medicalHistory%5C%22%3A%5C%22%5C%22%2C%5C%22status%5C%22%3A1%2C%5C%22auditStatus%5C%22%3A%5C%221%5C%22%7D' }));
