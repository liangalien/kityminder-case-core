KityMinder Core For Case
==========

## 简介

KityMinder 是一款强大的脑图可视化/编辑工具，由百度 FEX 团队开发并维护。

本仓库基于KityMinder，专门为测试用例定制：

* 新增启用、禁用功能
* 新增节点类型（用例要素：模块、用例、测试步骤、预期结果）
* 新增用例评审/执行状态（待定、通过、不通过、已解决/阻塞）
* 新增关联接口、需求、故障、评审问题
* 备注外显
* 修改一些样式
* data中新增排序字段index

## 界面预览
[![](https://github.com/liangalien/kityminder-case-core/blob/master/dist/demo.png?raw=true)](https://github.com/liangalien/kityminder-case-core/blob/master/dist/demo.png?raw=true)

## 使用

```bash
npm install kityminder-case-core
````

- 推荐与kityminder-case-react或kityminder-case-vue配套使用：
- [x] https://github.com/liangalien/kityminder-case-react
- [x] https://github.com/liangalien/kityminder-case-vue

## 开发

```bash
npm install
npm run dev
npm run build
```