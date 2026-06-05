let app = require('express')();
let http = require('http').createServer(app);
let io = new (require('socket.io').Server)(http);
let path = require("path");
let { getImageData } = require("./generate-image");

function emitImageData(socket) {
  const imageData = getImageData();
  socket.emit("imagedata", { text: imageData.text, pixels: imageData.pixels });
}

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname + "/../index.html"));
});

app.get("/pixi.js/pixi.min.js", function(req, res){
  res.sendFile(path.resolve(__dirname + "/../node_modules/pixi.js/dist/pixi.min.js"));
});

app.get("/image.png", function(req, res){
  const data = getImageData();
  res.type("png").send(data.png);
});

io.on('connection', function(socket){
  socket.on('error', function() {});

  console.log('a user connected');

  emitImageData(socket);

  socket.broadcast.emit('hi');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on("pos", function(e){
    socket.broadcast.emit("pos", e);
  });
});

getImageData();

const port = process.env.PORT || 3001;
http.listen(port, function(){
  console.log('listening on *:' + port);
});

setInterval(function () {
  const imageData = getImageData();
  io.emit("imagedata", { text: imageData.text, pixels: imageData.pixels });
}, 1000);
