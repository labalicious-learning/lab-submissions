import test from 'node:test';
import assert from 'node:assert/strict';
import {inspect,privacyIssue} from './inspect.mjs';
export function sample(){
 const root='cohorts/demo/learner-042/session-06/';
 const file=(name,text)=>({path:root+name,mode:'100644',status:'added',content:Buffer.from(text)});
 const submission=['Outcome','Expected and observed','Evidence','Environment','Verification','Limits','Reflection'].map(h=>'## '+h+'\n\nSynthetic evidence for this section was inspected by the learner.\n').join('\n');
 const ai=['Assistance','Verification','Corrections','Sources and collaboration'].map(h=>'## '+h+'\n\nSupplied mock output was checked against the local evidence.\n').join('\n');
 return [file('submission.json',JSON.stringify({schema_version:1,cohort:'demo',alias:'learner-042',session:'06',course_commit:'a'.repeat(40),public_safe:true,ai_review_consent:false})),file('submission.md',submission),file('ai-use.md',ai),file('evidence/result.txt','Synthetic HTTP 403 response; no live service was contacted.')];
}
test('complete packet is accepted; no AI consent required',()=>assert.deepEqual(inspect(sample()).errors,[]));
test('missing section, evidence and unfilled placeholders fail',()=>{
 const files=sample();files[1].content=Buffer.from('## Outcome\nREPLACE');files.pop();const result=inspect(files);assert.ok(result.errors.some(e=>e.includes('Limits')));assert.ok(result.errors.some(e=>e.includes('placeholders')));assert.ok(result.errors.some(e=>e.includes('evidence file')));
});
test('infrastructure, traversal, multiple packets and modifications rejected',()=>{
 for(const mutate of [f=>f[0].path='.github/workflows/evil.yml',f=>f[0].path+='../../escape',f=>f[0].path=f[0].path.replace('learner-042','learner-043'),f=>f[0].status='modified']){const f=sample();mutate(f);assert.ok(inspect(f).errors.length);}
});
test('symlink, executable type, oversized file and invalid images fail',()=>{
 for(const mutate of [f=>f[0].mode='120000',f=>f[3].path=f[3].path.replace('.txt','.exe'),f=>f[3].content=Buffer.alloc(160*1024,65),f=>f[3].path=f[3].path.replace('.txt','.png')]){const f=sample();mutate(f);assert.ok(inspect(f).errors.length);}
});
test('common credentials, personal email and local path detected without echo',()=>{
 for(const text of ['sk-'+ 'a'.repeat(30),'person@real-company.com','C:\\Users\\Person\\notes.txt']){const message=privacyIssue(text);assert.ok(message);assert.ok(!message.includes(text));}
 assert.equal(privacyIssue('info@community-launch.example'),null);
});
test('relative links may not escape packet',()=>{const f=sample();f[1].content=Buffer.concat([f[1].content,Buffer.from('\n[other](../../other.md)')]);assert.ok(inspect(f).errors.some(e=>e.includes('relative evidence')));});
test('session zero, malformed manifest and unsafe declaration rejected',()=>{
 const f=sample();const m=JSON.parse(f[0].content);m.public_safe=false;m.course_commit='main';f[0].content=Buffer.from(JSON.stringify(m));assert.ok(inspect(f).errors.length);
 const zero=sample().map(f=>({...f,path:f.path.replace('session-06','session-00')}));assert.ok(inspect(zero).errors.length);
});
