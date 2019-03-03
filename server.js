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
let listLogin   = [];

let registerUser = (arrRegister, socketId, name) => {
    let listRegisterName    = [];
    listRegisterName.push(name);
    arrRegister.forEach(register => {
        listRegisterName.push(register.name);
    });

    if (!findDuplicateInArray(listRegisterName).length) {
        arrRegister.push (
            {
                id      : socketId,
                name    : name
            }
        );
    } else {
        return false;
    }

    return arrRegister;
};

let findDuplicateInArray = (array) => {
    const object = {};
    const result = [];

    array.forEach(item => {
        if(!object[item])
            object[item] = 0;
        object[item] += 1;
    });

    for (const prop in object) {
        if(object[prop] >= 2) {
            result.push(prop);
        }
    }

    return result;
};

let checkInListLogin =  (listLogin, name) => {
    var result = false;
    listLogin.forEach((itemLogin) => {
        if (itemLogin.name === name){
            result = true;
        }
    });

    return result;
};

io.on("connection", function(socket){
    console.log(socket.id + " login!");

    socket.on('client-register', function(name) {
        let newRegister = registerUser(arrRegister, socket.id, name);

        if (newRegister) {
            arrRegister = newRegister;
            // return data to current client
            socket.emit('server-register', {id : socket.id, name: name});
            socket.Username = name;
        } else {
            if (checkInListLogin(listLogin, name)) {
                // return data to current client
                socket.emit('server-register', false);
                return;
            } else {
                socket.emit('server-register', {id : socket.id, name: name});
                socket.Username = name;
            }
        }

        listLogin.push({
            id   : socket.id,
            name : name
        });

        //  return data to all client
        io.sockets.emit('server-data-login', listLogin);
    });

    socket.on('client-logout', (currentUserId) => {
        console.log(currentUserId);
        listLogin.forEach((itemLogin, key) => {
            if (itemLogin.id === currentUserId){
                listLogin.splice(key, 1);
                socket.broadcast.emit('server-broadcast-logout', listLogin);
                socket.emit('server-logout');
            }
        });
    });

    socket.on('disconnect', function () {

    });
});
