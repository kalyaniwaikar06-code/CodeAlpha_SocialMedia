const API_URL = "https://codealpha-socialmedia-backend.onrender.com/api";
let profileData = {};

const user = JSON.parse(
    localStorage.getItem("user")
);

if (!user) {
    window.location.href = "login.html";
}

async function loadProfile() {

    try {

        const response = await fetch(
            `${API_URL}/users/profile/${user._id}`
        );

        const data = await response.json();
        profileData = data;

        document.getElementById("name").innerText =
            data.name;

        if(data.profilePic){

         document.getElementById("avatar").innerHTML = `
        <img
        src="https://codealpha-socialmedia-backend.onrender.com/uploads/${data.profilePic}"
        style="
            width:100%;
            height:100%;
            border-radius:50%;
            object-fit:cover;
        ">
    `;

}else{

    document.getElementById("avatar").innerText =
    data.name.charAt(0).toUpperCase();


}

        document.getElementById("followersCount").innerText =
            data.followers.length;

        document.getElementById("followingCount").innerText =
            data.following.length;

    } catch (error) {

        console.log(error);

    }
}

async function loadMyPosts() {

    try {

        const response = await fetch(
            `${API_URL}/posts/user/${user._id}`
        );

        const posts = await response.json();

        const postsContainer =
            document.getElementById("userPosts");

        postsContainer.innerHTML = "<h2>📄 My Posts</h2>";

        if (posts.length === 0) {

            postsContainer.innerHTML =
                "<p>No posts yet.</p>";

            return;
        }

        posts.forEach(post => {

            postsContainer.innerHTML += `

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
        <small>ConnectHub User</small>
    </div>

</div>

                <p>${post.content}</p>

                ${
                    post.image
                    ? `<img
                        src="https://codealpha-socialmedia-backend.onrender.com/uploads/${post.image}"
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
                    
                    
                    <button onclick="deletePost('${post._id}')">
                        🗑 Delete
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
                    Loading comments...
                </div>

            </div>

            `;

        });

        posts.forEach(post => {

            loadComments(post._id);

        });

    } catch (error) {

        console.log(error);

    }
}

console.log("LOAD SAVED FUNCTION LOADED");

async function loadSavedPosts(){
    alert("Saved Clicked");

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/users/saved-posts`,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );
    const posts = await response.json();

console.log("SAVED POSTS:", posts);

    const postsContainer =
    document.getElementById("userPosts");

    postsContainer.innerHTML = "<h2>🔖 Saved Posts</h2>";

    posts.forEach(post => {

          postsContainer.innerHTML += `
<div class="post-card">

            <div class="post-header">

    <div class="avatar">
        ${
            post.user?.profilePic
            ? `<img src="https://codealpha-socialmedia-backend.onrender.com/uploads/${post.user.profilePic}"
               style="width:50px;height:50px;border-radius:50%;object-fit:cover;">`
            : post.user?.name?.charAt(0).toUpperCase()
        }
    </div>

    <div>
        <h3>${post.user?.name || "Unknown User"}</h3>
        <small>ConnectHub User</small>
    </div>

</div>

    <p>${post.content}</p>

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
        Loading comments...
    </div>

</div>
`;
    });

    posts.forEach(post => {
    loadComments(post._id);
});
}

async function uploadProfilePic(){

    const image =
    document.getElementById("profileImage").files[0];

    if(!image){
        alert("Select Image First");
        return;
    }

    const formData =
    new FormData();

    formData.append(
        "profilePic",
        image
    );

    const token =
    localStorage.getItem("token");

    const response =
    await fetch(
        `${API_URL}/users/profile-pic`,
        {
            method:"PUT",
            headers:{
                Authorization:`Bearer ${token}`
            },
            body:formData
        }
    );

    const data =
    await response.json();

    alert(data.message);

    loadProfile();
}

async function removeProfilePic(){

    if(!confirm("Are you sure you want to remove profile photo?")){
        return;
    }

    try{

        const token = localStorage.getItem("token");

        const response = await fetch(
            `${API_URL}/users/remove-profile-pic`,
            {
                method:"PUT",
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        alert(data.message);

        loadProfile();

    }catch(error){

        console.log(error);

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


async function deletePost(id){

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/posts/delete/${id}`,
        {
            method:"DELETE",
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    alert(data.message);

    loadMyPosts();
}

async function loadComments(postId){

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

    document.getElementById(
        `comments-${postId}`
    ).innerHTML = output;
}


async function addComment(id){

    const token = localStorage.getItem("token");

    const text =
    document.getElementById(
        `comment-${id}`
    ).value;

    await fetch(
        `${API_URL}/posts/comment/${id}`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`
            },
            body:JSON.stringify({text})
        }
    );

    document.getElementById(
        `comment-${id}`
    ).value = "";

    loadComments(id);
}

async function deleteComment(id){

    const token = localStorage.getItem("token");

    await fetch(
        `${API_URL}/posts/comment/${id}`,
        {
            method:"DELETE",
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    loadMyPosts();
}

async function likePost(id){

    const token = localStorage.getItem("token");

    await fetch(
        `${API_URL}/posts/like/${id}`,
        {
            method:"PUT",
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    loadMyPosts();
}

async function unlikePost(id){

    const token = localStorage.getItem("token");

    await fetch(
        `${API_URL}/posts/unlike/${id}`,
        {
            method:"PUT",
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    loadMyPosts();
}


function showFollowers(){

    document.getElementById("modalTitle").innerText =
    "Followers";

    let output = "";

    profileData.followers.forEach(user => {

        output += `
<div class="follow-user">

    ${
        user.profilePic
        ? `<img
            src="https://codealpha-socialmedia-backend.onrender.com/uploads/${user.profilePic}"
            class="follow-pic">`
        : `<div class="follow-letter">
            ${user.name.charAt(0).toUpperCase()}
           </div>`
    }

    <span>${user.name}</span>

</div>
`;

    });

    if(profileData.followers.length === 0){

        output = "<p>No Followers</p>";

    }

    document.getElementById("modalUsers").innerHTML =
    output;

    document.getElementById("userModal").style.display =
    "block";
}

function showFollowing(){

    document.getElementById("modalTitle").innerText =
    "Following";

    let output = "";

    profileData.following.forEach(user => {

        output += `
<div class="follow-user">

    ${
        user.profilePic
        ? `<img
            src="https://codealpha-socialmedia-backend.onrender.com/uploads/${user.profilePic}"
            class="follow-pic">`
        : `<div class="follow-letter">
            ${user.name.charAt(0).toUpperCase()}
           </div>`
    }

    <span>${user.name}</span>

</div>
`;

    });

    if(profileData.following.length === 0){

        output = "<p>Not Following Anyone</p>";

    }

    document.getElementById("modalUsers").innerHTML =
    output;

    document.getElementById("userModal").style.display =
    "block";
}

function closeModal(){

    document.getElementById("userModal").style.display =
    "none";
}

function logout() {

    localStorage.clear();

    window.location.href = "login.html";

}

function toggleCameraMenu(){

    const menu =
    document.getElementById("cameraMenu");

    if(menu.style.display === "block"){

        menu.style.display = "none";

    }else{

        menu.style.display = "block";

    }
}

loadProfile();
loadMyPosts();