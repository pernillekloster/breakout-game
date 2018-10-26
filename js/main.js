// Initialisation on global variables
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var game;

// Go to main page
// goToPage('home')
goToPage("play");

// Listen for click events on <a> and redirect to the right page
$("a").click(function(event) {
  event.preventDefault();
  var href = $(this).attr("href");
  goToPage(href);
});

$("#play").click(function() {
  if (game) {
    game.stop();
  }
  if (lives === 0) {
    // game.start();
    window.location.href = "../index.html";

    return (lives = 3);
  }

  game = new Game(ctx, levels[0].grid);
  game.start();
});

$(document).keydown(function(event) {
  console.log("keydown", event.keyCode);
  switch (event.keyCode) {
    case 37:
      game.paddle.movement = "left";
      break;
    case 39:
      game.paddle.movement = "right";
      break;
    case 32: // space
      setInterval(function() {
        event.preventDefault();
        game.launchBalls();
      }, 100);
      break;
  }
});

$(document).keyup(function(event) {
  event.preventDefault();
  switch (event.keyCode) {
    case 37:
    case 39:
      game.paddle.movement = null;
      break;
  }
});
