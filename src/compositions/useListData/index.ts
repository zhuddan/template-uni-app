import type { UniLoadMoreStatus } from '@uni-helper/uni-ui-types'
import type { Ref } from 'vue'

import { computed, ref, toRaw } from 'vue'
import type { PageIdentifier } from '../usePageExpose'
import { isEqual, sleep } from '@/utils/helpers'

export interface ListDataState {
  /**
   * 是否报错
   */
  error: boolean
  /**
   * 是否加载
   */
  loading: boolean
  /**
   * 是否空数据
   */
  isEmpty: boolean
  /**
   * 是否搜索
   */
  isSearch: boolean
  /**
   * 是否下拉刷新
   */
  refresherTriggered: boolean
  /**
   * uni-load-more status
   */
  status?: UniLoadMoreStatus
}

export interface ListDataStatusListType<T extends AnyObject = AnyObject> extends ListDataState {
  list: T[]
  total: number
}

export interface ListActions<T extends AnyObject = AnyObject> {
  /**
   * 查询列表
   */
  readonly getList: () => Promise<void>
  /**
   * 刷新的作用
   */
  readonly onRefresh: () => Promise<void>
  /**
   * 搜索 和 refresherrefresh 类似有刷新的作用
   */
  readonly onSearch: () => Promise<void>
  /**
   * 下拉刷新 类似 搜索 但 refresherrefresh 会触发 scroll-view 组件的动作 搜索不会
   */
  readonly refresherrefresh: () => Promise<void>
  /**
   * 设置状态
   * @param key
   * @param value
   */
  readonly setState: <K extends keyof ListDataStatusListType<T>>(key: K, value: ListDataStatusListType<T>[K]) => void
  /**
   * 分页刷新页面数据
   */
  readonly forceUpdate: () => Promise<void>
}

export function useListData<T extends AnyObject = AnyObject>(
  fetch: (params: listGen<T>) => Promise<ResponseList<T>>,
  options: {
    /**
     * 分页参数
     */
    params?: Partial<ListParamsBase>
    /**
     *  搜索过滤 默认 ()=>({})
     */
    filter?: () => Partial<T & { searchValue?: any }>
    /**
     * 空数据判断条件 默认 list => list.length == 0
     */
    empty?: (list: T[]) => boolean
    /**
     * 初次 getList 执行时机 none 不自动执行 immediate 立即执行 onload 在生命周期onload中执行
     */
    flush?: 'none' | 'immediate' | 'onload'
    /**
     * 请求完成
     */
    onComplete?: (cb: {
      isSearch: boolean
      refresherTriggered: boolean
    }) => void
    /**
     * key: PageKey<T>
     */
    pageKey?: PageIdentifier<ListActions<T>>
  } = {},
) {
  const {
    params: { pageNum = 1, pageSize = 20 } = {},
    empty: _Empty = list => list.length === 0,
    filter = () => ({}),
    flush = 'onload',
    pageKey,
    onComplete,
  } = options
  const router = useRouter()
  /**
   * 查询调节
   */
  const paramsRef = ref({
    pageNum,
    pageSize,
  }) as Ref<ListParamsBase>
  /**
   *  过滤参数
   */
  const filterRef = computed(() => filter?.())
  /**
   * 查询参数
   */
  const paramsComputedRef = computed(() => {
    return {
      ...paramsRef.value,
      ...filterRef.value,
    } as ListParamsWrapper<T>
  })
  /**
   * 数据是否加载中
   */
  const loading = ref(false)
  /**
   * 总条数
   */
  const total = ref(0)
  /**
   * 数据列表
   */
  const list: Ref<T[]> = ref([])
  /**
   * 底部状态
   */
  const status = ref<UniLoadMoreStatus>()
  /**
   * 是否重置PageNum
   */
  const isRestPageNumber = ref(false)
  /**
   * 是否搜索
   */
  const isSearch = ref(true)
  /**
   * 用户下拉刷新动作
   */
  const refresherTriggered = ref(false)
  /**
   * 错误
   */
  const error = ref(false)
  /**
   * 底部状态 是否 显示
   */
  const isEmpty = computed(() => {
    return _Empty(list.value)
  })

  if (flush === 'immediate') {
    getList()
  }
  else if (flush === 'onload') {
    onLoad(() => {
      nextTick(() => {
        console.log('onLoad', router.query)
        getList()
      })
    })
  }

  /**
   * 状态
   */
  const state: ListDataStatusListType<T> = reactive({
    list,
    error,
    status,
    loading,
    isEmpty,
    isSearch,
    refresherTriggered,
    total,
  })
  /**
   * 操作
   */
  const actions: ListActions<T> = {
    /**
     * 你应该手动控制刷新
     */
    getList,
    /**
     * 刷新 不清空列表
     */
    onRefresh,
    /**
     * 刷新 用于搜索
     */
    onSearch,
    /**
     * 手动触发刷新
     */
    refresherrefresh,
    /**
     * setState
     */
    setState,
    /**
     *
     */
    forceUpdate,
  }

  if (pageKey) {
    usePageExpose(pageKey, actions)
  }
  return [state, actions] as const

  function setState<K extends keyof ListDataStatusListType>(key: K, value: ListDataStatusListType<T>[K]) {
    state[key] = value
  }

  /**
   * 查询数据
   */
  async function getList() {
    if (loading.value) {
      return Promise.resolve()
    }
    /**
     * loading 状态直接过滤
     */
    if (status.value === 'loading') {
      console.log('@status loading')
      return Promise.resolve()
    }
    /**
     *  设置 pageNum = 1
     */
    if (isRestPageNumber.value) {
      console.log('@isRestPageNumber paramsRef.value.pageNum = 1')
      paramsRef.value.pageNum = 1
      return getData()
    }

    /**
     * 错误时候 重新请求
     */
    if (error.value) {
      console.log('@error')
      return getData()
    }

    /**
     * 还有更多
     */
    if (status.value === 'more') {
      paramsRef.value.pageNum++
      console.log('@status more', paramsRef.value.pageNum)
      return getData()
    }

    /**
     * 没有更多数据的话拦截
     */
    if (status.value === 'noMore') {
      console.log('@status noMore')
      return Promise.resolve()
    }

    console.log('@@@@')
    return getData()
  }

  function onRefresh() {
    isRestPageNumber.value = true
    return getList()
  }

  /**
   * 搜索 (非【手动下拉】触发的刷新)
   */
  function onSearch() {
    isSearch.value = true
    return onRefresh()
  }

  /**
   * 手动触发刷新
   */
  async function refresherrefresh() {
    refresherTriggered.value = true
    await sleep(500)
    return onRefresh()
  }

  function forceUpdate() {
    const listLength = list.value.length
    isRestPageNumber.value = true
    const pageSize = Math.ceil(listLength / paramsRef.value.pageSize) * paramsRef.value.pageSize
    const query = {
      /**
       * 处理列表长度为0的情况
       */
      pageSize: pageSize || paramsRef.value.pageSize,
      pageNum: 1,
      ...filterRef.value,
    } as ListParamsWrapper<T>
    console.log('$$ onPageShowFresh hack')
    return getData(query)
  }

  /**
   * 更新 uni-load-more status
   */
  function updateStatus() {
    nextTick(() => {
      const finished = list.value.length >= total.value

      status.value = finished ? 'noMore' : 'more'

      console.log('getData ~~~ status.value', status.value)
    })
  }

  /**
   * 请求数据
   */
  function getData(params: listGen<T> = paramsComputedRef.value) {
    const cbStatus = {
      isSearch: isSearch.value,
      refresherTriggered: refresherTriggered.value,
    }

    loading.value = true
    error.value = false
    /**
     * 是 搜索操作 把list置空
     */
    if (isSearch.value) {
      list.value = []
    }
    /**
     * 加载更多
     */
    if (list.value.length && !refresherTriggered.value) {
      status.value = 'loading'
    }

    return fetch(params)
      .then((res) => {
        const nextList = isRestPageNumber.value ? [...res.rows] : [...toRaw(list.value), ...res.rows] as T[]

        if (isRestPageNumber.value) {
          isRestPageNumber.value = false
        }

        const same = isEqual(nextList, toRaw(list.value))
        console.log('same', same)

        if (!same) {
          list.value = [...nextList]
        }

        console.log('[list]', toRaw(list.value))

        total.value = res.total

        updateStatus()

        onComplete?.(cbStatus)
      }).catch((e) => {
        if (__DEV__) {
          console.log('[useDataList error]: ')
          console.log(e)
        }

        status.value = 'noMore'
        error.value = true
      }).finally(() => {
        isSearch.value = false
        refresherTriggered.value = false
        isRestPageNumber.value = false
        loading.value = false
      })
  }
}
