import { onLoad } from '@dcloudio/uni-app'
import { nextTick, reactive } from 'vue'
import { useQuery } from '../useQuery'
import { Router, logger } from '@/utils/index'

/**
 * 路由 compositions
 */
export function useRouter<T extends object = object>(defaultValue: T = {} as T, debugMsg = true) {
  logger.info('[useRouter]')
  const query = useQuery<T>(defaultValue, debugMsg)
  const router = reactive(new Router<T>())
  router.init()
  onLoad(() => {
    router.setQuery((query.value || {}) as T)
    router.setPath(router.getCurrentPage()?.route || '')
    nextTick(() => {
      router.runReady((query.value || {}) as T)
    })
  })
  return router
}
