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
socket.on('playSongID', function(d){
	console.log(d);
	$(".active").removeClass('active');
	$("a[data-item='" + d.data + "']").addClass('active');
});




function playlistController($scope){
	$scope.innerList = {};
	$scope.playItem = function(songToPlay){
		socket.emit('playsong', {data:songToPlay});
	}
}