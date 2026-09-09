// © 2026 Jared Cluff. All rights reserved. Trusted data-only packet validation.
import path from 'node:path';
export const packetPattern=/^cohorts\/[a-z0-9][a-z0-9-]{1,39}\/[a-z0-9][a-z0-9-]{1,39}\/session-(?:0[1-9]|1[0-2])\//;
const imageExtensions=new Set(['.png','.jpg','.jpeg']);
const extensions=new Set(['.md','.txt','.json','.csv','.patch',...imageExtensions]);
export function privacyIssue(text){
  if(/BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|\bAKIA[A-Z0-9]{16}\b|\b(?:ghp_|github_pat_|sk-)[A-Za-z0-9_-]{16,}|Authorization\s*:\s*(?:Bearer|sso-key)\s+\S+|(?:password|api[_-]?key|secret)\s*[=:]\s*["']?[A-Za-z0-9_\-/+]{12,}/i.test(text))return 'Possible credential; inspect privately, do not repeat it in comments.';
  if(/\/Users\/[^\s/]+|[A-Z]:\\Users\\[^\s\\]+/i.test(text))return 'Personal absolute path; replace with a repository-relative path.';
  const emails=text.match(/\b[A-Z0-9._%+-]{1,64}@[A-Z0-9.-]{1,253}\.[A-Z]{2,63}\b/gi)||[];
  if(emails.some(email=>!/(?:@example\.(?:com|org|net)|\.(?:example|test|invalid))$/i.test(email)))return 'Possible personal email address; use fictional course data.';
  return null;
}
export function inspect(files){
  const errors=[];let root;let bytes=0;const seen=new Set();
  if(!files.length || files.length>30)return {errors:['A packet must contain 1–30 changed files.']};
  for(const file of files){
    const match=file.path.match(packetPattern);
    if(!match || !/^[a-zA-Z0-9_./-]+$/.test(file.path) || file.path.split('/').some(p=>p==='..'||p==='.'||!p)) {errors.push('Unsupported file path; only one cohorts/.../session-NN packet is allowed.');continue;}
    if(root && root!==match[0])errors.push('One session packet per PR.');root ||= match[0];
    if(seen.has(file.path))errors.push('Duplicate path.');seen.add(file.path);
    if(file.status!=='added')errors.push('Only new packet files are accepted; do not modify accepted work or infrastructure.');
    if(file.mode!=='100644' && file.mode!=='100755')errors.push('Symlinks and submodules are not accepted.');
    const ext=path.posix.extname(file.path).toLowerCase();
    if(!extensions.has(ext))errors.push('Unsupported file type; submit text evidence, a patch or a PNG/JPEG.');
    const size=file.content.length;bytes+=size;
    if(size>(imageExtensions.has(ext)?2*1024*1024:150*1024)){errors.push('File exceeds the size limit.');continue;}
    if(imageExtensions.has(ext)){
      const b=file.content;
      if(ext==='.png'?!b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):!(b[0]===255&&b[1]===216&&b[2]===255))errors.push('Image signature does not match its extension.');
    }else{
      const text=file.content.toString('utf8');
      if(text.includes('\0') || text.includes('\ufffd'))errors.push('Text evidence must be valid UTF-8 without binary data.');
      const issue=privacyIssue(text);if(issue)errors.push(issue);
      if(ext==='.json'){try{JSON.parse(text);}catch{errors.push('Invalid JSON evidence.');}}
    }
  }
  if(bytes>6*1024*1024)errors.push('Packet exceeds 6 MB.');
  if(errors.length)return {errors:[...new Set(errors)]};
  const get=name=>files.find(f=>f.path===root+name)?.content.toString('utf8');
  let manifest;
  try{manifest=JSON.parse(get('submission.json'));}catch{errors.push('Missing or invalid submission.json.');}
  if(manifest){
    if(manifest.schema_version!==1 || typeof manifest.ai_review_consent!=='boolean' || manifest.public_safe!==true)errors.push('Manifest needs schema_version 1, explicit AI consent boolean, and public_safe true after inspection.');
    if(!/^[a-f0-9]{40}$/.test(manifest.course_commit||''))errors.push('Supply the exact 40-character course commit SHA.');
    if(root!==`cohorts/${manifest.cohort}/${manifest.alias}/session-${manifest.session}/`)errors.push('Manifest identifiers do not match the packet path.');
  }
  for(const [name,headings] of Object.entries({
    'submission.md':['Outcome','Expected and observed','Evidence','Environment','Verification','Limits','Reflection'],
    'ai-use.md':['Assistance','Verification','Corrections','Sources and collaboration']
  })){
    const text=get(name)||'';
    if(!text)errors.push(`Missing ${name}.`);
    if(/\bREPLACE\b|\bTODO\b|REPLACE_WITH_/i.test(text))errors.push(`Unfilled placeholders in ${name}.`);
    for(const heading of headings){
      const section=text.match(new RegExp('^## '+heading+'\\s*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))','m'));
      if(!section || section[1].trim().length<15)errors.push(`${name}: missing or very short ${heading} section.`);
    }
  }
  const evidence=files.filter(f=>f.path.startsWith(root+'evidence/'));
  if(!evidence.length)errors.push('Include at least one supporting evidence file.');
  for(const file of files.filter(f=>f.path.endsWith('.md'))){
    for(const m of file.content.toString('utf8').matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)){
      const target=m[1].split('#')[0];if(!target || /^https?:\/\//i.test(target))continue;
      const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(file.path),target));
      if(!resolved.startsWith(root) || !seen.has(resolved))errors.push('A relative evidence link is missing or leaves the packet.');
    }
  }
  return {errors:[...new Set(errors)],root,manifest,files:files.map(f=>({path:f.path,text:imageExtensions.has(path.posix.extname(f.path).toLowerCase())?null:f.content.toString('utf8')}))};
}
