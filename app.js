var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var config = require("./config");
var komponist = require('komponist')
var mpdConnection = false;
var playlistList = [];
app.listen(config.httpServerPort);

var client = komponist.createConnection(config.mpdPort, config.mpdHost, function() {
  mpdConnection = true;
  

  refreshPlaylists();

});





function handler (req, res) {

  fs.readFile(__dirname + req.url,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}


io.on('connection', function (socket) {

  refreshPlaylists();
  socket.emit('playlistList', {inner:playlistList});
  getPlayingSong(function(song){
      socket.emit('playSongID', {data:song});
  });

  socket.on('playsong', function(data){
  	client.play(data.data);
  	getPlayingSong(function(song){
      socket.emit('playSongID', {data:song});

    });
  });
  socket.on('toggle', function(sck){
    client.toggle();
  //sck.emit('setToggle', {tgl:})
  });
  socket.on('next', function(sck){
    client.command('next');
  });
  socket.on('prev', function(sck){
    client.command('previous');
  });
  socket.on('addbysc', function(sck){
    //use sck.shr for a shortcode to add to mpd. Rewrite as needed.
    console.log(sck.shr);
  });
});

client.on('changed', function(system) {
   switch (system){
    case 'player':
      getPlayingSong(function(song){
        io.emit('playSongID', {data:song});
      });
      break;
    case 'playlist':
      refreshPlaylists();
      io.emit('playlistList', {inner:playlistList});
      break;
    case 'options':
      //This happens if the modes are changed, i.e. repeat, other stuff.
   }
 });


io.on('requestPlaylist', function (socket){
  refreshPlaylists();
	socket.emit('playlistList', {inner:playlistList});
});


function refreshPlaylists(){
  client.playlistinfo(function(err, info){
    playlistList = info;
  });
  for (var i = 0; i < playlistList.length; i++) {
    playlistList[i].Pos = parseInt(playlistList[i].Pos);
  }
}

function getPlayingSong(callbackFunction){
	client.status(function(err, r) {
    	callbackFunction(r.song);
	});
}











//mpct2/app.js