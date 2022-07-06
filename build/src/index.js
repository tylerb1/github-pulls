import fetch from "node-fetch";
import cache from "node-cache";
const pullsByRepo = {};
const prCache = new cache();
const githubToken = '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'; // Enter personal access token here
const reposResponse = await fetch('https://api.github.com/orgs/ramda/repos', {
    headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${githubToken}`,
    }
});
const repos = await reposResponse.json();
for (const repo of repos) {
    let nResults = 0, pageNumber = 1;
    pullsByRepo[repo.name] = [];
    while (nResults < 100) {
        const pullsResponse = await fetch(`https://api.github.com/repos/ramda/${repo.name}/pulls?state=all&per_page=100&page=${pageNumber}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Bearer ${githubToken}`,
            }
        });
        const pulls = await pullsResponse.json();
        pullsByRepo[repo.name] = pullsByRepo[repo.name].concat(pulls);
        nResults = pulls.length;
        pageNumber += 1;
    }
}
console.log(pullsByRepo);
prCache.set(`pulls`, pullsByRepo, 10000);
//# sourceMappingURL=index.js.map