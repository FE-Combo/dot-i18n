[![npm version](https://img.shields.io/npm/v/dot-i18n.svg?style=flat)](https://www.npmjs.com/package/dot-i18n)

## 流程

- 本地语言包放在 locales 中
- 业务中直接写文案，格式`#{文案}`
- webpack loader 打包或者编辑的时候把`#{xxx}`替换成对应的 locales 中的对应 key，如果不存在使用原值

- 有新增文案时需要重新更新 locales，更新的目的就是为新文案配置一个新的 key

- 导出为 excel 文件

## QA

- 输出#{文案}文案怎么处理？
- 文案中有变量怎么处理？
- 一词多意？
- 性能瓶颈？

## ref:

- 替换文本：https://blog.csdn.net/weixin_40073115/article/details/103594955
