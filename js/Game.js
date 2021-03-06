// var myGif = GIF();
// myGif.load("..images/gameover.gif");
// number of levels
let x = 1;
let lives = 3;

class Game {
  constructor(ctx, grid) {
    this.BRICK_WIDTH = ctx.canvas.width / grid[0].length;
    this.BRICK_HEIGHT = 50;
    this.BALL_RADIUS = this.BRICK_HEIGHT / 2;

    this.ctx = ctx;
    this.bricks = [];
    // this.lives = 3;
    // Creation of bricks based on the grid
    for (var row = 0; row < grid.length; row++) {
      for (var col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === "Y") {
          this.bricks.push(
            new Brick(
              this.ctx,
              col * this.BRICK_WIDTH,
              row * this.BRICK_HEIGHT,
              this.BRICK_WIDTH,
              this.BRICK_HEIGHT,
              (this.color = "#F7B595"),
              (this.letter = "Y")
            )
          );
        }
        if (grid[row][col] === "X") {
          this.bricks.push(
            new Brick(
              this.ctx,
              col * this.BRICK_WIDTH,
              row * this.BRICK_HEIGHT,
              this.BRICK_WIDTH,
              this.BRICK_HEIGHT,
              (this.color = "black"),
              (this.letter = "X")
            )
          );
        }
        if (grid[row][col] === "B") {
          this.bricks.push(
            new Brick(
              this.ctx,
              col * this.BRICK_WIDTH,
              row * this.BRICK_HEIGHT,
              this.BRICK_WIDTH,
              this.BRICK_HEIGHT,
              (this.color = "#F67280"),
              (this.letter = "B")
            )
          );
        }
      }
    }

    this.paddle = new Paddle(
      this.ctx,
      this.ctx.canvas.width / 5,
      this.BRICK_HEIGHT
    );
    this.balls = [
      new Ball(
        this.ctx,
        this.paddle.center().x,
        this.paddle.y - this.BALL_RADIUS,
        this.BALL_RADIUS
      )
    ];
    console.log(this.balls);
    console.log(this.bricks);

    this.level = 1;
  }
  start() {
    var that = this;

    this.intervalId = setInterval(function() {
      that.update();
      that.draw();
    }, 1000 / 60);

    // this.update()
    // this.draw()
    // window.requestAnimationFrame(function(){
    //   that.start()
    // })
  }
  stop() {
    clearInterval(this.intervalId);
  }
  /*   gameStateManager(function(){
    switch(gameState){
      case "loading":
      break;
  
      case "play":
      break;
  
      case "win":
      pause();
      message("Winner");
      break;
  
      case "lose":
      pause();
      message("Game Over");
      break;
    }
  }) */
  launchBalls() {
    for (var i = 0; i < this.balls.length; i++) {
      this.balls[i].launch();
    }
  }
  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    for (var i = 0; i < this.bricks.length; i++) {
      this.bricks[i].draw();
    }
    this.paddle.draw();
    for (var i = 0; i < this.balls.length; i++) {
      this.balls[i].draw();
    }
    // Draw of lives
    this.ctx.save();
    this.ctx.font = "20px sans-serif";
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "left";
    this.ctx.fillText("Lives: " + lives, this.ctx.canvas.width - 90, 80);
    this.ctx.restore();

    //Draw of level
    this.ctx.save();
    this.ctx.font = "20px sans-serif";
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "right";
    this.ctx.fillText("Level: " + x, this.ctx.canvas.width - 20, 35);
    // this.ctx.restore();
    // for (var row = 0; row < this.levels.grid.length; row++) {
    //   this.level++;
    // }

    // Make sure the image is loaded first otherwise nothing will draw.
  }
  update() {
    this.paddle.update();
    for (var iBall = 0; iBall < this.balls.length; iBall++) {
      this.balls[iBall].update(this.paddle);
      this.checkBallPaddleCollisionAndUpdate(this.balls[iBall], this.paddle);
      for (var iBrick = this.bricks.length - 1; iBrick >= 0; iBrick--) {
        if (
          this.checkBallBrickCollisionAndUpdate(
            this.balls[iBall],
            this.bricks[iBrick]
          )
        ) {
          console.log("DELETE", iBrick);

          this.bricks.splice(iBrick, 1);
          if (this.bricks.length === 0) {
            console.log("Level complete");

            this.stop();
            setTimeout(function() {
              game = new Game(ctx, levels[x].grid);
              game.start();
              x++;
            }, 1000 / 60);
          }
        }
      }
    }

    this.removeUselessBalls();
    if (this.balls.length === 0) {
      this.balls.push(
        new Ball(
          this.ctx,
          this.paddle.center().x,
          this.paddle.y - this.BALL_RADIUS,
          this.BALL_RADIUS
        )
      );

      lives--;
      console.log("Lost one life");
    }
    if (lives < 1) {
      console.log("GAME OVER ");
      var img = new Image();
      img.onload = function() {
        ctx.drawImage(img, 0, 0, 1200, 800);
      };
      img.src = "../images/gameover8.png";
      this.stop();
    }
  }

  checkBallPaddleCollisionAndUpdate(ball, paddle) {
    if (
      paddle.left() < ball.x &&
      ball.x < paddle.right() &&
      paddle.top() < ball.bottom() &&
      ball.y < paddle.top()
    ) {
      var factor = (2 * (ball.x - paddle.center().x)) / paddle.width; // Number between -1 and 1
      var maxAngle = (0.9 * Math.PI) / 2;
      var paddleAngle = -Math.PI / 2 + factor * maxAngle;
      ball.angle = (-ball.angle + paddleAngle) / 2;
      ball.y = paddle.top() - ball.radius;
    }
  }

  // Return true if there is a collision
  checkBallBrickCollisionAndUpdate(ball, brick) {
    // Check with the bottom and top part of the  brick
    if (
      (Math.abs(brick.bottom() - ball.y) < ball.radius ||
        Math.abs(brick.top() - ball.y) < ball.radius) &&
      brick.left() < ball.x &&
      ball.x < brick.right()
    ) {
      ball.bounceHorizontally();

      if (brick.letter === "X") {
        this.balls.push(
          new Ball(
            this.ctx,
            this.paddle.center().x,
            this.paddle.y - this.BALL_RADIUS,
            this.BALL_RADIUS
          )
        );
      }
      return true;
    }
    if (
      (Math.abs(brick.left() - ball.x) < ball.radius ||
        Math.abs(brick.right() - ball.x) < ball.radius) &&
      brick.top() < ball.y &&
      ball.y < brick.bottom()
    ) {
      ball.bounceVertically();
      if (brick.letter === "X") {
        this.balls.push(
          new Ball(
            this.ctx,
            this.paddle.center().x,
            this.paddle.y - this.BALL_RADIUS,
            this.BALL_RADIUS
          )
        );
      }
      return true;
    }

    return false;
  }

  // newBallFromBrick() {
  //   for (var row = 0; row < grid.length; row++) {
  //     for (var col = 0; col < grid[row].length; col++)
  //       if (grid[row][col] === "B") {
  //         console.log("RED BRICK");
  //         this.balls.push(
  //           new Ball(
  //             this.ctx,
  //             this.paddle.center().x,
  //             this.paddle.y - this.BALL_RADIUS,
  //             this.BALL_RADIUS
  //           )
  //         );
  //       }
  //   }
  // }

  removeUselessBalls() {
    for (var iBall = this.balls.length - 1; iBall >= 0; iBall--) {
      if (this.balls[iBall].top() > this.ctx.canvas.height) {
        this.balls.splice(iBall, 1);
      }
    }
  }
}
