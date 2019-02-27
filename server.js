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
io.on("connection", function(socket){
    console.log(socket.id + " login!");

    socket.on('client-register', function(dataName) {
        let newRegister = registerUser(arrRegister, socket.id, dataName);

        if (newRegister) {
            arrRegister = newRegister;
            // return data to current client
            socket.emit('server-register', dataName);
        } else {
            // return data to current client
            socket.emit('server-register', false);
            return;
        }

        listLogin.push(dataName);

        //  return data to all client
        io.sockets.emit('server-data-login', listLogin);
    });

    socket.on('disconnect', function () {

    });
});

let registerUser = (arrRegister, socketId, dataName) => {
    let listRegisterName    = [];
    listRegisterName.push(dataName);
    arrRegister.forEach(function(register){
        listRegisterName.push(register.name);

    });

    if (!find_duplicate_in_array(listRegisterName).length) {
        arrRegister.push (
            {
                id      : socketId,
                name    : dataName
            }
        );
    } else {
        return false;
    }

    return arrRegister;
};

function find_duplicate_in_array(array) {
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
}
