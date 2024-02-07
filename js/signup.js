//Sign-up and Login code

//Login user checking password with their username

submit.addEventListener('click', async function login() {
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
        window.location.href = "user_main.html?"+rollno;
      } else {
        document.getElementById("msg").innerText = "Ooops, your password is wrong";
      }
    } else {
      console.log("no data");
      document.getElementById("msg").innerText = "Hey, you have to sign up before you sign in! Your account doesn't exist!";
    }
  });
}
})
