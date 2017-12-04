var main = function(game) {};

var game = new Phaser.Game(800, 800, Phaser.AUTO, "");

game.state.add("MainMenu", mainMenu);
game.state.add("PlayGame",playGame);

game.state.start("MainMenu");