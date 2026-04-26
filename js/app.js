let keys = JSON.parse(localStorage.getItem('keys')||'[]');
let idx = 0;

function getKey(){
 if(keys.length===0){alert("Tambah API key dulu");return null;}
 return keys[idx];
}
function rotate(){ idx=(idx+1)%keys.length; }

async function generate(){
 let key=getKey(); if(!key)return;
 let prompt=document.getElementById('prompt').value;

 let id="song-"+Date.now();
 let el=document.getElementById('result');
 el.innerHTML = "Processing...";

 let res=await fetch("https://api.sunoapi.org/api/v1/generate",{
  method:"POST",
  headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},
  body:JSON.stringify({
   prompt:prompt,
   customMode:false,
   instrumental:false,
   model:"V4_5ALL"
  })
 });

 let data=await res.json();

 if(data.data?.taskId){
  poll(data.data.taskId);
 }else{
  rotate();
  el.innerText="Gagal";
 }
}

function poll(id){
 let t=setInterval(async()=>{
  let key=getKey();
  let res=await fetch(`https://api.sunoapi.org/api/v1/generate/record-info?taskId=${id}`,{
   headers:{Authorization:"Bearer "+key}
  });
  let d=await res.json();

  if(d.data?.status==="SUCCESS"){
   clearInterval(t);
   render(d.data.response.data[0]);
  }
 },4000);
}

function render(data){
 let audio=data.audio_url||data.audioUrl;
 document.getElementById('result').innerHTML=
 `<audio controls src="${audio}"></audio>`;
}
