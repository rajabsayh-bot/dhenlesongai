let keys = JSON.parse(localStorage.getItem('keys')||'[]');
let indexKey = 0;

function toggleMenu(){
  document.getElementById("sidebar").classList.toggle("active");
}

function getKey(){
  if(keys.length === 0){
    alert("Masukkan API key dulu di settings");
    return null;
  }
  return keys[indexKey];
}

function rotateKey(){
  indexKey = (indexKey + 1) % keys.length;
}

async function generate(){
  let key = getKey();
  if(!key) return;

  let prompt = document.getElementById("prompt").value;
  let result = document.getElementById("result");

  result.innerHTML = "⏳ Generating...";

  let res = await fetch("https://api.sunoapi.org/api/v1/generate",{
    method:"POST",
    headers:{
      "Authorization":"Bearer "+key,
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      prompt:prompt,
      customMode:false,
      instrumental:false,
      model:"V4_5ALL"
    })
  });

  let data = await res.json();

  if(data.data?.taskId){
    poll(data.data.taskId);
  } else {
    rotateKey();
    result.innerHTML = "❌ Gagal generate";
  }
}

function poll(taskId){
  let interval = setInterval(async()=>{
    let key = getKey();

    let res = await fetch(`https://api.sunoapi.org/api/v1/generate/record-info?taskId=${taskId}`,{
      headers:{
        "Authorization":"Bearer "+key
      }
    });

    let data = await res.json();

    if(data.data?.status === "SUCCESS"){
      clearInterval(interval);
      let audio = data.data.response.data[0].audio_url || data.data.response.data[0].audioUrl;

      document.getElementById("result").innerHTML = `
        <audio controls src="${audio}"></audio>
      `;
    }
  },4000);
     }
