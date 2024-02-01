import registerComponentsPlugin from "@vuepress/plugin-register-components";
import {projectComponentsDir} from '../../utils';

console.log(__dirname);

const componentsConfig = registerComponentsPlugin(
    {
        componentsDir: projectComponentsDir
    }
);

export default componentsConfig;