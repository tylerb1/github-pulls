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
  let pageNumber = 1;
  let pullsForRepo: any[] = [];
  let pulls: any[] = [];
  while (pulls.length === 100 || pageNumber === 1) {
    const pullsResponse = await fetch(
      `https://api.github.com/repos/ramda/${repo.name}/pulls?state=all&per_page=100&page=${pageNumber}`, 
      { 
        headers: {
          'Accept' : 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${githubToken}`,
        }
      });
    pulls = await pullsResponse.json();
    pullsForRepo.push(...pulls);
    pageNumber += 1;
  }
  pullsByRepo[repo.name] = pullsForRepo;
}

prCache.set(`pulls`, pullsByRepo, 10000);