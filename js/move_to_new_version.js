if (getUrlParameter('code')) {
    Swal.fire({
        title: "Loading...",
        icon: "info",
        showConfirmButton: false,
        timer: 1000,
        willClose: () => {
            getHewkawArOldLoginDetail()
        }
    });
}

if (getUrlParameter('token')) {
    Swal.fire({
        title: "Loading...",
        icon: "info",
        showConfirmButton: false,
        timer: 1000,
        willClose: () => {
            getHewkawArNewLoginDetail()
        }
    });
}

function HewkawArNewLogin() {
    window.location.href = `https://auth.hewkawar.xyz/logout?redirect_uri=${window.location.href}`;
}

function HewkawArOldLogin() {
    axios.post('https://api.hewkawar.xyz/oauth2/login', {
        redirect_url: window.location.href
    }).then((response) => {
        setlocalStorage("code", response.data.code)
        window.location.href = response.data.url;
    });
}

function getHewkawArOldLoginDetail() {
    axios.post("https://api.hewkawar.xyz/oauth2/token", {
        code: getUrlParameter('code')
    }).then((response) => {
        axios.post("https://api.hewkawar.xyz/app/bank/session", {
            username: response.data.username,
            displayname: response.data.display_name,
            profileurl: response.data.profile_url,
        }).then((response) => {
            setlocalStorage("session_old", response.data.detail.session_id);
            Swal.fire({
                title: "Login Success!",
                text: "We will redirect you soon",
                icon: "success",
                timer: 5000,
                timerProgressBar: true,
                willClose: () => {
                    window.location.href = '/move/new_version';
                }
            })
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

function getHewkawArNewLoginDetail() {
    axios.get(`https://auth-api.hewkawar.xyz/token/${getUrlParameter('token')}`).then((response) => {
        axios.post("https://api.hewkawar.xyz/app/bank/session", {
            username: response.data.data.username,
            displayname: response.data.data.display_name,
            profileurl: response.data.data.profile_url,
        }).then((response) => {
            setlocalStorage("session_new", response.data.detail.session_id);
            Swal.fire({
                title: "Login Success!",
                text: "We will redirect you soon",
                icon: "success",
                timer: 5000,
                timerProgressBar: true,
                willClose: () => {
                    window.location.href = '/move/new_version';
                }
            })
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

function runMoveNew() {
    Swal.fire({
        title: "Do you want to confirm move data right?",
        icon: "info",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Confirm",
        denyButtonText: `Deny`
    }).then(async (result) => {
        if (result.isConfirmed) {
            const getSesstionUrl = new URL("https://api.hewkawar.xyz/app/bank/session");
            const moveToNewAccount = new URL("https://api.hewkawar.xyz/app/bank/move_to_new_version");
            getSesstionUrl.searchParams.set('session_id', getlocalStorage('session_old'));
            let old_username, new_username;

            await axios.get(getSesstionUrl).then((res) => {
                old_username = res.data.username;
            });

            getSesstionUrl.searchParams.set('session_id', getlocalStorage('session_new'));

            await axios.get(getSesstionUrl).then((res) => {
                new_username = res.data.username;
            })

            await axios.post(moveToNewAccount, {
                old_username: old_username,
                new_username: new_username,
                old_session_id: getlocalStorage('session_old'),
                new_session_id: getlocalStorage('session_new'),
            });

            setlocalStorage('session', getlocalStorage('session_new'));
            removelocalStorage('session_old');
            removelocalStorage('session_new');

            window.location.href = '/';
        } else if (result.isDenied) {
            window.location.href = "/";
        }
    });
}