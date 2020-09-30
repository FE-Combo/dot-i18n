[![npm version](https://img.shields.io/npm/v/dot-i18n.svg?style=flat)](https://www.npmjs.com/package/dot-i18n)

## 动机

- 无痕多语言配置开发环境
- 便携式 ts/excel 转换

## 前置条件

- 目前只支持 hooks
- 基于 react+typescript 的项目
- 重新生成 locales 后需要重启项目

## 如何使用

- yarn add dot-i18n --save
- 项目根目录下创建 i18n.json
  - source: string `多语言使用范围. default: /src`
  - localePath: string `多语言词条最终生成路径. default: /src/locales`
  - exportExcelPath: string `excel导出路径. default: /.i18n/result.xlsx`
  - importExcelPath: string `excel导入路径. default: /.i18n/result.xlsx`
  - languages: string[] `语种, 数组第一个参数为第一语种. default:["zh","en]`
  - prettierConfig: prettier 文件路径, 使用前请确保项目已经安装 prettier
  - strict: boolean locales 数据结构是否严格按照 language->namespace->code, 如果 strict: false 则表示 locales 结构为 language->any. default: true
- 创建 locales 目录: package.json 中新增 script `"locales": "node ./node_modules/dot-i18n/node/createLocale"`并执行`yarn locales`
- webpack 中新增 loader
  ```
  {
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    use: { loader: 'dot-i18n/node/i18n-loader' },
  },
  ```
- 项目 root 导入 I18nContext

  ```
  import * as I18nStore from "dot-i18n/node/i18n-store.js";
  import locales from "./locales"
  I18nStore.createContext();
  const I18nContext = I18nStore.getContext();

       <I18nContext.Provider value={locales.zh}>
           test
        </I18nContext.Provider>
  ```

- 新增全局 tag/function->i18n

  ```
  declare namespace JSX {
      interface IntrinsicElements {
          i18n: React.DetailedHTMLProps<any, any>;
      }
  }

  type I18NOptions =
      | {
          namespace?: string;
          language?: string;
          [key: string]: string;
      }
      | string;

  declare const i18n: (value: string, options?: I18NOptions) => any;

  ```

- 使用`i18n("名字")`或者`<i18n>名字</i18n>`进行多语言

- 词条导出(ts->excel)

  - package.json 中新增 script `"ts2excel": "node ./node_modules/dot-i18n/node/ts2excel"`并执行`yarn ts2excel`
  - 源文件路径为 i18n.json 的 localePath, 目标文件路径为 i18n.json 的 exportExcelPath

- 词条导入(excel->ts)
  - package.json 中新增 script `"excel2ts": "node ./node_modules/dot-i18n/node/excel2ts"`并执行`yarn excel2ts`
  - 源文件路径为 i18n.json 的 importExcelPath, 目标文件路径为 i18n.json 的 localePath

## Attention

- 原生的 xlsx 不支持表格的样式设置, 选择使用 xlsx-style 可以设置表格样式

## TODO

- 文案变量处理
- 支持配置文件
- js->ts
- 支持类组件
- 开发环境性能瓶颈检测
