//Mappls MapmyIndia Testing

const db = firebase.firestore();
const sharee_col = db.collection("Sharee");
const user_col = db.collection("User_details");
const sharer_col = db.collection("Sharer");
const review_col = db.collection("User_reviews");

// Declaring variables
var to_user;
var curr_user;
var clat;
var clng;
var tlat;
var tlng;
var url;
var area;

async function load() {
  document.getElementById("give_review").style.display = "none";
  var i = 0;
  var url = document.location.href;
  for (i; i <= url.length; i++) {
    if (url[i] == "?") break;
  }
  url = url.substring(i + 1);
  to_user = url.substring(0, 8);
  curr_user = url.substring(8);

  await user_col
    .doc(curr_user)
    .get()
    .then((doc) => {
      (clat = doc.data().User_lat), (clng = doc.data().User_log);
    })
    .catch((err) => {
      console.log(err);
    });

  await user_col
    .doc(to_user)
    .get()
    .then((doc) => {
      (tlat = doc.data().User_lat),
        (tlng = doc.data().User_log),
        (area = doc.data().User_area);
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(clat, clng, tlat, tlng);
  map = new mappls.Map("map", { center: { lat: clat, lng: clng } });
  var marker1 = new mappls.Marker({
    map: map,
    draggable: false,
    position: { lat: clat, lng: clng },
  });

  var marker2 = new mappls.Marker({
    map: map,
    draggable: false,
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
  window.parent.postMessage(url, '*');
}

async function succ_ride() {
  var choice1, choice2;
  var user1_pts = 0;
  var user1_rides = 0;

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

  user_ref = db.collection("User_details").doc(to_user);
  await user_ref.get().then((doc)=>{
    choice2 = doc.data().User_choice
  });
 
  const sharer = db.collection("Sharer").doc(area);
  const sharee = db.collection("Sharee").doc(area);

  //Changing both the user's status to false
  if (choice1 == "sharee" && choice2 == "sharer") {
    await sharee.get().then((doc) => {
      for (var i = 0; doc.data().Users[i].userid != curr_user; i++) {}
    });
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
    });

  } else {
    user1_pts = user1_pts + 5;

    await user_col.doc(curr_user).update({
      User_pts: user1_pts,
    });

    await sharer.get().then((doc) => {
      for (var i = 0; doc.data().Users[i].userid != curr_user; i++) {}
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

  //Inrementing user points and no. of rides
  user_col
    .doc(curr_user)
    .get()
    .then((doc) => {});

  window.location.href = "user_homepage.html?" + curr_user;
}

function review() {
  var status = document.getElementById("give_review").style.display;
  if(status=="none")
  {
    document.getElementById("give_review").style.display = "inline"
  }
  else
  document.getElementById("give_review").style.display = "none";
}

async function rev_submit(){
  var rate;
  let rating = document.getElementById("rating").value;
  let review1 = document.getElementById("review").innerText;
  console.log(rating,review1);

  await review_col.doc(to_user).get()
  .then((doc)=>{
    rate = doc.data().rating;
  });
  rate = rate+rating;
  await review_col.doc(to_user).update({
    reviews: firebase.firestore.FieldValue.arrayUnion({
      review: review1
    }),
    rating: rate
  })
  .catch((err)=>{
    console.log(err);
  });
}
