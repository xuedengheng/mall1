/**
 * Created by Ben on 2017/5/23.
 */
! function() {
  function i(a) {
    return !!a.exifdata
  }

  function j(a, b) {
    var c, d, e, f, g;
    for (b = b || a.match(/^data\:([^\;]+)\;base64,/im)[1] || "", a = a.replace(/^data\:([^\;]+)\;base64,/gim, ""), c = atob(a), d = c.length, e = new ArrayBuffer(d), f = new Uint8Array(e), g = 0; d > g; g++) f[g] = c.charCodeAt(g);
    return e
  }

  function k(a, b) {
    var c = new XMLHttpRequest;
    c.open("GET", a, !0), c.responseType = "blob", c.onload = function() {
      (200 == this.status || 0 === this.status) && b(this.response)
    }, c.send()
  }

  function l(b, c) {
    function d(a) {
      var d = m(a),
        e = o(a);
      b.exifdata = d || {}, b.iptcdata = e || {}, c && c.call(b)
    }
    var e, f, g;
    b.src ? /^data\:/i.test(b.src) ? (e = j(b.src), d(e)) : /^blob\:/i.test(b.src) ? (f = new FileReader, f.onload = function(a) {
      d(a.target.result)
    }, k(b.src, function(a) {
      f.readAsArrayBuffer(a)
    })) : (g = new XMLHttpRequest, g.onload = function() {
      if (200 != this.status && 0 !== this.status) throw "Could not load image";
      d(g.response), g = null
    }, g.open("GET", b.src, !0), g.responseType = "arraybuffer", g.send(null)) : window.FileReader && (b instanceof window.Blob || b instanceof window.File) && (f = new FileReader, f.onload = function(b) {
        a && console.log("Got file of length " + b.target.result.byteLength), d(b.target.result)
      }, f.readAsArrayBuffer(b))
  }

  function m(b) {
    var f, d, e, c = new DataView(b);
    if (a && console.log("Got file of length " + b.byteLength), 255 != c.getUint8(0) || 216 != c.getUint8(1)) return a && console.log("Not a valid JPEG"), !1;
    for (d = 2, e = b.byteLength; e > d;) {
      if (255 != c.getUint8(d)) return a && console.log("Not a valid marker at offset " + d + ", found: " + c.getUint8(d)), !1;
      if (f = c.getUint8(d + 1), a && console.log(f), 225 == f) return a && console.log("Found 0xFFE1 marker"), u(c, d + 4, c.getUint16(d + 2) - 2);
      d += 2 + c.getUint16(d + 2)
    }
  }

  function o(b) {
    var d, e, f, g, h, i, c = new DataView(b);
    if (a && console.log("Got file of length " + b.byteLength), 255 != c.getUint8(0) || 216 != c.getUint8(1)) return a && console.log("Not a valid JPEG"), !1;
    for (d = 2, e = b.byteLength, f = function(a, b) {
      return 56 === a.getUint8(b) && 66 === a.getUint8(b + 1) && 73 === a.getUint8(b + 2) && 77 === a.getUint8(b + 3) && 4 === a.getUint8(b + 4) && 4 === a.getUint8(b + 5)
    }; e > d;) {
      if (f(c, d)) return g = c.getUint8(d + 7), 0 !== g % 2 && (g += 1), 0 === g && (g = 4), h = d + 8 + g, i = c.getUint16(d + 6 + g), q(b, h, i);
      d++
    }
  }

  function q(a, b, c) {
    for (var f, g, h, i, j, d = new DataView(a), e = {}, k = b; b + c > k;) 28 === d.getUint8(k) && 2 === d.getUint8(k + 1) && (i = d.getUint8(k + 2), i in p && (h = d.getInt16(k + 3), j = h + 5, g = p[i], f = t(d, k + 5, h), e.hasOwnProperty(g) ? e[g] instanceof Array ? e[g].push(f) : e[g] = [e[g], f] : e[g] = f)), k++;
    return e
  }

  function r(b, c, d, e, f) {
    var i, j, k, g = b.getUint16(d, !f),
      h = {};
    for (k = 0; g > k; k++) i = d + 12 * k + 2, j = e[b.getUint16(i, !f)], !j && a && console.log("Unknown tag: " + b.getUint16(i, !f)), h[j] = s(b, i, c, d, f);
    return h
  }

  function s(a, b, c, d, e) {
    var i, j, k, l, m, n, f = a.getUint16(b + 2, !e),
      g = a.getUint32(b + 4, !e),
      h = a.getUint32(b + 8, !e) + c;
    switch (f) {
      case 1:
      case 7:
        if (1 == g) return a.getUint8(b + 8, !e);
        for (i = g > 4 ? h : b + 8, j = [], l = 0; g > l; l++) j[l] = a.getUint8(i + l);
        return j;
      case 2:
        return i = g > 4 ? h : b + 8, t(a, i, g - 1);
      case 3:
        if (1 == g) return a.getUint16(b + 8, !e);
        for (i = g > 2 ? h : b + 8, j = [], l = 0; g > l; l++) j[l] = a.getUint16(i + 2 * l, !e);
        return j;
      case 4:
        if (1 == g) return a.getUint32(b + 8, !e);
        for (j = [], l = 0; g > l; l++) j[l] = a.getUint32(h + 4 * l, !e);
        return j;
      case 5:
        if (1 == g) return m = a.getUint32(h, !e), n = a.getUint32(h + 4, !e), k = new Number(m / n), k.numerator = m, k.denominator = n, k;
        for (j = [], l = 0; g > l; l++) m = a.getUint32(h + 8 * l, !e), n = a.getUint32(h + 4 + 8 * l, !e), j[l] = new Number(m / n), j[l].numerator = m, j[l].denominator = n;
        return j;
      case 9:
        if (1 == g) return a.getInt32(b + 8, !e);
        for (j = [], l = 0; g > l; l++) j[l] = a.getInt32(h + 4 * l, !e);
        return j;
      case 10:
        if (1 == g) return a.getInt32(h, !e) / a.getInt32(h + 4, !e);
        for (j = [], l = 0; g > l; l++) j[l] = a.getInt32(h + 8 * l, !e) / a.getInt32(h + 4 + 8 * l, !e);
        return j
    }
  }

  function t(a, b, c) {
    var d = "";
    for (n = b; b + c > n; n++) d += String.fromCharCode(a.getUint8(n));
    return d
  }

  function u(b, c) {
    var h, i, j, k, l, m, n;
    if ("Exif" != t(b, c, 4)) return a && console.log("Not valid EXIF data! " + t(b, c, 4)), !1;
    if (m = c + 6, 18761 == b.getUint16(m)) h = !1;
    else {
      if (19789 != b.getUint16(m)) return a && console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)"), !1;
      h = !0
    }
    if (42 != b.getUint16(m + 2, !h)) return a && console.log("Not valid TIFF data! (no 0x002A)"), !1;
    if (n = b.getUint32(m + 4, !h), 8 > n) return a && console.log("Not valid TIFF data! (First offset less than 8)", b.getUint32(m + 4, !h)), !1;
    if (i = r(b, m, m + n, e, h), i.ExifIFDPointer) {
      k = r(b, m, m + i.ExifIFDPointer, d, h);
      for (j in k) {
        switch (j) {
          case "LightSource":
          case "Flash":
          case "MeteringMode":
          case "ExposureProgram":
          case "SensingMethod":
          case "SceneCaptureType":
          case "SceneType":
          case "CustomRendered":
          case "WhiteBalance":
          case "GainControl":
          case "Contrast":
          case "Saturation":
          case "Sharpness":
          case "SubjectDistanceRange":
          case "FileSource":
            k[j] = g[j][k[j]];
            break;
          case "ExifVersion":
          case "FlashpixVersion":
            k[j] = String.fromCharCode(k[j][0], k[j][1], k[j][2], k[j][3]);
            break;
          case "ComponentsConfiguration":
            k[j] = g.Components[k[j][0]] + g.Components[k[j][1]] + g.Components[k[j][2]] + g.Components[k[j][3]]
        }
        i[j] = k[j]
      }
    }
    if (i.GPSInfoIFDPointer) {
      l = r(b, m, m + i.GPSInfoIFDPointer, f, h);
      for (j in l) {
        switch (j) {
          case "GPSVersionID":
            l[j] = l[j][0] + "." + l[j][1] + "." + l[j][2] + "." + l[j][3]
        }
        i[j] = l[j]
      }
    }
    return i
  }
  var d, e, f, g, p, a = !1,
    b = this,
    c = function(a) {
      return a instanceof c ? a : this instanceof c ? (this.EXIFwrapped = a, void 0) : new c(a)
    };
  "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = c), exports.EXIF = c) : b.EXIF = c, d = c.Tags = {
    36864: "ExifVersion",
    40960: "FlashpixVersion",
    40961: "ColorSpace",
    40962: "PixelXDimension",
    40963: "PixelYDimension",
    37121: "ComponentsConfiguration",
    37122: "CompressedBitsPerPixel",
    37500: "MakerNote",
    37510: "UserComment",
    40964: "RelatedSoundFile",
    36867: "DateTimeOriginal",
    36868: "DateTimeDigitized",
    37520: "SubsecTime",
    37521: "SubsecTimeOriginal",
    37522: "SubsecTimeDigitized",
    33434: "ExposureTime",
    33437: "FNumber",
    34850: "ExposureProgram",
    34852: "SpectralSensitivity",
    34855: "ISOSpeedRatings",
    34856: "OECF",
    37377: "ShutterSpeedValue",
    37378: "ApertureValue",
    37379: "BrightnessValue",
    37380: "ExposureBias",
    37381: "MaxApertureValue",
    37382: "SubjectDistance",
    37383: "MeteringMode",
    37384: "LightSource",
    37385: "Flash",
    37396: "SubjectArea",
    37386: "FocalLength",
    41483: "FlashEnergy",
    41484: "SpatialFrequencyResponse",
    41486: "FocalPlaneXResolution",
    41487: "FocalPlaneYResolution",
    41488: "FocalPlaneResolutionUnit",
    41492: "SubjectLocation",
    41493: "ExposureIndex",
    41495: "SensingMethod",
    41728: "FileSource",
    41729: "SceneType",
    41730: "CFAPattern",
    41985: "CustomRendered",
    41986: "ExposureMode",
    41987: "WhiteBalance",
    41988: "DigitalZoomRation",
    41989: "FocalLengthIn35mmFilm",
    41990: "SceneCaptureType",
    41991: "GainControl",
    41992: "Contrast",
    41993: "Saturation",
    41994: "Sharpness",
    41995: "DeviceSettingDescription",
    41996: "SubjectDistanceRange",
    40965: "InteroperabilityIFDPointer",
    42016: "ImageUniqueID"
  }, e = c.TiffTags = {
    256: "ImageWidth",
    257: "ImageHeight",
    34665: "ExifIFDPointer",
    34853: "GPSInfoIFDPointer",
    40965: "InteroperabilityIFDPointer",
    258: "BitsPerSample",
    259: "Compression",
    262: "PhotometricInterpretation",
    274: "Orientation",
    277: "SamplesPerPixel",
    284: "PlanarConfiguration",
    530: "YCbCrSubSampling",
    531: "YCbCrPositioning",
    282: "XResolution",
    283: "YResolution",
    296: "ResolutionUnit",
    273: "StripOffsets",
    278: "RowsPerStrip",
    279: "StripByteCounts",
    513: "JPEGInterchangeFormat",
    514: "JPEGInterchangeFormatLength",
    301: "TransferFunction",
    318: "WhitePoint",
    319: "PrimaryChromaticities",
    529: "YCbCrCoefficients",
    532: "ReferenceBlackWhite",
    306: "DateTime",
    270: "ImageDescription",
    271: "Make",
    272: "Model",
    305: "Software",
    315: "Artist",
    33432: "Copyright"
  }, f = c.GPSTags = {
    0: "GPSVersionID",
    1: "GPSLatitudeRef",
    2: "GPSLatitude",
    3: "GPSLongitudeRef",
    4: "GPSLongitude",
    5: "GPSAltitudeRef",
    6: "GPSAltitude",
    7: "GPSTimeStamp",
    8: "GPSSatellites",
    9: "GPSStatus",
    10: "GPSMeasureMode",
    11: "GPSDOP",
    12: "GPSSpeedRef",
    13: "GPSSpeed",
    14: "GPSTrackRef",
    15: "GPSTrack",
    16: "GPSImgDirectionRef",
    17: "GPSImgDirection",
    18: "GPSMapDatum",
    19: "GPSDestLatitudeRef",
    20: "GPSDestLatitude",
    21: "GPSDestLongitudeRef",
    22: "GPSDestLongitude",
    23: "GPSDestBearingRef",
    24: "GPSDestBearing",
    25: "GPSDestDistanceRef",
    26: "GPSDestDistance",
    27: "GPSProcessingMethod",
    28: "GPSAreaInformation",
    29: "GPSDateStamp",
    30: "GPSDifferential"
  }, g = c.StringValues = {
    ExposureProgram: {
      0: "Not defined",
      1: "Manual",
      2: "Normal program",
      3: "Aperture priority",
      4: "Shutter priority",
      5: "Creative program",
      6: "Action program",
      7: "Portrait mode",
      8: "Landscape mode"
    },
    MeteringMode: {
      0: "Unknown",
      1: "Average",
      2: "CenterWeightedAverage",
      3: "Spot",
      4: "MultiSpot",
      5: "Pattern",
      6: "Partial",
      255: "Other"
    },
    LightSource: {
      0: "Unknown",
      1: "Daylight",
      2: "Fluorescent",
      3: "Tungsten (incandescent light)",
      4: "Flash",
      9: "Fine weather",
      10: "Cloudy weather",
      11: "Shade",
      12: "Daylight fluorescent (D 5700 - 7100K)",
      13: "Day white fluorescent (N 4600 - 5400K)",
      14: "Cool white fluorescent (W 3900 - 4500K)",
      15: "White fluorescent (WW 3200 - 3700K)",
      17: "Standard light A",
      18: "Standard light B",
      19: "Standard light C",
      20: "D55",
      21: "D65",
      22: "D75",
      23: "D50",
      24: "ISO studio tungsten",
      255: "Other"
    },
    Flash: {
      0: "Flash did not fire",
      1: "Flash fired",
      5: "Strobe return light not detected",
      7: "Strobe return light detected",
      9: "Flash fired, compulsory flash mode",
      13: "Flash fired, compulsory flash mode, return light not detected",
      15: "Flash fired, compulsory flash mode, return light detected",
      16: "Flash did not fire, compulsory flash mode",
      24: "Flash did not fire, auto mode",
      25: "Flash fired, auto mode",
      29: "Flash fired, auto mode, return light not detected",
      31: "Flash fired, auto mode, return light detected",
      32: "No flash function",
      65: "Flash fired, red-eye reduction mode",
      69: "Flash fired, red-eye reduction mode, return light not detected",
      71: "Flash fired, red-eye reduction mode, return light detected",
      73: "Flash fired, compulsory flash mode, red-eye reduction mode",
      77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
      79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
      89: "Flash fired, auto mode, red-eye reduction mode",
      93: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
      95: "Flash fired, auto mode, return light detected, red-eye reduction mode"
    },
    SensingMethod: {
      1: "Not defined",
      2: "One-chip color area sensor",
      3: "Two-chip color area sensor",
      4: "Three-chip color area sensor",
      5: "Color sequential area sensor",
      7: "Trilinear sensor",
      8: "Color sequential linear sensor"
    },
    SceneCaptureType: {
      0: "Standard",
      1: "Landscape",
      2: "Portrait",
      3: "Night scene"
    },
    SceneType: {
      1: "Directly photographed"
    },
    CustomRendered: {
      0: "Normal process",
      1: "Custom process"
    },
    WhiteBalance: {
      0: "Auto white balance",
      1: "Manual white balance"
    },
    GainControl: {
      0: "None",
      1: "Low gain up",
      2: "High gain up",
      3: "Low gain down",
      4: "High gain down"
    },
    Contrast: {
      0: "Normal",
      1: "Soft",
      2: "Hard"
    },
    Saturation: {
      0: "Normal",
      1: "Low saturation",
      2: "High saturation"
    },
    Sharpness: {
      0: "Normal",
      1: "Soft",
      2: "Hard"
    },
    SubjectDistanceRange: {
      0: "Unknown",
      1: "Macro",
      2: "Close view",
      3: "Distant view"
    },
    FileSource: {
      3: "DSC"
    },
    Components: {
      0: "",
      1: "Y",
      2: "Cb",
      3: "Cr",
      4: "R",
      5: "G",
      6: "B"
    }
  }, p = {
    120: "caption",
    110: "credit",
    25: "keywords",
    55: "dateCreated",
    80: "byline",
    85: "bylineTitle",
    122: "captionWriter",
    105: "headline",
    116: "copyright",
    15: "category"
  }, c.getData = function(a, b) {
    return (a instanceof Image || a instanceof HTMLImageElement) && !a.complete ? !1 : (i(a) ? b && b.call(a) : l(a, b), !0)
  }, c.getTag = function(a, b) {
    return i(a) ? a.exifdata[b] : void 0
  }, c.getAllTags = function(a) {
    if (!i(a)) return {};
    var b, c = a.exifdata,
      d = {};
    for (b in c) c.hasOwnProperty(b) && (d[b] = c[b]);
    return d
  }, c.pretty = function(a) {
    if (!i(a)) return "";
    var b, c = a.exifdata,
      d = "";
    for (b in c) c.hasOwnProperty(b) && (d += "object" == typeof c[b] ? c[b] instanceof Number ? b + " : " + c[b] + " [" + c[b].numerator + "/" + c[b].denominator + "]\r\n" : b + " : [" + c[b].length + " values]\r\n" : b + " : " + c[b] + "\r\n");
    return d
  }, c.readFromBinaryFile = function(a) {
    return m(a)
  }, "function" == typeof define && define.amd && define("exif-js", [], function() {
    return c
  })
}.call(this);
