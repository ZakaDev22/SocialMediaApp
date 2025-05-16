export function PopUpMessage(message="",LogMsg="",AlertType="alert-success") {
  let user = JSON.parse(localStorage.getItem("user")) || {};
  if (!user) {
    console.error("No user data found in localStorage.");
    return;
  }

  let userName = user.username || "";

  let div = document.createElement("div");
  div.innerHTML = `
           <div class="alert ${AlertType} d-flex flex-column justify-content-center align-items-center" role="alert">
              <h4 class="alert-heading">hello ${userName}</h4>
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
  div.style.zIndex = 1056; // Bootstrap modal z-index is 1055, so we use a higher value
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
        document.getElementById("curent-user-li").classList.add("d-none");
        HideUserProfileInNavBar();
    }
    else{
        loginBtn.classList.add("visually-hidden");
        registerBtn.classList.add("visually-hidden");
        logoutBtn.classList.remove("visually-hidden");
        document.getElementById("curent-user-li").classList.remove("d-none");

        ShowUserProfileInNavBar();
    }
}

export function ShowUserProfileInNavBar() {
  let user = JSON.parse(localStorage.getItem("user")) || {};
  let userName = user.username || "No User Name";

  let profileImg = document.getElementById("profile-image");
  let profileName = document.getElementById("profile-name");

  if (profileImg) {
    if (user.profile_image && typeof user.profile_image === "string" && user.profile_image.trim() !== "") {
      profileImg.onload = () => {
        console.log("Profile image loaded successfully:", user.profile_image);
      };

      profileImg.onerror = () => {
        console.error("Failed to load profile image:", user.profile_image);
        profileImg.src = "./Images/MaleImage.png"; // Set default image on error
      };

      profileImg.src = user.profile_image;
    } else {
      console.log("No profile image found, using default image.");
      profileImg.src = "./Images/MaleImage.png";
    }
  } else {
    console.error("Element with ID 'profile-image' not found!");
  }
  profileName.innerText = userName;

  document.getElementById("nav-profile").classList.remove("d-none");
}

export function HideUserProfileInNavBar(){
    document.getElementById("nav-profile").classList.add("d-none");
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

export function ShowLoadingBar() {
  let loadingBar = document.createElement("div");
  loadingBar.id = "loading-bar";
  loadingBar.innerHTML = `
    <div
      class="position-fixed top-50 start-50 translate-middle"
      style="z-index: 1056; width: 100px; height: 100px;"
    >
      <svg
        class="circular-progress"
        viewBox="0 0 50 50"
        style="width: 100%; height: 100%;"
      >
        <circle
          class="progress-ring"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="blue"
          stroke-width="5"
          stroke-dasharray="125.6"
          stroke-dashoffset="0"
        ></circle>
      </svg>
    </div>
  `;
  document.body.appendChild(loadingBar);
}

export function HideLoadingBar() {
  let loadingBar = document.getElementById("loading-bar");
  if (loadingBar) {
    document.body.removeChild(loadingBar);
  }
}

export function EnabelOrDesabelCommentsSection(){

  let token = localStorage.getItem("token") || "";
  let commentText = document.getElementById("commentText");
  let btnAddComment = document.getElementById("btnAddComment");

  if(token === ""){
    commentText.disabled = true;
    btnAddComment.disabled = true;
    commentText.placeholder = "Please log in to add a comment.";
    PopUpMessage("Please log in to add a comment.", "Log In", "alert-danger");
  }
  else{
    commentText.disabled = false;
    btnAddComment.disabled = false;
    commentText.placeholder = "Write your comment here...";
  }
}

export function hideModal(modalName) {
  
  const modal = document.getElementById(modalName);
  const modalInstance = bootstrap.Modal.getInstance(modal);
  if (modalInstance) {
    modalInstance.hide();
  } else {
    new bootstrap.Modal(modal).hide();
  }
}