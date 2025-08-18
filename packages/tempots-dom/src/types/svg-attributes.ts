/**
 * Represents the attributes that can be used in SVG elements.
 *
 * @public
 */
export type SVGAttributes = {
  'accent-height': number | string
  accumulate: 'none' | 'sum'
  additive: 'replace' | 'sum'
  'alignment-baseline':
    | 'auto'
    | 'baseline'
    | 'before-edge'
    | 'text-before-edge'
    | 'middle'
    | 'central'
    | 'after-edge'
    | 'text-after-edge'
    | 'ideographic'
    | 'alphabetic'
    | 'hanging'
    | 'mathematical'
    | 'inherit'
  'allow-reorder': 'no' | 'yes'
  alphabetic: number | string
  amplitude: number | string
  'arabic-form': 'initial' | 'medial' | 'terminal' | 'isolated'
  ascent: number | string
  attributeName: string
  attributeType: 'CSS' | 'XML' | 'auto'
  autoReverse: boolean | string
  azimuth: number | string
  baseFrequency: number | string
  baseProfile: string
  'baseline-shift': number | string
  bbox: string
  begin: string
  bias: number | string
  by: string
  calcMode: 'discrete' | 'linear' | 'paced' | 'spline'
  'cap-height': number | string
  class: string
  clip: string
  'clip-path': string
  clipPathUnits: 'userSpaceOnUse' | 'objectBoundingBox'
  clipRule: 'nonzero' | 'evenodd' | 'inherit'
  'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit'
  'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit'
  'color-profile': string
  'color-rendering': 'auto' | 'optimizeSpeed' | 'optimizeQuality' | 'inherit'
  contentScriptType: string
  contentStyleType: string
  crossorigin: 'anonymous' | 'use-credentials'
  cursor: string
  cx: number | string
  cy: number | string
  d: string
  decelerate: number | string
  descent: number | string
  diffuseConstant: number | string
  direction: 'ltr' | 'rtl' | 'inherit'
  display: string
  divisor: number | string
  'dominant-baseline':
    | 'auto'
    | 'text-bottom'
    | 'alphabetic'
    | 'ideographic'
    | 'middle'
    | 'central'
    | 'mathematical'
    | 'hanging'
    | 'text-top'
    | 'inherit'
  dur: string
  dx: number | string
  dy: number | string
  edgeMode: 'duplicate' | 'wrap' | 'none'
  elevation: number | string
  'enable-background': string
  end: string
  exponent: number | string
  externalResourcesRequired: boolean | string
  fill: string
  'fill-opacity': number | string
  'fill-rule': 'nonzero' | 'evenodd' | 'inherit'
  filter: string
  filterRes: string
  filterUnits: 'userSpaceOnUse' | 'objectBoundingBox'
  'flood-color': string
  'flood-opacity': number | string
  focusable: boolean | 'auto' | string
  'font-family': string
  'font-size': number | string
  'font-size-adjust': number | string
  'font-stretch': string
  'font-style': 'normal' | 'italic' | 'oblique' | 'inherit'
  'font-variant': string
  'font-weight': string
  format: string
  fr: number | string
  from: string
  fx: number | string
  fy: number | string
  g1: string
  g2: string
  'glyph-name': string
  'glyph-orientation-horizontal': number | string
  'glyph-orientation-vertical': number | string
  glyphRef: string
  gradientTransform: string
  gradientUnits: 'userSpaceOnUse' | 'objectBoundingBox'
  hanging: number | string
  height: number | string
  'horiz-adv-x': number | string
  'horiz-origin-x': number | string
  'horiz-origin-y': number | string
  href: string
  id: string
  ideographic: number | string
  'image-rendering': 'auto' | 'optimizeSpeed' | 'optimizeQuality' | 'inherit'
  in: string
  in2: string
  intercept: number | string
  k: number | string
  k1: number | string
  k2: number | string
  k3: number | string
  k4: number | string
  kernelMatrix: string
  kernelUnitLength: number | string
  kerning: number | string
  keyPoints: string
  keySplines: string
  keyTimes: string
  lang: string
  lengthAdjust: 'spacing' | 'spacingAndGlyphs'
  'letter-spacing': number | string
  'lighting-color': string
  limitingConeAngle: number | string
  local: string
  'marker-end': string
  markerHeight: number | string
  'marker-mid': string
  'marker-start': string
  markerUnits: 'userSpaceOnUse' | 'strokeWidth'
  markerWidth: number | string
  mask: string
  maskContentUnits: 'userSpaceOnUse' | 'objectBoundingBox'
  maskUnits: 'userSpaceOnUse' | 'objectBoundingBox'
  mathematical: number | string
  max: string
  media: string
  method: 'align' | 'stretch'
  min: string
  mode: 'normal' | 'multiply' | 'screen' | 'darken' | 'lighten'
  name: string
  numOctaves: number | string
  offset: number | string
  opacity: number | string
  operator: 'over' | 'in' | 'out' | 'atop' | 'xor' | 'lighter' | 'arithmetic'
  order: number | string
  orient: 'auto' | 'auto-start-reverse' | number | string
  orientation: 'h' | 'v'
  origin: string
  overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit'
  'overline-position': number | string
  'overline-thickness': number | string
  'paint-order': string
  'panose-1': string
  path: string
  pathLength: number | string
  patternContentUnits: 'userSpaceOnUse' | 'objectBoundingBox'
  patternTransform: string
  patternUnits: 'userSpaceOnUse' | 'objectBoundingBox'
  'pointer-events':
    | 'bounding-box'
    | 'visiblePainted'
    | 'visibleFill'
    | 'visibleStroke'
    | 'visible'
    | 'painted'
    | 'fill'
    | 'stroke'
    | 'all'
    | 'none'
    | 'inherit'
  points: string
  pointsAtX: number | string
  pointsAtY: number | string
  pointsAtZ: number | string
  preserveAlpha: boolean | string
  preserveAspectRatio: string
  primitiveUnits: 'userSpaceOnUse' | 'objectBoundingBox'
  r: number | string
  radius: number | string
  refX: number | string
  refY: number | string
  'rendering-intent':
    | 'auto'
    | 'perceptual'
    | 'relative-colorimetric'
    | 'saturation'
    | 'absolute-colorimetric'
    | 'inherit'
  repeatCount: number | string
  repeatDur: string
  requiredExtensions: string
  requiredFeatures: string
  restart: 'always' | 'whenNotActive' | 'never'
  result: string
  role: string
  rotate: number | string
  rx: number | string
  ry: number | string
  scale: number | string
  seed: number | string
  'shape-rendering':
    | 'auto'
    | 'optimizeSpeed'
    | 'crispEdges'
    | 'geometricPrecision'
    | 'inherit'
  side: 'left' | 'right'
  slope: number | string
  spacing: 'auto' | 'exact'
  specularConstant: number | string
  specularExponent: number | string
  speed: number | string
  spreadMethod: 'pad' | 'reflect' | 'repeat'
  startOffset: number | string
  stdDeviation: number | string
  stemh: number | string
  stemv: number | string
  stitchTiles: 'noStitch' | 'stitch'
  'stop-color': string
  'stop-opacity': number | string
  'strikethrough-position': number | string
  'strikethrough-thickness': number | string
  string: string
  stroke: string
  'stroke-dasharray': string
  'stroke-dashoffset': number | string
  'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit'
  'stroke-linejoin': 'miter' | 'round' | 'bevel' | 'inherit'
  'stroke-miterlimit': number | string
  'stroke-opacity': number | string
  'stroke-width': number | string
  style: string
  surfaceScale: number | string
  systemLanguage: string
  tabindex: number | string
  tableValues: string
  target: string
  targetX: number | string
  targetY: number | string
  'text-anchor': 'start' | 'middle' | 'end' | 'inherit'
  'text-decoration':
    | 'none'
    | 'underline'
    | 'overline'
    | 'line-through'
    | 'blink'
    | 'inherit'
  textLength: number | string
  'text-rendering':
    | 'auto'
    | 'optimizeSpeed'
    | 'optimizeLegibility'
    | 'geometricPrecision'
    | 'inherit'
  title: string
  to: string
  transform: string
  'transform-origin': string
  type: string
  u1: string
  u2: string
  'underline-position': number | string
  'underline-thickness': number | string
  unicode: string
  'unicode-bidi':
    | 'normal'
    | 'embed'
    | 'isolate'
    | 'bidi-override'
    | 'isolate-override'
    | 'plaintext'
    | 'inherit'
  'unicode-range': string
  'units-per-em': number | string
  'v-alphabetic': number | string
  values: string
  'vector-effect':
    | 'none'
    | 'non-scaling-stroke'
    | 'non-scaling-size'
    | 'non-rotation'
    | 'fixed-position'
  version: string
  'vert-adv-y': number | string
  'vert-origin-x': number | string
  'vert-origin-y': number | string
  'v-hanging': number | string
  'v-ideographic': number | string
  viewBox: string
  viewTarget: string
  visibility: 'visible' | 'hidden' | 'collapse' | 'inherit'
  'v-mathematical': number | string
  width: number | string
  widths: string
  'word-spacing': number | string
  'writing-mode': 'lr-tb' | 'rl-tb' | 'tb-rl' | 'lr' | 'rl' | 'tb' | 'inherit'
  x1: number | string
  x2: number | string
  x: number | string
  xChannelSelector: 'R' | 'G' | 'B' | 'A'
  'x-height': number | string
  'xlink:actuate': 'onLoad' | 'onRequest' | 'other' | 'none'
  'xlink:arcrole': string
  'xlink:href': string
  'xlink:role': string
  'xlink:show': 'new' | 'replace' | 'embed' | 'other' | 'none'
  'xlink:title': string
  'xlink:type':
    | 'simple'
    | 'extended'
    | 'locator'
    | 'arc'
    | 'resource'
    | 'title'
    | 'none'
  xlinkActuate: 'onLoad' | 'onRequest' | 'other' | 'none'
  xlinkArcrole: string
  xlinkHref: string
  xlinkRole: string
  xlinkShow: 'new' | 'replace' | 'embed' | 'other' | 'none'
  xlinkTitle: string
  xlinkType:
    | 'simple'
    | 'extended'
    | 'locator'
    | 'arc'
    | 'resource'
    | 'title'
    | 'none'
  'xml:base': string
  'xml:lang': string
  'xml:space': 'default' | 'preserve'
  xmlBase: string
  xmlLang: string
  xmlns: string
  'xmlns:xlink': string
  xmlnsXlink: string
  xmlSpace: 'default' | 'preserve'
  y1: number | string
  y2: number | string
  y: number | string
  yChannelSelector: 'R' | 'G' | 'B' | 'A'
  z: number | string
  zoomAndPan: 'disable' | 'magnify'
}
