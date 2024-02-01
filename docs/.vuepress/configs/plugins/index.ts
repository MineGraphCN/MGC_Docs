import { PluginConfig } from 'vuepress'
import docsearchConfig from './docsearch'
import componentsConfig from './components'
const pluginsConfig: PluginConfig = [
    docsearchConfig,
    componentsConfig,
];

export default pluginsConfig;