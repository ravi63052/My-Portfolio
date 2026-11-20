import { useEffect, useRef, useState } from 'react';
import { Check, ChevronRight, Code2, Database, X } from 'lucide-react';
import { Github } from '../components/BrandIcons';
import { EmailLink, ExternalLink } from '../components/Shared';
import ProjectPreview from '../components/ProjectPreview';
import { runSampleQuery, sqlExamples, ticketSamples } from '../data/demos';

export function SqlDemo() {
  const [question, setQuestion] = useState(sqlExamples[0].question);
  const [result, setResult] = useState(sqlExamples[0]);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [schema, setSchema] = useState(false);
  const [loading, setLoading] = useState(false);
  const timer = useRef();
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  function run(event) {
    event.preventDefault(); setLoading(true); setError('');
    timer.current = setTimeout(()=>{
      try {const next=runSampleQuery(question);setResult(next);setHistory(h=>[next.question,...h.filter(q=>q!==next.question)].slice(0,5));}
      catch(e){setError(e.message);}
      setLoading(false);
    },300);
  }
  return <div className="interactive-demo"><div className="demo-top"><span><Code2 size={18}/> Try the translation</span><span className="sample-badge">LOCAL SAMPLE · NO AI OR DATABASE CONNECTION</span></div><div className="sample-questions">{sqlExamples.map(e=><button key={e.question} onClick={()=>setQuestion(e.question)}>{e.question}</button>)}</div><form onSubmit={run} className="query-form"><label htmlFor="question">Your question</label><div><input id="question" value={question} onChange={e=>setQuestion(e.target.value)} maxLength={200}/><button className="button primary" disabled={loading}>{loading?'Translating…':'Run sample'}</button></div></form>{error&&<p className="field-error" role="alert">{error}</p>}<div className="sql-output" aria-live="polite"><span className="code-label"><Check size={14}/> SELECT-only sample</span><pre>{result.sql}</pre><div className="table-scroll"><table><caption>Local sample query results</caption><thead><tr>{['ID','Name','Type','Status'].map(t=><th key={t}>{t}</th>)}</tr></thead><tbody>{result.rows.map(row=><tr key={row.id}>{Object.values(row).map((cell,i)=><td key={i}>{cell}</td>)}</tr>)}</tbody></table></div></div><button className="text-link" aria-expanded={schema} onClick={()=>setSchema(!schema)}><Database size={16}/>{schema?'Hide':'View'} sample schema</button>{schema&&<pre className="schema">assets (id INTEGER, name VARCHAR, type VARCHAR, status VARCHAR)</pre>}{history.length>0&&<div className="query-history"><small>QUERY HISTORY · THIS SESSION</small>{history.map(q=><button key={q} onClick={()=>setQuestion(q)}>{q}</button>)}</div>}</div>;
}
function TicketDemo() {
  const [index,setIndex]=useState(0); const ticket=ticketSamples[index];
  return <div className="interactive-demo"><div className="demo-top"><span>Inside the triage workflow</span><span className="sample-badge">ILLUSTRATIVE LOCAL SAMPLES</span></div><div className="sample-questions">{ticketSamples.map((t,i)=><button key={t.label} aria-pressed={index===i} onClick={()=>setIndex(i)}>{t.label}</button>)}</div><div className="ticket-preview" aria-live="polite"><span className="eyebrow">INCOMING TICKET</span><h4>{ticket.ticket}</h4><div className="ticket-result"><div><small>PRIORITY</small><strong className={index===0?'danger':''}>{ticket.severity}</strong></div><div><small>ROUTE TO</small><strong>{ticket.team}</strong></div></div><span className="sample-badge">{ticket.tag}</span><p>{ticket.reason}</p><p>{ticket.action}</p></div><p className="demo-note">Illustrates the brief’s rules-based routing. These samples do not run the Python agent or generate live recommendations.</p></div>;
}
function Architecture({project}) {
  const [selected,setSelected]=useState(0);
  return <div className="architecture"><div className="architecture-nodes">{project.architecture.map(([name],i)=><div className="architecture-step" key={name}><button onClick={()=>setSelected(i)} aria-pressed={selected===i}>{name}</button>{i<project.architecture.length-1&&<ChevronRight size={16} aria-hidden="true"/>}</div>)}</div><p aria-live="polite"><strong>{project.architecture[selected][0]}</strong>{project.architecture[selected][1]}</p></div>;
}
export default function CaseStudy({ project, onClose, reduced = false, paused = false }) {
  const dialog=useRef();
  useEffect(()=>{
    const prior=document.activeElement; const previousOverflow=document.body.style.overflow;
    dialog.current.showModal(); document.body.style.overflow='hidden';
    return ()=>{document.body.style.overflow=previousOverflow;prior?.focus();};
  },[]);
  return <dialog className={`case-dialog theme-${project.accent}`} ref={dialog} aria-labelledby="case-title" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===dialog.current)onClose();}}><div className="case-inner"><div className="case-topbar"><span className="eyebrow">PROJECT CASE STUDY</span><button className="icon-button" aria-label="Close case study" onClick={onClose} autoFocus><X size={22}/></button></div><ProjectPreview project={project} reduced={reduced} paused={paused}/><div className="case-content"><span className="eyebrow">{project.category}</span><h2 id="case-title">{project.fullTitle}</h2><p className="case-lead">{project.description}</p><div className="tags">{project.stack.map(t=><span key={t}>{t}</span>)}</div><div className="case-columns"><section><h3>The problem</h3><p>{project.problem}</p></section><section><h3>The approach</h3><p>{project.solution}</p></section></div><section><h3>System architecture</h3><p>Select a stage to explore its role.</p><Architecture project={project}/></section>{project.id==='text-to-sql'&&<SqlDemo/>}{project.id==='energy-agent'&&<TicketDemo/>}<div className="case-columns"><section><h3>Core functionality</h3><ul>{project.features.map(f=><li key={f}>{f}</li>)}</ul></section><section><h3>Technical decisions</h3><ul>{project.decisions.map(d=><li key={d}>{d}</li>)}</ul></section></div><section><h3>Engineering considerations</h3><div className="challenge-grid">{project.challenges.map(([title,body])=><div key={title}><h4>{title}</h4><p>{body}</p></div>)}</div></section><p className="case-note">{project.note} Visuals on this page are workflow illustrations, not screenshots of a live application.</p><div className="case-links">{project.github&&<ExternalLink className="button primary" href={project.github}><Github size={17}/>Source code</ExternalLink>}{project.demo&&<ExternalLink className="button secondary" href={project.demo}>Live application</ExternalLink>}<EmailLink className="button secondary" subject={`${project.title} — project walkthrough`}>Discuss this project</EmailLink></div></div></div></dialog>;
}
