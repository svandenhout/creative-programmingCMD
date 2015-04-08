require.config({
  baseUrl: "./js",
});

require(["car", "track"], function(Car, Track) {

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    startLoad = 0,
    endLoad = 0;

var car = new Car();
var track = new Track();
ctx.lineWidth = 2;
ctx.strokeStyle = "black";
setInterval(function() {
  ctx.clearRect(0, 0, 1280, 600); // clear canvas
  track.exist(ctx);
  car.drive(ctx);
}, 1000/60);

});