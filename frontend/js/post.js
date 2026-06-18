const API_URL = "http://localhost:5000/api";

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

            <div class="post-header">

                <div class="avatar">
                    ${post.user.name.charAt(0)}
                </div>

                <div>
                    <h3>${post.user.name}</h3>
                    <small>Social Media User</small>
                </div>

            </div>

            <div class="post-content">
                ${post.content}
            </div>

            ${post.image ? `
<img
src="http://localhost:5000/uploads/${post.image}"
class="post-image">
` : ""}

${post.audio ? `
<audio controls>
<source
src="http://localhost:5000/uploads/${post.audio}">
</audio>
` : ""}

            <div class="post-actions">

                <button onclick="likePost('${post._id}')">
                    ❤️ Like (${post.likes.length})
                </button>

                <button onclick="unlikePost('${post._id}')">
    💔 Unlike
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

            <h3>${user.name}</h3>

            <p>${user.email}</p>

            <button onclick="followUser('${user._id}')">
                Follow
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

loadPosts();