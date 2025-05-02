let BasURL = "https://tarmeezacademy.com/api/v1/";
let PostsLimit = 5; // Default limit for posts
let PostsURL = `posts?limit=`;

async function FetchingPosts() {
  let posts = await GetPosts();
  if (!posts || !posts.data) {
    console.error("No data received from the API.");
    return; // Exit early if no data
  }
  let postsContainer = document.getElementById("postsContainer");
  posts.data.forEach((post) => {
    let card = GenerateNewCard(post);
    postsContainer.innerHTML += card;
  });
}

async function GetPosts(postLimits) {
  PostsLimit = postLimits || PostsLimit;
  try {
    let response = await axios.get(`${BasURL}${PostsURL}${PostsLimit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}

function CreateTag(tag) {
  let tagElement = `<span class="badge bg-primary text-light m-1">${tag}</span>`;
  return tagElement;
}
function GenerateNewCard(post) {
  let card = `
              <div class="card col-6 mt-2 mb-1 shadow-lg">
          <div class="card-header bg-success" style="color: white">
            <img
              src="${post.author.profile_image}"
              alt = "No Image"
              class=" rounded-circle border border-primary shadow"
              width="70"
              height="70"
            />
            <strong class="card-title">${
              post.author.username || "No User Name"
            }</strong>
          </div>
          <div class="card-body">
            <img
              src="${post.image}"
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
              ${post.tags.forEach((tag) => CreateTag(tag)) || ""}
            </p>
          </div>
        </div>
    `;

  return card;
}

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
    document.getElementById("loginbtn").classList.add("visually-hidden");
    document.getElementById("btnRegister").classList.add("visually-hidden");
    document.getElementById("btnLogout").classList.remove("visually-hidden");

    SuccessLoginMessage();
  } catch (error) {
    alert("Error during login:", error);
  }
});

function SuccessLoginMessage() {
  let user = JSON.parse(localStorage.getItem("user"));
  let userName = user.username || "No User Name";

  let div = document.createElement("div");
  div.innerHTML = `
           <div class="alert alert-success d-flex flex-column justify-content-center align-items-center" role="alert">
              <h4 class="alert-heading">Well done ${userName}</h4>
              <p>Aww yeah, you successfully Logged In To The System, Enjow Your Time</p>
               <hr>
               <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
</svg>
               <hr/>
              <p class="mb-0">You Still have The Option to Loged Out Anytime 😊</p>
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

document.addEventListener("DOMContentLoaded", async () => {
  FetchPostsOnLoad();
});

async function FetchPostsOnLoad() {
  try {
    await FetchingPosts();
  } catch (error) {
    console.error("Error during initial fetch:", error);
  }
}
