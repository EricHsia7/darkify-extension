const md5 = require('md5');

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

type hex = string;

type colorRelatedProperty = 'color' | 'background-color' | 'fill' | 'border-top-color' | 'border-bottom-color' | 'border-right-color' | 'border-left-color' | 'outline-color' | 'text-decoration-color';

function rgbToHsl(color: RGB): HSL {
  var r = color.r / 255;
  var g = color.g / 255;
  var b = color.b / 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
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

  return { h, s, l };
}

function isGray(color: RGB): boolean {
  var r = color.r;
  var g = color.g;
  var b = color.b;
  const { s } = rgbToHsl(r, g, b);
  return s <= 0.38;
}

function rgbToHex(color: RGB): hex {
  var r = color.r;
  var g = color.g;
  var b = color.b;
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbaToHex(color: RGBA): hex {
  var r = color.r;
  var g = color.g;
  var b = color.b;
  var a = Math.round(color.a * 255);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase() + alpha.toString(16).padStart(2, '0').toUpperCase();
}

function invertRGB(color: RGB): RGB {
  var r = 255 - color.r;
  var g = 255 - color.g;
  var b = 255 - color.b;
  return isGray(color) ? { r, g, b } : color;
}

function darkenRGB(color: RGB, percent: number): RGB {
  var r = Math.floor(color.r * (1 - percent / 100));
  var g = Math.floor(color.g * (1 - percent / 100));
  var b = Math.floor(color.b * (1 - percent / 100));
  return { r, g, b };
}

function getColorInRGBA(element: HTMLElement, property: colorRelatedProperty): RGBA {
  const style = getComputedStyle(element);
  let color = style.getPropertyValue(property).trim();

  // Function to resolve CSS variables
  function resolveCSSVariable(value) {
    if (value.startsWith('var(')) {
      const variableName = value.slice(4, -1).trim();
      const resolvedValue = style.getPropertyValue(variableName).trim();
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
    let r, g, b;
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
    return { r, g, b, a: 1 };
  }

  function rgbStringToRGBA(rgb) {
    const match = rgb.match(/rgba?\((\d+), (\d+), (\d+)(?:, (\d+\.?\d*))?\)/);
    if (!match) throw new Error('Invalid RGB/RGBA format');
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
      a: match[4] ? parseFloat(match[4]) : 1
    };
  }

  function nameToRGBA(name) {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = name;
    const computedColor = ctx.fillStyle; // Now it’s in rgb format
    return rgbStringToRGBA(computedColor);
  }

  if (color === 'transparent') {
    return { r: 0, g: 0, b: 0, a: 0 };
  } else if (color.startsWith('rgb')) {
    return rgbStringToRGBA(color);
  } else if (color.startsWith('#')) {
    return hexToRGBA(color);
  } else {
    // Assume it's a color name
    return nameToRGBA(color);
  }
}

function getColorRelatedProperties(element: HTMLElement): object {
  var result: object = {};
  var list: colorRelatedProperty[] = ['color', 'background-color', 'border-top-color', 'border-bottom-color', 'border-right-color', 'border-left-color', 'outline-color', 'text-decoration-color'];
  var totalR: number = 0;
  var totalG: number = 0;
  var totalB: number = 0;
  var totalA: number = 0;
  for (var property of list) {
    result[property] = getColorInRGBA(element, property);
    totalR += result[property].r;
    totalG += result[property].g;
    totalB += result[property].b;
    totalA += result[property].a;
  }
  var averageR: number = totalR / list.length;
  var averageG: number = totalG / list.length;
  var averageB: number = totalB / list.length;
  var averageA: number = totalA / list.length;
  result['average'] = { r: averageR, g: averageG, b: averageB, a: averageA };
  return result;
}

function invertProperties(properties: object): object {
  var result = {};
  for (var key in properties) {
    var property = properties[key];
    result[key] = Object.assign(invertRGB({ r: property.r, g: property.g, b: property.b }), { a: property.a });
  }
  return result;
}

function propertiesToStyle(selector: string, properties: object): string {
  var lines = [];
  for (var key in properties) {
    var property = properties[key];
    lines.push(`${key}: rgba(${property.r}, ${property.g}, ${property.b}, ${property.a})`);
  }
  return `${selector} {${lines.join(';')}}`;
}

export function getDarkModeStyle(): object {
  var style = [];
  var elements = document.querySelectorAll('body *,body');
  for (var element of elements) {
    var identifier: string = `i-${md5(Math.random() * new Date().getTime())}`;
    element.setAttribute('auto-dark-mode-extension', identifier);
    var invertedProperties = invertProperties(getColorRelatedProperties(element));
    style.push(propertiesToStyle(`${element.tagName}[auto-dark-mode-extension="${identifier}"]`, invertedProperties));
  }
  return style.join(' ');
}
