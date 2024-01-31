import { defaultTheme } from '@vuepress/theme-default'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { registerComponentsPlugin } from "@vuepress/plugin-register-components";
import { path } from '@vuepress/utils'
// import { sitemapPlugin } from "vuepress-plugin-sitemap2";

module.exports = {
    lang: 'zh-CN',
    title: 'MGC Docs',
    description: 'Minecraft Graphic Community Documents',
    port: "8080",

    head: [
        ['link', { rel: "icon", href: "/images/MGC-logo.png" }],
        ['script', { src: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML" }],
    ],

    plugins: [
        docsearchPlugin({
            appId: 'AMQJCXFVUL',

            apiKey: '64206f0ec56ab84f94d171e5a39b6815',

            indexName: 'mgcd-hypercol',

            locales: {
                '/': {
                    placeholder: '搜索文档',
                    translations: {
                        button: {
                            buttonText: '搜索文档',
                        },
                        modal: {
                            searchBox: {
                                resetButtonTitle: "清除查询条件",
                                resetButtonAriaLabel: "清除查询条件",
                                cancelButtonText: "取消",
                                cancelButtonAriaLabel: "取消",
                            },
                            startScreen: {
                                recentSearchesTitle: "搜索历史",
                                noRecentSearchesText: "没有搜索历史",
                                saveRecentSearchButtonTitle: "保存至搜索历史",
                                removeRecentSearchButtonTitle: "从搜索历史中移除",
                                favoriteSearchesTitle: "收藏",
                                removeFavoriteSearchButtonTitle: "从收藏中移除",
                            },
                            errorScreen: {
                                titleText: "无法获取结果",
                                helpText: "你可能需要检查你的网络连接",
                            },
                            footer: {
                                selectText: "选择",
                                navigateText: "切换",
                                closeText: "关闭",
                                searchByText: "搜索提供者",
                            },
                            noResultsScreen: {
                                noResultsText: "无法找到相关结果",
                                suggestedQueryText: "你可以尝试查询",
                                reportMissingResultsText: "你认为该查询应该有结果？",
                                reportMissingResultsLinkText: "点击反馈",
                            },
                        },
                    },
                },
            },
        }),
        registerComponentsPlugin({
            componentsDir: path.resolve(__dirname, './components')
        }),
        // sitemapPlugin({
        //     hostname: 'https://docs.minegraph.cn/',
        // }),
    ],

    bundlerConfig: {
        vuePluginOptions: {
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => customElement.includes(tag),
                },
            },
        },
    },

    theme: defaultTheme({
        logo: '/images/MGC-logo.png',
        logoDark: '/images/MGC-darklogo.png',
        notFound: ["看起来你不小心踏入了虚空。"],
        backToHome: "←重生",
        // repo: 'HyperCol/MGCD',
        navbar: [
            {
                text: '社区入门',
                link: '/community/',
            },
            {
                text: '作品收录',
                children: [
                    {
                        text: 'Java 版作品',
                        children: [
                            {
                                text: '光影包',
                                link: '/works/je_shaderpacks.md',
                            },
                            {
                                text: '资源包',
                                link: '/works/je_resourcepacks.md',
                            }
                        ]
                    },
                    {
                        text: '基岩版作品',
                        children: [
                            {
                                text: '光影包',
                                link: '/works/be_shaderpacks.md',
                            },
                            {
                                text: '资源包',
                                link: '/works/be_resourcepacks.md',
                            },
                            '/works/better_rtx.md',
                        ]
                    },
                    {
                        text: '光影设置汉化',
                        children: [
                            {
                                text: 'GitHub',
                                link: 'https://github.com/NakiriRuri/Minecraft-Shaders-zh_CN-Lang-Files',
                            },
                        ]
                    },
                ],
            },
            {
                text: '作品安装',
                children: [
                    {
                        text: '通用指南',
                        children: [
                            {
                                text: 'Java 版光影包',
                                link: '/instructions/je/shaderpacks/',
                            },
                            {
                                text: 'Java 版资源包',
                                link: '/instructions/je/resourcepacks/',
                            },
                            {
                                text: '基岩版',
                                link: '/instructions/be/',
                            },
                        ]
                    },
                    {
                        text: '作品手册',
                        link: '/instructions/',
                        children: [
                            {
                                text: 'iterationT 2',
                                link: '/instructions/je/shaderpacks/itt2.md',
                            },
                            {
                                text: 'iterationT 3',
                                link: '/instructions/je/shaderpacks/itt3.md',
                            },
                            {
                                text: 'IT-Project',
                                link: '/instructions/je/resourcepacks/itp.md',
                            },
                            {
                                text: "Misaka's Texture",
                                link: '/instructions/je/resourcepacks/MTP.md',
                            },
                            {
                                text: '秦',
                                link: '/instructions/je/resourcepacks/qin.md',
                            },
                            {
                                text: 'TMEO现代材质',
                                link: '/instructions/je/resourcepacks/tmeo.md',
                            },
                        ],
                    }
                ]
            },
            {
                text: '知识库',
                children: [
                    '/library/',
                    '/library/terms.md',
                    {
                        text: '科普文档',
                        children: [
                            '/library/shaders.md',
                            '/library/shaders-advanced.md',
                            '/library/resourcepacks.md',
                        ]
                    },
                    {
                        text: '问答',
                        link: '/library/qas/',
                        children: [
                            '/library/qas/je_shaders.md',
                            '/library/qas/je_resourcepacks.md',
                            '/library/qas/be.md',
                        ]
                    },
                    {
                        text: '误区纠正',
                        link: '/library/correction/',
                        children: [
                            '/library/correction/rt_misunderstanding.md',
                        ]
                    },
                    {
                        text: '疑难解答',
                        link: '/library/troubleshoot/',
                        children: [
                            '/library/troubleshoot/common.md',
                            '/library/troubleshoot/je/shaders.md',
                            '/library/troubleshoot/je/settings.md',
                            '/library/troubleshoot/je/mods_compatibility.md',
                        ]
                    },
                ],
            },
            {
                text: '创作者文档',
                children: [
                    '/creator/',
                    '/creator/resources.md',
                    '/creator/film_and_anim.md',
                    '/creator/model_and_rendering.md',
                    {
                        text: '光影开发教程',
                        children: [
                            {
                                text: '序言',
                                link: '/creator/shaders_tutorial/',
                            },
                            '/creator/shaders_tutorial/01-file_and_pipeline.md',
                            '/creator/shaders_tutorial/02-prepare.md',
                        ]
                    },
                ]
            },
            {
                text: '画廊',
                children: [
                    '/gallery/',
                    '/gallery/2021-autumn.md',
                    '/gallery/2021-winter.md',
                    '/gallery/2022-spring.md',
                    '/gallery/2022-summer.md',
                    '/gallery/2022-autumn.md',
                    '/gallery/2023-spring.md'
                ]
            },
            {
                text: '关于',
                children: [
                    '/about.md',
                    {
                        text: 'GitHub',
                        link: 'https://github.com/HyperCol/MGCD',
                    },
                    {
                        text: '测试版文档',
                        link: 'https://dev.mgcd.pages.dev',
                    },
                ]
            },
        ],

        //左侧列表
        sidebar: {
            '/community/': [
                '/community/README.md',
            ],
            '/works/': [
                '/works/je_shaderpacks.md',
                '/works/je_resourcepacks.md',
                '/works/be_shaderpacks.md',
                '/works/be_resourcepacks.md',
                '/works/better_rtx.md'
            ],
            '/instructions/': [
                '/instructions/README.md',
                {
                    text: 'Java 版光影手册',
                    collapsible: false,
                    children: [
                        {
                            text: '通用指南',
                            link: '/instructions/je/shaderpacks/README.md',
                        },
                        '/instructions/je/shaderpacks/itt2.md',
                        '/instructions/je/shaderpacks/itt3.md'
                    ]
                },
                {
                    text: 'Java 版资源包手册',
                    collapsible: false,
                    children: [
                        {
                            text: '通用指南',
                            link: '/instructions/je/resourcepacks/README.md',
                        },
                        '/instructions/je/resourcepacks/itp.md',
                        '/instructions/je/resourcepacks/MTP.md',
                        '/instructions/je/resourcepacks/qin.md',
                        '/instructions/je/resourcepacks/tmeo.md',
                    ]
                },
                {
                    text: '基岩版手册',
                    collapsible: false,
                    children: [
                        {
                            text: '通用指南',
                            link: '/instructions/be/README.md',
                        },
                        {
                            text: '暂时没有手册',
                        },
                    ]
                }
            ],
            '/library/': [
                '/library/README.md',
                '/library/terms.md',
                '/library/shaders.md',
                '/library/shaders-advanced.md',
                '/library/resourcepacks.md',
            ],
            '/library/qas/': [
                '/library/qas/je_shaders.md',
                '/library/qas/je_resourcepacks.md',
                '/library/qas/be.md',
            ],
            '/library/correction/': [
                '/library/correction/rt_misunderstanding.md',
            ],
            '/library/troubleshoot/': [
                '/library/troubleshoot/common.md',
                {
                    text: "Java 版",
                    collapsible: false,
                    children: [
                        '/library/troubleshoot/je/shaders.md',
                        '/library/troubleshoot/je/settings.md',
                        '/library/troubleshoot/je/mods_compatibility.md',
                    ]
                },
            ],
            '/creator/': [
                '/creator/README.md',
                '/creator/resources.md',
                '/creator/film_and_anim.md',
                '/creator/model_and_rendering.md',
            ],
            '/creator/shaders_tutorial/': [
                '/creator/shaders_tutorial/README.md',
                '/creator/shaders_tutorial/01-file_and_pipeline.md',
                '/creator/shaders_tutorial/02-prepare.md',
            ],
            '/gallery/': [
                '/gallery/2021-autumn.md',
                '/gallery/2021-winter.md',
                '/gallery/2022-spring.md',
                '/gallery/2022-summer.md',
                '/gallery/2022-autumn.md',
                '/gallery/2023-spring.md'
            ]
        },
    }),
}
