import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { projects } from '../src/data/portfolio.js';

test('every page section, navigation target, project, and case study renders',async()=>{
  globalThis.window={location:{hash:''},matchMedia:()=>({matches:false})};
  const server=await createServer({server:{middlewareMode:true},appType:'custom'});
  try{
    const {default:App}=await server.ssrLoadModule('/src/App.jsx');
    const html=renderToString(createElement(App));
    for(const id of ['home','about','skills','projects','journey','contact']){assert.ok(html.includes(`id="${id}"`),id);assert.ok(html.includes(`href="#${id}"`),id);}
    assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
    assert.ok(html.includes('8.20'));assert.ok(html.includes('Electronics and Communication Engineering'));
    assert.ok(html.includes('Narayana'));assert.ok(html.includes('Sri Vignana Vardhani'));
    assert.ok(html.includes('download="Ravi-Goud-Resume.pdf"'));
    assert.ok(html.includes('https://mail.google.com/mail/?view=cm'));assert.ok(!html.includes('mailto:'));assert.ok(!html.includes('>20%<'));
    assert.ok(!html.includes('motion-control'));
    assert.ok(html.includes('THE TECHNOLOGY UNIVERSE'));
    assert.ok(html.includes('aria-label="Ravi Goud"'));
    for(const project of projects)assert.ok(html.includes(`href="#project/${project.id}"`));
    const {default:CaseStudy}=await server.ssrLoadModule('/src/pages/CaseStudy.jsx');
    for(const project of projects){const rendered=renderToString(createElement(CaseStudy,{project,onClose(){}}));assert.ok(rendered.includes('System architecture'));assert.ok(rendered.includes('case-title'));}
  }finally{await server.close();delete globalThis.window;}
});
