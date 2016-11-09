#自定义echarts封装方法

##新增全局参数window.setMapList
```javascript
setMapList有3个值pos,x,y
pos是当前绘制图形的中心位置
x,y为当前绘制地图的高宽,将不规则图形转换为矩形
```

###1、地图篇：
```javascript
mapHide属性：为true跳过地图，直接绘制非地图内容
markPoint标注中：overlapMap新属性和symbolPosition新属性
```

```javascript
overlapMap为true证明你将要使用坐标来绘制，为false或者不传参默认使用经纬度绘制
overlapMap为true会默认去判断你当前坐标是否在其绘制范围内
mapType属性新增2个参数chinaShadow和cityShadow
chinaShadow是当前绘制地图为中国地图的阴影
cityShadow是当前绘制地图为非中国地图的阴影
boxShadow为true时可不用传cityShadow会默认这个值
boxShadowColor属性:地图阴影的颜色
```

```javascript
symbolPosition为bottom时图片会相对于底部对其向上缩放
symbolSize[w,h]的值控制第一个数字是宽，第二个数字是高
```

