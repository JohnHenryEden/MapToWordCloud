import MapToWordCloud from 'maptowordcloud'
 
let geojson = mapdata
// 图例示例
let wordcloudData = [
    ['中国', 30],
    ['zh', 28],
    ['cn', 26],
    ['zg', 24],
    ['lorem', 22],
    ['ipsum', 20],
    ['中国', 30],
    ['zh', 28],
    ['cn', 26],
    ['zg', 24],
    ['lorem', 22],
    ['ipsum', 20],
    ['中国', 30],
    ['zh', 28],
    ['cn', 26],
    ['zg', 24],
    ['lorem', 22],
    ['ipsum', 20],
    ['中国', 30],
    ['zh', 28],
    ['cn', 26],
    ['zg', 24],
    ['lorem', 22],
    ['ipsum', 20]
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
let mymap = L.map('mapid').setView([39.915085, 116.3683244], 2);
L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
}).addTo(mymap);
L.geoJSON(geojson).addTo(mymap)

MapToWordCloud(geojson.features[0], opt, 10).then(src => {
    document.getElementById('wordcloud').src = src
})