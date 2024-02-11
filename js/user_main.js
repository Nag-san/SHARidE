
//Declaring all collections
const db = firebase.firestore();
const sharee_col = db.collection("Sharee");
const user_col = db.collection("User_details");
const sharer_col = db.collection("Sharer");

let user_id;
var url;
var global;

function hello() {
  url = document.location.href;
  user_id = get_userid(url);
  window.name = user_id;
  global = `user_homepage.html?${user_id}`;
  try {
  document.getElementById("homepage").value = user_id;
  document.getElementById("messaging").value = user_id;
  document.getElementById("community").value = user_id;
  document.getElementById("settings").value = user_id;
}
catch(err) 
{
  console.log(err);
};
}

window.onload= (event) => {
  hello()
};


document.getElementById("homepage").addEventListener("click", function () {
  let val = this.value;
  window.postMessage('l','*');
  document.getElementById("welcome").style.display = "none";
});
document.getElementById("messaging").addEventListener("click", function () {
  let val = this.value;
  document.getElementById("iframee").setAttribute('src', `messaging.html?${val}`);
  document.getElementById("welcome").style.display = "none";
});
document.getElementById("community").addEventListener("click", function () {
  let val = this.value;
  document.getElementById("iframee").setAttribute('src', `community.html?${val}`);
  document.getElementById("welcome").style.display = "none";
});
document.getElementById("settings").addEventListener("click", function () {
  let val = this.value;
  document.getElementById("iframee").setAttribute('src', `user_settings.html?${val}`);
  document.getElementById("welcome").style.display = "none";
});


function get_userid(url) {
  var i = 0;
  for (i; i < url.length; i++) {
    if (url[i] == "?") break;
     }
  user_id = url.substring(i+1);
  return user_id;
}

window.addEventListener('message', function (event) {
  let url = event.data;
  if(url===`user_homepage2.html`)
  {
    url = `${event.data}?${window.name}`;
    document.getElementById('iframee').setAttribute('src', url);
    global = url;
  }
  else if(url==='user_homepage.html')
  {
    url = `${event.data}?${window.name}`;
    document.getElementById('iframee').setAttribute('src', url);
    global=url;
  }
  else if(url==='sharee_page.html')
  {
    url = `${event.data}?${window.name}`;
    document.getElementById('iframee').setAttribute('src', url);
    global=url;
  }
  else if(url=== 'sharer_page.html')
  {
    url = `${event.data}?${window.name}`;
    document.getElementById('iframee').setAttribute('src', url);
    global=url;
  }
  else if(url==='exitIframe')
  {
    window.location.href = "../index.html";
  }
  else if(url[1]==='t')
  {
    console.log("here");
    window.open(url,"_blank");
  }
  else if(url[0]==='m')
  {
    document.getElementById('iframee').setAttribute('src', url);
    global=url;
  }
  else if(url==='l')
  {
    document.getElementById('iframee').setAttribute('src', global);
  }
});

