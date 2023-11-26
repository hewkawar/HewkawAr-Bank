const userdisplayname = document.getElementById('userdisplayname');
const userprofile = document.getElementById('userprofile');
const balance_value = document.getElementById('balance');
const balance_pua_value = document.getElementById('balance_pua');
const deposit_value = document.getElementById('deposit');
const withdraw_value = document.getElementById('withdraw');
const balance_all_value = document.getElementById('balance_all');

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

if (getCookie('session')) {
    getSession();
}

function getSession(month, year) {
    const session_id = getCookie('session');

    axios(`https://api.hewkawar.xyz/app/bank/session?session_id=${session_id}`).then((response) => {
        if (userdisplayname && userprofile) {
            userprofile.src = response.data.profileurl;
            userdisplayname.innerText = response.data.displayname;

            if (month && year) {
                axios(`https://api.hewkawar.xyz/app/bank/transition?session_id=${session_id}&month=${month}&year=${year}`).then((response) => {
                    const loadScreen = document.getElementById('loadScreen');
                    const loader = document.getElementById('loader');
                    loadScreen.style.display = 'none';
                    loader.style.display = 'none';
                    balance_value.innerText = `${formatNumberWithCommas(response.data.account.balance)} THB`;
                    balance_pua_value.innerText = `${formatNumberWithCommas(response.data.account.balance_chip)} PUA`;
                    deposit_value.innerText = `${formatNumberWithCommas(response.data.account.deposit)} THB`;
                    withdraw_value.innerText = `${formatNumberWithCommas(response.data.account.withdraw)} THB`;
                    balance_all_value.innerHTML = `${formatNumberWithCommas(response.data.account.balance + response.data.account.balance_chip)} THB`
                })
            } else {
                axios(`https://api.hewkawar.xyz/app/bank/balance?session_id=${session_id}`).then((response) => {
                    const loadScreen = document.getElementById('loadScreen');
                    const loader = document.getElementById('loader');
                    loadScreen.style.display = 'none';
                    loader.style.display = 'none';
                    balance_value.innerText = `${formatNumberWithCommas(response.data.account.balance)} THB`;
                    balance_pua_value.innerText = `${formatNumberWithCommas(response.data.account.balance_chip)} PUA`;
                    deposit_value.innerText = `${formatNumberWithCommas(response.data.account.deposit)} THB`;
                    withdraw_value.innerText = `${formatNumberWithCommas(response.data.account.withdraw)} THB`;
                    balance_all_value.innerHTML = `${formatNumberWithCommas(response.data.account.balance + response.data.account.balance_chip)} THB`
                })
            }

        }
    })
}

function logout() {
    Swal.fire({
        title: "Logout",
        icon: "question",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "/logout.html";
        }
    });
}

function getHewkawArLoginDetail() {
    const expire = Date.now() + 4 * 60 * 60 * 1000;

    axios.post("https://api.hewkawar.xyz/oauth2/token", {
        code: getUrlParameter('code')
    }).then((response) => {
        const formattedDateTime = formatTime(expire);
        console.log(response.data);
        console.log(formattedDateTime);


        axios.post("https://api.hewkawar.xyz/app/bank/session", {
            username: response.data.username,
            displayname: response.data.display_name,
            profileurl: response.data.profile_url,
            expire: formattedDateTime,
        }).then((response) => {
            setCookie("session", response.data.detail.session_id, 4);
            Swal.fire({
                title: "Login Success!",
                text: "We will redirect you soon",
                icon: "success",
                timer: 5000,
                timerProgressBar: true,
                willClose: () => {
                    window.location.href = "/";
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

function HewkawArLogin() {
    axios.post('https://api.hewkawar.xyz/oauth2/login', {
        redirect_url: "https://bank.hewkawar.xyz/login.html"
    }).then((response) => {
        setCookie("code", response.data.code, 4)
        window.location.href = response.data.url;
    });
}

function deposit() {
    const session_id = getCookie('session');
    Swal.fire({
        title: "Deposit Amount",
        input: "text",
        inputAttributes: {
            autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "Confirm",
        showLoaderOnConfirm: true,
        preConfirm: async (deposit) => {
            await axios.post("https://api.hewkawar.xyz/app/bank/deposit", {
                session_id: session_id,
                amount: deposit
            }).then((response) => {
                return response.data;
            }).catch((error) => {
                Swal.showValidationMessage(`
                    Request failed: ${error.response.data.message}
                  `);
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            getSession();
        }
    })
}

function withdraw() {
    const session_id = getCookie('session');
    Swal.fire({
        title: "Withdraw Amount",
        input: "text",
        inputAttributes: {
            autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "Confirm",
        inputValidator: async (withdraw) => {
            try {
                if (!withdraw) {
                    return;
                }

                if (!isInt(parseInt(withdraw))) {
                    Swal.showValidationMessage(`Request failed: Allow Only Int`);
                }
            } catch (error) {
                Swal.showValidationMessage(`Request failed: ${error.response.data.message}`);
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then(async (result) => {
        if (result.isConfirmed && result.value) {
            await Swal.fire({
                title: "Currency",
                input: "select",
                inputOptions: {
                    Currency: {
                        thb: "THB",
                        pua: "PUA",
                    }
                },
                showCancelButton: true,
                confirmButtonText: "Confirm",
                showLoaderOnConfirm: true,
                preConfirm: async (value) => {
                    try {
                        const response = await axios.post("https://api.hewkawar.xyz/app/bank/withdraw", {
                            session_id: session_id,
                            amount: result.value,
                            currency: value
                        });

                        return response.data;
                    } catch (error) {
                        Swal.showValidationMessage(`Request failed: ${error.response.data.message}`);
                    }
                },
                allowOutsideClick: () => !Swal.isLoading()
            }).then(async (result) => {
                if (result.isConfirmed) {
                    getSession();
                }
            });
        }
    });

}

function convertTHB() {
    const session_id = getCookie('session');
    Swal.fire({
        title: "Convert to THB Amount",
        input: "text",
        inputAttributes: {
            autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "Confirm",
        showLoaderOnConfirm: true,
        preConfirm: async (thb) => {
            await axios.post("https://api.hewkawar.xyz/app/bank/convert/thb", {
                session_id: session_id,
                amount: thb
            }).then((response) => {
                return response.data;
            }).catch((error) => {
                Swal.showValidationMessage(`
                    Request failed: ${error.response.data.message}
                  `);
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            getSession();
        }
    })
}

function convertPUA() {
    const session_id = getCookie('session');
    Swal.fire({
        title: "Convert to PUA Amount",
        input: "text",
        inputAttributes: {
            autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "Confirm",
        showLoaderOnConfirm: true,
        preConfirm: async (thb) => {
            await axios.post("https://api.hewkawar.xyz/app/bank/convert/pua", {
                session_id: session_id,
                amount: thb
            }).then((response) => {
                return response.data;
            }).catch((error) => {
                Swal.showValidationMessage(`
                    Request failed: ${error.response.data.message}
                  `);
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            getSession();
        }
    })
}

function populateMonthYearDropdown() {
    var select = document.getElementById("monthYearSelect");

    var startYear = 2023;
    var startMonth = 11;

    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth() + 1;

    for (var year = startYear; year <= currentYear; year++) {
        var endMonth = (year === currentYear) ? currentMonth : 12;
        for (var month = (year === startYear) ? startMonth : 1; month <= endMonth; month++) {
            var option = document.createElement("option");
            option.value = year + "-" + (month < 10 ? "0" + month : month);
            option.text = month + "/" + year;
            select.add(option);
        }
    }
}

function monthYearSelectOnChange() {
    const [year, month] = document.getElementById("monthYearSelect").value.split('-');
    getSession(month, year);
}

populateMonthYearDropdown();