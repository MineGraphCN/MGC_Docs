import { SidebarConfig } from "@vuepress/theme-default";

const sidebarConfig: SidebarConfig = {
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
                '/instructions/je/shaderpacks/itt3.md',
                '/instructions/je/shaderpacks/gfme.md'
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
        '/gallery/2023-spring.md',
        '/gallery/2024-spring.md'
    ]
};

export default sidebarConfig;