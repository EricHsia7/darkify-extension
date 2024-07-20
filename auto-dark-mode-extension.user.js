// ==UserScript==
// @name         Auto Dark Mode
// @version      0.0.5
// @description  Darken any website
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @author       erichsia7
// @inject-into  content
// @updateURL    https://erichsia7.github.io/auto-dark-mode-extension/auto-dark-mode-extension.user.js
// @downloadURL  https://erichsia7.github.io/auto-dark-mode-extension/auto-dark-mode-extension.user.js
// @match        *://*/*
// @exclude      *://*.google.com/*
// @exclude      *://*.youtube.com/*
// ==/UserScript==
var autoDarkMode;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 151:
/***/ ((module) => {

var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;


/***/ }),

/***/ 939:
/***/ ((module) => {

(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();


/***/ }),

/***/ 206:
/***/ ((module) => {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ 503:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

(function(){
  var crypt = __webpack_require__(939),
      utf8 = (__webpack_require__(151).utf8),
      isBuffer = __webpack_require__(206),
      bin = (__webpack_require__(151).bin),

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message) && message.constructor !== Uint8Array)
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if (message === undefined || message === null)
      throw new Error('Illegal argument ' + message);

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src)
});

;// CONCATENATED MODULE: ./src/core/index.ts
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var md5 = __webpack_require__(503);
function rgbToHsl(color) {
  var r = color.r / 255;
  var g = color.g / 255;
  var b = color.b / 255;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: h,
    s: s,
    l: l
  };
}
function isGray(color) {
  var _rgbToHsl = rgbToHsl(color),
    s = _rgbToHsl.s;
  return s <= 0.38;
}
function rgbToHex(color) {
  var r = color.r;
  var g = color.g;
  var b = color.b;
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}
function rgbaToHex(color) {
  var r = color.r;
  var g = color.g;
  var b = color.b;
  var a = Math.round(color.a * 255);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase() + alpha.toString(16).padStart(2, '0').toUpperCase();
}
function invertRGB(color) {
  var r = 255 - color.r;
  var g = 255 - color.g;
  var b = 255 - color.b;
  return isGray(color) ? {
    r: r,
    g: g,
    b: b
  } : color;
}
function darkenRGB(color, percent) {
  var r = Math.floor(color.r * (1 - percent / 100));
  var g = Math.floor(color.g * (1 - percent / 100));
  var b = Math.floor(color.b * (1 - percent / 100));
  return {
    r: r,
    g: g,
    b: b
  };
}
function getColorInRGBA(element, property) {
  var style = getComputedStyle(element);
  var color = style.getPropertyValue(property).trim();

  // Function to resolve CSS variables
  function resolveCSSVariable(value) {
    if (value.startsWith('var(')) {
      var variableName = value.slice(4, -1).trim();
      var resolvedValue = style.getPropertyValue(variableName).trim();
      if (resolvedValue.startsWith('var(')) {
        return resolveCSSVariable(resolvedValue); // Recursively resolve nested variables
      }
      return resolvedValue;
    }
    return value;
  }

  // Resolve CSS variable if present
  color = resolveCSSVariable(color);
  function hexToRGBA(hex) {
    var r, g, b;
    if (hex.length === 4) {
      // #fff
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      // #ffffff
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    } else {
      throw new Error('Invalid hex format');
    }
    return {
      r: r,
      g: g,
      b: b,
      a: 1
    };
  }
  function rgbStringToRGBA(rgb) {
    var match = rgb.match(/rgba?\((\d+), (\d+), (\d+)(?:, (\d+\.?\d*))?\)/);
    if (!match) throw new Error('Invalid RGB/RGBA format');
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
      a: match[4] ? parseFloat(match[4]) : 1
    };
  }
  function nameToRGBA(name) {
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = name;
    var computedColor = ctx.fillStyle; // Now it’s in rgb format
    return rgbStringToRGBA(computedColor);
  }
  if (color === 'transparent') {
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 0
    };
  } else if (color.startsWith('rgb')) {
    return rgbStringToRGBA(color);
  } else if (color.startsWith('#')) {
    return hexToRGBA(color);
  } else {
    // Assume it's a color name
    return nameToRGBA(color);
  }
}
function getColorRelatedProperties(element) {
  var result = {};
  var list = ['color', 'background-color', 'border-top-color', 'border-bottom-color', 'border-right-color', 'border-left-color', 'outline-color', 'text-decoration-color'];
  var totalR = 0;
  var totalG = 0;
  var totalB = 0;
  var totalA = 0;
  for (var _i = 0, _list = list; _i < _list.length; _i++) {
    var property = _list[_i];
    result[property] = getColorInRGBA(element, property);
    totalR += result[property].r;
    totalG += result[property].g;
    totalB += result[property].b;
    totalA += result[property].a;
  }
  var averageR = totalR / list.length;
  var averageG = totalG / list.length;
  var averageB = totalB / list.length;
  var averageA = totalA / list.length;
  result['average'] = {
    r: averageR,
    g: averageG,
    b: averageB,
    a: averageA
  };
  return result;
}
function invertProperties(properties) {
  var result = {};
  for (var key in properties) {
    var property = properties[key];
    result[key] = Object.assign(invertRGB({
      r: property.r,
      g: property.g,
      b: property.b
    }), {
      a: property.a
    });
  }
  return result;
}
function propertiesToStyle(selector, properties) {
  var lines = [];
  for (var key in properties) {
    var property = properties[key];
    lines.push("".concat(key, ": rgba(").concat(property.r, ", ").concat(property.g, ", ").concat(property.b, ", ").concat(property.a, ")"));
  }
  return "".concat(selector, " {").concat(lines.join(';'), "}");
}
function getDarkModeStyle() {
  var style = [];
  var elements = document.querySelectorAll('body *,body');
  var _iterator = _createForOfIteratorHelper(elements),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var element = _step.value;
      var identifier = "i-".concat(md5(Math.random() * new Date().getTime()));
      element.setAttribute('auto-dark-mode-extension', identifier);
      var invertedProperties = invertProperties(getColorRelatedProperties(element));
      style.push(propertiesToStyle("".concat(String(element.tagName).toLowerCase(), "[auto-dark-mode-extension=\"").concat(identifier, "\"]"), invertedProperties));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return style.join(' ');
}
;// CONCATENATED MODULE: ./src/interface/index.css
/* harmony default export */ const src_interface = (".autoDarkModeTransitionMask {\n  width: 43px;\n  height: 43px;\n  position: fixed;\n  bottom: 12px;\n  left: 12px;\n  border-radius: 100%;\n  background-color: var(--d-transparent);\n  z-index: 999;\n  user-select: none;\n  -webkit-user-select: none;\n  opacity: 0;\n  outline: none;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  -webkit-mask-image: -webkit-radial-gradient(white, black);\n  mask-image: -webkit-radial-gradient(white, black);\n  transform: scale(1);\n  backdrop-filter: invert(1) !important;\n  -webkit-backdrop-filter: invert(1) !important;\n}\n\n.autoDarkModeTransitionMask.autoDarkModeTransitioning {\n  animation-duration: 600ms;\n  animation-name: transitioning-opacity, transitioning-zoom;\n  animation-iteration-count: forward;\n  animation-timing-function: ease-in-out;\n}\n\n.autoDarkModeTransitionMask.autoDarkModeFadeOut {\n  animation-duration: 500ms;\n  animation-name: transitioning-opacity;\n  animation-iteration-count: forward;\n  animation-timing-function: ease-out;\n  animation-direction: reverse;\n}\n\n@keyframes transitioning-opacity {\n  0% {\n    opacity: 0;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\n.autoDarkModeButton {\n  width: 43px;\n  height: 43px;\n  position: fixed;\n  bottom: 12px;\n  left: 12px;\n  border-radius: 100%;\n  background-color: var(--d-button-color);\n  z-index: 1000;\n  user-select: none;\n  -webkit-user-select: none;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}");
;// CONCATENATED MODULE: ./src/interface/theme.css
/* harmony default export */ const theme = (":root {\n  --d-background-color: rgba(255, 255, 255, 0.45);\n  --d-button-color: #ffffff;\n  --d-text-color: #333333;\n  --d-transparent: rgba(0, 0, 0, 0);\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --d-background-color: rgba(0, 0, 0, 0.45);\n    --d-button-color: #333333;\n    --d-text-color: #ffffff;\n    --d-url-color: #d2d2d2;\n  }\n}");
;// CONCATENATED MODULE: ./src/interface/index.ts



var interface_md5 = __webpack_require__(503);
function initializeCSS() {
  //load css
  var themeLoader = document.createElement('style');
  themeLoader.innerHTML = theme;
  document.body.appendChild(themeLoader);
  var styleLoader = document.createElement('style');
  styleLoader.innerHTML = src_interface;
  document.body.appendChild(styleLoader);
}
function initializeButton() {
  //add button
  var button = document.createElement('div');
  button.classList.add('autoDarkModeButton');
  button.addEventListener('click', function (event) {
    event.preventDefault();
    turnOnDarkMode();
  });
  document.body.appendChild(button);
}
function initializeMask() {
  var mask = document.createElement('div');
  mask.classList.add('autoDarkModeTransitionMask');
  document.body.appendChild(mask);
}
function getTransitionKeyframes() {
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var radius = 43 / 2;
  var centerX = 12 + radius;
  var centerY = windowHeight - (12 + radius);
  var cornerX = windowWidth + 20;
  var cornerY = -20;
  var scale = Math.sqrt(Math.pow(cornerX - centerX, 2) + Math.pow(cornerY - centerY, 2)) / radius;
  var keyframes = "@keyframes transitioning-zoom { 0% {transform: scale(1);} 100% {transform: scale(".concat(scale, ");}}");
  return keyframes;
}
function turnOnDarkMode() {
  var sessionID = "d_".concat(interface_md5(Math.random() * new Date().getTime()));
  var keyframesLoader = document.createElement('style');
  keyframesLoader.id = "".concat(sessionID, "_keyframes");
  keyframesLoader.innerHTML = getTransitionKeyframes();
  document.body.appendChild(keyframesLoader);
  var transitionMask = document.querySelector('.autoDarkModeTransitionMask');
  transitionMask.classList.add('autoDarkModeTransitioning');
  transitionMask.addEventListener('animationend', function (e) {
    document.querySelector("style#".concat(sessionID, "_keyframes")).remove();
    transitionMask.classList.remove('autoDarkModeTransitioning');
    var styleLoader = document.createElement('style');
    styleLoader.innerHTML = getDarkModeStyle();
    document.body.appendChild(styleLoader);
  }, {
    once: true
  });
}
function turnOffDarkMode() {
  var autoDarkModeTransitionMaskElement = document.querySelector('.autoDarkModeTransitionMask');
  autoDarkModeTransitionMaskElement.setAttribute('displayed', 'false');
}
;// CONCATENATED MODULE: ./src/index.ts

function initialize() {
  initializeCSS();
  initializeButton();
  initializeMask();
}
var autoDarkMode = {
  initialize: initialize
};
autoDarkMode.initialize();
/* harmony default export */ const src = (autoDarkMode);
})();

autoDarkMode = __webpack_exports__["default"];
/******/ })()
;