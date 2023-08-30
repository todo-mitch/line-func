const functions = require("firebase-functions");
const line = require("@line/bot-sdk");
const axios=require("axios");
require("dotenv").config();
const url=process.env.URL;
const config = {
  channelAccessToken:process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_SEACRET,
};
const client = new line.Client(config);

exports.helloWorld = functions.https.onRequest(async (req, res) => {
  try {

    const event = req.body.events[0];
    console.log("req: "+req)
    await checkMes(event);
    
    res.status(200).end();
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Internal Server Error");
  }
});
async function checkMes(event){
  switch(event.message.text){
    case ">>表示":
      const str =await getList();
      client.replyMessage(event.replyToken, { type: "text", text: str });
      break;
    default:
      if(event.message.text.indexOf('追加:') !== -1){
          await postTask(event);
          await client.replyMessage(event.replyToken, [{type:"text",text:"追加内容: ["+event.message.text.split(":")[1]+"]"}]);
    }else if(event.message.text.indexOf('完了:') !== -1){
      try{
        await staToggle(event);
        await client.replyMessage(event.replyToken, [{ type: "text", text: "変更に成功しました" },{ type: "text", text: "完了: ["+event.message.text.split(":")[1]+"]" }]);
      }
      catch(e){
        client.replyMessage(event.replyToken, { type: "text", text: "変更に失敗しました" },{type:"text",text:e.message});
      }    
    }
      break;
  }

}


async function getList(){
      try{
        const response =await axios.get(url+"/tasks");
        const data = await response.data;
        console.log("response: " + data)
        let check;
        let tex="~~Todo-List~~ "   
        for (let n=0;n < data.length ; n++) {
          if(data[n].done){check="☑"}else{check="☐"};
          tex += "\n"+check+". "+data[n].title;
        }
        return tex;
      }catch(e){
        const text ="データの取得に失敗しました"+e.message
        return text;
      }  
    }
  

 async function postTask(event){
        const str = event.message.text.split(":")
        try{
          await axios.post(url+"/tasks",{
            "title":str[1]
          });
        }catch(e){
          throw new Error();
        }
      }
    
      
    async function staToggle(event){
      const response=await axios.get(url+"/tasks")
      const data=await response.data;
      for (let n=0;n<data.length;n++){
        if(String(event.message.text.split(":")[1])===data[n].title){
          let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: url+'/tasks/'+data[n].id+'/done',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : {
              "id":Number(data[n].id)
            }
          };
          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
          })
          .catch((error) => {
            console.log(error);
          });
          break;
        }
      }

      // axios.put(url+"/tasks/"+String(key_id)+"/done",{
      //   "id":Number(key_id),
      // })
    }
    