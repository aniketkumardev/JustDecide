const loginsec = document.querySelector('.login-section')
const loginlink = document.querySelector('.login-link')
const registerlink = document.querySelector('.register-link')
registerlink.addEventListener('click', () => {
    loginsec.classList.add('active')
})
loginlink.addEventListener('click', () => {
    loginsec.classList.remove('active')
})

document.querySelector(".register-btn").addEventListener("click", () => {
    let name, email, password,bio;
    name = document.querySelector(".register-username").value;
    email = document.querySelector(".register-email").value;
    password = document.querySelector(".register-password").value;
    bio = document.querySelector(".register-bio").value;

    // localStorage.setItem("name", name);
    // localStorage.setItem("email", email);
    // localStorage.setItem("password", password);

    let user_records = new Array();
    user_records = JSON.parse(localStorage.getItem("users")) || [];

    if (user_records.some(v => {
        return v.email == email;
    })) {
        alert("Duplicate Data");
    }
    else {
        user_records.push({
            "name": name,
            "email": email,
            "password": password,
            "Bio": bio
        });
        localStorage.setItem("users", JSON.stringify(user_records));
    }
})

document.querySelector(".login-btn").addEventListener("click", () => {
        let email, password;
        email = document.getElementById('email').value;
        password = document.getElementById('password').value;
        
        let user_record = new Array();
        user_record = JSON.parse(localStorage.getItem("users")) ? JSON.parse(localStorage.getItem("users")) : [];
        
        if (user_record.some(v => {
            return v.email === email && v.password === password;
        })) {
            alert("Login Successful");
            
            let current_user = user_record.filter(v => {
                return v.email === email && v.password === password;
            })[0];
            
            localStorage.setItem("name", current_user.name);
            localStorage.setItem("email", current_user.email);
            localStorage.setItem("bio", current_user.Bio);
            window.location.href = "profile.html";
        } else {
            alert("Login Fail");
        }
    
})