const fetch = require('node-fetch');
const format = require('./format');
require('dotenv').config();

const BASE_URL = 'https://graph.facebook.com/v7.0/me/messages';
const ACCESS_TOKEN = process.env.MESSENGER_ACCESS_TOKEN;

var sendMessageUrl = `${BASE_URL}?access_token=${ACCESS_TOKEN}`;

const send = ({ user, type, value }) => {
  var body = JSON.stringify((type == 'text') ? 
                format.message(user, value) :
                format.attachment(user, value));

  return new Promise (resolve => {
    fetch(sendMessageUrl, {
      method: 'post',
      body,
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(result => {
      resolve(result)
      console.log('Send Message:', result)
    })
  })
}

const action = (user, action) => {
  return new Promise (resolve => {
    fetch(sendMessageUrl, {
      method: 'post',
      body: JSON.stringify(format.action(user, action)),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(result => {
      resolve(result)
      console.log('Send Action:', result)
    })
  })
}

const url = (user, message, url) => {
  return new Promise (resolve => {
    fetch(sendMessageUrl, {
      method: 'post',
      body: JSON.stringify(format.url(user, message, url)),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(result => {
      resolve(result)
      console.log('Send URL:', result)
    })
  })
}

module.exports = {
  send,
  action,
  url
}