import {
  clamp,
  createSeededRandom,
  depthFor,
  pickFrom,
  randomBetween,
  randomInt,
  roundTo,
} from './isoMath.js'

export const WORLD_SEED = 20020307

export const WORLD_SIZE = Object.freeze({
  width: 3200,
  height: 2400,
  center: Object.freeze({ x: 1600, y: 1200 }),
  designViewport: Object.freeze({ width: 1440, height: 900 }),
  tile: Object.freeze({ width: 128, height: 64 }),
})

export const WORLD_ZONES = Object.freeze({
  top: Object.freeze({
    id: 'top',
    x: 1600,
    y: 1000,
    width: 1200,
    height: 600,
    accent: '#f3f3ef',
  }),
  statement: Object.freeze({
    id: 'statement',
    x: 720,
    y: 560,
    width: 980,
    height: 490,
    accent: '#4398cd',
  }),
  profile: Object.freeze({
    id: 'profile',
    x: 2480,
    y: 560,
    width: 980,
    height: 490,
    accent: '#d82d17',
  }),
  strengths: Object.freeze({
    id: 'strengths',
    x: 1600,
    y: 1440,
    width: 1200,
    height: 600,
    accent: '#47a639',
  }),
  works: Object.freeze({
    id: 'works',
    x: 780,
    y: 1880,
    width: 1400,
    height: 700,
    accent: '#edcb1f',
  }),
  contact: Object.freeze({
    id: 'contact',
    x: 2480,
    y: 1880,
    width: 1100,
    height: 550,
    accent: '#f3f3ef',
  }),
})

export const CAMERA_STOPS = Object.freeze([
  Object.freeze({
    id: 'top',
    focus: Object.freeze({ x: 1600, y: 1050 }),
    zoom: 0.52,
    rotation: 0,
    progress: 0,
    label: '00 / TOP · 导演片场',
  }),
  Object.freeze({
    id: 'statement',
    focus: Object.freeze({ x: 720, y: 560 }),
    zoom: 0.82,
    rotation: 0,
    progress: 0.17,
    label: '01 / STATEMENT · 创作宣言',
  }),
  Object.freeze({
    id: 'profile',
    focus: Object.freeze({ x: 2540, y: 560 }),
    zoom: 0.79,
    rotation: 0,
    progress: 0.35,
    label: '02 / PROFILE · 关于我',
  }),
  Object.freeze({
    id: 'strengths',
    focus: Object.freeze({ x: 1600, y: 1630 }),
    zoom: 0.8,
    rotation: 0,
    progress: 0.53,
    label: '03 / STRENGTHS · 核心能力',
  }),
  Object.freeze({
    id: 'works',
    focus: Object.freeze({ x: 780, y: 1850 }),
    zoom: 0.8,
    rotation: 0,
    progress: 0.75,
    label: '04 / WORKS · 精选作品',
  }),
  Object.freeze({
    id: 'contact',
    focus: Object.freeze({ x: 2440, y: 1850 }),
    zoom: 0.83,
    rotation: 0,
    progress: 1,
    label: '05 / CONTACT · 开始合作',
  }),
])

const ACCENTS = Object.freeze(['#4398cd', '#d82d17', '#47a639', '#edcb1f', '#f3f3ef'])
const ZONE_IDS = Object.freeze(Object.keys(WORLD_ZONES))

function buildMicroClusters(count = 42) {
  const random = createSeededRandom(WORLD_SEED ^ 0x6d696372)

  return Object.freeze(Array.from({ length: count }, (_, index) => {
    const zoneId = ZONE_IDS[index % ZONE_IDS.length]
    const zone = WORLD_ZONES[zoneId]
    const angle = randomBetween(random, 0, Math.PI * 2)
    const radius = randomBetween(random, 260, 580)
    const x = roundTo(clamp(zone.x + Math.cos(angle) * radius, 64, WORLD_SIZE.width - 64))
    const y = roundTo(clamp(zone.y + Math.sin(angle) * radius * 0.58, 64, WORLD_SIZE.height - 64))
    const unit = pickFrom(random, [4, 6, 8])
    const clusterId = `micro-${String(index + 1).padStart(2, '0')}`
    const blockCount = randomInt(random, 3, 7)
    const blocks = Object.freeze(Array.from({ length: blockCount }, (_, blockIndex) => (
      Object.freeze({
        id: `${clusterId}-block-${blockIndex + 1}`,
        dx: randomInt(random, -3, 3) * unit,
        dy: randomInt(random, -2, 2) * unit,
        size: unit,
        color: pickFrom(random, ACCENTS),
        opacity: roundTo(randomBetween(random, 0.28, 0.78), 0.01),
      })
    )))

    return Object.freeze({
      id: clusterId,
      zone: zoneId,
      x,
      y,
      scale: roundTo(randomBetween(random, 0.75, 1.35), 0.01),
      rotation: randomInt(random, -3, 3) * 15,
      delay: roundTo(-randomBetween(random, 0, 8), 0.1),
      depth: Math.max(10, depthFor(y, -6000)),
      blocks,
    })
  }))
}

const CREW_BLUEPRINTS = Object.freeze([
  ['top', '导演', 'directing', -190, 120],
  ['top', '现场制片', 'reviewing', 170, 145],
  ['statement', '分镜师', 'reviewing', -170, 95],
  ['statement', '摄影指导', 'operating', 190, 120],
  ['statement', '场记', 'carrying', 35, 230],
  ['profile', '录音师', 'operating', -205, 125],
  ['profile', '剪辑师', 'reviewing', 145, 105],
  ['profile', '灯光师', 'carrying', 245, 235],
  ['strengths', 'AI 视觉设计', 'operating', -285, 60],
  ['strengths', '模型调度', 'reviewing', -65, 220],
  ['strengths', '声音设计', 'operating', 155, 190],
  ['strengths', '统筹执行', 'directing', 315, 30],
  ['works', '主演角色', 'standing', -225, 135],
  ['works', '合成师', 'operating', 40, 210],
  ['works', '审片员', 'reviewing', 250, 120],
  ['contact', '导演', 'standing', -120, 145],
  ['contact', '合作伙伴', 'standing', 155, 165],
  ['contact', '现场助理', 'carrying', 275, 55],
])

// A few foreground crew members sit against the large landmark SVGs. Their
// anchors and depth need to be art-directed together so they read as standing
// beside the set instead of being clipped underneath it.
const CURATED_CREW_ANCHORS = Object.freeze({
  'crew-03': Object.freeze({ x: 470, y: 620, layer: 620, facing: 'right' }),
  'crew-07': Object.freeze({ x: 2810, y: 690, layer: 620, facing: 'left' }),
  'crew-16': Object.freeze({ x: 2475, y: 2040, layer: 1600, facing: 'right' }),
  'crew-17': Object.freeze({ x: 2730, y: 2070, layer: 1600, facing: 'left' }),
  'crew-18': Object.freeze({ x: 2860, y: 2010, layer: 1600, facing: 'left' }),
})

function buildCrew() {
  const random = createSeededRandom(WORLD_SEED ^ 0x63726577)

  return Object.freeze(CREW_BLUEPRINTS.map((blueprint, index) => {
    const [zoneId, role, pose, offsetX, offsetY] = blueprint
    const zone = WORLD_ZONES[zoneId]
    const id = `crew-${String(index + 1).padStart(2, '0')}`
    const curatedAnchor = CURATED_CREW_ANCHORS[id]
    const generatedX = roundTo(zone.x + offsetX + randomBetween(random, -18, 18))
    const generatedY = roundTo(zone.y + offsetY + randomBetween(random, -10, 10))
    const generatedFacing = random() > 0.5 ? 'right' : 'left'
    const x = curatedAnchor?.x ?? generatedX
    const y = curatedAnchor?.y ?? generatedY

    return Object.freeze({
      id,
      zone: zoneId,
      role,
      pose,
      x,
      y,
      facing: curatedAnchor?.facing ?? generatedFacing,
      scale: roundTo(randomBetween(random, 0.88, 1.08), 0.01),
      accent: pickFrom(random, ACCENTS.slice(0, 4)),
      delay: roundTo(-randomBetween(random, 0, 4), 0.1),
      depth: depthFor(y, curatedAnchor?.layer ?? (30 + index)),
    })
  }))
}

function placeScene(id, zoneId, type, offsetX, offsetY, size, options = {}) {
  const zone = WORLD_ZONES[zoneId]
  const x = zone.x + offsetX
  const y = zone.y + offsetY

  return Object.freeze({
    id,
    zone: zoneId,
    type,
    x,
    y,
    size,
    rotation: options.rotation || 0,
    flipX: Boolean(options.flipX),
    depth: depthFor(y, options.layer || 0),
  })
}

export const microClusters = buildMicroClusters()
export const crew = buildCrew()

export const scenePlacements = Object.freeze([
  placeScene('top-monitor', 'top', 'monitor', -260, -120, 280, { rotation: -4 }),
  placeScene('top-console', 'top', 'console', 90, -70, 330, { rotation: 3 }),
  placeScene('top-camera', 'top', 'camera', -360, 150, 285, { rotation: -3 }),
  placeScene('top-chair', 'top', 'chair', 170, 190, 250, { rotation: 4 }),
  placeScene('top-light', 'top', 'light', -70, -310, 225, { rotation: -2 }),
  placeScene('top-clapper', 'top', 'clapper', 350, 85, 205, { rotation: 5 }),

  placeScene('statement-monitor', 'statement', 'monitor', -170, -70, 300, { rotation: -4 }),
  placeScene('statement-camera', 'statement', 'camera', 185, 80, 305, { rotation: 4, flipX: true }),
  placeScene('statement-clapper', 'statement', 'clapper', -300, 215, 215, { rotation: -6 }),
  placeScene('statement-light', 'statement', 'light', 245, -225, 230, { rotation: 3 }),

  placeScene('profile-console', 'profile', 'console', -235, 55, 360, { rotation: -3 }),
  placeScene('profile-monitor', 'profile', 'monitor', 190, -95, 275, { rotation: 4, flipX: true }),
  placeScene('profile-light', 'profile', 'light', -350, -230, 230, { rotation: -4 }),
  placeScene('profile-chair', 'profile', 'chair', 250, 205, 250, { rotation: 5 }),

  placeScene('strengths-console', 'strengths', 'console', -350, -90, 320, { rotation: -4 }),
  placeScene('strengths-camera', 'strengths', 'camera', 255, -115, 300, { rotation: 4, flipX: true }),
  placeScene('strengths-monitor', 'strengths', 'monitor', -35, -280, 270, { rotation: 1 }),
  placeScene('strengths-light', 'strengths', 'light', -325, 255, 215, { rotation: -5 }),
  placeScene('strengths-chair', 'strengths', 'chair', 285, 270, 245, { rotation: 5 }),

  placeScene('works-screen-a', 'works', 'monitor', -270, -180, 380, { rotation: -4 }),
  placeScene('works-screen-b', 'works', 'monitor', 175, -70, 380, { rotation: 4, flipX: true }),
  placeScene('works-camera', 'works', 'camera', -355, 225, 300, { rotation: -5 }),
  placeScene('works-light', 'works', 'light', 270, -305, 250, { rotation: 4 }),
  placeScene('works-clapper', 'works', 'clapper', 285, 245, 220, { rotation: 6 }),

  placeScene('contact-chair', 'contact', 'chair', -70, 20, 340, { rotation: -2 }),
  placeScene('contact-clapper', 'contact', 'clapper', 245, 155, 225, { rotation: 6 }),
  placeScene('contact-light', 'contact', 'light', -310, -210, 235, { rotation: -4 }),
  placeScene('contact-monitor', 'contact', 'monitor', 200, -185, 270, { rotation: 4, flipX: true }),
])
