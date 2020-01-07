import wc from 'wordcloud'
/**
 * MapToWordCloud
 * author @JohnHenryEden
 * date 2020/1/2
 */

/**
 * 根据GeoJson多边形数据生成词云图片 Generate Wordcloud Image By GeoJson Polygon Data
 * @param {Object} geojson geojson格式地图数据，单个多边形要素，只允许一个多边形 GeoJson which only have one polygon feature
 * @param {object} opt 参考wordcloud2.js，不要设置shape，会被覆盖 wordcloud2.js wordcloud configuration
 * @param {Array} magnitude 乘数大小，决定地图图像大小，配合不同级别的多边形，全球级别的需要小一点，城市级别的需要大一点 Magnitude number to decide the size of image. Needs to be small in a global scale, and large in a city scale.
 */ 
export default function mapToWordCloud(geojson, opt, magnitude)  {
  // 1：将多边形转化为图片
  let leftmost = null
  let topmost = null
  let rightmost = null
  let bottommost = null
  let coordinates = geojson.geometry.coordinates[0]
  leftmost = coordinates[0][0]
  topmost = coordinates[0][1]

  for (let index = 0; index < coordinates.length; index++) {
    const nextCoordinate = coordinates[index]
    if (leftmost > nextCoordinate[0]) {
      leftmost = nextCoordinate[0]
    }
    if (topmost < nextCoordinate[1]) {
      topmost = nextCoordinate[1]
    }
  }

  let distances = []
  coordinates.forEach(coordinate => {
    let distance = {
      x: 0,
      y: 0
    }
    distance.x = Math.abs(coordinate[0] - leftmost) * magnitude
    distance.y = Math.abs(coordinate[1] - topmost) * magnitude
    distances.push(distance)
  })

  rightmost = distances[0].x
  bottommost = distances[0].y
  distances.forEach(distance => {
    if (rightmost < distance.x) {
      rightmost = distance.x
    }
    if (bottommost < distance.y) {
      bottommost = distance.y
    }
  })

  let canvas = document.createElement('canvas')
  canvas.width = rightmost
  canvas.height = bottommost
  let ctx = canvas.getContext('2d')
  ctx.beginPath()
  ctx.moveTo(distances[0].x, distances[0].y)
  distances.forEach(distance => {
    ctx.lineTo(distance.x, distance.y)
  })
  ctx.fill()
  let image = new Image()
  image.src = canvas.toDataURL('image/png')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 2：使用第三方工具根据图片和数据生成词云图片
  
  return new Promise(function (resolve, reject) {
    image.onload = function () {
      let functionBody = readPixels(image)
      let shapeFunc = new Function('theta', functionBody)
      opt.shape = shapeFunc
      wc(canvas, opt)

      canvas.addEventListener('wordcloudstop', function () {
        // 3：创建词云图片primitive对象，并返回，供外部添加
        if (canvas) {
          resolve(canvas.toDataURL('image/png'))
        } else {
          reject(new Error('Wordcloud generation failed.'))
        }
      })
    }
  })
}



// 工具方法 按照一定的算法生成词云图片形状。图片需要是只有黑白两色，现在由代码可自动生成
function readPixels (img) {
  let canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height

  let ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)

  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  let width = canvas.width

  let o = [(img.width / 2) | 0, (img.height / 2) | 0]
  let d = []

  // paint red on the center pixel (not really visible)
  imageData.data[(o[1] * width + o[0]) * 4] = 254

  for (let theta = 0; theta < 2 * Math.PI; theta += 0.01) {
    let dx = 1 * Math.cos(theta)
    let dy = -1 * Math.sin(theta)
    let i = 0

    let x = o[0]
    let y = o[1]
    let intX = x
    let intY = y
    while (true) {
      x += dx
      y += dy

      intX = x | 0
      intY = y | 0

      if (intY < 0 || intY > canvas.height || intX < 0 || intX > width) {
        break
      }

      let ptr = (intY * width + intX) * 4
      let tone = imageData.data[ptr] +
                    imageData.data[ptr + 1] +
                    imageData.data[ptr + 2]
      let alpha = imageData.data[ptr + 3]

      // draw a green line all the way until the boundary
      imageData.data[ptr] = 0 // R
      imageData.data[ptr + 1] = 254 // G
      imageData.data[ptr + 2] = 0 // B
      imageData.data[ptr + 3] = 254

      // are we there at the boundary?
      if (alpha < 128 || tone > 128 * 3) {
        d.push(i)
        break
      } else {
        i++
      }
    }
  }

  ctx.putImageData(imageData, 0, 0)

  let max = d.reduce(function (prev, curr) {
    return Math.max(prev, curr)
  })

  let resultText =
            '  let max = ' + max + ';\n' +
            '  let leng = ' + JSON.stringify(d) + ';\n\n' +
            '  return leng[(theta / (2 * Math.PI)) * leng.length | 0] / max;\n'
  return resultText
}
