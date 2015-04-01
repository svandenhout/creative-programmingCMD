define("car", function() {

function Car() {
  this.image = new Image();
  this.image.src = "assets/car.png";
  this.angularVel = 0,
  this.angle = 0,
  this.x = 0,
  this.y = 0,
  this.centerX = 0,
  this.centerY = 0,
  this.velocity = 0,
  this.minTurnSpeed = 2, // 1 * 0.25
  this.maxTurnSpeed = 10, // 1.8 * 0.25
  this.forwardsAcc = 0.3,
  this.backwardsAcc = 0.2,
  this.deceleration = 0.08,
  _this = this;


  this.image.onload = function() {

    _this.centerX = _this.image.width / 2;
    _this.centerY = _this.image.height / 2;
  };

  document.addEventListener("keydown", function(e) {
    switch (e.keyCode) {
      case 38: // up
        _this.accelerate = 1;
      break;
      case 40: // down
        _this.accelerate = -1;
      break;
      case 37: // left
        _this.turnLeft();
      break;
      case 39: // right
        _this.turnRight();
      break;
    }
    return false;
  });
  document.addEventListener("keyup", function(e) {
    switch (e.keyCode) {
      case 38: // up
        _this.accelerate = 0;
      break;
      case 40: // down
        _this.accelerate = 0;
      break;
      case 37: // left
        _this.angularVel = 0;
      break;
      case 39: // right
        _this.angularVel = 0;
      break;
    }
    return false;
  });
};

Car.prototype.turnRight = function() {
  this.angularVel = (
    this.maxTurnSpeed - 
    (this.velocity > -this.minTurnSpeed || this.velocity < 2) ?
    this.minTurnSpeed : this.velocity
  ) * (Math.PI / 180);
};

Car.prototype.turnLeft = function() {
  console.log(this.velocity);
  this.angularVel = (
    -this.maxTurnSpeed + 
    (this.velocity > -this.minTurnSpeed || this.velocity < 2) ?
    -this.minTurnSpeed : this.velocity
  ) * (Math.PI / 180);
};

Car.prototype.drive = function(ctx) {
  if(this.accelerate === 0 && this.velocity > 0)
      this.velocity -= this.deceleration;
  if(this.accelerate === 0 && this.velocity < 0)
      this.velocity += this.deceleration;
  if(this.accelerate === 1 && this.velocity < 10)
      this.velocity += this.forwardsAcc;
  if(this.accelerate === -1 && this.velocity > -6)
      this.velocity -= this.backwardsAcc;

  ctx.save();
  this.angle += this.angularVel;

  this.x = this.x + this.velocity * Math.cos(this.angle);
  this.y = this.y + this.velocity * Math.sin(this.angle);
  console.log(this.centerX);
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle);
  ctx.drawImage(this.image, -this.centerX, -this.centerY);
  ctx.restore();
};

return Car;

});