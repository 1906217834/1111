import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { StudioProp } from './StudioProps'
import {
  BroadcastTower,
  CinemaStage,
  HeroGate,
  MicroCluster,
  ModelHub,
  PixelCrew,
  PromptMachine,
  SoundLab,
  WorkflowStation,
  WORLD_PALETTE,
} from './world/WorldAssets'
import { cameraTransformFor, depthFor } from './world/isoMath'
import {
  CAMERA_STOPS,
  WORLD_SIZE,
  WORLD_ZONES,
  crew,
  microClusters,
  scenePlacements,
} from './world/worldData'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const COLORS = ['#4398cd', '#d82d17', '#47a639', '#edcb1f']

const projects = [
  {
    index: '01',
    title: '三嫁公主',
    english: 'THREE MARRIAGES OF THE PRINCESS',
    role: 'AI 漫剧导演 / AI DRAMA DIRECTOR',
    year: '2026',
    image: 'https://3img.hitv.com/preview/sp_images/2026/07/20/202607201721145719151.jpg',
    link: 'https://www.mgtv.com/b/892079/24505456.html',
    description: '以和亲棋局为起点，把多线情感、女性成长与朝堂权谋压进高密度的竖屏叙事。',
  },
  {
    index: '02',
    title: '我怎么会嫁给一个反派',
    english: 'HOW DID I MARRY A VILLAIN',
    role: 'AI 漫剧导演 / AI DRAMA DIRECTOR',
    year: '2026',
    image: 'https://3vimg.hitv.com/100/2607/1319/2435/AQ6Zuxcy9VX/578301725934596096.jpg',
    link: 'https://www.mgtv.com/b/890470/24495864.html',
    description: '用读心反差建立轻喜节奏，在仙侠世界观里推进双向攻略、宿命重启与情感回收。',
  },
  {
    index: '03',
    title: '我们',
    english: 'WE / GRADUATION FILM',
    role: '导演 / 画面生成',
    year: '毕业设计',
    image: '/media/we-poster.jpg',
    video: '/media/we-graduation-film-web.mp4',
    duration: '09:48',
    description: 'AI 生成动画短片。由张国熙执导并负责画面生成，在人物关系、空间光影与声音叙事之间建立完整的情绪推进。',
  },
]

const principles = [
  {
    number: '01',
    title: '视觉叙事',
    english: 'VISUAL STORYTELLING',
    body: '从故事功能出发设计构图、光线与镜头衔接，让每个画面真正推动人物关系与情绪。',
  },
  {
    number: '02',
    title: '导演判断',
    english: 'DIRECTING DECISIONS',
    body: '把抽象创意拆解为可执行的场景、节奏和镜头，在生成的不确定性中维持方向。',
  },
  {
    number: '03',
    title: '声音与剪辑',
    english: 'SOUND & EDITING',
    body: '用录音艺术训练形成的节奏感，组织声音、转场与情绪呼吸之间的因果关系。',
  },
  {
    number: '04',
    title: '模型调度',
    english: 'MODEL ORCHESTRATION',
    body: '熟悉主流 AI 模型，按脚本、视觉、动态与声音任务组合工具，并维持角色和风格一致。',
  },
]

const facts = [
  ['姓名', '张国熙'],
  ['出生', '2002.03.07'],
  ['籍贯', '广东'],
  ['学历', '本科'],
  ['院校', '昆明传媒学院'],
  ['专业', '录音艺术'],
]

const SECTION_META = Object.freeze({
  top: Object.freeze({
    scene: '00',
    take: 'MASTER',
    code: 'DIRECTOR STUDIO',
    status: 'STUDIO READY',
    accent: COLORS[3],
  }),
  statement: Object.freeze({
    scene: '01',
    take: 'IDEA',
    code: 'CREATIVE STATEMENT',
    status: 'STORY SIGNAL LOCKED',
    accent: COLORS[0],
  }),
  profile: Object.freeze({
    scene: '02',
    take: 'BIO',
    code: 'PROFILE / SOUND LAB',
    status: 'VOICE CHANNEL ONLINE',
    accent: COLORS[1],
  }),
  strengths: Object.freeze({
    scene: '03',
    take: 'FLOW',
    code: 'MODEL ORCHESTRATION',
    status: 'PIPELINE SYNCHRONIZED',
    accent: COLORS[2],
  }),
  works: Object.freeze({
    scene: '04',
    take: 'PLAY',
    code: 'SELECTED WORKS',
    status: 'PROJECTORS ARMED',
    accent: COLORS[3],
  }),
  contact: Object.freeze({
    scene: '05',
    take: 'OPEN',
    code: 'CONTACT / BROADCAST',
    status: 'SIGNAL OPEN',
    accent: '#f0f0eb',
  }),
})

const navItems = CAMERA_STOPS.map((stop) => ({
  id: stop.id,
  label: stop.id === 'top' ? 'TOP' : stop.id.toUpperCase(),
  number: String(CAMERA_STOPS.indexOf(stop)).padStart(2, '0'),
  accent: SECTION_META[stop.id]?.accent || COLORS[0],
}))

const VIEWPORT_DUST = Object.freeze(Array.from({ length: 14 }, (_, index) => Object.freeze({
  id: `viewport-dust-${index}`,
  x: 8 + ((index * 23) % 86),
  y: 6 + ((index * 37) % 84),
  size: index % 4 === 0 ? 4 : 2,
  duration: 8 + (index % 5) * 1.7,
  delay: -((index * 1.13) % 8),
})))

function zoneStateClass(zone, activeSection) {
  if (zone === activeSection) return 'is-zone-active'
  if (activeSection === 'top') return zone === 'top' ? 'is-zone-active' : 'is-zone-context'
  return 'is-zone-dormant'
}

function useStudioSound(activeSection) {
  const audioContextRef = useRef(null)
  const enabledRef = useRef(false)
  const [soundEnabled, setSoundEnabled] = useState(false)

  const getAudioContext = () => {
    if (audioContextRef.current) return audioContextRef.current
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return null
    audioContextRef.current = new AudioContextClass()
    return audioContextRef.current
  }

  const playCue = (kind = 'tick') => {
    if (!enabledRef.current) return
    const context = getAudioContext()
    if (!context || context.state === 'closed') return

    const cueMap = {
      tick: [420],
      arrival: [220, 330],
      shutter: [150, 110],
      power: [180, 270, 405],
      off: [260, 170],
    }
    const frequencies = cueMap[kind] || cueMap.tick
    const start = context.currentTime + 0.015

    frequencies.forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      const noteStart = start + index * 0.055
      const noteEnd = noteStart + (kind === 'arrival' ? 0.09 : 0.065)

      oscillator.type = index % 2 ? 'triangle' : 'square'
      oscillator.frequency.setValueAtTime(frequency, noteStart)
      gain.gain.setValueAtTime(0.0001, noteStart)
      gain.gain.exponentialRampToValueAtTime(kind === 'power' ? 0.022 : 0.015, noteStart + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd)
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start(noteStart)
      oscillator.stop(noteEnd + 0.01)
    })
  }

  const toggleSound = async () => {
    const nextEnabled = !enabledRef.current
    const context = getAudioContext()

    if (nextEnabled && context?.state === 'suspended') {
      await context.resume()
    }

    if (!nextEnabled) playCue('off')
    enabledRef.current = nextEnabled
    setSoundEnabled(nextEnabled)
    if (nextEnabled) window.setTimeout(() => playCue('power'), 20)
  }

  useEffect(() => {
    if (!soundEnabled) return undefined
    const timer = window.setTimeout(() => playCue('arrival'), 75)
    return () => window.clearTimeout(timer)
  }, [activeSection, soundEnabled])

  useEffect(() => {
    return () => {
      enabledRef.current = false
      audioContextRef.current?.close()
    }
  }, [])

  return { soundEnabled, toggleSound, playCue }
}

function ViewportAtmosphere({ activeSection }) {
  return (
    <div className="viewport-atmosphere" data-scene={activeSection} aria-hidden="true">
      <div className="viewport-atmosphere__scan" />
      <div className="viewport-atmosphere__dust">
        {VIEWPORT_DUST.map((particle) => (
          <i
            key={particle.id}
            style={{
              '--dust-x': `${particle.x}vw`,
              '--dust-y': `${particle.y}vh`,
              '--dust-size': `${particle.size}px`,
              '--dust-duration': `${particle.duration}s`,
              '--dust-delay': `${particle.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="viewport-atmosphere__aperture" />
    </div>
  )
}

function DirectorMonitor({ activeSection, soundEnabled, onToggleSound }) {
  const meta = SECTION_META[activeSection] || SECTION_META.top

  return (
    <div className="director-monitor" style={{ '--scene-accent': meta.accent }}>
      <div className="monitor-frame" aria-hidden="true">
        <i className="monitor-frame__corner monitor-frame__corner--tl" />
        <i className="monitor-frame__corner monitor-frame__corner--tr" />
        <i className="monitor-frame__corner monitor-frame__corner--bl" />
        <i className="monitor-frame__corner monitor-frame__corner--br" />
        <span className="monitor-frame__focus"><i /><i /></span>
      </div>

      <section className="scene-slate" aria-label={`当前场景 ${meta.scene}，${meta.code}`}>
        <div className="scene-slate__record"><i /> LIVE FEED</div>
        <div className="scene-slate__cells">
          <span>SCENE<strong>{meta.scene}</strong></span>
          <span>TAKE<strong>{meta.take}</strong></span>
        </div>
        <p>{meta.code}</p>
      </section>

      <div className="signal-console">
        <span>PRODUCTION SIGNAL</span>
        <strong aria-live="polite">{meta.status}</strong>
        <button
          type="button"
          className={soundEnabled ? 'is-active' : ''}
          aria-pressed={soundEnabled}
          aria-label={soundEnabled ? '关闭界面声音' : '开启界面声音'}
          onClick={onToggleSound}
        >
          <i aria-hidden="true" />
          SOUND {soundEnabled ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  )
}

function PixelIdentityBadge() {
  const dragStartRef = useRef({ x: 0, y: 0 })
  const draggingRef = useRef(false)
  const movedRef = useRef(false)
  const settleTimerRef = useRef(0)
  const [dragging, setDragging] = useState(false)
  const [settling, setSettling] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [pose, setPose] = useState({ angle: 0, stretch: 0 })

  const settleCard = () => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setDragging(false)
    setSettling(true)
    setPose({ angle: 0, stretch: 0 })
    window.clearTimeout(settleTimerRef.current)
    settleTimerRef.current = window.setTimeout(() => setSettling(false), 620)
  }

  useEffect(() => {
    return () => window.clearTimeout(settleTimerRef.current)
  }, [])

  useEffect(() => {
    if (!dragging) return undefined
    const handleRelease = () => settleCard()
    window.addEventListener('pointerup', handleRelease)
    window.addEventListener('mouseup', handleRelease)
    window.addEventListener('blur', handleRelease)
    return () => {
      window.removeEventListener('pointerup', handleRelease)
      window.removeEventListener('mouseup', handleRelease)
      window.removeEventListener('blur', handleRelease)
    }
  }, [dragging])

  const releaseCard = (event) => {
    if (!draggingRef.current) return
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      // Pointer capture may already be released by the browser.
    }
    settleCard()
  }

  return (
    <section className="pixel-id-badge" aria-label="张国熙个人身份工牌：AI 设计师、AI 漫剧导演">
      <span className="sr-only">张国熙，AI 设计师，AI 漫剧导演，录音艺术专业。</span>
      <div className="pixel-id-badge__anchor" aria-hidden="true"><i /><i /><i /></div>
      <div
        className={`pixel-id-badge__pendulum ${dragging ? 'is-dragging' : ''} ${settling ? 'is-settling' : ''}`}
        style={{
          '--badge-angle': `${pose.angle}deg`,
          '--badge-stretch': `${pose.stretch}px`,
        }}
      >
        <span className="pixel-id-badge__cord" aria-hidden="true"><i /><i /><i /></span>
        <button
          type="button"
          className="pixel-id-card"
          aria-label={flipped ? '查看张国熙个人工牌正面' : '查看张国熙个人工牌背面'}
          aria-pressed={flipped}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId)
            dragStartRef.current = { x: event.clientX, y: event.clientY }
            movedRef.current = false
            window.clearTimeout(settleTimerRef.current)
            setSettling(false)
            draggingRef.current = true
            setDragging(true)
          }}
          onPointerMove={(event) => {
            if (!draggingRef.current) return
            const deltaX = event.clientX - dragStartRef.current.x
            const deltaY = event.clientY - dragStartRef.current.y
            if (Math.hypot(deltaX, deltaY) > 4) movedRef.current = true
            setPose({
              angle: Math.max(-19, Math.min(19, deltaX / 3.4)),
              stretch: Math.max(-5, Math.min(20, deltaY / 6)),
            })
          }}
          onPointerUp={releaseCard}
          onPointerCancel={releaseCard}
          onLostPointerCapture={settleCard}
          onClick={() => {
            if (!movedRef.current) setFlipped((current) => !current)
          }}
        >
          <img
            src={flipped ? '/media/pixel-id-back.svg' : '/media/pixel-id-front.svg'}
            alt=""
            draggable={false}
          />
        </button>
      </div>
    </section>
  )
}

function PixelTrail() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const mediaQuery = window.matchMedia('(min-width: 1000px) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    if (!canvas) return undefined

    const context = canvas.getContext('2d')
    if (!context) return undefined

    const particles = []
    let animationFrame = 0
    let viewportWidth = window.innerWidth
    let viewportHeight = window.innerHeight
    let lastX = Number.NaN
    let lastY = Number.NaN
    let isActive = false

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      viewportWidth = window.innerWidth
      viewportHeight = window.innerHeight
      canvas.width = Math.round(viewportWidth * dpr)
      canvas.height = Math.round(viewportHeight * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.imageSmoothingEnabled = false
    }

    const render = (now) => {
      if (!isActive) {
        animationFrame = 0
        return
      }

      context.clearRect(0, 0, viewportWidth, viewportHeight)

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index]
        const age = now - particle.born
        if (age > 260) {
          particles.splice(index, 1)
          continue
        }

        context.globalAlpha = 1 - age / 260
        context.fillStyle = particle.color
        context.fillRect(
          Math.round(particle.x),
          Math.round(particle.y + age * 0.02),
          particle.size,
          particle.size,
        )
      }

      context.globalAlpha = 1
      if (particles.length) animationFrame = window.requestAnimationFrame(render)
      else animationFrame = 0
    }

    const addParticle = (event) => {
      if (!isActive) return

      const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY)
      if (Number.isFinite(distance) && distance < 12) return

      lastX = event.clientX
      lastY = event.clientY
      particles.push({
        x: event.clientX + (Math.random() - 0.5) * 8,
        y: event.clientY + (Math.random() - 0.5) * 8,
        size: Math.random() > 0.74 ? 6 : 4,
        color: COLORS[particles.length % COLORS.length],
        born: performance.now(),
      })
      if (particles.length > 16) particles.splice(0, particles.length - 16)
      if (!animationFrame) animationFrame = window.requestAnimationFrame(render)
    }

    const start = () => {
      if (isActive) return
      isActive = true
      resize()
      window.addEventListener('resize', resize)
      window.addEventListener('pointermove', addParticle, { passive: true })
    }

    const stop = () => {
      if (isActive) {
        window.removeEventListener('resize', resize)
        window.removeEventListener('pointermove', addParticle)
      }
      isActive = false
      window.cancelAnimationFrame(animationFrame)
      animationFrame = 0
      particles.length = 0
      context.clearRect(0, 0, viewportWidth, viewportHeight)
    }

    const syncAnimation = () => {
      if (mediaQuery.matches) start()
      else stop()
    }

    syncAnimation()
    mediaQuery.addEventListener('change', syncAnimation)

    return () => {
      mediaQuery.removeEventListener('change', syncAnimation)
      stop()
    }
  }, [])

  return <canvas ref={canvasRef} className="pixel-trail" aria-hidden="true" />
}

function WorldItem({ x, y, width, zIndex, flip = false, className = '', children, ...rest }) {
  return (
    <div
      className={`world-item ${className}`}
      style={{
        left: x,
        top: y,
        width,
        zIndex,
        transform: `scaleX(${flip ? -1 : 1})`,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

function diamondPoints(zone) {
  const halfWidth = zone.width / 2
  const halfHeight = zone.width / 4
  return `${zone.x},${zone.y - halfHeight} ${zone.x + halfWidth},${zone.y} ${zone.x},${zone.y + halfHeight} ${zone.x - halfWidth},${zone.y}`
}

const AMBIENT_NODES = Object.freeze(Array.from({ length: 84 }, (_, index) => {
  const x = 64 + ((index * 37) % 48) * 64
  const y = 32 + ((index * 17) % 72) * 32
  const quiet = (
    (x < 800 && y < 1040)
    || (x > 850 && x < 2300 && y > 300 && y < 1190)
    || (x > 520 && x < 1520 && y > 1120 && y < 1740)
  )

  if (quiet) return null

  return Object.freeze({
    id: `ambient-node-${index}`,
    x,
    y,
    dx: index % 2 ? 10 : -10,
    color: index % 7 === 0 ? COLORS[(index / 7) % COLORS.length] : index % 3 === 0 ? '#b8b8b3' : '#777772',
    opacity: (0.08 + (index % 4) * 0.035).toFixed(3),
    duration: `${2.8 + (index % 6) * 0.46}s`,
    delay: `${-((index * 0.37) % 4.8).toFixed(2)}s`,
  })
}).filter(Boolean))

const ACTIVE_ROUTES = Object.freeze({
  top: Object.freeze([0, 1]),
  statement: Object.freeze([0]),
  profile: Object.freeze([0]),
  strengths: Object.freeze([1, 2]),
  works: Object.freeze([1]),
  contact: Object.freeze([2]),
})

const WORKFLOW_STATIONS = Object.freeze([
  Object.freeze({
    id: 'script-in',
    zone: 'statement',
    variant: 'script',
    x: 850,
    y: 930,
    size: 230,
    index: '01',
    label: 'SCRIPT IN',
    meta: 'STORY / PROMPT',
    accent: COLORS[0],
  }),
  Object.freeze({
    id: 'char-lock',
    zone: 'profile',
    variant: 'character',
    x: 2250,
    y: 1120,
    size: 250,
    index: '03',
    label: 'CHAR LOCK',
    meta: 'IDENTITY / STYLE',
    accent: COLORS[2],
  }),
  Object.freeze({
    id: 'voice-sync',
    zone: 'profile',
    variant: 'voice',
    x: 2600,
    y: 1080,
    size: 220,
    index: '04',
    label: 'VOICE SYNC',
    meta: 'DIALOGUE / SUBTITLE',
    accent: COLORS[3],
  }),
  Object.freeze({
    id: 'render-queue',
    zone: 'strengths',
    variant: 'render',
    x: 2500,
    y: 1340,
    size: 250,
    index: '05',
    label: 'RENDER Q',
    meta: 'COMPOSITE / OUTPUT',
    accent: COLORS[1],
  }),
])

function WorldGround({ activeSection }) {
  const isoRoutes = [
    [[720, 560], [1600, 1000], [2480, 560]],
    [[1600, 1000], [1160, 1220], [1600, 1440], [720, 1880]],
    [[1600, 1440], [2040, 1660], [2480, 1880]],
  ]
  const activeRoutes = new Set(ACTIVE_ROUTES[activeSection] || [])

  return (
    <svg
      className={`world-ground world-ground--${activeSection}`}
      viewBox={`0 0 ${WORLD_SIZE.width} ${WORLD_SIZE.height}`}
      width={WORLD_SIZE.width}
      height={WORLD_SIZE.height}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <defs>
        <pattern id="iso-grid" width="64" height="32" patternUnits="userSpaceOnUse">
          <path d="M0 16 32 0 64 16 32 32Z" fill="none" stroke="#151515" strokeWidth="2" />
          <rect x="31" y="15" width="2" height="2" fill="#242424" />
        </pattern>
        <pattern id="film-holes" width="42" height="42" patternUnits="userSpaceOnUse">
          <rect x="8" y="8" width="12" height="8" fill="#050505" />
          <rect x="8" y="26" width="12" height="8" fill="#050505" />
        </pattern>
      </defs>

      <rect className="world-ground__base" width={WORLD_SIZE.width} height={WORLD_SIZE.height} fill="#050505" opacity="0.78" />
      <rect className="world-ground__grid" width={WORLD_SIZE.width} height={WORLD_SIZE.height} fill="url(#iso-grid)" />

      <g className="ambient-node-field">
        {AMBIENT_NODES.map((node) => (
          <g
            key={node.id}
            className="ambient-node"
            transform={`translate(${node.x} ${node.y})`}
            style={{
              '--node-opacity': node.opacity,
              '--node-duration': node.duration,
              '--node-delay': node.delay,
            }}
          >
            <rect className="ambient-node__core" x="-2" y="-2" width="4" height="4" fill={node.color} />
            <rect className="ambient-node__echo" x={node.dx - 2} y={Math.abs(node.dx) / 2 - 2} width="4" height="4" fill={node.color} />
          </g>
        ))}
      </g>

      {Object.values(WORLD_ZONES).map((zone, index) => (
        <g
          key={zone.id}
          className={`world-zone ${zoneStateClass(zone.id, activeSection)}`}
          data-ground-zone={zone.id}
        >
          <polygon className="world-zone__platform" points={diamondPoints(zone)} fill={index % 2 ? '#090909' : '#0b0b0b'} stroke="#202020" strokeWidth="4" />
          <polyline
            className="world-zone__trace"
            points={`${zone.x - zone.width * 0.22},${zone.y} ${zone.x},${zone.y + zone.width * 0.11} ${zone.x + zone.width * 0.22},${zone.y}`}
            fill="none"
            stroke={zone.accent}
            strokeWidth="8"
            opacity="0.58"
          />
        </g>
      ))}

      {isoRoutes.map((points, index) => {
        const route = points.map(([x, y]) => `${x},${y}`).join(' ')
        return (
          <g key={index} className="world-route" data-route={index}>
            <polyline points={route} fill="none" stroke="#383838" strokeWidth="46" strokeLinejoin="bevel" />
            <polyline points={route} fill="none" stroke="url(#film-holes)" strokeWidth="38" strokeLinejoin="bevel" />
            <polyline points={route} fill="none" stroke="#101010" strokeWidth="20" strokeLinejoin="bevel" />
            <polyline
              className={`world-route__pulse world-route__pulse--tail ${activeRoutes.has(index) ? 'is-active' : ''}`}
              points={route}
              pathLength="100"
              fill="none"
              stroke={COLORS[(index + 1) % COLORS.length]}
              strokeWidth="8"
              strokeLinecap="square"
              strokeDasharray="3 97"
              style={{ '--route-duration': `${6.4 + index * 1.3}s`, '--route-delay': `${-index * 2.1}s` }}
            />
            <polyline
              className={`world-route__pulse world-route__pulse--core ${activeRoutes.has(index) ? 'is-active' : ''}`}
              points={route}
              pathLength="100"
              fill="none"
              stroke={COLORS[(index + 1) % COLORS.length]}
              strokeWidth="5"
              strokeLinecap="square"
              strokeDasharray="1 99"
              style={{ '--route-duration': `${6.4 + index * 1.3}s`, '--route-delay': `${-index * 2.1}s` }}
            />
          </g>
        )
      })}

      {[ 
        { x: 1600, y: 1000, color: COLORS[0], duration: '6.4s', delay: '0s', routes: [0, 1] },
        { x: 1600, y: 1440, color: COLORS[2], duration: '7.7s', delay: '-2.4s', routes: [1, 2] },
      ].map((node) => (
        <g
          key={`${node.x}-${node.y}`}
          className={`route-junction ${node.routes.some((route) => activeRoutes.has(route)) ? 'is-active' : ''}`}
          transform={`translate(${node.x} ${node.y})`}
          style={{ '--junction-duration': node.duration, '--junction-delay': node.delay }}
        >
          <polygon points="0,-14 28,0 0,14 -28,0" fill="none" stroke={node.color} strokeWidth="4" />
        </g>
      ))}

      <g className="edit-timeline" opacity="0.28">
        <polyline points="1688,1196 1940,1322" fill="none" stroke="#565652" strokeWidth="4" />
        {COLORS.concat('#b8b8b3', '#4d4d4d').map((color, index) => {
          const x = 1692 + index * 42
          const y = 1186 + index * 21
          return (
            <g key={`${color}-${index}`}>
              <polygon
                points={`${x},${y} ${x + 34},${y + 17} ${x + 20},${y + 24} ${x - 14},${y + 7}`}
                fill="#0b0b0b"
                stroke={color}
                strokeWidth="3"
              />
              <rect x={x + 7} y={y + 8} width="5" height="5" fill={color} />
            </g>
          )
        })}
      </g>

      {CAMERA_STOPS.map((stop, index) => (
        <g key={stop.id} transform={`translate(${stop.focus.x} ${stop.focus.y})`}>
          <polygon points="0,-28 56,0 0,28 -56,0" fill="#111" stroke={COLORS[index % COLORS.length]} strokeWidth="8" />
          <rect x="-8" y="-8" width="16" height="16" fill={COLORS[index % COLORS.length]} />
        </g>
      ))}
    </svg>
  )
}

function GroundLabel({ x, y, eyebrow, title, copy, active = false, className = '' }) {
  return (
    <div className={`ground-label ${active ? 'is-visible' : ''} ${className}`} style={{ left: x, top: y }} aria-hidden="true">
      <span>{eyebrow}</span>
      <strong>{title}</strong>
      {copy ? <p>{copy}</p> : null}
    </div>
  )
}

function WorkflowMarker({ station, activeSection }) {
  const related = activeSection === 'top' || activeSection === station.zone

  return (
    <div
      className={`workflow-marker scene-entity ${zoneStateClass(station.zone, activeSection)} ${related ? 'is-related' : ''}`}
      data-zone={station.zone}
      aria-hidden="true"
      style={{
        left: station.x - station.size * 0.78,
        top: station.y + station.size * 0.48,
        '--marker-accent': station.accent,
      }}
    >
      <span>{station.index}</span>
      <strong>{station.label}</strong>
      <small>{station.meta}</small>
    </div>
  )
}

const crewVariant = {
  directing: 'director',
  reviewing: 'editor',
  operating: 'camera',
  carrying: 'sound',
  standing: 'director',
}

function WorldScene({ activeSection, onOpenProject }) {
  const insideHeroClearZone = ({ x, y }) => x >= 550 && x <= 1450 && y >= 1150 && y <= 1700
  const visibleClusters = microClusters.filter((cluster, index) => (
    index % 3 === 0 && cluster.zone !== 'top' && !insideHeroClearZone(cluster)
  ))
  const keptProps = new Set([
    'statement-camera',
    'profile-console',
    'strengths-console', 'strengths-camera', 'strengths-monitor', 'strengths-chair',
    'works-camera', 'works-light', 'works-clapper',
    'contact-chair', 'contact-clapper', 'contact-light',
  ])
  const visibleProps = scenePlacements.filter((placement) => (
    keptProps.has(placement.id) && !insideHeroClearZone(placement)
  ))
  const visibleCrew = crew.filter((person) => person.zone !== 'top' && !insideHeroClearZone(person))

  return (
    <div
      className="world-map"
      data-active-section={activeSection}
      style={{
        width: WORLD_SIZE.width,
        height: WORLD_SIZE.height,
        '--scene-accent': SECTION_META[activeSection]?.accent || COLORS[0],
      }}
    >
      <div className="world-deep-layer" aria-hidden="true" />
      <WorldGround activeSection={activeSection} />

      <GroundLabel x={900} y={1230} eyebrow="ZHANG GUOXI / 2026" title="张国熙" copy="AI DESIGNER / AI DRAMA DIRECTOR" active={activeSection === 'top'} className="ground-label--hero" />
      <GroundLabel x={300} y={700} eyebrow="01 / STATEMENT" title="让想象，被看见。" copy="MAKE THE UNSEEN VISIBLE" active={activeSection === 'statement'} />
      <GroundLabel x={2040} y={700} eyebrow="02 / PROFILE" title="从声音，到影像。" copy="RECORDING ARTS → VISUAL DIRECTION" active={activeSection === 'profile'} />
      <GroundLabel x={840} y={1690} eyebrow="03 / STRENGTHS" title="四种能力，一套导演方法。" copy="STORY / IMAGE / SOUND / MODELS" active={activeSection === 'strengths'} className="ground-label--strengths" />
      <GroundLabel x={190} y={2000} eyebrow="04 / SELECTED WORKS" title="三部作品，三种叙事引力。" copy="DIRECTED / GENERATED / EDITED" active={activeSection === 'works'} />
      <GroundLabel x={2520} y={2080} eyebrow="05 / CONTACT" title="下一部作品，从一帧开始。" copy="OPEN FOR COLLABORATION" active={activeSection === 'contact'} className="ground-label--contact" />

      {visibleClusters.map((cluster, index) => (
        <WorldItem
          key={cluster.id}
          x={cluster.x - 105}
          y={cluster.y - 70}
          width={210}
          zIndex={cluster.depth}
          className={`micro-cluster scene-entity ${zoneStateClass(cluster.zone, activeSection)}`}
          data-zone={cluster.zone}
          aria-hidden="true"
        >
          <MicroCluster seed={20020307 + index * 31} count={18 + (index % 3) * 5} width={210} height={140} />
        </WorldItem>
      ))}

      <WorldItem x={1000} y={430} width={1200} zIndex={depthFor(1105, 40)} className={`world-landmark world-landmark--hero scene-entity ${zoneStateClass('top', activeSection)}`} data-zone="top" aria-hidden="true">
        <HeroGate />
      </WorldItem>
      <WorldItem x={150} y={80} width={780} zIndex={depthFor(665, 40)} className={`world-landmark world-landmark--statement scene-entity ${zoneStateClass('statement', activeSection)}`} data-zone="statement" aria-hidden="true">
        <PromptMachine />
      </WorldItem>
      <WorldItem x={2270} y={90} width={780} zIndex={depthFor(675, 40)} className={`world-landmark world-landmark--profile scene-entity ${zoneStateClass('profile', activeSection)}`} data-zone="profile" aria-hidden="true">
        <SoundLab />
      </WorldItem>
      <WorldItem x={1080} y={1240} width={1040} zIndex={depthFor(2020, 40)} className={`world-landmark world-landmark--strengths scene-entity ${zoneStateClass('strengths', activeSection)}`} data-zone="strengths" aria-hidden="true">
        <ModelHub />
      </WorldItem>

      <ProjectAction
        project={projects[0]}
        onOpenProject={onOpenProject}
        className={`world-project-link world-project-link--one scene-entity ${zoneStateClass('works', activeSection)} ${activeSection === 'works' ? 'is-interactive' : ''}`}
        data-zone="works"
        tabIndex={activeSection === 'works' ? 0 : -1}
        aria-hidden={activeSection !== 'works'}
        aria-label="打开《三嫁公主》"
      >
        <CinemaStage image={projects[0].image} title="01 / 三嫁公主" accent={WORLD_PALETTE.red} />
      </ProjectAction>
      <ProjectAction
        project={projects[1]}
        onOpenProject={onOpenProject}
        className={`world-project-link world-project-link--two scene-entity ${zoneStateClass('works', activeSection)} ${activeSection === 'works' ? 'is-interactive' : ''}`}
        data-zone="works"
        tabIndex={activeSection === 'works' ? 0 : -1}
        aria-hidden={activeSection !== 'works'}
        aria-label="打开《我怎么会嫁给一个反派》"
      >
        <CinemaStage image={projects[1].image} title="02 / 嫁给反派" accent={WORLD_PALETTE.blue} />
      </ProjectAction>
      <ProjectAction
        project={projects[2]}
        onOpenProject={onOpenProject}
        className={`world-project-link world-project-link--three scene-entity ${zoneStateClass('works', activeSection)} ${activeSection === 'works' ? 'is-interactive' : ''}`}
        data-zone="works"
        tabIndex={activeSection === 'works' ? 0 : -1}
        aria-hidden={activeSection !== 'works'}
        aria-label="播放毕业设计《我们》"
      >
        <CinemaStage image={projects[2].image} imageFit="meet" title="03 / 我们" accent={WORLD_PALETTE.yellow} />
      </ProjectAction>

      <WorldItem x={2200} y={1510} width={800} zIndex={depthFor(2110, 40)} className={`world-landmark world-landmark--contact scene-entity ${zoneStateClass('contact', activeSection)}`} data-zone="contact" aria-hidden="true">
        <BroadcastTower />
      </WorldItem>

      {WORKFLOW_STATIONS.map((station) => (
        <WorldItem
          key={station.id}
          x={station.x - station.size / 2}
          y={station.y - station.size * 0.72}
          width={station.size}
          zIndex={depthFor(station.y, 12)}
          className={`world-workflow world-workflow--${station.variant} scene-entity ${zoneStateClass(station.zone, activeSection)} ${activeSection === 'top' || activeSection === station.zone ? 'is-related' : ''}`}
          data-zone={station.zone}
          aria-hidden="true"
        >
          <WorkflowStation variant={station.variant} />
        </WorldItem>
      ))}

      {WORKFLOW_STATIONS.map((station) => (
        <WorkflowMarker key={`${station.id}-marker`} station={station} activeSection={activeSection} />
      ))}

      {visibleProps.map((placement) => (
        <WorldItem
          key={placement.id}
          x={placement.x - placement.size / 2}
          y={placement.y - placement.size * 0.72}
          width={placement.size}
          zIndex={placement.depth}
          flip={placement.flipX}
          className={`world-prop world-prop--${placement.zone} scene-entity ${zoneStateClass(placement.zone, activeSection)}`}
          data-zone={placement.zone}
          aria-hidden="true"
        >
          <StudioProp type={placement.type} />
        </WorldItem>
      ))}

      {visibleCrew.map((person, index) => (
        <WorldItem
          key={person.id}
          x={person.x - 36}
          y={person.y - 94}
          width={72}
          zIndex={person.depth}
          className={`world-crew world-crew--${person.zone} scene-entity ${zoneStateClass(person.zone, activeSection)}`}
          data-zone={person.zone}
          data-crew-id={person.id}
          data-crew-role={person.role}
          aria-hidden="true"
        >
          <PixelCrew
            variant={crewVariant[person.pose] || ['director', 'camera', 'editor', 'sound'][index % 4]}
            direction={person.facing}
            accent={person.accent}
            aria-label={person.role}
          />
        </WorldItem>
      ))}
    </div>
  )
}

function ProjectAction({ project, onOpenProject, className = '', children, ...actionProps }) {
  const actionLabel = project.video ? 'PLAY FILM' : 'VIEW PROJECT'

  if (project.video) {
    return (
      <button type="button" className={className} data-action={actionLabel} onClick={() => onOpenProject(project)} {...actionProps}>
        {children}
      </button>
    )
  }

  return (
    <a className={className} data-action={actionLabel} href={project.link} target="_blank" rel="noreferrer" {...actionProps}>
      {children}
    </a>
  )
}

function ChapterOverlays({ activeSection, onOpenProject }) {
  return (
    <div className="chapter-overlays">
      <section className={`chapter-panel chapter-panel--top ${activeSection === 'top' ? 'is-active' : ''}`} data-chapter="top" aria-hidden={activeSection !== 'top'}>
        <p className="chapter-kicker">00 / DIRECTOR STUDIO · MASTER SHOT</p>
        <h2>把故事、声音与 AI，<br />调度成一部作品。</h2>
        <p>滚动不是翻页，是移动摄影机。沿制作轨道进入张国熙的 AI 影像片场。</p>
        <div className="chapter-signal"><i /><span>ROLL CAMERA</span><strong>SCROLL TO EXPLORE</strong></div>
      </section>

      <section className={`chapter-panel chapter-panel--statement ${activeSection === 'statement' ? 'is-active' : ''}`} data-chapter="statement" aria-hidden={activeSection !== 'statement'}>
        <p className="chapter-kicker">01 / CREATIVE STATEMENT</p>
        <h2>让想象，<br />被看见。</h2>
        <p>我把 AI 看作影像生产的新现场，而不是替代判断的捷径。故事、构图、声音和剪辑必须共同指向同一种观看体验。</p>
      </section>

      <section className={`chapter-panel chapter-panel--profile ${activeSection === 'profile' ? 'is-active' : ''}`} data-chapter="profile" aria-hidden={activeSection !== 'profile'}>
        <p className="chapter-kicker">02 / PROFILE</p>
        <h2>声音训练，<br />成为影像直觉。</h2>
        <p>毕业于昆明传媒学院录音艺术专业。通过剪辑实践与自主研修，把对节奏的敏感延伸到画面、转场和镜头衔接，并能协同使用各类主流 AI 模型。</p>
        <dl className="panel-facts">
          {facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
      </section>

      <section className={`chapter-panel chapter-panel--strengths ${activeSection === 'strengths' ? 'is-active' : ''}`} data-chapter="strengths" aria-hidden={activeSection !== 'strengths'}>
        <p className="chapter-kicker">03 / STRENGTHS</p>
        <h2>一套完整的<br />AI 导演工作流。</h2>
        <ol className="panel-principles">
          {principles.map((item, index) => (
            <li key={item.number} style={{ '--accent': COLORS[index] }}>
              <span>{item.number}</span><strong>{item.title}</strong><small>{item.english}</small>
            </li>
          ))}
        </ol>
      </section>

      <section className={`chapter-panel chapter-panel--works ${activeSection === 'works' ? 'is-active' : ''}`} data-chapter="works" aria-hidden={activeSection !== 'works'}>
        <p className="chapter-kicker">04 / SELECTED WORKS</p>
        <h2>作品正在<br />世界里放映。</h2>
        <div className="panel-projects">
          {projects.map((project) => (
            <ProjectAction key={project.index} project={project} onOpenProject={onOpenProject}>
              <span>{project.index}</span>
              <strong>{project.title}</strong>
              <small>{project.video ? project.duration + ' · PLAY ▶' : project.year + ' · MGTV ↗'}</small>
            </ProjectAction>
          ))}
        </div>
      </section>

      <section className={`chapter-panel chapter-panel--contact ${activeSection === 'contact' ? 'is-active' : ''}`} data-chapter="contact" aria-hidden={activeSection !== 'contact'}>
        <p className="chapter-kicker">05 / CONTACT</p>
        <h2>下一部作品，<br />从一帧开始。</h2>
        <p>AI 视觉设计 / AI 漫剧导演 / 影像剪辑与声音叙事</p>
        <div className="contact-lines"><span>EMAIL</span><strong>AVAILABLE ON REQUEST</strong><span>WECHAT</span><strong>AVAILABLE ON REQUEST</strong></div>
      </section>
    </div>
  )
}

function LinearPortfolio({ onOpenProject }) {
  return (
    <div className="linear-site" role="main">
      <header className="linear-hero" id="linear-top">
        <div className="linear-mark">ZG<i /><i /><i /><i /></div>
        <p>AI DESIGNER / AI DRAMA DIRECTOR</p>
        <h1>张国熙</h1>
        <span>把故事、声音与 AI 模型组织成可以被看见的影像。</span>
      </header>

      <section className="linear-section" id="linear-statement"><p>01 / STATEMENT</p><h2>让想象，被看见。</h2><p>我把 AI 看作影像生产的新现场。从故事、构图、声音到剪辑，每一帧都需要明确它为什么存在，又将观众带向哪里。</p></section>
      <section className="linear-section" id="linear-profile"><p>02 / PROFILE</p><h2>声音训练，成为影像直觉。</h2><p>昆明传媒学院录音艺术本科。熟悉视频剪辑与各类主流 AI 模型，善于沟通协作，能在高压制作中保持责任心、耐心与细节判断。</p><dl className="linear-facts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
      <section className="linear-section" id="linear-strengths"><p>03 / STRENGTHS</p><h2>四种能力，一套导演方法。</h2><div className="linear-principles">{principles.map((item, index) => <article key={item.number} style={{ '--accent': COLORS[index] }}><span>{item.number}</span><h3>{item.title}</h3><small>{item.english}</small><p>{item.body}</p></article>)}</div></section>
      <section className="linear-section" id="linear-works"><p>04 / SELECTED WORKS</p><h2>三部作品，三种叙事引力。</h2><div className="linear-projects">{projects.map((project) => <ProjectAction key={project.index} project={project} onOpenProject={onOpenProject}><img src={project.image} alt={`《${project.title}》作品画面`} /><span>{project.index} / {project.video ? project.duration : project.year}</span><h3>{project.title}</h3><small>{project.english}</small><p>{project.description}</p></ProjectAction>)}</div></section>
      <section className="linear-section linear-contact" id="linear-contact"><p>05 / CONTACT</p><h2>下一部作品，<br />从一帧开始。</h2><span>EMAIL / WECHAT · AVAILABLE ON REQUEST</span></section>
    </div>
  )
}

function FilmModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <div className="film-modal" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="film-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="film-modal-title">
        <header className="film-modal__header">
          <div>
            <span>03 / GRADUATION FILM · {project.duration}</span>
            <h2 id="film-modal-title">《{project.title}》</h2>
            <p>{project.role} / AI GENERATED ANIMATION</p>
          </div>
          <button type="button" onClick={onClose} autoFocus aria-label="关闭影片">
            CLOSE <i>×</i>
          </button>
        </header>
        <div className="film-modal__screen">
          <video controls preload="metadata" poster={project.image}>
            <source src={project.video} type="video/mp4" />
            当前浏览器无法播放此视频。
          </video>
        </div>
        <footer><span>DIRECTED &amp; VISUAL GENERATED BY ZHANG GUOXI</span><span>SCROLL LOCKED / ESC TO CLOSE</span></footer>
      </section>
    </div>
  )
}

function App() {
  const rootRef = useRef(null)
  const scrollSceneRef = useRef(null)
  const cameraRef = useRef(null)
  const progressRef = useRef(null)
  const lastSectionRef = useRef('top')
  const [activeSection, setActiveSection] = useState('top')
  const [activeVideo, setActiveVideo] = useState(null)
  const { soundEnabled, toggleSound, playCue } = useStudioSound(activeSection)

  useGSAP(
    () => {
      const scene = scrollSceneRef.current
      const camera = cameraRef.current
      if (!scene || !camera) return undefined

      const media = gsap.matchMedia()
      media.add(
        {
          desktop: '(min-width: 1000px)',
          motion: '(prefers-reduced-motion: no-preference)',
        },
        ({ conditions }) => {
          if (!conditions.desktop || !conditions.motion) return undefined

          const transformFor = (stop) => {
            const coverScale = Math.max(
              (window.innerWidth / WORLD_SIZE.width) * 1.02,
              (window.innerHeight / WORLD_SIZE.height) * 1.02,
            )
            const adjustedStop = stop.id === 'top'
              ? { ...stop, zoom: Math.max(stop.zoom, coverScale) }
              : stop

            return cameraTransformFor(adjustedStop, {
              width: window.innerWidth,
              height: window.innerHeight,
            })
          }

          gsap.set(camera, transformFor(CAMERA_STOPS[0]))

          const timeline = gsap.timeline({ defaults: { ease: 'none' } })
          CAMERA_STOPS.slice(1).forEach((stop, index) => {
            const previous = CAMERA_STOPS[index]
            const span = stop.progress - previous.progress
            const travel = span
            const targetVars = {
              x: () => transformFor(stop).x,
              y: () => transformFor(stop).y,
              scale: () => transformFor(stop).scale,
              rotation: stop.rotation,
              duration: travel,
              ease: 'none',
            }

            if (index === 0) {
              timeline.fromTo(
                camera,
                {
                  x: () => transformFor(previous).x,
                  y: () => transformFor(previous).y,
                  scale: () => transformFor(previous).scale,
                  rotation: previous.rotation,
                },
                targetVars,
                previous.progress,
              )
            } else {
              timeline.to(camera, targetVars, previous.progress)
            }
          })

          const selectSection = (progress) => {
            let selected = CAMERA_STOPS[0]
            for (let index = 1; index < CAMERA_STOPS.length; index += 1) {
              const previous = CAMERA_STOPS[index - 1]
              const current = CAMERA_STOPS[index]
              const arrivalPoint = previous.progress + (current.progress - previous.progress) * 0.72
              if (progress >= arrivalPoint) selected = current
            }

            if (selected.id !== lastSectionRef.current) {
              lastSectionRef.current = selected.id
              setActiveSection(selected.id)
            }
          }

          const trigger = ScrollTrigger.create({
            trigger: scene,
            start: 'top top',
            end: 'bottom bottom',
            animation: timeline,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              selectSection(self.progress)
              if (progressRef.current) gsap.set(progressRef.current, { scaleX: self.progress })
            },
          })

          selectSection(trigger.progress)
          return () => {
            trigger.kill()
            timeline.kill()
          }
        },
      )

      return () => media.revert()
    },
    { scope: rootRef },
  )

  useGSAP(
    () => {
      const desktopWorld = window.matchMedia('(min-width: 1000px)').matches
      const allowMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
      if (!desktopWorld || !allowMotion) return undefined

      const activeLandmark = rootRef.current?.querySelector(
        `.world-landmark[data-zone="${activeSection}"] > svg`,
      )
      const activeEntities = gsap.utils.toArray(
        `.scene-entity.is-zone-active[data-zone="${activeSection}"]`,
        rootRef.current,
      )
      const panelParts = gsap.utils.toArray(
        `.chapter-panel[data-chapter="${activeSection}"] > *`,
        rootRef.current,
      )
      const frameCorners = gsap.utils.toArray('.monitor-frame__corner', rootRef.current)

      const arrival = gsap.timeline()
      arrival
        .fromTo(
          frameCorners,
          { opacity: 0.16, scale: 0.82 },
          { opacity: 0.72, scale: 1, duration: 0.24, stagger: 0.035, ease: 'steps(4)' },
          0,
        )
        .fromTo(
          activeEntities,
          { opacity: 0.34 },
          { opacity: 1, duration: 0.32, stagger: 0.025, ease: 'steps(4)' },
          0.03,
        )
        .fromTo(
          panelParts,
          { opacity: 0, x: 12 },
          { opacity: 1, x: 0, duration: 0.3, stagger: 0.055, ease: 'steps(5)' },
          0.08,
        )

      if (activeLandmark) {
        arrival.fromTo(
          activeLandmark,
          { y: 10 },
          { y: 0, duration: 0.42, ease: 'steps(5)' },
          0.02,
        )
      }

      return () => arrival.kill()
    },
    { scope: rootRef, dependencies: [activeSection], revertOnUpdate: true },
  )

  const jumpTo = (id) => {
    const scene = scrollSceneRef.current
    const desktopWorld = window.matchMedia('(min-width: 1000px) and (prefers-reduced-motion: no-preference)').matches
    if (!desktopWorld || !scene) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      document.getElementById(`linear-${id}`)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
      return
    }

    const stop = CAMERA_STOPS.find((item) => item.id === id)
    if (!stop) return
    const sceneTop = window.scrollY + scene.getBoundingClientRect().top
    const travel = scene.offsetHeight - window.innerHeight
    window.scrollTo({ top: sceneTop + stop.progress * travel, behavior: 'auto' })
  }

  const activeStop = CAMERA_STOPS.find((stop) => stop.id === activeSection) || CAMERA_STOPS[0]
  const activeMeta = SECTION_META[activeSection] || SECTION_META.top
  const openProject = (project) => {
    playCue('shutter')
    setActiveVideo(project)
  }

  return (
    <div className="portfolio" ref={rootRef} style={{ '--scene-accent': activeMeta.accent }}>
      <PixelTrail />
      <h1 className="sr-only">ZHANG GUOXI — AI DESIGNER / AI DRAMA DIRECTOR</h1>

      <aside className="world-hud">
        <PixelIdentityBadge />
        <div className="hud-nav-panel">
          <nav aria-label="世界章节导航">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                data-camera-stop={item.id}
                className={activeSection === item.id ? 'is-active' : ''}
                aria-current={activeSection === item.id ? 'location' : undefined}
                style={{ '--nav-accent': item.accent }}
                onClick={() => {
                  playCue('tick')
                  jumpTo(item.id)
                }}
              >
                <span>{item.number}</span>{item.label}
              </button>
            ))}
          </nav>
          <div className="hud-mode">
            <span>SCENE</span><strong>{activeMeta.scene} / {activeMeta.take}</strong>
            <span>WHEEL</span><strong>MOVE CAMERA</strong>
          </div>
        </div>
      </aside>

      <main className="world-scroll-scene" ref={scrollSceneRef}>
        <div className="world-viewport" data-active-section={activeSection}>
          <ViewportAtmosphere activeSection={activeSection} />
          <div className="world-camera" ref={cameraRef}>
            <WorldScene activeSection={activeSection} onOpenProject={openProject} />
          </div>
          <ChapterOverlays activeSection={activeSection} onOpenProject={openProject} />
          <DirectorMonitor activeSection={activeSection} soundEnabled={soundEnabled} onToggleSound={toggleSound} />
          <div className="world-progress" aria-hidden="true">
            <i ref={progressRef} />
            <div className="world-progress__cuts">
              {CAMERA_STOPS.map((stop) => (
                <span key={stop.id} style={{ left: `${stop.progress * 100}%` }} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <LinearPortfolio onOpenProject={openProject} />
      <FilmModal project={activeVideo} onClose={() => {
        playCue('tick')
        setActiveVideo(null)
      }} />
    </div>
  )
}

export default App
