var main = function(game) {};

var game = new Phaser.Game(700, 700, Phaser.AUTO, 'Deep Space Diver');
// var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'Deep Space Diver');

game.state.add("MainMenu", mainMenu);
game.state.add("PlayGame", playGame);
game.state.add("Ending", ending);
game.state.add("levelSelect", levelSelect);

game.state.start("MainMenu");