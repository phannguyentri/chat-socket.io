let socket          = io("http://localhost:3000");
let currentUserId   = undefined;

$(document).ready(function () {
    $('#btnRegister').click(() => {
        let txtUsername = $('#txtUsername').val();
        if (txtUsername) {
            socket.emit('client-register', txtUsername);
        } else {
            alert('Please enter your name!');
        }
    });

    $('#btnLogout').click(() => {
        socket.emit('client-logout', currentUserId);
    });

    $('#btnSendMessage').click(() => {
        let message = $('#txtMessage').val();
        socket.emit('client-send-message', message);
    });
});

socket.on('server-register', function(dataRegister) {
    if (dataRegister.name) {
        currentUserId = dataRegister.id;
        $('#currentUser').text(dataRegister.name);
        $('#chatForm').show();
        $('#loginForm').hide();
    } else {
        alert('Account was dulicated or logging');
    }
});

socket.on('server-data-login', function (listLogin) {
    showListLogin(listLogin);
});

socket.on('server-send-message', (data) => {
    console.log(data);
    $('#listMessage').append("<div class='chat-content'>" +data.name+ " : " +data.message+ "</div>");
});

socket.on('server-logout', () => {
    alert('logout');
    currentUserId   = undefined;
    $('#chatForm').hide();
    $('#loginForm').show();
});

socket.on('server-broadcast-logout', (listLogin) => {
    showListLogin(listLogin);
});

let showListLogin = (listLogin) => {
    $('#boxContent').empty();
    listLogin.forEach(function(value) {
        $('#boxContent').append('<div class="userOnline">' +value.name+ '</div>');
    });
};