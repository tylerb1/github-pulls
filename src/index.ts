import fetch from "node-fetch";
import cache from "node-cache";

const pullsByRepo: { [key: string]: any } = {};
const prCache = new cache();
const githubToken = ''; // Enter personal access token here

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
  pullsByRepo[repo.name] = pulls;
}

prCache.set(`pulls`, pullsByRepo, 10000);
const prs = prCache.get(`pulls`);