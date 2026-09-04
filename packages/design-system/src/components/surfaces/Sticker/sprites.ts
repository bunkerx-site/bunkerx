/**
 * The intrinsic size of each cut-out, as [width, height].
 *
 * Used only to give every sticker its width and height attributes, so the
 * browser reserves the right box before the image loads and the page does not
 * shift underneath the reader.
 *
 * Generated from the artwork — do not hand-edit. Each cut-out was isolated by
 * masking everything in its bounding box that belongs to a different sticker;
 * the sheet's stickers touch, so a plain rectangular crop carried pieces of the
 * neighbours with it.
 */
export const STICKER_SIZES = {
  'abduction': [306, 317],
  'all-seeing-eye': [170, 146],
  'aurora': [104, 279],
  'camera': [219, 196],
  'case-folder': [282, 219],
  'drip-green': [83, 68],
  'earth': [480, 475],
  'filmstrip': [140, 223],
  'galaxy-spiral': [252, 241],
  'galaxy-void': [231, 292],
  'grey-portrait': [216, 336],
  'map-screen': [258, 231],
  'moon-crescent': [46, 85],
  'moon-full': [126, 127],
  'moon-gibbous': [61, 102],
  'moon-half': [61, 98],
  'moon-sliver': [31, 66],
  'nebula-shard': [152, 287],
  'night-vision': [257, 161],
  'note-closed': [228, 214],
  'note-truth': [229, 183],
  'photo-ufo': [219, 251],
  'radar': [229, 228],
  'radio-dishes': [216, 316],
  'ring': [87, 120],
  'sketch-grey': [183, 236],
  'specimen': [150, 286],
  'stroke-green': [115, 32],
  'stroke-purple': [138, 23],
  'stroke-purple-alt': [119, 34],
  'tape-look-up': [265, 120],
  'tape-not-alone': [259, 138],
  'tower': [214, 425],
  'ufo-beam': [306, 344],
  'waveform': [314, 65],
} as const

export type StickerName = keyof typeof STICKER_SIZES
