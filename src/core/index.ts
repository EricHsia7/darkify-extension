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

function rgbToHsl(color: RGB): HSL {
  var r = (color?.r || 0) / 255;
  var g = (color?.g || 0) / 255;
  var b = (color?.b || 0) / 255;

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
  var r = color?.r || 0;
  var g = color?.g || 0;
  var b = color?.b || 0;
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbaToHex(color: RGBA): hex {
  var r = color?.r || 0;
  var g = color?.g || 0;
  var b = color?.b || 0;
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
  var r = 255 - (color?.r || 255);
  var g = 255 - (color?.g || 255);
  var b = 255 - (color?.b || 255);
  return needToInvert(color) ? { type: 'color', r, g, b } : color;
}

function invertRGBA(color: RGBA): RGBA {
  var r = 255 - (color?.r || 0);
  var g = 255 - (color?.g || 0);
  var b = 255 - (color?.b || 0);
  var a = color?.a || 0;
  return needToInvert({ type: 'color', r: color?.r || 0, g: color?.g || 0, b: color?.b || 0 }) ? { type: 'color', r, g, b, a } : color;
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
      return hexToRGBA(color);
    }
    if (color.startsWith('linear-gradient') || color.startsWith('radial-gradient') || color.startsWith('conic-gradient')) {
      return parseGradient(color);
    }
    if (color.startsWith('url')) {
      return { type: 'color', r: 0, g: 0, b: 0, a: 0 };
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
  return style.join(' ');
}
