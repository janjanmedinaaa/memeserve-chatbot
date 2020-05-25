const fetch = require('node-fetch');

const BASE_URL = 'https://jsonbox.io';
const JSONBOX_KEY= 'memeservechatbotstorage';

const getUserUrl = (user) => `${BASE_URL}/${JSONBOX_KEY}${user}`

const get = (user) => {
  return new Promise(resolve => {
    fetch(`${getUserUrl(user)}`)
      .then(res => res.json())
      .then(result => {
        resolve(result)
        console.log('Getting JSONBox', user)
      })
      .catch(() => resolve([]));
  });
}

const save = (entry) => {
  return new Promise (resolve => {
    fetch(getUserUrl(entry.user), {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry)
    })
    .then(res => res.json())
    .then(result => {
      resolve(result)
      console.log('Saving JSONBox', entry)
    })
    .catch(() => resolve([]));
  });
}

const clear = (user) => {
  return new Promise(resolve => {
    fetch(`${getUserUrl(user)}?q=user:${user}`, {
      method: 'delete'
    })
    .then(res => res.json())
    .then(result => {
      resolve(result)
      console.log('Clear JSONBox', user)
    })
    .catch(() => resolve([]));
  });
}

module.exports = {
  get,
  save,
  clear
}