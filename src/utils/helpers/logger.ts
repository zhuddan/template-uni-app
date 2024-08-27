import type { CSSProperties } from 'vue'

export function mapStyle(record: CSSProperties) {
  return Object.keys(record)
    .map(key => `${key}:${record[`${key as keyof CSSProperties}`]}`)
    .join(';')
}

export function bg(background: string) {
  const res = mapStyle({
    background,
    'padding': '2px 5px',
    'border-radius': '4px',
    'color': '#fff',
    'font-size': '15px',
    'width': '1005px',
  })
  return res
}

export function text(color: string) {
  return mapStyle({
    color,
    'font-weight': '600',
    'font-size': '12px',
    'font-family': '黑体',
  })
}

function message(msg: unknown[]) {
  return msg.map(m => `%c${m}`).join(' ')
}

function texts(color: string, msg: unknown[]) {
  return msg.map(() => text(color))
}

function info(...msg: unknown[]) {
  if (!__DEV__)
    return
  console.log(`%c[INFO]%c ℹ️ ${message(msg)}`, bg('#00a6ed'), '', ...texts('#00a6ed', msg))
}

function warn(...msg: unknown[]) {
  if (!__DEV__)
    return
  console.log(`%c[WARN]%c ⚠️ ${message(msg)}`, bg('#ffb02e'), '', ...texts('#ffb02e', msg))
}

function error(...msg: unknown[]) {
  if (!__DEV__)
    return
  console.log(`%c[ERROR]%c ❌ ${message(msg)}`, bg('#f92f60'), '', ...texts('#f92f60', msg))
}

function success(...msg: unknown[]) {
  if (!__DEV__)
    return
  console.log(`%c[SUCCESS]%c ✅ ${message(msg)}`, bg('#0dbc79'), '', ...texts('#0dbc79', msg))
}

/**
 * 自定义打印
 */
export const logger = {
  info,
  warn,
  error,
  success,
}
