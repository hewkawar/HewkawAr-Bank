async function HewkawArLogout() {
    const session_id = getCookie('session');

    deleteCookie("session");
    deleteCookie("code");

    await axios({
        method: "delete",
        url: "https://api.hewkawar.xyz/app/bank/session",
        data: {
            session_id: session_id
        }
    });

    window.location.href = "/login.html";
}

