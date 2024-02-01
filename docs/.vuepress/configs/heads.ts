import { HeadConfig } from "vuepress";

const headConfig: HeadConfig[] = [
    ['link', { rel: "icon", href: "/images/MGC-logo.png" }],

    ['script', { src: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML" }],
];

export default headConfig;