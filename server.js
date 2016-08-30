import fs from 'fs';
import path from 'path';
import express from 'express';
import compress from 'compression';
import getPullRequests from 'github-pull-requests';

const port = process.env.PORT || 3000;
const cachedDataDir = path.join(__dirname, process.env.CACHED_DATA_DIR);
const githubLogin = process.env.GITHUB_LOGIN;
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const githubRequestCacheTimeout = process.env.GITHUB_REQUEST_CACHE_TIMEOUT;

const isTimeStale = (timestamp) => (
  new Date() - new Date(timestamp) > githubRequestCacheTimeout
);

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
  const filepath = path.join(cachedDataDir, 'merged_pull_requests.json');
  fs.readFile(filepath, (err, data) => {
    if (!err) {
      const cachedData = JSON.parse(data);
      if (!isTimeStale(cachedData.timestamp)) {
        res.json(cachedData.pullRequests);
        return res.end();
      }
    }
    getPullRequests(githubLogin, 'merged', {
      clientId: githubClientId,
      clientSecret: githubClientSecret
    }).then(pullRequests => {
      fs.mkdir(cachedDataDir, () => {
        fs.writeFile(filepath, JSON.stringify({
          pullRequests,
          timestamp: new Date().toISOString()
        }, null, 2));
      });

      /* NOTE: the write operations above will complete after the
       * response is sent and aren't guaranteed not to fail.
       */
      res.json(pullRequests);
      res.end();
    }).catch(err => {
      res.json(err);
      res.end();
    });
  });
});

app.listen(port, () => {
  console.log('App listening on port ' + port);
});
