import { BasURL } from "./BaseURLS.js";
import { PopUpMessage } from "./BaseFunctionsAndVariables.js";
import { logoutBtn } from "./BaseFunctionsAndVariables.js";
import {ShowOrHideNavButtons} from "./BaseFunctionsAndVariables.js";
import { ShowUserProfileInNavBar } from "./BaseFunctionsAndVariables.js";
import { HideUserProfileInNavBar } from "./BaseFunctionsAndVariables.js";
import { ShowOrHideAddPostBtn } from "./BaseFunctionsAndVariables.js";


ShowOrHideNavButtons(); // call the function to show or hide the nav buttons based on the token
ShowOrHideAddPostBtn(); // call the function to show or hide the add post button based on the token


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
    ShowOrHideAddPostBtn();
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
    ShowOrHideAddPostBtn();
  PopUpMessage("Success, You Have LogOut From The System", "Log In", "alert-danger");
});

