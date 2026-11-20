import { Mail } from 'lucide-react';
import { Github, Linkedin } from '../components/BrandIcons';
import { EmailLink, ExternalLink, ResumeLink } from '../components/Shared';
import { profile } from '../data/portfolio';

export default function Contact() {
  return <section id="contact" className="contact-section"><div className="shell contact-layout"><div className="contact-copy"><span className="eyebrow">YOUR NEXT IDEA STARTS HERE</span><h2 data-words>Let’s make<br/>something<br/><span>extraordinary.</span></h2><p data-lines>A project, a collaboration, or your next engineer.<br/>It starts with a conversation.</p><EmailLink className="contact-email" aria-label={`Compose an email to ${profile.email} in Gmail`}><Mail size={20}/><span>{profile.email}</span></EmailLink><div className="contact-links flex flex-wrap gap-3"><ExternalLink href={profile.github} className="contact-option"><Github/>GitHub</ExternalLink><ExternalLink href={profile.linkedin} className="contact-option"><Linkedin/>LinkedIn</ExternalLink><ResumeLink className="contact-option"/></div></div><div className="contact-scene-space" aria-hidden="true"/></div></section>;
}
