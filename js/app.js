require.config({
  baseUrl: "./js",
});

require(["car", "track"], function(Car, Track) {

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    startLoad = 0,
    endLoad = 0;

var car = new Car(110, 220);
var track = new Track();

ctx.fillStyle = "rgba(0,0,0,1)";
setInterval(function() {
  ctx.clearRect(0, 0, 1280, 600); // clear canvas
  ctx.fillRect(0, 0, 1280, 600);
  track.exist(ctx);
  car.drive(ctx);
}, 1000/60);

});