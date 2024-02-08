
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

//Page 1

function get_userid(url) {
  var i = 0;
  for (i; i < url.length; i++) {
    if (url[i] == "?") break;
     }
  user_id = url.substring(i+1);
  return user_id;
}

//To display hi message and get user green points
 async function hi() {
  console.log("hello");
   var choice, data;
   var url = document.location.href;
   localStorage.setItem("curr_page",url);
  user_id = get_userid(url);
  document.getElementById("hi").innerText = `Hi ${user_id} !`;
  await user_col
    .doc(user_id)
     .get()
     .then((doc) => {
       choice = doc.data().User_choice;
       if (choice == "sharer") {
         data = doc.data().User_pts;
         document.getElementById(
           "user_points"
         ).innerText = `You have ${data} green points!`;
       } else
       {
         data = doc.data().User_rides;
         document.getElementById(
           "user_points"
         ).innerText = `You have shared ${data} rides!`;
       }
     })
}

window.onload= (event)=>{
  hi();
};

//To transfer focus
document.getElementById("Book").addEventListener('click', function book() {
    window.parent.postMessage(`user_homepage2.html`,'*');
})



