import { BasURL } from "./BaseURLS.js";
import { PopUpMessage } from "./BaseFunctionsAndVariables.js";
import { ShowOrHideNavButtons } from "./BaseFunctionsAndVariables.js";
import { ShowUserProfileInNavBar } from "./BaseFunctionsAndVariables.js";
import { HideUserProfileInNavBar } from "./BaseFunctionsAndVariables.js";
import { ShowOrHideAddPostBtn } from "./BaseFunctionsAndVariables.js";

// ---------------functions Related To Register Part---------------- //

document.getElementById("register-btn").addEventListener("click", async () => {
  let userName = document.getElementById("register-user-name").value;
  let password = document.getElementById("register-password").value;
  let Name = document.getElementById("Personal-name").value;
  let email = document.getElementById("email").value;
  let image = document.getElementById("image").files[0]; // Get the selected file

  // Create a FormData object
  let formData = new FormData();
  formData.append("username", userName);
  formData.append("password", password);
  formData.append("name", Name);
  formData.append("email", email);
  if (image) {
    formData.append("image", image); // Append the file only if it exists
  }

  try {
    // Send the FormData object to the API
    let response = await axios.post(`${BasURL}register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set the correct header
      },
    });

    // Save the token and user data in localStorage
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    // Hide the modal
    let modal = document.getElementById("RegisterModal");
    let modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    } else {
      modal = new bootstrap.Modal(modal);
      modal.hide();
    }

    // Show success message
    PopUpMessage("Registration successful!", "success");
    ShowOrHideNavButtons();
    ShowUserProfileInNavBar();
    ShowOrHideAddPostBtn();
  } catch (error) {
    console.error("Error during registration:", error);
    PopUpMessage("Registration failed. Please try again.", "danger");
    HideUserProfileInNavBar();
    ShowOrHideAddPostBtn();
  }
});
