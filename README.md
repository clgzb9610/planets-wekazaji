# Deep Space Diver

Deep Space Diver is a platformer game where you jump between planets through overlapping gravity fields. Collect gears to fix the broken teleporter and move on to the next level! Avoid colliding with enemies: you will lose all of the gears you have collected and need to restart the level. Find a way out and spend a nice vacation on an alien planet!

## Play our Game

You can play our game by clicking this link: https://clgzb9610.github.io/planets-wekazaji/

## Getting involved

Do you want to be a part of this project? Well, here's how you can start!

### Prerequisites

Deep Space Diver is written in Javascript. You can use any Javascript editor that you like. But you have to spin up a local server to test play the game.

We used [Webstorm](https://www.jetbrains.com/webstorm/download) for our project, since it has a built-in server. If you are student, you can download the full version of WebStorm for free with your student account.

### Clone with Webstorm

Click 'Check out from Version Control' in Webstorm start menu. Log in to your github account. Copy our github repository URL and paste it to 'Git Repository URL'.

### Known bugs

One big bug, especially for level 7, is when the sprite collides with the enemy and the teleporter at the same time it crashes since it doesn't know whether to go to the next level or keep to the same one. Also, we occasionally have timing problems, with one message not fully fading before the next one pops up. Finally, we have problem with edge contacts be it with player, enemies or the teleporter.

### Future ideas

In terms of how to expand our current game, one big thing we would like to add is more levels on the game. In addition to that, having a more concrete story whether it be through action in between levels or at the end is something that can be worked on. A free play mode as well, where the player sprite can simply explore the galaxies and move around has been discussed as well. Given user feedback on confusing gravity fields, one idea we have is potentially changing the colors of the gravity fields. Finally, there's always scope for potential new features such square planets, faster sprite movement and trampolines amongst many others.

## Built With

* [Phaser](https://phaser.io/) - HTML5 game framework with [Box2D plugin](https://phaser.io/shop/plugins/box2d).

## Authors

* **Wes Summers** - designer
* **Kayla Beckham** - physics expert
* **Zain Chaudhry** - enemy expert
* **Jin Kim** - level changer

## Acknowledgments

* Our deepest thanks and proud acknowledgements go to professor Paul Cantrell from Macalester College for all your help!

* Some of our physics was based on this tutorial: [Simulate planet gravity with Phaser + Box2D as seen on Angry Birds Space](http://www.emanueleferonato.com/2015/06/19/simulate-planet-gravity-with-phaser-box2d-as-seen-on-angry-birds-space/) by [Emanuele Feronato](http://www.emanueleferonato.com/).
* Background music is from [Songs from an Unmade Forest World](http://freemusicarchive.org/music/Visager/Songs_from_an_Unmade_Forest_World/) by [Visager](http://freemusicarchive.org/music/Visager/).
* Teleporter sound is obtained from [ZAPSPLAT](https://www.zapsplat.com/music/magical-portal-open-1/).
* Gear pickup sound is obtained from [soundbible](http://soundbible.com/1628-Ting.html).
* Starting pad sound is obtained from [ZAPSPLAT](https://www.zapsplat.com/music/telekinesis-blast-magical-zap-2/).
