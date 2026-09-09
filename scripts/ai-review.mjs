// © 2026 Jared Cluff. All rights reserved. Manually approved, exact-SHA review.
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {collect,github,comment} from './github.mjs';
import {inspect} from './inspect.mjs';
import {requestBody,parseReview,renderReview,callReviewer} from './review.mjs';
async function main(){
  if(process.env.GITHUB_REF!=='refs/heads/main')throw new Error('AI review runs only from protected main.');
  const repo=process.env.GITHUB_REPOSITORY,number=process.env.PR_NUMBER,sha=process.env.APPROVED_SHA;
  if(!/^[a-f0-9]{40}$/.test(sha||''))throw new Error('A full approved head SHA is required.');
  const {pr,files}=await collect(repo,number);
  if(pr.head.sha!==sha || pr.draft)throw new Error('Head SHA changed or PR is a draft; obtain new instructor approval.');
  const packet=inspect(files);if(packet.errors.length)throw new Error('Packet preflight did not pass.');
  if(packet.manifest.ai_review_consent!==true)throw new Error('Student has not consented to AI processing; use human review.');
  const model=process.env.AI_REVIEW_MODEL;
  const instructions=await readFile(new URL('../reviewer/instructions.md',import.meta.url),'utf8');
  const rubric=await readFile(new URL('../RUBRIC.md',import.meta.url),'utf8');
  const promptSha=createHash('sha256').update(instructions+rubric).digest('hex').slice(0,16);
  const response=await callReviewer(requestBody({model,instructions,rubric,packet}),process.env.OPENAI_API_KEY);
  const data=parseReview(response,packet);
  const latest=await github(`repos/${repo}/pulls/${number}`);
  if(latest.head.sha!==sha || latest.state!=='open')throw new Error('Submission changed during AI review; no feedback posted.');
  await comment(repo,number,renderReview(data,{sha,model,promptSha,usage:response.usage}));
  console.log('Posted advisory AI feedback for the approved commit; no grades assigned.');
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
