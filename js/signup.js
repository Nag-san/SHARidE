//Sign-up and Login code

//Login user checking password with their username

window.onload = (event) => {
  try {
    var user = localStorage.getItem("user");
    var pwd = localStorage.getItem("pwd");
    document.getElementById("rollno").value = user;
    document.getElementById("pwd").value = pwd;
    document.getElementById("rollno").classList =
      "mt-1 p-2 border rounded-md focus:outline-none bg-gray-200 focus:border-red-500";
    document.getElementById("pwd").classList =
      "mt-1 p-2 border rounded-md focus:outline-none bg-gray-200 focus:border-red-500";
  } catch (err) {
    console.log(err);
  }
};
document
  .getElementById("submit")
  .addEventListener("click", async function login() {
    const db = firebase.firestore();
    let rollno = document.getElementById("rollno").value;
    let pwd = document.getElementById("pwd").value;
    rollno = rollno.toUpperCase();
    if (rollno.length === 0)
      document.getElementById("msg").innerText = "Umm, your name please?!";
    else if (pwd.length === 0)
      document.getElementById("msg").innerText =
        "Your confidential password please!";
    else {
      //Retreiving password from database
      const user_ref = db.collection("User_details").doc(rollno);
      await user_ref.get().then((doc) => {
        if (doc.exists) {
          const data = doc.data().User_pwd;
          if (pwd == data) {
            localStorage.setItem("user", rollno);
            localStorage.setItem("pwd", pwd);
            window.location.href = "html/user_main.html?" + rollno;
          } else {
            document.getElementById("msg").innerText =
              "Ooops, your password is wrong";
          }
        } else {
          console.log("no data");
          document.getElementById("msg").innerText =
            "Hey, you have to sign up before you sign in! Your account doesn't exist!";
        }
      });
    }
  });
