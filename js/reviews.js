//Declaring all collections from Firebase
const db = firebase.firestore();
const sharee_col = db.collection("Sharee");
const user_col = db.collection("User_details");
const sharer_col = db.collection("Sharer");
const review_col = db.collection("User_reviews");

async function hi() {
    var i = 0;
    var rating;
    var desp;
    var url = document.location.href;
    for (i; i <= url.length; i++) {
      if (url[i] == "?") break;
    }
    url = url.substring(i+1);
    document.getElementById("username").innerText = url;
    await review_col.doc(url).get()
    .then((doc)=>{
        desp = doc.data().description,
        rating = doc.data().rating
    })
    .catch((err)=>{
        console.log(err);
    });
    document.getElementById("bio").innerText = `Bio: ${desp}`;
    
    await review_col.doc(url).get()
    .then((doc)=>{
        let rev = doc.data().reviews
        for(i=0; rev[i]!= undefined;i++)
        {
            let text2 = document.createTextNode(rev[i]);
            let td = document.createElement("td");
            td.appendChild(text2);
            tr.appendChild(td);
            document.getElementById("review").appendChild(tr);
        }
    })
    .catch((err)=>{
        console.log(err);
    });
    rating = rating/i;
    document.getElementById("rating").innerText = `Average rating: ${rating}`;
} 