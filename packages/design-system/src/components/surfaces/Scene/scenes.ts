/**
 * The full illustrations, as opposed to the sticker sheet's cut-outs.
 *
 * A scene is a whole picture with its own ground and light — every abduction
 * here is a saucer, a beam, whatever is being taken, and the patch of field it
 * was lifted off. That is a different kind of asset from a sticker, and it is
 * why these are not in `sprites.ts`: a sticker is a hand-pressed decoration
 * sized by width and free to sit at any angle, a scene is anchored, level, and
 * sized against the height of the screen it has to fit inside.
 *
 * `widths` are the files that exist, smallest first, and feed the `srcset`. A
 * phone has no use for the full-size file: the small variant is a third of the
 * bytes and there is no visible difference at the size it renders.
 *
 * WebP only, with no PNG beside it. These are photographic renders with soft
 * alpha, which is the case WebP wins by the largest margin — one of these is
 * 2.3 MB as a raw PNG and 433 KB quantised, against 312 KB here — and every
 * browser that can run the site has supported alpha in WebP for years.
 *
 * All six came in with a mint-green beam sitting around hue 124–136°, well
 * off the brand's 146°, and each was pulled onto it before export: the shift
 * is weighted by how green and how saturated a pixel is, so the beam moves and
 * the black-and-white hide, the grey debris and the weathered fence do not.
 * The purple in the renders was already the brand purple and was left alone.
 */

/**
 * Where the light is in a picture, so an effect can be registered to the
 * artwork instead of guessed at.
 *
 * Every number was measured off the file rather than eyeballed: the beam was
 * isolated as the bright, opaque, green-dominant pixels, its half-width read
 * off row by row, and a line fitted through the rows between the emitter and
 * the ground glow. That matters because these drive a `clip-path` — a cone
 * traced a few per cent wide of the painted one puts motes in the dark beside
 * the beam, which reads as dirt on the screen rather than as light. The fitted
 * spread is then taken in slightly, because a clip just inside the beam is
 * invisible and a clip just outside it is not.
 *
 * All values are percentages of the artwork's own box, so they hold at every
 * rendered size.
 */
export type SceneBeam = {
  /** Where the beam leaves the emitter, as [x, y]. */
  apex: [number, number]
  /** Half the beam's width at the apex. */
  apexSpread: number
  /** The bottom of the beam, where it meets the ground. */
  baseY: number
  /** Half the beam's width at the base. */
  baseSpread: number
  /**
   * What the beam has hold of, as [x, y] — the cow, the alien, the man.
   *
   * The one place in the picture where the effect should be doing something
   * other than travelling: a field gripping an object is not the same gesture
   * as a field carrying dust, so this is where the aura sits and what the
   * sparks circle. Without it the beam is a conveyor and the subject is
   * scenery that happens to be inside it.
   */
  grip?: [number, number]
  /**
   * How far the sparks swing out from the grip, as a percentage of the
   * artwork's width. Has to stay inside the cone at the grip's own height, or
   * the ring passes out of the light: the cone's half-width there is
   * `apexSpread + (baseSpread - apexSpread) * (gripY - apexY) / (baseY - apexY)`.
   */
  gripSpread?: number
  /**
   * Diameter of the aura, as a fraction of the artwork's height.
   *
   * Set a little larger than the subject so the glow reads as a field around
   * it rather than as a spot on it. One value cannot serve all six — the cow
   * fills 23% of its picture's height and the woman 43% — and an aura sized
   * for the woman swallows the cow whole.
   */
  auraSize?: number
  /**
   * How many of the caller's motes this artwork can carry, 0–1.
   *
   * Measured, not guessed: it is derived from how much of each cone is already
   * occupied by painted debris. The cow's beam is 17% debris and takes a full
   * field; the woman's is 47%, and a full field there stops reading as light
   * in the beam and starts reading as noise over it.
   */
  density?: number
}

type SceneEntry = {
  /** Intrinsic size of the largest file, for the aspect ratio. */
  size: readonly [number, number]
  widths: readonly number[]
  beam: SceneBeam
}

/*
 * Calibrated per artwork. The six renders share a composition but are not the
 * same picture, and every number below came out different when measured:
 *
 *   scene       cone at apex   at base   subject extent   debris in cone
 *   cow             7.9%         36.0%     27 x 23%           16.8%
 *   alien           8.8%         40.7%     39 x 35%           34.1%
 *   man             8.9%         37.8%     36 x 27%           36.0%
 *   astronaut       8.7%         38.8%     30 x 38%           39.3%
 *   cat            10.5%         35.7%     35 x 25%           40.4%
 *   woman          11.4%         38.2%     47 x 43%           46.6%
 *
 * The cone came from fitting a line through the beam's half-width row by row;
 * the subject from the largest connected mass of opaque non-beam pixels
 * between the saucer and the ground; the debris from what share of the cone
 * that same test claims outside the subject. The first pass at these was
 * eyeballed off one artwork and applied to the rest, and the overlay showed
 * it plainly: cones a good five points too narrow, and aura crosshairs
 * sitting beside the subject rather than on it.
 */
export const SCENES = {
  'abduction-cow': {
    size: [978, 1443],
    widths: [560, 978],
    beam: {
      apex: [51.3, 30],
      apexSpread: 7,
      baseY: 95,
      baseSpread: 35,
      grip: [52, 49],
      /* Tightest ring of the six: the cow sits high, where the cone is only
         15% wide, so anything further out leaves the light. */
      gripSpread: 13,
      auraSize: 0.26,
      /* The one sparse beam. It takes a full field of motes. */
      density: 0.9,
    },
  },
  'abduction-alien': {
    size: [987, 1516],
    widths: [560, 987],
    beam: {
      apex: [51, 30],
      apexSpread: 8,
      baseY: 95,
      baseSpread: 39,
      grip: [49, 48],
      gripSpread: 16,
      /* Widest subject: it hangs across the beam with an arm raised. */
      auraSize: 0.34,
      density: 0.64,
    },
  },
  'abduction-man': {
    size: [979, 1492],
    widths: [560, 979],
    beam: {
      apex: [50.6, 30],
      apexSpread: 8,
      baseY: 95,
      baseSpread: 37,
      /* He comes up with his furniture, and the chair going past at y 37%
         drags a naive centroid upward — this is the torso. */
      grip: [51, 53],
      gripSpread: 16,
      auraSize: 0.3,
      density: 0.61,
    },
  },
  'abduction-astronaut': {
    size: [984, 1513],
    widths: [560, 984],
    beam: {
      apex: [49.6, 30],
      apexSpread: 8,
      baseY: 95,
      baseSpread: 37.5,
      grip: [51, 52],
      gripSpread: 16,
      /* Tallest subject bar the woman, at 38% of the picture's height. */
      auraSize: 0.34,
      density: 0.56,
    },
  },
  'abduction-cat': {
    size: [975, 1492],
    widths: [560, 975],
    beam: {
      /* Wide apex: 10.5%, against 8–9% in all but the woman. */
      apex: [51.1, 30],
      apexSpread: 9.5,
      baseY: 95,
      baseSpread: 34.5,
      /* The laptop and the open book below the cat join it as one mass, which
         pulls the measured centroid to y 57%; the cat itself is higher. */
      grip: [52, 53],
      gripSpread: 16,
      auraSize: 0.28,
      density: 0.54,
    },
  },
  'abduction-woman': {
    size: [893, 1344],
    widths: [560, 893],
    beam: {
      apex: [50, 30],
      apexSpread: 10,
      /*
       * The odd one out: this render has no fence and no patch of field. The
       * beam simply runs out, tapering back in below y 88% and gone by y 95%,
       * so the cone stops where the beam is widest instead of where it meets
       * the ground. Carrying the base down to 95% like the others would put
       * motes in the empty air under it.
       */
      baseY: 88,
      baseSpread: 32,
      grip: [52, 54],
      gripSpread: 16,
      auraSize: 0.34,
      /* Busiest cone of the six, at 47% debris: rocks throughout, plus a
         laptop, a backpack, headphones, a notebook and a coffee. */
      density: 0.45,
    },
  },
} as const satisfies Record<string, SceneEntry>

export type SceneName = keyof typeof SCENES

/**
 * Every abduction, as a set to draw one from.
 *
 * The first fold picks from these on each visit rather than being built around
 * one of them. The page is about things that are not supposed to be there, and
 * a screen that is not quite the same as the one you saw last time is the
 * cheapest way for a site to be that — a returning listener gets the cow, then
 * the astronaut, then the cat, and the fold reads as a transmission rather
 * than as a page.
 *
 * Only the picked file is ever downloaded, so the variety is free. What it
 * costs is preloading: the browser cannot know from the markup which one to
 * fetch, which is why the fold's scene carries `eager` and a high fetch
 * priority to get it started the moment the script runs.
 */
export const ABDUCTIONS = [
  'abduction-cow',
  'abduction-alien',
  'abduction-man',
  'abduction-astronaut',
  'abduction-cat',
  'abduction-woman',
] as const satisfies readonly SceneName[]
