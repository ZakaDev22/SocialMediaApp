import { BasURL } from "./BaseURLS.js";

import { registerBtn } from "./BaseFunctionsAndVaraibels.js";


// ---------------functions Related To Register Part---------------- //
  
registerBtn.addEventListener("click", async () => {
    let userName = document.getElementById("user-name").value;
    let password = document.getElementById("password").value;
    let email = document.getElementById("email").value;
    let registerData = {
        username: userName,
        password: password,
        email: email,
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
        alert("Error during registration:", error);
    }
});
