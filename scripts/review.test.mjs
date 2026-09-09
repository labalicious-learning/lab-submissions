import test from 'node:test';
import assert from 'node:assert/strict';
import {inspect} from './inspect.mjs';
import {sample} from './inspect.test.mjs';
import {requestBody,parseReview,renderReview,callReviewer} from './review.mjs';
const packet=inspect(sample());
const observation={path:packet.files[3].path,quote:'Synthetic HTTP 403 response',feedback:'Clearly identifies the synthetic response as supplied evidence.'};
const result={strength:observation,items:[],question:{...observation,feedback:'What would independently reproduce this response?'}};
const response=data=>({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(data)}]}]});
test('provider request is bounded, no tools, no storage',()=>{const body=requestBody({model:'approved-model',instructions:'Trusted',rubric:'Rubric',packet});assert.equal(body.store,false);assert.equal(body.tools,undefined);assert.equal(body.max_output_tokens,2200);assert.equal(body.input.length,1);assert.ok(body.text.format.strict);});
test('invalid model and oversized input fail closed',()=>{assert.throws(()=>requestBody({model:'',packet}));assert.throws(()=>requestBody({model:'approved',packet:{files:[{path:'x',text:'x'.repeat(61000)}]}}));});
test('valid feedback retains evidence citation and explicit limits',()=>{const data=parseReview(response(result),packet);const text=renderReview(data,{sha:'a'.repeat(40),model:'approved',promptSha:'1234'});assert.ok(text.includes('No code or tests were executed'));assert.ok(text.includes('Synthetic HTTP 403'));});
test('refusal, incomplete response, invented citation and too many comments rejected',()=>{assert.throws(()=>parseReview({status:'incomplete'},packet));assert.throws(()=>parseReview({status:'completed',output:[{content:[{type:'refusal'}]}]},packet));assert.throws(()=>parseReview(response({...result,strength:{...observation,quote:'This does not exist'}}),packet));assert.throws(()=>parseReview(response({...result,items:Array(4).fill(observation)}),packet));});
test('mock provider transport verifies endpoint; error bodies never returned',async()=>{
 const out=await callReviewer({model:'test'},'fake-test-key',async(url,options)=>{assert.equal(url,'https://api.openai.com/v1/responses');assert.equal(options.headers.Authorization,'Bearer fake-test-key');return {ok:true,json:async()=>response(result)};});assert.equal(out.status,'completed');
 await assert.rejects(()=>callReviewer({},'fake',async()=>({ok:false,status:429})),/429/);
 await assert.rejects(()=>callReviewer({},''),/not configured/);
});
test('feedback HTML and mentions are escaped',()=>{const text=renderReview({...result,strength:{...observation,feedback:'<script> @someone https://untrusted.invalid'}},{sha:'a',model:'test',promptSha:'x'});assert.ok(!text.includes('<script>'));assert.ok(!text.includes('@someone'));assert.ok(!text.includes('https://untrusted'));});
