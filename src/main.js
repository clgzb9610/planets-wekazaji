var main = function(game) {};

var game = new Phaser.Game(700, 700, Phaser.AUTO, 'Deep Space Diver', {create: create, render: render});

game.state.add("MainMenu", mainMenu);
game.state.add("PlayGame", playGame);
game.state.add("Ending", ending);
game.state.add("levelSelect", levelSelect);

game.state.start("MainMenu");

function create() {
    game.time.advancedTiming = true;

}
function render() {
    game.debug.text(game.time.fps, 2, 14, "#00ff00");
}