async function HewkawArLogout() {
    const session_id = getlocalStorage("session");
    removelocalStorage("session");
    removelocalStorage("code");

    axios({
        method: "delete",
        url: "https://api.hewkawar.xyz/app/bank/session",
        data: {
            session_id: session_id
        }
    }).catch((error) => {
        window.location.href = "/login";
    });

    window.location.href = "/login";
}

