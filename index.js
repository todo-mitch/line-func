const functions = require("firebase-functions");
const line = require("@line/bot-sdk");

const config = {
  channelAccessToken: functions.config().linebot.access_token,
  channelSecret: functions.config().linebot.secret,
};

const client = new line.Client(config);

/**
 * Hello World関数
 */
exports.helloWorld = functions.https.onRequest(async (req, res) => {
  const events = req.body.events[0];
  // Hello Wolrdを送信する。
  await client.replyMessage(events.replyToken, {
    type: "text",
    text: "Hello World!!!",
  });
  res.status(200).send();
});