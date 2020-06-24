const form = document.getElementById('form');
const usernameF = document.getElementById('username');
const passwordF = document.getElementById('password');
const btn = document.getElementsByClassName('btn')[0];

const sortBtn = document.getElementsByClassName('sort')[0];


let username = "test_super";
let password = "Nf<U4f<rDbtDxAPn";


let urlAuth = "http://emphasoft-test-assignment.herokuapp.com/api-token-auth/";
let urlUsersList = `http://emphasoft-test-assignment.herokuapp.com/api/v1/users/`;

let data = {
    username,
    password
}

let cachedRows;


async function authFunc(url = '', data = {}) {
    let response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(data)
    });

    if(response.ok){
        let json = await response.json();
        return json;
    } else { 
        console.log(response.status);
    }
    
}

async function userList(url = '', token = '') {
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json',
            'X-CSRFToken': 'YtDNTqGzq6W0qNFYYxNPxE4VqkjPsrh5pr1A3kZUNzoKYpDIhu3jAiF4h5uBmnOt'
          }
    });

    if(response.ok) {
        return await response.json();

    } else {
        console.log(response.status);
    }
}



function showError(item, message) {
    const formControl = item.parentElement;
    formControl.classList = 'form__control error';
    const small = formControl.querySelector('small');
    small.innerText = message;
    return false;
}

function showSuccess(item) {
    const formControl = item.parentElement;
    formControl.classList = 'form__control success';
    return true;
}

function getFieldName(item) {
    return item.id.charAt(0).toUpperCase() + item.id.slice(1);
}

// check for empty fields

function checkRequired(inputArr) {
    for(item of inputArr) {
        if(item.value.trim() === '') {
            return showError(item, `${getFieldName(item)} is required`);
        } else {
            return showSuccess(item);
        }
    }
}

//check min&max length of field

function checkLength(item, min, max) {
    if(item.value.length < min) {
        return showError(item, `${getFieldName(item)} must be at least ${min} characters`);
    } else if(item.value.length > max) {
        return showError(item, `${getFieldName(item)} must be less than ${max} characters`);
    } else return showSuccess(item);
}

function initTrow(tr, cols) {
    // let tr = document.createElement("tr");
    // tr.classList = 'row';
    for(let j = 0; j < cols; j++) {
        let th = document.createElement("th");
        let text = '';
        switch(j) {
            case 0:
                text = 'id';
                // console.log(text);
                break;
            case 1:
                // console.log(users[i].username);
                text = 'username';
                break;
            case 2:
                // console.log(users[i].first_name);
                text = 'first_name';
                break;
            case 3:
                // console.log(users[i].last_name);
                text = 'last_name';
                break;
            case 4:
                // console.log(users[i].is_active);
                text = 'is_active';
                break;

        }

        th.textContent = text;
        // th.classList = 'col';
        tr.appendChild(th);
    }
    return tr;
}

function formTrow(tr, i, cols, users) {
    for(let j = 0; j < cols; j++) {
        let td = document.createElement("td");
        let text = '';
        switch(j) {
            case 0:
                text = users[i-1].id;
                // console.log(text);
                break;
            case 1:
                // console.log(users[i].username);
                text = users[i-1].username.trim();
                break;
            case 2:
                // console.log(users[i].first_name);
                text = users[i-1].first_name.trim();
                break;
            case 3:
                // console.log(users[i].last_name);
                text = users[i-1].last_name.trim();
                break;
            case 4:
                // console.log(users[i].is_active);
                text = users[i-1].is_active;
                break;

        }

        td.textContent = text;
        td.classList = 'col';
        tr.appendChild(td);
    }
    return tr;
}

// make table of users 

function createTable(table, users, parent, rows, cols) {
    
    table.setAttribute("border", "1px");
    table.classList = 'table';
    table.id = 'table';
    // table = initTable(table, cols);

    for(let i = 0; i < rows+1; i++) {
        let tr = document.createElement("tr");
        tr.classList = 'row';
        if(i == 0) {
            tr = initTrow(tr, cols);
        } else {
            tr = formTrow(tr, i, cols, users);
        }
        
        table.appendChild(tr);
    }
    return parent.appendChild(table);
}

// add event listener on submit button to authorize and display table of users

btn.addEventListener('click', () => {

    if(checkRequired([usernameF, passwordF]) && checkLength(usernameF, 2, 20) && checkLength(passwordF, 2, 20)) {
        
        // {username: usernameF.value, password: passwordF.value}
        authFunc(urlAuth, {username: usernameF.value, password: passwordF.value})
            .then(json => {
                console.log('ok ', json.token);
                const loginStatus = document.getElementsByClassName('login')[0];
                loginStatus.classList = 'login success';
                loginStatus.innerHTML = 'You\'ve just logged in.';
                const container = document.getElementsByClassName('container')[0];

                let op = 1;
                while(op > 0) {
                    setTimeout(() => {
                        container.style.opacity = op;
                    }, 200);
                    op -= 0.1;
                }
                setTimeout(()=>{
                    container.style.display = 'none';
                }, 1000);
                
                return json.token;
            })
            .then(token => {
                
                return userList(urlUsersList, token);
            })
            .then(users => {
                console.log(users);
                const tableContainer = document.getElementsByClassName('table-container')[0];
                let table = document.createElement("table");
                createTable(table, users, tableContainer, users.length, 5);
                cachedRows = Array.from(table.rows);
            })
            .catch(error => {
                console.log(error.message);
                const loginStatus = document.getElementsByClassName('login')[0];
                loginStatus.innerHTML = 'Something went wrong. Couldn\'t authorize you.';
                loginStatus.classList = 'login error';
            });
    }
});

// sorting table by id on button click



sortBtn.addEventListener('click', () => {
    let table = document.getElementById('table');
    // console.log(table.rows);
    // let cachedRows = Array.from(table.rows);

    let sortedRows = Array.from(table.rows)
        .slice(1)
        .sort((rowA, rowB) => +rowA.cells[0].innerText > +rowB.cells[0].innerText ? 1 : -1);

    // console.log(sortedRows);

    table.append(...sortedRows);
    // cacheTable = table;
});


const filterInput = document.getElementsByClassName('filter')[0];



function clearTable(table) {
    // console.log(table.rows[1]);

    let len = table.rows.length-1;
    // console.log(table);
    for(let i = len; i > 0; i--) {
        table.deleteRow(i);
    }
    // console.log(table.rows[1]);
    // return table;
}

filterInput.addEventListener('input', () => {
    let table = document.getElementById('table');
    // clearTable(table);
    // console.log(cachedRows);
    table.append(...cachedRows);

    // console.log(table.rows);
    let filterValue = filterInput.value;
    let filteredRows = Array.from(table.rows)
        .slice(1)
        .filter(row => row.cells[1].innerText.indexOf(filterValue) != -1);

    // console.log(filteredRows);
    clearTable(table);
    table.append(...filteredRows);
    // console.log(filteredRows);
})