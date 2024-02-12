//Declaring all collections
const db = firebase.firestore();
const sharee_col = db.collection("Sharee");
const user_col = db.collection("User_details");
const sharer_col = db.collection("Sharer");
const msg_col = db.collection("Messaging");
const user_rev = db.collection("User_reviews");
var curr_user;
var to_user;

async function hi() {
  var i = 0;
  var url = document.location.href;
  for (i; i <= url.length; i++) {
    if (url[i] == "?") break;
  }
  curr_user = url.substring(i + 1);
  var users = [];
  await user_col
    .doc(curr_user)
    .get()
    .then((doc) => {
      Array.prototype.push.apply(users, doc.data().User_messager);
    });

  for (var i = 0; i < users.length; i++) {
    console.log(users.length);
    let btn = document.createElement("button");
    btn.innerText = users[i];
    btn.classList =
      "bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded";
    btn.addEventListener("click", async function listen() {
      loadmsg(`${this.innerText}`);
      list();
    });
    document.getElementById("users").appendChild(btn);
  }
}

async function loadmsg(string) {
  document.getElementById("messages").innerText = " ";
  document.getElementById("messages").innerHTML = " ";
  var inn = 0;
  to_user = string;
  var choice;
  var i = 0;
  var url = document.location.href;
  for (i; i <= url.length; i++) {
    if (url[i] == "?") break;
  }

  curr_user = url.substring(i + 1);

  await user_col
    .doc(curr_user)
    .get()
    .then((doc) => {
      choice = doc.data().User_choice;
    });
  var msg_ref;
  var style = " ";
  var inn = [];
  var mesgs = [];
  var a = 0;


  if (choice == "sharer") {
    msg_ref = msg_col.doc(`${curr_user}${to_user}`);
    await msg_ref.get().then((doc) => {
      (mesgs = doc.data()[to_user]), (inn = doc.data()[curr_user]);
    });
  } else {
    style = "right";
    msg_ref = msg_col.doc(`${to_user}${curr_user}`);
    await msg_ref.get().then((doc) => {
      (mesgs = doc.data()[curr_user]), (inn = doc.data()[to_user]);
    });
  }
var name;
await user_rev.doc(to_user).get()
.then((doc)=>{
  name = doc.data().name;
})
document.getElementById("name").innerText = name;

  var b = await msg_ref.get();
  var curr_clear = b.data()[`${curr_user}_clear`];
  console.log(curr_clear)
  var i = curr_clear[0];
  var a = curr_clear[1];
  document.getElementById("messages").innerHTML = " ";
  console.log(mesgs, inn);
  console.log(curr_clear);
  for (i; inn[i] != undefined || mesgs[a]!= undefined; i++) {
    if (inn[i] == "0") {
      let tr = document.createElement("tr");
      let text1 = document.createTextNode(mesgs[a]);
      a++;
      let msg1 = document.createElement("td");
      msg1.appendChild(text1);
      if (style == "right") {
      msg1.classList = "bg-white text-md p-2 rounded";
      msg1.style.textAlign = "right";
      }
      tr.appendChild(msg1);
      document.getElementById("messages").appendChild(tr);
    } else {
      if (inn[i] == undefined) return;
      let tr = document.createElement("tr");
      let text2 = document.createTextNode(inn[i]);
      let msg2 = document.createElement("td");
      msg2.appendChild(text2);
      if (style == " ") 
      msg2.classList = "bg-red-400 p-1 text-md rounded";
      tr.appendChild(msg2);
      document.getElementById("messages").appendChild(tr);
    }
  }
}

async function list() {
  var i = 0;
  var url = document.location.href;
  for (i; i <= url.length; i++) {
    if (url[i] == "?") break;
  }

  curr_user = url.substring(i + 1);
  var choice;
  await user_col
    .doc(curr_user)
    .get()
    .then((doc) => {
      choice = doc.data().User_choice;
    });
  var msg_ref;
  if (choice == "sharer") {
    msg_ref = msg_col.doc(`${curr_user}${to_user}`);
  } else {
    msg_ref = msg_col.doc(`${to_user}${curr_user}`);
  }

  msg_ref.onSnapshot(
    (doc) => {
      loadmsg(to_user);
    },
    (err) => {
      console.log(`Encountered error:`, err);
    }
  );
}

window.onload = (event) => {
  hi();
};

document
  .getElementById("send")
  .addEventListener("click", async function send() {
    //checking blank message
    var msg1;
    var choice;
    if (document.getElementById("msg").value.charCodeAt(0) > 32) {
      msg1 = document.getElementById("msg").value;
    } else {
      document.getElementById("msg").value = "";
    }
    await user_col
      .doc(curr_user)
      .get()
      .then((doc) => {
        choice = doc.data().User_choice;
      });

    var msg = [];
    //updating msg in curr_user db
    if (choice == "sharer") {
      console.log(`${curr_user}${to_user}`);
      await msg_col
        .doc(`${curr_user}${to_user}`)
        .get()
        .then((doc) => {
          msg = doc.data()[curr_user];
        })
        .catch((err) => {
          console.log(err);
        });

      console.log(msg, msg1);

      try {
        msg.push(`${msg1}`);
      } catch (err) {
        console.log(err);
      }

      try {
        await msg_col.doc(`${curr_user}${to_user}`).set(
          {
            [curr_user]: msg,
          },
          { merge: true }
        );
      } catch (err) {
        console.log(err);
      }
    } else {
      var msg = [];
      await msg_col
        .doc(`${to_user}${curr_user}`)
        .get()
        .then((doc) => {
          msg = doc.data()[curr_user];
        })
        .catch((err) => {
          console.log(err);
        });

      try {
        msg.push(msg1);
      } catch (err) {
        console.log(err);
      }

      await msg_col.doc(`${to_user}${curr_user}`).set(
        {
          [curr_user]: msg,
        },
        { merge: true }
      );
       
      msg = [];

      await msg_col
        .doc(`${to_user}${curr_user}`)
        .get()
        .then((doc) => {
          msg = doc.data()[to_user];
        });

      try {
        msg.push("0");
      } catch (err) {
        console.log(err);
      }
      console.log(`${to_user}${curr_user}`);
      await msg_col
        .doc(`${to_user}${curr_user}`)
        .set({ [to_user]: msg }, { merge: true });
    }
    document.getElementById("msg").value = "";
  });

/*function reviews(string){
  var us_review = string.innerText;
  window.location.href = "reviews.html?" + us_review;
}
*/

document
  .getElementById("clear")
  .addEventListener("click", async function clear() {
    var i = 0;
    var url = document.location.href;
    for (i; i <= url.length; i++) {
      if (url[i] == "?") break;
    }

    curr_user = url.substring(i + 1);
    var choice;
    await user_col
      .doc(curr_user)
      .get()
      .then((doc) => {
        choice = doc.data().User_choice;
      });

    var msg_ref;
    if (choice == "sharer") {
      msg_ref = msg_col.doc(`${curr_user}${to_user}`);
      var doc = await msg_ref.get();
      var arr= [];
      var arr2=[];
      arr = doc.data()[curr_user];
      arr2 = doc.data()[to_user];
      console.log(arr.length);

      await msg_ref.update({
        [`${curr_user}_clear`]:[arr.length,arr2.length]
      })

    } else {
      msg_ref = msg_col.doc(`${to_user}${curr_user}`);
      var doc = await msg_ref.get();
      var arr= [];
      var arr2=[];
      arr = doc.data()[to_user];
      arr2 = doc.data()[curr_user];
      console.log(arr.length);

      await msg_ref.update({
        [`${curr_user}_clear`]:[arr.length,arr2.length]
      })
    }

  });
