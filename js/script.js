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
    }).then((response) => {
        Swal.fire({
            title: "Logout Success!",
            text: "We will redirect you soon",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            willClose: () => {
                window.location.href = "/login";
            }
        })
    })
    .catch((error) => {
        if (error.response && error.response.status === 406) {
            Swal.fire({
                title: "Access Denied",
                icon: "error",
                willClose: () => {
                    window.location.href = "/login";
                }
            })
        } else {
            Swal.fire({
                title: "Something error",
                text: "try again later",
                icon: "error",
                willClose: () => {
                    window.location.href = "/login";
                }
            })
        }
    });
}

