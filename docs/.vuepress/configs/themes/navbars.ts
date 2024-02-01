import { NavbarConfig } from "@vuepress/theme-default";

const navbarConfig: NavbarConfig = [
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
                link: 'https://github.com/MineGraphCN/MGC_Docs',
            },
            {
                text: '测试版文档',
                link: 'https://dev.mgcdocs.pages.dev/',
            },
        ]
    },
];


export default navbarConfig;