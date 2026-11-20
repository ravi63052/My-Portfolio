import { useEffect, useRef, useState } from 'react';

let webGLAvailable;
function canRender3D() {
  if (navigator.connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory < 3)) return false;
  if (webGLAvailable === undefined) {
    const gl = document.createElement('canvas').getContext('webgl2');
    webGLAvailable = !!gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }
  return webGLAvailable;
}

// A shared lifecycle keeps offscreen previews idle and avoids repeated GPU probes.
export function useSceneVisibility() {
  const host = useRef();
  const [active, setActive] = useState(false);
  const [seen, setSeen] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!canRender3D()) { setFailed(true); return; }
    let intersects = false;
    const update = () => setActive(intersects && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      intersects = entry.isIntersecting;
      if (intersects) setSeen(true);
      update();
    }, { rootMargin: '80px' });
    observer.observe(host.current);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  return { host, active, seen, failed, setFailed };
}
