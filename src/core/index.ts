// Function to convert hex to RGB
function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  return { r, g, b };
}

// Function to convert RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

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

// Function to determine if a color is gray
function isGray(hex) {
  const { r, g, b } = hexToRgb(hex);
  const { s } = rgbToHsl(r, g, b);
  return s <= 0.38;
}

// Function to convert RGB to hex
function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// Function to convert RGBA to hex
function rgbaToHex(r, g, b, a) {
  let alpha = Math.round(a * 255);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase() + alpha.toString(16).padStart(2, '0').toUpperCase();
}

// Function to invert a color
function invertColor(hex) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  let invertedColor = isGray(hex) ? rgbToHex(255 - r, 255 - g, 255 - b) : hex;
  return invertedColor;
}

// Function to darken the background color
function darkenColor(hex, percent) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  r = Math.floor(r * (1 - percent / 100));
  g = Math.floor(g * (1 - percent / 100));
  b = Math.floor(b * (1 - percent / 100));

  return rgbToHex(r, g, b);
}

// Function to extract and convert color
function extractAndConvertColor(color) {
  let rgbValues = color.match(/\d+/g);
  let r = parseInt(rgbValues[0]);
  let g = parseInt(rgbValues[1]);
  let b = parseInt(rgbValues[2]);
  let a = rgbValues[3] ? parseFloat(rgbValues[3]) : 1;

  let hexColor;
  if (a === 1) {
    hexColor = rgbToHex(r, g, b);
  } else {
    hexColor = rgbaToHex(r, g, b, a);
  }
  return hexColor;
}

// Function to apply dark mode style
function applyDarkModeStyle(targetElement) {
  const computedStyle = getComputedStyle(targetElement);

  // Extract and convert text color
  const color = computedStyle.color;
  const hexColor = extractAndConvertColor(color);
  const invertedColor = invertColor(hexColor);
  targetElement.style.color = invertedColor;

  // Extract and convert background color
  const backgroundColor = computedStyle.backgroundColor;
  const hexBackgroundColor = extractAndConvertColor(backgroundColor);
  const darkenedBackgroundColor = darkenColor(hexBackgroundColor, 90); // Darken by 90%
  targetElement.style.backgroundColor = darkenedBackgroundColor;

  // Extract and convert background color
  const borderColor = computedStyle.borderColor;
  const hexBorderColor = extractAndConvertColor(borderColor);
  const darkenedborderColor = darkenColor(hexBorderColor, 80); // Darken by 50%
  targetElement.style.borderColor = darkenedborderColor;
}

var elements = document.querySelectorAll('body *,body');
for (var e of elements) {
  applyDarkModeStyle(e);
}

function getColorInRGBA(element, property) {
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

// Example usage:
const element = document.getElementById('myElement');
const backgroundColorRGBA = getColorInRGBA(element, 'background-color');
console.log(backgroundColorRGBA);
