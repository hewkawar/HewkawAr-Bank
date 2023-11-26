async function HewkawArLogout() {
    removelocalStorage("session");
    removelocalStorage("code");

    window.location.href = "/login";
}

