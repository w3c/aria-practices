/* high-contrast.js */

'use strict';

const htmlColorValues = [
  {
    name: 'INDIAN RED',
    hex: '#CD5C5C',
  },
  {
    name: 'LIGHT CORAL',
    hex: '#F08080',
  },
  {
    name: 'SALMON',
    hex: '#FA8072',
  },
  {
    name: 'DARK SALMON',
    hex: '#E9967A',
  },
  {
    name: 'LIGHT SALMON',
    hex: '#FFA07A',
  },
  {
    name: 'CRIMSON',
    hex: '#DC143C',
  },
  {
    name: 'RED',
    hex: '#FF0000',
  },
  {
    name: 'DARK RED',
    hex: '#8B0000',
  },
  {
    name: 'PINK',
    hex: '#FFC0CB',
  },
  {
    name: 'LIGHT PINK',
    hex: '#FFB6C1',
  },
  {
    name: 'HOT PINK',
    hex: '#FF69B4',
  },
  {
    name: 'DEEP PINK',
    hex: '#FF1493',
  },
  {
    name: 'MEDIUM VIOLET RED',
    hex: '#C71585',
  },
  {
    name: 'PALE VIOLET RED',
    hex: '#DB7093',
  },
  {
    name: 'CORAL',
    hex: '#FF7F50',
  },
  {
    name: 'TOMATO',
    hex: '#FF6347',
  },
  {
    name: 'ORANGE RED',
    hex: '#FF4500',
  },
  {
    name: 'DARK ORANGE',
    hex: '#FF8C00',
  },
  {
    name: 'ORANGE',
    hex: '#FFA500',
  },
  {
    name: 'GOLD',
    hex: '#FFD700',
  },
  {
    name: 'YELLOW',
    hex: '#FFFF00',
  },
  {
    name: 'LIGHT YELLOW',
    hex: '#FFFFE0',
  },
  {
    name: 'LEMON CHIFFON',
    hex: '#FFFACD',
  },
  {
    name: 'LIGHT GOLDEN ROD YELLOW',
    hex: '#FAFAD2',
  },
  {
    name: 'PAPAYAWHIP',
    hex: '#FFEFD5',
  },
  {
    name: 'MOCCASIN',
    hex: '#FFE4B5',
  },
  {
    name: 'PEACH PUFF',
    hex: '#FFDAB9',
  },
  {
    name: 'PALE GOLDEN ROD',
    hex: '#EEE8AA',
  },
  {
    name: 'KHAKI',
    hex: '#F0E68C',
  },
  {
    name: 'DARK KHAKI',
    hex: '#BDB76B',
  },
  {
    name: 'LAVENDER',
    hex: '#E6E6FA',
  },
  {
    name: 'THISTLE',
    hex: '#D8BFD8',
  },
  {
    name: 'PLUM',
    hex: '#DDA0DD',
  },
  {
    name: 'VIOLET',
    hex: '#EE82EE',
  },
  {
    name: 'ORCHID',
    hex: '#DA70D6',
  },
  {
    name: 'FUCHSIA',
    hex: '#FF00FF',
  },
  {
    name: 'MAGENTA',
    hex: '#FF00FF',
  },
  {
    name: 'MEDIUM ORCHID',
    hex: '#BA55D3',
  },
  {
    name: 'MEDIUM PURPLE',
    hex: '#9370DB',
  },
  {
    name: 'REBECCA PURPLE',
    hex: '#663399',
  },
  {
    name: 'BLUE VIOLET',
    hex: '#8A2BE2',
  },
  {
    name: 'DARK VIOLET',
    hex: '#9400D3',
  },
  {
    name: 'DARK ORCHID',
    hex: '#9932CC',
  },
  {
    name: 'DARK MAGENTA',
    hex: '#8B008B',
  },
  {
    name: 'PURPLE',
    hex: '#800080',
  },
  {
    name: 'INDIGO',
    hex: '#4B0082',
  },
  {
    name: 'SLATE BLUE',
    hex: '#6A5ACD',
  },
  {
    name: 'DARK SLATE BLUE',
    hex: '#483D8B',
  },
  {
    name: 'MEDIUM SLATE BLUE',
    hex: '#7B68EE',
  },
  {
    name: 'GREEN YELLOW',
    hex: '#ADFF2F',
  },
  {
    name: 'CHARTREUSE',
    hex: '#7FFF00',
  },
  {
    name: 'LAWN GREEN',
    hex: '#7CFC00',
  },
  {
    name: 'LIME',
    hex: '#00FF00',
  },
  {
    name: 'LIME GREEN',
    hex: '#32CD32',
  },
  {
    name: 'PALE GREEN',
    hex: '#98FB98',
  },
  {
    name: 'LIGHT GREEN',
    hex: '#90EE90',
  },
  {
    name: 'MEDIUM SPRING GREEN',
    hex: '#00FA9A',
  },
  {
    name: 'SPRING GREEN',
    hex: '#00FF7F',
  },
  {
    name: 'MEDIUM SEA GREEN',
    hex: '#3CB371',
  },
  {
    name: 'SEA GREEN',
    hex: '#2E8B57',
  },
  {
    name: 'FOREST GREEN',
    hex: '#228B22',
  },
  {
    name: 'GREEN',
    hex: '#008000',
  },
  {
    name: 'DARK GREEN',
    hex: '#006400',
  },
  {
    name: 'YELLOW GREEN',
    hex: '#9ACD32',
  },
  {
    name: 'OLIVE DRAB',
    hex: '#6B8E23',
  },
  {
    name: 'OLIVE',
    hex: '#6B8E23',
  },
  {
    name: 'DARK OLIVE GREEN',
    hex: '#556B2F',
  },
  {
    name: 'MEDIUM AQUA MARINE',
    hex: '#66CDAA',
  },
  {
    name: 'DARK SEA GREEN',
    hex: '#8FBC8B',
  },
  {
    name: 'LIGHT SEA GREEN',
    hex: '#20B2AA',
  },
  {
    name: 'DARK CYAN',
    hex: '#008B8B',
  },
  {
    name: 'TEAL',
    hex: '#008080',
  },
  {
    name: 'AQUA',
    hex: '#00FFFF',
  },
  {
    name: 'CYAN',
    hex: '#00FFFF',
  },
  {
    name: 'LIGHT CYAN',
    hex: '#E0FFFF',
  },
  {
    name: 'PALE TURQUOISE',
    hex: '#AFEEEE',
  },
  {
    name: 'AQUAMARINE',
    hex: '#7FFFD4',
  },
  {
    name: 'TURQUOISE',
    hex: '#40E0D0',
  },
  {
    name: 'MEDIUM TURQUOISE',
    hex: '#48D1CC',
  },
  {
    name: 'DARK TURQUOISE',
    hex: '#00CED1',
  },
  {
    name: 'CADET BLUE',
    hex: '#5F9EA0',
  },
  {
    name: 'STEEL BLUE',
    hex: '#4682B4',
  },
  {
    name: 'LIGHT STEEL BLUE',
    hex: '#B0C4DE',
  },
  {
    name: 'POWDER BLUE',
    hex: '#B0E0E6',
  },
  {
    name: 'LIGHT BLUE',
    hex: '#ADD8E6',
  },
  {
    name: 'SKY BLUE',
    hex: '#87CEEB',
  },
  {
    name: 'LIGHT SKY BLUE',
    hex: '#87CEFA',
  },
  {
    name: 'DEEP SKY BLUE',
    hex: '#00BFFF',
  },
  {
    name: 'DODGER BLUE',
    hex: '#1E90FF',
  },
  {
    name: 'CORN FLOWER BLUE',
    hex: '#6495ED',
  },
  {
    name: 'ROYAL BLUE',
    hex: '#4169E1',
  },
  {
    name: 'BLUE',
    hex: '#0000FF',
  },
  {
    name: 'MEDIUM BLUE',
    hex: '#0000CD',
  },
  {
    name: 'DARK BLUE',
    hex: '#00008B',
  },
  {
    name: 'NAVY',
    hex: '#00008B',
  },
  {
    name: 'MIDNIGHT BLUE',
    hex: '#191970',
  },
  {
    name: 'CORN SILK',
    hex: '#FFF8DC',
  },
  {
    name: 'BLANCHED ALMOND',
    hex: '#FFEBCD',
  },
  {
    name: 'BISQUE',
    hex: '#FFE4C4',
  },
  {
    name: 'NAVAJO WHITE',
    hex: '#FFDEAD',
  },
  {
    name: 'WHEAT',
    hex: '#F5DEB3',
  },
  {
    name: 'BURLY WOOD',
    hex: '#DEB887',
  },
  {
    name: 'TAN',
    hex: '#D2B48C',
  },
  {
    name: 'ROSY BROWN',
    hex: '#BC8F8F',
  },
  {
    name: 'SANDY BROWN',
    hex: '#F4A460',
  },
  {
    name: 'GOLDENROD',
    hex: '#DAA520',
  },
  {
    name: 'DARK GOLDEN ROD',
    hex: '#B8860B',
  },
  {
    name: 'PERU',
    hex: '#CD853F',
  },
  {
    name: 'CHOCOLATE',
    hex: '#D2691E',
  },
  {
    name: 'SADDLE BROWN',
    hex: '#8B4513',
  },
  {
    name: 'SIENNA',
    hex: '#A0522D',
  },
  {
    name: 'BROWN',
    hex: '#A52A2A',
  },
  {
    name: 'MAROON',
    hex: '#800000',
  },
  {
    name: 'WHITE',
    hex: '#FFFFFF',
  },
  {
    name: 'SNOW',
    hex: '#FFFAFA',
  },
  {
    name: 'HONEY DEW',
    hex: '#F0FFF0',
  },
  {
    name: 'MINT CREAM',
    hex: '#F5FFFA',
  },
  {
    name: 'AZURE',
    hex: '#F0FFFF',
  },
  {
    name: 'ALICE BLUE',
    hex: '#F0F8FF',
  },
  {
    name: 'GHOST WHITE',
    hex: '#F8F8FF',
  },
  {
    name: 'WHITE SMOKE',
    hex: '#F5F5F5',
  },
  {
    name: 'SEA SHELL',
    hex: '#FFF5EE',
  },
  {
    name: 'BEIGE',
    hex: '#F5F5DC',
  },
  {
    name: 'OLD LACE',
    hex: '#FDF5E6',
  },
  {
    name: 'FLORAL WHITE',
    hex: '#FDF5E6',
  },
  {
    name: 'IVORY',
    hex: '#FFFFF0',
  },
  {
    name: 'ANTIQUE WHITE',
    hex: '#FAEBD7',
  },
  {
    name: 'LINEN',
    hex: '#FAF0E6',
  },
  {
    name: 'LAVENDER BLUSH',
    hex: '#FFF0F5',
  },
  {
    name: 'MISTY ROSE',
    hex: '#FFE4E1',
  },
  {
    name: 'GAINSBORO',
    hex: '#DCDCDC',
  },
  {
    name: 'LIGHT GRAY',
    hex: '#D3D3D3',
  },
  {
    name: 'SILVER',
    hex: '#C0C0C0',
  },
  {
    name: 'DARK GRAY',
    hex: '#A9A9A9',
  },
  {
    name: 'GRAY',
    hex: '#808080',
  },
  {
    name: 'DIMGRAY',
    hex: '#696969',
  },
  {
    name: 'LIGHT SLATE GRAY',
    hex: '#778899',
  },
  {
    name: 'SLATE GRAY',
    hex: '#708090',
  },
  {
    name: 'DARK SLATE GRAY',
    hex: '#2F4F4F',
  },
  {
    name: 'BLACK',
    hex: '#000000',
  },
];

/*
 * @function computeDistance
 *
 * @desc  Computes a numerical value of how difference between two hex color values
 *        for comparison in finding the closest HTML color value
 *
 * @param {String}    hex1: A hexadecimal number representing a color
 * @param {String}    hex2: A hexadecimal number representing a color
 *
 * @return {Number} A number representing the difference between two colors
 */

function computeDistance(hex1, hex2) {
  const rgb1 = {
    r: parseInt(hex1.substring(1, 2), 16),
    b: parseInt(hex1.substring(3, 4), 16),
    g: parseInt(hex1.substring(5, 6), 16),
  };

  const rgb2 = {
    r: parseInt(hex2.substring(1, 2), 16),
    b: parseInt(hex2.substring(3, 4), 16),
    g: parseInt(hex2.substring(5, 6), 16),
  };

  return (
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
}

/*
 * @function getHTMLColorName
 *
 * @desc  Returns a text description of a System Color based on HTML Color values
 *
 * @param {String}   systemColorName: Name of a system color
 * @param {String}          colorHex: A hexadecimal number representing a color
 *
 * @return {String) see @desc
 */

function getHTMLColorName(systemColorName, colorHex) {
  // Check for transparent

  if (colorHex[0] !== '#') {
    return `${systemColorName} is ${colorHex}`;
  }

  for (let i = 0; i < htmlColorValues.length; i += 1) {
    const v = htmlColorValues[i];
    if (v.hex.toLowerCase() === colorHex) {
      return `${systemColorName} is ${v.name.toLowerCase()}`;
    }
  }

  // See if shade of gray
  if (
    colorHex.substring(1, 2) === colorHex.substring(3, 4) &&
    colorHex.substring(1, 2) === colorHex.substring(5, 6)
  ) {

    switch (colorHex[1]) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
        return `${systemColorName} is a dark shade of gray`;

      case 'b':
      case 'c':
      case 'd':
      case 'e':
      case 'f':
        return `${systemColorName} is a light shade of gray`;

      default:
        return `${systemColorName} is shade of gray`;
    }
  }

  // Look for closest color

  let closestValue = htmlColorValues[0];
  let closestComputedDistance = computeDistance(closestValue.hex, colorHex);

  htmlColorValues.forEach((v) => {
    const cd = computeDistance(v.hex, colorHex);
    if (cd < closestComputedDistance) {
      closestValue = v;
      closestComputedDistance = cd;
    }
  });

  return `${systemColorName} is similar to ${closestValue.name.toLowerCase()}`;
}

const systemColorValues = [
  {
    value: 'AccentColor',
    name: 'Accent color',
    desc: 'Background of accented user interface controls',
  },
  {
    value: 'AccentColorText',
    name: 'Accent color text',
    desc: 'Text of accented user interface controls',
  },
  {
    value: 'ActiveText',
    name: 'Active text',
    desc: 'Text of active links',
  },
  {
    value: 'ButtonBorder',
    name: 'Button border',
    desc: 'Base border color of controls',
  },
  {
    value: 'ButtonFace',
    name: 'Button face',
    desc: 'Background color of controls',
  },
  {
    value: 'ButtonText',
    name: 'Button text',
    desc: 'Text color of controls',
  },
  {
    value: 'Canvas',
    name: 'Canvas',
    desc: 'Background of application content or documents',
  },
  {
    value: 'CanvasText',
    name: 'Canvas text',
    desc: 'Text color in application content or documents',
  },
  {
    value: 'Field',
    name: 'Field',
    desc: 'Background of input fields',
  },
  {
    value: 'FieldText',
    name: 'Field text',
    desc: 'Text in input fields',
  },
  {
    value: 'GrayText',
    name: 'Gray text',
    desc: 'Text color for disabled items (e.g. a disabled control)',
  },
  {
    value: 'Highlight',
    name: 'Highlight',
    desc: 'Background of selected items',
  },
  {
    value: 'HighlightText',
    name: 'Highlight text',
    desc: 'Text color of selected items',
  },
  {
    value: 'LinkText',
    name: 'Link text',
    desc: 'Text of non-active, non-visited links',
  },
  {
    value: 'Mark',
    name: 'Mark',
    desc: 'Background of text that has been specially marked (such as by the HTML mark element)',
  },
  {
    value: 'MarkText',
    name: 'Mark text',
    desc: 'Text that has been specially marked (such as by the HTML mark element)',
  },
  {
    value: 'SelectedItem',
    name: 'Selected item',
    desc: 'Background of selected items, for example, a selected checkbox',
  },
  {
    value: 'SelectedItemText',
    name: 'Selected item text',
    desc: 'Text of selected items',
  },
  {
    value: 'VisitedText',
    name: 'Visited text',
    desc: 'Text of visited links',
  },
];

/*
 * @function rgb2Hex
 *
 * @desc  Converts a RGB color to its equivalent hex color value
 *
 * @param {String}   rgb: The color of in RGB format
 *
 * @return {String) d=see @desc
 */

function rgb2Hex(rgb) {
  // Choose correct separator
  let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
  // Turn "rgb(r,g,b)" into [r,g,b]
  rgb = rgb.split('(')[1].split(')')[0].split(sep);

  let a = rgb[3] ? parseFloat(rgb[3]) : 1;

  if (a < 0.01) {
    return 'transparent';
  }

  let r = Math.round(parseInt(rgb[0]) * a).toString(16),
    g = Math.round(parseInt(rgb[1]) * a).toString(16),
    b = Math.round(parseInt(rgb[2]) * a).toString(16);

  if (r.length == 1) {
    r = '0' + r;
  }
  if (g.length == 1) {
    g = '0' + g;
  }
  if (b.length == 1) {
    b = '0' + b;
  }

  return '#' + r + g + b;
}

// Fill in System color table

window.addEventListener('load', () => {
  const tbodyNode = document.getElementById('samples');

  systemColorValues.forEach((v) => {
    if (v.value) {
      const tr = document.createElement('tr');
      const tdv = document.createElement('td');
      tdv.textContent = v.value;
      tr.appendChild(tdv);
      const tds = document.createElement('td');
      const div = document.createElement('div');
      div.role = 'img';
      div.classList.add('sample');
      div.style.backgroundColor = v.value;
      tds.appendChild(div);
      tr.appendChild(tds);
      const tdc = document.createElement('td');
      tdc.style.fontFamily = 'monospace';
      tdc.textContent = '??';
      tr.appendChild(tdc);
      const tdd = document.createElement('td');
      tdd.textContent = v.desc;
      tr.appendChild(tdd);
      tbodyNode.appendChild(tr);
      const cStyle = window.getComputedStyle(div);
      const colorHex = rgb2Hex(cStyle.backgroundColor);
      tdc.textContent = colorHex;
      div.ariaLabel = getHTMLColorName(v.name, colorHex);
    }
  });
});
