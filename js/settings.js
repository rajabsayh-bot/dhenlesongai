function saveKeys(){
 let val=document.getElementById('keysInput').value.split("\n");
 localStorage.setItem('keys',JSON.stringify(val));
 alert("Saved");
}
