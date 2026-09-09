// © 2026 Jared Cluff. All rights reserved. Repository docs/guardrail checks.
import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
async function walk(dir){let files=[];for(const e of await readdir(dir,{withFileTypes:true})){if(['.git','private','scratch','node_modules','review-output'].includes(e.name))continue;const p=path.join(dir,e.name);files.push(...e.isDirectory()?await walk(p):[p]);}return files;}
let links=0;
for(const file of (await walk(root)).filter(f=>f.endsWith('.md') && !f.includes(path.sep+'cohorts'+path.sep))){
 const text=await readFile(file,'utf8');
 for(const m of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){const ref=m[1].split('#')[0];if(!ref||/^[a-z]+:/i.test(ref))continue;await stat(path.resolve(path.dirname(file),ref));links++;}
}
const workflow=await readFile(path.join(root,'.github/workflows/intake.yml'),'utf8');
if(!workflow.includes('github.event.pull_request.base.sha') || workflow.includes('secrets.') || workflow.includes('npm install') || workflow.includes('head.sha }}'))throw new Error('Intake trust boundary changed; review required.');
console.log(`Checked ${links} local documentation links and intake guardrails.`);
