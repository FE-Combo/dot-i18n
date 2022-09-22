[![npm version](https://img.shields.io/npm/v/dot-i18n.svg?style=flat)](https://www.npmjs.com/package/dot-i18n)

### 使用之前先思考一个问题🤔
- [中文作为key到底会存在什么样的问题？](https://www.zhihu.com/question/263924505)
- 我的结论是除了规范问题没有任何隐患，既然可以为什么不用呢🤣（放心❗️本框架并没有使用中文作为key）

## 动机

- 无痕多语言配置开发环境
- 便携式 ts/excel 转换

## 前置条件

- 目前只支持 hooks
- 切换语种时需要重新刷新整个网站
- 基于 react+typescript 的项目
- 出现多语言配置不生效，重新生成 locales 并重启项目
- i18n 作为该库的关键字，且只能在 LocaleProvider 组件下使用
- 尽量使用 xml`<i18n>test</i18n>`的方式，少使用 function`i18n("test")`,前者性能优于后者
- 文案中不允许存在变量，若出现变量只能使用 function 方式解决`i18n("test{v}",{replace:{"{v}":i18n("变量")}})`

## 如何使用

- yarn add dot-i18n --save
- 项目根目录下创建 i18n.config.json
  - baseUrl: string `多语言使用范围. default: /src`
  - outDir: string `多语言词条最终生成路径. default: /src/locales`
  - filename: string `多语言词条最终生成文件名. default: index`
  - exportExcelPath: string `excel导出路径. default: /.i18n/result.xlsx`
  - importExcelPath: string `excel导入路径. default: /.i18n/result.xlsx`
  - languages: string[] `语种, 数组第一个参数为第一语种. default:["zh","en]`
  - prettierConfig: prettier 文件路径, 使用前请确保项目已经安装 prettier
- 创建 locales 目录: package.json 中新增 script `"locales": "node ./node_modules/dot-i18n/createLocale"`并执行`yarn locales`
- webpack 中新增 loader
  ```
  {
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    use: { loader: 'dot-i18n/loader' },
  },
  ```
- 项目 root 导入 LocaleProvider

  ```
    import * as I18nStore from "dot-i18n/store";
    const locales = require("./locales")

    <LocaleProvider.Provider locale={locales.zh}>
        test
    </LocaleProvider.Provider>
  ```

- 配置 tsconfig

```
// xxx/index.d.ts
import("dot-i18n/global")

// tsconfig.js
{
  "compilerOptions": {
    "typeRoots": ["xxx/index.d.ts"],
  },
  "exclude": ["node_modules"]
}

```

- 应用中直接使用`i18n("名字")`或者`<i18n>名字</i18n>`进行多语言配置

- 词条扫描(项目->ts)
  - package.json 中新增 script `"scanning": "node ./node_modules/dot-i18n/node/scanning"`并执行`yarn scanning`
  - 源文件路径为 i18n.config.json 的 baseUrl, 目标文件路径为 i18n.config.json 的 outDir

- 词条导出(ts->excel)
  - package.json 中新增 script `"ts2excel": "node ./node_modules/dot-i18n/node/ts2excel"`并执行`yarn ts2excel`
  - 源文件路径为 i18n.config.json 的 outDir, 目标文件路径为 i18n.config.json 的 exportExcelPath

- 词条导入(excel->ts)
  - package.json 中新增 script `"excel2ts": "node ./node_modules/dot-i18n/node/excel2ts"`并执行`yarn excel2ts`
  - 源文件路径为 i18n.config.json 的 importExcelPath, 目标文件路径为 i18n.config.json 的 outDir

## Q&A

- Q: 旧项目怎么做迁移？
- A: 渐进式迁移，保留原项目多语言包，项目中新增最新语言包用于当前库的使用

- Q: 对多语言中部分字体使用加粗？
- A: 文案中保留 html tag 并使用 dangerouslySetInnerHTML. e.g: `<div dangerouslySetInnerHTML={{ __html: i18n("登录即同意<span>《{serviceAgreement}》</span>与<span>《{privacyPolicy}》</span>", { replace: { "{serviceAgreement}": i18n("服务条款"), '{privacyPolicy}': i18n("隐私政策") } }) }} />`

- Q: 组件 return 类型问题不是 JSX

```
import React, { useEffect,useState } from "react";
const Index = (props: IProps) => {
    const [status, setStatus] = useState(0)
    const render = () => {
      switch (status) {
          case 0:
              return <div><i18n>未实名</i18n></div>;
          case 1:
              return <div><i18n>已实名</i18n></div>;
          default:
              return null;
      }
    };

    return render(); // 这里需要改为 return <>{render()}</>
};

```

- A: 把`return return render()` 改为 `return <>{render()}</>`

- Q: 组件外部使用 i18n 问题

```
import React, { useEffect,useState } from "react";
i18n("global test") // 不生效，必须在组件内部使用
const options = [{title:<i18n>测试</i18n>},{title:<i18n>测试2</i18n>}] //组件外部使用<i18n>会导致整个应用奔溃
const Index = (props: IProps) => {
    return (<div>{options.map((_, index)=><span key={index}>{_}</span>)}</div>)
};
```

- A: 原则上不可以在组件外部使用，单可以在组件内部调用，且组件外部只能使用`i18n("测试")`不能使用`<i18n>测试</i18n>`

```
// testGlobalI18n.ts
export const testGlobalI18n = () => {
    i18n("global i18n test")
}
// App.tsx
import React, { useEffect,useState } from "react";
import { testGlobalI18n } from "xxx"
const options = [{title:i18n("测试")},{title:i18n("测试2")}]
const Index = (props: IProps) => {
    testGlobalI18n()
    return (<div>{options.map((_, index)=><span key={index}>{_}</span>)}</div>)
};

```

## TODO

- 支持类组件
- 开发环境性能瓶颈检测
- css （伪类）多语言处理
