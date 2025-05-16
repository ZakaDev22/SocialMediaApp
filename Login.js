import { BasURL } from "./BaseURLS.js";
import {
  hideModal,
  PopUpMessage,
  logoutBtn,ShowOrHideNavButtons,ShowUserProfileInNavBar,
  HideUserProfileInNavBar,ShowOrHideAddPostBtn,
  ShowLoadingBar,HideLoadingBar
} 
from "./BaseFunctionsAndVariables.js";

import {FetchingPosts} from "./home.js";


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
    ShowLoadingBar();
    let response = await axios.post(`${BasURL}login`, loginData);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
   
    hideModal("loginModal");
    
    ShowOrHideNavButtons();
    ShowUserProfileInNavBar();
    ShowOrHideAddPostBtn();
    PopUpMessage(
      "Aww yeah, you successfully Logged In To The System, Enjow Your Time",
      "LogOut",
      "alert-success"
    );
    FetchingPosts();
  } catch (error) {
    console.log(error);
    let erroMessage = error.response?.data?.message || "Failed to delete post.";

    PopUpMessage(erroMessage, "Log In", "alert-danger");
  }
  finally {
    HideLoadingBar();
  }
});



logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  ShowOrHideNavButtons();
    HideUserProfileInNavBar();
    ShowOrHideAddPostBtn();
  PopUpMessage("Success, You Have LogOut From The System", "Log In", "alert-danger");
  FetchingPosts();
});

