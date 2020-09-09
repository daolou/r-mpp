# 多工程按需打包(mpp)

> 多工程、多页面, 支持 js/ts, 支持同时本地运行多个工程, 移动端, 内嵌 h5

## 背景：

1. 多个工程
2. 工程之间业务类似但联系性弱
3. 有公共部分
4. 预发布环境(`staging`) 用 `nginx` 管理静态资源(非根目录部署),路由结尾 `.html` 可选
5. 生产环境将静态资源上传至 CDN
6. ...

最明显的例子就是h5活动页,不定期会新增活动,活动之间有没有啥业务联系,基础工程又类似,不能每新增一个活动就新起一个工程,故搭建了此工程,用来按需打包构建指定的工程.

---

## 目录

`tree  -C -L 5 -I 'node_modules|__*|dist|dists|package-lock.json|.idea'`

```javascript
.
├── LICENSE
├── README.md
├── api
│   └── index.js
├── build (webpack 配置)
│   ├── helper
│   │   └── getIP.js
│   ├── myloaders
│   │   └── px2rem-loader.js
│   ├── webpack.analyzer.conf.js
│   ├── webpack.base.conf.js
│   ├── webpack.dev.conf.js
│   └── webpack.prod.conf.js
├── commitlint.config.js
├── config (工程服务配置依赖于环境变量: NODE_CONFIG_ENV)
│   ├── default.js
│   ├── dev.js
│   ├── local.js
│   ├── prod.js
│   └── staging.js
├── deploy (部署脚本)
│   ├── production.js
│   └── staging.js
├── nginx.conf
├── package.json
├── scripts (运行脚本)
│   ├── analyzer.js
│   ├── build.js
│   ├── dev.js
│   ├── project.js
│   └── projectConfig.js (工程配置)
├── src
│   ├── components (所有工程公用组件)
│   │   ├── AsyncComponent.js
│   │   ├── ErrorBoundary.js
│   │   └── Provider.js
│   ├── project
│   │   ├── app1 (工程app1: js语法)
│   │   │   ├── components (app1的组件)
│   │   │   ├── images (静态资源)
│   │   │   │   └── share-hi.png
│   │   │   ├── document.njk (html模板)
│   │   │   └── pages (页面)
│   │   │       ├── index.js (入口1)
│   │   │       ├── index.less (入口1的样式)
│   │   │       └── questions.js (入口2)
│   │   ├── app2 (工程app2: ts语法)
│   │   │   ├── components (app2的组件)
│   │   │   ├── images (静态资源)
│   │   │   │   └── share-hi.png
│   │   │   ├── document.njk (html模板)
│   │   │   └── pages (页面)
│   │   │       ├── index.tsx (入口1)
│   │   │       ├── index.less (入口1的样式)
│   │   │       └── questions.tsx (入口2)
│   │   └── document.njk (默认模板)
│   ├── public (所有工程公用静态文件)
│   │   └── favicon.ico
│   ├── services (所有工程公用服务文件)
│   │   └── androidBackService.js (安卓物理键返回)
│   └── utils (所有工程工具封装)
│       ├── NDB.js (我司jsbridge封装)
│       ├── index.js (个人常用工具函数)
│       └── rem.js (多屏幕适配)
├── tsconfig.json
└── typings
    └── index.d.ts
```

==ps: 编辑器请安装eslint和prettier插件==
##　以工程`app1`为例:

## 本地开发

1. `git clone git@github.com:Mr-jiangzhiguo/r-mpp.git`
2. `cd r-mpp`
3. `npm i`
4. `npm run pre-dev app1`
5. `http://localhost:8090`

## 打包构建

`npm run pre-build app1`

## 依赖分析

`npm run pre-analyz app1`

## 本地/测试机 nginx 服务

1. 打包部署 `npm run deploy:staging app1`
2. 复制`nginx.conf`到`nginx`配置目录
3. 根据个人情况选择是否开启`access_log`
4. 将`alias`修改为本机的项目目录
5. `sudo nginx -s reload`
6. `http://localhost:8099/activity4/app1`
