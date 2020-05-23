'use strict';

const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const jsonBox = require('./tools/jsonbox');
const messenger = require('./tools/messenger');
const Default = require('./tools/default');

const app = express().use(bodyParser.json());

const MEME_API = 'http://memeserve-dev.ap-southeast-1.elasticbeanstalk.com'

const filterEntry = (entry) => { 
  var user = entry.sender.id;
  var type = (entry.message.text) ? 'text' : entry.message.attachments[0].type
  var value = entry.message.text || entry.message.attachments[0].payload.url

  return { user, type, value }
}

// Receive messages from Messenger
app.post('/webhook', async(req, res) => {
  let body = req.body;

  console.log('Body Object', body.object);
  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(async function(entry) {

      // Only get the first Message received
      let messages = entry.messaging[0];
      let filter = filterEntry(messages);

      // messenger.action(filter.user, Default.SEEN);
      // messenger.action(filter.user, Default.TYPING);

      var jsonBoxData = await jsonBox.get(filter.user);
      console.log('Getting current JsonBox Data:', jsonBoxData);

      switch (jsonBoxData.length) {
        case 0:
          await jsonBox.save(filter);
          
          messenger.send({
            user: filter.user,
            type: 'text',
            value: (filter.type == 'image') ? Default.RECEIVED_IMAGE : Default.RECEIVED_MESSAGE
          });
          break;
        case 1:
          await jsonBox.clear(filter.user);
          if (jsonBoxData[0].type == filter.type) {
            jsonBox.save(filter);

            await messenger.send({
              user: filter.user,
              type: 'text',
              value: (filter.type == 'image') ? Default.DUPLICATE_IMAGE : Default.DUPLICATE_MESSAGE
            });
          } else {
            var memeDescription = (jsonBoxData[0].type == 'text') ? jsonBoxData[0].value : filter.value;
            var memeImage = (jsonBoxData[0].type == 'image') ? jsonBoxData[0].value : filter.value;

            await messenger.send({
              user: filter.user,
              type: 'text',
              value: Default.EDITING_MESSAGE
            });

            var memeUrl = `${MEME_API}?image=${memeImage}&message=${memeDescription}`

            // messenger.action(filter.user, Default.TYPING)
            var sendImage = await messenger.send({
              user: filter.user,
              value: memeUrl
            })

            if (sendImage.error) {
              await messenger.url(
                filter.user,
                Default.ERROR_SENDING_IMAGE,
                memeUrl
              );
            }
          }
          break;
        default:
          jsonBox.clear(filter.user);
      }

      return res.status(200).send('EVENT_RECEIVED');
    });
  } else {
    res.sendStatus(403);
  }
});

// Receive verification challenge from Facebook
app.get('/webhook', (req, res) => {
  let VERIFY_TOKEN = process.env.MESSENGER_VERIFY_TOKEN
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook Verified!');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
});

app.listen(process.env.PORT || 1337, () => {
  console.log('Messenger Chatbot Server Started');
});