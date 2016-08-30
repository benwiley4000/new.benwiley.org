import axios from 'axios';

const appDiv = document.getElementById('app');

axios.get('/github-merged-requests')
  .then(res => {
    const pullRequests = res.data;
    console.log(pullRequests);

    appDiv.innerHTML = '';

    const header = document.createElement('h1');
    header.innerText = 'BenWiley4000\'s Merged Pull Requests';
    appDiv.appendChild(header);

    pullRequests.forEach(pullRequest => {
      const div = document.createElement('div');

      const head = document.createElement('h2');
      head.innerText = pullRequest.base.repo.name;
      div.appendChild(head);

      const requestTitle = document.createElement('div');
      requestTitle.innerText = 'Request title ' + pullRequest.title;
      div.appendChild(requestTitle);

      const mergeDate = document.createElement('div');
      mergeDate.innerText = 'Merge date: ' + new Date(pullRequest.merged_at).toLocaleDateString();
      div.appendChild(mergeDate);

      appDiv.appendChild(div);
    });
  });
