
export function PopUpMessage(message,LogMsg,AlertType) {
  let user = JSON.parse(localStorage.getItem("user")) || {};
  if (!user) {
    console.error("No user data found in localStorage.");
    return;
  }

  let userName = user.username || "No User Name";

  let div = document.createElement("div");
  div.innerHTML = `
           <div class="alert ${AlertType} d-flex flex-column justify-content-center align-items-center" role="alert">
              <h4 class="alert-heading">Well done ${userName}</h4>
              <p>${message}</p>
               <hr>
               <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
</svg>
               <hr/>
              <p class="mb-0">You Still have The Option to ${LogMsg} Anytime 😊</p>
           </div>
     `;

  div.classList.add(
    "position-fixed",
    "top-50",
    "start-50",
    "translate-middle",
    "text-center",
    "shadow",
    "rounded",
    "animate__animated",
    "animate__fadeIn"
  );
  div.style.zIndex = 2;
  document.body.appendChild(div);

  setTimeout(() => {
    div.classList.add("animate__fadeOut");
    setTimeout(() => {
      document.body.removeChild(div);
    }, 1000);
  }, 3000);
}


export let loginBtn = document.getElementById("loginbtn");
export let registerBtn = document.getElementById("btnRegister");
export let logoutBtn = document.getElementById("btnLogout");

export function ShowOrHideNavButtons(){

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

export function ShowUserProfileInNavBar(){
    let user = JSON.parse(localStorage.getItem("user")) || {};
    let userName = user.username || "No User Name";
    let userImage = user.profile_image || "No Image";

    let profileImg = document.getElementById("profile-image");
    let profileName = document.getElementById("profile-name");

    profileImg.src = userImage == "No Image" ? "https://via.placeholder.com/150" : userImage;
    profileName.innerText = userName;

    document.getElementById("nav-profile").classList.remove("visually-hidden");
}

export function HideUserProfileInNavBar(){
    document.getElementById("nav-profile").classList.add("visually-hidden");
}

export function ShowOrHideAddPostBtn(){

    let token = localStorage.getItem("token") || "";
    let addPostBtn = document.getElementById("btnAddPost");

    if(token === ""){
        addPostBtn.classList.add("visually-hidden");
    }
    else{
        addPostBtn.classList.remove("visually-hidden");
    }
}