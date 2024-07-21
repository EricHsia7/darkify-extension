import { generateID } from '../tools/index.ts';

interface RGBA {
  type: 'color';
  r: number;
  g: number;
  b: number;
  a: number;
}

interface RGB {
  type: 'color';
  r: number;
  g: number;
  b: number;
}

interface HSL {
  type: 'color';
  h: number;
  s: number;
  l: number;
}

interface colorStop {
  type: 'color-stop';
  color: RGBA;
  position: string;
}

interface linearGradient {
  type: 'linear-gradient';
  direction: string;
  colorStops: colorStop[];
}

interface radialGradient {
  type: 'radial-gradient';
  shapeAndSize: string;
  colorStops: colorStop[];
}

interface conicGradient {
  type: 'conic-gradient';
  angle: string;
  colorStops: colorStop[];
}

type hex = string;

type colorRelatedProperty = 'color' | 'background-color' | 'background-image' | 'fill' | 'border-top-color' | 'border-bottom-color' | 'border-right-color' | 'border-left-color' | 'outline-color' | 'text-decoration-color';

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

function needToInvert(color: RGB): boolean {
  var hsl: HSL = rgbToHsl(color);
  if (hsl.s <= 0.38) {
    return true;
  } else {
    if (hsl.l <= 0.23) {
      return true;
    }
  }
  return false;
}

function invertRGB(color: RGB): RGB {
  var r = 255 - color.r;
  var g = 255 - color.g;
  var b = 255 - color.b;
  return needToInvert(color) ? { type: 'color', r, g, b } : color;
}

function invertRGBA(color: RGBA): RGBA {
  var r = 255 - color.r;
  var g = 255 - color.g;
  var b = 255 - color.b;
  var a = color.a;
  return needToInvert({ type: 'color', r: color.r, g: color.g, b: color.b }) ? { type: 'color', r, g, b, a } : color;
}

function darkenRGB(color: RGB, percent: number): RGB {
  var r = Math.floor(color.r * (1 - percent / 100));
  var g = Math.floor(color.g * (1 - percent / 100));
  var b = Math.floor(color.b * (1 - percent / 100));
  return { r, g, b };
}

function getColorInRGBA(element: HTMLElement, property: object): RGBA | linearGradient | radialGradient | conicGradient {
  const style = getComputedStyle(element);
  let color = style.getPropertyValue(property).trim();

  function resolveCSSVariable(value: string): string {
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

  function hexToRGBA(hex: string): RGBA {
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
    return { type: 'color', r, g, b, a: 1 };
  }

  function rgbStringToRGBA(rgb: string): RGBA {
    const match = rgb.match(/rgba?\((\d+), (\d+), (\d+)(?:, (\d+\.?\d*))?\)/);
    if (!match) throw new Error(`Invalid RGB/RGBA format: ${rgb}`);
    return {
      type: 'color',
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
      a: match[4] ? parseFloat(match[4]) : 1
    };
  }

  function nameToRGBA(name: string): RGBA {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = name;
    const computedColor = ctx.fillStyle; // Now it’s in rgb format
    return rgbStringToRGBA(computedColor);
  }

  function parseColorStops(colorStops: string): colorStop[] {
    return colorStops.split(',').map((stop) => {
      const parts = stop.trim().split(/\s+/);
      const color = parts[0];
      const position = parts[1] || null;
      return { type: 'color-stop', color: getColorInRGBAFromString(color), position };
    });
  }

  function parseGradient(gradient) {
    const linearGradientRegex = /linear-gradient\(([^)]+)\)/;
    const radialGradientRegex = /radial-gradient\(([^)]+)\)/;
    const conicGradientRegex = /conic-gradient\(([^)]+)\)/;

    function parseLinearGradient(matches) {
      const parts = matches[1].split(/,(.+)/);
      const direction = parts[0].trim();
      const colorStops = parseColorStops(parts[1]);
      return { type: 'linear-gradient', direction, colorStops };
    }

    function parseRadialGradient(matches) {
      const parts = matches[1].split(/,(.+)/);
      const shapeAndSize = parts[0].trim();
      const colorStops = parseColorStops(parts[1]);
      return { type: 'radial-gradient', shapeAndSize, colorStops };
    }

    function parseConicGradient(matches) {
      const parts = matches[1].split(/,(.+)/);
      const angle = parts[0].trim();
      const colorStops = parseColorStops(parts[1]);
      return { type: 'conic-gradient', angle, colorStops };
    }

    let matches;
    if ((matches = gradient.match(linearGradientRegex))) {
      return parseLinearGradient(matches);
    } else if ((matches = gradient.match(radialGradientRegex))) {
      return parseRadialGradient(matches);
    } else if ((matches = gradient.match(conicGradientRegex))) {
      return parseConicGradient(matches);
    } else {
      throw new Error('Unsupported gradient format');
    }
  }

  function getColorInRGBAFromString(color: string) {
    // Resolve CSS variable if present
    color = resolveCSSVariable(color);

    if (color === 'transparent') {
      return { type: 'color', r: 0, g: 0, b: 0, a: 0 };
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
      return { type: 'color', r: 0, g: 0, b: 0, a: 0 };
    }
    return { type: 'color', r: 0, g: 0, b: 0, a: 0 };
    //return nameToRGBA(color);
  }

  return getColorInRGBAFromString(color);
}

function getColorRelatedProperties(element: HTMLElement): object {
  var result: object = {};
  var list: colorRelatedProperty[] = ['color', 'background-color', 'background-image', 'border-top-color', 'border-bottom-color', 'border-right-color', 'border-left-color', 'outline-color', 'text-decoration-color'];
  /*
  var totalR: number = 0;
  var totalG: number = 0;
  var totalB: number = 0;
  var totalA: number = 0;
  */
  for (var property of list) {
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

function invertProperties(properties: object): object {
  var result = {};
  for (var key in properties) {
    var property = properties[key];
    switch (property?.type) {
      case 'color':
        result[key] = invertRGBA(property);
        break;
      case 'linear-gradient':
        result[key] = {
          type: 'linear-gradient',
          direction,
          colorStops: property.colorStops.map((stop) => {
            return { type: 'color-stop', color: invertRGBA(stop.color), position };
          })
        };
        break;
      case 'radial-gradient':
        result[key] = {
          type: 'radial-gradient',
          shapeAndSize,
          colorStops: property.colorStops.map((stop) => {
            return { type: 'color-stop', color: invertRGBA(stop.color), position };
          })
        };
        break;
      case 'conic-gradient':
        result[key] = {
          type: 'conic-gradient',
          angle,
          colorStops: property.colorStops.map((stop) => {
            return { type: 'color-stop', color: invertRGBA(stop.color), position };
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

function propertiesToStyle(selector: string, properties: object): string {
  var lines = [];
  for (var key in properties) {
    var property = properties[key];
    var value = '';
    switch (property?.type) {
      case 'color':
        value = `rgba(${property.r}, ${property.g}, ${property.b}, ${property.a})`;
        break;
      case 'linear-gradient':
        var colorStopsString = property.colorStops
          .map((stop) => {
            return `rgba(${stop.color.r}, ${stop.color.g}, ${stop.color.b}, ${stop.color.a}) ${stop.position}`;
          })
          .join(', ');
        value = `linear-gradient(${property.direction}, ${colorStopsString})`;
        break;
      default:
        value = '';
        break;
    }

    lines.push(`${key}: ${value} !important`);
  }
  return `${selector} {${lines.join(';')}}`;
}

export function getDarkModeStyle(): object {
  var style = [];
  var elements = document.querySelectorAll('body *,body');
  for (var element of elements) {
    var identifier: string = generateID('');
    element.setAttribute('darkify-extension', identifier);
    var invertedProperties = invertProperties(getColorRelatedProperties(element));
    style.push(propertiesToStyle(`${String(element.tagName).toLowerCase()}[darkify-extension="${identifier}"]`, invertedProperties));
  }
  return style.join(' ');
}
