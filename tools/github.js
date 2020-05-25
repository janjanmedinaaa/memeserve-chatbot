const fetch = require('node-fetch');
require('dotenv').config();

const BASE_URL = ' https://api.github.com/repos/janjanmedinaaa/memeserve-action/dispatches';
const DISPATCH_EVENT = 'memeserve-image-process';
const ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

const processImage = (data) => {
  return fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.everest-preview+json',
      'Authorization': `Bearer ${ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      event_type: DISPATCH_EVENT,
      client_payload: data
    })
  });
}

module.exports = {
  processImage
}