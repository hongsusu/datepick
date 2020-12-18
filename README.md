# B 端拖拽日历组件

> Vue.js 2.x B端拖拽日历组件。

## 安装

```
$ yarn add wkdatepick
```

## B 端拖拽日历组件

```` html
<wk-datepick @dateChange="curDate" :curDateList="dateList"/>
````


## API

### 属性

|参数|说明|类型|是否必填|默认值|
|---|----|---|-------|-----|
|curDateList|用于回显的选中数据|Array|否|\[xSummarylist: \'03:00-04:00',xlist: \[ {sid:'seaty7x7',x:'03:00 - 03:30'},{sid:'seaty7x7',x:'03:30 - 04:00'}] ,y: '星期日', yvalue:6\]|

### 方法

|事件名|说明|返回值|
|---|------|-----|
|dateChange|当前选中日期|--|


## 需要的环境

- node.js >= 9.0.0
- npm >= 5.0.0

## 样式采用less

