# MemeServe Chatbot
This project is inspired from [MemeServe](https://github.com/janjanmedinaaa/MemeServe). MemeServe Chatbot utilizes the MemeServe Templating Algorithm and serves it directly to the Messenger Platform.

## Usage
1. Visit the [Messenger Chatbot](m.me/memeserve)
2. Send an Image. It can be either a local image or GIF.
3. Send the Description
4. Wait for Chatbot to process the Image. Delays may vary since it might processing a lot of images at the moment.

## How it works
- The **Messenger Webhook** is deployed on [Vercel](https://vercel.com)
- The **Webhook** stores the Image or Description received on [JSONBox](https://jsonbox.io/). Each user has their own unique `JSONBox` Storage. The Storage only stores 1 Pair of Image and Description.
- When the Image and Description are already given, it triggers a Dispatch Event to [MemeServe Github Action](https://github.com/janjanmedinaaa/memeserve-action) to run the Image Processing
- The **Github Action** handles the Image Processing so that the `Vercel` Link doesn't Timeout. It receives the Image and Description and creates the Templated Image.
- After creating the Image, the Github Action will upload it the [File.IO](https://www.file.io/) for Messenger Retrieval. `File.IO` returns a One-Time Download URL.
- The **Github Action** sends the Image to the `Messenger Platform`.
- `Messenger` downloads the Image from `File.IO` Download URL and sends it the user. While `File.IO` automatically deletes it for security purposes.

## Libraries and Platforms
- [Vercel](https://vercel.com) (Previously known as `Now`)
- [JSONBox](https://jsonbox.io/)
- [File.IO](https://www.file.io/)
- [Github Actions](https://github.com/features/actions)
- [MemeServe](https://github.com/janjanmedinaaa/MemeServe)