import EXIF from './exif'

const QUALITY = 60

window.URL = window.URL || window.webkitURL

let imgUrl = null

function string2ArrayBuffer(string) {
  var bytes = Array.prototype.map.call(string, function (c) {
    return c.charCodeAt(0) & 0xff
  })
  return new Uint8Array(bytes).buffer
}

function newBlob(data, datatype) {
  var out
  try {
    out = new Blob([data], { type: datatype })
  } catch (e) {
    window.BlobBuilder = window.BlobBuilder ||
      window.WebKitBlobBuilder ||
      window.MozBlobBuilder ||
      window.MSBlobBuilder

    if (e.name == 'TypeError' && window.BlobBuilder) {
      var bb = new BlobBuilder()
      bb.append(data)
      out = bb.getBlob(datatype)
    } else if (e.name == 'InvalidStateError') {
      out = new Blob([data], { type: datatype })
    } else {
      throw new Error('Your browser does not support Blob & BlobBuilder!')
    }
  }
  return out
}

function dataURL2Blob(dataURI) {
  var byteStr
  var intArray
  var ab
  var i
  var mimetype
  var parts

  parts = dataURI.split(',')
  parts[1] = parts[1].replace(/\s/g, '')

  if (~parts[0].indexOf('base64')) {
    byteStr = atob(parts[1])
  } else {
    byteStr = decodeURIComponent(parts[1])
  }

  ab = new ArrayBuffer(byteStr.length)
  intArray = new Uint8Array(ab)

  for (i = 0; i < byteStr.length; i++) {
    intArray[i] = byteStr.charCodeAt(i)
  }

  mimetype = parts[0].split(':')[1].split(';')[0]

  return new newBlob(ab, mimetype)
}

const getImg = (file) => {
  return {
    file: file,
    size: file.size,
    fileName: file.name,
    fileType: file.type || 'image/' + file.name.substr(file.name.lastIndexOf('.') + 1)
  }
}

const compressByCanvas = (url, fileObj, success, fail) => {
  let image = new Image()
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')
  let compressedImageDataURL = null
  let compressedImageBlob = null

  image.addEventListener('load', function() {
    EXIF.getData(image, function() {
      const allMetaData = EXIF.getAllTags(this)
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      ctx.save()
      let width  = canvas.width
      let styleWidth  = canvas.style.width
      let height = canvas.height
      let styleHeight = canvas.style.height
      if (allMetaData.Orientation) {
        if (allMetaData.Orientation > 4) {
          canvas.width  = height
          canvas.style.width  = styleHeight
          canvas.height = width
          canvas.style.height = styleWidth
        }
        switch (allMetaData.Orientation) {
          case 2:
            // horizontal flip
            ctx.translate(width, 0)
            ctx.scale(-1, 1)
            break
          case 3:
            // 180° rotate left
            ctx.translate(width, height)
            ctx.rotate(Math.PI)
            break;
          case 4:
            // vertical flip
            ctx.translate(0, height)
            ctx.scale(1, -1)
            break;
          case 5:
            // vertical flip + 90 rotate right
            ctx.rotate(0.5 * Math.PI)
            ctx.scale(1, -1)
            break
          case 6:
            // 90° rotate right
            ctx.rotate(0.5 * Math.PI)
            ctx.translate(0, -height)
            break
          case 7:
            // horizontal flip + 90 rotate right
            ctx.rotate(0.5 * Math.PI)
            ctx.translate(width, -height)
            ctx.scale(-1, 1)
            break
          case 8:
            // 90° rotate left
            ctx.rotate(-0.5 * Math.PI)
            ctx.translate(-width, 0)
            break
        }
      }
      ctx.drawImage(image, 0, 0)
      ctx.restore()
      compressedImageDataURL = canvas.toDataURL(fileObj.fileType, QUALITY / 100)
      compressedImageBlob = dataURL2Blob(compressedImageDataURL)
      if (compressedImageBlob.size > fileObj.size) {
        fail && fail()
      } else {
        success && success(compressedImageDataURL)
      }
    })
  })

  image.addEventListener('error', function () {
    alert('Image load error')
  })

  image.src = url
}

export const compressImg = (file, success, fail) => {
  const boundary = 'NGFileboundary'
  const fileObj = getImg(file)
  let contentType = ''
  if (imgUrl) {
    window.URL.revokeObjectURL(imgUrl)
  }
  imgUrl = window.URL.createObjectURL(file)
  compressByCanvas(imgUrl, fileObj,
    (compressedImageDataURL) => {
      const pureBase64ImageData = compressedImageDataURL.replace(/^data:(image\/.+);base64,/, ($0, $1) => {
        contentType = $1
        return ''
      })
      const binaryString = atob(pureBase64ImageData)
      const multipartString = [
        '--' + boundary,
        'Content-Disposition: form-data; name="file"; filename="' + (fileObj.fileName || 'blob') + '"',
        'Content-Type: ' + contentType,
        '', binaryString,
        '--' + boundary + '--', ''
      ].join('\r\n')
      const arrayBuffer = string2ArrayBuffer(multipartString)
      success && success(arrayBuffer)
    },
    () => {
      fail && fail()
    }
  )
}
