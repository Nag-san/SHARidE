//Declaring all collections
const db = firebase.firestore();
const sharee_col = db.collection("Sharee");
const user_col = db.collection("User_details");
const sharer_col = db.collection("Sharer");
const user_rev = db.collection("User_reviews");

function get_userid(url) {
  var i = 0;
  for (i; i < url.length; i++) {
    if (url[i] == "?") break;
  }
  var user_id = url.substring(i + 1);
  return user_id;
}

logout.addEventListener("click", function logout() {
  window.parent.postMessage("exitIframe", "*");
});

document
  .getElementById("Personal_update")
  .addEventListener("click", async function () {
    document.getElementById("err").innerText = " ";
    document.getElementById("Personal_update").disabled = true;
    document.getElementById("Choice_update").disabled = false;
    document.getElementById("Location_update").disabled = false;

    var container = document.getElementById("Update");
    container.innerHTML = "";
    var t1 = document.createElement("input");
    var l1 = document.createElement("Label");
    var t2 = document.createElement("input");
    var l2 = document.createElement("Label");
    var t3 = document.createElement("input");
    var l3 = document.createElement("Label");
    var t4 = document.createElement("input");
    var l4 = document.createElement("Label");
    var btn = document.createElement("button");

    l1.setAttribute("for", t1);
    l1.innerHTML = "Name: ";

    l2.setAttribute("for", t2);
    l2.innerHTML = "Bio: ";

    l3.setAttribute("for", t3);
    l3.innerHTML = "Password: ";

    l4.setAttribute("for", t4);
    l4.innerHTML = "Confirm password: ";

    var user_id = get_userid(window.location.href);
    var pwd;
    var name;
    var bio;

    await user_col
      .doc(user_id)
      .get()
      .then((doc) => {
        pwd = doc.data().User_pwd;
      });

    await user_rev
      .doc(user_id)
      .get()
      .then((doc) => {
        (name = doc.data().name), (bio = doc.data().description);
      });

    t3.setAttribute("type", "password");
    t4.setAttribute("type", "password");

    t1.value = name;
    t2.value = bio;
    t3.value = pwd;
    t4.value = pwd;

    btn.innerText = "Update";

    t1.classList =
      "mt-1 p-2 border rounded-md focus:outline-none focus:border-red-500";
    container.appendChild(l1);
    container.appendChild(t1);
    t2.classList =
      "mt-1 p-2 border rounded-md focus:outline-none focus:border-red-500";
    container.appendChild(l2);
    container.appendChild(t2);
    t3.classList =
      "mt-1 p-2 border rounded-md focus:outline-none focus:border-red-500";
    container.appendChild(l3);
    container.appendChild(t3);
    t4.classList =
      "mt-1 p-2 border rounded-md focus:outline-none focus:border-red-500";
    container.appendChild(l4);
    container.appendChild(t4);

    btn.addEventListener("click", async function () {
      name = t1.value;
      bio = t2.value;
      if (t3.value == t4.value) {
        pwd = t3.value;
      } else {
        document.getElementById("err").innerText = "Hey, recheck your password";
        return;
      }

      await user_col.doc(user_id).update({
        User_pwd: pwd,
      });

      await user_rev.doc(user_id).update({
        name: name,
        description: bio,
      });

      document.getElementById("err").innerText = "Updated successfully!";
    });

    btn.classList =
      "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-5";
    container.appendChild(btn);
  });

document
  .getElementById("Choice_update")
  .addEventListener("click", async function () {
    document.getElementById("err").innerText = " ";
    document.getElementById("Choice_update").disabled = true;
    document.getElementById("Personal_update").disabled = false;
    document.getElementById("Location_update").disabled = false;

    var container = document.getElementById("Update");
    container.innerHTML = "";

    var r1 = document.createElement("input");
    r1.setAttribute("type", "radio");
    var r2 = document.createElement("input");
    r2.setAttribute("type", "radio");
    var l1 = document.createElement("Label");
    l1.innerHTML = "Sharee: ";
    var l2 = document.createElement("Label");
    l2.innerHTML = "Sharer: ";
    var l3 = document.createElement("Label");
    l3.innerHTML = "Choose your role: ";
    var d1 = document.createElement("div");
    var d2 = document.createElement("div");

    r1.setAttribute("name", "choice");
    r2.setAttribute("name", "choice");
    r1.setAttribute("id", "sharee");
    r2.setAttribute("id", "sharer");

    var user_choice;
    var area;
    var user_id = get_userid(window.location.href);

    await user_col
      .doc(user_id)
      .get()
      .then((doc) => {
        (user_choice = doc.data().User_choice), (area = doc.data().User_area);
      });

    var sharee = sharee_col.doc(area);
    var sharer = sharer_col.doc(area);

    if (user_choice == "sharee") {
      r1.checked = true;
    } else {
      r2.checked = true;
    }
    d1.classList =
      "flex flex-col bg-green-200 p-6 rounded-lg space-y-4 self-stretch";
    d2.classList = "flex items-center space-x-8";
    container.appendChild(d1);
    d1.appendChild(l3);
    d1.appendChild(d2);
    d2.appendChild(l1);
    d2.appendChild(r1);
    d2.appendChild(l2);
    d2.appendChild(r2);

    var btn = document.createElement("button");
    btn.innerText = "Update";

    btn.addEventListener("click", async function () {
      if (r1.checked && user_choice != "sharee") {
        await user_col.doc(user_id).update({
          User_choice: "sharee",
        });

        await sharer_col.doc(area).update({
          Users: firebase.firestore.FieldValue.arrayRemove({
            userid: user_id,
            status: false,
          }),
        });

        await sharee_col.doc(area).update({
          Users: firebase.firestore.FieldValue.arrayUnion({
            userid: user_id,
            status: false,
          }),
        });
      } else if (r2.checked && user_choice != "sharer") {
        await user_col.doc(user_id).update({
          User_choice: "sharer",
        });

        await sharee_col.doc(area).update({
          Users: firebase.firestore.FieldValue.arrayRemove({
            userid: user_id,
            status: false,
          }),
        });

        await sharer_col.doc(area).update({
          Users: firebase.firestore.FieldValue.arrayUnion({
            userid: user_id,
            status: false,
          }),
        });
      }
      document.getElementById("err").innerText = "Updated successfully!";
    });
    btn.classList =
      "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-5";
    container.appendChild(btn);
  });

document
  .getElementById("Location_update")
  .addEventListener("click", async function () {
    document.getElementById("err").innerText = " ";
    document.getElementById("Choice_update").disabled = false;
    document.getElementById("Personal_update").disabled = false;
    document.getElementById("Location_update").disabled = true;

    var container = document.getElementById("Update");
    container.innerHTML = "";
    var glat;
    var glong;
    var ulat;
    var ulong;
    var user_area;
    var user_choice;
    var user_id = get_userid(window.location.href);
    await user_col
      .doc(user_id)
      .get()
      .then((doc) => {
        console.log(doc.data().User_lat);
        user_area = doc.data().User_area;
        user_choice = doc.data().User_choice;
        (glat = doc.data().User_lat), (glong = doc.data().User_log);
      });

    var areas = ["Kalyan Nagar", "KR Puram", "Hennur", "Hebbal"];

    let s = document.createElement("select");
    s.setAttribute("id", "select1");
    for (var i = 0; i < 4; i++) {
      var option = document.createElement("option");
      option.text = areas[i];
      option.value = areas[i];
      s.appendChild(option);
    }
    s.classList = "rounded-md w-52 p-1 border border-gray-300";
    container.appendChild(s);

    s.value = user_area;
    document.getElementById("select1").addEventListener("change", function () {
      var area1 = s.value;
      if (area1 == "Hennur") {
        map.setCenter({ lat: 13.038167023942243, lng: 77.6434407896191 });
        marker1.setPosition({ lat: 13.038167023942243, lng: 77.6434407896191 });
      } else if (area1 == "KR Puram") {
        map.setCenter({ lat: 13.017553963882222, lng: 77.70440617135745 });
        marker1.setPosition({
          lat: 13.017553963882222,
          lng: 77.70440617135745,
        });
      } else if (area1 == "Hebbal") {
        map.setCenter({ lat: 13.035802644453957, lng: 77.5977116982567 });
        marker1.setPosition({ lat: 13.035802644453957, lng: 77.5977116982567 });
      } else {
        map.setCenter({ lat: 13.027239970980778, lng: 77.63651315651865 });
        marker1.setPosition({
          lat: 13.027239970980778,
          lng: 77.63651315651865,
        });
      }
    });

    let map1 = document.createElement("map");
    let l1 = document.createElement("Label");
    l1.innerText =
      "Choose location by dragging the marker and then click on it, once chosen!";
    map1.setAttribute("width", "240px");
    map1.setAttribute("height", "240px");
    map1.setAttribute("id", "map1");
    container.appendChild(l1);
    container.appendChild(map1);
    const map = new mappls.Map("map1", {
      fullscreenControl: false,
      center: { lat: glat, lng: glong },
    });

    const marker1 = new mappls.Marker({
      map: map,
      draggable: true,
      fitbounds: true,
      width: 35,
      height: 50,
      popupHtml: "Your location ",
      position: { lat: glat, lng: glong },
    });

    marker1.addListener("click", function () {
      let pos1 = marker1.getPosition();
      l1.innerText = "Your location is now saved!";
      marker1.setIcon(
        "https://www.pngall.com/wp-content/uploads/2017/05/Map-Marker-Free-Download-PNG.png"
      );
      ulat = pos1.lat;
      ulong = pos1.lng;
    });

    var btn = document.createElement("button");
    btn.innerText = "Update";

    btn.addEventListener("click", async function () {
      var area = document.getElementById("select1").value;

      if (user_area != area) {
        console.log(user_area, area);
        await user_col.doc(user_id).update({
          User_area: area,
          User_lat: ulat,
          User_log: ulong,
        });

        if (user_choice == "sharee") {
          await sharee_col.doc(user_area).update({
            Users: firebase.firestore.FieldValue.arrayRemove({
              userid: user_id,
              status: false,
            }),
          });

          await sharee_col.doc(area).update({
            Users: firebase.firestore.FieldValue.arrayUnion({
              userid: user_id,
              status: false,
            }),
          });
        } else {
          await sharer_col.doc(user_area).update({
            Users: firebase.firestore.FieldValue.arrayRemove({
              userid: user_id,
              status: false,
            }),
          });

          await sharer_col.doc(area).update({
            Users: firebase.firestore.FieldValue.arrayUnion({
              userid: user_id,
              status: false,
            }),
          });
        }
      }
      document.getElementById("err").innerText = "Updated Successfully!";
    });
    btn.classList =
      "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-5";
    container.appendChild(btn);
  });
