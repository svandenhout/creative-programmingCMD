require.config({
  baseUrl: "./js",
});

require(["car"], function(Car) {

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    startLoad = 0,
    endLoad = 0;

var car = new Car();

setInterval(function() {
  ctx.clearRect(0, 0, 1024, 500); // clear canvas
  car.drive(ctx);
}, 1000/60);

});