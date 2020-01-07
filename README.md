# MapToWordCloud
----
地图GeoJson多边形数据转相似形状词云图片

## 1 安装
```
npm install maptowordcloud --save
```

## 2 使用
```js
let geojson = geojson// 单个多边形的geojson数据
let wordcloudData = let wordcloudData = [
    ['la', 30],
    ['li', 28],
    ['lu', 26],
    ['le', 24],
    ['lo', 22],
    ['la', 20]
]
let opt = {
    list: wordcloudData,
    gridSize: 4,
    weightFactor: 1,
    fontFamily: 'serif',
    color: 'random-light',
    backgroundColor: 'rgba(0,0,0,0.0)',
    rotateRatio: 0.3,
    rotationSteps: 3,
    wait: 0
}
MapToWordCloud(geojson.features[0], opt, 10).then(src => {
    document.getElementById('wordcloud').src = src
})
```

## 3 目前待解决问题
1. 最后生成的图片无法与原图形非常贴合
2. 生成的图片大小不一，空白区域多
3. 无法很好应对奇形怪状的多边形，因为用的wordcloud2.js的shape

## 4 示例
在demo文件夹下，运行`npm install`, `npm run dev`, 打开页面`localhost:8080`可看效果