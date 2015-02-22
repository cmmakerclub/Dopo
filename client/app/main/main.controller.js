'use strict';

angular.module('dopoApp')
  .controller('MainCtrl', function ($scope, $http, socket) {

    var canvasDiv = document.getElementById('canvasDiv');
    var canvas = document.createElement('canvas');
    var context;
    canvas.setAttribute('width', 300);
    canvas.setAttribute('height', 300);
    canvas.setAttribute('id', 'canvas');
    canvasDiv.appendChild(canvas);

    if(typeof G_vmlCanvasManager != 'undefined') {
      canvas = G_vmlCanvasManager.initElement(canvas);
    }

    context = canvas.getContext("2d");

    var mousedown = function(e) {
      e.preventDefault();
      var mouseX = e.pageX - this.offsetLeft;
      var mouseY = e.pageY - this.offsetTop;
        
      paint = true;
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
      redraw();
    }

    var touchmove = function(e){
      e.preventDefault();
      if(paint){
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
      }
    }

    var mouseup = function(e) {
      paint = false;
    }

    // canvas.addEventListener("mousedown", mousedown, false);
    // canvas.addEventListener("touchstart", mousedown, false);

    // canvas.addEventListener("touchmove", touchmove, false);
    // canvas.addEventListener("mousemove", touchmove, false);

    // canvas.addEventListener("mouseup", mouseup, false);
    // canvas.addEventListener("mouseleave", mouseup, false);
    // canvas.addEventListener("touchend", mouseup, false);


    var clickX = new Array();
    var clickY = new Array();
    var clickDrag = new Array();
    var paint;

    function addClick(x, y, dragging)
    {
      clickX.push(x);
      clickY.push(y);
      clickDrag.push(dragging);
    }

    function redraw(){
      context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

      context.fillStyle   = '#333333'; // set canvas background color
      context.fillRect(0, 0, context.canvas.width, context.canvas.height)

      context.strokeStyle = "#df4b26";
      context.lineJoin = "round";
      context.lineWidth = 5;

      for (var i = 0; i < $scope.beacon.length; i++) {

        // context.beginPath();
        // context.arc($scope.beacon[i].position[0], $scope.beacon[i].position[1], 1, 0, 2 * Math.PI, true);
        // context.stroke();

        context.fillStyle = $scope.beacon[i].color;
        context.fillRect($scope.beacon[i].position[0], $scope.beacon[i].position[1], 3, 3);
        
        context.fill();

        console.log($scope.beacon[i])
      };

      for(var i=0; i < clickX.length; i++) {    

        context.beginPath();
        if(clickDrag[i] && i){
          context.moveTo(clickX[i-1], clickY[i-1]);
         }else{
           context.moveTo(clickX[i]-1, clickY[i]);
         }
         context.lineTo(clickX[i], clickY[i]);
         context.closePath();
         context.strokeStyle = "#000000"
         context.stroke();
      }
    }




    $scope.beacon = [];

    $http.get('/api/beacons').success(function(beacon) {
      $scope.beacon = beacon;
      // socket.syncUpdates('beacon', $scope.beacon);
      redraw();
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/beacons', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(beacon) {
      $http.delete('/api/beacons/' + beacon._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('beacon');
    });
  });
