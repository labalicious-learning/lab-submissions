import test from 'node:test';
import assert from 'node:assert/strict';
import {collect} from './github.mjs';
function mock({mode='100644',stale=false,truncated=false,status='added'}={}){
 let calls=0;
 return async endpoint=>{
  if(endpoint.endsWith('/pulls/1'))return {base:{ref:'main'},state:'open',changed_files:1,head:{repo:{full_name:'student/fork'},sha:++calls>1&&stale?'b'.repeat(40):'a'.repeat(40)}};
  if(endpoint.endsWith('/files?per_page=100'))return [{filename:'cohorts/demo/student/session-01/submission.md',status}];
  if(endpoint.includes('/git/trees/')){assert.ok(endpoint.includes('student/fork/git/trees/'+'a'.repeat(40)));return {truncated,tree:[{path:'cohorts/demo/student/session-01/submission.md',type:'blob',mode,size:9,sha:'c'.repeat(40)}]};}
  if(endpoint.includes('/git/blobs/'))return {encoding:'base64',content:Buffer.from('safe text').toString('base64')};
  throw new Error('Unexpected request');
 };
}
test('collects fork blobs at immutable head SHA without checkout',async()=>{const r=await collect('course/submissions',1,mock());assert.equal(r.files[0].content.toString(),'safe text');});
test('stale head, truncated tree, symlinks and modifications fail closed',async()=>{for(const options of [{stale:true},{truncated:true},{mode:'120000'},{status:'modified'}])await assert.rejects(()=>collect('course/submissions',1,mock(options)));});
test('PR number and repository names cannot inject endpoints',async()=>{await assert.rejects(()=>collect('course/submissions','1/../../secrets',mock()));await assert.rejects(()=>collect('course/submissions/../x',1,mock()));});
