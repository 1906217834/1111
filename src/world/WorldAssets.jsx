import React, { useId, useMemo } from 'react'
import {
  AssetSvg,
  GroundShadow,
  ISO_ORIGIN,
  PixelMark,
  VoxelBlock,
  VoxelFrame,
  VoxelTile,
  WORLD_PALETTE,
  projectIso,
} from './VoxelPrimitives'

const ACCENTS = [
  WORLD_PALETTE.blue,
  WORLD_PALETTE.red,
  WORLD_PALETTE.green,
  WORLD_PALETTE.yellow,
]

function commonAssetProps(props, fallbackLabel) {
  const {
    className = '',
    style,
    'aria-label': ariaLabel = fallbackLabel,
    ...rest
  } = props

  return { className, style, label: ariaLabel, ...rest }
}

function MachineScreen({
  x,
  y,
  z,
  width = 3,
  height = 3.4,
  accent = WORLD_PALETTE.blue,
  children,
}) {
  return (
    <g data-part="screen">
      <VoxelBlock
        x={x}
        y={y}
        z={z}
        w={width}
        d={0.35}
        h={height}
        top={WORLD_PALETTE.pale}
        front={WORLD_PALETTE.graphite}
        side={WORLD_PALETTE.dark}
      />
      <VoxelBlock
        x={x + 0.35}
        y={y - 0.04}
        z={z + 0.55}
        w={width - 0.7}
        d={0.18}
        h={height - 1.05}
        top={WORLD_PALETTE.ink}
        front={WORLD_PALETTE.ink}
        side={WORLD_PALETTE.ink}
      />
      <VoxelBlock
        x={x + 0.68}
        y={y - 0.08}
        z={z + height - 1.15}
        w={width - 1.35}
        d={0.12}
        h={0.18}
        top={accent}
        front={accent}
        side={WORLD_PALETTE.dark}
      />
      <VoxelBlock
        x={x + 0.68}
        y={y - 0.08}
        z={z + height - 1.62}
        w={width - 1.75}
        d={0.12}
        h={0.14}
        top={WORLD_PALETTE.paper}
        front={WORLD_PALETTE.paper}
        side={WORLD_PALETTE.dark}
      />
      {children}
    </g>
  )
}

export function HeroGate(props) {
  const svgProps = commonAssetProps(props, 'AI 分镜导演控制台')

  return (
    <AssetSvg {...svgProps} viewBox="0 110 640 360">
      <GroundShadow x={-10.8} y={-3.8} w={21.6} d={8.1} />
      <VoxelBlock x={-10} y={-3.2} w={20} d={7} h={0.72} top={WORLD_PALETTE.graphite} front={WORLD_PALETTE.dark} />
      <VoxelBlock x={-8.8} y={-2.35} z={0.72} w={17.6} d={5.2} h={0.56} top={WORLD_PALETTE.mid} front={WORLD_PALETTE.graphite} />

      <g data-part="storyboard-wall">
        <MachineScreen x={-7.75} y={-1.72} z={1.28} width={4.25} height={5.15} accent={WORLD_PALETTE.blue}>
          <g data-part="story-input">
            <VoxelFrame
              x={-7.12}
              y={-1.92}
              z={2.08}
              w={2.7}
              h={1.72}
              thickness={0.16}
              depth={0.1}
              top={WORLD_PALETTE.pale}
              front={WORLD_PALETTE.pale}
            />
            <VoxelBlock x={-6.67} y={-1.96} z={2.45} w={0.75} d={0.08} h={0.86} top={WORLD_PALETTE.blue} front={WORLD_PALETTE.blue} />
            <VoxelBlock x={-5.72} y={-1.96} z={2.26} w={0.82} d={0.08} h={0.28} top={WORLD_PALETTE.paper} front={WORLD_PALETTE.paper} />
            <VoxelBlock x={-5.72} y={-1.96} z={2.74} w={0.58} d={0.08} h={0.18} top={WORLD_PALETTE.mid} front={WORLD_PALETTE.mid} />
            <PixelMark x={-4.7} y={-1.98} z={4.36} size={0.24} color={WORLD_PALETTE.blue} data-part="signal" />
          </g>
        </MachineScreen>
        <MachineScreen x={-2.62} y={-1.72} z={1.28} width={5.25} height={6.35} accent={WORLD_PALETTE.red}>
          <g data-part="shot-queue">
            {[-2.02, -0.62, 0.78].map((x, index) => (
              <g key={x}>
                <VoxelFrame
                  x={x}
                  y={-1.94}
                  z={4.05}
                  w={1.14}
                  h={1.38}
                  thickness={0.13}
                  depth={0.08}
                  top={WORLD_PALETTE.pale}
                  front={WORLD_PALETTE.pale}
                />
                <VoxelBlock
                  x={x + 0.25}
                  y={-1.98}
                  z={4.3 + (index % 2) * 0.18}
                  w={0.48}
                  d={0.06}
                  h={0.54}
                  top={ACCENTS[index]}
                  front={ACCENTS[index]}
                />
              </g>
            ))}
            {[
              [-2.02, 2.2, 3.72, WORLD_PALETTE.paper],
              [-2.02, 2.66, 2.78, WORLD_PALETTE.blue],
              [-2.02, 3.12, 3.28, WORLD_PALETTE.mid],
              [-2.02, 3.58, 2.16, WORLD_PALETTE.red],
            ].map(([x, z, width, color]) => (
              <VoxelBlock key={`${z}-${width}`} x={x} y={-1.96} z={z} w={width} d={0.08} h={0.12} top={color} front={color} />
            ))}
            <VoxelBlock x={0.18} y={-1.99} z={2.02} w={0.16} d={0.06} h={1.92} top={WORLD_PALETTE.yellow} front={WORLD_PALETTE.yellow} data-part="signal" />
          </g>
        </MachineScreen>
        <MachineScreen x={3.5} y={-1.72} z={1.28} width={4.25} height={5.15} accent={WORLD_PALETTE.yellow}>
          <g data-part="voice-sync">
            {[0.62, 1.18, 0.84, 1.56, 0.96, 1.34, 0.72].map((height, index) => (
              <VoxelBlock
                key={`${height}-${index}`}
                x={3.98 + index * 0.43}
                y={-1.96}
                z={2.06}
                w={0.22}
                d={0.08}
                h={height}
                top={index === 3 ? WORLD_PALETTE.yellow : WORLD_PALETTE.blue}
                front={index === 3 ? WORLD_PALETTE.yellow : WORLD_PALETTE.blue}
                data-part={index === 3 ? 'signal' : undefined}
              />
            ))}
            <VoxelBlock x={4} y={-1.96} z={3.94} w={2.82} d={0.08} h={0.12} top={WORLD_PALETTE.paper} front={WORLD_PALETTE.paper} />
            <VoxelBlock x={4} y={-1.96} z={4.3} w={2.08} d={0.08} h={0.12} top={WORLD_PALETTE.mid} front={WORLD_PALETTE.mid} />
            <PixelMark x={6.58} y={-1.98} z={4.22} size={0.24} color={WORLD_PALETTE.green} />
          </g>
        </MachineScreen>
        <VoxelBlock x={-8.25} y={-1.48} z={7.82} w={16.5} d={0.72} h={0.46} top={WORLD_PALETTE.pale} front={WORLD_PALETTE.graphite} />
        {ACCENTS.map((color, index) => (
          <PixelMark key={color} x={-2.25 + index * 1.45} y={-1.88} z={8.34} size={0.52} color={color} data-part="signal" />
        ))}
      </g>

      <g data-part="director-console">
        <VoxelBlock x={-8.2} y={2.05} z={1.28} w={16.4} d={3.05} h={1.28} top={WORLD_PALETTE.pale} front={WORLD_PALETTE.graphite} />
        <VoxelBlock x={-7.35} y={2.55} z={2.56} w={14.7} d={1.72} h={0.28} top={WORLD_PALETTE.ink} front={WORLD_PALETTE.dark} />
        {[-6.55, -4.65, -2.75, -0.85, 1.05, 2.95, 4.85].map((x, index) => (
          <g key={x}>
            <VoxelBlock x={x} y={2.92} z={2.84} w={0.28} d={1.05} h={0.12} top={WORLD_PALETTE.mid} front={WORLD_PALETTE.mid} />
            <VoxelBlock x={x - 0.2} y={3.2 + (index % 3) * 0.18} z={2.96} w={0.68} d={0.46} h={0.24} top={ACCENTS[index % ACCENTS.length]} front={ACCENTS[index % ACCENTS.length]} />
          </g>
        ))}
      </g>

      <g data-part="director-chair">
        <VoxelBlock x={-1.55} y={4.62} z={0.72} w={3.1} d={1.72} h={0.68} top={WORLD_PALETTE.pale} />
        <VoxelBlock x={-1.18} y={5.35} z={1.4} w={2.36} d={1.08} h={2.35} top={WORLD_PALETTE.graphite} front={WORLD_PALETTE.dark} />
      </g>

      <g data-part="camera-arm">
        <VoxelBlock x={-9.35} y={2.65} z={0.72} w={0.56} d={0.56} h={3.45} />
        <VoxelBlock x={-9.02} y={2.57} z={3.55} w={3.18} d={0.46} h={0.42} />
        <VoxelBlock x={-6.28} y={2.28} z={3.22} w={1.56} d={1.04} h={1.08} top={WORLD_PALETTE.pale} />
        <PixelMark x={-5.03} y={2.2} z={3.48} size={0.48} color={WORLD_PALETTE.blue} data-part="signal" />
      </g>

      <g data-part="model-status">
        <VoxelBlock x={8.35} y={1.55} z={0.72} w={1.15} d={1.15} h={3.45} top={WORLD_PALETTE.blue} />
        <VoxelBlock x={9.62} y={1.55} z={0.72} w={1.15} d={1.15} h={4.65} top={WORLD_PALETTE.yellow} />
        <VoxelBlock x={10.89} y={1.55} z={0.72} w={1.15} d={1.15} h={2.55} top={WORLD_PALETTE.green} />
      </g>
    </AssetSvg>
  )
}

function StationBase({ accent = WORLD_PALETTE.blue }) {
  return (
    <>
      <GroundShadow x={-8.4} y={-3.7} w={16.8} d={8.2} />
      <VoxelBlock x={-8} y={-3.35} w={16} d={7.4} h={0.42} top={WORLD_PALETTE.dark} front={WORLD_PALETTE.ink} />
      <VoxelBlock x={-7.25} y={-2.7} z={0.42} w={14.5} d={6.1} h={0.34} top={WORLD_PALETTE.graphite} front={WORLD_PALETTE.dark} />
      <VoxelBlock x={-6.35} y={2.66} z={0.76} w={3.1} d={0.42} h={0.2} top={accent} front={accent} />
    </>
  )
}

function ScriptInputStation() {
  return (
    <>
      <StationBase accent={WORLD_PALETTE.blue} />
      <VoxelFrame
        x={-6.15}
        y={-1.72}
        z={0.76}
        w={4.1}
        h={4.55}
        thickness={0.52}
        depth={0.76}
        top={WORLD_PALETTE.pale}
        front={WORLD_PALETTE.graphite}
      />
      <VoxelBlock x={-5.08} y={-1.84} z={1.7} w={2.02} d={0.18} h={2.38} top={WORLD_PALETTE.ink} front={WORLD_PALETTE.ink} />
      <VoxelBlock x={-4.68} y={-1.9} z={2.22} w={1.18} d={0.1} h={0.16} top={WORLD_PALETTE.blue} front={WORLD_PALETTE.blue} />
      <VoxelBlock x={-4.68} y={-1.9} z={2.72} w={0.82} d={0.1} h={0.14} top={WORLD_PALETTE.paper} front={WORLD_PALETTE.paper} />
      <PixelMark x={-3.62} y={-1.92} z={3.45} size={0.3} color={WORLD_PALETTE.green} />

      {[0, 1, 2].map((index) => (
        <g key={index}>
          <VoxelBlock
            x={0.25 + index * 0.54}
            y={-0.72 + index * 0.42}
            z={0.76 + index * 0.28}
            w={4.25}
            d={2.75}
            h={0.22}
            top={index === 2 ? WORLD_PALETTE.paper : WORLD_PALETTE.pale}
            front={WORLD_PALETTE.graphite}
          />
          <VoxelBlock
            x={3.65 + index * 0.54}
            y={-0.35 + index * 0.42}
            z={1.02 + index * 0.28}
            w={0.56}
            d={0.52}
            h={0.16}
            top={ACCENTS[index]}
            front={ACCENTS[index]}
          />
        </g>
      ))}
    </>
  )
}

function CharacterLockStation() {
  return (
    <>
      <StationBase accent={WORLD_PALETTE.green} />
      <VoxelFrame
        x={-5.8}
        y={-1.85}
        z={0.76}
        w={11.6}
        h={5.85}
        thickness={0.54}
        depth={0.68}
        top={WORLD_PALETTE.pale}
        front={WORLD_PALETTE.graphite}
      />
      <VoxelBlock x={-3.7} y={0.35} z={0.76} w={7.4} d={3.6} h={0.42} top={WORLD_PALETTE.mid} front={WORLD_PALETTE.dark} />
      <VoxelBlock x={-2.75} y={0.88} z={1.18} w={5.5} d={2.5} h={0.45} top={WORLD_PALETTE.pale} front={WORLD_PALETTE.graphite} />
      {[-1.55, 1.05].map((x, index) => (
        <g key={x}>
          <VoxelBlock x={x} y={1.55} z={1.63} w={1.05} d={0.92} h={1.92} top={index ? WORLD_PALETTE.blue : WORLD_PALETTE.green} />
          <VoxelBlock x={x + 0.12} y={1.62} z={3.55} w={0.82} d={0.72} h={0.82} top={WORLD_PALETTE.paper} front={WORLD_PALETTE.pale} />
        </g>
      ))}
      <VoxelBlock x={-4.82} y={-1.98} z={4.92} w={9.64} d={0.12} h={0.16} top={WORLD_PALETTE.green} front={WORLD_PALETTE.green} />
      <PixelMark x={4.3} y={-2} z={5.28} size={0.34} color={WORLD_PALETTE.blue} data-part="signal" />
    </>
  )
}

function VoiceSyncStation() {
  const bars = [0.92, 1.62, 2.35, 1.22, 3.04, 1.76]

  return (
    <>
      <StationBase accent={WORLD_PALETTE.yellow} />
      <VoxelBlock x={-6.45} y={-1.85} z={0.76} w={1.65} d={2.1} h={4.85} top={WORLD_PALETTE.pale} front={WORLD_PALETTE.graphite} />
      <VoxelBlock x={-6.12} y={-1.98} z={1.45} w={0.98} d={0.14} h={1.16} top={WORLD_PALETTE.ink} front={WORLD_PALETTE.ink} />
      <VoxelBlock x={-6.12} y={-1.98} z={3.34} w={0.98} d={0.14} h={1.16} top={WORLD_PALETTE.ink} front={WORLD_PALETTE.ink} />
      {bars.map((height, index) => (
        <VoxelBlock
          key={`${height}-${index}`}
          x={-3.18 + index * 1.08}
          y={0.1}
          z={0.76}
          w={0.48}
          d={1.28}
          h={height}
          top={index === 4 ? WORLD_PALETTE.yellow : WORLD_PALETTE.blue}
          front={index === 4 ? WORLD_PALETTE.yellow : WORLD_PALETTE.blue}
          data-part={index === 4 ? 'signal' : undefined}
        />
      ))}
      <VoxelBlock x={-3.65} y={2.08} z={0.76} w={8.2} d={0.5} h={0.22} top={WORLD_PALETTE.paper} front={WORLD_PALETTE.paper} />
      <VoxelBlock x={-3.65} y={2.72} z={0.76} w={5.65} d={0.5} h={0.22} top={WORLD_PALETTE.mid} front={WORLD_PALETTE.mid} />
    </>
  )
}

function RenderQueueStation() {
  return (
    <>
      <StationBase accent={WORLD_PALETTE.red} />
      {[-5.8, -1.7, 2.4].map((x, index) => (
        <g key={x}>
          <VoxelBlock
            x={x}
            y={-1.2}
            z={0.76}
            w={3.35}
            d={3.4}
            h={4.2 + index * 0.75}
            top={WORLD_PALETTE.pale}
            front={WORLD_PALETTE.graphite}
            side={WORLD_PALETTE.dark}
          />
          {[1.75, 2.95].map((z, row) => (
            <VoxelBlock
              key={z}
              x={x + 0.46}
              y={-1.34}
              z={z}
              w={2.05}
              d={0.12}
              h={0.2}
              top={row === index ? ACCENTS[index] : WORLD_PALETTE.ink}
              front={row === index ? ACCENTS[index] : WORLD_PALETTE.ink}
              data-part={row === 1 && index === 1 ? 'signal' : undefined}
            />
          ))}
        </g>
      ))}
      {[0, 1, 2].map((index) => (
        <VoxelBlock
          key={index}
          x={-3.45 + index * 2.25}
          y={2.5}
          z={0.76}
          w={1.55}
          d={1.1}
          h={0.74}
          top={ACCENTS[(index + 1) % ACCENTS.length]}
          front={WORLD_PALETTE.graphite}
        />
      ))}
    </>
  )
}

export function WorkflowStation({ variant = 'script', ...props }) {
  const svgProps = commonAssetProps(props, `${variant} AI production workflow station`)
  const station = {
    script: <ScriptInputStation />,
    character: <CharacterLockStation />,
    voice: <VoiceSyncStation />,
    render: <RenderQueueStation />,
  }[variant] || <ScriptInputStation />

  return <AssetSvg {...svgProps} viewBox="80 220 480 260">{station}</AssetSvg>
}

export function PromptMachine(props) {
  const svgProps = commonAssetProps(props, '提示词与镜头生成装置')

  return (
    <AssetSvg {...svgProps}>
      <GroundShadow x={-9.5} y={-3.5} w={19} d={8.5} />
      <VoxelTile x={-9.7} y={-3.8} w={19.4} d={9} fill={WORLD_PALETTE.dark} opacity={0.72} />

      <g data-part="prompt-terminal">
        <VoxelBlock x={-8.6} y={-0.4} w={4.4} d={3.3} h={1.1} />
        <VoxelBlock x={-7.92} y={0.2} z={1.1} w={3.1} d={1.8} h={6.5} />
        <MachineScreen x={-7.55} y={0.05} z={2.05} width={2.38} height={4.5} accent={WORLD_PALETTE.green} />
        <VoxelBlock x={-7.1} y={-0.05} z={5.6} w={1.28} d={0.12} h={0.18} top={WORLD_PALETTE.yellow} front={WORLD_PALETTE.yellow} />
        <VoxelBlock x={-7.1} y={-0.05} z={5.06} w={1.72} d={0.12} h={0.16} top={WORLD_PALETTE.paper} front={WORLD_PALETTE.paper} />
        <VoxelBlock x={-7.1} y={-0.05} z={4.54} w={0.94} d={0.12} h={0.16} top={WORLD_PALETTE.blue} front={WORLD_PALETTE.blue} />
      </g>

      <g data-part="processor-arch">
        <VoxelBlock x={-2.8} y={-0.4} w={1.15} d={2.1} h={6.8} />
        <VoxelBlock x={1.45} y={-0.4} w={1.15} d={2.1} h={6.8} />
        <VoxelBlock x={-2.8} y={-0.4} z={5.85} w={5.4} d={2.1} h={1.05} />
        <VoxelBlock x={-1.5} y={0.05} z={1.1} w={2.8} d={1.2} h={3.1} top={WORLD_PALETTE.mid} />
        <PixelMark x={-0.88} y={-0.05} z={4.45} color={WORLD_PALETTE.red} />
        <PixelMark x={0.02} y={-0.05} z={4.45} color={WORLD_PALETTE.yellow} />
        <PixelMark x={0.92} y={-0.05} z={4.45} color={WORLD_PALETTE.blue} />
      </g>

      <g data-part="conveyor">
        <VoxelBlock x={-5.2} y={2.55} w={11.7} d={1.85} h={0.75} top={WORLD_PALETTE.graphite} front={WORLD_PALETTE.dark} />
        {[-4.6, -2.8, -1, 0.8, 2.6, 4.4].map((x, index) => (
          <VoxelBlock
            key={x}
            x={x}
            y={2.82}
            z={0.75}
            w={1}
            d={1}
            h={index % 2 ? 1.05 : 0.7}
            top={ACCENTS[index % ACCENTS.length]}
            front={ACCENTS[index % ACCENTS.length]}
            side={WORLD_PALETTE.dark}
            data-part="data-block"
          />
        ))}
      </g>

      <g data-part="camera-output">
        <VoxelBlock x={5.2} y={-0.3} w={3.9} d={3.1} h={4.25} top={WORLD_PALETTE.pale} />
        <VoxelBlock x={8.35} y={0.35} z={1.08} w={1.15} d={1.8} h={2.15} top={WORLD_PALETTE.graphite} front={WORLD_PALETTE.dark} />
        <VoxelBlock x={8.95} y={0.7} z={1.5} w={0.84} d={1.08} h={1.32} top={WORLD_PALETTE.blue} front={WORLD_PALETTE.blue} />
        <VoxelBlock x={5.75} y={-0.7} z={4.25} w={1.3} d={1.3} h={1.05} />
        <VoxelBlock x={7.18} y={-0.7} z={4.25} w={1.3} d={1.3} h={1.05} />
        <PixelMark x={5.65} y={-0.42} z={3.28} color={WORLD_PALETTE.red} />
      </g>

      {[
        [-4.2, -0.6, 5.2, WORLD_PALETTE.green],
        [-3.45, -0.2, 6.65, WORLD_PALETTE.yellow],
        [-2.6, 0.05, 7.65, WORLD_PALETTE.red],
        [-1.55, 0.35, 8.1, WORLD_PALETTE.blue],
      ].map(([x, y, z, color]) => (
        <PixelMark key={`${x}-${z}`} x={x} y={y} z={z} size={0.68} color={color} data-part="prompt-particle" />
      ))}
    </AssetSvg>
  )
}

export function SoundLab(props) {
  const svgProps = commonAssetProps(props, '声音波形与录音控制实验室')
  const waveform = [2.4, 4.1, 6.8, 3.7, 8.2, 5.5, 7.2, 3.2, 5.1]

  return (
    <AssetSvg {...svgProps}>
      <GroundShadow x={-10} y={-3.7} w={20} d={10} />
      <VoxelBlock x={-10} y={-3.7} w={20} d={9.2} h={0.45} top={WORLD_PALETTE.dark} front={WORLD_PALETTE.ink} />

      <g data-part="waveform">
        {waveform.map((height, index) => {
          const x = -6.6 + index * 1.6
          const color = index === 4
            ? WORLD_PALETTE.yellow
            : index % 3 === 0
              ? WORLD_PALETTE.paper
              : WORLD_PALETTE.blue

          return (
            <VoxelBlock
              key={x}
              x={x}
              y={-1.75}
              z={0.45}
              w={1.05}
              d={1.1}
              h={height}
              top={color}
              front={color}
              side={WORLD_PALETTE.dark}
              data-wave-index={index}
            />
          )
        })}
      </g>

      <g data-part="speaker-left">
        <VoxelBlock x={-9} y={0.1} z={0.45} w={2.45} d={2.5} h={6.2} />
        {[1.45, 3.45].map((z) => (
          <React.Fragment key={z}>
            <VoxelBlock x={-8.55} y={-0.03} z={z} w={1.54} d={0.16} h={1.28} top={WORLD_PALETTE.ink} front={WORLD_PALETTE.ink} />
            <VoxelBlock x={-8.16} y={-0.08} z={z + 0.33} w={0.76} d={0.12} h={0.62} top={WORLD_PALETTE.graphite} front={WORLD_PALETTE.graphite} />
          </React.Fragment>
        ))}
      </g>

      <g data-part="speaker-right">
        <VoxelBlock x={6.55} y={0.1} z={0.45} w={2.45} d={2.5} h={6.2} />
        {[1.45, 3.45].map((z) => (
          <React.Fragment key={z}>
            <VoxelBlock x={7} y={-0.03} z={z} w={1.54} d={0.16} h={1.28} top={WORLD_PALETTE.ink} front={WORLD_PALETTE.ink} />
            <VoxelBlock x={7.39} y={-0.08} z={z + 0.33} w={0.76} d={0.12} h={0.62} top={WORLD_PALETTE.graphite} front={WORLD_PALETTE.graphite} />
          </React.Fragment>
        ))}
      </g>

      <g data-part="mixing-console">
        <VoxelBlock x={-5.8} y={3.15} z={0.45} w={11.6} d={4.1} h={1.45} top={WORLD_PALETTE.pale} />
        <VoxelBlock x={-5.1} y={3.7} z={1.9} w={10.2} d={2.85} h={0.34} top={WORLD_PALETTE.ink} front={WORLD_PALETTE.dark} />
        {Array.from({ length: 8 }, (_, index) => {
          const x = -4.65 + index * 1.25
          const color = ACCENTS[index % ACCENTS.length]
          return (
            <g key={x}>
              <VoxelBlock x={x} y={4.12} z={2.24} w={0.25} d={1.75} h={0.14} top={WORLD_PALETTE.mid} front={WORLD_PALETTE.mid} />
              <VoxelBlock x={x - 0.16} y={4.5 + (index % 3) * 0.35} z={2.38} w={0.58} d={0.45} h={0.26} top={color} front={color} />
            </g>
          )
        })}
      </g>

      <g data-part="boom-microphone">
        <VoxelBlock x={-8.45} y={5.1} z={0.45} w={0.55} d={0.55} h={6.7} />
        <VoxelBlock x={-8.1} y={5.02} z={6.35} w={7.3} d={0.45} h={0.42} />
        <VoxelBlock x={-1.28} y={4.86} z={5.72} w={1.32} d={0.7} h={0.78} top={WORLD_PALETTE.ink} front={WORLD_PALETTE.ink} />
        <PixelMark x={-8.58} y={4.98} z={7.2} color={WORLD_PALETTE.red} data-part="record-light" />
      </g>
    </AssetSvg>
  )
}

function ModelTower({ x, y, color, height = 6.2, markOffset = 0 }) {
  return (
    <g data-part="model-tower">
      <VoxelBlock x={x} y={y} w={4.3} d={3.4} h={0.85} />
      <VoxelBlock x={x + 0.72} y={y + 0.62} z={0.85} w={2.85} d={2.05} h={height} top={WORLD_PALETTE.mid} />
      {[1.75, 3.05, 4.35].map((z, index) => (
        <VoxelBlock
          key={z}
          x={x + 1.02}
          y={y + 0.48}
          z={z}
          w={2.25}
          d={0.16}
          h={0.42}
          top={index === markOffset ? color : WORLD_PALETTE.ink}
          front={index === markOffset ? color : WORLD_PALETTE.ink}
          side={WORLD_PALETTE.dark}
        />
      ))}
      <VoxelBlock x={x + 1.32} y={y + 0.38} z={height + 0.2} w={1.65} d={0.62} h={0.42} top={color} front={color} />
    </g>
  )
}

export function ModelHub(props) {
  const svgProps = commonAssetProps(props, '多模型协同制作中枢')

  return (
    <AssetSvg {...svgProps}>
      <GroundShadow x={-10.2} y={-5.2} w={20.4} d={11.2} />
      <VoxelTile x={-10.4} y={-5.35} w={20.8} d={11.6} fill={WORLD_PALETTE.dark} opacity={0.86} />

      <g data-part="pipeline">
        <VoxelBlock x={-7.2} y={0.7} w={14.4} d={0.65} h={0.36} top={WORLD_PALETTE.graphite} front={WORLD_PALETTE.dark} />
        <VoxelBlock x={-0.35} y={-4.1} w={0.7} d={9.3} h={0.36} top={WORLD_PALETTE.graphite} front={WORLD_PALETTE.dark} />
        {[
          [-5.8, 0.58, WORLD_PALETTE.blue],
          [-3.4, 0.58, WORLD_PALETTE.red],
          [2.65, 0.58, WORLD_PALETTE.green],
          [5.05, 0.58, WORLD_PALETTE.yellow],
          [-0.48, -2.8, WORLD_PALETTE.red],
          [-0.48, 3.55, WORLD_PALETTE.blue],
        ].map(([x, y, color]) => (
          <VoxelBlock key={`${x}-${y}`} x={x} y={y} z={0.36} w={0.95} d={0.95} h={0.56} top={color} front={color} side={WORLD_PALETTE.dark} data-part="route-block" />
        ))}
      </g>

      <ModelTower x={-9} y={-4.2} color={WORLD_PALETTE.blue} markOffset={0} />
      <ModelTower x={4.7} y={-4.2} color={WORLD_PALETTE.red} markOffset={1} />
      <ModelTower x={-9} y={2.1} color={WORLD_PALETTE.green} markOffset={2} height={5.5} />
      <ModelTower x={4.7} y={2.1} color={WORLD_PALETTE.yellow} markOffset={0} height={5.5} />

      <g data-part="central-director-core">
        <VoxelBlock x={-3.1} y={-2.15} w={6.2} d={5.5} h={1.1} top={WORLD_PALETTE.pale} />
        <VoxelBlock x={-2.15} y={-1.35} z={1.1} w={4.3} d={3.9} h={2.25} top={WORLD_PALETTE.graphite} front={WORLD_PALETTE.dark} />
        <VoxelBlock x={-1.25} y={-0.6} z={3.35} w={2.5} d={2.35} h={2.8} top={WORLD_PALETTE.paper} />
        <VoxelBlock x={-0.76} y={-0.3} z={4.1} w={1.52} d={0.18} h={1.2} top={WORLD_PALETTE.ink} front={WORLD_PALETTE.ink} />
        {ACCENTS.map((color, index) => (
          <PixelMark
            key={color}
            x={-1.78 + index * 1.18}
            y={1.98}
            z={3.48}
            size={0.54}
            color={color}
            data-part="core-signal"
          />
        ))}
      </g>
    </AssetSvg>
  )
}

function isoPlaneTransform({
  x1,
  x2,
  y,
  zTop,
  zBottom,
  sourceWidth,
  sourceHeight,
}) {
  const topLeft = projectIso(x1, y, zTop)
  const topRight = projectIso(x2, y, zTop)
  const bottomLeft = projectIso(x1, y, zBottom)
  const values = [
    (topRight.x - topLeft.x) / sourceWidth,
    (topRight.y - topLeft.y) / sourceWidth,
    (bottomLeft.x - topLeft.x) / sourceHeight,
    (bottomLeft.y - topLeft.y) / sourceHeight,
    topLeft.x,
    topLeft.y,
  ].map((value) => Number(value.toFixed(5)))

  return 'matrix(' + values.join(' ') + ')'
}

export function CinemaStage({
  image,
  imageFit = 'slice',
  title = 'SELECTED WORK',
  accent = WORLD_PALETTE.red,
  ...props
}) {
  const clipId = `cinema-screen-${useId().replace(/:/g, '')}`
  const svgProps = commonAssetProps(props, `${title} 项目放映台`)
  const screenTransform = isoPlaneTransform({
    x1: -7.82,
    x2: 7.82,
    y: 0.22,
    zTop: 10.18,
    zBottom: 1.68,
    sourceWidth: 304,
    sourceHeight: 164,
  })

  return (
    <AssetSvg {...svgProps}>
      <defs>
        <clipPath id={clipId}>
          <rect width="304" height="164" />
        </clipPath>
      </defs>

      <GroundShadow x={-10.5} y={-2.2} w={21} d={7.8} />
      <VoxelBlock x={-10.5} y={-1.8} w={21} d={6.4} h={0.9} top={WORLD_PALETTE.graphite} front={WORLD_PALETTE.dark} />

      <g data-part="screen-frame">
        <VoxelBlock x={-8.9} y={0.35} z={0.9} w={1.05} d={1.15} h={10.5} />
        <VoxelBlock x={7.85} y={0.35} z={0.9} w={1.05} d={1.15} h={10.5} />
        <VoxelBlock x={-8.9} y={0.35} z={10.35} w={17.8} d={1.15} h={1.05} />
      </g>

      <g transform={screenTransform} data-part="project-screen">
        <rect x="-14" y="-14" width="332" height="192" fill={WORLD_PALETTE.paper} />
        <rect x="-4" y="-4" width="312" height="172" fill={WORLD_PALETTE.ink} />
        {image ? (
          <image
            href={image}
            width="304"
            height="164"
            preserveAspectRatio={`xMidYMid ${imageFit}`}
            clipPath={`url(#${clipId})`}
          />
        ) : (
          <g>
            <rect width="304" height="164" fill={WORLD_PALETTE.ink} />
            <rect x="16" y="16" width="92" height="12" fill={accent} />
            <rect x="16" y="38" width="178" height="8" fill={WORLD_PALETTE.graphite} />
            <rect x="16" y="56" width="138" height="8" fill={WORLD_PALETTE.graphite} />
          </g>
        )}
        <rect x="-4" y="164" width="312" height="4" fill={accent} />

        <g data-part="stage-label">
          <rect x="34" y="190" width="236" height="30" fill={WORLD_PALETTE.ink} />
          <rect x="34" y="190" width="8" height="30" fill={accent} />
          <text
            x="52"
            y="211"
            fill={WORLD_PALETTE.paper}
            fontFamily="'DM Mono', 'Courier New', monospace"
            fontSize="14"
            fontWeight="700"
            letterSpacing="1.2"
          >
            {title}
          </text>
        </g>
      </g>

      <g data-part="projector">
        <VoxelBlock x={-2.6} y={4.9} z={0.9} w={5.2} d={2.8} h={1.55} top={WORLD_PALETTE.pale} />
        <VoxelBlock x={1.85} y={5.45} z={1.38} w={1.3} d={1.4} h={0.68} top={accent} front={accent} />
        <PixelMark x={-2.15} y={4.7} z={2.55} color={WORLD_PALETTE.green} />
      </g>

      {[-7.2, -4.8, 4.4, 6.8].map((x, index) => (
        <VoxelBlock
          key={x}
          x={x}
          y={5.4 + (index % 2) * 0.55}
          z={0.9}
          w={1.15}
          d={1.15}
          h={1.45}
          top={index % 2 ? WORLD_PALETTE.paper : WORLD_PALETTE.graphite}
          front={WORLD_PALETTE.dark}
          data-part="audience"
        />
      ))}
    </AssetSvg>
  )
}

export function BroadcastTower(props) {
  const svgProps = commonAssetProps(props, 'AI 影像广播与联系信号塔')
  const origin = { x: 312, y: 394 }

  return (
    <AssetSvg {...svgProps}>
      <GroundShadow x={-8} y={-5.5} w={16} d={10.5} origin={origin} />
      <VoxelBlock x={-8} y={-5.2} w={16} d={9.6} h={0.8} origin={origin} top={WORLD_PALETTE.graphite} />
      <VoxelBlock x={-5.8} y={-3.5} z={0.8} w={11.6} d={6.5} h={1.25} origin={origin} />

      <g data-part="tower-frame">
        {[
          [-4.4, -2.2],
          [3.2, -2.2],
          [-4.4, 1.1],
          [3.2, 1.1],
        ].map(([x, y]) => (
          <VoxelBlock key={`${x}-${y}`} x={x} y={y} z={2.05} w={1.2} d={1.2} h={8.4} origin={origin} />
        ))}
        <VoxelBlock x={-4.4} y={-2.2} z={4.1} w={8.8} d={1.2} h={0.72} origin={origin} />
        <VoxelBlock x={-4.4} y={1.1} z={7.15} w={8.8} d={1.2} h={0.72} origin={origin} />
        <VoxelBlock x={-4.4} y={-2.2} z={9.72} w={8.8} d={4.5} h={0.72} origin={origin} />
      </g>

      <g data-part="upload-core">
        <VoxelBlock x={-1.55} y={-0.95} z={2.05} w={3.1} d={2.7} h={7.15} origin={origin} top={WORLD_PALETTE.mid} />
        {[3.35, 5.25, 7.15].map((z, index) => (
          <VoxelBlock
            key={z}
            x={-1.08}
            y={-1.05}
            z={z}
            w={2.16}
            d={0.16}
            h={0.55}
            origin={origin}
            top={ACCENTS[index]}
            front={ACCENTS[index]}
            side={WORLD_PALETTE.dark}
          />
        ))}
      </g>

      <g data-part="signal-head">
        <VoxelFrame
          x={-3.75}
          y={-1.2}
          z={10.35}
          w={7.5}
          h={5.15}
          thickness={0.72}
          depth={0.75}
          origin={origin}
        />
        <VoxelBlock x={-2.58} y={-1.38} z={11.5} w={1.2} d={0.28} h={1.2} origin={origin} top={WORLD_PALETTE.red} front={WORLD_PALETTE.red} />
        <VoxelBlock x={-0.9} y={-1.38} z={12.7} w={1.2} d={0.28} h={1.2} origin={origin} top={WORLD_PALETTE.yellow} front={WORLD_PALETTE.yellow} />
        <VoxelBlock x={0.78} y={-1.38} z={11.5} w={1.2} d={0.28} h={1.2} origin={origin} top={WORLD_PALETTE.blue} front={WORLD_PALETTE.blue} />
        <VoxelBlock x={-0.3} y={-0.15} z={15.45} w={0.6} d={0.6} h={3.2} origin={origin} />
        <PixelMark x={-0.48} y={-0.35} z={18.65} size={0.95} color={WORLD_PALETTE.red} origin={origin} data-part="beacon" />
      </g>

      <g
        data-part="signal-waves"
        fill="none"
        stroke={WORLD_PALETTE.paper}
        strokeWidth="7"
        strokeLinecap="square"
        opacity="0.8"
      >
        <polyline points="410,92 438,104 452,130" />
        <polyline points="430,66 472,84 494,122" opacity="0.62" />
        <polyline points="452,40 506,64 536,112" opacity="0.38" />
      </g>

      <PixelMark x={-6.55} y={2.9} z={1.85} color={WORLD_PALETTE.green} origin={origin} />
      <PixelMark x={5.65} y={-3.7} z={1.45} color={WORLD_PALETTE.yellow} origin={origin} />
    </AssetSvg>
  )
}

const CREW_ACCENTS = {
  director: WORLD_PALETTE.red,
  camera: WORLD_PALETTE.blue,
  editor: WORLD_PALETTE.green,
  sound: WORLD_PALETTE.yellow,
}

export function PixelCrew({
  variant = 'director',
  direction = 'right',
  accent = CREW_ACCENTS[variant] || WORLD_PALETTE.red,
  ...props
}) {
  const svgProps = commonAssetProps(props, `像素${variant}工作人员`)
  const transform = direction === 'left' ? 'translate(64 0) scale(-1 1)' : undefined

  return (
    <AssetSvg {...svgProps} viewBox="0 0 64 96">
      <polygon points="8,84 32,72 56,84 32,96" fill={WORLD_PALETTE.ink} opacity="0.58" />
      <g transform={transform} data-part="crew">
        <rect x="21" y="17" width="22" height="8" fill={WORLD_PALETTE.dark} />
        <rect x="17" y="23" width="30" height="7" fill={accent} />
        <rect x="21" y="30" width="22" height="18" fill={WORLD_PALETTE.paper} />
        <rect x="21" y="42" width="22" height="6" fill={WORLD_PALETTE.pale} />
        <rect x="36" y="34" width="4" height="4" fill={WORLD_PALETTE.ink} />
        <rect x="20" y="48" width="24" height="25" fill={WORLD_PALETTE.graphite} />
        <rect x="24" y="49" width="6" height="8" fill={accent} />
        <rect x="14" y="51" width="7" height="20" fill={WORLD_PALETTE.pale} />
        <rect x="43" y="51" width="7" height="20" fill={WORLD_PALETTE.pale} />
        <rect x="21" y="72" width="9" height="17" fill={WORLD_PALETTE.dark} />
        <rect x="35" y="72" width="9" height="17" fill={WORLD_PALETTE.dark} />
        <rect x="17" y="87" width="13" height="5" fill={WORLD_PALETTE.paper} />
        <rect x="35" y="87" width="13" height="5" fill={WORLD_PALETTE.paper} />

        {variant === 'director' ? (
          <g data-part="crew-tool">
            <rect x="47" y="49" width="13" height="9" fill={WORLD_PALETTE.paper} />
            <rect x="48" y="50" width="4" height="3" fill={WORLD_PALETTE.ink} />
            <rect x="54" y="50" width="4" height="3" fill={accent} />
          </g>
        ) : null}
        {variant === 'camera' ? (
          <g data-part="crew-tool">
            <rect x="44" y="49" width="16" height="12" fill={WORLD_PALETTE.dark} />
            <rect x="56" y="52" width="7" height="6" fill={WORLD_PALETTE.blue} />
            <rect x="49" y="61" width="4" height="16" fill={WORLD_PALETTE.pale} />
          </g>
        ) : null}
        {variant === 'editor' ? (
          <g data-part="crew-tool">
            <rect x="44" y="48" width="16" height="14" fill={WORLD_PALETTE.paper} />
            <rect x="47" y="51" width="10" height="8" fill={WORLD_PALETTE.green} />
          </g>
        ) : null}
        {variant === 'sound' ? (
          <g data-part="crew-tool">
            <rect x="47" y="28" width="4" height="37" fill={WORLD_PALETTE.pale} />
            <rect x="47" y="25" width="15" height="5" fill={WORLD_PALETTE.dark} />
            <rect x="58" y="23" width="5" height="9" fill={WORLD_PALETTE.yellow} />
          </g>
        ) : null}
      </g>
    </AssetSvg>
  )
}

function seededRandom(seed) {
  let value = Math.max(1, Math.floor(Math.abs(seed))) % 2147483647

  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

export function MicroCluster({
  seed = 17,
  count = 28,
  width = 480,
  height = 280,
  colors = ACCENTS,
  ...props
}) {
  const svgProps = commonAssetProps(props, '像素数据与片场微缩节点')
  const pieces = useMemo(() => {
    const random = seededRandom(seed)

    return Array.from({ length: count }, (_, index) => ({
      x: 18 + random() * (width - 36),
      y: 16 + random() * (height - 44),
      size: 3 + Math.round(random() * 6),
      height: 3 + Math.round(random() * 10),
      color: colors[Math.floor(random() * colors.length)] || WORLD_PALETTE.paper,
      pale: random() > 0.7,
      index,
    }))
  }, [seed, count, width, height, colors])

  return (
    <AssetSvg {...svgProps} viewBox={`0 0 ${width} ${height}`}>
      {pieces.map((piece) => {
        const { x, y, size, height: blockHeight, color, pale, index } = piece
        const top = `${x},${y - blockHeight} ${x + size},${y - blockHeight + size / 2} ${x},${y - blockHeight + size} ${x - size},${y - blockHeight + size / 2}`
        const front = `${x - size},${y - blockHeight + size / 2} ${x},${y - blockHeight + size} ${x},${y + size} ${x - size},${y + size / 2}`
        const side = `${x + size},${y - blockHeight + size / 2} ${x},${y - blockHeight + size} ${x},${y + size} ${x + size},${y + size / 2}`

        return (
          <g key={index} data-part="micro-cube">
            <polygon points={front} fill={pale ? WORLD_PALETTE.pale : color} />
            <polygon points={side} fill={WORLD_PALETTE.dark} />
            <polygon points={top} fill={pale ? WORLD_PALETTE.paper : color} />
          </g>
        )
      })}
    </AssetSvg>
  )
}

export const WORLD_ASSETS = Object.freeze({
  heroGate: HeroGate,
  promptMachine: PromptMachine,
  soundLab: SoundLab,
  modelHub: ModelHub,
  cinemaStage: CinemaStage,
  broadcastTower: BroadcastTower,
  pixelCrew: PixelCrew,
  microCluster: MicroCluster,
})

export function WorldAsset({ type, ...props }) {
  const Asset = WORLD_ASSETS[type]

  if (!Asset) return null
  return <Asset {...props} />
}

export { WORLD_PALETTE } from './VoxelPrimitives'
