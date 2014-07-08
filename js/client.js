function changeList(element, data) {
    var scope = angular.element($(element)).scope();
    scope.$apply(function(){
        scope.innerList = data;
    })
}

var socket = io('http://localhost:8080');

  socket.on('playlistList', function (data) {
    changeList("#playlist", data.inner);
});
socket.on('shuffleStatus', function (data) {
    if(data.data == 1){
    	$("#shuffle").removeClass('btn-default').addClass('btn-primary');
    }else{
    	$("#shuffle").removeClass('btn-primary').addClass('btn-default');
    }
});
socket.on('playSongID', function(d){
	$(".active").removeClass('active');
	$("a[data-item='" + d.data + "']").addClass('active');
});


$(document).ready(function(){
	$("#prev").click(function(){
		socket.emit('prev', null);
	});
	$("#shuffle").click(function(){
		socket.emit('shuffleChange', null);
	});
	$("#next").click(function(){
		socket.emit('next', null);
	});
	$("#toggle").click(function(){
		socket.emit('toggle', null);
	});
	$('#genre').keyup(function() {
		if (this.value.match(/[^a-zA-Z]/g)) {
			var tmpval = this.value;
			this.value = this.value.replace(/[^a-zA-Z]/g, '');
			var key = tmpval.replace(/[^1-5]/g, '')[0];
			if($("a[data-idx='" + key + "']").data('shortcode') != undefined){
				this.value = "";
				socket.emit('addbysc', {shr:$("a[data-idx='" + key + "']").data('shortcode')});
			}

		}
		if(this.value == ""){
			searchFuse("s", true);
		}else{
			searchFuse($('#genre').val(), false);
		}
		
	});
});

function playlistController($scope){
	$scope.innerList = {};
	$scope.playItem = function(songToPlay){
		socket.emit('playsong', {data:songToPlay});
	}
}

function fuseController($scope){
	$scope.fuseList = [];
}

var list = [{short_name: "am", full_name: "Ambient"},
{short_name: "ab", full_name: "Ambient Beats"},
{short_name: "bb", full_name: "Breakbeat"},
{short_name: "bc", full_name: "Breakcore, Gabber, and Noise"},
{short_name: "ch", full_name: "Chill Out and Dub"},
{short_name: "cl", full_name: "Classical"},
{short_name: "co", full_name: "Compilations"},
{short_name: "dj", full_name: "DJ Beats"},
{short_name: "db", full_name: "Drum 'n Bass"},
{short_name: "dt", full_name: "Dub Techno"},
{short_name: "du", full_name: "Dubstep"},
{short_name: "el", full_name: "Electronic and Electro"},
{short_name: "fo", full_name: "Folk"},
{short_name: "go", full_name: "Goa"},
{short_name: "ho", full_name: "House"},
{short_name: "id", full_name: "IDM"},
{short_name: "ja", full_name: "Jazz"},
{short_name: "me", full_name: "Metal"},
{short_name: "mi", full_name: "Minimalistic"},
{short_name: "po", full_name: "Pop"},
{short_name: "pr", full_name: "Post-rock"},
{short_name: "ra", full_name: "Rap and Hip Hop"},
{short_name: "re", full_name: "Reggae and Dub"},
{short_name: "ro", full_name: "Rock"},
{short_name: "sl", full_name: "Soul"},
{short_name: "so", full_name: "Soundtracks"},
{short_name: "te", full_name: "Techno"},
{short_name: "tr", full_name: "Trance"},
{short_name: "th", full_name: "Trip-Hop"},
{short_name: "we", full_name: "Weird"},
{short_name: "wo", full_name: "World and New Age"}];



var options = {
  caseSensitive: false,
  includeScore: false,
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  keys: ["full_name","short_name"]
};
var fuse = new Fuse(list, options); // "list" is the item array
function searchFuse(hotterm, clearOut){
  var result = fuse.search(hotterm);
  var fl = [];

  for (var i = 0; i < 5; i++) {
  	result[i].idx = i+1;
  	fl.push(result[i]);
  };
  var scope = angular.element($("#fuseList")).scope();
  if(clearOut){
  	fl = [];
  }
    scope.$apply(function(){
        scope.fuseList = fl;
    });
}



//mpct2/client.js