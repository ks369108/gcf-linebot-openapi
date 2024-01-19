const functions = require("@google-cloud/functions-framework");
const line = require("@line/bot-sdk");
const OpenAI = require("openai");
const express = require("express");

// Configuration
const lineConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};
const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
};

const client = new line.Client(lineConfig); // Create LINE SDK client
const openai = new OpenAI(openaiConfig); // Create OpenAI client

// Create Express app
const app = express();

// Register a webhook handler with middleware
app.post("/", line.middleware(lineConfig), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// Event handler
async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
  let completion;
  let errorMsg;
  try {
    completion = await openai.completions.create({
      model: "gpt-3.5-turbo",
      prompt: "This story begins",
      messages: [{ role: "user", content: event.message.text }],
      max_tokens: 30,
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status); // e.g. 401
      console.error(error.message); // e.g. The authentication token you passed was invalid...
      console.error(error.code); // e.g. 'invalid_api_key'
      console.error(error.type); // e.g. 'invalid_request_error'
      errorMsg = error.status + ": " + error.message; // return error to linebot
    } else {
      console.error(error); // Non-API error
      errorMsg = error;
    }
  }

  // Create an echoing text message
  const echo = {
    type: "text",
    text: errorMsg ?? completion.choices[0].message,
  };

  // Use reply API
  return client.replyMessage(event.replyToken, echo);
}

functions.http("main", app);
