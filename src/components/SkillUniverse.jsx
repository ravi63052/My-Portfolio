import { lazy, Suspense } from 'react';
import { orbitSkills } from '../data/story';
import { VisualBoundary } from './Shared';
import { useSceneVisibility } from '../hooks/useSceneVisibility';

const SkillsScene = lazy(() => import('./3d/WorldScene').then(module => ({ default: module.SkillsScene })));

export default function SkillUniverse({ selected, onSelect, reduced, paused }) {
  const { host, active, seen, failed, setFailed } = useSceneVisibility();
  const fallback = <div className="skill-map">{orbitSkills.map(skill => <button key={skill.name} onClick={() => onSelect(skill.group)} aria-pressed={selected === skill.group} style={{ '--skill-color': skill.color }}>{skill.name}</button>)}</div>;
  return <div className="skills-visual" ref={host}>
    <div className="skills-visual-label"><span>THE CONNECTED STACK</span><span aria-hidden="true">REACT / AI / SYSTEMS</span></div>
    <div className="skills-canvas">
      <VisualBoundary fallback={fallback}><Suspense fallback={fallback}>{seen && !failed ? <SkillsScene selected={selected} onSelect={onSelect} active={active} reduced={reduced} paused={paused} onFailure={() => setFailed(true)}/> : fallback}</Suspense></VisualBoundary>
    </div>
    <p className="skills-hint">{failed ? 'Choose a technology to explore its category.' : 'Hover to discover. Select to explore.'}</p>
  </div>;
}
