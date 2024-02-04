//Declaring all collections

const db = firebase.firestore();
const sharee_col = db.collection("Sharee");
const user_col = db.collection("User_details");
const sharer_col = db.collection("Sharer");

//Declaring all global variables
var user_id;
var choice;
var area;
var glat;
var glng;
var avail_users = [10];
var avail2_users = [10];
var avail = 0;
var avail2 = 0;
var userto = 2;
var sharee;
var sharer;
var dist;
var time;

async function hi() {
  var i = 0;
  var url = document.location.href;
  for (i; i <= url.length; i++) {
    if (url[i] == "?") break;
  }
  user_id = url.substring(i + 1);

  //getting user's area
  var user_ref = db.collection("User_details").doc(user_id);
  await user_ref.get().then((doc) => {
    if (doc.exists) {
      area = doc.data().User_area;
      userto = doc.data().User_to;
      glat = doc.data().User_lat;
      glng = doc.data().User_log;
    }
  });
  sharee = db.collection("Sharee").doc(area);
  sharer = db.collection("Sharer").doc(area);

  //status change
  await sharer.get().then((doc) => {
    for (i = 0; doc.data().Users[i].userid != user_id; i++) {}
  })
  .catch((err)=>{
    console.log(err);
  });

  await sharer_col.doc(area).update({
    Users: firebase.firestore.FieldValue.arrayRemove({
      userid: user_id,
      status: false,
    }),
  });

  await sharer_col.doc(area).update({
    Users: firebase.firestore.FieldValue.arrayUnion({
      userid: user_id,
      status: true,
    }),
  });

  //available sharee check-1
  await sharee
    .get()
    .then((doc) => {
      for (i = 0; doc.data().Users[i].userid != undefined; i++) {
        var id = doc.data().Users[i].userid;
        var status = doc.data().Users[i].status;
        if (status == true) {
          avail_users[avail] = id;
          avail++;
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });

  //available check-2
  for (i = 0; i < avail; i++) {
    var to;
    await user_col
      .doc(avail_users[i])
      .get()
      .then((doc) => {
        to = doc.data().User_to;
        var rollno = doc.data().User_no;
      })
      .catch((err) => {
        console.log(err);
      });
    if (to == userto) {
      avail2_users[avail2] = avail_users[i];
      avail2++;
    }
  }
  if(avail2==0)
  {
    let msg = document.createTextNode("No users available, please refresh after a while");
    document.getElementById("Avail_users").appendChild(msg);
  }
  else{

  //fetch location of available users
  var ulat, ulng;
  for (i = 0; i < avail2; i++) {
    await user_col
      .doc(avail2_users[i])
      .get()
      .then((doc) => {
        if (doc.exists) {
          ulat = doc.data().User_lat;
          ulng = doc.data().User_log;
        } else console.log("No user available");
      })
      .catch((err) => {
        console.log(err);
      });

    //calculating distance and duration using mappls API
    glat = glat.toString();
    glng = glng.toString();
    ulat = ulat.toString();
    ulng = ulng.toString();
    let rest = glng + "," + glat + ";" + ulng + "," + ulat;
    let result =
      "https://apis.mappls.com/advancedmaps/v1/f0efde99426abd578704537c233bbb03/distance_matrix/driving/" +
      rest;
    let res = await fetch(result);
    let resJson = await res.json();
    dist = resJson.results.distances[0][1];
    dist = dist / 1000;
    time = resJson.results.durations[0][1];
    time = time / 60;

    //creating table
    let tr = document.createElement("tr");
    var us = avail2_users[i];
    let text1 = document.createTextNode(avail2_users[i]);
    let text2 = document.createTextNode(`${dist.toFixed(2)} km`);
    let text3 = document.createTextNode(`${time.toFixed(2)} mins`);
    let btn = document.createElement("button");
    btn.innerText = "Click ME!";
    btn.id = us;
    btn.addEventListener('click',async function(){
      us = btn.id;
      await user_col.doc(us).update({
        User_sharer: user_id
      })
      .catch((err)=>{
        console.log(err);
      });
      window.location.href = "maps.html?" + us + user_id;
    })
    let t1 = document.createElement("td");
    let t2 = document.createElement("td");
    let t3 = document.createElement("td");
    let t4 = document.createElement("td");
    t1.appendChild(text1);
    t2.appendChild(text2);
    t3.appendChild(text3);
    t4.appendChild(btn);
    tr.appendChild(t1);
    tr.appendChild(t2);
    tr.appendChild(t3);
    tr.appendChild(t4);
    document.getElementById("Avail_users").appendChild(tr);
  }
}
}

async function CancelRide() {
  await sharer.get().then((doc) => {
    for (var i = 0; doc.data().Users[i].userid != user_id; i++) {}
  });

  await sharer_col.doc(area).update({
    Users: firebase.firestore.FieldValue.arrayRemove({
      userid: user_id,
      status: true,
    }),
  });

  await sharer_col.doc(area).update({
    Users: firebase.firestore.FieldValue.arrayUnion({
      userid: user_id,
      status: false,
    }),
  });
  avail = 0;
  avail_users = [10];
  avail2 = 0;
  avail2_users = [10];
  window.location.href = "user_homepage.html?" + user_id;
}

//To transfer focus to start page
async function logout() {
  CancelRide();
  window.location.href = "index.html";
}

function refresh() {
  window.location;
}