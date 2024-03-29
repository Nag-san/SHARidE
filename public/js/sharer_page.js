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

window.onload = async function load() {
  var area;
  user_id = get_userid(window.location.href);
  document.getElementById("Wait").innerText = " ";
  await user_col
    .doc(user_id)
    .get()
    .then((doc) => {
      area = doc.data().User_area;
    });

  db.collection("Sharee")
    .doc(area)
    .onSnapshot(
      (doc) => {
        hi();
      },
      (err) => {
        console.log(`Encountered error:`, err);
      }
    );
};

function get_userid(url) {
  var i = 0;
  var url = document.location.href;
  for (i; i <= url.length; i++) {
    if (url[i] == "?") break;
  }
  user_id = url.substring(i + 1);
  return user_id;
}

async function hi() {
  document.getElementById("Wait").innerText = " ";
  user_id = get_userid(window.location.href);
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
  avail_users = [];
  avail2_users = [];
  avail = 0;
  avail2 = 0;

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
      })
      .catch((err) => {
        console.log(err);
      });

    if (to == userto) {
      avail2_users[avail2] = avail_users[i];
      avail2++;
    }
  }

  avail_users = [];
  avail2_users.forEach((element) => {
    if (!avail_users.includes(element)) {
      avail_users.push(element);
    }
  });

  var table = document.getElementById("Availusers");
  var rowCount = table.rows.length;
  try {
    for (i = 1; i <= rowCount; i++) {
      table.deleteRow(i);
      console.log("deleted row", i);
    }
  } catch (err) {
    console.log(err);
  }
  document.getElementById("Wait").innerText = " ";
  console.log(avail_users, avail2_users);
  if (avail2 == 0 && avail_users[0] == undefined) {
    document.getElementById("Wait").innerText =
      "There are no users currently available!";
  } else {
    //fetch location of available users
    var ulat, ulng;
    var len = avail_users.length;
    console.log(len);
    for (i = 0; i < len; i++) {
      await user_col
        .doc(avail_users[i])
        .get()
        .then((doc) => {
          if (doc.exists) {
            ulat = doc.data().User_lat;
            ulng = doc.data().User_log;
          }
        })
        .catch((err) => {
          console.log(err);
          return;
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
      var us = avail_users[i];
      let text1 = document.createTextNode(avail_users[i]);
      let text2 = document.createTextNode(`${dist.toFixed(2)} km`);
      let text3 = document.createTextNode(`${time.toFixed(2)} mins`);
      let btn = document.createElement("button");
      btn.innerText = "YEP!";
      btn.id = us;
      btn.addEventListener("click", async function () {
        us = btn.id;
        await user_col
          .doc(us)
          .update({
            User_sharer: user_id,
          })
          .catch((err) => {
            console.log(err);
          });
        window.parent.postMessage(`maps.html?${us}${user_id}`);
      });
      let t1 = document.createElement("td");
      let t2 = document.createElement("td");
      let t3 = document.createElement("td");
      let t4 = document.createElement("td");
      t1.classList = "px-4 py-2 text-center items-center";
      t2.classList = "px-4 py-2 text-center items-center";
      t3.classList = "px-4 py-2 text-center items-center";
      t4.classList = "px-4 py-2 text-center items-center";
      btn.classList =
        "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded";
      t1.appendChild(text1);
      t2.appendChild(text2);
      t3.appendChild(text3);
      t4.appendChild(btn);
      tr.appendChild(t1);
      tr.appendChild(t2);
      tr.appendChild(t3);
      tr.appendChild(t4);
      document.getElementById("Availusers").appendChild(tr);
    }
  }
}

async function CancelRide() {
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
  window.parent.postMessage("user_homepage.html", "*");
}
