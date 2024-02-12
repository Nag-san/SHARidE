//Declaring all collections
const db = firebase.firestore();
const sharee_col = db.collection("Sharee");
const user_col = db.collection("User_details");
const sharer_col = db.collection("Sharer");
const user_rev = db.collection("User_reviews");

window.onload = async function load(){
    var users1;
    var gps = [];
    const us = await user_col.doc().get();
    users1 = JSON.parse(us);
    console.log(users1);
}