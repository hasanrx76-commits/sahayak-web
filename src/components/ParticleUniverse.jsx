// ============================================================================
// ParticleUniverse — premium 3D animated background (Three.js + WebGL)
//
// - 8k–32k GPU-shader particles in a procedural flow field (simplex noise),
//   never repeating, always alive.
// - Cinematic camera: slow orbit + drift + zoom + mouse/touch parallax.
// - Sparse "connector" constellation with ultra-thin glowing lines.
// - Nebula clouds, galaxy dust, shooting stars, expanding energy waves.
// - UnrealBloom post-processing + ACES tone mapping + volumetric fog.
// - Auto-scales quality by device, pauses when the tab is hidden, and
//   renders behind all content without blocking scroll/clicks.
// ============================================================================

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { useApp } from '../contexts/AppContext'

// ---------------------------------------------------------------------------
// GLSL helpers (Ashima simplex noise — MIT)
// ---------------------------------------------------------------------------
const GLSL_NOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1;
  i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;
  x12.xy-=i1;
  i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m;m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}
`

// ---------------------------------------------------------------------------
// Shaders
// ---------------------------------------------------------------------------
const DUST_VERT = GLSL_NOISE + `
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
attribute vec3 aBase;
attribute float aSeed;
attribute vec3 aColorMix;
varying float vAlpha;
varying vec3 vColor;
varying float vSeed;
void main(){
  float t = uTime;
  // Procedural flow field from simplex noise
  vec3 n = vec3(
    snoise(aBase * 0.18 + vec3(0.0, t * 0.06, 0.0)),
    snoise(aBase * 0.18 + vec3(t * 0.05, 2.7, 0.0)),
    snoise(aBase * 0.18 + vec3(0.0, 0.0, t * 0.06))
  );
  // Vortex swirl around the Y axis (faster near the core)
  float r = length(aBase.xz);
  float ang = t * (0.04 + aSeed * 0.16) * (1.0 - r / 18.0);
  float ca = cos(ang), sa = sin(ang);
  vec3 q = vec3(aBase.x * ca - aBase.z * sa, aBase.y, aBase.x * sa + aBase.z * ca);
  // Attraction to a slowly wandering core (keeps the cloud cohesive)
  vec3 core = vec3(snoise(vec2(t * 0.04, 0.0)), 0.0, snoise(vec2(t * 0.04, 3.7))) * 7.0;
  vec3 toCore = core - q;
  vec3 pos = q + n * 1.1 + toCore * (0.03 + aSeed * 0.06) + vec3(sin(t * 0.12 + aSeed * 40.0)) * 0.12;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float twinkle = 0.7 + 0.3 * sin(t * 1.4 + aSeed * 100.0);
  float size = uSize * (0.5 + aSeed);
  gl_PointSize = size * uPixelRatio * (26.0 / -mv.z) * twinkle;

  // Volumetric depth fade (fog-like falloff for far particles)
  float depthFade = 1.0 - smoothstep(12.0, 42.0, -mv.z);
  vAlpha = twinkle * depthFade;
  vColor = aColorMix;
  vSeed = aSeed;
}
`

const DUST_FRAG = `
uniform float uTime;
uniform float uBrightness;
varying float vAlpha;
varying vec3 vColor;
varying float vSeed;
void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  // Soft gaussian glow sprite
  float glow = exp(-d * d * 34.0);
  float core = smoothstep(0.5, 0.0, d);
  float a = (glow * 0.55 + core * 0.45) * vAlpha * uBrightness;
  // Gentle per-particle hue pulse
  vec3 c = vColor * (1.0 + 0.25 * sin(uTime * 0.9 + vSeed * 22.0));
  gl_FragColor = vec4(c, a);
}
`

const BG_VERT = `
varying vec3 vWorld;
void main(){
  vWorld = normalize(position);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
}
`

const BG_FRAG = `
uniform vec3 uTop;
uniform vec3 uBottom;
uniform vec2 uRes;
varying vec3 vWorld;
void main(){
  float h = vWorld.y * 0.5 + 0.5;
  vec3 col = mix(uBottom, uTop, pow(h, 0.85));
  // Subtle vignette for cinematic depth
  vec2 uv = gl_FragCoord.xy / uRes;
  float d = distance(uv, vec2(0.5)) * 1.4;
  col *= 1.0 - smoothstep(0.65, 1.25, d) * 0.65;
  gl_FragColor = vec4(col, 1.0);
}
`

// ---------------------------------------------------------------------------
// Tiny JS 3D value-noise for the CPU-driven connector lines
// ---------------------------------------------------------------------------
function hash3(x, y, z) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return s - Math.floor(s)
}
function noise3(x, y, z) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const zi = Math.floor(z)
  const xf = x - xi
  const yf = y - yi
  const zf = z - zi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const w = zf * zf * (3 - 2 * zf)
  const c000 = hash3(xi, yi, zi)
  const c100 = hash3(xi + 1, yi, zi)
  const c010 = hash3(xi, yi + 1, zi)
  const c110 = hash3(xi + 1, yi + 1, zi)
  const c001 = hash3(xi, yi, zi + 1)
  const c101 = hash3(xi + 1, yi, zi + 1)
  const c011 = hash3(xi, yi + 1, zi + 1)
  const c111 = hash3(xi + 1, yi + 1, zi + 1)
  const x00 = c000 + u * (c100 - c000)
  const x10 = c010 + u * (c110 - c010)
  const x01 = c001 + u * (c101 - c001)
  const x11 = c011 + u * (c111 - c011)
  const y0 = x00 + v * (x10 - x00)
  const y1 = x01 + v * (x11 - x01)
  return (y0 + w * (y1 - y0)) * 2 - 1
}

// ---------------------------------------------------------------------------
// Soft radial glow texture (procedural, generated once)
// ---------------------------------------------------------------------------
function makeGlowTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)') {
  const size = 256
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, inner)
  g.addColorStop(0.35, 'rgba(255,255,255,0.35)')
  g.addColorStop(1, outer)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

function makeRingTexture() {
  const size = 256
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  ctx.strokeStyle = 'rgba(255,255,255,1)'
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size * 0.36, 0, Math.PI * 2)
  ctx.stroke()
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

// ---------------------------------------------------------------------------
// Device-tier detection: high / mid / low
// ---------------------------------------------------------------------------
function detectQuality() {
  const mem = navigator.deviceMemory || 8
  const cores = navigator.hardwareConcurrency || 8
  const area = window.innerWidth * window.innerHeight
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent)
  if (isMobile || mem <= 3 || cores <= 4 || area < 600 * 600) return 'low'
  if (mem <= 5 || cores <= 6) return 'mid'
  return 'high'
}

const QUALITY = {
  high: { dust: 32000, connectors: 600, dpr: 1.75, bloom: [1.15, 0.7, 0.12], stars: 6, waves: 3 },
  mid: { dust: 18000, connectors: 340, dpr: 1.3, bloom: [0.9, 0.6, 0.15], stars: 4, waves: 2 },
  low: { dust: 9000, connectors: 180, dpr: 1, bloom: [0.6, 0.5, 0.2], stars: 3, waves: 1 },
}

// Color palette for particles (blue / cyan / purple / white / soft pink)
const PALETTE = [
  [0.25, 0.55, 1.0], // blue
  [0.4, 0.9, 1.0], // cyan
  [0.62, 0.35, 1.0], // purple
  [0.95, 0.98, 1.0], // white
  [1.0, 0.45, 0.85], // soft pink
]

export default function ParticleUniverse() {
  const mountRef = useRef(null)
  const [failed, setFailed] = useState(false)
  const { theme } = useApp()
  const themeRef = useRef(theme)
  useEffect(() => {
    themeRef.current = theme
  }, [theme])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ---- Core setup ----
    const q = QUALITY[detectQuality()]
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' })
    } catch (err) {
      console.error('ParticleUniverse: WebGL is not available, falling back to plain background.', err)
      setFailed(true)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, q.dpr))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 1)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.pointerEvents = 'none'
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x050513, 0.05)

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 120)
    camera.position.set(0, 2, 14)

    // ---- Background gradient sphere ----
    const bgMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        uTop: { value: new THREE.Color('#0d1b4d') },
        uBottom: { value: new THREE.Color('#04030f') },
        uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      vertexShader: BG_VERT,
      fragmentShader: BG_FRAG,
    })
    const bgSphere = new THREE.Mesh(new THREE.SphereGeometry(60, 24, 16), bgMat)
    scene.add(bgSphere)

    // ---- Nebula clouds ----
    const glowTex = makeGlowTexture()
    const nebulaColors = [0x3a2b7d, 0x164a8a, 0x7a2b6d, 0x1c5a7a, 0x2b3a8a, 0x8a3a6d]
    const nebulae = []
    for (let i = 0; i < 7; i++) {
      const mat = new THREE.SpriteMaterial({
        map: glowTex,
        color: nebulaColors[i % nebulaColors.length],
        transparent: true,
        opacity: 0.05 + Math.random() * 0.05,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
      })
      const sprite = new THREE.Sprite(mat)
      sprite.position.set(
        (Math.random() - 0.5) * 26,
        (Math.random() - 0.5) * 16,
        -14 - Math.random() * 22,
      )
      const s = 22 + Math.random() * 26
      sprite.scale.set(s, s, 1)
      scene.add(sprite)
      nebulae.push({ sprite, mat, speed: 0.02 + Math.random() * 0.03, seed: Math.random() * 10 })
    }

    // ---- Galaxy dust (main particles, GPU shader) ----
    const dustCount = q.dust
    const dustGeo = new THREE.BufferGeometry()
    const basePos = new Float32Array(dustCount * 3)
    const seeds = new Float32Array(dustCount)
    const colorMix = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      // Blobby spherical shell, denser near the core
      const r = 2 + Math.pow(Math.random(), 0.5) * 13
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      basePos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      basePos[i * 3 + 1] = r * Math.cos(phi) * 0.8
      basePos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
      seeds[i] = Math.random()
      // Blend 2 palette colors per particle
      const c1 = PALETTE[Math.floor(Math.random() * PALETTE.length)]
      const c2 = PALETTE[Math.floor(Math.random() * PALETTE.length)]
      const t = Math.random()
      colorMix[i * 3] = c1[0] * (1 - t) + c2[0] * t
      colorMix[i * 3 + 1] = c1[1] * (1 - t) + c2[1] * t
      colorMix[i * 3 + 2] = c1[2] * (1 - t) + c2[2] * t
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(dustCount * 3), 3))
    dustGeo.setAttribute('aBase', new THREE.BufferAttribute(basePos, 3))
    dustGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    dustGeo.setAttribute('aColorMix', new THREE.BufferAttribute(colorMix, 3))

    const dustUniforms = {
      uTime: { value: 0 },
      uSize: { value: q === QUALITY.high ? 5 : 5.5 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, q.dpr) },
      uBrightness: { value: 1 },
    }
    const dustMat = new THREE.ShaderMaterial({
      uniforms: dustUniforms,
      vertexShader: DUST_VERT,
      fragmentShader: DUST_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const dustPoints = new THREE.Points(dustGeo, dustMat)
    dustPoints.frustumCulled = false // positions are GPU-displaced
    scene.add(dustPoints)

    // ---- Connector constellation (CPU positions + line segments) ----
    const connCount = q.connectors
    const connData = []
    const connRadius = 8
    for (let i = 0; i < connCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      connData.push({
        base: new THREE.Vector3(
          connRadius * Math.sin(phi) * Math.cos(theta),
          connRadius * Math.cos(phi) * 0.7,
          connRadius * Math.sin(phi) * Math.sin(theta),
        ),
        seed: Math.random() * 100,
      })
    }
    const maxLines = connCount * 4
    const linePos = new Float32Array(maxLines * 6)
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3))
    lineGeo.setDrawRange(0, 0)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x3ee6ff,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const lineSeg = new THREE.LineSegments(lineGeo, lineMat)
    lineSeg.frustumCulled = false
    scene.add(lineSeg)

    // ---- Shooting stars ----
    const starTex = makeGlowTexture()
    const stars = []
    for (let i = 0; i < q.stars; i++) {
      const mat = new THREE.SpriteMaterial({
        map: starTex,
        color: 0xbfe9ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const sprite = new THREE.Sprite(mat)
      sprite.scale.set(1.6, 0.3, 1)
      scene.add(sprite)
      stars.push({ sprite, mat, life: 0, speed: new THREE.Vector3() })
      respawnStar(stars[i], true)
    }
    function respawnStar(s, immediate) {
      const x = (Math.random() - 0.5) * 30
      const y = (Math.random() - 0.5) * 18
      const z = (Math.random() - 0.5) * 14 - 4
      s.sprite.position.set(x, y, z)
      s.speed.set((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3)
      s.speed.normalize().multiplyScalar(6 + Math.random() * 8)
      s.life = immediate ? Math.random() : -0.01
      s.maxLife = 1.6 + Math.random() * 1.6
    }

    // ---- Expanding energy waves ----
    const ringTex = makeRingTexture()
    const waves = []
    for (let i = 0; i < q.waves; i++) {
      const mat = new THREE.SpriteMaterial({
        map: ringTex,
        color: 0x6a5cff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const sprite = new THREE.Sprite(mat)
      scene.add(sprite)
      waves.push({ sprite, mat, t: 1 })
    }

    // ---- Post-processing: bloom + output ----
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      q.bloom[0],
      q.bloom[1],
      q.bloom[2],
    )
    composer.addPass(bloom)
    composer.addPass(new OutputPass())

    // ---- Mouse / touch parallax ----
    const mouse = { x: 0, y: 0 }
    const onPointer = (e) => {
      mouse.x = (e.touches ? e.touches[0].clientX : e.clientX) / window.innerWidth - 0.5
      mouse.y = (e.touches ? e.touches[0].clientY : e.clientY) / window.innerHeight - 0.5
    }
    window.addEventListener('mousemove', onPointer)
    window.addEventListener('touchmove', onPointer, { passive: true })

    // ---- Resize ----
    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      composer.setSize(w, h)
      bgMat.uniforms.uRes.value.set(w, h)
    }
    window.addEventListener('resize', onResize)

    // ---- Visibility: pause when hidden ----
    let paused = false
    const onVis = () => {
      paused = document.hidden
    }
    document.addEventListener('visibilitychange', onVis)

    // ---- Theme adaption ----
    const applyTheme = () => {
      const dark = themeRef.current !== 'light'
      dustUniforms.uBrightness.value = dark ? 1 : 0.5
      bloom.strength = dark ? q.bloom[0] : q.bloom[0] * 0.55
      bgMat.uniforms.uTop.value.set(dark ? '#0d1b4d' : '#cdd7ff')
      bgMat.uniforms.uBottom.value.set(dark ? '#04030f' : '#eef0ff')
      scene.fog = new THREE.FogExp2(dark ? 0x050513 : 0xc9d2ff, dark ? 0.05 : 0.035)
    }
    applyTheme()

    // ---- FPS watchdog: degrade gracefully if slow ----
    let fpsWindow = []
    let lastFpsCheck = performance.now()
    let degraded = false

    // ---- Animation loop ----
    const clock = new THREE.Clock()
    let raf = 0

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(clock.getDelta(), 0.05) // clamp big jumps from tab switches

      if (!paused) {
        const t = clock.elapsedTime

        // Cinematic camera: orbit + drift + breathing zoom + parallax
        const theta = t * 0.06
        const radius = 13 + Math.sin(t * 0.05) * 2.2
        camera.position.x = Math.cos(theta) * radius + mouse.x * 2.2
        camera.position.y = Math.sin(t * 0.11) * 1.8 + mouse.y * 1.4
        camera.position.z = Math.sin(theta) * radius + mouse.x * 1.4
        camera.lookAt(
          Math.sin(t * 0.03) * 2,
          Math.cos(t * 0.04) * 1,
          Math.sin(t * 0.02) * 2,
        )

        dustUniforms.uTime.value = t

        // Nebula drift + breathing
        for (const nb of nebulae) {
          nb.sprite.position.y += Math.sin(t * nb.speed * 3 + nb.seed) * 0.004
          const s = 22 + Math.sin(t * nb.speed + nb.seed) * 4
          nb.sprite.scale.set(s, s, 1)
        }

        // Connector lines: compute positions + build visible segments
        const linkThresh = 3.4
        const thresh2 = linkThresh * linkThresh
        let lineCount = 0
        for (let i = 0; i < connCount; i++) {
          const c = connData[i]
          const b = c.base
          const ang = t * (0.06 + (c.seed % 1) * 0.14)
          const ca = Math.cos(ang)
          const sa = Math.sin(ang)
          const px = b.x * ca - b.z * sa + noise3(b.x * 0.4 + t * 0.1, b.y * 0.4, b.z * 0.4) * 1.6
          const py = b.y + noise3(b.x * 0.4, b.y * 0.4 + t * 0.12, b.z * 0.4) * 1.6
          const pz = b.x * sa + b.z * ca + noise3(b.x * 0.4, b.y * 0.4, b.z * 0.4 + t * 0.1) * 1.6
          c.x = px
          c.y = py
          c.z = pz
        }
        for (let i = 0; i < connCount; i++) {
          const a = connData[i]
          for (let j = i + 1; j < connCount; j++) {
            const b = connData[j]
            const dx = a.x - b.x
            const dy = a.y - b.y
            const dz = a.z - b.z
            const d2 = dx * dx + dy * dy + dz * dz
            if (d2 < thresh2) {
              if (lineCount >= maxLines - 1) break
              const o = lineCount * 6
              linePos[o] = a.x
              linePos[o + 1] = a.y
              linePos[o + 2] = a.z
              linePos[o + 3] = b.x
              linePos[o + 4] = b.y
              linePos[o + 5] = b.z
              lineCount++
            }
          }
        }
        lineGeo.setDrawRange(0, lineCount)
        lineGeo.attributes.position.needsUpdate = true

        // Shooting stars
        for (const s of stars) {
          s.life += dt
          if (s.life > s.maxLife) {
            respawnStar(s)
            continue
          }
          s.sprite.position.addScaledVector(s.speed, dt)
          const fade = Math.sin(Math.PI * Math.min(s.life / s.maxLife, 1))
          s.mat.opacity = fade * 0.85
        }

        // Energy waves
        for (const w of waves) {
          w.t += dt * 0.5
          if (w.t > 1) {
            w.t = 0
            w.sprite.position.set(
              (Math.random() - 0.5) * 18,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 8 - 2,
            )
          }
          const ease = 1 - Math.pow(1 - w.t, 3)
          const scale = 0.5 + ease * 14
          w.sprite.scale.set(scale, scale, 1)
          w.mat.opacity = (1 - w.t) * 0.5
        }

        composer.render()

        // FPS watchdog: if it drops below 40fps, render half the particles.
        const now = performance.now()
        if (now - lastFpsCheck > 2000) {
          const fps = fpsWindow.length ? (fpsWindow.length * 1000) / (now - lastFpsCheck) : 60
          fpsWindow = []
          lastFpsCheck = now
          if (fps < 40 && !degraded && dustCount > 8000) {
            degraded = true
            dustGeo.setDrawRange(0, Math.floor(dustCount * 0.5))
          }
        }
      }
    }
    tick()

    // ---- Cleanup ----
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onPointer)
      window.removeEventListener('touchmove', onPointer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material.dispose()
        }
      })
      glowTex.dispose()
      starTex.dispose()
      ringTex.dispose()
      composer.dispose?.()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  if (failed) return null
  return <div ref={mountRef} className="network-bg" aria-hidden="true" />
}
