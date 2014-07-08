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



function playlistController($scope){
	$scope.innerList = {};
}