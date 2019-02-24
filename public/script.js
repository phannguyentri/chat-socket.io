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
    console.log(dataName);
});

socket.on('server-data-login', function (listLogin) {
    console.log(listLogin)
});