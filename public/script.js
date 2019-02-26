let socket = io("http://localhost:3000");

$(document).ready(function () {
    $('#btnRegister').click(function () {
        let txtUsername = $('#txtUsername').val();
        if (txtUsername) {
            socket.emit('client-register', txtUsername);
        } else {
            alert('Please enter your name!');
        }
    })
});

socket.on('server-register', function(dataName) {
    $('#currentUser').text(dataName);
    $('#chatForm').show();
    $('#loginForm').hide();
});

socket.on('server-data-login', function (listLogin) {
    $('#boxContent').empty();
    listLogin.forEach(function(value) {
        $('#boxContent').append('<div class="userOnline">' +value+ '</div>');
    });
});