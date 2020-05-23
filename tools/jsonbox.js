const fetch = require('node-fetch');

const BASE_URL = 'https://jsonbox.io';
const JSONBOX_KEY= 'memeservechatbotstorage';

const getUserUrl = (user) => `${BASE_URL}/${JSONBOX_KEY}${user}`

const get = (user) => {
  return new Promise(resolve => {
    fetch(`${getUserUrl(user)}`)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(() => resolve([]))
  })
}

const save = (entry) => {
  return new Promise (resolve => {
    fetch(getUserUrl(entry.user), {
      method: 'post',
      body: JSON.stringify(entry),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(result => resolve(result))
    .catch(() => resolve([]))
  })
}

const clear = (user) => {
  return new Promise(resolve => {
    fetch(`${getUserUrl(user)}?q=user:${user}`, {
      method: 'delete'
    })
    .then(res => res.json())
    .then(result => resolve(result))
    .catch(() => resolve([]))
  })
}

module.exports = {
  get,
  save,
  clear
}