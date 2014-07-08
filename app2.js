var komponist = require('komponist')

var hasConnection = false;
var client = komponist.createConnection(6600, 'localhost', function() {
	hasConnection = true;
	/*client.on('changed', function(system) {
     console.log('Subsystem changed: ' + system);
     switch (system){
     	case 'player':
     		console.log("Song Status Changed");
     }
   });*/
	client.playlistinfo(function(err, info){
		console.log(info);
	});
});


