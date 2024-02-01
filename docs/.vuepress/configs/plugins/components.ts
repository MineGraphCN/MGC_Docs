import registerComponentsPlugin from "@vuepress/plugin-register-components";
import { path } from "@vuepress/utils";

const componentsConfig = registerComponentsPlugin(
    {
        componentsDir: path.resolve(__dirname, './components')
    }
);

export default componentsConfig;