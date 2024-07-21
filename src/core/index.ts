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
  shape: string;
  size: string;
  position: string;
  colorStops: colorStop[];
}

interface conicGradient {
  type: 'conic-gradient';
  angle: string;
  colorStops: colorStop[];
}

type hex = string;

type colorRelatedProperty = 'color' | 'background-color' | 'background-image' | 'fill' | 'border-top-color' | 'border-bottom-color' | 'border-right-color' | 'border-left-color' | 'outline-color' | 'text-decoration-color';

const defaultR: number = 255;
const defaultG: number = 255;
const defaultB: number = 255;
const defaultA: number = 1;

function fixRGB(color: RGB): RGB {
  if (typeof color === 'object' && !Array.isArray(color)) {
    var r: number = color.hasOwnProperty('r') ? color.r : defaultR;
    var g: number = color.hasOwnProperty('g') ? color.g : defaultG;
    var b: number = color.hasOwnProperty('b') ? color.b : defaultB;
    return { type: 'color', r, g, b };
  } else {
    return { type: 'color', r: defaultR, g: defaultG, b: defaultB };
  }
}

function fixRGBA(color: RGBA): RGBA {
  if (typeof color === 'object' && !Array.isArray(color)) {
    var r: number = color.hasOwnProperty('r') ? color.r : defaultR;
    var g: number = color.hasOwnProperty('g') ? color.g : defaultG;
    var b: number = color.hasOwnProperty('b') ? color.b : defaultB;
    var a: number = color.hasOwnProperty('a') ? color.a : defaultA;
    return { type: 'color', r, g, b, a };
  } else {
    return { type: 'color', r: defaultR, g: defaultG, b: defaultB, a: defaultA };
  }
}

function RGB2HSL(color: RGB): HSL {
  var fixedColor: RGB = fixRGB(color);
  var r = fixedColor.r / 255;
  var g = fixedColor.g / 255;
  var b = fixedColor.b / 255;

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

  return { type: 'color', h, s, l };
}

function HSL2RGB(hsl: HSL): RGB {
  let { h, s, l } = hsl;

  if (s === 0) {
    // achromatic
    let rgb = Math.round(l * 255);
    return { type: 'color', r: rgb, g: rgb, b: rgb };
  } else {
    function HUE2RGB(p: number, q: number, t: number): number {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 3) return q;
      if (t < 1 / 2) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;

    let r = HUE2RGB(p, q, h + 1 / 3);
    let g = HUE2RGB(p, q, h);
    let b = HUE2RGB(p, q, h - 1 / 3);

    return {
      type: 'color',
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }
}

function RGB2HEX(color: RGB): hex {
  var fixedColor: RGB = fixRGB(color);
  var r: number = fixedColor.r;
  var g: number = fixedColor.g;
  var b: number = fixedColor.b;
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function RGBA2HEX(color: RGBA): hex {
  var fixedColor: RGBA = fixRGBA(color);
  var r: number = fixedColor.r;
  var g: number = fixedColor.g;
  var b: number = fixedColor.b;
  var a: number = Math.round(fixedColor.a * 255);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase() + alpha.toString(16).padStart(2, '0').toUpperCase();
}

function invertRGBA(color: RGBA): RGBA {
  var needToInvert = false;
  var hsl: HSL = RGB2HSL(color);
  if (hsl.s <= 0.38) {
    needToInvert = true;
  } else {
    if (hsl.l <= 0.23) {
      needToInvert = true;
    }
  }
  if (needToInvert) {
    var fixedColor: RGBA = fixRGBA(color);

    var r = 255 - fixedColor.r;
    var g = 255 - fixedColor.g;
    var b = 255 - fixedColor.b;

    var hsl2: HSL = RGB2HSL({ type: 'color', r, g, b });
    var h = hsl.h;
    var s = hsl2.s;
    var l = hsl2.l;

    var color2: RGB = HSL2RGB({ type: 'color', h, s, l });
    var r2 = color2.r;
    var g2 = color2.g;
    var b2 = color2.b;
    var a2 = fixedColor.a;
    return { type: 'color', r: r2, g: g2, b: b2, a: a2 };
  } else {
    return color;
  }
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

  function HEX2RGBA(hex: string): RGBA {
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
    const match = rgb.match(/rgba?\((\d+),\s{0,}(\d+),\s{0,}(\d+)(?:,\s{0,}(\d+\.?\d*))?\)/);
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

  function parseGradient(gradient: string) {
    const linearGradientRegex = /^linear-gradient\((.*)\)$/;
    const radialGradientRegex = /^radial-gradient\((.*)\)$/;
    const conicGradientRegex = /^conic-gradient\((.*)\)$/;

    function parseColorStops(parts: string[]): colorStop[] {
      const positionRegex = /(\d+(cm|mm|in|px|pt|px|em|ex|ch|rem|vw|vh|vmin|vmax|%))$/;
      var colorStops: colorStop[] = [];
      parts.forEach((part) => {
        var matches2 = part.trim().match(positionRegex);
        if (matches2) {
          var color = getColorInRGBAFromString(part.trim().replace(positionRegex, '').trim());
          var position = matches2[0].trim();
          colorStops.push({
            type: 'color-stop',
            color,
            position
          });
        }
      });
      return colorStops;
    }

    function parseLinearGradient(gradientString: string): linearGradient {
      // Regular expression to match the linear-gradient function
      const regex = /linear-gradient\((.*)\)/;
      const matches = gradientString.match(regex);

      if (!matches || matches.length < 2) {
        throw new Error('Invalid linear gradient string');
      }

      // Extract the content inside the linear-gradient function
      const gradientContent = matches[1];

      // Split the content by commas, but ignore commas inside parentheses
      const parts = gradientContent.split(/,(?![^\(]*\))/);

      // Determine if the first part is a direction or a color stop
      let direction;
      if (parts[0].trim().match(/^\d+deg$|^to /)) {
        direction = parts.shift().trim();
      } else {
        direction = 'to bottom'; // default direction if not specified
      }

      // Process remaining parts as color stops
      const colorStops = parseColorStops(parts);
      return { type: 'linear-gradient', direction, colorStops };
    }

    function parseRadialGradient(gradientString: string): radialGradient {
      // Give the default values
      const gradient = {
        type: 'radial-gradient',
        shape: 'circle',
        size: 'farthest-corner',
        position: 'center',
        colorStops: []
      };

      // Regular expression to match the radial-gradient function
      const regex = /radial-gradient\((.*)\)/i;
      const matches = gradientString.match(regex);

      if (!matches) {
        throw new Error('Invalid radial gradient string');
      }

      // Split the content by commas, but ignore commas inside parentheses
      const gradientContent = matches[1];
      const parts = gradientContent.split(/,(?![^\(]*\))/);

      let currentPartIndex = 0;

      // Check for shape and size (e.g., "circle", "ellipse", "circle closest-side", etc.)
      const shapeSizePattern = /^\s*(circle|ellipse|closest-side|farthest-side|closest-corner|farthest-corner|contain|cover)?\s*(circle|ellipse|closest-side|farthest-side|closest-corner|farthest-corner|contain|cover)?\s*/i;
      let shapeSizeMatch = parts[currentPartIndex].match(shapeSizePattern);

      if (shapeSizeMatch) {
        gradient.shape = shapeSizeMatch[1] || null;
        gradient.size = shapeSizeMatch[2] || null;
        if (shapeSizeMatch[1] || shapeSizeMatch[2]) {
          currentPartIndex++;
        }
      }

      // Check for position (e.g., "at center", "at top left", etc.)
      const positionPattern = /^\s*at\s+([^\s,]+)\s+([^\s,]+)\s*/i;
      let positionMatch = parts[currentPartIndex].match(positionPattern);

      if (positionMatch) {
        gradient.position = `${positionMatch[1]} ${positionMatch[2]}`;
        currentPartIndex++;
      }

      // Extract color stops
      for (let i = currentPartIndex; i < parts.length; i++) {
        const colorStop = parts[i].trim();
        gradient.colorStops.push(colorStop);
      }

      return gradient;
    }

    function parseConicGradient(matches) {
      const parts = matches[1].split(/,(.+)/);
      const angle = parts[0].trim();
      const colorStops = parseColorStops(parts[1]);
      return { type: 'conic-gradient', angle, colorStops };
    }

    let matches;
    if ((matches = gradient.match(linearGradientRegex))) {
      return parseLinearGradient(gradient);
    } else if ((matches = gradient.match(radialGradientRegex))) {
      return parseRadialGradient(gradient);
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
      return HEX2RGBA(color);
    }
    if (color.startsWith('linear-gradient') || color.startsWith('radial-gradient') || color.startsWith('conic-gradient')) {
      return parseGradient(color);
    }
    if (color.startsWith('url')) {
      return { type: 'color', r: defaultR, g: defaultG, b: defaultB, a: defaultA };
    }
    return nameToRGBA(color);
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
    try {
      result[property] = getColorInRGBA(element, property);
    } catch (e) {
      continue;
    }
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
          direction: property.direction,
          colorStops: property.colorStops.map((stop) => {
            return { type: 'color-stop', color: invertRGBA(stop.color), position: stop.position };
          })
        };
        break;
      case 'radial-gradient':
        result[key] = {
          type: 'radial-gradient',
          shapeAndSize: property.shapeAndSize,
          colorStops: property.colorStops.map((stop) => {
            return { type: 'color-stop', color: invertRGBA(stop.color), position: stop.position };
          })
        };
        break;
      case 'conic-gradient':
        result[key] = {
          type: 'conic-gradient',
          angle: property.angle,
          colorStops: property.colorStops.map((stop) => {
            return { type: 'color-stop', color: invertRGBA(stop.color), position: stop.position };
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
        if (property.colorStops.length >= 2) {
          var colorStopsString = property.colorStops
            .map((stop) => {
              return `rgba(${stop.color.r}, ${stop.color.g}, ${stop.color.b}, ${stop.color.a}) ${stop.position}`;
            })
            .join(', ');
          value = `linear-gradient(${property.direction}, ${colorStopsString})`;
        } else {
          continue;
        }
        break;
      case 'radial-gradient':
        if (property.colorStops.length >= 2) {
          var colorStopsString = property.colorStops
            .map((stop) => {
              return `rgba(${stop.color.r}, ${stop.color.g}, ${stop.color.b}, ${stop.color.a}) ${stop.position}`;
            })
            .join(', ');
          value = `radial-gradient(${property.shape} ${property.size} at ${property.position}, ${colorStopsString})`;
        } else {
          continue;
        }
        break;
      default:
        continue;
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
  return style.join('');
}
