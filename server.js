var express = require("express");
var app     = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server  = require("http").Server(app);
var io      = require("socket.io")(server);
server.listen(3000);

app.get("/", function(req, res){
    res.render("index-chat");
});

let arrRegister = [];

io.on("connection", function(socket){
    console.log(socket.id + " login!");

    socket.on('client-register', function(dataName) {
        arrRegister.push (
            {
                id      : socket.id,
                name    : dataName
            }
        );

        let listLogin = [];

        arrRegister.forEach(function(value, key){
            listLogin.push(value.name);
        });

        // return data to current client
        socket.emit('server-register', dataName);

        //  return data to all client
        io.sockets.emit('server-data-login', listLogin);
    });

    socket.on('disconnect', function () {

    });
});