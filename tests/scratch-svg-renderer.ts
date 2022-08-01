import * as SvgRenderer from 'scratch-svg-renderer';

const svg = SvgRenderer.loadSvgString('imagine that this is an SVG', false);
const serialized = SvgRenderer.serializeSvgToString(svg);
const inlinedFonts = SvgRenderer.inlineSvgFonts('an svg here');
const fixedFonts = SvgRenderer.convertFonts(SvgRenderer.SvgElement.create('svg'));

const bitmapAdapter = new SvgRenderer.BitmapAdapter();
