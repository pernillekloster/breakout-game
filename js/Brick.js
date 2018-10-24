class Brick {
  constructor(ctx, x, y, width, height, color) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    // this.resistance = 1;
    this.color = color;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }
  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  /* 
  brick2() {
    ctx.save();
    ctx.fillStyle = "blue";
    this.ctx.strokeRect(this.x, this.y, this.width, this.height);
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  } */
  /*  resistance(){
    var resistance = 1; 
    (
  } */

  draw() {
    ctx.save();
    ctx.fillStyle = this.color;
    this.ctx.strokeRect(this.x, this.y, this.width, this.height);
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}
