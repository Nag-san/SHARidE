//Declaring all collections
const db = firebase.firestore();
const sharee_col = db.collection("Sharee");
const user_col = db.collection("User_details");
const sharer_col = db.collection("Sharer");

//Declaring all global variables
var user_id;
var choice;
var area;
var avail_users = [10];
var avail2_users = [10];
var avail = 0;
var avail2 = 0;
var userto = 2;

function get_userid(url) {
    var i = 0;
    for (i; i < url.length; i++) {
      if (url[i] == "?") break;
       }
    user_id = url.substring(i+1);
    return user_id;
  }

//To set user status to true and get available users from the same area, different choice
async function ShareRide() {
  user_id = get_userid(window.location.href);
  //getting user's area, choice
  var user_ref = db.collection("User_details").doc(user_id);
  await user_ref.get().then((doc) => {
    if (doc.exists) {
      area = doc.data().User_area;
      choice = doc.data().User_choice;
      userto = doc.data().User_to;
    }
  });
  const sharee = db.collection("Sharee").doc(area);
  const sharer = db.collection("Sharer").doc(area);

  //status change
  if (choice == "sharee") {
    await sharee_col.doc(area).update({
      Users: firebase.firestore.FieldValue.arrayRemove({
        userid: user_id,
        status: false,
      }),
    });

    await sharee_col.doc(area).update({
      Users: firebase.firestore.FieldValue.arrayUnion({
        userid: user_id,
        status: true,
      }),
    });

    //avaiable sharer check-1
    await sharer
      .get()
      .then((doc) => {
        for (var i = 0; doc.data().Users[i].userid != undefined; i++) {
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
  } else {
    window.location.href = "sharer_page.html?" + user_id;
  }

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
      let text1 = document.createTextNode(avail2_users[i]);
      let t1 = document.createElement("td");
      t1.appendChild(text1);
      let tr = document.createElement("tr");
      tr.appendChild(t1);
      document.getElementById("users").appendChild(tr);
      avail2++;
    }
  }
  if (avail2 == 0) {
    document.getElementById("Wait").innerText =
      "There are no online users in your area. Kindly refresh in a while.";
    document.getElementById("BookRide").disabled = true;
  } else {
    document.getElementById("BookRide").disabled = false;
  }
}

window.onload = (event=>{
  Refresh();
})

document
  .getElementById("Refresh")
  .addEventListener("click", async function Refresh() {
    avail = 0;
    avail2 = 0; 
    var table =  document.getElementById("users");
    var rows = table.rows.length;
    for(var i=0; i<rows;i++)
    {
      table.deleteRow(i);
    }
    document.getElementById("Wait").innerText = " ";
    ShareRide();
  });
//Page 3

//To set user's status to false
document
  .getElementById("CancelRide")
  .addEventListener("click", async function CancelRide() {
    const sharer = db.collection("Sharer").doc(area);
    const sharee = db.collection("Sharee").doc(area);
   
    await sharee_col.doc(area).update({
      Users: firebase.firestore.FieldValue.arrayRemove({
        userid: user_id,
        status: true,
      }),
    });

    await sharee_col.doc(area).update({
      Users: firebase.firestore.FieldValue.arrayUnion({
        userid: user_id,
        status: false,
      }),
    });

    avail = 0;
    avail_users = [10];
    avail2 = 0;
    avail2_users = [10];
    window.parent.postMessage('user_homepage.html','*');
  });

document
  .getElementById("BookRide")
  .addEventListener("click", async function BookRide() {
    var user1;
    await user_col
      .doc(user_id)
      .get()
      .then((doc) => {
        user1 = doc.data().User_sharer;
      });

    if (user1 == " " || user1 == undefined) {
      console.log("heree");
      document.getElementById("Wait").innerText =
        "Waiting for the users to accept";
    } else {
      console.log('maps');
      window.parent.postMessage(`maps.html?${user1}`,'*');
    }
    console.log("shareepage");
  });
