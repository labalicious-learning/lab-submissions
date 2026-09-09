// © 2026 Jared Cluff. All rights reserved. Fetch bounded data at immutable SHAs.
export async function github(endpoint,method='GET',body){
  const r=await fetch('https://api.github.com/'+endpoint,{method,headers:{Authorization:`Bearer ${process.env.GH_TOKEN}`,'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(30000)});
  if(!r.ok)throw new Error(`GitHub request failed (${r.status}); no response body logged.`);
  const raw=await r.text();if(raw.length>12*1024*1024)throw new Error('GitHub response exceeded limit.');return raw?JSON.parse(raw):null;
}
export async function collect(repo,number){
  if(!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)||!/^\d+$/.test(String(number)))throw new Error('Invalid repository or PR number.');
  const pr=await github(`repos/${repo}/pulls/${number}`);
  if(pr.base.ref!=='main' || pr.state!=='open' || pr.changed_files>30)throw new Error('Expected an open main-branch PR with at most 30 files.');
  const changed=await github(`repos/${repo}/pulls/${number}/files?per_page=100`);
  if(changed.length!==pr.changed_files)throw new Error('Incomplete or changing file list; retry.');
  const headRepo=pr.head.repo?.full_name;if(!headRepo)throw new Error('Source repository unavailable.');
  const tree=await github(`repos/${headRepo}/git/trees/${pr.head.sha}?recursive=1`);
  if(tree.truncated)throw new Error('Source tree too large.');
  const files=[];let total=0;
  for(const change of changed){
    const entry=tree.tree.find(e=>e.path===change.filename);
    if(change.status!=='added' || !entry || entry.type!=='blob' || entry.mode!=='100644' || entry.size>2*1024*1024)throw new Error('Only new regular bounded packet files may be submitted.');
    total+=entry.size;if(total>6*1024*1024)throw new Error('Packet exceeds size limit.');
    const blob=await github(`repos/${headRepo}/git/blobs/${entry.sha}`);
    if(blob.encoding!=='base64')throw new Error('Unexpected blob encoding.');
    files.push({path:entry.path,mode:entry.mode,status:change.status,content:Buffer.from(blob.content,'base64')});
  }
  const latest=await github(`repos/${repo}/pulls/${number}`);
  if(latest.head.sha!==pr.head.sha)throw new Error('Submission changed during collection; rerun.');
  return {pr,files};
}
export async function comment(repo,number,body){return github(`repos/${repo}/issues/${number}/comments`,'POST',{body});}
