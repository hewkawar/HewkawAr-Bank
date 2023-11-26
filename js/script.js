async function HewkawArLogout() {
    deleteCookie("session");
    deleteCookie("code");

    window.location.href = "/login.html";
}

