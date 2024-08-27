// 函数类型
declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

// promise
declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>
}

declare interface AnyObject {
  [key: string]: any
}

// 树状
declare type TreeItem<T> = T & {
  children?: TreeItem<T>[]
}

// 树状列表
declare type TreeList<T> = TreeItem<T>[]

// 工具类
/**
 * @deprecated
 */
declare type Nullable<T> = T | null

declare type Arrayable<T> = T | T[]

declare type Awaitable<T> = Promise<T> | T

/**
 * @deprecated 使用 [AnyObject]
 */
declare type Recordable<T = any> = Record<string, T>

declare type Functionable<T> = () => T | T

declare type MaybeString<T> = T | string
