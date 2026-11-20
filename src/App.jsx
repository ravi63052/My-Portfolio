import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { profile, projects } from './data/portfolio';
import { useMedia, useScrollSpy } from './hooks/useExperience';
import { useStory } from './hooks/useStory';
import { Socials, VisualBoundary } from './components/Shared';
import ThemeToggle from './components/ThemeToggle';
import TypingRole from './components/TypingRole';
import SceneHost from './components/SceneHost';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Journey from './sections/Journey';
import Contact from './sections/Contact';
import './App.css';
import './styles/case-study.css';
import './styles/theme.css';

const CaseStudy = lazy(() => import('./pages/CaseStudy'));
const navigation = [['home', 'Home'], ['about', 'About'], ['skills', 'Skills'], ['projects', 'Projects'], ['journey', 'Journey'], ['contact', 'Contact']];
const sectionIds = navigation.map(([id]) => id);

export default function App() {
  const root = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectId, setProjectId] = useState(() => window.location.hash.replace('#project/', ''));
  const [selectedSkill, setSelectedSkill] = useState(0);
  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  const mobile = useMedia('(max-width: 960px)');
  const active = useScrollSpy(sectionIds);
  const story = useStory(root, reduced);

  useEffect(() => {
    const initialHash = window.location.hash;
    const id = initialHash.slice(1);
    if (!sectionIds.includes(id)) return;
    let cancelled = false;
    let frame;
    // Native fragment navigation can run before the React sections exist.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        if (window.location.hash === initialHash) document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    const update = () => { setProjectId(window.location.hash.replace('#project/', '')); setMenuOpen(false); };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const key = event => { if (event.key === 'Escape') { setMenuOpen(false); document.querySelector('.menu-toggle')?.focus(); } };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [menuOpen]);

  const selectedProject = projects.find(project => project.id === projectId);
  const closeProject = () => { window.location.hash = 'projects'; };

  return <div className="portfolio-experience" ref={root}>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="scroll-progress" aria-hidden="true"/>
    <SceneHost story={story} mobile={mobile} paused={!!selectedProject} reduced={reduced}/>

    <header className="site-header">
      <div className="nav-shell flex items-center justify-between">
        <a href="#home" className="brand" aria-label="Ravi Goud home"><span className="monogram">RG<span>.</span></span></a>
        <button className="menu-toggle icon-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-controls="main-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
        <nav id="main-navigation" className={`navigation ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">{navigation.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav>
        <div className="nav-actions"><a href="#contact" className="nav-contact" onClick={() => setMenuOpen(false)}>Hire Me<ArrowUpRight size={17} aria-hidden="true"/></a><ThemeToggle/></div>
      </div>
    </header>

    <main id="main">
      <section id="home" className="hero shell">
        <div className="hero-copy">
          <div className="hero-kicker hero-reveal">FULL STACK DEVELOPMENT &amp; APPLIED AI</div>
          <h1 aria-label="Ravi Goud"><span className="name-row" aria-hidden="true">{Array.from('Ravi').map((letter, i) => <span key={i} className="name-mask"><span className="name-letter">{letter}</span></span>)}</span><span className="name-row name-mint" aria-hidden="true">{Array.from('Goud.').map((letter, i) => <span key={i} className="name-mask"><span className="name-letter">{letter}</span></span>)}</span></h1>
          <div className="hero-reveal"><TypingRole reduced={reduced} paused={!!selectedProject}/></div>
          <p className="hero-description hero-reveal">I build thoughtful web applications and intelligent systems that turn complex ideas into useful digital experiences.</p>
          <div className="hero-actions hero-reveal flex flex-wrap gap-3"><a href="#projects" className="button primary">Explore my work</a><a href="#contact" className="button secondary">Let’s work together</a></div>
          <div className="hero-social hero-reveal"><Socials/></div>
        </div>
        <div className="hero-scene-space" aria-hidden="true"/>
        <div className="hero-bottom"><a href="#about"><span className="scroll-line"/>Scroll to explore</a><span>{profile.location}</span><span className="scene-instruction">A workspace in motion. A story in code.</span></div>
      </section>
      <About/>
      <Skills selected={selectedSkill} onSelect={setSelectedSkill} reduced={reduced} paused={!!selectedProject}/>
      <Projects reduced={reduced} paused={!!selectedProject}/>
      <Journey/>
      <Contact/>
    </main>

    <footer className="shell footer"><span>© {new Date().getFullYear()} Ravi Goud</span><span>{profile.location}</span></footer>

    {selectedProject && <VisualBoundary fallback={<div className="case-error" role="alert">The case study could not load.<button onClick={closeProject}>Return to projects</button></div>}><Suspense fallback={<div className="case-loading" role="status">Opening the project…</div>}><CaseStudy key={selectedProject.id} project={selectedProject} onClose={closeProject} reduced={reduced}/></Suspense></VisualBoundary>}
  </div>;
}
