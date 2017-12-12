var main = function(game) {};

var game = new Phaser.Game(800, 800, Phaser.AUTO, "");

game.state.add("MainMenu", mainMenu);
game.state.add("PlayGame", playGame);
// console.log("------------> in main.js, ending = ", ending);
game.state.add("Ending", ending);

game.state.start("MainMenu");