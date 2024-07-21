// ==UserScript==
// @name         Darkify
// @version      0.2.9
// @description  Darkify Any Website
// @run-at       document-end
// @author       erichsia7
// @inject-into  content
// @updateURL    https://erichsia7.github.io/darkify-extension/darkify-extension.user.js
// @downloadURL  https://erichsia7.github.io/darkify-extension/darkify-extension.user.js
// @match        *://*/*
// @exclude      *://*.google.com/*
// @exclude      *://*.youtube.com/*
// @exclude      *://github.*/*
// ==/UserScript==
var darkify;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
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
// This entry need to be wrapped in an IIFE because it declares 'darkify' on top-level, which conflicts with the current library output.
(() => {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src)
});

;// CONCATENATED MODULE: ./src/tools/index.ts
function generateID(prefix) {
  var result = '';
  var len = 10;
  var bulk = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var bulkLen = bulk.length;
  for (var i = 0; i < len; i++) {
    var randomNumber = Math.round(Math.random() * bulkLen);
    result += bulk.substring(randomNumber, randomNumber + 1);
  }
  result = prefix + result;
  return result;
}
;// CONCATENATED MODULE: ./src/core/index.ts
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }

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
function needToInvert(color) {
  var hsl = rgbToHsl(color);
  if (hsl.s <= 0.38) {
    return true;
  } else {
    if (hsl.l <= 0.23) {
      return true;
    }
  }
  return false;
}
function invertRGB(color) {
  var r = 255 - color.r;
  var g = 255 - color.g;
  var b = 255 - color.b;
  return needToInvert(color) ? {
    type: 'color',
    r: r,
    g: g,
    b: b
  } : color;
}
function invertRGBA(color) {
  var r = 255 - color.r;
  var g = 255 - color.g;
  var b = 255 - color.b;
  var a = color.a;
  return needToInvert({
    type: 'color',
    r: color.r,
    g: color.g,
    b: color.b
  }) ? {
    type: 'color',
    r: r,
    g: g,
    b: b,
    a: a
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
      type: 'color',
      r: r,
      g: g,
      b: b,
      a: 1
    };
  }
  function rgbStringToRGBA(rgb) {
    var match = rgb.match(/rgba?\((\d+),\s{0,}(\d+),\s{0,}(\d+)(?:,\s{0,}(\d+\.?\d*))?\)/);
    if (!match) throw new Error("Invalid RGB/RGBA format: ".concat(rgb));
    return {
      type: 'color',
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
  function parseGradient(gradient) {
    var linearGradientRegex = /^linear-gradient\((.*)\)$/;
    var radialGradientRegex = /^radial-gradient\((.*)\)$/;
    var conicGradientRegex = /^conic-gradient\((.*)\)$/;
    function parseColorStops(parts) {
      var colorStops = [];
      parts.forEach(function (part) {
        var matches2 = part.trim().match(positionRegex);
        if (matches2) {
          var color = getColorInRGBAFromString(part.trim().replace(positionRegex, '').trim());
          var position = matches2[0].trim();
          colorStops.push({
            type: 'color-stop',
            color: color,
            position: position
          });
        }
      });
      return colorStops;
    }
    function parseLinearGradient(gradientString) {
      // Regular expression to match the linear-gradient function
      var regex = /linear-gradient\((.*)\)/;
      var matches = gradientString.match(regex);
      if (!matches || matches.length < 2) {
        throw new Error('Invalid linear gradient string');
      }

      // Extract the content inside the linear-gradient function
      var gradientContent = matches[1];

      // Split the content by commas, but ignore commas inside parentheses
      var parts = gradientContent.split(/,(?![^\(]*\))/);

      // Determine if the first part is a direction or a color stop
      var direction;
      if (parts[0].trim().match(/^\d+deg$|^to /)) {
        direction = parts.shift().trim();
      } else {
        direction = 'to bottom'; // default direction if not specified
      }

      // Process remaining parts as color stops
      var positionRegex = /(\d+(cm|mm|in|px|pt|px|em|ex|ch|rem|vw|vh|vmin|vmax|%))$/;
      var colorStops = parseColorStops(parts);
      return {
        type: 'linear-gradient',
        direction: direction,
        colorStops: colorStops
      };
    }
    function parseRadialGradient(gradientString) {
      // Give the default values
      var gradient = {
        type: 'radial-gradient',
        shape: 'circle',
        size: 'farthest-corner',
        position: 'center',
        colorStops: []
      };

      // Regular expression to match the radial-gradient function
      var regex = /radial-gradient\((.*)\)/i;
      var matches = gradientString.match(regex);
      if (!matches) {
        throw new Error('Invalid radial gradient string');
      }

      // Split the content by commas, but ignore commas inside parentheses
      var gradientContent = matches[1];
      var parts = gradientContent.split(/,(?![^\(]*\))/);
      var currentPartIndex = 0;

      // Check for shape and size (e.g., "circle", "ellipse", "circle closest-side", etc.)
      var shapeSizePattern = /^\s*(circle|ellipse|closest-side|farthest-side|closest-corner|farthest-corner|contain|cover)?\s*(circle|ellipse|closest-side|farthest-side|closest-corner|farthest-corner|contain|cover)?\s*/i;
      var shapeSizeMatch = parts[currentPartIndex].match(shapeSizePattern);
      if (shapeSizeMatch) {
        gradient.shape = shapeSizeMatch[1] || null;
        gradient.size = shapeSizeMatch[2] || null;
        if (shapeSizeMatch[1] || shapeSizeMatch[2]) {
          currentPartIndex++;
        }
      }

      // Check for position (e.g., "at center", "at top left", etc.)
      var positionPattern = /^\s*at\s+([^\s,]+)\s+([^\s,]+)\s*/i;
      var positionMatch = parts[currentPartIndex].match(positionPattern);
      if (positionMatch) {
        gradient.position = "".concat(positionMatch[1], " ").concat(positionMatch[2]);
        currentPartIndex++;
      }

      // Extract color stops
      for (var i = currentPartIndex; i < parts.length; i++) {
        var _colorStop = parts[i].trim();
        gradient.colorStops.push(_colorStop);
      }
      return gradient;
    }
    function parseConicGradient(matches) {
      var parts = matches[1].split(/,(.+)/);
      var angle = parts[0].trim();
      var colorStops = parseColorStops(parts[1]);
      return {
        type: 'conic-gradient',
        angle: angle,
        colorStops: colorStops
      };
    }
    var matches;
    if (matches = gradient.match(linearGradientRegex)) {
      return parseLinearGradient(gradient);
    } else if (matches = gradient.match(radialGradientRegex)) {
      return parseRadialGradient(matches);
    } else if (matches = gradient.match(conicGradientRegex)) {
      return parseConicGradient(matches);
    } else {
      throw new Error('Unsupported gradient format');
    }
  }
  function getColorInRGBAFromString(color) {
    // Resolve CSS variable if present
    color = resolveCSSVariable(color);
    if (color === 'transparent') {
      return {
        type: 'color',
        r: 0,
        g: 0,
        b: 0,
        a: 0
      };
    }
    if (color.startsWith('rgb')) {
      return rgbStringToRGBA(color);
    }
    if (color.startsWith('#')) {
      return hexToRGBA(color);
    }
    if (color.startsWith('linear-gradient') || color.startsWith('radial-gradient') || color.startsWith('conic-gradient')) {
      return parseGradient(color);
    }
    if (color.startsWith('url')) {
      return {
        type: 'color',
        r: 0,
        g: 0,
        b: 0,
        a: 0
      };
    }
    return {
      type: 'color',
      r: 0,
      g: 0,
      b: 0,
      a: 0
    };
    //return nameToRGBA(color);
  }
  return getColorInRGBAFromString(color);
}
function getColorRelatedProperties(element) {
  var result = {};
  var list = ['color', 'background-color', 'background-image', 'border-top-color', 'border-bottom-color', 'border-right-color', 'border-left-color', 'outline-color', 'text-decoration-color'];
  /*
  var totalR: number = 0;
  var totalG: number = 0;
  var totalB: number = 0;
  var totalA: number = 0;
  */
  for (var _i = 0, _list = list; _i < _list.length; _i++) {
    var property = _list[_i];
    result[property] = getColorInRGBA(element, property);
    /*
    totalR += result[property].r;
    totalG += result[property].g;
    totalB += result[property].b;
    totalA += result[property].a;
    */
  }
  /*
  var averageR: number = totalR / list.length;
  var averageG: number = totalG / list.length;
  var averageB: number = totalB / list.length;
  var averageA: number = totalA / list.length;
  result['average'] = { r: averageR, g: averageG, b: averageB, a: averageA };
  */
  return result;
}
function invertProperties(properties) {
  var result = {};
  for (var key in properties) {
    var _property;
    var property = properties[key];
    switch ((_property = property) === null || _property === void 0 ? void 0 : _property.type) {
      case 'color':
        result[key] = invertRGBA(property);
        break;
      case 'linear-gradient':
        result[key] = {
          type: 'linear-gradient',
          direction: property.direction,
          colorStops: property.colorStops.map(function (stop) {
            return {
              type: 'color-stop',
              color: invertRGBA(stop.color),
              position: stop.position
            };
          })
        };
        break;
      case 'radial-gradient':
        result[key] = {
          type: 'radial-gradient',
          shapeAndSize: property.shapeAndSize,
          colorStops: property.colorStops.map(function (stop) {
            return {
              type: 'color-stop',
              color: invertRGBA(stop.color),
              position: stop.position
            };
          })
        };
        break;
      case 'conic-gradient':
        result[key] = {
          type: 'conic-gradient',
          angle: property.angle,
          colorStops: property.colorStops.map(function (stop) {
            return {
              type: 'color-stop',
              color: invertRGBA(stop.color),
              position: stop.position
            };
          })
        };
        break;
      default:
        result[key] = property;
        break;
    }
  }
  return result;
}
function propertiesToStyle(selector, properties) {
  var lines = [];
  for (var key in properties) {
    var _property2;
    var property = properties[key];
    var value = '';
    switch ((_property2 = property) === null || _property2 === void 0 ? void 0 : _property2.type) {
      case 'color':
        value = "rgba(".concat(property.r, ", ").concat(property.g, ", ").concat(property.b, ", ").concat(property.a, ")");
        break;
      case 'linear-gradient':
        if (property.colorStops.length >= 2) {
          var colorStopsString = property.colorStops.map(function (stop) {
            return "rgba(".concat(stop.color.r, ", ").concat(stop.color.g, ", ").concat(stop.color.b, ", ").concat(stop.color.a, ") ").concat(stop.position);
          }).join(', ');
          value = "linear-gradient(".concat(property.direction, ", ").concat(colorStopsString, ")");
        } else {
          continue;
        }
        break;
      case 'radial-gradient':
        if (property.colorStops.length >= 2) {
          var colorStopsString = property.colorStops.map(function (stop) {
            return "rgba(".concat(stop.color.r, ", ").concat(stop.color.g, ", ").concat(stop.color.b, ", ").concat(stop.color.a, ") ").concat(stop.position);
          }).join(', ');
          value = "radial-gradient(".concat(property.shape, " ").concat(property.size, " at ").concat(property.position, ", ").concat(colorStopsString, ")");
        } else {
          continue;
        }
        break;
      default:
        continue;
        break;
    }
    lines.push("".concat(key, ": ").concat(value, " !important"));
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
      var identifier = generateID('');
      element.setAttribute('darkify-extension', identifier);
      var invertedProperties = invertProperties(getColorRelatedProperties(element));
      style.push(propertiesToStyle("".concat(String(element.tagName).toLowerCase(), "[darkify-extension=\"").concat(identifier, "\"]"), invertedProperties));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return style.join(' ');
}
;// CONCATENATED MODULE: ./src/interface/index.css
/* harmony default export */ const src_interface = (".darkify_transition_mask {\n  width: 43px;\n  height: 43px;\n  position: fixed;\n  bottom: 12px;\n  left: 12px;\n  border-radius: 100%;\n  background-color: var(--darkify-transparent);\n  z-index: 999;\n  user-select: none;\n  -webkit-user-select: none;\n  opacity: 0;\n  outline: none;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  -webkit-mask-image: -webkit-radial-gradient(white, black);\n  mask-image: -webkit-radial-gradient(white, black);\n  transform: scale(1);\n  backdrop-filter: invert(1) grayscale(1) !important;\n  -webkit-backdrop-filter: invert(1) grayscale(1) !important;\n}\n\n.darkify_transition_mask.darkify_transitioning {\n  animation-duration: var(--darkify-duration);\n  animation-name: transitioning-opacity, transitioning-zoom;\n  animation-iteration-count: forward;\n  animation-timing-function: var(--darkify-timing-function);\n}\n\n@keyframes transitioning-opacity {\n  0% {\n    opacity: 0;\n  }\n\n  100% {\n    opacity: 1;\n  }\n}\n\n.darkify_button {\n  width: 43px;\n  height: 43px;\n  position: fixed;\n  bottom: 12px;\n  left: 12px;\n  border-radius: 100%;\n  z-index: 1000;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  user-select: none;\n  -webkit-user-select: none;\n  transition: background-color var(--darkify-duration);\n  transition-timing-function: var(--darkify-timing-function);\n  outline: none;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  box-shadow: 0px 0px 15px -5px rgba(0, 0, 0, 0.1);\n}\n\n.darkify_button svg {\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  width: 23px;\n  height: 23px;\n  user-select: none;\n  -webkit-user-select: none;\n  transition: opacity var(--darkify-duration);\n  transition-timing-function: var(--darkify-timing-function);\n}\n\n.darkify_button svg path {\n  transition: fill var(--darkify-duration);\n  transition-timing-function: var(--darkify-timing-function);\n}\n\n.darkify_button[dark-mode=\"true\"] {\n  background-color: var(--darkify-333333);\n}\n\n.darkify_button[dark-mode=\"true\"] svg path {\n  fill: var(--darkify-ffffff);\n}\n\n.darkify_button[dark-mode=\"true\"] svg[mode=\"light\"] {\n  opacity: 0;\n}\n\n.darkify_button[dark-mode=\"true\"] svg[mode=\"dark\"] {\n  opacity: 1;\n}\n\n.darkify_button[dark-mode=\"false\"] {\n  background-color: var(--darkify-ffffff);\n}\n\n.darkify_button[dark-mode=\"false\"] svg path {\n  fill: var(--darkify-333333);\n}\n\n.darkify_button[dark-mode=\"false\"] svg[mode=\"light\"] {\n  opacity: 1;\n}\n\n.darkify_button[dark-mode=\"false\"] svg[mode=\"dark\"] {\n  opacity: 0;\n}");
;// CONCATENATED MODULE: ./src/interface/theme.css
/* harmony default export */ const theme = (":root {\n  --darkify-ffffff: #ffffff;\n  --darkify-333333: #333333;\n  --darkify-transparent: rgba(0, 0, 0, 0);\n  --darkify-timing-function: cubic-bezier(0.77, 0, 0.175, 1);\n  --darkify-duration: 750ms;\n}");
;// CONCATENATED MODULE: ./src/interface/index.ts




function initializeCSS() {
  //load css
  var themeLoader = document.createElement('style');
  themeLoader.innerHTML = theme;
  document.documentElement.appendChild(themeLoader);
  var styleLoader = document.createElement('style');
  styleLoader.innerHTML = src_interface;
  document.documentElement.appendChild(styleLoader);
  var dark_mode_style_loader = document.createElement('style');
  dark_mode_style_loader.classList.add('dark_mode_style_loader');
  document.documentElement.appendChild(dark_mode_style_loader);
}
function initializeButton() {
  //add button
  var button = document.createElement('div');
  button.classList.add('darkify_button');
  button.setAttribute('dark-mode', 'false');
  button.setAttribute('darkifying', 'false');
  button.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\" mode=\"light\"><path d=\"M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 60q-74.92 0-127.46-52.54Q300-405.08 300-480q0-74.92 52.54-127.46Q405.08-660 480-660q74.92 0 127.46 52.54Q660-554.92 660-480q0 74.92-52.54 127.46Q554.92-300 480-300ZM80-450q-12.75 0-21.37-8.63Q50-467.26 50-480.01q0-12.76 8.63-21.37Q67.25-510 80-510h90q12.75 0 21.38 8.63 8.62 8.63 8.62 21.38 0 12.76-8.62 21.37Q182.75-450 170-450H80Zm710 0q-12.75 0-21.38-8.63-8.62-8.63-8.62-21.38 0-12.76 8.62-21.37Q777.25-510 790-510h90q12.75 0 21.37 8.63 8.63 8.63 8.63 21.38 0 12.76-8.63 21.37Q892.75-450 880-450h-90ZM479.99-760q-12.76 0-21.37-8.62Q450-777.25 450-790v-90q0-12.75 8.63-21.37 8.63-8.63 21.38-8.63 12.76 0 21.37 8.63Q510-892.75 510-880v90q0 12.75-8.63 21.38-8.63 8.62-21.38 8.62Zm0 710q-12.76 0-21.37-8.63Q450-67.25 450-80v-90q0-12.75 8.63-21.38 8.63-8.62 21.38-8.62 12.76 0 21.37 8.62Q510-182.75 510-170v90q0 12.75-8.63 21.37Q492.74-50 479.99-50ZM240.23-678.38l-50.31-48.93q-8.92-8.31-8.61-20.88.31-12.58 8.73-21.89 9.19-9.3 21.58-9.3 12.38 0 21.07 9.3L282-720.15q8.69 9.3 8.69 21.07t-8.5 21.08q-8.5 9.31-20.57 8.81-12.08-.5-21.39-9.19Zm487.08 488.46L678-239.85q-8.69-9.3-8.69-21.38 0-12.08 8.69-20.77 8.12-9.31 20.29-8.81t21.48 9.19l50.31 48.93q8.92 8.31 8.61 20.88-.31 12.58-8.73 21.89-9.19 9.3-21.58 9.3-12.38 0-21.07-9.3ZM678-677.81q-9.31-8.5-8.81-20.57.5-12.08 9.19-21.39l48.93-50.31q8.31-8.92 20.88-8.61 12.58.31 21.89 8.73 9.3 9.19 9.3 21.58 0 12.38-9.3 21.07L720.15-678q-9.3 8.69-21.07 8.69t-21.08-8.5ZM189.92-189.84q-9.3-9.39-9.3-21.78 0-12.38 9.3-21.07L239.85-282q9.3-8.69 21.38-8.69 12.08 0 20.77 8.69 8.92 8.12 8.42 20.29t-8.8 21.48l-48.93 50.31q-8.69 9.3-21.07 9-12.39-.31-21.7-8.92ZM480-480Z\"/></svg><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\" mode=\"dark\"><path d=\"M481.15-140Q339-140 240.08-238.92 141.16-337.85 141.16-480q0-118.38 73.26-210.46 73.27-92.08 195.19-118.69 12.62-3.16 22.23.61 9.62 3.77 15.62 11.23 6 7.47 7.08 18.12 1.07 10.65-5 21.27-12.39 22.54-18.39 46.83t-6 51.09q0 98.33 68.84 167.17Q562.82-424 661.15-424q29.47 0 56.31-7.46 26.85-7.46 47-17.31 9.85-4.3 19.23-3.04 9.39 1.27 16.02 6.27 7.37 5 10.94 13.66 3.58 8.65.81 20.34-21.31 118-114.81 194.77Q603.15-140 481.15-140Zm0-60q88 0 158-48.5t102-126.5q-20 5-40 8t-40 3q-123 0-209.5-86.5T365.15-660q0-20 3-40t8-40q-78 32-126.5 102t-48.5 158q0 116 82 198t198 82Zm-10-270Z\"/></svg> ";
  button.addEventListener('click', function (event) {
    event.preventDefault();
    switchDarkMode();
  });
  document.documentElement.appendChild(button);
}
function initializeMask() {
  var mask = document.createElement('div');
  mask.classList.add('darkify_transition_mask');
  document.documentElement.appendChild(mask);
}
function getTransitionKeyframes() {
  var padding = 100;
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var radius = 43 / 2;
  var centerX = 12 + radius;
  var centerY = windowHeight - (12 + radius);
  var cornerX = windowWidth + padding;
  var cornerY = -1 * padding;
  var scale = Math.sqrt(Math.pow(cornerX - centerX, 2) + Math.pow(cornerY - centerY, 2)) / radius;
  var keyframes = "@keyframes transitioning-zoom { 0% {transform: scale(1);} 100% {transform: scale(".concat(scale, ");}}");
  return keyframes;
}
function turnOnDarkMode() {
  var button = document.querySelector('.darkify_button');
  button.setAttribute('darkifying', 'true');
  var sessionID = generateID('d_');
  var keyframesLoader = document.createElement('style');
  keyframesLoader.id = "".concat(sessionID, "_keyframes");
  keyframesLoader.innerHTML = getTransitionKeyframes();
  document.documentElement.appendChild(keyframesLoader);
  var darkModeStyle = getDarkModeStyle();
  var transitionMask = document.querySelector('.darkify_transition_mask');
  transitionMask.classList.add('darkify_transitioning');
  transitionMask.addEventListener('animationend', function (e) {
    var keyframesLoaderInstance = document.querySelector("style#".concat(sessionID, "_keyframes"));
    if (!(keyframesLoaderInstance === null)) {
      keyframesLoaderInstance.remove();
    }
    transitionMask.classList.remove('darkify_transitioning');
    document.querySelector('style.dark_mode_style_loader').innerHTML = darkModeStyle;
    button.setAttribute('darkifying', 'false');
  }, {
    once: true
  });
}
function turnOffDarkMode() {
  var button = document.querySelector('.darkify_button');
  button.setAttribute('darkifying', 'true');
  var sessionID = generateID('d_');
  var keyframesLoader = document.createElement('style');
  keyframesLoader.id = "".concat(sessionID, "_keyframes");
  keyframesLoader.innerHTML = getTransitionKeyframes();
  document.documentElement.appendChild(keyframesLoader);
  var transitionMask = document.querySelector('.darkify_transition_mask');
  transitionMask.classList.add('darkify_transitioning');
  transitionMask.addEventListener('animationend', function (e) {
    var keyframesLoaderInstance = document.querySelector("style#".concat(sessionID, "_keyframes"));
    if (!(keyframesLoaderInstance === null)) {
      keyframesLoaderInstance.remove();
    }
    transitionMask.classList.remove('darkify_transitioning');
    document.querySelector('style.dark_mode_style_loader').innerHTML = '';
    button.setAttribute('darkifying', 'false');
  }, {
    once: true
  });
}
function switchDarkMode() {
  var button = document.querySelector('.darkify_button');
  var currentMode = button.getAttribute('dark-mode');
  var darkifying = button.getAttribute('darkifying');
  if (darkifying === 'false') {
    if (currentMode === 'false') {
      button.setAttribute('dark-mode', 'true');
      turnOnDarkMode();
    } else {
      if (currentMode === 'true') {
        button.setAttribute('dark-mode', 'false');
        turnOffDarkMode();
      }
    }
  }
}
;// CONCATENATED MODULE: ./src/index.ts

function initialize() {
  initializeCSS();
  initializeButton();
  initializeMask();
}
var darkify = {
  initialize: initialize
};
darkify.initialize();
/* harmony default export */ const src = (darkify);
})();

darkify = __webpack_exports__["default"];
/******/ })()
;