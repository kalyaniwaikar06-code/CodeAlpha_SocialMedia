const API_URL = "https://codealpha-socialmedia-backend.onrender.com/api";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

async function createPost(){

const content =
document.getElementById("content").value;

const image =
document.getElementById("image").files[0];

const audio =
document.getElementById("audio").files[0];

const formData =
new FormData();

formData.append(
"content",
content
);

if(image){
formData.append(
"image",
image
);
}

if(audio){

formData.append(
"audio",
audio
);
}

const response =
await fetch(
`${API_URL}/posts/create`,
{
method:"POST",

headers:{
Authorization:
`Bearer ${token}`
},

body:formData
}
);

if(audio){

formData.append(
    "audio",
    audio
);

}

if(response.ok){

document.getElementById("content").value="";

loadPosts();

}

}

async function loadPosts() {

    const response = await fetch(`${API_URL}/posts/all`);

    const posts = await response.json();

    let output = "";

    posts.forEach(post => {

        output += `
        <div class="post-card">

            <div class="post-user">

    <div class="mini-avatar">

        ${
            post.user?.profilePic
            ? `<img src="https://codealpha-socialmedia-backend.onrender.com/uploads/${post.user.profilePic}"
               style="width:40px;height:40px;border-radius:50%;object-fit:cover;">`
            : post.user?.name?.charAt(0).toUpperCase()
        }

    </div>

    <span>${post.user?.name}</span>

</div>

            <div class="post-content">
                ${post.content}
            </div>

            ${post.image ? `
            <img
            src="https://codealpha-socialmedia-backend.onrender.com/uploads/${post.image}"
            class="post-image">
             ` : ""}

            ${post.audio ? `
            <audio controls>
            <source
             src="https://codealpha-socialmedia-backend.onrender.com/uploads/${post.audio}">
              </audio>
             ` : ""}

            <div class="post-actions">

            <button onclick="likePost('${post._id}')">
            ❤️ Like (${post.likes.length})
            </button>

            <button onclick="unlikePost('${post._id}')">
            💔 Unlike
            </button>

            <button onclick="savePost('${post._id}')">
            🔖 Save
             </button>

        <button onclick="deletePost('${post._id}')">
            🗑 Delete
             </button>

        </div>

            <div class="comment-box">

            <input
            type="text"
            id="comment-${post._id}"
            placeholder="😀 Add a comment...">


                <button onclick="addComment('${post._id}')">
                    Comment
                </button>

            </div>

            <div id="comments-${post._id}">
                Loading comments...
            </div>

        </div>
        `;
    });

    document.getElementById("posts").innerHTML = output;

    posts.forEach(post => {
        loadComments(post._id);
    });
}

async function likePost(id) {

    await fetch(`${API_URL}/posts/like/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    loadPosts();
}

async function unlikePost(id){

    await fetch(
        `${API_URL}/posts/unlike/${id}`,
        {
            method:"PUT",
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    loadPosts();
}

async function deletePost(id) {

    const response = await fetch(`${API_URL}/posts/delete/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    alert(data.message);

    loadPosts();
}

async function addComment(id) {

    const text = document.getElementById(`comment-${id}`).value;

    await fetch(`${API_URL}/posts/comment/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text })
    });

    document.getElementById(`comment-${id}`).value = "";

    loadComments(id);
}


async function deleteComment(id){

await fetch(
`${API_URL}/posts/comment/${id}`,
{
method:"DELETE",
headers:{
Authorization:
`Bearer ${token}`
}
}
);

loadPosts();
}
async function loadComments(postId) {

    const response = await fetch(
        `${API_URL}/posts/comments/${postId}`
    );

    const comments = await response.json();

    let output = "";

    comments.forEach(comment => {

        output += `
        <p>
        <b>${comment.user.name}</b> :
        ${comment.text}

        <button
        onclick="deleteComment('${comment._id}')">
         ❌
         </button>

         </p>
        `;
          });

          document.getElementById(`comments-${postId}`).innerHTML = output;
    }


async function searchUser(){

    const name =
    document.getElementById("searchUser").value;

    const res =
    await fetch(
        `${API_URL}/users/search?name=${name}`
    );

    const users =
    await res.json();

    let output = "";

    users.forEach(user => {

    output += `
    <div class="post-card">

        <div class="post-header">

            <div class="avatar">

                ${
                    user.profilePic
                    ? `<img src="https://codealpha-socialmedia-backend.onrender.com/uploads/${user.profilePic}"
                       style="width:50px;height:50px;border-radius:50%;object-fit:cover;">`
                    : user.name.charAt(0).toUpperCase()
                }

            </div>

            <div>
                <h3>${user.name}</h3>
                <p>${user.email}</p>
            </div>

        </div>

        <button onclick="followUser('${user._id}')">
            Follow
        </button>

        <button onclick="unfollowUser('${user._id}')">
               Unfollow
          </button>

    </div>
    `;
});

    document.getElementById("posts").innerHTML =
    output;
}

async function followUser(userId){

    try{

        const response = await fetch(
            `${API_URL}/users/follow/${userId}`,
            {
                method:"PUT",
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );

        const data =
        await response.json();

        alert(data.message);

    }catch(error){

        console.log(error);

        alert("Follow Failed");
    }
}

async function unfollowUser(userId){

    try{

        const response = await fetch(
            `${API_URL}/users/unfollow/${userId}`,
            {
                method:"PUT",
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        alert(data.message);

    }catch(error){

        console.log(error);

        alert("Unfollow Failed");
    }
}

async function savePost(postId){

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/users/save/${postId}`,
        {
            method:"PUT",
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    alert(data.message);
}

async function unsavePost(postId){

    const response = await fetch(
        `${API_URL}/users/unsave/${postId}`,
        {
            method:"PUT",
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    alert(data.message);

    loadSavedPosts();
}
async function loadSavedPosts(){

    const response = await fetch(
        `${API_URL}/users/saved-posts`,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    const posts = await response.json();

    let output = "<h2>🔖 Saved Posts</h2>";

posts.forEach(post => {

    output += `
    <div class="post-card">

        <div class="post-user">

            <div class="mini-avatar">

                ${
                    post.user?.profilePic
                    ? `<img src="https://codealpha-socialmedia-backend.onrender.com/uploads/${post.user.profilePic}"
                       style="width:40px;height:40px;border-radius:50%;object-fit:cover;">`
                    : post.user?.name?.charAt(0).toUpperCase()
                }

            </div>

            <span>${post.user?.name || "Unknown User"}</span>

        </div>

        <div class="post-content">
            ${post.content}
        </div>

        ${
            post.image
            ? `<img src="https://codealpha-socialmedia-backend.onrender.com/uploads/${post.image}"
               class="post-image">`
            : ""
        }

        ${
            post.audio
            ? `<audio controls>
                 <source src="https://codealpha-socialmedia-backend.onrender.com/uploads/${post.audio}">
               </audio>`
            : ""
        }

        <div class="post-actions">

            <button onclick="likePost('${post._id}')">
                ❤️ Like (${post.likes.length})
            </button>

            <button onclick="unlikePost('${post._id}')">
                💔 Unlike
            </button>

            <button onclick="savePost('${post._id}')">
                🔖 Save
            </button>

            <button onclick="unsavePost('${post._id}')">
                ❌ Unsave
             </button>

        </div>

        <div class="comment-box">

            <input
            type="text"
            id="comment-${post._id}"
            placeholder="Add comment">

            <button onclick="addComment('${post._id}')">
                Comment
            </button>

        </div>

        <div id="comments-${post._id}">
        </div>

    </div>
    `;
});
document.getElementById("posts").innerHTML = output;

posts.forEach(post => {
    loadComments(post._id);
});

}

async function deleteAccount(){

    const confirmDelete =
    confirm("Are you sure you want to delete your account?");

    if(!confirmDelete){
        return;
    }

    const response =
    await fetch(
        `${API_URL}/users/delete-account`,
        {
            method:"DELETE",
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    const data =
    await response.json();

    alert(data.message);

    localStorage.clear();

    window.location.href = "register.html";
}


function goProfile(){

    window.location.href =
    "profile.html";

}

function logout() {

    localStorage.clear();

    window.location.href = "login.html";
}
function toggleTheme() {
    document.body.classList.toggle("dark");
}

function addEmoji(emoji){

    const content =
    document.getElementById("content");

    content.value += emoji;
}

function toggleEmojiPicker(){

    const picker =
    document.getElementById("emojiPicker");

    if(picker.style.display === "none"){

        picker.style.display = "block";

    }else{

        picker.style.display = "none";

    }
}

function toggleMenu(){

    const menu =
    document.getElementById("settingsMenu");

    menu.classList.toggle("show");
}

loadPosts(); 