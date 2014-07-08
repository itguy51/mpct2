var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var mpdSocket = require('mpdsocket');
var mpd = new mpdSocket('localhost','6600');

var mpdConnection = false;
var playlistList;
app.listen(8080);

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


mpd.on('connect',function() {
	mpdConnection = true;
	refreshPlaylists();
	
});

io.on('connection', function (socket) {
  socket.emit('playlistList', {inner:playlistList});
});

io.on('requestPlaylist', function (socket){
	socket.emit('playlistList', {inner:playlistList});
});

function refreshPlaylists(){
	if(mpdConnection){
		mpd.send('playlistinfo',function(r) {
        	playlistList = r;
        	console.log(r);
        	delete playlistList._ordered_list;
        	delete playlistList._OK;
    	});
	}
}