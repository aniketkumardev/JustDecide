document.querySelector(".username").innerText = JSON.stringify(localStorage.getItem("name"));
document.querySelector(".email").innerText = JSON.stringify(localStorage.getItem("email"));
document.querySelector(".bio").innerText = JSON.stringify(localStorage.getItem("Bio"));

function logout() {
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("Bio");
    window.location.href = "profile.html";
};

document.querySelector(".edit-btn").addEventListener("click", () => {
    document.querySelector(".profile").classList.remove("show");
    document.querySelector(".profile").classList.add("not-show");
    document.querySelector(".profile-edit").classList.add("show");
    document.querySelector(".profile-edit").classList.remove("not-show");

    // Pre-fill form with current values
    document.getElementById("name").value = localStorage.getItem("name") || "";
    document.getElementById("email").value = localStorage.getItem("email") || "";
    document.getElementById("password").value = ""; // blank for security
    document.getElementById("bio").value = localStorage.getItem("Bio") || "";
});

document.querySelector(".save-btn").addEventListener("click", () => {
    let name = document.getElementById("name").value;
    let newEmail = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let bio = document.getElementById("bio").value;

    let oldEmail = localStorage.getItem("email"); // the original email to match against
    let user_records = JSON.parse(localStorage.getItem("users")) || [];

    let userIndex = user_records.findIndex(user => user.email === oldEmail);

    if (userIndex !== -1) {
        user_records[userIndex].name = name;
        user_records[userIndex].email = newEmail;
        user_records[userIndex].password = password;
        user_records[userIndex].bio = bio;

        localStorage.setItem("users", JSON.stringify(user_records));
        localStorage.setItem("name", name);
        localStorage.setItem("email", newEmail);
        localStorage.setItem("Bio", bio);

        alert("Profile Edited Successfully");

        document.querySelector(".username").innerText = name;
        document.querySelector(".email").innerText = newEmail;
        document.querySelector(".bio").innerText = bio;

        document.querySelector(".profile").classList.add("show");
        document.querySelector(".profile").classList.remove("not-show");
        document.querySelector(".profile-edit").classList.remove("show");
        document.querySelector(".profile-edit").classList.add("not-show");
    } else {
        alert("User with Provided Email Doesn't exist");
    }
});

// Function to show the modal
function showModal() {
    document.getElementById("successModal").style.display = "block";
    document.querySelector("section").classList.add("blur"); // Blur the section
}

window.onload = () => {
    if (!localStorage.getItem("name")) {
        showModal();
    }
};