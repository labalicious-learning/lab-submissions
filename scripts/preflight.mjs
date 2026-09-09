// © 2026 Jared Cluff. All rights reserved. Run trusted copy before first upload.
import {readdir,readFile,lstat} from 'node:fs/promises';
import path from 'node:path';
import {inspect} from './inspect.mjs';
async function main(){
  const dir=path.resolve(process.argv[2]||'scratch/missing-packet');
  const m=JSON.parse(await readFile(path.join(dir,'submission.json'),'utf8'));
  const root=`cohorts/${m.cohort}/${m.alias}/session-${m.session}/`;
  const files=[];
  async function walk(folder,relative=''){
    for(const entry of await readdir(folder,{withFileTypes:true})){
      const full=path.join(folder,entry.name),rel=relative+entry.name;
      const s=await lstat(full);if(s.isSymbolicLink())throw new Error('Symlinks are not accepted.');
      if(entry.isDirectory())await walk(full,rel+'/');
      else{if(s.size>2*1024*1024)throw new Error('File too large.');files.push({path:root+rel,content:await readFile(full),mode:'100644',status:'added'});}
      if(files.length>30)throw new Error('Too many packet files.');
    }
  }
  await walk(dir);const result=inspect(files);
  if(result.errors.length){console.error(result.errors.join('\n'));process.exitCode=1;}
  else console.log('Preflight passed. This is not a privacy guarantee: manually inspect images, metadata, identity and permission before publishing.');
}
main().catch(()=>{console.error('Cannot inspect packet. Check the folder, manifest, file sizes and symlinks privately. No file contents were printed.');process.exitCode=1;});
