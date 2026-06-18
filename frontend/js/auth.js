const API_URL = "http://localhost:5000/api";

async function registerUser() {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            password
        })
    });

    const data = await response.json();

    alert(data.message);

    if(response.ok){
        window.location.href = "login.html";
    }
}

async function loginUser() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if(response.ok){

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            alert("Login Successful!");

            window.location.href = "index.html";

        } else {

            alert(data.message);
        }

    } catch(error){

        console.error(error);

        alert("Login Failed");
    }
}

function logout(){

    localStorage.clear();

    window.location.href = "login.html";
}

function toggleTheme(){

    document.body.classList.toggle("dark");
}