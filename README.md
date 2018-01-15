
### 最下方增加版本更新日志😁


### 功能模块
<span style="color: rgb(184,49,47);">备注：项目只引入了ant-design的部分组件，其他的组件antd官网有源码，可以直接复制到项目中使用，后续有时间补上全部组件。</span>
<span style="color: rgb(184,49,47);">项目使用了antd的自定义主题功能-->黑色，若想替换其他颜色，具体操作请查看antd官网</span>
<!--more-->

- 首页
    - 完整布局
    - 换肤(全局功能，暂时只实现了顶部导航的换肤，后续加上其他模块)
- 导航菜单
    - 顶部导航(菜单伸缩，全屏功能)
    - 左边菜单(增加滚动条以及适配路由的active操作)
- UI模块
    - 按钮(antd组件)
    - 图标(antd组件并增加彩色表情符)
    - 加载中(antd组件并增加顶部加载条)
    - 通知提醒框(antd组件)
    - 标签页(antd组件)
    - 轮播图(ant动效组件)
    - 富文本
    - 拖拽
    - 画廊
- 表格
    - 基础表格(antd组件)
    - 高级表格(antd组件)
    - 异步表格(数据来自掘金酱的接口)
- 表单
    - 基础表单(antd组件)
- 图表
    - highCharts图表
- 页面
    - 登录页面(包括GitHub第三方登录)
    - 404页面
#### 首页

### 代码目录
```js
+-- build/                                  ---打包的文件目录
+-- config/                                 ---npm run eject 后的配置文件目录
+-- node_modules/                           ---npm下载文件目录
+-- public/                                 
|   --- index.html							---首页入口html文件
|   --- npm.json							---echarts测试数据
|   --- weibo.json							---echarts测试数据
+-- src/                                    ---核心代码目录
|   +-- axios                               ---http请求存放目录
|   |    --- index.js
|   +-- components                          ---各式各样的组件存放目录
|   |    +-- dashboard                      ---首页组件  
|   |    +-- ui                             ---ui组件
|   |    |    --- ...   
|   |    --- BreadcrumbCustom.jsx           ---面包屑组件
|   |    --- HeaderCustom.jsx               ---顶部导航组件
|   |    --- Page.jsx                       ---页面容器
|   |    --- SiderCustom.jsx                ---左边菜单组件
|   +-- style                               ---项目的样式存放目录，主要采用less编写
|   +-- utils                               ---公用工具文件存放目录
|   --- App.js                              ---组件入口文件
|   --- index.js                            ---项目的整体js入口文件，包括路由配置等
--- .env                                    ---启动项目自定义端口配置文件
--- .eslintrc                               ---自定义eslint配置文件，包括增加的react jsx语法限制
--- package.json                                    
```
### 安装运行
##### 1.下载或克隆项目源码
##### 2.npm安装相关包文件(国内建议增加淘宝镜像源，不然很慢，你懂的😁)
```js
npm i
```
##### 3.启动项目
```js
npm start
```
##### 4.打包项目
```js
npm run build
```

### 更新日志



### 结尾
该项目会不定时更新
