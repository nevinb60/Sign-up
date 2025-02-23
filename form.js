

document.getElementById("user_password").addEventListener("input", (e) => {
    const input = e.target.value;
    const hasLowercase = /[a-z]/.test(input);
    const hasUppercase = /[A-Z]/.test(input);
    const hasSpecial = /[-+_!@#$%^&*., ?()=]/.test(input);
    const hasNumber = /\d/.test(input);

    if (input.length >= 8) {
        document.getElementById("minimum").classList.remove("invalid");
        document.getElementById("minimum").classList.add("valid");
    }
    else {
        document.getElementById("minimum").classList.add('invalid');
        document.getElementById("minimum").classList.remove("valid");
    }

    if (hasLowercase) {
        document.getElementById("lowercase").classList.remove("invalid");
        document.getElementById("lowercase").classList.add("valid");
    }
    else {
        document.getElementById("lowercase").classList.remove("valid");
        document.getElementById("lowercase").classList.add("invalid");
    }

    if (hasUppercase) {
        document.getElementById("uppercase").classList.remove("invalid");
        document.getElementById("uppercase").classList.add("valid");

    }
    else {
        document.getElementById("uppercase").classList.remove("valid");
        document.getElementById("uppercase").classList.add("invalid");

    }

    if (hasSpecial) {
        document.getElementById("special").classList.remove("invalid");
        document.getElementById("special").classList.add("valid");


    }
    else {
        document.getElementById("special").classList.remove("valid");
        document.getElementById("special").classList.add("invalid");

    }

    if (hasNumber) {
        document.getElementById("number").classList.remove("invalid");
        document.getElementById("number").classList.add("valid");

    }
    else {
        document.getElementById("number").classList.remove("valid");
        document.getElementById("number").classList.add("invalid");

    }
})

document.getElementById("eye").addEventListener("click", () => {
    const visibility = document.getElementById("user_password");
    const image = document.getElementById("eye")

    if (visibility.type === "password") {
        image.setAttribute("src", "images/visibility_eye.svg")
        visibility.type = 'text';


    }
    else {
        image.setAttribute("src", "images/hidden_eye.svg")
        visibility.type = 'password';

    }

})

document.getElementById("user_email").addEventListener("blur", (e) => {
    const input = e.target.value;
    const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(input);
    const errorMessage = document.getElementById("email_error");

    if (!validEmail) {
        errorMessage.textContent = "Please enter a valid email";
        errorMessage.style.color = "red";

    }
    else {
        errorMessage.textContent = "";
    }


})