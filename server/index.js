let app = require('express')();
let http = require('http').createServer(app);
let io = new (require('socket.io').Server)(http);
let path = require("path");
let { getImageData } = require("./generate-image");

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname + "/../index.html"));
});

// app.get("/pixi.js/:file", function(req, res){
//   res.sendFile(path.resolve(__dirname + "/../node_modules/pixi.js/bin/" + req.params.file));
// });

app.get("/pixi.js/pixi.min.js", function(req, res){
  res.sendFile(path.resolve(__dirname + "/../node_modules/pixi.js/dist/pixi.min.js"));
});

// php/index.php 相当: PNG 画像を返す
app.get("/image.png", function(req, res){
  const data = getImageData();
  res.type("png").send(data.png);
});

io.on('connection', function(socket){
  socket.on('error', function() {});

  console.log('a user connected');
  
  // request("http://localhost/", function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     console.log(body) // Show the HTML for the Google homepage.
  //   }
  // });
  
  const imageData = getImageData();
  socket.emit("imagedata", { text: imageData.text, pixels: imageData.pixels });

  socket.broadcast.emit('hi');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on("pos", function(e){
    //console.log(e);
    socket.broadcast.emit("pos", e);
  });
});

getImageData();
http.listen(process.env.PORT || 3001, function(){
  console.log('listening on *:' + (process.env.PORT || 3000));
});