// © 2026 Jared Cluff. All rights reserved.
import {readFile,appendFile} from 'node:fs/promises';
import {github,collect,comment} from './github.mjs';
import {inspect} from './inspect.mjs';
async function main(){
  const event=JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH,'utf8'));
  const repo=process.env.GITHUB_REPOSITORY,number=event.pull_request.number,sha=event.pull_request.head.sha;
  let errors=[];let result;
  try{const packet=await collect(repo,number);if(packet.pr.head.sha!==sha)throw new Error('Stale event.');result=inspect(packet.files);errors=result.errors;}catch(e){errors=[e.message];}
  const latest=await github(`repos/${repo}/pulls/${number}`);if(latest.head.sha!==sha)throw new Error('Stale review; no status posted.');
  const state=errors.length?'failure':'success';
  await github(`repos/${repo}/statuses/${sha}`,'POST',{state,context:'packet-safety',description:errors.length?'Packet needs revision; inspect the safety feedback.':'Completeness passed; human privacy and evidence review required.'});
  const body=`## Packet preflight — ${state==='success'?'ready for human review':'revision needed'}\n\nCommit: \`${sha}\`\n\n`+(errors.length?errors.map(e=>'- '+e).join('\n'):'Required structure and basic safety checks passed. A peer should reproduce one claim; an instructor must verify privacy, evidence and understanding.')+'\n\nThis is not a grade or proof of correctness. No student code was executed. Images and metadata require human inspection. If sensitive content was uploaded, contact the instructor privately; do not quote it here. AI review is optional and instructor-triggered.';
  await comment(repo,number,body);
  if(process.env.GITHUB_STEP_SUMMARY)await appendFile(process.env.GITHUB_STEP_SUMMARY,body);
  if(errors.length)process.exitCode=1;
}
main().catch(()=>{console.error('Intake failed safely. Check GitHub availability and rerun; no student content was logged.');process.exitCode=1;});
