function HewkawArLogout() {
    const session_id = getCookie('session');

    deleteCookie("session");
    deleteCookie("code");

    window.location.href = "/login.html";
}

