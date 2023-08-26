const functions = require("firebase-functions");
const line = require("@line/bot-sdk");
const express = require('express');
const { event } = require("firebase-functions/v1/analytics");
const app = express();
const config = {
  channelAccessToken: functions.config().channel.accesstoken,
  channelSecret: functions.config().channel.secret,
};

const client = new line.Client(config);

/**
 * Hello World関数
 */
async function checkMes(event){
  switch(event.message.text){
    case ">>表示":
      const text = getList();
      await client.replyMessage(event.replyToken, { type: "text", text: text });
      break;
    default:
      if(event.message.text.indexOf('追加:') !== -1){
        try{
          const out=postTask(event);
          await client.replyMessage(event.replyToken, [{ type: "text", text: "追加に成功しました" },{type:"text",text:"追加内容:"+out}]);
        }
        catch{
          client.replyMessage(event.replyToken, { type: "text", text: "追加に失敗しました" });
          console.error();
        }    
    }else if(event.message.text.indexOf('完了:') !== -1){
      try{
        const out=staToggle(event);
        await client.replyMessage(event.replyToken, [{ type: "text", text: "変更に成功しました" },{type:"text",text:"内容:"+out.title+"\n"+out.id+"\n"+out.done}]);
      }
      catch{
        client.replyMessage(event.replyToken, { type: "text", text: "変更に失敗しました" });
        console.error();
      }    
    }
      break;
  }

}

exports.helloWorld = functions.https.onRequest(async (req, res) => {
  try {
    // リクエストボディからイベントを取得
    const event = req.body.events[0];
    
    // リクエストボディの正しいフォーマットを確認
    if (!event || !event.replyToken || !event.message || !event.message.text) {
      console.error("Invalid request body format.");
      res.status(400).send("Invalid request body format.");
      return;
    }
    // Hello Worldを送信する。
    //  await client.replyMessage(event.replyToken, {
    //    type: "text",
    //    text: event.message.text,
    //  });
    await checkMes(event);

    res.status(200).send();
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Internal Server Error");
  }
});

function getList(){
    // app.get('/get',async(req)=>{
    //     const text="~~Todo-List~~"   
    //     for(const n=0; n<req.length;n++){
    //         text+="\n"+req[n].title
    //     }
    // })
  const tasks=[
      {
        "title": "クリーニングを取りに行く",
        "id": 0,
        "done": false,
      },
      {
          "title": "クリーニングを取りに行く",
          "id": 0,
          "done": false,
        },
      {
          "title": "クリーニングを取りに行く",
          "id": 0,
          "done": false,
      },
      {
          "title": "クリーニングを取りに行く",
          "id": 0,
          "done": false,
      },
  ];
  let text="~~Todo-List~~";
      
  for(var n=0; n<tasks.length;n++){
      text+="\n"+n+"."+tasks[n].title;
  };
  return text;
}

function postTask(event){
  const str = event.message.text.split(":")
  app.post("/post",async(res)=>{
    res.send({
      "title": str[1],
    })
  })
  return str[1]
}

function staToggle(event){
  const id_key=undefined;
  app.get("/",(req)=>{
    for(const n=0;n<req.length;n++){
      if(event.message.text.split(":")[1]===req[n].title){
        id_key=req[n].id
        break;
      }
    }  
  },
app.post("/"+id_key+"/done",(res)=>{
  res.send({
    "id":id_key
  })
})
)}