import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import { useQuery } from '../useQuery'

interface UseDataDetailQuery {
  [key: string]: number
}

type _UseDataDetailQuery = UseDataDetailQuery | undefined
/**
 * @description 根据 query.id 获取详情
 * @param fetch 详情接口
 * @param options
 *  @param {string} options.id - 查询的详情ID
 * @param {string} options.idKey - ID 的键名
 * @param {boolean} options.flush - 是否刷新缓存
 * @param {Function} options.onComplete - 获取完成后的回调函数
 */
export function useDataDetail<T extends AnyObject = AnyObject>(
  fetch: PromiseFn<number, ResponseData<T>>,
  options: {
    /**
     *
     */
    id?: () => number | undefined
    /**
     * idKey 默认string
     */
    idKey?: string
    /**
     * 初次 getData 执行时机 none 不自动执行 onload 在生命周期onload中执行
     */
    flush?: 'none' | 'onload'
    /**
     * 请求完成时
     */
    onComplete?: (responseData: ResponseData<T>) => void
  } = {},
) {
  const {
    idKey = 'id',
    id: defaultId,
    onComplete,
    flush = 'onload',
  } = options
  const refresherTriggered = ref(false)
  const data: Ref<T> = ref({}) as Ref<T>
  const loading = ref(false)
  const isEmpty = computed(() => {
    return !Object.keys(data.value).length && !loading.value
  })

  const queryOption: _UseDataDetailQuery = undefined

  // if (defaultId != undefined) {
  //   queryOption = {
  //     [idKey]: defaultId,
  //   };
  // }

  const query = useQuery<UseDataDetailQuery>(queryOption, false)

  const id = computed(() => query.value[idKey] || defaultId?.())

  async function getData() {
    try {
      if (loading.value)
        return
      if (!id.value) {
        console.warn('no id ')
        return
      }
      loading.value = true
      return fetch(id.value).then((res) => {
        if (res.data && Object.keys(res.data).length) {
          data.value = res.data
        }
        onComplete?.(res || {})
      }).finally(() => {
        loading.value = false
        uni.stopPullDownRefresh()
      })
    }
    catch (error) {
      console.log('error')
      console.log(error)
    }
  }

  async function refresh() {
    try {
      refresherTriggered.value = true
      await getData()
    }
    finally {
      refresherTriggered.value = false
    }
  }

  if (flush === 'onload') {
    onLoad(() => {
      nextTick(() => {
        getData()
      })
    })
  }

  onPullDownRefresh(() => {
    console.log('onPullDownRefresh')
    getData()
  })

  return {
    getData,
    refresh,
    refresherTriggered,
    isEmpty,
    data,
    loading,
    id,
  }
}
