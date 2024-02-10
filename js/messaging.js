//Declaring all collections
const db = firebase.firestore();
const database = firebase.database();
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

      let btn = document.createElement("button");
      btn.innerText = users[i];
      btn.classList = ("bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded");
      btn.addEventListener('click', async function listen(){
        loadmsg(`${this.innerText}`);
        const dbref = firebase.database().ref(`/Messaging/${curr_user}`);
        await dbref.on("value", (snapshot) => {
          const data = snapshot.val();
          console.log(data);
      });
      
      document.getElementById("users").appendChild(btn);
  });
}
}

async function loadmsg(string){
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
      for (i = 0; inn != undefined || out != undefined; i++) {
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

window.onload=(event) => {
  hi();
};

document.getElementById('send').addEventListener('click', async function send(){
  //checking blank message
  var msg;
  if (document.getElementById("msg").value.charCodeAt(0) > 32) {
    msg = document.getElementById("msg").value;
  } else {
    document.getElementById("msg").value = "";
  }
  //updating msg in curr_user db
  await msg_col
    .doc(curr_user)
    .set(
      {
        [to_user]: firebase.firestore.FieldValue.arrayUnion({
          in: msg,
        }),
      },
      { merge: true }
    )
    .then((resolve) => {
      console.log("yes");
    })
    .catch((err) => {
      console.log(err);
    });

  //updating msg in to_user db
  await msg_col
    .doc(to_user)
    .set(
      {
        [curr_user]: firebase.firestore.FieldValue.arrayUnion({
          out: msg,
        }),
      },
      { merge: true }
    )
    .then((res) => {
      console.log("yes");
    })
    .catch((err) => {
      console.log(err);
    });

  document.getElementById("msg").value = "";
  location.reload();
})

/*function reviews(string){
  var us_review = string.innerText;
  window.location.href = "reviews.html?" + us_review;
}
*/