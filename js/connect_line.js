function HewkawArLoginConnectLine() {
    axios.post('https://api.hewkawar.xyz/oauth2/login', {
        redirect_url: window.location.href
    }).then((response) => {
        setlocalStorage("code", response.data.code)
        window.location.href = response.data.url;
    });
}

function getHewkawArLoginDetail() {
    axios.post("https://api.hewkawar.xyz/oauth2/token", {
        code: getUrlParameter('code')
    }).then((response) => {
        axios.post("https://api.hewkawar.xyz/app/bank/session", {
            username: response.data.username,
            displayname: response.data.display_name,
            profileurl: response.data.profile_url,
        })
            .then((response) => {
                setlocalStorage("session", response.data.detail.session_id);
                Swal.fire({
                    title: "Login Success!",
                    text: "You Want to connect to Line Account?",
                    icon: "info",
                    showConfirmButton: true,
                    showDenyButton: true,
                    confirmButtonText: "Confirm",
                    denyButtonText: `Cancel`
                }).then((result) => {
                    if (result.isConfirmed) {
                        axios.post("https://api.hewkawar.xyz/app/bank/connect", {
                            platform: 'line',
                            uuid: getUrlParameter('uuid'),
                            username: response.data.detail.username,
                            session_id: response.data.detail.session_id
                        });
                        Swal.fire({
                            title: "Connect Success!",
                            icon: "success",
                            timer: 1000,
                            timerProgressBar: true,
                            willClose: () => {
                                window.close();
                            }
                        });
                    } else if (result.isDenied) {
                        Swal.fire({
                            title: "Connect Faild!",
                            icon: "error",
                            timer: 1000,
                            timerProgressBar: true,
                            willClose: () => {
                                window.close();
                            }
                        });
                    }
                });
            });
    }).catch((error) => {
        if (error.response && error.response.status === 406) {
            Swal.fire({
                title: "Access Denied",
                icon: "error"
            })
        } else {
            Swal.fire({
                title: "Something error",
                text: "try again later",
                icon: "error"
            })
        }
    });
}

if (getUrlParameter('code')) {
    Swal.fire({
        title: "Loading...",
        icon: "info",
        showConfirmButton: false,
        timer: 1000,
        willClose: () => {
            getHewkawArLoginDetail()
        }
    });

}