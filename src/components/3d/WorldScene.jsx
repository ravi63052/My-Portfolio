import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor, RoundedBox } from '@react-three/drei';
import { CanvasTexture, DoubleSide, MathUtils, Object3D, PCFShadowMap, PMREMGenerator, Shape, SRGBColorSpace, Vector3 } from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { useTheme } from '../../hooks/useTheme';
import { orbitSkills } from '../../data/story';

const MINT = '#4af0be';

function StudioLights({ compact = false }) {
  const { theme } = useTheme();
  const { gl, scene, invalidate } = useThree();
  const light = theme === 'light';
  useEffect(() => {
    gl.toneMappingExposure = light ? 1.15 : 1.05;
    gl.domElement.dataset.theme = theme;
    scene.environmentIntensity = light ? .85 : .8;
    invalidate();
  }, [theme, light, gl, scene, invalidate]);
  return <>
    <hemisphereLight args={[light ? '#ffffff' : '#e6fff3', light ? '#738b80' : '#263a32', light ? 1.9 : 1.6]}/>
    <directionalLight position={[3, 6, 5]} intensity={light ? 3.2 : 4} color="#f3fff8" castShadow={compact} shadow-mapSize={[512, 512]} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-normalBias={.025}/>
    <directionalLight position={[-4, 2, 3]} intensity={light ? 1.5 : 2} color="#c4d8ff"/>
    <pointLight position={[2, 1, -2]} intensity={compact ? 12 : 22} color={light ? '#00a67a' : MINT}/>
  </>;
}

// Retain sharp edges on high-density displays without rendering a full 4K buffer.
function useRenderQuality() {
  const [declined, setDeclined] = useState(false);
  const [size, setSize] = useState(() => [innerWidth, innerHeight]);
  useEffect(() => {
    const resize = () => setSize([innerWidth, innerHeight]);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  const low = navigator.connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory < 4);
  const dpr = Math.min(devicePixelRatio || 1, declined || low ? 1 : 1.75, Math.sqrt(3800000 / (size[0] * size[1])));
  return [Math.max(.7, dpr), () => setDeclined(true)];
}

function StudioEnvironment() {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    // Bake a small studio reflection map once, without network assets or extra frames.
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const map = generator.fromScene(room, .04, .1, 100, { size: 64 });
    const previous = scene.environment;
    scene.environment = map.texture;
    scene.environmentIntensity = .65;
    room.dispose();
    generator.dispose();
    invalidate();
    return () => { scene.environment = previous; map.dispose(); };
  }, [gl, scene, invalidate]);
  return null;
}

function makeTexture(kind, title, color = MINT) {
  const canvas = document.createElement('canvas');
  canvas.width = kind === 'icon' ? 256 : 1024;
  canvas.height = kind === 'icon' ? 256 : 640;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  ctx.fillStyle = '#071512'; ctx.fillRect(0, 0, w, canvas.height);
  if (kind === 'icon') {
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 6;
    ctx.translate(128, 128);
    if (title === 'react') {
      for (let i = 0; i < 3; i++) { ctx.save(); ctx.rotate(i * Math.PI / 3); ctx.beginPath(); ctx.ellipse(0, 0, 78, 29, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
      ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.fill();
    } else if (title === 'node') {
      ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 - Math.PI / 2; const x = Math.cos(a) * 85; const y = Math.sin(a) * 85; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); ctx.stroke(); ctx.font = 'bold 75px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('N', 0, 26);
    } else if (title === 'mongo') {
      ctx.beginPath(); ctx.moveTo(0, -91); ctx.bezierCurveTo(-80, -15, -36, 48, 0, 76); ctx.bezierCurveTo(44, 30, 68, -12, 0, -91); ctx.fill(); ctx.strokeStyle = '#071512'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(0, 92); ctx.stroke();
    } else if (title === 'gemini') {
      ctx.beginPath(); ctx.moveTo(0, -91); ctx.quadraticCurveTo(12, -12, 91, 0); ctx.quadraticCurveTo(12, 12, 0, 91); ctx.quadraticCurveTo(-12, 12, -91, 0); ctx.quadraticCurveTo(-12, -12, 0, -91); ctx.fill();
    } else if (title === 'java') {
      ctx.lineWidth = 8; ctx.strokeRect(-50, -5, 88, 60); ctx.beginPath(); ctx.arc(44, 23, 23, -Math.PI / 2, Math.PI / 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-68, 79); ctx.lineTo(68, 79); ctx.moveTo(-7, -24); ctx.bezierCurveTo(-50, -54, 40, -56, 5, -91); ctx.stroke();
    } else { ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `bold ${title.length > 2 ? 70 : 100}px sans-serif`; ctx.fillText(title, 0, 8); }
  } else {
    ctx.fillStyle = '#112820'; ctx.fillRect(0, 0, 1024, 70);
    ['#4af0be', '#718d84', '#718d84'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(30 + i * 24, 35, 6, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = '#829f95'; ctx.font = '18px monospace'; ctx.fillText(title, 170, 43);
    if (kind === 'code') {
      const lines = [ ['#708c82', '// Turning ideas into useful software'], ['#c5b4ff', 'const developer = {'], [MINT, '  name: "Ravi Goud",'], ['#d7e9e1', '  stack: ["React", "Node", "Java"],'], ['#d7e9e1', '  focus: "Applied intelligence",'], ['#c5b4ff', '};'], ['', ''], ['#c5b4ff', 'async function build(idea) {'], [MINT, '  return await makeItUseful(idea);'], ['#c5b4ff', '}'] ];
      ctx.font = '24px monospace'; lines.forEach(([c, line], i) => { ctx.fillStyle = '#3b5d50'; ctx.fillText(String(i + 1).padStart(2, '0'), 25, 125 + i * 44); ctx.fillStyle = c || '#708c82'; ctx.fillText(line, 95, 125 + i * 44); });
      ctx.fillStyle = '#0d2d22'; ctx.fillRect(0, 590, 1024, 50); ctx.fillStyle = MINT; ctx.font = '19px monospace'; ctx.fillText('REACT  /  NODE.JS  /  GENERATIVE AI', 32, 622);
    } else {
      ctx.strokeStyle = `${color}55`; ctx.lineWidth = 3;
      for (let i = 0; i < 4; i++) { ctx.strokeRect(55, 110 + i * 105, 900, 72); ctx.fillStyle = color; ctx.fillRect(80, 136 + i * 105, 90 + i * 65, 12); ctx.fillStyle = '#59776b'; ctx.fillRect(400, 136 + i * 105, 400 - i * 40, 12); }
      ctx.fillStyle = color; ctx.font = '26px monospace'; ctx.fillText('INTERFACE  /  LOGIC  /  INTELLIGENCE', 55, 590);
    }
  }
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function TexturePlane({ kind = 'code', title, color, ...props }) {
  const texture = useMemo(() => makeTexture(kind, title, color), [kind, title, color]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh {...props}><planeGeometry args={kind === 'icon' ? [.74, .74] : [3.3, 2.06]}/><meshBasicMaterial map={texture} toneMapped={false} side={DoubleSide}/></mesh>;
}

function MetalBox({ args, color = '#1c2925', emissive = '#000000', ...props }) {
  const { theme } = useTheme();
  return <RoundedBox castShadow receiveShadow args={args} radius={.045} smoothness={2} {...props}><meshStandardMaterial color={color} metalness={theme === 'light' ? .48 : .58} roughness={.32} emissive={emissive} emissiveIntensity={.6}/></RoundedBox>;
}

function Keyboard() {
  const keys = useRef();
  useLayoutEffect(() => {
    const dummy = new Object3D();
    for (let i = 0; i < 48; i++) {
      dummy.position.set((i % 12 - 5.5) * .17, 0, (Math.floor(i / 12) - 1.5) * .17); dummy.updateMatrix(); keys.current.setMatrixAt(i, dummy.matrix);
    }
    keys.current.instanceMatrix.needsUpdate = true;
  }, []);
  return <group position={[-.2, -.09, .72]}><MetalBox args={[2.27, .1, .86]} color="#101d18"/><instancedMesh ref={keys} args={[null, null, 48]} position={[0, .08, 0]}><boxGeometry args={[.135, .055, .13]}/><meshStandardMaterial color="#5d796c" metalness={.5} roughness={.4}/></instancedMesh><mesh position={[0, -.06, .38]}><boxGeometry args={[2.1, .015, .025]}/><meshBasicMaterial color={MINT}/></mesh></group>;
}

function Workspace({ story }) {
  const display = useRef(); const left = useRef(); const right = useRef(); const chip = useRef();
  useFrame((_, delta) => {
    const progress = Math.min(1, Math.max(0, story.current.chapter));
    const amount = story.current.paused || story.current.reduced ? 1 : 1 - Math.exp(-Math.min(delta, .05) * 5);
    display.current.position.y = MathUtils.lerp(display.current.position.y, 1.23 + progress * .65, amount);
    left.current.position.x = MathUtils.lerp(left.current.position.x, -2.2 - progress * .5, amount);
    left.current.position.y = MathUtils.lerp(left.current.position.y, .8 + progress * .5, amount);
    right.current.position.x = MathUtils.lerp(right.current.position.x, 2 + progress * .5, amount);
    right.current.position.y = MathUtils.lerp(right.current.position.y, .6 + progress * .7, amount);
    chip.current.position.y = MathUtils.lerp(chip.current.position.y, .1 + progress * .8, amount);
  });
  return <group>
    <MetalBox args={[4.6, .18, 2.7]} position={[0, -.36, 0]} color="#111b17"/>
    <mesh position={[0, -.46, 1.25]}><boxGeometry args={[4.2, .018, .025]}/><meshBasicMaterial color={MINT}/></mesh>
    <MetalBox args={[.9, .08, .7]} position={[0, -.21, -.62]}/><MetalBox args={[.15, .75, .15]} position={[0, .14, -.7]}/>
    <group ref={display} position={[0, 1.23, -.65]} rotation={[-.07, 0, 0]}>
      <MetalBox args={[3.6, 2.36, .17]} color="#263a31"/>
      <TexturePlane title="ravi / workspace.tsx" position={[0, .025, .095]}/>
      <mesh position={[0, -1.12, .105]}><boxGeometry args={[.5, .016, .01]}/><meshBasicMaterial color={MINT}/></mesh>
    </group>
    <Keyboard/>
    <MetalBox args={[.38, .12, .56]} position={[1.45, -.11, .75]} color="#334a3e" rotation={[0, -.12, 0]}/>
    <group ref={left} position={[-2.2, .8, -.1]} rotation={[0, .4, .03]} scale={.5}><MetalBox args={[3.6, 2.36, .13]}/><TexturePlane kind="system" title="SYSTEM / CONNECTED" position={[0, 0, .09]}/></group>
    <group ref={right} position={[2, .6, -.3]} rotation={[0, -.45, 0]} scale={.34}><MetalBox args={[3.6, 2.36, .13]}/><TexturePlane kind="system" title="AI / APPLICATION LAYER" color="#b9a1f4" position={[0, 0, .09]}/></group>
    <group ref={chip} position={[1.7, .1, -.6]}><MetalBox args={[.5, .65, .65]} color="#1d3c2b"/><mesh rotation={[.4, .3, .1]} position={[0, .6, 0]}><octahedronGeometry args={[.21]}/><meshStandardMaterial color={MINT} metalness={.4} roughness={.2} emissive={MINT} emissiveIntensity={.55}/></mesh></group>
  </group>;
}

// A small projected label avoids mounting a separate React root for every icon.
function SkillLabel({ skill, hovered }) {
  const anchor = useRef();
  const label = useRef();
  const point = useMemo(() => new Vector3(), []);
  const { gl, invalidate } = useThree();
  useEffect(() => {
    const element = document.createElement('span');
    element.setAttribute('aria-hidden', 'true');
    Object.assign(element.style, { position: 'absolute', top: '0', left: '0', pointerEvents: 'none', zIndex: '2' });
    gl.domElement.parentElement.appendChild(element);
    label.current = element;
    invalidate();
    return () => { element.remove(); label.current = null; };
  }, [gl, invalidate]);
  useEffect(() => {
    if (!label.current) return;
    label.current.textContent = skill.name + (hovered && skill.group === 5 ? ' · Learning' : '');
    label.current.className = hovered ? 'skill-tooltip' : 'skill-name';
    invalidate();
  }, [skill, hovered, invalidate]);
  useFrame(({ camera, size }) => {
    if (!label.current || !anchor.current) return;
    anchor.current.getWorldPosition(point).project(camera);
    label.current.style.transform = `translate(${(point.x + 1) * size.width / 2}px, ${(1 - point.y) * size.height / 2}px) translate(-50%, -50%)`;
  });
  return <group ref={anchor} position={[0, -.65, .15]}/>;
}

function TechObject({ skill, index, story, selected, onSelect }) {
  const ref = useRef(); const [hovered, setHovered] = useState(false);
  useFrame(({ clock }, delta) => {
    const time = story.current.paused || story.current.reduced ? 0 : clock.elapsedTime;
    const angle = index / orbitSkills.length * Math.PI * 2 + time * .045;
    const radius = 2.35;
    const group = ref.current;
    group.position.set(Math.cos(angle) * radius, Math.sin(angle) * 1.95, Math.sin(angle * 2) * .45);
    const scale = (hovered ? 1.25 : selected === skill.group ? 1.08 : .85);
    group.scale.setScalar(story.current.reduced ? scale : MathUtils.damp(group.scale.x, scale, 8, Math.min(delta, .05)));
    group.rotation.y = MathUtils.damp(group.rotation.y, Math.sin(angle) * -.3, 4, delta);
  });
  return <group ref={ref} onPointerOver={event => { event.stopPropagation(); setHovered(true); }} onPointerOut={() => setHovered(false)} onClick={event => { event.stopPropagation(); onSelect(skill.group); }}>
    <MetalBox args={[.9, .9, .15]} color={hovered || selected === skill.group ? '#294737' : '#12231b'} rotation={[0, 0, .06]}/>
    <TexturePlane kind="icon" title={skill.symbol} color={skill.color} position={[0, 0, .09]}/>
    <SkillLabel skill={skill} hovered={hovered}/>
  </group>;
}

function Envelope({ story }) {
  const letter = useRef();
  const flap = useMemo(() => new Shape().moveTo(-1.52, .94).lineTo(0, -.22).lineTo(1.52, .94).closePath(), []);
  useFrame(({ pointer, clock }, delta) => {
    const still = story.current.reduced || story.current.paused;
    const target = .7 + (still ? 0 : Math.sin(clock.elapsedTime * .6) * .09 + pointer.y * .12);
    letter.current.position.y = still ? .7 : MathUtils.damp(letter.current.position.y, target, 4, Math.min(delta, .05));
  });
  return <group rotation={[.05, -.3, -.13]}>
    <MetalBox args={[3.3, 2.1, .25]} color="#173d2d"/>
    <mesh position={[0, 0, .15]}><extrudeGeometry args={[flap, { depth: .04, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .015, bevelThickness: .015 }]}/><meshStandardMaterial color="#4a8c70" metalness={.5} roughness={.32}/></mesh>
    <mesh position={[0, -.9, .15]}><boxGeometry args={[2.8, .018, .02]}/><meshBasicMaterial color={MINT}/></mesh>
    <group ref={letter} position={[0, .7, -.13]} rotation={[-.08, 0, 0]}><MetalBox args={[2.7, 1.8, .04]} color="#bcebd5"/><mesh position={[0, .2, .035]}><boxGeometry args={[1.8, .025, .01]}/><meshBasicMaterial color="#1d6547"/></mesh><mesh position={[0, -.05, .035]}><boxGeometry args={[1.3, .025, .01]}/><meshBasicMaterial color="#1d6547"/></mesh></group>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.45, 0]}><torusGeometry args={[2.35, .012, 8, 80]}/><meshBasicMaterial color={MINT} transparent opacity={.3}/></mesh>
  </group>;
}

function IntelligenceCore({ story }) {
  const core = useRef();
  const rings = useRef();
  useFrame(({ pointer, clock }, delta) => {
    const still = story.current.reduced || story.current.paused;
    const t = still ? 0 : clock.elapsedTime;
    core.current.rotation.y = still ? .5 : MathUtils.damp(core.current.rotation.y, .5 + pointer.x * .3 + Math.sin(t * .22) * .15, 5, Math.min(delta, .05));
    core.current.rotation.x = .38 + (still ? 0 : pointer.y * -.12);
    rings.current.rotation.y = still ? .3 : t * .07 + story.current.chapter * .5;
  });
  return <group>
    <group ref={core} rotation={[.38, .5, .1]}>
      {[-1, 0, 1].map((layer, i) => <group key={layer} position={[0, layer * .58, 0]}>
        <MetalBox args={[2, .16, 1.8]} color={i === 1 ? '#235c48' : '#17372c'}/>
        <MetalBox args={[.72, .12, .72]} position={[0, .13, 0]} color="#496e5e"/>
        <mesh position={[0, .08, .85]}><boxGeometry args={[1.7, .025, .02]}/><meshBasicMaterial color={MINT}/></mesh>
        {[-1, 1].map(side => <mesh key={side} position={[side * 1.02, 0, 0]}><boxGeometry args={[.2, .05, 1.4]}/><meshStandardMaterial color="#a3c5b4" metalness={.8} roughness={.25}/></mesh>)}
      </group>)}
      <mesh position={[0, 1.12, 0]} rotation={[0, 0, Math.PI / 4]}><octahedronGeometry args={[.46]}/><meshStandardMaterial color="#a1ffe2" emissive={MINT} emissiveIntensity={.5} metalness={.55} roughness={.18}/></mesh>
    </group>
    <group ref={rings}>
      {[0, 1].map(i => <group key={i} rotation={[.5 + i, .25, i * .8]}><mesh><torusGeometry args={[2.35 + i * .25, .012, 8, 100]}/><meshBasicMaterial color={i ? '#b6a2ed' : MINT} transparent opacity={.5}/></mesh><mesh position={[2.35 + i * .25, 0, 0]}><octahedronGeometry args={[.16]}/><meshStandardMaterial color={i ? '#b6a2ed' : MINT} emissive={MINT} emissiveIntensity={.3}/></mesh></group>)}
    </group>
  </group>;
}

// Anchor WebGL objects to actual layout boxes, including the pinned About box.
// This keeps the composition correct at every scroll position and screen size.
function SectionObject({ selector, story, dimensions, centerY = 0, kind, children }) {
  const group = useRef();
  const content = useRef();
  const element = useRef();
  useEffect(() => { element.current = document.querySelector(selector); }, [selector]);
  useFrame(({ viewport, camera, size, pointer, clock, gl }, rawDelta) => {
    if (!element.current) return;
    const rect = element.current.getBoundingClientRect();
    const visible = rect.bottom > 0 && rect.top < size.height;
    group.current.visible = visible;
    if (!visible) return;
    const view = viewport.getCurrentViewport(camera, [0, 0, 0]);
    const unit = view.width / size.width;
    const intro = kind === 'workspace' ? story.current.intro ?? 1 : 1;
    group.current.position.set((rect.left + rect.width / 2 - size.width / 2) * unit, (size.height / 2 - rect.top - rect.height / 2) * unit - (1 - intro) * .6, 0);
    const scale = Math.min(rect.width * unit / dimensions[0], rect.height * unit / dimensions[1]);
    group.current.scale.setScalar(scale * (.88 + intro * .12));
    content.current.position.y = centerY;
    const still = story.current.reduced || story.current.paused;
    const delta = Math.min(rawDelta, .05);
    const angleY = kind === 'workspace' ? -.3 : -.18;
    const angleX = kind === 'workspace' ? .22 : .1;
    content.current.rotation.y = still ? angleY : MathUtils.damp(content.current.rotation.y, angleY + pointer.x * .19 + Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - size.height / 2) / size.height)) * .18, 4.5, delta);
    content.current.rotation.x = still ? angleX : MathUtils.damp(content.current.rotation.x, angleX - pointer.y * .09, 4.5, delta);
    if (!still) content.current.position.y += Math.sin(clock.elapsedTime * .65) * .035;
    gl.domElement.dataset.scene = kind;
  });
  return <group ref={group} visible={false}><group ref={content}>{children}</group></group>;
}

function StoryBridge({ story }) {
  const invalidate = useThree(state => state.invalidate);
  useEffect(() => {
    story.current.invalidate = invalidate;
    invalidate();
    return () => { if (story.current.invalidate === invalidate) delete story.current.invalidate; };
  }, [story, invalidate]);
  return null;
}

function World({ story }) {
  useFrame(({ camera }, delta) => {
    const target = 11 + Math.sin(story.current.chapter * .6) * .45;
    camera.position.z = story.current.reduced ? target : MathUtils.damp(camera.position.z, target, 4, Math.min(delta, .05));
    camera.lookAt(0, 0, 0);
  });
  return <>
    <StudioLights/>
    <SectionObject selector=".hero-scene-space" story={story} dimensions={[6.3, 4.8]} centerY={-.65} kind="workspace"><Workspace story={story}/></SectionObject>
    <SectionObject selector=".about-scene-space" story={story} dimensions={[6.4, 5.6]} kind="about"><IntelligenceCore story={story}/></SectionObject>
    <SectionObject selector=".contact-scene-space" story={story} dimensions={[5.4, 4.8]} kind="contact"><Envelope story={story}/></SectionObject>
  </>;
}

export default function WorldScene({ story, mobile, paused, reduced, onFailure }) {
  const [dpr, decline] = useRenderQuality();
  const [visible, setVisible] = useState(!document.hidden);
  const cleanup = useRef();
  const [inView, setInView] = useState(true);
  story.current.paused = paused;
  useEffect(() => {
    const boxes = [...document.querySelectorAll('.hero-scene-space, .about-scene-space, .contact-scene-space')];
    const entries = new Map();
    const observer = new IntersectionObserver(changes => {
      changes.forEach(entry => entries.set(entry.target, entry.isIntersecting));
      setInView([...entries.values()].some(Boolean));
    }, { rootMargin: '100px' });
    boxes.forEach(box => observer.observe(box));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => { document.removeEventListener('visibilitychange', update); cleanup.current?.(); };
  }, [story]);
  return <Canvas eventSource={document.getElementById('root')} eventPrefix="client" dpr={dpr} frameloop={!visible || !inView ? 'never' : paused || reduced ? 'demand' : 'always'} camera={{ position: [0, 0, 11], fov: 40 }} gl={{ alpha: true, antialias: true, powerPreference: mobile ? 'low-power' : 'high-performance' }} onCreated={({ gl }) => {
    const lost = event => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener('webglcontextlost', lost);
    cleanup.current = () => gl.domElement.removeEventListener('webglcontextlost', lost);
  }}><StudioEnvironment/><StoryBridge story={story}/><PerformanceMonitor onDecline={decline} flipflops={1}/><World story={story}/></Canvas>;
}

function SkillOrbit({ selected, onSelect, reduced, paused }) {
  const story = useRef({ reduced, paused });
  story.current.reduced = reduced;
  story.current.paused = paused;
  const group = useRef();
  useFrame(({ viewport, pointer }, delta) => {
    group.current.scale.setScalar(Math.min(1, viewport.width / 6.7, viewport.height / 5.7));
    group.current.rotation.y = reduced ? 0 : MathUtils.damp(group.current.rotation.y, pointer.x * .12, 4, Math.min(delta, .05));
  });
  return <group ref={group}>
    {orbitSkills.map((skill, index) => <TechObject key={skill.name} skill={skill} index={index} story={story} selected={selected} onSelect={onSelect}/>)}
    <mesh rotation={[.4, .15, 0]}><torusGeometry args={[2.3, .008, 6, 100]}/><meshBasicMaterial color={MINT} transparent opacity={.23}/></mesh>
    <mesh rotation={[1.1, .2, -.4]}><torusGeometry args={[1.55, .009, 6, 80]}/><meshBasicMaterial color="#bcadf4" transparent opacity={.3}/></mesh>
    <group rotation={[.3, .5, Math.PI / 4]}><MetalBox args={[.65, .65, .65]} color="#225442"/><mesh><boxGeometry args={[.7, .7, .7]}/><meshBasicMaterial color={MINT} wireframe transparent opacity={.5}/></mesh></group>
  </group>;
}

export function SkillsScene({ selected, onSelect, reduced, paused, active, onFailure }) {
  const cleanup = useRef();
  const [dpr, decline] = useRenderQuality();
  useEffect(() => () => cleanup.current?.(), []);
  return <Canvas dpr={dpr} frameloop={!active ? 'never' : reduced || paused ? 'demand' : 'always'} camera={{ position: [0, 0, 8], fov: 44 }} gl={{ alpha: true, powerPreference: 'low-power' }} onCreated={({ gl }) => {
    gl.domElement.dataset.scene = 'universe';
    const lost = event => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener('webglcontextlost', lost);
    cleanup.current = () => gl.domElement.removeEventListener('webglcontextlost', lost);
  }}><StudioEnvironment/><PerformanceMonitor onDecline={decline} flipflops={1}/><StudioLights compact/><SkillOrbit selected={selected} onSelect={onSelect} reduced={reduced} paused={paused}/></Canvas>;
}

function ProjectModel({ kind, reduced, paused }) {
  const group = useRef();
  const rotor = useRef();
  useFrame(({ pointer, clock }, delta) => {
    const still = reduced || paused;
    const t = still ? 0 : clock.elapsedTime;
    if (still) { group.current.rotation.set(.12, -.25, 0); return; }
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, -.25 + pointer.x * .3, 4, Math.min(delta, .05));
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, .12 - pointer.y * .15, 4, Math.min(delta, .05));
    group.current.position.y = Math.sin(t * .7) * .06;
    if (rotor.current) rotor.current.rotation.z = t * .35;
  });
  return <group ref={group}>
    {kind === 'mediguide' ? <>
      <MetalBox args={[2.2, 2.7, .3]} color="#1c4c37" rotation={[0, 0, -.08]}/>
      <mesh position={[0, .4, .22]}><boxGeometry args={[1.25, .35, .18]}/><meshStandardMaterial color="#acffce" emissive={MINT} emissiveIntensity={.3}/></mesh><mesh position={[0, .4, .22]}><boxGeometry args={[.35, 1.25, .18]}/><meshStandardMaterial color="#acffce" emissive={MINT} emissiveIntensity={.3}/></mesh>
      {[0, 1, 2].map(i => <mesh key={i} position={[-.18 + i * .05, -.55 - i * .22, .19]}><boxGeometry args={[1.15 - i * .17, .035, .025]}/><meshBasicMaterial color="#7bb69a"/></mesh>)}
      <mesh position={[1.5, -.7, .5]} rotation={[0, 0, -.65]}><capsuleGeometry args={[.18, .6, 6, 12]}/><meshStandardMaterial color="#a0d9b9" metalness={.5} roughness={.2}/></mesh>
    </> : kind === 'text-to-sql' ? <>
      {[0, 1, 2].map(i => <group key={i} position={[.55, -.7 + i * .65, 0]}><mesh><cylinderGeometry args={[.8, .8, .45, 48]}/><meshStandardMaterial color="#463b64" metalness={.65} roughness={.25}/></mesh><mesh position={[0, .23, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.74, .015, 6, 64]}/><meshBasicMaterial color="#c3a9ff"/></mesh></group>)}
      <group position={[-1, .5, .7]} scale={.47} rotation={[0, .16, -.06]}><MetalBox args={[3.6, 2.36, .15]} color="#242033"/><TexturePlane kind="system" title="QUESTION / SQL / RESULTS" color="#c8adff" position={[0, 0, .1]}/></group>
    </> : <>
      <mesh position={[0, -.8, 0]}><cylinderGeometry args={[.08, .15, 2.4, 16]}/><meshStandardMaterial color="#c0c9bc" metalness={.7} roughness={.35}/></mesh>
      <mesh position={[0, .45, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.18, .18, .5, 16]}/><meshStandardMaterial color="#dbe4d4" metalness={.6} roughness={.3}/></mesh>
      <group ref={rotor} position={[0, .45, .3]}>{[0, 1, 2].map(i => <group key={i} rotation={[0, 0, i * Math.PI * 2 / 3]}><mesh position={[0, .7, 0]} rotation={[0, .2, -.08]}><boxGeometry args={[.12, 1.4, .05]}/><meshStandardMaterial color="#d2ddc5" metalness={.4} roughness={.3}/></mesh></group>)}</group>
      <group position={[-1.25, -1.4, .45]} rotation={[-.65, 0, 0]}><MetalBox args={[1.15, .85, .04]} color="#203b38"/>{[0, 1, 2].map(i => <mesh key={i} position={[-.35 + i * .35, 0, .03]}><boxGeometry args={[.012, .78, .01]}/><meshBasicMaterial color="#729e97"/></mesh>)}</group>
    </>}
    <mesh receiveShadow position={[0, -1.65, 0]}><cylinderGeometry args={[2, 2, .06, 64]}/><meshStandardMaterial color="#14271c" metalness={.48} roughness={.4}/></mesh>
  </group>;
}

export function ProjectScene({ kind, paused, reduced, active, onFailure }) {
  const cleanup = useRef();
  const [dpr, decline] = useRenderQuality();
  useEffect(() => () => cleanup.current?.(), []);
  return <Canvas shadows={{ type: PCFShadowMap }} dpr={dpr} frameloop={!active ? 'never' : paused || reduced ? 'demand' : 'always'} camera={{ position: [0, .5, 6.5], fov: 40 }} gl={{ alpha: true, powerPreference: 'low-power' }} onCreated={({ gl }) => { const lost = event => { event.preventDefault(); onFailure(); }; gl.domElement.addEventListener('webglcontextlost', lost); cleanup.current=()=>gl.domElement.removeEventListener('webglcontextlost', lost); }}><StudioEnvironment/><PerformanceMonitor onDecline={decline} flipflops={1}/><StudioLights compact/><ProjectModel kind={kind} reduced={reduced} paused={paused}/></Canvas>;
}
