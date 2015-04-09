define("car", function() {
"use strict";

function Car(x, y) {
  this.image = new Image();
  this.image.src = "assets/car.png";
  this.angularVel = 0;
  this.angle = 0;
  this.x = x;
  this.y = y;
  this.centerX = 0;
  this.centerY = 0;
  this.velocity = 0;
  this.minTurnSpeed = 2; // 1 * 0.25
  this.maxTurnSpeed = 10; // 1.8 * 0.25
  this.forwardsAcc = 0.3;
  this.backwardsAcc = 0.2;
  this.deceleration = 0.08;
  this.detectColission = true;
  this.time;

  this._bindListeners();
  var _this = this;

  this.image.onload = function() {
    _this.centerX = _this.image.width / 2;
    _this.centerY = _this.image.height / 2;
  };
}

Car.prototype._bindListeners = function() {
  var _this = this;
  document.addEventListener("keydown", function(e) {
    switch (e.keyCode) {
      case 38: // up
        if(_this.detectColission) _this.accelerate = 1;
      break;
      case 40: // down
        if(_this.detectColission) _this.accelerate = -1;
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

Car.prototype._removeListeners = function() {
  document.removeEventListener("keydown");
  document.removeEventListener("keyup");
};

Car.prototype._detectColission = function(ctx) {
  if(!this.detectColission) return;
  var _this = this;
  var imageData = ctx.getImageData(
    this.x - this.centerX, this.y - this.centerY,
    this.image.width, this.image.height
  );

  // I read the 4 corner pixels for 255 (1.0) alpha value.
  // the car collides on pixels with 255 alpha
  if(
    // top left
    imageData.data[3] == 255 ||
    // top right
    imageData.data[(imageData.width * 4) -1] == 255 ||
    // bottom left
    imageData.data[imageData.data.length - 
        (imageData.width * 4) + 3] == 255 ||
    // bottom right
    imageData.data[imageData.data.length - 1] == 255
  ) {
    this.detectColission = false;
    this.velocity = -this.velocity * 0.7;
    setTimeout(function() { 
      _this.detectColission = true;
    }, 50);
  }

  // the finish has an alpha of 252 (.99)
  if(
    // top left
    imageData.data[3] == 252 ||
    // top right
    imageData.data[(imageData.width * 4) -1] == 252 ||
    // bottom left
    imageData.data[imageData.data.length - 
        (imageData.width * 4) + 3] == 252 ||
    // bottom right
    imageData.data[imageData.data.length - 1] == 252
  ) {
    if(this.time) console.log(new Date().getTime() - this.time );
    this.time = new Date().getTime();
  }

  /* 
   * old detection method (I get 4 points and check for collisions) 
   * the current one seems faster to me.
   */
  // var point1 = ctx.getImageData(
  //   this.x + this.centerX, 
  //   this.y + this.centerY,
  //   1, 1
  // );

  // var point2 = ctx.getImageData(
  //   this.x - this.centerX, 
  //   this.y - this.centerY,
  //   1, 1
  // );

  // var point3 = ctx.getImageData(
  //   this.x + this.centerX, 
  //   this.y - this.centerY,
  //   1, 1
  // );

  // var point4 = ctx.getImageData(
  //   this.x - this.centerX, 
  //   this.y + this.centerY,
  //   1, 1
  // );

  // if(
  //   point1.data[3] == 255 || point2.data[3] == 255 || 
  //   point3.data[3] == 255 || point4.data[3] == 255
  // ) {
  //   if(this.velocity < 3 && this.velocity > 0) this.velocity = 3;
  //   if(this.velocity > -3 && this.velocity < 0) this.velocity = -3;
  //   this.velocity = -this.velocity * 0.7
  //   this.accelerate = 0;
  //   setTimeout(function() { 
  //     this._bindListeners
  //   }, 1000);
  // }
};

Car.prototype.turnRight = function() {
  // turnvelocity goes down when the car goes faster
  this.angularVel = (
    this.maxTurnSpeed - 
    (this.velocity > -this.minTurnSpeed || this.velocity < 2) ?
    this.minTurnSpeed : this.velocity
  ) * (Math.PI / 180);
};

Car.prototype.turnLeft = function() {
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

  // we translate & rotate the canvas, draw the images and then 
  // restore the canvas positioning
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle);

  // detect colissions should account for the car being rotated when
  // called here.
  this._detectColission(ctx);
  ctx.drawImage(this.image, -this.centerX, -this.centerY);
  ctx.restore();
};

return Car;

});