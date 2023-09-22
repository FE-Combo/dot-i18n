[![npm version](https://img.shields.io/npm/v/dot-i18n.svg?style=flat)](https://www.npmjs.com/package/dot-i18n)

## 动机

- 无痕多语言配置
- 便携式 ts/excel 转换

## 约定
- 项目基于 React 和 TypeScript 构建。
- 在使用多语言功能时，关键字为 `i18n`，且只能在 `DotI18N.Provider` 组件下使用。
- 不允许在全局变量中挂载 `i18n`。e.g: window.i18n = (text: string) => text。
- 尽量多使用 XML 形式 <i18n>test</i18n>，而不是函数调用 i18n("test")。前者性能更好，但后者更灵活。
- 如果文本中包含变量，必须使用以下方式解决：
  ```js
    i18n("test{v}", { replace: { "{v}": i18n("变量") } })。
  ```
- 目前只支持在组件内使用 React Hooks，不能在自定义 Hooks 中使用；只能在返回类型为 JSX.Element 的 Hooks 中使用。
- 如果您的项目使用了 Webpack 5+，请确保添加以下代码到 "plugins" 中的 "ProvidePlugin" 部分：
  ```
  plugins: [
    ...prePlugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    }),
    ...
  ]
  ```


## 如何使用（以create-react-app为例）
1. 初始化项目
    ```bash
        npx create-react-app dot-i18n-demo --template typescript
    ```

2. 安装所需依赖
    ```bash
        cd dot-i18n-demo
        yarn eject
        yarn add dot-i18n --save 
        yarn add dot-i18n-loader --dev
    ```

3. 根目录创建i18n.config.json
```json
{
    "baseUrl": "/src/", // 项目根目录
    "outDir": "/src/locales", // 词条输出目录
    "filename": "index", // 词条文件名
    "exportExcelPath": "/.i18n/result.xlsx", // 词条导出excel路径
    "importExcelPath": "/.i18n/result.xlsx", // 词条导入excel路径
    "languages": ["zh", "en"] // 词条语种，数组[0]代表第一语种
  }
  
```

4. package.json 中添加相应的脚本
```json
  "scripts": {
    "ts2excel": "node ./node_modules/dot-i18n-loader/node/ts2excel", // 初始化 locales 文件或扫描词条
    "excel2ts": "node ./node_modules/dot-i18n-loader/node/excel2ts", // 将 locales 中的词条导出到 excel 中
    "scanning": "node ./node_modules/dot-i18n-loader/node/scanning" // 将 excel 中的词条导入到 locales 中
  },
```
5. 配置Webpack Loader
```js
    [
        ...loaders,
        {
        test: /\.(tsx|ts)$/,
        exclude: /node_modules/,
        use: { loader: 'dot-i18n-loader' }
        }
    ]
```
如果使用 Webpack 5+，还需配置额外的插件
```js
[
    ...plugins,
    new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer']
    }),
]
```

6. 初始化词条，执行 `yarn scanning` 初始化 locales 文件

7. 在根组件中使用 DotI18N.Provider 包裹您的应用
``` typescript
    // index.tsx
    import DotI18N from "dot-i18n";
    import locales from "../locales";

    <DotI18N.Provider locales={locales.zh}>
        <App />
    </DotI18N.Provider>
```

8. 在 tsconfig.json 中导入相关类型
```js
    // global.d.ts
    import("dot-i18n/global")

    // tsconfig.js
    {
    "compilerOptions": {
        "typeRoots": ["./node_modules/@types/", "./global.d.ts"],
    },
    "exclude": ["node_modules"]
    }
```

9. 在项目中编写多语言文本
```typescript
    // App.tsx
    import logo from './logo.svg';
    import './App.css';

    function App() {
    return (
        <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <div>
                <i18n>我是xml形式多语言词条，性能更优</i18n>
            </div>
            <div>
                {i18n("我是函数式多语言词条，使用更灵活")}
            </div>
            -------------------------------------------
            <div>
                <i18n namespace="my">我有自己的命名空间</i18n>
            </div>
            <div>
                {i18n("我也有自己的命名空间", {namespace: "ym"})}
            </div>
            -------------------------------------------
            <div>
                <i18n>我不支持变量</i18n>
            </div>
            <div>
                {i18n("但是我支持变量{value}", {replace: {"{value}": "--新值--"}})}
            </div>
        </header>
        </div>
    );
    }

    export default App;
```

10. 翻译流程如下：
    - 执行 yarn scanning（词条扫描）：项目中的词条收集到 locales 中
    - 执行 yarn ts2excel（词条导出excel）：将 locales 中的词条导出到 excel 中
    - 执行yarn excel2ts（词条导入）：将 excel 中翻译好的词条导入到 locales 中

通过以上配置和步骤，您可以在项目中轻松使用多语言功能。如果想查看完整的示例代码，请访问 [dot-i18n-demo](https://github.com/vocoWone/dot-i18n-demo)

## Q&A

- Q: 旧项目怎么做迁移？
- A: 渐进式迁移，保留原项目多语言包，项目中新增最新语言包用于当前库的使用

- Q: 对多语言中部分字体使用加粗？
- A: 文案中保留 html tag 并使用 dangerouslySetInnerHTML. e.g: `<div dangerouslySetInnerHTML={{ __html: i18n("登录即同意<span>《{serviceAgreement}》</span>与<span>《{privacyPolicy}》</span>", { replace: { "{serviceAgreement}": i18n("服务条款"), '{privacyPolicy}': i18n("隐私政策") } }) }} />`

- Q: 函数 return 类型不是 JSXElement 导致多语言失效

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

- A: 把`return render()` 改为 `return <>{render()}</>`

- Q: SyntaxError: This experimental syntax requires enabling one of the following parser plugin(s): "decorators-legacy", "decorators".

- A: 1.decorators检查是否配置正确；2.检查非jsx函数中是否使用了`i18n`

- Q: 项目启动时报错 `Uncaught ReferenceError: Buffer is not defined`

- A: 检测项目中是否配置 webpack plugin `ProvidePlugin`，若配置完还是不生效请删除 `node_modules` 与 `yarn.lock` 重新安装

## TODO
- 支持类组件
- css （伪类）多语言处理
- 非 jsx 支持多语言配置