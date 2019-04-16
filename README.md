# 多工程按需打包(mpp)

## 背景：

1. 多个工程
2. 工程之间业务类似但联系性弱
3. 有公共部分
4. ...

最明显的例子就是h5活动页,不定期会新增活动,活动之间有没有啥业务联系,基础工程又类似,不能每新增一个活动就新起一个工程,故搭建了此工程,用来按需打包构建指定的工程.

---

## 目录

`tree  -C -L 5 -I 'node_modules|__*|dist|dists|package-lock.json|.idea'`

```javascript
.
├── LICENSE
├── README.md
├── build (webpack 配置)
│   ├── webpack.analyzer.conf.js
│   ├── webpack.base.conf.js
│   ├── webpack.dev.conf.js
│   ├── webpack.prod.conf.js
│   └── webpack.rules.conf.js
├── config (工程配置)
│   ├── analyzer.js
│   ├── build.js
│   ├── dev.js
│   ├── project.js
│   └── projectConfig.js
├── deploy (部署脚本)
│   ├── production.js
│   └── staging.js
├── nginx.conf
├── package.json
├── plugins
└── src
    ├── components (所有工程公用组件)
    │   ├── AsyncComponent.js
    │   └── ErrorBoundary.js
    ├── project
    │   ├── app1 (工程app1)
    │   │   ├── app.js (入口文件)
    │   │   ├── app.less (app1的全局样式)
    │   │   ├── assets (静态资源)
    │   │   │   └── share-hi.png
    │   │   ├── components (app1的组件)
    │   │   ├── document.njk (html模板)
    │   │   └── pages (页面)
    │   │       ├── Index.js
    │   │       └── Questions.js
    │   ├── app2
    │   │   ├── app.js
    │   │   ├── app.less
    │   │   ├── assets
    │   │   ├── document.njk
    │   │   └── pages
    │   └── document.njk (默认模板)
    ├── public (所有工程公用静态文件)
    │   └── favicon.ico
    ├── services (所有工程公用服务文件)
    │   └── androidBackService.js (安卓物理键返回)
    └── utils (所有工程工具封装)
        ├── NDB.js (我司jsbridge封装)
        ├── index.js (个人常用工具函数)
        └── rem.js (多屏幕适配)
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

## 本地nginx服务

1. 复制`nginx.conf`到自己的nginx配置目录
2. 将root修改为自己本机的项目目录
3. `sudo nginx -s reload`
4. `http://localhost:8091/activity4/app1/#/index.html`
