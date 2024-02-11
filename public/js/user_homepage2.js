//Declaring all collections
const db = firebase.firestore();
const sharee_col = db.collection("Sharee");
const user_col = db.collection("User_details");
const sharer_col = db.collection("Sharer");

//Page 2
function get_userid(url) {
  var i = 0;
  for (i; i < url.length; i++) {
    if (url[i] == "?") break;
  }
  var user_id = url.substring(i + 1);
  return user_id;
}

//To ensure different to and from options are chosen
document.getElementById("from").addEventListener("click", function select() {
  if (document.getElementById("from").value == "Home") {
    document.getElementById("to").value = "College";
  } else {
    document.getElementById("to").value = "Home";
  }
});

//To go back
document
  .getElementById("Previous1")
  .addEventListener("click", function Previous1() {
    window.parent.postMessage("user_homepage.html", "*");
  });

console.log("user_homepage2");

document
  .getElementById("ShareRide")
  .addEventListener("click", async function Next1() {
    var user_id = get_userid(window.location.href);
    if (document.getElementById("from").value == "Home") {
      await user_col.doc(user_id).update({
        User_to: 1, //going to college
      });
    } else {
      await user_col.doc(user_id).update({
        User_to: 0, //going to home
      });
    }
    var choice;
    await user_col
      .doc(user_id)
      .get()
      .then((doc) => {
        choice = doc.data().User_choice;
      });

    if (choice == "sharee") window.parent.postMessage("sharee_page.html", "*");
    else window.parent.postMessage("sharer_page.html", "*");
  });
