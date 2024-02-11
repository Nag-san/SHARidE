//Sign up user authentication, checking otp with college email id
signin.addEventListener("click", function user_auth() {
  var i = 0;
  let user_email = document.getElementById("email").value;
  let otp = document.getElementById("otp").value;
  if (user_email.length === 0)
    document.getElementById("msg1").innerText =
      "Jayantians enter your college id!";
  else if (otp.length === 0)
    document.getElementById("msg1").innerText =
      "Check your emails for the secret code!";
  else {
    if (otp != "1234") {
      document.getElementById("email").value = "";
      document.getElementById("otp").value = "";
      document.getElementById("msg1").innerText =
        "Oops you got the code wrong!";
      return;
    }
    for (i; i <= user_email.length; i++) {
      if (user_email[i] == "@") break;
    }
    let email = user_email.substring(i, user_email.length);
    if (email != "@kristujayanti.com") {
      document.getElementById("email").value = " ";
      document.getElementById("msg1").innerText =
        "Hey, this is for Jayantians only. For now!";
      return;
    }
    let user_id = user_email.substring(0, i);
    user_id = user_id.toUpperCase();
    window.location.href = "user_detail.html?" + user_id;
  }
});
