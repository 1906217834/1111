import React from 'react'

const INK = '#080808'
const DARK = '#171717'
const MID = '#4d4d4d'
const PALE = '#b8b8b3'
const PAPER = '#f3f3ef'
const BLUE = '#4398cd'
const RED = '#d82d17'
const GREEN = '#47a639'
const YELLOW = '#edcb1f'

function GroundShadow({ points = '38,154 123,112 207,153 121,174' }) {
  return <polygon points={points} fill={INK} opacity="0.42" />
}

function CameraProp() {
  return (
    <svg viewBox="0 0 240 180" shapeRendering="crispEdges" role="img" aria-label="像素电影摄影机">
      <GroundShadow />

      {/* voxel tripod */}
      <polygon points="111,103 128,95 139,101 122,110" fill={PALE} />
      <polygon points="111,103 122,110 122,129 111,123" fill={MID} />
      <polygon points="122,110 139,101 139,120 122,129" fill={DARK} />
      <polygon points="114,122 121,125 83,158 70,158" fill={MID} />
      <polygon points="121,125 128,121 118,159 105,164" fill={DARK} />
      <polygon points="128,118 136,114 176,151 164,156" fill={MID} />
      <polygon points="70,158 83,158 83,164 70,164" fill={INK} />
      <polygon points="105,164 118,159 118,165 105,170" fill={INK} />
      <polygon points="164,156 176,151 176,157 164,162" fill={INK} />

      {/* camera body: top / face / side */}
      <polygon points="67,63 118,38 174,65 123,90" fill={PALE} />
      <polygon points="67,63 123,90 123,120 67,93" fill={MID} />
      <polygon points="123,90 174,65 174,95 123,120" fill={DARK} />
      <polygon points="78,66 117,47 159,67 120,86" fill={PAPER} />
      <polygon points="76,72 115,91 115,108 76,89" fill={DARK} />
      <polygon points="82,77 106,89 106,98 82,86" fill={BLUE} />
      <rect x="83" y="88" width="7" height="5" fill={RED} />
      <rect x="96" y="94" width="7" height="5" fill={YELLOW} />

      {/* lens block */}
      <polygon points="174,70 196,80 196,98 174,88" fill={MID} />
      <polygon points="196,80 207,75 207,93 196,98" fill={INK} />
      <polygon points="178,73 194,81 194,92 178,84" fill={PAPER} />
      <polygon points="186,78 194,82 194,89 186,85" fill={BLUE} />

      {/* reels */}
      <polygon points="82,44 100,35 119,44 101,53" fill={MID} />
      <polygon points="101,53 119,44 119,54 101,63" fill={DARK} />
      <polygon points="82,44 101,53 101,63 82,54" fill={PALE} />
      <rect x="88" y="46" width="6" height="6" fill={INK} />
      <polygon points="117,38 135,29 154,38 136,47" fill={MID} />
      <polygon points="136,47 154,38 154,48 136,57" fill={DARK} />
      <polygon points="117,38 136,47 136,57 117,48" fill={PALE} />
      <rect x="125" y="41" width="6" height="6" fill={INK} />
      <rect x="154" y="52" width="12" height="8" fill={GREEN} />
    </svg>
  )
}

function MonitorProp() {
  return (
    <svg viewBox="0 0 240 180" shapeRendering="crispEdges" role="img" aria-label="像素导演监视器">
      <GroundShadow points="27,145 112,102 215,145 129,174" />

      {/* base */}
      <polygon points="67,132 115,108 178,138 129,163" fill={PALE} />
      <polygon points="67,132 129,163 129,171 67,140" fill={MID} />
      <polygon points="129,163 178,138 178,146 129,171" fill={DARK} />
      <polygon points="111,108 127,100 142,108 126,116" fill={PALE} />
      <polygon points="111,108 126,116 126,136 111,128" fill={MID} />
      <polygon points="126,116 142,108 142,128 126,136" fill={DARK} />

      {/* monitor housing */}
      <polygon points="50,51 112,20 187,56 125,88" fill={PALE} />
      <polygon points="50,51 125,88 125,132 50,95" fill={MID} />
      <polygon points="125,88 187,56 187,100 125,132" fill={DARK} />

      {/* screen on front plane */}
      <polygon points="60,59 116,87 116,117 60,89" fill={INK} />
      <polygon points="65,65 111,88 111,109 65,86" fill={BLUE} />
      <polygon points="65,80 80,87 80,95 65,88" fill={DARK} />
      <polygon points="82,88 98,96 98,104 82,96" fill={PAPER} />
      <polygon points="100,97 111,102 111,109 100,104" fill={YELLOW} />
      <rect x="62" y="99" width="6" height="6" fill={RED} />
      <rect x="73" y="104" width="6" height="6" fill={GREEN} />

      {/* side controls */}
      <polygon points="135,92 177,71 177,79 135,100" fill={MID} />
      <polygon points="135,106 145,101 145,111 135,116" fill={BLUE} />
      <polygon points="151,98 161,93 161,103 151,108" fill={RED} />
      <polygon points="167,90 177,85 177,95 167,100" fill={GREEN} />
      <polygon points="142,119 174,103 174,108 142,124" fill={PAPER} />
    </svg>
  )
}

function ConsoleProp() {
  return (
    <svg viewBox="0 0 240 180" shapeRendering="crispEdges" role="img" aria-label="像素虚拟制片控制台">
      <GroundShadow points="22,147 113,101 220,151 128,177" />

      {/* console mass */}
      <polygon points="39,89 118,49 205,91 126,131" fill={PALE} />
      <polygon points="39,89 126,131 126,163 39,121" fill={MID} />
      <polygon points="126,131 205,91 205,123 126,163" fill={DARK} />

      {/* recessed control bed */}
      <polygon points="55,88 117,57 188,91 126,122" fill={INK} />
      <polygon points="63,87 116,61 178,91 125,117" fill="#2b2b2b" />

      {/* pixel faders and buttons */}
      <polygon points="68,83 76,79 85,83 77,87" fill={BLUE} />
      <polygon points="86,74 94,70 103,74 95,78" fill={RED} />
      <polygon points="104,65 112,61 121,65 113,69" fill={GREEN} />
      <polygon points="91,91 99,87 108,91 100,95" fill={YELLOW} />
      <polygon points="109,82 117,78 126,82 118,86" fill={BLUE} />
      <polygon points="127,73 135,69 144,73 136,77" fill={RED} />
      <polygon points="127,99 135,95 144,99 136,103" fill={GREEN} />
      <polygon points="145,90 153,86 162,90 154,94" fill={YELLOW} />
      <polygon points="163,81 171,77 180,81 172,85" fill={PAPER} />

      {/* fader channels */}
      <polygon points="66,101 87,90 91,92 70,103" fill={PALE} />
      <polygon points="88,112 109,101 113,103 92,114" fill={PALE} />
      <polygon points="110,123 131,112 135,114 114,125" fill={PALE} />
      <polygon points="74,97 82,93 88,96 80,100" fill={BLUE} />
      <polygon points="96,108 104,104 110,107 102,111" fill={RED} />
      <polygon points="118,119 126,115 132,118 124,122" fill={YELLOW} />

      {/* front status strip and side ports */}
      <polygon points="51,109 116,141 116,150 51,118" fill={INK} />
      <polygon points="58,115 72,122 72,128 58,121" fill={BLUE} />
      <polygon points="78,125 92,132 92,138 78,131" fill={GREEN} />
      <polygon points="98,135 111,141 111,147 98,141" fill={RED} />
      <polygon points="141,137 158,128 158,136 141,145" fill={PAPER} />
      <polygon points="167,124 181,117 181,125 167,132" fill={BLUE} />
    </svg>
  )
}

function ClapperProp() {
  return (
    <svg viewBox="0 0 240 180" shapeRendering="crispEdges" role="img" aria-label="像素场记板">
      <GroundShadow points="45,148 117,112 195,149 123,174" />

      {/* slate body */}
      <polygon points="61,74 122,44 184,74 123,105" fill={PALE} />
      <polygon points="61,74 123,105 123,153 61,122" fill={MID} />
      <polygon points="123,105 184,74 184,122 123,153" fill={DARK} />
      <polygon points="69,85 115,108 115,139 69,116" fill={INK} />
      <polygon points="75,93 108,109 108,115 75,99" fill={PAPER} />
      <polygon points="75,104 102,117 102,122 75,109" fill={PALE} />
      <polygon points="75,114 94,123 94,128 75,119" fill={BLUE} />
      <rect x="104" y="132" width="7" height="7" fill={RED} />

      {/* raised clapper arm */}
      <polygon points="54,61 150,13 188,31 92,79" fill={PAPER} />
      <polygon points="54,61 92,79 92,90 54,72" fill={MID} />
      <polygon points="92,79 188,31 188,42 92,90" fill={DARK} />
      <polygon points="64,57 76,51 88,57 76,63" fill={INK} />
      <polygon points="91,44 103,38 115,44 103,50" fill={INK} />
      <polygon points="118,31 130,25 142,31 130,37" fill={INK} />
      <polygon points="145,18 157,12 169,18 157,24" fill={INK} />
      <polygon points="166,33 178,27 188,32 176,38" fill={YELLOW} />

      {/* hinge and side labels */}
      <polygon points="57,71 67,66 78,71 68,76" fill={RED} />
      <polygon points="68,76 78,71 78,82 68,87" fill={DARK} />
      <polygon points="137,112 174,94 174,101 137,119" fill={PAPER} />
      <polygon points="137,124 158,113 158,121 137,132" fill={GREEN} />
    </svg>
  )
}

function LightProp() {
  return (
    <svg viewBox="0 0 240 180" shapeRendering="crispEdges" role="img" aria-label="像素片场灯光">
      <GroundShadow points="36,152 116,112 204,153 124,176" />

      {/* stand */}
      <polygon points="114,81 127,75 137,80 124,87" fill={PALE} />
      <polygon points="114,81 124,87 124,137 114,132" fill={MID} />
      <polygon points="124,87 137,80 137,130 124,137" fill={DARK} />
      <polygon points="113,128 121,132 77,158 63,158" fill={MID} />
      <polygon points="123,133 131,129 126,162 113,168" fill={DARK} />
      <polygon points="132,128 140,124 183,153 171,159" fill={MID} />
      <polygon points="63,158 77,158 77,164 63,164" fill={INK} />
      <polygon points="113,168 126,162 126,168 113,174" fill={INK} />
      <polygon points="171,159 183,153 183,159 171,165" fill={INK} />

      {/* lamp housing */}
      <polygon points="78,46 125,22 172,45 125,69" fill={PALE} />
      <polygon points="78,46 125,69 125,101 78,78" fill={MID} />
      <polygon points="125,69 172,45 172,77 125,101" fill={DARK} />
      <polygon points="88,51 120,67 120,89 88,73" fill={YELLOW} />
      <polygon points="93,56 115,67 115,81 93,70" fill={PAPER} />

      {/* barn doors */}
      <polygon points="75,42 50,31 50,63 75,75" fill={INK} />
      <polygon points="80,40 95,15 119,22 102,47" fill={MID} />
      <polygon points="127,20 153,8 176,19 151,32" fill={DARK} />
      <polygon points="174,42 202,30 202,62 174,75" fill={INK} />
      <polygon points="173,78 192,87 172,107 153,98" fill={MID} />
      <rect x="146" y="82" width="9" height="8" fill={BLUE} />
      <rect x="158" y="76" width="9" height="8" fill={RED} />
    </svg>
  )
}

function ChairProp() {
  return (
    <svg viewBox="0 0 240 180" shapeRendering="crispEdges" role="img" aria-label="像素导演椅">
      <GroundShadow points="42,151 112,116 198,156 128,176" />

      {/* back frame */}
      <polygon points="63,46 73,41 73,124 63,129" fill={MID} />
      <polygon points="73,41 81,45 81,120 73,124" fill={DARK} />
      <polygon points="164,47 174,42 174,126 164,131" fill={MID} />
      <polygon points="174,42 182,46 182,122 174,126" fill={DARK} />

      {/* fabric back: top / front / side */}
      <polygon points="72,50 119,27 174,53 127,77" fill={PALE} />
      <polygon points="72,50 127,77 127,105 72,78" fill={INK} />
      <polygon points="127,77 174,53 174,81 127,105" fill={DARK} />
      <polygon points="81,58 119,39 164,60 126,79" fill={BLUE} />
      <polygon points="89,65 101,59 114,65 102,71" fill={PAPER} />
      <polygon points="115,77 127,71 140,77 128,83" fill={YELLOW} />
      <polygon points="140,64 152,58 164,64 152,70" fill={RED} />

      {/* seat */}
      <polygon points="72,106 120,82 174,108 126,132" fill={PAPER} />
      <polygon points="72,106 126,132 126,142 72,116" fill={MID} />
      <polygon points="126,132 174,108 174,118 126,142" fill={DARK} />
      <polygon points="82,106 120,87 164,108 126,128" fill={GREEN} />

      {/* crossed legs */}
      <polygon points="75,117 86,122 157,164 143,164" fill={MID} />
      <polygon points="164,118 174,113 99,167 85,167" fill={PALE} />
      <polygon points="143,164 157,164 157,170 143,170" fill={INK} />
      <polygon points="85,167 99,167 99,173 85,173" fill={INK} />
      <polygon points="71,91 80,87 99,98 90,103" fill={PALE} />
      <polygon points="156,99 175,89 184,93 165,103" fill={PALE} />
    </svg>
  )
}

const PROP_COMPONENTS = {
  camera: CameraProp,
  monitor: MonitorProp,
  console: ConsoleProp,
  clapper: ClapperProp,
  light: LightProp,
  chair: ChairProp,
}

export function StudioProp({ type = 'camera', className = '', depth = 0 }) {
  const safeType = Object.prototype.hasOwnProperty.call(PROP_COMPONENTS, type) ? type : 'camera'
  const Artwork = PROP_COMPONENTS[safeType]
  const classes = ['iso-object', `iso-object--${safeType}`, className].filter(Boolean).join(' ')

  return (
    <div className={classes} data-depth={depth} aria-hidden="true">
      <div className="iso-object__art">
        <Artwork />
      </div>
    </div>
  )
}

export default StudioProp
