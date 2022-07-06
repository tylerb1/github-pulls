import fetch from "node-fetch";
import cache from "node-cache";

const pullsByRepo: { [key: string]: any } = {};
const prCache = new cache();
const githubToken = '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';
let nPulls = 0;

const reposResponse = await fetch('https://api.github.com/orgs/ramda/repos', { 
  headers: {
    'Accept' : 'application/vnd.github.v3+json',
    'Authorization': `Bearer ${githubToken}`,
  }})
const repos = await reposResponse.json();

for (const repo of repos) {
  const pullsResponse = await fetch(`https://api.github.com/repos/ramda/${repo.name}/pulls`, { 
    headers: {
      'Accept' : 'application/vnd.github.v3+json',
      'Authorization': `Bearer ${githubToken}`,
    }});
  const pulls = await pullsResponse.json();
  nPulls += pulls.length;
  pullsByRepo[repo.name] = pulls;
}

const success = prCache.set(`prs`, pullsByRepo, 10000);
const prs = prCache.get(`prs`);
console.log(prs);
console.log(nPulls);