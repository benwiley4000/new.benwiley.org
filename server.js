import fs from 'fs';
import path from 'path';
import express from 'express';
import compress from 'compression';
import getPullRequests from 'github-pull-requests';

const port = process.env.PORT || 3000;
const githubLogin = process.env.GITHUB_LOGIN;
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

const html = fs.readFileSync(path.join(__dirname, 'index.html'), {
  encoding: 'utf8'
});

const app = express();
app.use(compress());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.header('Content-Type', 'text/html');
  res.end(html);
});

app.get('/github-merged-requests', (req, res) => {
  getPullRequests(githubLogin, 'merged', {
    clientId: githubClientId,
    clientSecret: githubClientSecret
  }).then(pullRequests => {
    res.json(pullRequests);
    res.end();
  }).catch(err => {
    res.json(err);
    res.end();
  });
});

app.listen(port, () => {
  console.log('App listening on port ' + port);
});
