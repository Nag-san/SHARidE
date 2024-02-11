const db = firebase.firestore();
const sharee_col = db.collection("Sharee");
const user_col = db.collection("User_details");
const sharer_col = db.collection("Sharer");
const review_col = db.collection("User_reviews");
const msg_col = db.collection("Messaging");

// Declaring variables
var to_user;
var curr_user;
var clat;
var clng;
var tlat;
var tlng;
var url;
var area;

window.onload = async function hello(){
  var i = 0;
  var url = document.location.href;
  for (i = 0; i < url.length; i++) {
    if (url[i] == "?") break;
  }
  url = url.substring(i + 1);
  to_user = url.substring(0, 8);
  curr_user = url.substring(8);
  load();
  const unsub = await user_col.doc(to_user).onSnapshot((doc) => {
    num = doc.data().User_otp;
    load();
})
if (document.getElementById('otp_disp').value != ' ')
unsub();
}

async function load() {
  document.getElementById("give_review").style.display = "none";
  document.getElementById("review").style.display = "none";
  var i = 0;
  var url = document.location.href;
  for (i = 0; i < url.length; i++) {
    if (url[i] == "?") break;
  }
  url = url.substring(i + 1);
  to_user = url.substring(0, 8);
  curr_user = url.substring(8);
  var users1 = [];
  var choice;
  await user_col
    .doc(curr_user)
    .get()
    .then((doc) => {
      (users1 = doc.data().User_messager),
        (clat = doc.data().User_lat),
        (clng = doc.data().User_log),
        (choice = doc.data().User_choice);
    })
    .catch((err) => {
      console.log(err);
    });
  if (choice == "sharee") {
    document.getElementById("enter").style.display = "inline";
    document.getElementById("disp").style.display = "none";
    await msg_col.doc(`${to_user}${curr_user}`).set({
      [curr_user]: " ",
      [to_user]: " ",
    });

    const num = Math.floor(10000 + Math.random() * 90000);
    await user_col.doc(curr_user).update({
      User_otp: num,
    });
    console.log(num);
  } else {
    document.getElementById("enter").style.display = "none";
    document.getElementById("disp").style.display = "inline";
    await user_col.doc(to_user).onSnapshot((doc) => {
      num = doc.data().User_otp;
      if (num != " ") {
        document.getElementById("otp_disp").innerText = num;
      }
    });
  }

  for (var i = 0; i < users1.length; i++) {
    if (users1[i] == to_user) break;
  }
  if (i == users1.length) {
    await user_col
      .doc(curr_user)
      .set(
        {
          User_messager: [to_user],
        },
        { merge: true }
      )
      .catch((err) => {
        console.log(err);
      });
  }

  await user_col
    .doc(to_user)
    .get()
    .then((doc) => {
      (tlat = doc.data().User_lat), (tlng = doc.data().User_log);
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(to_user, tlat, tlng);

  console.log(clat, clng, tlat, tlng);
  map = new mappls.Map("map", {
    center: { lat: clat, lng: clng },
    fullscreenControl: false,
  });
  var marker1 = new mappls.Marker({
    map: map,
    draggable: false,
    popupHtml: "Your Location",
    position: { lat: clat, lng: clng },
  });

  var marker2 = new mappls.Marker({
    map: map,
    draggable: false,
    popupHtml: "Friend's Location",
    position: { lat: tlat, lng: tlng },
  });

  var pl = new mappls.Polyline({
    map: map,
    path: [
      { lat: clat, lng: clng },
      { lat: tlat, lng: tlng },
    ],
  });
}
function getd() {
  url =
    "https://www.google.com/maps/dir/" +
    clat +
    "," +
    clng +
    "/" +
    tlat +
    "," +
    tlng +
    "/?entry=ttu";
  window.parent.postMessage(url, "*");
}


async function succ_ride() {
  var otp;
  otp = document.getElementById("otp").value;
  var choice1, choice2;
  var user1_pts = 0;
  var user1_rides = 0;
  var num;
  var i = 0;
  var url = document.location.href;
  for (i = 0; i < url.length; i++) {
    if (url[i] == "?") break;
  }
  url = url.substring(i + 1);
  to_user = url.substring(0, 8);
  curr_user = url.substring(8);

  //Getting user's area, choice, user points and rides
  var user_ref = db.collection("User_details").doc(curr_user);
  await user_ref.get().then((doc) => {
    if (doc.exists) {
      area = doc.data().User_area;
      choice1 = doc.data().User_choice;
      user1_pts = doc.data().User_pts;
      user1_rides = doc.data().User_rides;
    }
  });

  if (choice1 == "sharer") {
    await user_col
      .doc(curr_user)
      .get()
      .then((doc) => {
        num = doc.data().Otp_status;
      });
    if (num == " ") {
      document.getElementById("msg2").innerText =
        "Waiting for the user to enter otp. Kindly refresh";
      return;
    } else {
      document.getElementById("review").style.display = "none";
      document.getElementById("msg2").innerText = "Hope you SHARidE SAFELY!";
    }
  } else {
    await user_col
      .doc(curr_user)
      .get()
      .then((doc) => {
        num = doc.data().User_otp;
      });
    if (otp != num) {
      document.getElementById("msg1").innerText = "Oops! Its the wrong otp";
      return;
    } else {
      document.getElementById("review").style.display = "none";
      await user_col.doc(to_user).update({
        Otp_status: "Done",
      });
      document.getElementById("msg1").innerText =
        "OTP is thus correct. Hope you SHARidE SAFELY!";
    }
  }

  user_ref = db.collection("User_details").doc(to_user);
  await user_ref.get().then((doc) => {
    choice2 = doc.data().User_choice;
  });

  const sharer = db.collection("Sharer").doc(area);
  const sharee = db.collection("Sharee").doc(area);

  //Changing both the user's status to false
  if (choice1 == "sharee" && choice2 == "sharer") {
    await sharee_col.doc(area).update({
      Users: firebase.firestore.FieldValue.arrayRemove({
        userid: curr_user,
        status: true,
      }),
    });

    await sharee_col.doc(area).update({
      Users: firebase.firestore.FieldValue.arrayUnion({
        userid: curr_user,
        status: false,
      }),
    });

    //Updating rides and pts
    user1_rides++;
    await user_col.doc(curr_user).update({
      User_sharer: " ",
      User_rides: user1_rides,
      User_otp: " ",
    });
  } else {
    user1_pts = user1_pts + 5;

    await user_col.doc(curr_user).update({
      User_pts: user1_pts,
      Otp_status: " ",
    });

    await sharer_col.doc(area).update({
      Users: firebase.firestore.FieldValue.arrayRemove({
        userid: curr_user,
        status: true,
      }),
    });
    await sharer_col.doc(area).update({
      Users: firebase.firestore.FieldValue.arrayUnion({
        userid: curr_user,
        status: false,
      }),
    });
  }
  document.getElementById("review").style.display = "inline";
}

function review() {
  var status = document.getElementById("give_review").style.display;
  if (status == "none") {
    document.getElementById("give_review").style.display = "inline";
  } else document.getElementById("give_review").style.display = "none";
}

async function rev_submit() {
  var rate;
  let rating = document.getElementById("rating").value;
  let review1 = document.getElementById("review").value;

  await review_col
    .doc(to_user)
    .get()
    .then((doc) => {
      rate = doc.data().rating;
    });
  rate = rate + rating;
  await review_col
    .doc(to_user)
    .update({
      reviews: firebase.firestore.FieldValue.arrayUnion({
        [curr_user]: review1,
      }),
      rating: rate,
    })
    .catch((err) => {
      console.log(err);
    });

  window.postMessage("user_homepage.html", "*");
}
