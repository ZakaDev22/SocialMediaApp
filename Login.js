import { BasURL } from "./BaseURLS.js";
import { PopUpMessage } from "./BaseFunctions.js";


// functions Related To Loging Part //
let loginBtn = document.getElementById("loginbtn");
let registerBtn = document.getElementById("btnRegister");
let logoutBtn = document.getElementById("btnLogout");

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

function ShowOrHideNavButtons(){

    let token = localStorage.getItem("token") || "";

    if(token === ""){ 
        loginBtn.classList.remove("visually-hidden");
        registerBtn.classList.remove("visually-hidden");
        logoutBtn.classList.add("visually-hidden");
    }
    else{
        loginBtn.classList.add("visually-hidden");
        registerBtn.classList.add("visually-hidden");
        logoutBtn.classList.remove("visually-hidden");
    }
}

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  ShowOrHideNavButtons();
  PopUpMessage("Success, You Have LogOut From The System", "Log In", "alert-danger");
});

// ========== End ============== //

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

// ================= End ======= //
