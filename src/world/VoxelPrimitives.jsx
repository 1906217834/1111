import React from 'react'

export const WORLD_PALETTE = Object.freeze({
  ink: '#050505',
  dark: '#181818',
  graphite: '#4d4d4d',
  mid: '#777772',
  pale: '#b8b8b3',
  paper: '#f0f0eb',
  blue: '#3e96c8',
  red: '#d9341e',
  green: '#43a33b',
  yellow: '#edcb1f',
})

export const ISO_VIEWBOX = '0 0 640 480'
export const ISO_ORIGIN = Object.freeze({ x: 320, y: 350 })
export const ISO_UNIT = Object.freeze({ x: 16, y: 8, z: 16 })

export function projectIso(x, y, z = 0, origin = ISO_ORIGIN) {
  return {
    x: origin.x + (x - y) * ISO_UNIT.x,
    y: origin.y + (x + y) * ISO_UNIT.y - z * ISO_UNIT.z,
  }
}

export function pointString(points) {
  return points.map(({ x, y }) => `${round(x)},${round(y)}`).join(' ')
}

function round(value) {
  return Math.round(value * 100) / 100
}

export function VoxelBlock({
  x = 0,
  y = 0,
  z = 0,
  w = 1,
  d = 1,
  h = 1,
  top = WORLD_PALETTE.pale,
  front = WORLD_PALETTE.graphite,
  side = WORLD_PALETTE.dark,
  origin = ISO_ORIGIN,
  ...groupProps
}) {
  const a = projectIso(x, y, z, origin)
  const b = projectIso(x + w, y, z, origin)
  const c = projectIso(x + w, y + d, z, origin)
  const d0 = projectIso(x, y + d, z, origin)
  const at = projectIso(x, y, z + h, origin)
  const bt = projectIso(x + w, y, z + h, origin)
  const ct = projectIso(x + w, y + d, z + h, origin)
  const dt = projectIso(x, y + d, z + h, origin)

  return (
    <g {...groupProps}>
      <polygon points={pointString([dt, ct, c, d0])} fill={front} />
      <polygon points={pointString([bt, ct, c, b])} fill={side} />
      <polygon points={pointString([at, bt, ct, dt])} fill={top} />
    </g>
  )
}

export function VoxelTile({
  x = 0,
  y = 0,
  z = 0,
  w = 1,
  d = 1,
  fill = WORLD_PALETTE.dark,
  origin = ISO_ORIGIN,
  ...polygonProps
}) {
  return (
    <polygon
      points={pointString([
        projectIso(x, y, z, origin),
        projectIso(x + w, y, z, origin),
        projectIso(x + w, y + d, z, origin),
        projectIso(x, y + d, z, origin),
      ])}
      fill={fill}
      {...polygonProps}
    />
  )
}

export function GroundShadow({
  x = 0,
  y = 0,
  w = 1,
  d = 1,
  offsetX = 0.8,
  offsetY = 0.8,
  opacity = 0.56,
  origin = ISO_ORIGIN,
  ...polygonProps
}) {
  return (
    <VoxelTile
      x={x + offsetX}
      y={y + offsetY}
      w={w}
      d={d}
      fill={WORLD_PALETTE.ink}
      opacity={opacity}
      origin={origin}
      {...polygonProps}
    />
  )
}

export function VoxelFrame({
  x = 0,
  y = 0,
  z = 0,
  w = 10,
  h = 8,
  thickness = 0.8,
  depth = 0.9,
  top = WORLD_PALETTE.pale,
  front = WORLD_PALETTE.graphite,
  side = WORLD_PALETTE.dark,
  origin = ISO_ORIGIN,
  ...groupProps
}) {
  const common = { y, d: depth, top, front, side, origin }

  return (
    <g {...groupProps}>
      <VoxelBlock x={x} z={z} w={thickness} h={h} {...common} />
      <VoxelBlock x={x + w - thickness} z={z} w={thickness} h={h} {...common} />
      <VoxelBlock x={x} z={z} w={w} h={thickness} {...common} />
      <VoxelBlock x={x} z={z + h - thickness} w={w} h={thickness} {...common} />
    </g>
  )
}

export function PixelMark({
  x = 0,
  y = 0,
  z = 0,
  size = 0.55,
  color = WORLD_PALETTE.blue,
  origin = ISO_ORIGIN,
  ...groupProps
}) {
  return (
    <VoxelBlock
      x={x}
      y={y}
      z={z}
      w={size}
      d={size}
      h={size}
      top={color}
      front={color}
      side={WORLD_PALETTE.dark}
      origin={origin}
      {...groupProps}
    />
  )
}

export function AssetSvg({
  children,
  className = '',
  style,
  label,
  viewBox = ISO_VIEWBOX,
  ...svgProps
}) {
  const accessibility = label
    ? { role: 'img', 'aria-label': label }
    : { 'aria-hidden': true }

  return (
    <svg
      className={className}
      style={style}
      viewBox={viewBox}
      shapeRendering="crispEdges"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      {...accessibility}
      {...svgProps}
    >
      {label ? <title>{label}</title> : null}
      {children}
    </svg>
  )
}

