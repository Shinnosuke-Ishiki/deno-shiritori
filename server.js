import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";


const initial = ["しりとり","りんご","ごりら","つる","かめ"];
let previousWord = initial[Math.floor(Math.random()*initial.length)];

console.log("Listening on http://localhost:8000");

const myHistry=[];



serve(async (req) => {
  
  const pathname = new URL(req.url).pathname;

  if (req.method === "GET" && pathname === "/shiritori") {

    return new Response(previousWord);

  }

  if (req.method === "POST" && pathname === "/shiritori") {

    const requestJson = await req.json();
    const nextWord = requestJson.nextWord;

    if(nextWord.length > 0 && !(/^[ぁ-んー　]*$/.test(nextWord)) ){
      return new Response("ひらがなを入力してください",{status: 400 });
    }
    if(nextWord.length != (nextWord.replace(/\s+/g,"").length)){
      return new Response("空白があります",{status: 400});
    }
    if (nextWord.length > 0 && previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)) {

      return new Response("前の単語に続いていません。", { status: 400 });

    }
    if(nextWord.length > 0 && nextWord.charAt(nextWord.length - 1) === "ん" ){
      return new Response("’ん’をついたの負けです",{status: 400 });
    }

    if(nextWord.length > 0 && !(myHistry.indexOf(nextWord))){
      return new Response("既に使われています",{status: 400 });
    }
    

    previousWord = nextWord;
    myHistry.push(nextWord);

    /*過去の履歴を表示（パスの参照が上手くいかない）
    
    const ul = document.getElementById('frame');

    for(let count =0; count < myHistry.length;count++){
      const li = ducument.createElement('li');
      const text = document.createTextNode(myHistry[count]);

      li.appendChild(text);
      ul.appenedChild(li);
    }
    */

    return new Response(previousWord);

   
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,

  });
    


});
