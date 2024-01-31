//Sign-up and Login code

//Login user checking password with their username

async function login() {
  const db = firebase.firestore();
  let rollno = document.getElementById("rollno").value;
  let pwd = document.getElementById("pwd").value;
  rollno = rollno.toUpperCase();
  const user_ref = db.collection("User_details").doc(rollno);

  //Retreiving password from database
  await user_ref.get().then((doc) => {
    if (doc.exists) {
      const data = doc.data().User_pwd;
      if (pwd == data) {
        window.location.href = "user_homepage.html?" + rollno;
      } else {
        document.getElementById("msg").innerText = "Wrong password";
      }
    } else {
      console.log("no data");
      document.getElementById("msg").innerText = "Account does not exist";
    }
  });
}

//Sign up user authentication, checking otp with college email id
function user_auth() {
  var i = 0;
  let user_email = document.getElementById("email").value;
  let otp = document.getElementById("otp").value;
  if (otp != "1234") {
    document.getElementById("email").value = "";
    document.getElementById("otp").value = "";
    return;
  }
  for (i; i <= user_email.length; i++) {
    if (user_email[i] == "@") break;
  }
  let email = user_email.substring(i, user_email.length);
  if (email != "@kristujayanti.com") {
    document.getElementById("email").value = " ";
    return;
  }
  let user_id = user_email.substring(0, i);
  user_id = user_id.toUpperCase();
  window.location.href = "user_detail.html?" + user_id;
}
