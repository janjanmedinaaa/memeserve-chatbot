const message = (id, text) => {
  return {
    recipient: { id },
    message: { text }
  }
}

const attachment = (id, url) => {
  return {
    recipient: { id },
    message: {
      attachment: {
        type: 'image', 
        payload: {
          url, 
          is_reusable: true
        }
      }
    }
  }
}

const action = (id, action) => {
  return {
    recipient: { id },
    sender_action: action
  }
}

const url = (id, text, url) => {
  return {
    recipient: { id },
    message: {
      attachment: {
        type: 'template', 
        payload: {
          template_type: 'button',
          text,
          buttons: [
            {
              type: 'web_url',
              url,
              title: 'Download Image',
              webview_height_ratio: 'full'
            }
          ]
        }
      }
    }
  } 
}

module.exports = {
  message,
  attachment,
  action,
  url
}