//Getting user details and setting it

//Declaring all collections from Firebase
const db = firebase.firestore();
const sharee_col = db.collection("Sharee");
const user_col = db.collection("User_details");
const sharer_col = db.collection("Sharer");
const review_col = db.collection("User_reviews");

//Declaring all global variables
var user_id;
var choice;
var auth;
var area = document.getElementById("area");
var pwd;
var glat, glong;
var dl;
var desp;
var name;
const map = new mappls.Map("map", {
  center: { lat: 13.027239970980778, lng: 77.63651315651865 },
});
const marker1 = new mappls.Marker({
  map: map,
  draggable: true,
  fitbounds: true,
  width: 35,
  height: 50,
  popupHtml: "Your location ",
  position: { lat: 13.027239970980778, lng: 77.63651315651865 },
});

//Hi function to display username
function hi() {
  var i = 0;
  var url = document.location.href;
  for (i; i <= url.length; i++) {
    if (url[i] == "?") break;
  }
  user_id = url.substring(i + 1);
  document.getElementById("msg").innerText = `Heyy ${user_id} !`;
}

//Map listener to set center according to area
area.addEventListener("change", function () {
  var area1 = area.value;
  if (area1 == "Hennur") {
    map.setCenter({ lat: 13.038167023942243, lng: 77.6434407896191 });
    marker1.setPosition({ lat: 13.038167023942243, lng: 77.6434407896191 });
  } else if (area1 == "KR Puram") {
    map.setCenter({ lat: 13.017553963882222, lng: 77.70440617135745 });
    marker1.setPosition({ lat: 13.017553963882222, lng: 77.70440617135745 });
  } else if (area1 == "Hebbal") {
    map.setCenter({ lat: 13.035802644453957, lng: 77.5977116982567 });
    marker1.setPosition({ lat: 13.035802644453957, lng: 77.5977116982567 });
  } else {
    map.setCenter({ lat: 13.027239970980778, lng: 77.63651315651865 });
    marker1.setPosition({ lat: 13.027239970980778, lng: 77.63651315651865 });
  }
});


sharee.addEventListener("click", () =>{
  document.getElementById("dl").style.display = "none";
  document.getElementById("dl1").style.display = "none";
})

sharer.addEventListener("click", () =>{
  document.getElementById("dl").style.display = "inline";
  document.getElementById("dl1").style.display = "inline";

})
//To get user's custom position
marker1.addListener("click", function () {
  let pos1 = marker1.getPosition();
  glat = pos1.lat;
  glong = pos1.lng;
});

//To get user's present location
function ploc() {
  const successCallback = (position) => {
    glat = position.coords.latitude;
    glong = position.coords.longitude;
    marker1.setPosition({ lat: glat, lng: glong });
    map.setCenter({ lat: glat, lng: glong });

  };

  const errorCallback = (error) => {
    console.log(error);
    document.getElementById("error").innerText =
      "Please allow to access your location";
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

//To check all user details
async function submit() {
  choice = " ";
  auth = true;
  let name = document.getElementById("name").value;
  let desp = document.getElementById("description").value;
  if(name.length===0)
  {
  document.getElementById("error").innerText = "Please enter your name!";
  auth = false;
  }
  else if(desp.length===0)
  {
    document.getElementById("error").innerText = "You need to give a bio!";
    auth = false;
  }
  area = document.getElementById("area").value;
  if (document.getElementById("sharee").checked == true) {
    choice = "sharee";
  } else if (document.getElementById("sharer").checked == true) {
    choice = "sharer";
  } else {
    document.getElementById("error").innerText = "Please choose an option";
    auth = false;
  }
  pwd = document.getElementById("pwd").value;
  let cpwd = document.getElementById("cpwd").value;
  if (pwd != cpwd) {
    document.getElementById("error").innerText = "Recheck your password";
    auth = false;
  }
  if (pwd == "") {
    document.getElementById("error").innerText = "Enter your password";
    auth = false;
  }

  if (auth == false) {
    document.getElementById("pwd").value = "";
    document.getElementById("cpwd").value = "";
  } else {
    setdetails();
  }
}

//To confirm location of the user
function loc() {
  marker1.setPosition({ lat: glat, lng: glong });
}

//To reset user's location
function reset() {
  document.getElementById("area").value = "Kalyan Nagar";
  map.setCenter({ lat: 13.027239970980778, lng: 77.63651315651865 });
  marker1.setPosition({ lat: 13.027239970980778, lng: 77.63651315651865 });
  auth = false;
  document.getElementById("locmsg").innerText = "Choose your area again!";
}

//Writing data in the firebase
async function setdetails() {
  await user_col
    .doc(user_id)
    .set({
      User_pwd: pwd,
      User_to: 2,  //going no where
      User_pts: 0,
      User_rides: 0,
      User_lat: glat,
      User_log: glong,
      User_area: area,
      User_choice: choice,
      User_sharer: " "
    })
    .then((resolve) => {
      console.log(`Data added`);
    })
    .catch((err) => {
      console.log(err);
    });
    var desp = document.getElementById("description").value;
    var name = document.getElementById("name").value;
    await review_col.doc(user_id).set({
      description: desp,
      rating: 0,
      reviews: [],
      name: name
    });

  //Writing data in either Sharee or Sharer
  if (choice == "sharee") {
    await sharee_col
      .doc(area)
      .update({
        Users: firebase.firestore.FieldValue.arrayUnion({
          userid: user_id,
          status: false,
        }),
      })
      .then((resolve) => {
        console.log(`Data added`);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    await sharer_col
      .doc(area)
      .update({
        Users: firebase.firestore.FieldValue.arrayUnion({
          userid: user_id,
          status: false,
        }),
      })
      .then((resolve) => {
        console.log(`Data added`);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  window.location.href = "Terms.html";
}

function next()
{
  if(document.getElementById("terms").checked == true)
  {
    window.location.href = "Pledge.html";
  }
  else
  document.getElementById("err").innerText = "Please agree to our terms and conditions!";
}

function pledge()
{
  window.location.href = "index.html";
}