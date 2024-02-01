import { defineUserConfig } from 'vuepress'
import { themeConfig, headConfig, bundlerConfig, pluginsConfig } from './configs';

export default defineUserConfig(
  {
    lang: 'zh-CN',
    title: 'MGC Docs',
    description: 'Minecraft Graphic Community Documents',
    port: 8080,
    base: '/',

    head: headConfig,
    bundler: bundlerConfig,
    theme: themeConfig,
    plugins: pluginsConfig,
  }
);