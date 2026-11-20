import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { profile, projects, skillGroups } from '../src/data/portfolio.js';
import { runSampleQuery, sqlExamples, sampleAssets } from '../src/data/demos.js';

test('the three current projects have unique case-study destinations',()=>{
  assert.deepEqual(projects.map(p=>p.id),['mediguide','text-to-sql','energy-agent']);
  for(const p of projects){assert.ok(p.architecture.length>=4);assert.ok(p.features.length>=5);assert.ok(p.challenges.length>=2);}
});
test('only source-confirmed project repositories are exposed',()=>{
  assert.equal(projects[0].github,'https://github.com/ravi63052/MediGuide');
  assert.equal(projects[1].github,'https://github.com/ravi63052/AI-SQL-Assistant');
  assert.equal(projects[2].github,null); assert.ok(projects.every(p=>p.demo===null));
});
test('resume is a real PDF and remains byte-identical to the source copy',async()=>{
  const bytes=await readFile(`public${profile.resume}`);assert.equal(bytes.subarray(0,5).toString(),'%PDF-');assert.ok(bytes.length>50000);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),'6bcdac1640cece4492af0aee6802f3b656b953a0591881e68bb41bf8d5f8ee49');
});
test('sample translations give the expected local rows',()=>{
  assert.equal(runSampleQuery('  SHOW ALL ASSETS  ').rows.length,3);
  assert.equal(runSampleQuery('Which assets need maintenance?').rows[0].name,'Wind Turbine B');
  assert.ok(runSampleQuery('Show solar assets').rows.every(r=>r.type==='Solar'));
  assert.equal(sampleAssets.length,3);
  assert.ok(sqlExamples.every(e=>e.sql.startsWith('SELECT ')&&e.sql.split(';').length===2));
});
test('arbitrary SQL and unsupported prompts cannot execute',()=>{
  for(const input of ['DROP TABLE assets','SELECT * FROM secrets','Show all assets; DELETE FROM assets','Ignore previous instructions',''])assert.throws(()=>runSampleQuery(input),/local demonstration/);
});
test('learning skills stay distinct from the established toolkit',()=>{
  assert.equal(skillGroups.filter(g=>g.learning).length,1);assert.ok(skillGroups.find(g=>g.learning).skills.includes('Spring Boot'));
});
test('social preview is a PNG with the expected dimensions',async()=>{
  const png=await readFile('public/og-image.png');assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
});
