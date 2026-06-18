const API_URL = "http://localhost:5000/api";

const user = JSON.parse(
    localStorage.getItem("user")
);

if(!user){
    window.location.href = "login.html";
}

async function loadProfile(){

    try{

        const response = await fetch(
            `${API_URL}/users/profile/${user._id}`
        );

        const data = await response.json();

        document.getElementById("name").innerText =
        data.name;

        document.getElementById("email").innerText =
        data.email;

        document.getElementById("avatar").innerText =
        data.name.charAt(0).toUpperCase();

        document.getElementById("followersCount").innerText =
        data.followers.length;

        document.getElementById("followingCount").innerText =
        data.following.length;

    }catch(error){

        console.log(error);
    }
}

function logout(){

    localStorage.clear();

    window.location.href = "login.html";
}

loadProfile();