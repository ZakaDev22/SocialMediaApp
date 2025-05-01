
let BasURL = "https://tarmeezacademy.com/api/v1/";
let PostsLimit = 10;
let PostsURL = `posts?limit=${PostsLimit}`;

async function FetchingPosts() {

    let posts = await GetPosts();
     console.log(posts);
        if (posts.data) {
            let postsContainer = document.getElementById("postsContainer");
            posts.data.forEach((post) => {
                let card = GenerateNewCard(post);
                postsContainer.innerHTML += card;
            });
        } else {
            console.error("No data received from the API.");
        }
}

async function GetPosts() {
    try {
        let response = await axios.get(`${BasURL}${PostsURL}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return null;
    }
}

function GenerateNewCard(post) {

    let card = `
              <div class="card col-6 mt-2 mb-1 shadow-lg">
          <div class="card-header">
            <img
              src="${post.author.profile_image}"
              class="img-fluid rounded-circle border border-primary shadow"
              width="50"
              height="50"
            />
            <strong class="card-title">${
              post.author.username || "No Title"
            }</strong>
          </div>
          <div class="card-body">
            <img
              src="${post.image}"
              class="w-100 img-fluid rounded shadow"
            />
            <small style="color: grey" class="d-block mt-1">${
              post.created_at
            }</small>

            <h5 class="mt-1">${post.titel}</h5>
            <p>
             ${post.body}
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
            </p>
          </div>
        </div>
    `;

    return card;
}


document.addEventListener("DOMContentLoaded", async () => {

    console.log(2222222);
    FetchingPosts();

});