export const ISO_DEFAULTS = Object.freeze({
  tileWidth: 128,
  tileHeight: 64,
  originX: 1600,
  originY: 260,
})

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function lerp(start, end, progress) {
  return start + (end - start) * progress
}

export function inverseLerp(start, end, value) {
  if (start === end) return 0
  return clamp((value - start) / (end - start), 0, 1)
}

export function mapRange(value, inMin, inMax, outMin, outMax) {
  return lerp(outMin, outMax, inverseLerp(inMin, inMax, value))
}

export function roundTo(value, precision = 1) {
  if (!Number.isFinite(precision) || precision <= 0) return Math.round(value)
  return Math.round(value / precision) * precision
}

/**
 * Projects an isometric grid coordinate onto the world's 2D screen plane.
 * Elevation is expressed in screen pixels so assets can share the same grid
 * while retaining precise art-directed heights.
 */
export function isoToScreen(gridX, gridY, elevation = 0, options = {}) {
  const {
    tileWidth = ISO_DEFAULTS.tileWidth,
    tileHeight = ISO_DEFAULTS.tileHeight,
    originX = ISO_DEFAULTS.originX,
    originY = ISO_DEFAULTS.originY,
  } = options

  return {
    x: originX + (gridX - gridY) * (tileWidth / 2),
    y: originY + (gridX + gridY) * (tileHeight / 2) - elevation,
  }
}

/**
 * Produces a stable z-index from a world-space y coordinate. `layer` is a
 * small local offset for props that share the same baseline.
 */
export function depthFor(screenY, layer = 0, base = 1000) {
  return base + Math.round(screenY * 10) + layer
}

/**
 * Converts a camera stop into GSAP-ready transform values. The formula keeps
 * the focus point centered even when a subtle 2D camera rotation is applied.
 */
export function cameraTransformFor(
  stop,
  viewport = { width: 1440, height: 900 },
) {
  const zoom = clamp(Number(stop?.zoom) || 1, 0.05, 4)
  const rotation = Number(stop?.rotation) || 0
  const focusX = Number(stop?.focus?.x) || 0
  const focusY = Number(stop?.focus?.y) || 0
  const width = Math.max(1, Number(viewport.width) || 1440)
  const height = Math.max(1, Number(viewport.height) || 900)
  const radians = (rotation * Math.PI) / 180
  const cosine = Math.cos(radians)
  const sine = Math.sin(radians)
  const scaledX = focusX * zoom
  const scaledY = focusY * zoom

  return {
    x: Math.round(width / 2 - (scaledX * cosine - scaledY * sine)),
    y: Math.round(height / 2 - (scaledX * sine + scaledY * cosine)),
    scale: zoom,
    rotation,
    transformOrigin: '0 0',
  }
}

/** Mulberry32: compact deterministic PRNG for repeatable world decoration. */
export function createSeededRandom(seed = 1) {
  let state = Number(seed) >>> 0

  return function seededRandom() {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export function randomBetween(random, min, max) {
  return lerp(min, max, random())
}

export function randomInt(random, min, max) {
  return Math.floor(randomBetween(random, min, max + 1))
}

export function pickFrom(random, values) {
  if (!values.length) return undefined
  return values[Math.min(values.length - 1, Math.floor(random() * values.length))]
}
