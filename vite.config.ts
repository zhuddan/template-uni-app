import path from 'node:path'
import type { UserConfig } from 'vite'
import Uni from '@dcloudio/vite-plugin-uni'
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import Components from '@uni-helper/vite-plugin-uni-components'
import nested from 'tailwindcss/nesting'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import tailwindcss from 'tailwindcss'
import postcssPresetEnv from 'postcss-preset-env'
import uniTailwind from '@uni-helper/vite-plugin-uni-tailwind'
import Icons from 'unplugin-icons/vite'
import tailwindcssConfig from './tailwind.config' // 注意匹配实际文件
import { generatedIcons } from './scripts/iconfont'

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, './')
  const isBuild = command === 'build'

  const plugins: UserConfig['plugins'] = [
    UniPages({
      homePage: 'pages/home/index',
    }),
    Components({
      globalNamespaces: ['global'],
      dts: 'src/types/components.d.ts',
    }),
    Uni(),
    uniTailwind({
      /* options */
    }),
    generatedIcons(isBuild),
    AutoImport({
      imports: [
        'vue',
        'uni-app',
        {
          from: 'src/compositions',
          imports: [
            'DictData',
            'PageIdentifier',
            'ListDataState',
            'ListDataStatusListType',
            'ListActions',
          ],
          type: true,
        },

      ],
      dts: './src/types/auto-imports.d.ts',
      dirs: [
        'src/compositions',
        'src/utils',
      ],
    }),
    mode === 'production'
      ? visualizer({
        gzipSize: true,
        brotliSize: true,
        emitFile: false,
        filename: path.resolve(__dirname, `./build/stats.html`), // 分析图生成的文件名
        open: true, // 如果存在本地服务端口，将在打包后自动展示
      })
      : null,
    Icons({
      compiler: 'vue3',
    }),
  ]
  const config: UserConfig = {
    resolve: {
      // preserveSymlinks: true,
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      postcss: {
        plugins: [
          nested(),
          tailwindcss({
            config: tailwindcssConfig,
          }),
          postcssPresetEnv({
            stage: 3,
            features: { 'nesting-rules': false },
          }),
        ],
      },
    },
    plugins,
    define: {
      __DEV__: mode === 'development',
      __PROD__: mode === 'production',
      API_URL: `"${env.VITE_APP_API_URL}"`,
      APP_TITLE: `"${env.VITE_APP_TITLE}"`,
    },
  }
  return config
})
