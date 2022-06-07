---
nav:
  title: components-ty
  order: 1
  path: /components-ty
title: os-actions-create
group:
  title: actions
  path: /components/actions
---

# os-actions-create

## 代码演示

### 基础使用

创建操作，内部包含了一个表单组件，部分表单 api 接口选择性透出

根据通用场景，默认状态封装为一个拟态框，可以通过设置 `type: plain` 进行切换

<code src="../demos/actions/create/simple.tsx" />

### 编辑记录本地持久化

`enablePersistence` 开启后，用户输入将在本地进行持久化保存，下次打开弹窗将默认恢复表单值

<code src="../demos/actions/create/local.tsx" />

### 创建模板管理

`enableTemplate` 开启后，将可以进行多套表单值持久化，并且通过相关接口实现网络存储

应用模板后，将先重置表单，再重新赋值

<code src="../demos/actions/create/template.tsx" />

### 平铺展示

设置 `type: plain` 将直接展示表单，默认为弹出形式

<code src="../demos/actions/create/plain.tsx" />

<API exports='["ActionsCreateSettings", "ActionsCreateRequests"]' src="../actions/create/index.tsx"></API>
