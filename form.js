

document.getElementById("user_password").addEventListener("input", (e) => {
    const input = e.target.value
    if (input.length >= 8) {
        document.getElementById("minimum").classList.remove("invalid")
        document.getElementById("minimum").classList.add("valid")
    }
    else {
        document.getElementById("minimum").classList.add('invalid');
        document.getElementById("minimum").classList.remove("valid")
    }
})


