import { Plus, Code2, ExternalLink as LinkIcon } from 'lucide-react';
import { projects } from '../data/portfolio';
import { ExternalLink } from '../components/Shared';
import ProjectPreview from '../components/ProjectPreview';

function TiltSurface({ children, enabled }) {
  function move(event) {
    if (!enabled || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--tilt-x', `${-(event.clientY - bounds.top - bounds.height / 2) / bounds.height * 7}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${(event.clientX - bounds.left - bounds.width / 2) / bounds.width * 9}deg`);
    event.currentTarget.style.setProperty('--light-x', `${(event.clientX - bounds.left) / bounds.width * 100}%`);
    event.currentTarget.style.setProperty('--light-y', `${(event.clientY - bounds.top) / bounds.height * 100}%`);
  }
  function reset(event) {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  }
  return <div className="tilt-surface" onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>{children}</div>;
}

export default function Projects({ reduced, paused }) {
  return <section id="projects" className="projects-section"><div className="shell"><div className="projects-heading"><div><span className="eyebrow">SELECTED ENGINEERING</span><h2 data-words>Ideas, made<br/><span>into something real.</span></h2></div><p data-lines>Healthcare. Data. Renewable energy.<br/>Three problems explored through code.</p></div><div className="project-list">{projects.map(project => <article className={`project-stage theme-${project.accent}`} key={project.id}><TiltSurface enabled={!reduced && !paused}><ProjectPreview project={project} reduced={reduced} paused={paused}/><div className="project-copy"><span className="eyebrow">{project.category}</span><h3><a href={`#project/${project.id}`}>{project.title}</a></h3><p>{project.description}</p><div className="tags">{project.stack.map(tech => <span key={tech}>{tech}</span>)}</div><div className="project-actions"><a href={`#project/${project.id}`} className="case-link">Explore case study<Plus size={20}/></a>{project.github && <ExternalLink className="source-link" href={project.github} aria-label={`${project.title} source code on GitHub`}><Code2 size={17}/>Source</ExternalLink>}{project.demo && <ExternalLink className="source-link" href={project.demo}><LinkIcon size={16}/>Live demo</ExternalLink>}</div></div></TiltSurface></article>)}</div></div></section>;
}
