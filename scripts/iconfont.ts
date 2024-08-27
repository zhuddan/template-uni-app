import fs from 'node:fs'
import path from 'node:path'

import chokidar from 'chokidar'
import ejs from 'ejs'

type DebounceFunction = <T extends (...args: any[]) => any>(
  func: T,
  delay?: number
) => (...args: Parameters<T>) => void

export const debounce: DebounceFunction = (func, delay = 1000) => {
  let timer: NodeJS.Timeout

  return async (...args) => {
    clearTimeout(timer)
    return new Promise<void>((resolve) => {
      timer = setTimeout(async () => {
        await func(...args)
        resolve()
      }, delay)
    })
  }
}

const sourceDir = path.resolve(__dirname, '__iconfont')
const targetDir = path.resolve(__dirname, '../src/components/iconfont/')

const ignored = [
  /\/src\/iconfont\/demo_index\.html$/,
  /\/src\/iconfont\/demo\.css$/,
  /\/src\/iconfont\/iconfont\.js$/,
  /\/src\/iconfont\/iconfont\.json$/,
  /\/src\/iconfont\/iconfont\.ttf$/,
  /\/src\/iconfont\/iconfont\.woff$/,
  /\/src\/iconfont\/iconfont\.woff2$/,
]

function copyFile(sourceFile: string, targetFile: string): void {
  // 检查源文件是否存在
  if (!fs.existsSync(sourceFile)) {
    throw new Error(`Source file "${sourceFile}" does not exist.`)
  }

  // 读取源文件内容
  const fileContent = fs.readFileSync(sourceFile)

  // 写入目标文件
  fs.writeFileSync(targetFile, fileContent)
}

const cssDelimiter = [
  '/* [',
  '] */',
] as [string, string]

const jsDelimiter = [
  '\'/* [',
  '] */\'',
] as [string, string]

function getEjsData() {
  const css = fs.readFileSync(
    path.resolve(__dirname, '__iconfont', 'iconfont.css'),
    'utf-8',
  )
  const index = css.indexOf('.icon-')
  const content = css.slice(index, css.length - 1).replace(/\r?\n*$/, '')
  // types
  const json = fs.readFileSync(path.resolve(__dirname, '__iconfont', 'iconfont.json')).toString()
  const typesObject = (JSON.parse(json).glyphs as { font_class: string }[]).map(e => `'${e.font_class}'`).sort()
  const types = typesObject.join(' |\n').replace(/\r?\n*$/, '')
  const ejsData = {
    content,
    types,
  }

  return ejsData
}

function getTemplateData(templateName: string, [openDelimiter, closeDelimiter]: [string, string] = cssDelimiter) {
  const ejsData = getEjsData()
  const _templatePath = path.resolve(__dirname, './__template', templateName)
  const source = fs.readFileSync(_templatePath).toString()
  const template = ejs.compile(source, {
    openDelimiter,
    closeDelimiter,
  })
  return template(ejsData)
}

async function copy() {
  try {
    // fonts
    fs.writeFileSync(
      path.resolve(targetDir, 'iconfont.css'),
      getTemplateData('iconfont.css'),
      'utf-8',
    )

    // types
    fs.writeFileSync(
      path.resolve(targetDir, 'iconfont.ts'),
      getTemplateData('iconfont.ts', jsDelimiter),
    )

    // // 字体
    await copyFile(
      path.resolve(__dirname, '__iconfont', 'iconfont.ttf'),
      path.resolve(targetDir, 'iconfont.ttf'),
    )
  }
  catch (error) {
    console.error(`${error}`)
  }
}

export function generatedIcons(isBuild: boolean) {
  if (isBuild)
    return

  const handler = debounce(copy)

  const watcher = chokidar.watch(sourceDir, {
    ignored,
  })

  watcher.on('all', async (type) => {
    if (type !== 'addDir' && type !== 'unlink' && type !== 'unlinkDir')
      handler()
  })
}
