import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skillGroups } from '../data/portfolio';
import SkillUniverse from '../components/SkillUniverse';
import { gsap } from 'gsap';

export default function Skills({ selected, onSelect, reduced, paused }) {
  const detail = useRef();
  useEffect(() => { const frame = requestAnimationFrame(() => ScrollTrigger.refresh()); return () => cancelAnimationFrame(frame); }, [selected]);
  useEffect(() => {
    if (reduced) return;
    const context = gsap.context(() => gsap.from('.skill-detail-title, .skill-detail>p, .skill-tags>span', { y: 12, opacity: 0, stagger: .035, duration: .4, ease: 'power2.out' }), detail);
    return () => context.revert();
  }, [selected, reduced]);
  const group = skillGroups[selected];
  return <section id="skills" className="skills-section shell"><div className="skills-copy"><span className="eyebrow">THE TECHNOLOGY UNIVERSE</span><h2 data-words>A connected<br/><span>way to build.</span></h2><p className="section-intro" data-lines>The tools behind the interfaces, systems, and AI experiences I build.</p><div className="skill-tabs" aria-label="Skill categories">{skillGroups.map((item, i) => <button key={item.name} aria-pressed={selected === i} aria-controls="skill-detail" className={selected === i ? 'active' : ''} onClick={() => onSelect(i)}>{item.name}</button>)}</div><div id="skill-detail" ref={detail} className="skill-detail" aria-live="polite"><div className="skill-detail-title"><h3>{group.name}</h3><span>{group.learning ? 'CURRENTLY LEARNING' : 'WORKING TOOLKIT'}</span></div><p>{group.summary}</p><div className="skill-tags">{group.skills.map(skill => <span key={skill}>{skill}</span>)}</div></div></div><SkillUniverse selected={selected} onSelect={onSelect} reduced={reduced} paused={paused}/></section>;
}
