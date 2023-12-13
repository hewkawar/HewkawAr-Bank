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

if (getlocalStorage('session')) {
    getSession();
}

function getSession(month, year, popup = false) {
    const session_id = getlocalStorage('session');

    if (!session_id) {
        clearInterval(autoUpdate);
        Swal.fire({
            title: "Session Expired",
            icon: "error",
            willClose: () => {
                window.location.href = "/logout";
            }
        });
    }

    axios(`https://api.hewkawar.xyz/app/bank/session?session_id=${session_id}`).then((response) => {
        if (userdisplayname && userprofile) {
            userprofile.src = response.data.profileurl;
            userdisplayname.innerText = response.data.displayname;

            if (popup) {
                Swal.fire({
                    title: "Loading...",
                    icon: "info",
                    showConfirmButton: false,
                    timer: 1000,
                    willClose: () => {
                        if (balance_value) {
                            getBalance(session_id, month, year);
                        }
                    }
                });
            } else {
                if (balance_value) {
                    getBalance(session_id, month, year);
                }
            }
        }

        return {
            username: response.data.username,
            displayname: response.data.displayname,
            profileurl: response.data.profileurl
        };
    }).catch((error) => {
        clearInterval(autoUpdate);
        if (error.response && error.response.status === 406) {
            Swal.fire({
                title: "Access Denied",
                icon: "error"
            });
        } else if (error.response.status === 502) {
            Swal.fire({
                title: "Can't Connect to Server",
                icon: "error",
                willClose: () => {
                    window.location.href = "/logout";
                }
            });
        } else {
            Swal.fire({
                title: "Something error",
                text: "try again later",
                icon: "error",
                willClose: () => {
                    window.location.href = "/logout";
                }
            })
        }
    });
}

function getBalance(session_id, month, year) {
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
            window.location.href = "/logout";
        }
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
        }).then((response) => {
            setlocalStorage("session", response.data.detail.session_id);
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
        redirect_url: window.location.href
    }).then((response) => {
        setlocalStorage("code", response.data.code)
        window.location.href = response.data.url;
    });
}

function deposit() {
    const session_id = getlocalStorage('session');
    Swal.fire({
        title: "Deposit Amount",
        input: "number",
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
    const session_id = getlocalStorage('session');
    Swal.fire({
        title: "Withdraw Amount",
        input: "number",
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
    const session_id = getlocalStorage('session');
    Swal.fire({
        title: "Convert to THB Amount",
        input: "number",
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
    const session_id = getlocalStorage('session');
    Swal.fire({
        title: "Convert to PUA Amount",
        input: "number",
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

    for (var year = currentYear; year >= startYear; year--) {
        var endMonth = (year === currentYear) ? currentMonth : 12;
        var startMonthValue = (year === startYear) ? startMonth : 1;

        for (var month = endMonth; month >= startMonthValue; month--) {
            var option = document.createElement("option");
            option.value = year + "-" + (month < 10 ? "0" + month : month);
            option.text = month + "/" + year;
            select.add(option);
        }
    }

    // Set default option to the newest value
    var defaultYear = currentYear;
    var defaultMonth = currentMonth < 10 ? "0" + currentMonth : currentMonth;
    var defaultValue = defaultYear + "-" + defaultMonth;
    
    // Select the default option
    var defaultOption = document.querySelector("#monthYearSelect option[value='" + defaultValue + "']");
    if (defaultOption) {
        defaultOption.selected = true;
    }
}


function monthYearSelectOnChange() {
    const [year, month] = document.getElementById("monthYearSelect").value.split('-');
    getSession(month, year, true);
}

if (document.getElementById("monthYearSelect")) {
    populateMonthYearDropdown();
}

if (getlocalStorage("session")) {
    var autoUpdate = setInterval(() => {
        const [year, month] = document.getElementById("monthYearSelect").value.split('-');
        getSession(month, year);
    }, 5000)
}