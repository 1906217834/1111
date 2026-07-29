/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, useGLTF, useTexture } from '@react-three/drei'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import * as THREE from 'three'
import cardGLB from './card.glb'
import defaultLanyard from './lanyard.png'
import './Lanyard.css'

extend({ MeshLineGeometry, MeshLineMaterial })

const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 }
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 }

function drawFittedImage(context, image, rect, width, height, fit) {
  const x = rect.x * width
  const y = rect.y * height
  const targetWidth = rect.w * width
  const targetHeight = rect.h * height
  const imageWidth = image.naturalWidth || image.width
  const imageHeight = image.naturalHeight || image.height
  const scalePicker = fit === 'contain' ? Math.min : Math.max
  const scale = scalePicker(targetWidth / imageWidth, targetHeight / imageHeight)
  const renderedWidth = imageWidth * scale
  const renderedHeight = imageHeight * scale

  context.save()
  context.beginPath()
  context.rect(x, y, targetWidth, targetHeight)
  context.clip()
  context.drawImage(
    image,
    x + (targetWidth - renderedWidth) / 2,
    y + (targetHeight - renderedHeight) / 2,
    renderedWidth,
    renderedHeight,
  )
  context.restore()
}

function KineticBand({
  frontImage,
  backImage,
  imageFit,
  lanyardImage,
  lanyardWidth,
  onDragChange,
  onReady,
}) {
  const band = useRef(null)
  const cardGroup = useRef(null)
  const cardPosition = useRef(new THREE.Vector3(0.12, -0.48, 0))
  const cardVelocity = useRef(new THREE.Vector3())
  const pointerPoint = useRef(new THREE.Vector3())
  const pointerDirection = useRef(new THREE.Vector3())
  const dragTarget = useRef(new THREE.Vector3())
  const restingPoint = useRef(new THREE.Vector3())
  const springForce = useRef(new THREE.Vector3())
  const cardAttachment = useRef(new THREE.Vector3())
  const cardEuler = useRef(new THREE.Euler())
  const [dragOffset, setDragOffset] = useState(false)
  const { nodes, materials } = useGLTF(cardGLB)
  const bandTexture = useTexture(lanyardImage || defaultLanyard)
  const frontTexture = useTexture(frontImage || BLANK_PIXEL)
  const backTexture = useTexture(backImage || BLANK_PIXEL)
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
  ]), [])
  const anchor = useMemo(() => new THREE.Vector3(0, 2.16, 0), [])

  const cardMap = useMemo(() => {
    const baseMap = materials.base.map
    if (!frontImage && !backImage) return baseMap

    const baseImage = baseMap.image
    const canvas = document.createElement('canvas')
    canvas.width = baseImage.width
    canvas.height = baseImage.height
    const context = canvas.getContext('2d')
    if (!context) return baseMap

    context.drawImage(baseImage, 0, 0, canvas.width, canvas.height)
    if (frontImage && frontTexture.image) {
      drawFittedImage(context, frontTexture.image, FRONT_UV_RECT, canvas.width, canvas.height, imageFit)
    }
    if (backImage && backTexture.image) {
      drawFittedImage(context, backTexture.image, BACK_UV_RECT, canvas.width, canvas.height, imageFit)
    }

    const composite = new THREE.CanvasTexture(canvas)
    composite.colorSpace = THREE.SRGBColorSpace
    composite.flipY = baseMap.flipY
    composite.anisotropy = 8
    composite.needsUpdate = true
    return composite
  }, [backImage, backTexture, frontImage, frontTexture, imageFit, materials.base.map])

  useEffect(() => () => {
    if (cardMap !== materials.base.map) cardMap.dispose()
  }, [cardMap, materials.base.map])

  useEffect(() => {
    const readyTimer = window.setTimeout(() => onReady?.(), 160)
    return () => window.clearTimeout(readyTimer)
  }, [onReady])

  useEffect(() => {
    bandTexture.wrapS = bandTexture.wrapT = THREE.RepeatWrapping
    bandTexture.needsUpdate = true
  }, [bandTexture])

  useFrame((state, delta) => {
    if (!cardGroup.current || !band.current) return

    const frameDelta = Math.min(delta, 1 / 30)
    const position = cardPosition.current
    const velocity = cardVelocity.current

    if (dragOffset) {
      pointerPoint.current.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      pointerDirection.current.copy(pointerPoint.current).sub(state.camera.position).normalize()
      const planeDistance = -state.camera.position.z / pointerDirection.current.z
      dragTarget.current
        .copy(state.camera.position)
        .add(pointerDirection.current.multiplyScalar(planeDistance))
        .sub(dragOffset)
      dragTarget.current.x = THREE.MathUtils.clamp(dragTarget.current.x, -1.15, 1.15)
      dragTarget.current.y = THREE.MathUtils.clamp(dragTarget.current.y, -1.46, 0.9)
      dragTarget.current.z = 0
      velocity.copy(dragTarget.current).sub(position).multiplyScalar(1 / frameDelta)
      position.lerp(dragTarget.current, 1 - Math.exp(-28 * frameDelta))
    } else {
      const elapsed = state.clock.elapsedTime
      restingPoint.current.set(
        Math.sin(elapsed * 0.72) * 0.035,
        -0.5 + Math.sin(elapsed * 0.94) * 0.012,
        0,
      )
      springForce.current.copy(restingPoint.current).sub(position).multiplyScalar(31)
      velocity.addScaledVector(springForce.current, frameDelta)
      velocity.multiplyScalar(Math.exp(-6.4 * frameDelta))
      position.addScaledVector(velocity, frameDelta)
    }

    cardGroup.current.position.copy(position)
    cardGroup.current.rotation.z = THREE.MathUtils.damp(
      cardGroup.current.rotation.z,
      -position.x * 0.2 - velocity.x * 0.014,
      7,
      frameDelta,
    )
    cardGroup.current.rotation.y = THREE.MathUtils.damp(
      cardGroup.current.rotation.y,
      velocity.x * 0.012,
      8,
      frameDelta,
    )
    cardGroup.current.rotation.x = THREE.MathUtils.damp(
      cardGroup.current.rotation.x,
      velocity.y * -0.008,
      8,
      frameDelta,
    )

    cardEuler.current.copy(cardGroup.current.rotation)
    cardAttachment.current
      .set(0, 1.5, 0)
      .applyEuler(cardEuler.current)
      .add(position)

    curve.points[0].copy(cardAttachment.current)
    curve.points[1].lerpVectors(cardAttachment.current, anchor, 0.34)
    curve.points[1].x += velocity.x * 0.005
    curve.points[2].lerpVectors(cardAttachment.current, anchor, 0.7)
    curve.points[2].x -= velocity.x * 0.003
    curve.points[3].copy(anchor)
    band.current.geometry.setPoints(curve.getPoints(28))
  })

  curve.curveType = 'chordal'

  const finishDrag = (event) => {
    event.stopPropagation()
    try {
      event.target.releasePointerCapture?.(event.pointerId)
    } catch {
      // The pointer may already have been released by the browser.
    }
    setDragOffset(false)
    onDragChange(false)
  }

  return (
    <>
      <group ref={cardGroup} position={[0.12, -0.48, 0]}>
        <group
          scale={2.25}
          position={[0, -1.2, -0.05]}
          onPointerDown={(event) => {
            event.stopPropagation()
            event.target.setPointerCapture(event.pointerId)
            setDragOffset(
              new THREE.Vector3()
                .copy(event.point)
                .sub(cardPosition.current),
            )
            onDragChange(true)
          }}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
        >
          <mesh geometry={nodes.card.geometry}>
            <meshPhysicalMaterial
              map={cardMap}
              map-anisotropy={8}
              clearcoat={0.55}
              clearcoatRoughness={0.24}
              roughness={0.82}
              metalness={0.44}
            />
          </mesh>
          <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.36} />
          <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
        </group>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#ffffff"
          depthTest={false}
          resolution={[520, 900]}
          useMap
          map={bandTexture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  )
}

export default function Lanyard({
  position = [0, 0, 11],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 0.72,
  onReady,
}) {
  const [dragging, setDragging] = useState(false)

  return (
    <div className={`lanyard-wrapper ${dragging ? 'is-dragging' : ''}`}>
      <Canvas
        camera={{ position, fov }}
        dpr={[1, 1.35]}
        gl={{
          alpha: transparent,
          antialias: false,
          powerPreference: 'low-power',
          preserveDrawingBuffer: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x050505), transparent ? 0 : 1)
        }}
      >
        <ambientLight intensity={Math.PI * 0.82} />
        <KineticBand
          frontImage={frontImage}
          backImage={backImage}
          imageFit={imageFit}
          lanyardImage={lanyardImage}
          lanyardWidth={lanyardWidth}
          onDragChange={setDragging}
          onReady={onReady}
        />
        <Environment blur={0.72}>
          <Lightformer intensity={2.4} color="#f0f0eb" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[60, 0.1, 1]} />
          <Lightformer intensity={3.2} color="#4398cd" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[60, 0.1, 1]} />
          <Lightformer intensity={4} color="#f0f0eb" position={[-8, 0, 12]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[60, 8, 1]} />
        </Environment>
      </Canvas>
    </div>
  )
}

useGLTF.preload(cardGLB)
