export default function getList(){
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