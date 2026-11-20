import { lazy, Suspense, useEffect, useState } from 'react';
import { VisualBoundary } from './Shared';

const WorldScene = lazy(() => import('./3d/WorldScene'));

export function StaticWorkspace() {
  return <div className="static-workspace" aria-hidden="true"><svg viewBox="0 0 600 400" fill="none"><path d="m85 275 300 45 145-85-300-44L85 275Z" fill="#0e2118" stroke="#48785f"/><path d="M196 214V67l245 24v148l-245-25Z" fill="#0d2018" stroke="#78bb98" strokeWidth="2"/><path d="m213 84 210 21v114l-210-20V84Z" stroke="#4af0be"/><path d="m270 128 20 16-20 13m70-22-20 12 20 17m-35-40-9 47" stroke="#4af0be" strokeWidth="4"/><path d="m314 228-3 30-47 15 91 12 33-18-57-9v-28" stroke="#48785f"/><path d="m165 282 112-42 126 20-101 42-137-20Z" fill="#132e20" stroke="#48785f"/></svg></div>;
}

export default function SceneHost({ story, mobile, paused, reduced }) {
  const [available, setAvailable] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (navigator.connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory < 3)) return;
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    setAvailable(!!gl);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }, []);
  return <div className={`world-layer ${available && !failed ? 'has-webgl' : 'no-webgl'}`} aria-hidden="true"><VisualBoundary fallback={<StaticWorkspace/>}><Suspense fallback={<StaticWorkspace/>}>{available && !failed ? <WorldScene story={story} mobile={mobile} paused={paused} reduced={reduced} onFailure={() => setFailed(true)}/> : <StaticWorkspace/>}</Suspense></VisualBoundary></div>;
}
