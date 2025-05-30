import { BasURL } from "./BaseURLS.js";
import {
  PopUpMessage,
  ShowLoadingBar,
  HideLoadingBar,
  EnabelOrDesabelCommentsSection,
  hideModal
} from "./BaseFunctionsAndVariables.js";

let currentPage = 1;
let postLimits = 10;
let lastPage = 0;
let isFetching = false;
let AddEditePost = false; // false For the default = add new
let CurrentpostId = 0; // For the default = add new

export async function FetchingPosts() {
  let posts = await GetPosts();
  if (!posts || !posts.data) {
    console.error("No data received from the API.");
    return; // Exit early if no data
  }
  let postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = ""; // Clear previous posts

  // Filter out posts from the banned user (2183) and posts with name "sexy"
  let validPosts = posts.data.filter(
    (post) => post.author.id !== 2183 && post.author.name !== "sexy"
  );

  for (let post of validPosts) {
    let card = GenerateNewCard(post);
    postsContainer.innerHTML += card;
  }
}

async function GetPosts() {
  try {
    ShowLoadingBar();
    let response = await axios.get(`${BasURL}posts?limit=${postLimits}&page=${currentPage}`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch posts");
    }
    lastPage = response.data.meta.last_page; // Get the last page number
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
  finally{
    HideLoadingBar();
  }
}

function CreateTag(tag) {
  let tagElement = `<span class="badge bg-primary text-light m-1">${tag}</span>`;
  return tagElement;
}

function GenerateNewCard(post) {
  let authorImage = "./Images/MaleImage.png"; // Default image
  if (post.author && post.author.profile_image && typeof post.author.profile_image === 'string' && post.author.profile_image.trim() !== "") {
    authorImage = post.author.profile_image;
  }

  let authorUsername = post.author?.username ?? "No User Name";

  let postImage = "./Images/walpaper.jpg"; // Default image
  if (post.image && typeof post.image === 'string' && post.image.trim() !== "") {
    postImage = post.image;
  }

  let PostTags = post.tags || [];

  let EditeAndDeleteButtons = "";
  let user = JSON.parse(localStorage.getItem("user")) || {};
  let currentUserId = user.id;
  if (currentUserId === post.author.id) {
      EditeAndDeleteButtons = `
       <button class="btnEditePost btn btn-outline-light float-end edite-post-btn mx-2" data-post-id="${post.id}">
              Edite
     </button>
     <button class="btnDeletePost btn btn-outline-danger float-end delete-post-btn ms-2" data-post-id="${post.id}">
              Delete
      </button>`;
  }

  let card = `
       <div id="${post.id}" class="card col-md-9 mt-2 mb-1 shadow-lg">
          <div id="author-info"  data-user-id="${post.author.id}" class="card-header" style="color: black; background-color:#73b8a1;">
              <img
                src="${authorImage}"
                alt = "No Image"
                class=" rounded-circle border border-primary shadow"
                width="70"
                height="70"
              />
              <strong class="card-title">${authorUsername}</strong>
            ${EditeAndDeleteButtons}
          </div>
          <div class="card-body " style="max-height: 350px;"">
            <img
              src="${postImage}"
              alt="No Image"
              class="w-100 img-fluid rounded shadow"
              style="max-height: 200px; object-fit: cover;"  /* Added style */
            />
            <small style="color: grey" class="d-block mt-1">${
              post.created_at
            }</small>

            <h5 class="mt-1">${post.title || "there is No Title Yet"}</h5>
            <p>
             ${post.body || "No Body Yet"}
            </p>

            <hr />
            <p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-chat-text-fill"
                viewBox="0 0 16 16"
              >
                <path
                  d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M4.5 5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z"
                />
              </svg>
              <strong> (${post.comments_count}) Comments</strong>
              ${PostTags.forEach((tag) => CreateTag(tag)) || ""}
            </p>
          </div>
        </div>
    `;

  return card;
}

function ChangePostModalTitle(Titelcontent){
  let postTitle = document.getElementById("AddPostModalTitel");
  if (postTitle) {
    postTitle.innerHTML = `${Titelcontent} Post`;
  } else {
    console.log("Post title element not found");
  }

}

document.getElementById("btnAddPost").addEventListener("click", () => {
  ChangePostModalTitle("Add New");
  document.getElementById("post-title").value = ""; // Clear the title input
  document.getElementById("post-body").value = ""; // Clear the body input
  document.getElementById("post-img").disabled = false; // Enable the image input field
  let addPostModal = new bootstrap.Modal(
    document.getElementById("addPostModal")
  );
  addPostModal.toggle();
});

async function EditePost(postID){

  ChangePostModalTitle("Edite");
  let editeModal = new bootstrap.Modal(document.getElementById("addPostModal"));

  try{
    ShowLoadingBar();
    let response = await axios.get(`${BasURL}posts/${postID}`);
    let post = response.data.data;

    // Get the current user ID from localStorage
    let user = JSON.parse(localStorage.getItem("user")) || {};
    let currentUserId = user.id;

    // Check if the current user is the author of the post
    if (currentUserId !== post.author.id) {
      PopUpMessage(
        "You are not authorized to edit this post.",
        "",
        "alert-warning"
      );
      return; // Exit the function if the user is not authorized
    }

    document.getElementById("post-title").value = post.title || "";
    document.getElementById("post-body").value = post.body || "";

    AddEditePost = true; // Set the flag to true for editing
    CurrentpostId = postID; // Set the current post ID for editing

    editeModal.toggle();
  }
  catch(error){
    PopUpMessage(`Failed to get the Post With ID ${postID}. Please try again.`,"", "alert-danger");
  }
  finally{
         HideLoadingBar();
  }
}
async function DeletePost(postID) {

  
  try {
    ShowLoadingBar();

    let response = await axios.get(`${BasURL}posts/${postID}`);
    let post = response.data.data;

    // Get the current user ID from localStorage
    let user = JSON.parse(localStorage.getItem("user")) || {};
    let currentUserId = user.id;

    // Check if the current user is the author of the post
    if (currentUserId !== post.author.id) {
      PopUpMessage(
        "You are not authorized to Delete this post.",
        "",
        "alert-warning"
      );
      return; // Exit the function if the user is not authorized
    }
    // Confirm with the user before deleting
    if (!confirm("Are you sure you want to delete this post?")) {
      return; // If the user cancels, exit the function
    }

    // Send the DELETE request to the API
    await axios.delete(`${BasURL}posts/${postID}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    PopUpMessage("Post deleted successfully!", "success");

    // Refresh the posts after successful deletion
    setTimeout(async () => {
      await FetchingPosts();
    }, 2000);
  } catch (error) {
    console.error("Error deleting post:", error);
    let erroMessage = error.response?.data?.message || "Failed to delete post.";
    PopUpMessage(erroMessage, "", "alert-danger");
  } finally {
    HideLoadingBar();
  }
}
window.addEventListener("scroll", async () => {
  let scrollTop = window.scrollY;
  let windowHeight = window.innerHeight;
  let documentHeight = document.documentElement.scrollHeight;

  if (scrollTop + windowHeight >= documentHeight - 100 && !isFetching && currentPage < lastPage) {
    isFetching = true; // Prevent multiple triggers
    currentPage++;
    await FetchingPaginationPosts(postLimits, currentPage);
    isFetching = false; // Reset the flag
  }
});

async function FetchingPaginationPosts(limit, page) {
  let posts = await GetPosts(limit, page);
  if (!posts || !posts.data) {
    console.error("No data received from the API.");
    return;
  }

  let postsContainer = document.getElementById("postsContainer");
  // Filter out posts from the banned user (2183) and posts with name "sexy"
  let validPosts = posts.data.filter(
    (post) => post.author.id !== 2183 && post.author.name !== "sexy"
  );

  for (let post of validPosts) {
    let card = GenerateNewCard(post);
    postsContainer.innerHTML += card;
  }
}

document.getElementById("btnSavePost").addEventListener("click", async () => {
  try {
    ShowLoadingBar();

    const title = document.getElementById("post-title").value;
    const body = document.getElementById("post-body").value;
    const image = document.getElementById("post-img").files[0];

    // Create FormData for new posts (including image)
    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    if (image) {
      formData.append("image", image);
    }

    if (!AddEditePost) {
      // Send the FormData object to the API (Add new post)
      await axios.post(`${BasURL}posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      PopUpMessage("Post created successfully!", "success");
    } else {
      formData.append("_method", "PUT"); // Use PUT method for updating
      const res = await axios.post(
        `${BasURL}posts/${CurrentpostId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      PopUpMessage("Post Updated successfully!", "success");
    }

    hideModal("addPostModal"); // Hide the modal
    setTimeout(async () => {
      await FetchingPosts();
    }, 2000);
  } catch (error) {
    let erroMessage = error.response?.data?.message || "Failed to delete post.";
    PopUpMessage(erroMessage, "", "alert-danger");
  } finally {
    HideLoadingBar();
  }
});



// ====== Post details Funcs =========

async function openPostDetails(postId) {
  // Fetch post details
   try{
    let response = await axios.get(`${BasURL}posts/${postId}`);
    
    let post = response.data.data;
    let postCard = GenerateNewCard(post);

    let postDetailsContainer = document.getElementById("postDetailsContainer");
    postDetailsContainer.innerHTML = postCard;

    // Fetch and display comments
    let commentsContainer = document.getElementById("commentsContainer");
    commentsContainer.innerHTML = "";
    if(post.comments && post.comments.length > 0) {

      post.comments.forEach((comment) => {

       let commentElement = GenerateCommentElement(comment);
        commentsContainer.innerHTML += commentElement;
      });
    }

    // Show the modal
    let modal = new bootstrap.Modal(
      document.getElementById("postDetailsModal")
    );
    modal.show();

    EnabelOrDesabelCommentsSection();

    // Add event listener for adding a comment
    document.getElementById("btnAddComment").onclick = async () => {
      let commentText = document.getElementById("commentText").value;
      if (commentText.trim() === "") {
        PopUpMessage("Comment cannot be empty!", "", "alert-info");
        return;
      }

      try {
        ShowLoadingBar();
        await axios.post(
          `${BasURL}posts/${postId}/comments`,
          { body: commentText },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        PopUpMessage("Comment added successfully!", "", "alert-success");
        document.getElementById("commentText").value = ""; // Clear the textarea
        setTimeout(async () => {
          await FetchingPosts();
          // Hide the modal
         hideModal("postDetailsModal");
        }, 2000); // Wait for 3.5 seconds before re-fetching
      } catch (error) {
        let erroMessage =
          error.response?.data?.message || "Failed to delete post.";

        PopUpMessage(erroMessage,"", "alert-danger");
      }
      finally{
        HideLoadingBar();
      }
    };
   }
   catch(error){
    console.error("Error fetching post details:", error);
    PopUpMessage("Failed to fetch post details. Please try again.","", "alert-danger");
  }
}

function GenerateCommentElement(comment) {

  let commentImage = "./Images/MaleImage.png"; 

  if (
    comment.author &&
    comment.author.profile_image &&
    typeof comment.author.profile_image === "string" &&
    comment.author.profile_image.trim() !== ""
  ) {
    commentImage = comment.author.profile_image;
  }

  let commentElement = `
<div id="${comment.id}" class="comment mb-3 p-2 rounded bg-light">
<div class="d-flex align-items-center mb-2">
<img
src="${commentImage}"
alt="No Image"
class="rounded-circle me-2 my-2"
style="width: 30px; height: 30px; object-fit: cover;"
/>
<strong class="me-auto">${comment.author.username}</strong>
</div>
<div>
<p class="mb-0 comment-body">${comment.body}</p>
</div>
</div>
`;

return commentElement;
}

document.getElementById("curent-user-li").addEventListener("click", () => {

    ShowCurrentUserDetails();
});
function ShowCurrentUserDetails()
{
  let user = JSON.parse(localStorage.getItem("user")) || {};
  let userImage = "./Images/MaleImage.png"; // Default image
  if (
    user &&
    user.profile_image &&
    typeof user.profile_image === "string" &&
    user.profile_image.trim() !== ""
  ) {
    userImage = user.profile_image;
  }

  // Populate the modal with user data
  const userProfileModalBody = document.getElementById("userProfileModalBody");
  userProfileModalBody.innerHTML = GenerateUserDetails(user);


  // Show the modal
  const userProfileModal = new bootstrap.Modal(
    document.getElementById("userProfileModal")
  );
  userProfileModal.show();

}

function GenerateUserDetails(user){

  let authorImage = "./Images/MaleImage.png"; 
  if (
    user &&
    user.profile_image &&
    typeof user.profile_image === "string" &&
    user.profile_image.trim() !== ""
  ) 
  {
    authorImage = user.profile_image;
  }

  let content = `
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <img src="${authorImage}" alt="Profile Image" class="img-fluid rounded-circle shadow mb-3" style="width: 150px; height: 150px; object-fit: cover;">
          </div>
          <div class="col-md-8">
            <h3 class="mb-2">${user.username || ""}</h3>
            <p class="text-muted">${user.name || ""}</p>
            <p><i class="bi bi-envelope me-2"></i>${user.email || ""}</p>
            <p><i class="bi bi-chat-square-dots me-2"></i>Comments: ${user.comments_count || ""}</p>
            <p><i class="bi bi-sticky me-2"></i>Posts: ${user.posts_count || ""}</p>
          </div>
        </div>
      </div>
    `;

  return content;
}
async function openUserProfileModal(userId) {
  try {
    ShowLoadingBar();
    const response = await axios.get(`${BasURL}users/${userId}`);
    const user = response.data.data;

   
    // Populate the modal with user data
    const userProfileModalBody = document.getElementById("userProfileModalBody");
    userProfileModalBody.innerHTML = GenerateUserDetails(user);

    // Store the currently focused element
    const triggerElement = document.activeElement;

    // Show the modal
    const userProfileModal = new bootstrap.Modal(document.getElementById("userProfileModal"));
    userProfileModal.show();

    // Add an event listener to return focus when the modal is hidden
    document.getElementById('userProfileModal').addEventListener('hidden.bs.modal', function () {
      if (triggerElement) {
        triggerElement.focus();
      }
    });
  } catch (error) {
    let erroMessage = error.response?.data?.message || "Failed to delete post.";
    PopUpMessage(erroMessage, "", "alert-danger");
  } finally {
    HideLoadingBar();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  FetchPostsOnLoad();

  const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
  const leftSidebar = document.getElementById("left-sidebar");

  toggleSidebarBtn.addEventListener("click", () => {
    leftSidebar.classList.toggle("collapsed");
  });

  const postsContainer = document.getElementById("postsContainer");

  // Add event listener to the postsContainer for event delegation
  postsContainer.addEventListener("click", function (event) {
    // Handle Edite button click
    if (event.target.classList.contains("edite-post-btn")) {
      const postId = event.target.dataset.postId;
      EditePost(postId);
      event.stopPropagation(); // Prevent the card click event from firing
    }
    // Handle Delete button click
    else if (event.target.classList.contains("delete-post-btn")) {
      const postId = event.target.dataset.postId;
      DeletePost(postId);
      event.stopPropagation(); // Prevent the card click event from firing
    } 
    else if (event.target.closest("#author-info")) {
      const authorInfoSpan = event.target.closest("#author-info");
      const userId = authorInfoSpan.dataset.userId;
      openUserProfileModal(userId);
      event.stopPropagation(); // Prevent the card click event from firing
    } else {
      // Find the closest card element to the clicked target
      let card = event.target.closest(".card");
      if (card) {
        // console.log("Card clicked:", card);
        let postId = card.id;
        // console.log("Post ID:", postId);
        openPostDetails(postId);
      }
    }
  });

  const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  // Show or hide the button based on scroll position
  window.addEventListener("scroll", () => {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  });

  // Scroll to the top when the button is clicked
  scrollToTopBtn.addEventListener("click", () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  });
});

async function FetchPostsOnLoad() {
  try {
    await FetchingPosts();
  } catch (error) {
    console.error("Error during initial fetch:", error);
  }
}
