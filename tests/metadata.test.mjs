import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveConfig } from 'vite';

test('production origin produces canonical metadata and a real sitemap declaration',async()=>{
  const previous=process.env.VITE_SITE_URL;
  process.env.VITE_SITE_URL='https://portfolio.test';
  try{
    const config=await resolveConfig({},'build');
    const plugin=config.plugins.find(p=>p.name==='portfolio-production-metadata');
    const result=plugin.transformIndexHtml('<meta property="og:image" content="/og-image.png">');
    assert.ok(result.html.includes('https://portfolio.test/og-image.png'));
    assert.ok(result.tags.some(t=>t.attrs.rel==='canonical'&&t.attrs.href==='https://portfolio.test/'));
    const emitted=[];plugin.generateBundle.call({emitFile:file=>emitted.push(file)});
    assert.ok(emitted.find(f=>f.fileName==='sitemap.xml').source.includes('<loc>https://portfolio.test/</loc>'));
    assert.ok(emitted.find(f=>f.fileName==='robots.txt').source.includes('Sitemap: https://portfolio.test/sitemap.xml'));
  }finally{if(previous===undefined)delete process.env.VITE_SITE_URL;else process.env.VITE_SITE_URL=previous;}
});
