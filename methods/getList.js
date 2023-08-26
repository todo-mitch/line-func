export default function getList(){
    // const express = require('express');
    // const app = express();
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
        text+="\n"+tasks[n].title;
    };
    return text;
}