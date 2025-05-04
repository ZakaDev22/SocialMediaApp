import { BasURL } from "./BaseURLS.js";
import { PopUpMessage } from "./BaseFunctionsAndVaraibels.js";
import { ShowOrHideNavButtons } from "./BaseFunctionsAndVaraibels.js";

// ---------------functions Related To Register Part---------------- //
  
document.getElementById("register-btn").addEventListener("click", async () => {

  let userName = document.getElementById("register-user-name").value;
  let password = document.getElementById("register-password").value;
  let Name = document.getElementById("Personal-name").value;
  let email = document.getElementById("email").value;
//   let image = document.getElementById("image").value;

  let registerData = {
    username: userName,
    password: password,
    name: Name,
    email: email
    // image: image,
  };
  try {
    let response = await axios.post(`${BasURL}register`, registerData);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    let modal = document.getElementById("RegisterModal");
    let modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    } else {
      modal = new bootstrap.Modal(modal);
      modal.hide();
    }

    ShowOrHideNavButtons();
    PopUpMessage(
      "Aww yeah, you successfully Registered In To The System, Enjow Your Time",
      "LogOut",
      "alert-success"
    );
  } catch (error) {
    
    console.log(error);
    PopUpMessage(
      "An error occurred during registration.",
      "LogOut",
      "alert-danger"
    );
  }
});
