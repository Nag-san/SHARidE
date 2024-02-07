
//Declaring all collections
const db = firebase.firestore();
const sharee_col = db.collection("Sharee");
const user_col = db.collection("User_details");
const sharer_col = db.collection("Sharer");

logout.addEventListener('click', function logout()
{
    window.parent.postMessage('exitIframe','*');
}
)