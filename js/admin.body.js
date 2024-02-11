const transition_table_data = document.getElementById("transition-table-data");
const session_table_data = document.getElementById("session-table-data");
const account_table_data = document.getElementById("account-table-data");
const account_line_table_data = document.getElementById("account-line-table-data");

const dashboard_data = {
    transitions: [],
    sessions: [],
    accounts: [],
    account_lines: [],
};

// axios.post("https://api.hewkawar.xyz/app/bank/admin", {
//     session_id: getlocalStorage("session_id"),
// }).then((res) => {
//     dashboard_data.transitions = res.data.transitions;
//     dashboard_data.sessions = res.data.sessions;
//     dashboard_data.accounts = res.data.accounts;
//     dashboard_data.account_lines = res.data.account_lines;
// });

dashboard_data.transitions.forEach((transition) => {
    const tr = document.createElement("tr");
    const d_id = document.createElement("td");
    const d_username = document.createElement("td");
    const d_type = document.createElement("td");
    const d_amount = document.createElement("td");
    const d_timestamp = document.createElement("td");

    const current_time = new Date(transition.timestamp);
    const time = current_time;

    d_id.innerText = transition.id;
    d_username.innerText = transition.username;
    d_type.innerText = transition.type;
    d_amount.innerText = transition.amount.toLocaleString();
    d_timestamp.innerText = time;

    tr.appendChild(d_id);
    tr.appendChild(d_username);
    tr.appendChild(d_type);
    tr.appendChild(d_amount);
    tr.appendChild(d_timestamp);

    transition_table_data.appendChild(tr);
});

dashboard_data.sessions.forEach((session) => {
    const tr = document.createElement("tr");
    const d_id = document.createElement("td");
    const d_sessionid = document.createElement("td");
    const d_username = document.createElement("td");
    const d_displayname = document.createElement("td");
    const d_useragent = document.createElement("td");
    const d_timestamp = document.createElement("td");
    const d_action = document.createElement("td");

    const current_time = new Date(session.timestamp);
    const time = current_time;

    d_id.innerText = session.id;
    d_sessionid.innerText = session.session_id;
    d_username.innerText = session.username;
    d_displayname.innerText = session.display_name;
    d_useragent.innerText = session.user_agent;
    d_timestamp.innerText = time;

    const action_group = document.createElement("div");
    const action_logout = document.createElement("button");

    action_logout.innerText = "Logout";

    action_logout.onclick = function() {
        ActionSessionLogout(session.session_id);
    };

    action_logout.className = "btn btn-logout";

    action_group.appendChild(action_logout);

    d_action.appendChild(action_group);

    tr.appendChild(d_id);
    tr.appendChild(d_sessionid);
    tr.appendChild(d_username);
    tr.appendChild(d_displayname);
    tr.appendChild(d_useragent);
    tr.appendChild(d_timestamp);
    tr.appendChild(d_action);

    session_table_data.appendChild(tr);
});

dashboard_data.accounts.forEach((account) => {
    const tr = document.createElement("tr");
    const d_id = document.createElement("td");
    const d_username = document.createElement("td");
    const d_balance = document.createElement("td");
    const d_balance_clip = document.createElement("td");
    const d_last_update = document.createElement("td");
    const d_action = document.createElement("td");

    const current_time = new Date(account.timestamp);
    const time = current_time;

    d_id.innerText = account.id;
    d_username = account.username;
    d_balance = account.balance;
    d_balance_clip = account.balance_chip;
    d_last_update = time;

    const action_group = document.createElement("div");
    const action_edit_balance = document.createElement("button");

    action_edit_balance.innerText = "Edit Balance";

    action_edit_balance.onclick = function() {
        ActionAccountEditBalance(account.id);
    };

    action_edit_balance.className = "btn btn-edit";

    action_group.appendChild(action_edit_balance);

    d_action.appendChild(action_group);

    tr.appendChild(d_id);
    tr.appendChild(d_username);
    tr.appendChild(d_balance);
    tr.appendChild(d_balance_clip);
    tr.appendChild(d_last_update);
    tr.appendChild(d_action);

    account_table_data.appendChild(tr);
});

dashboard_data.account_lines.forEach((account) => {
    const tr = document.createElement("tr");
    const d_id = document.createElement("td");
    const d_username = document.createElement("td");
    const d_uid = document.createElement("td");
    const d_last_update = document.createElement("td");
    const d_action = document.createElement("td");

    const current_time = new Date(account.timestamp);
    const time = current_time;

    d_id.innerText = account.id;
    d_username = account.username;
    d_uid = account.uid;
    d_last_update = time;

    const action_group = document.createElement("div");
    const action_delete = document.createElement("button");

    action_delete.innerText = "Delete";

    action_delete.onclick = function() {
        ActionAccountLineDelete(account.id);
    };

    action_delete.className = "btn btn-delete";

    action_group.appendChild(action_delete);

    d_action.appendChild(action_group);

    tr.appendChild(d_id);
    tr.appendChild(d_username);
    tr.appendChild(d_uid);
    tr.appendChild(d_last_update);
    tr.appendChild(d_action);

    account_table_data.appendChild(tr);
});

new DataTable('#transition-table');
new DataTable('#session-table');
new DataTable('#account-table');
new DataTable('#account-line-table');