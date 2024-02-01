import registerComponentsPlugin from "@vuepress/plugin-register-components";
import { path } from "@vuepress/utils";
import {projectComponentsDir} from '../../utils';

console.log(__dirname);

const componentsConfig = registerComponentsPlugin(
    {
        componentsDir: projectComponentsDir
    }
);

export default componentsConfig;