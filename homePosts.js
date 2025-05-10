import { BasURL } from "./BaseURLS.js";
import { PopUpMessage } from "./BaseFunctionsAndVariables.js";
import { ShowLoadingBar } from "./BaseFunctionsAndVariables.js";
import { HideLoadingBar } from "./BaseFunctionsAndVariables.js";

let currentPage = 1;
let postLimits = 10;
let lastPage = 0;
let isFetching = false;

async function FetchingPosts() {
  let posts = await GetPosts();
  if (!posts || !posts.data) {
    console.error("No data received from the API.");
    return; // Exit early if no data
  }
  let postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = ""; // Clear previous posts
  posts.data.forEach((post) => {
    let card = GenerateNewCard(post);
    postsContainer.innerHTML += card;
  });

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
  let authorImage = "./images/MaleImage.png"; // Default image
  if (post.author && post.author.profile_image && typeof post.author.profile_image === 'string' && post.author.profile_image.trim() !== "") {
    authorImage = post.author.profile_image;
  }

  let authorUsername = post.author?.username ?? "No User Name";

  let postImage = "./images/walpaper.jpg"; // Default image
  if (post.image && typeof post.image === 'string' && post.image.trim() !== "") {
    postImage = post.image;
  }

  let PostTags = post.tags || [];

  let card = `
       <div id="${post.id}" class="card col-6 mt-2 mb-1 shadow-lg">
          <div class="card-header bg-success" style="color: white">
            <img
              src="${authorImage}"
              alt = "No Image"
              class=" rounded-circle border border-primary shadow"
              width="70"
              height="70"
            />
            <strong class="card-title">${authorUsername}</strong>
          </div>
          <div class="card-body">
            <img
              src="${postImage}"
              alt="No Image"
              class="w-100 img-fluid rounded shadow"
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
  posts.data.forEach((post) => {
    let card = GenerateNewCard(post);
    postsContainer.innerHTML += card;
  });
}

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

      ShowLoadingBar();
      // Send the FormData object to the API
        await axios.post(`${BasURL}posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Hide the modal
      let modal = document.getElementById("addPostModal");
      let modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      } else {
        modal = new bootstrap.Modal(modal);
        modal.hide();
      }

      PopUpMessage("Post created successfully!", "success");
    
      setTimeout(async () => {
                await FetchingPosts();
      }, 3500); 

    } catch (error) {
        console.error("Error creating post:", error);
        PopUpMessage("Failed to create post. Please try again." ,"danger");
    }
    finally{
      HideLoadingBar();
    }
});

// ====== Post details Funcs =========

async function openPostDetails(postId) {
  // Fetch post details
   try{
    let response = await axios.get(`${BasURL}posts/${postId}`);
    
    let post = response.data.data;

    console.log(post);
    let postCard = GenerateNewCard(post);

    let postDetailsContainer = document.getElementById("postDetailsContainer");
    postDetailsContainer.innerHTML = postCard;

    // Fetch and display comments
    let commentsContainer = document.getElementById("commentsContainer");
    commentsContainer.innerHTML = "";


    // Show the modal
    let modal = new bootstrap.Modal(
      document.getElementById("postDetailsModal")
    );
    modal.show();

    // Add event listener for adding a comment
    document.getElementById("btnAddComment").onclick = async () => {
      let commentText = document.getElementById("commentText").value;
      if (commentText.trim() === "") {
        alert("Comment cannot be empty!");
        return;
      }

      try {
        await axios.post(
          `${BasURL}posts/${postId}/comments`,
          { body: commentText },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Refresh comments
        commentsContainer.innerHTML += `
          <div class="mb-2">
            <strong>You</strong>: ${commentText}
          </div>
        `;
        document.getElementById("commentText").value = ""; // Clear the textarea
      } catch (error) {
        console.error("Error adding comment:", error);
        alert("Failed to add comment. Please try again.");
      }
    };
   }
   catch(error){
    console.error("Error fetching post details:", error);
  }
}

// ============ end ================//

document.addEventListener("DOMContentLoaded", async () => {
  FetchPostsOnLoad();

  // Add event listener to the postsContainer for event delegation
  postsContainer.addEventListener("click", function (event) {
    // Find the closest card element to the clicked target
    let card = event.target.closest(".card");
    if (card) {
      // console.log("Card clicked:", card);
      let postId = card.id;
      // console.log("Post ID:", postId);
      openPostDetails(postId);
    }
  });
});

async function FetchPostsOnLoad() {
  try {
    await FetchingPosts();
  } catch (error) {
    console.error("Error during initial fetch:", error);
  }
}
