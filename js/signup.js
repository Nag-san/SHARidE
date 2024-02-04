//Sign-up and Login code

//Login user checking password with their username

async function login() {
  const db = firebase.firestore();
  let rollno = document.getElementById("rollno").value;
  let pwd = document.getElementById("pwd").value;
  rollno = rollno.toUpperCase();
  if(rollno.length === 0)
  document.getElementById("msg").innerText = "Umm, your name please?!"; 
  else if(pwd.length === 0)
  document.getElementById("msg").innerText = "Your confidential password please!";
  else{
  //Retreiving password from database
  const user_ref = db.collection("User_details").doc(rollno);
  await user_ref.get().then((doc) => {
    if (doc.exists) {
      const data = doc.data().User_pwd;
      if (pwd == data) {
        window.localStorage.setItem("user", rollno);
        window.localStorage.setItem("pwd", pwd);
        window.location.href = "user_homepage.html?" + rollno;
      } else {
        document.getElementById("msg").innerText = "Ooops, your password is wrong";
      }
    } else {
      console.log("no data");
      document.getElementById("msg").innerText = "Hey, you have to sign up before you sign in! Your account doesn't exist!";
    }
  });
}
}

//Sign up user authentication, checking otp with college email id
function user_auth() {
  var i = 0;
  let user_email = document.getElementById("email").value;
  let otp = document.getElementById("otp").value;
  if(user_email.length===0)
  document.getElementById("msg1").innerText = "Jayantians enter your college id!";
 else if (otp.length===0)
 document.getElementById("msg1").innerText = "Check your emails for the secret code!";
else{
  if (otp != "1234") {
    document.getElementById("email").value = "";
    document.getElementById("otp").value = "";
    document.getElementById("msg1").innerText = "Oops you got the code wrong!";
    return;
  }
  for (i; i <= user_email.length; i++) {
    if (user_email[i] == "@") break;
  }
  let email = user_email.substring(i, user_email.length);
  if (email != "@kristujayanti.com") {
    document.getElementById("email").value = " ";
    document.getElementById("msg1").innerText = "Hey, this is for Jayantians only. For now!";
    return;
  }
  let user_id = user_email.substring(0, i);
  user_id = user_id.toUpperCase();
  window.location.href = "user_detail.html?" + user_id;
}
}