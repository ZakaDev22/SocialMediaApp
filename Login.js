import { BasURL } from "./BaseURLS.js";
import { PopUpMessage } from "./BaseFunctionsAndVaraibels.js";
import { logoutBtn } from "./BaseFunctionsAndVaraibels.js";
import {ShowOrHideNavButtons} from "./BaseFunctionsAndVaraibels.js";
import { ShowUserProfileInNavBar } from "./BaseFunctionsAndVaraibels.js";
import { HideUserProfileInNavBar } from "./BaseFunctionsAndVaraibels.js";
import { SHowOrHideAddPostBtn } from "./BaseFunctionsAndVaraibels.js";


ShowOrHideNavButtons(); // call the function to show or hide the nav buttons based on the token
SHowOrHideAddPostBtn(); // call the function to show or hide the add post button based on the token

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
    ShowUserProfileInNavBar();
    SHowOrHideAddPostBtn();
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
    HideUserProfileInNavBar();
    SHowOrHideAddPostBtn();
  PopUpMessage("Success, You Have LogOut From The System", "Log In", "alert-danger");
});

