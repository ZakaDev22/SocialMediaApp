import { BasURL } from "./BaseURLS.js";
import { PopUpMessage } from "./BaseFunctionsAndVaraibels.js";

import { logoutBtn } from "./BaseFunctionsAndVaraibels.js";

import {ShowOrHideNavButtons} from "./BaseFunctionsAndVaraibels.js";



ShowOrHideNavButtons();

document.getElementById("btnLogin").addEventListener("click", async () => {
  let userName = document.getElementById("user-name").value;
  let password = document.getElementById("password").value;
  let loginData = {
    username: userName,
    password: password,
  };
  try {
    let response = await axios.post(`${BasURL}login`, loginData);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    let modal = document.getElementById("loginModal");
    let modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    } else {
      modal = new bootstrap.Modal(modal);
      modal.hide();
    }
    
    ShowOrHideNavButtons();
    PopUpMessage(
      "Aww yeah, you successfully Logged In To The System, Enjow Your Time",
      "LogOut",
      "alert-success"
    );
  } catch (error) {
    alert("Error during login:", error);
  }
});



logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  ShowOrHideNavButtons();
  PopUpMessage("Success, You Have LogOut From The System", "Log In", "alert-danger");
});

