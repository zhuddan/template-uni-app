import type { Ref, UnwrapRef, WritableComputedRef } from 'vue'

import { computed, getCurrentInstance, ref, watch } from 'vue'
import { isDef } from '@/utils/helpers'

export interface UseVModelOptions<T, Passive extends boolean = false> {
  /**
   * 当 passive 为 true, 将返回 ref 且 将使用 watch 与 props 同步
   * 而不是返回 computedRef
   * @default false
   */
  passive?: Passive
  /**
   * 该属性会覆盖 eventName
   *
   * @default undefined
   */
  eventName?: string
  /**
   * 正在尝试检查深度嵌套对象或数组中属性的更改。
   * Apply only when `passive` option is set to `true`
   *
   * @default false
   */
  deep?: boolean
  /**
   * Defining default value for return ref when no value is passed.
   *
   * @default undefined
   */
  defaultValue?: T
  /**
   * Clone the props.
   * Accepts a custom clone function.
   * When setting to `true`, it will use `JSON.parse(JSON.stringify(value))` to clone.
   *
   * @default false
   */
  clone?: boolean | CloneFn<T>
  /**
   * The hook before triggering the emit event can be used for form validation.
   * if false is returned, the emit event will not be triggered.
   *
   * @default undefined
   */
  shouldEmit?: (v: T) => boolean
}

export type CloneFn<F, T = F> = (x: F) => T

export function cloneFnJSON<T>(source: T): T {
  return JSON.parse(JSON.stringify(source))
}

export function useVModel<P extends object, K extends keyof P, Name extends string>(
  props: P,
  key?: K,
  emit?: (name: Name, ...args: any[]) => void,
  options?: UseVModelOptions<P[K], false>,
): WritableComputedRef<P[K]>

export function useVModel<P extends object, K extends keyof P, Name extends string>(
  props: P,
  key?: K,
  emit?: (name: Name, ...args: any[]) => void,
  options?: UseVModelOptions<P[K], true>,
): Ref<UnwrapRef<P[K]>>

/**
 * 结合 props emit 方便在 组件中自定义 VModel
 * @param props
 * @param key
 * @param emit
 * @param options
 */
export function useVModel<P extends object, K extends keyof P, Name extends string, Passive extends boolean>(
  props: P,
  key?: K,
  emit?: (name: Name, ...args: any[]) => void,
  options: UseVModelOptions<P[K], Passive> = {},
) {
  const {
    clone = false,
    passive = false,
    eventName,
    deep = false,
    defaultValue,
    shouldEmit,
  } = options

  const vm = getCurrentInstance()
  // @ts-expect-error mis-alignment with @vue/composition-api
  const _emit = emit || vm?.emit || vm?.$emit?.bind(vm) || vm?.proxy?.$emit?.bind(vm?.proxy)
  let event: string | undefined = eventName

  if (!key)
    key = 'modelValue' as K

  event = event || `update:${key!.toString()}`

  const cloneFn = (val: P[K]) => !clone
    ? val
    : typeof clone === 'function'
      ? clone(val)
      : cloneFnJSON(val)

  const getValue = () => isDef(props[key!])
    ? cloneFn(props[key!])
    : defaultValue

  const triggerEmit = (value: P[K]) => {
    if (shouldEmit) {
      if (shouldEmit(value))
        _emit(event, value)
    }
    else {
      _emit(event, value)
    }
  }

  if (passive) {
    const initialValue = getValue()
    const proxy = ref<P[K]>(initialValue!)
    watch(
      () => props[key!],
      (v) => {
        (proxy as any).value = cloneFn(v) as UnwrapRef<P[K]>
      },
    )

    watch(
      proxy,
      (v) => {
        if (v !== props[key!] || deep)
          triggerEmit(v as P[K])
      },
      { deep },
    )

    return proxy
  }
  else {
    return computed<P[K]>({
      get() {
        return getValue()!
      },
      set(value) {
        triggerEmit(value)
      },
    })
  }
}
