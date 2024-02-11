//Declaring all collections
const db = firebase.firestore();
const sharee_col = db.collection("Sharee");
const user_col = db.collection("User_details");
const sharer_col = db.collection("Sharer");
const msg_col = db.collection("Messaging");
var curr_user;
var to_user;

async function hi() {
  var i = 0;
  var url = document.location.href;
  for (i; i <= url.length; i++) {
    if (url[i] == "?") break;
  }
  curr_user = url.substring(i+1);
  var users = [];
  await user_col.doc(curr_user).get()
  .then((doc)=>{
    Array.prototype.push.apply(users, doc.data().User_messager)
  });
 
  for(var i=0; i<users.length; i++)
  {
    console.log(users.length);
      let btn = document.createElement("button");
      btn.innerText = users[i];
      btn.classList = ("bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded");
      btn.addEventListener('click', async function listen(){
      loadmsg(`${this.innerText}`);})
      document.getElementById("users").appendChild(btn);
}
}

async function loadmsg(string){
  document.getElementById('messages').innerText = " ";
  document.getElementById('messages').innerHTML = " ";
  var inn = 0;
  var out = 0;
  to_user = string;

  var i = 0;
  var url = document.location.href;
  for (i; i <= url.length; i++) {
    if (url[i] == "?") break;
  }

 curr_user = url.substring(i+1);

  await msg_col
    .doc(curr_user)
    .get()
    .then((doc) => {
      for (i = 1; inn != undefined || out != undefined; i++) {
        inn = doc.data()[to_user].at(i).in;
        out = doc.data()[to_user].at(i).out;
        if (inn != undefined) {
          let tr = document.createElement("tr");
          let text1 = document.createTextNode(inn);
          let msg1 = document.createElement("td");
          msg1.appendChild(text1);
          msg1.style.textAlign = "right";
          tr.appendChild(msg1);
          document.getElementById("messages").appendChild(tr);
        }
        if (out != undefined) {
          let tr = document.createElement("tr");
          let text2 = document.createTextNode(out);
          let msg2 = document.createElement("td");
          msg2.appendChild(text2);
          tr.appendChild(msg2);
          document.getElementById("messages").appendChild(tr);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function listen(curr_user,to_user){
    db.collection('Messaging').doc(curr_user).onSnapshot(doc =>  {
      loadmsg(to_user);
    }, err => {
      console.log(`Encountered error:`, err);
    });
  }

window.onload=(event) => {
  hi();
};

document.getElementById('send').addEventListener('click', async function send(){
  //checking blank message
  var msg1;
  var choice;
  if (document.getElementById("msg").value.charCodeAt(0) > 32) {
    msg1 = document.getElementById("msg").value;
  } else {
    document.getElementById("msg").value = "";
  }
  await user_col.doc(curr_user).get()
  .then((doc)=>{
    choice = doc.data().User_choice
  })
  var msg = [];
  //updating msg in curr_user db
  if(choice=='sharer')
  {
    await msg_col.doc(`${curr_user}${to_user}`).get()
    .then((doc)=>{
      msg = doc.data()[curr_user];
    })
    msg.push(msg1);
    await msg_col
    .doc(`${curr_user}${to_user}`)
    .update(
      {
        [curr_user]:msg
      })
    .then((resolve) => {
      console.log("yes");
    })
    .catch((err) => {
      console.log(err);
    });
  }
  else{
    msg = [];
    await msg_col.doc(`${to_user}${curr_user}`).get()
    .then((doc)=>{
      msg = doc.data()[curr_user];
    })
    msg.push(msg1)

    await msg_col
    .doc(`${to_user}${curr_user}`)
    .update(
      {
          [curr_user]:msg
        })
    .then((resolve) => {
      console.log("yes");
    })
    .catch((err) => {
      console.log(err); 
    });

    msg = [];
  
    await msg_col.doc(`${to_user}${curr_user}`).get()
    .then((doc)=>{
      msg = doc.data()[to_user];
    })
    msg.push('0');
    await msg_col
    .doc(`${to_user}${curr_user}`)
    .update(
      {
          [to_user]:msg
        })
    .then((resolve) => {
      console.log("yes");
    })
    .catch((err) => {
      console.log(err); 
    });
    
  }
  document.getElementById("msg").value = "";
  listen(curr_user,to_user);

})

/*function reviews(string){
  var us_review = string.innerText;
  window.location.href = "reviews.html?" + us_review;
}
*/

/*document.getElementById('clear').addEventListener('click', async function clear() {
  console.log(curr_user,to_user);
  await msg_col.doc(curr_user).set({
    [to_user]:firebase.firestore.FieldValue.arrayUnion({
  })
})
})*/