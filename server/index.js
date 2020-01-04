var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var request = require("request");

var path = require("path");

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname + "/../index.html"));
});

// app.get("/pixi.js/:file", function(req, res){
//   res.sendFile(path.resolve(__dirname + "/../node_modules/pixi.js/bin/" + req.params.file));
// });

app.get("/pixi.js/pixi.min.js", function(req, res){
  res.sendFile(path.resolve(__dirname + "/../node_modules/pixi.js/bin/pixi.min.js"));
});

io.on('connection', function(socket){
  console.log('a user connected');
  
  // request("http://localhost/", function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     console.log(body) // Show the HTML for the Google homepage.
  //   }
  // });
  
  socket.emit("imagedata", require("../php/image.json"));

  socket.broadcast.emit('hi');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on("pos", function(e){
    //console.log(e);
    socket.broadcast.emit("pos", e);
  });
});

http.listen(process.env.PORT, function(){
  console.log('listening on *:' + process.env.PORT);
});