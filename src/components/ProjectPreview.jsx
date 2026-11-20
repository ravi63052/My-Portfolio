import { lazy, Suspense } from 'react';
import { VisualBoundary } from './Shared';
import ProjectVisual from './ProjectVisual';
import { useSceneVisibility } from '../hooks/useSceneVisibility';

const ProjectScene = lazy(() => import('./3d/WorldScene').then(module => ({ default: module.ProjectScene })));

export default function ProjectPreview({ project, paused, reduced }) {
  const { host, active, seen, failed, setFailed } = useSceneVisibility();
  const fallback = <ProjectVisual id={project.id}/>;
  return <div className={`project-preview preview-${project.accent}`} ref={host} role="img" aria-label={`Interactive 3D illustration for ${project.fullTitle}`}><VisualBoundary fallback={fallback}><Suspense fallback={fallback}>{seen && !failed ? <ProjectScene kind={project.id} paused={paused} reduced={reduced} active={active} onFailure={() => setFailed(true)}/> : fallback}</Suspense></VisualBoundary></div>;
}
