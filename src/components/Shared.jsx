import { Component } from 'react';
import { Download, Mail } from 'lucide-react';
import { Github, Linkedin } from './BrandIcons';
import { profile } from '../data/portfolio';
import { gmailComposeUrl } from '../data/contact';

export function ExternalLink({ href, children, ...props }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
}
export function EmailLink({ subject, children, ...props }) {
  return <ExternalLink href={gmailComposeUrl(subject)} {...props}>{children}</ExternalLink>;
}
export function Socials() {
  return <div className="socials"><ExternalLink href={profile.github} aria-label="Ravi Goud on GitHub"><Github size={19} /></ExternalLink><ExternalLink href={profile.linkedin} aria-label="Ravi Goud on LinkedIn"><Linkedin size={19} /></ExternalLink><EmailLink aria-label="Email Ravi Goud in Gmail"><Mail size={19} /></EmailLink></div>;
}
export function ResumeLink({ className = 'text-link' }) {
  return profile.resume ? <a className={className} href={profile.resume} download="Ravi-Goud-Resume.pdf"><Download size={16} /> Download Resume</a> : null;
}
export function SectionHeading({ label, children, description }) {
  return <div className="section-heading"><span className="eyebrow">{label}</span><h2 data-words>{children}</h2>{description && <p>{description}</p>}</div>;
}
export class VisualBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? (this.props.fallback ?? <div role="status">The visual could not load.</div>) : this.props.children; }
}
