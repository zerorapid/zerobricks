/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function cleanSVG(svg: string): string {
  return svg
    .replace(/<\?xml.*?\?>/gi, '')
    .replace(/<!DOCTYPE.*?>/gi, '')
    .replace(/<!--[\s\S]*?-->/gi, '')
    .replace(/<metadata>[\s\S]*?<\/metadata>/gi, '')
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .trim();
}

export function toCamelCase(str: string): string {
  return str.replace(/-([a-z0-9])/g, (g) => g[1].toUpperCase());
}

export function transformAttributes(svg: string): string {
  const attrs = [
    'accent-height', 'alignment-baseline', 'arabic-form', 'baseline-shift', 'cap-height', 'clip-path',
    'clip-rule', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering',
    'dominant-baseline', 'enable-background', 'fill-opacity', 'fill-rule', 'flood-color', 'flood-opacity',
    'font-family', 'font-size', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'glyph-name',
    'glyph-orientation-horizontal', 'glyph-orientation-vertical', 'horiz-adv-x', 'horiz-origin-x',
    'image-rendering', 'letter-spacing', 'lighting-color', 'marker-end', 'marker-mid', 'marker-start',
    'overline-position', 'overline-thickness', 'paint-order', 'panose-1', 'pointer-events', 'rendering-intent',
    'shape-rendering', 'stop-color', 'stop-opacity', 'strikethrough-position', 'strikethrough-thickness',
    'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit',
    'stroke-opacity', 'stroke-width', 'text-anchor', 'text-decoration', 'text-rendering', 'underline-position',
    'underline-thickness', 'unicode-bidi', 'unicode-range', 'units-per-em', 'v-alphabetic', 'v-hanging',
    'v-ideographic', 'v-mathematical', 'vector-effect', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y',
    'word-spacing', 'writing-mode', 'x-height'
  ];

  let result = svg;
  attrs.forEach(attr => {
    const regex = new RegExp(`\\s${attr}=`, 'g');
    result = result.replace(regex, ` ${toCamelCase(attr)}=`);
  });

  result = result.replace(/\sclass=/g, ' className=');
  
  // Handle <style> tags content for React/JSX
  result = result.replace(/<style>([\s\S]*?)<\/style>/gi, (match, content) => {
    return `<style>{\`${content.trim()}\`}</style>`;
  });

  return result;
}

export function extractColors(svg: string): string[] {
  const hexRegex = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;
  const rgbRegex = /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g;
  const rgbaRegex = /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/g;
  
  const matches = new Set<string>();
  
  (svg.match(hexRegex) || []).forEach(c => matches.add(c));
  (svg.match(rgbRegex) || []).forEach(c => matches.add(c));
  (svg.match(rgbaRegex) || []).forEach(c => matches.add(c));
  
  const attrRegex = /(?:fill|stroke|stop-color|flood-color|lighting-color)\s*[:=]\s*["']?([a-zA-Z]+)["']?/gi;
  let match;
  while ((match = attrRegex.exec(svg)) !== null) {
    const color = match[1];
    if (color && !['none', 'currentColor', 'inherit', 'transparent', 'url'].includes(color.toLowerCase())) {
      matches.add(color);
    }
  }

  return Array.from(matches);
}

export function normalizeToHex(color: string): string {
  if (!color) return '#000000';
  
  const c = color.trim().toLowerCase();
  
  if (c.startsWith('#')) {
    if (c.length === 4) {
      return '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
    }
    return c.length === 7 || c.length === 9 ? c.slice(0, 7) : '#000000';
  }
  
  if (c.startsWith('rgb')) {
    const parts = c.match(/\d+/g);
    if (parts && parts.length >= 3) {
      const r = parseInt(parts[0]).toString(16).padStart(2, '0');
      const g = parseInt(parts[1]).toString(16).padStart(2, '0');
      const b = parseInt(parts[2]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
  }

  const named: Record<string, string> = {
    black: '#000000', white: '#ffffff', gray: '#808080', grey: '#808080',
    red: '#ff0000', green: '#008000', blue: '#0000ff', yellow: '#ffff00',
    purple: '#800080', orange: '#ffa500', pink: '#ffc0cb', brown: '#a52a2a'
  };
  
  return named[c] || '#000000';
}

export function replaceColor(svg: string, oldColor: string, newColor: string): string {
  // Escape special characters in color string for regex
  const escapedColor = oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Use boundary checks to avoid replacing parts of words/ids
  // We use lookbehind if possible, but for compatibility we can try to be specific
  // about the context (within quotes or after colon or as a full property value)
  const regex = new RegExp(`(["':\\s])${escapedColor}(["';\\s])`, 'gi');
  return svg.replace(regex, `$1${newColor}$2`);
}

export function convertToUniversalCode(svg: string, name: string = 'Icon'): string {
  const cleaned = transformAttributes(cleanSVG(svg));
  const match = cleaned.match(/<svg([\s\S]*?)>([\s\S]*?)<\/svg>/i);
  if (!match) return '// Invalid SVG';

  const props = match[1].replace(/style=".*?"/g, '').trim();
  const inner = match[2].trim();
  const componentName = name.charAt(0).toUpperCase() + name.slice(1).replace(/[^a-zA-Z0-9]/g, '');

  return `import React, { forwardRef } from 'react';

export const ${componentName} = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
  <svg
    ${props}
    ref={ref}
    {...props}
  >
    ${inner.split('\n').join('\n    ')}
  </svg>
));

${componentName}.displayName = '${componentName}';`;
}

export function convertToStandardSVG(svg: string): string {
  let cleaned = cleanSVG(svg);
  
  // Ensure xmlns is present if not already there
  if (!/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/i.test(cleaned)) {
    cleaned = cleaned.replace(/<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  // Simple formatting: add newlines between tags if they aren't there
  const formatted = cleaned
    .replace(/>\s*</g, '>\n<')
    .split('\n')
    .map((line, i, arr) => {
      // Very basic indentation logic
      let indent = 0;
      for (let j = 0; j < i; j++) {
        if (arr[j].includes('<') && !arr[j].includes('</') && !arr[j].includes('/>')) indent++;
        if (arr[j].includes('</')) indent--;
      }
      return '  '.repeat(Math.max(0, indent)) + line.trim();
    })
    .join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>\n${formatted}`;
}
