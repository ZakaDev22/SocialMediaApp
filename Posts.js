import { BasURL } from "./BaseURLS.js";
import { PopUpMessage } from "./BaseFunctionsAndVariables.js";

document.getElementById("btnSavePost").addEventListener("click", async () => {
    let title = document.getElementById("post-title").value;
    let content = document.getElementById("post-body").value;
    let image = document.getElementById("post-img").files[0]; // Get the selected file
    
    // Create a FormData object
    let formData = new FormData();
    formData.append("title", title);
    formData.append("body", content);
    if (image) {
        formData.append("image", image); // Append the file only if it exists
    }
    
    try {
        // Send the FormData object to the API
        let response = await axios.post(`${BasURL}posts`, formData, {
        headers: {
            "Content-Type": "multipart/form-data", 
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        });
    
        PopUpMessage("Post created successfully!", "success");
        console.log(response.data); // Log the response data for debugging
    } catch (error) {
        console.error("Error creating post:", error);
        PopUpMessage("Failed to create post. Please try again.", "danger");
    }
});