# Deep Space Diver

Deep Space Diver is a platformer game where you jump between planets through overlapping gravity fields. Collect gears to fix the broken teleporter and move on to the next level! Avoid colliding with enemies: you will lose all of the gears you have collected and need to restart the level. Find a way out and spend a nice vacation on an alien planet!

## Play our Game

You can play our game by clicking this link: https://clgzb9610.github.io/planets-wekazaji/

## Getting involved

Do you want to be a part of this project? Well, here’s how you can start!

### What we used

We used Javascript for our game. You can use any Javascript editor that you like. But you have to have a local server running to test play the game. Webstorm gave us a solution.

### Download Webstorm

We used [Webstorm](https://www.jetbrains.com/webstorm/download) for our project that it supports built-in local server. Also, if you’re student, you can download the full version with your student account.

We use [yarn](https://yarnpkg.com) for dependency management, so you'll need to install that as well.

### Clone with Webstorm

Click ‘VCS’ >> ‘Check out from Version Control’ >> Git in Webstorm start menu. Log in to your github account. Copy our github repository URL and paste it to ‘Git Repository URL’ textbox.

After you clone it, WebStorm should pop up a message in the bottom right asking if you want to install dependencies using yarn - say yes if it does. If it doesn't ask, just open the `package.json` file and it will pop up the message.

### Running the game on Webstorm

Webstorm has its own local server. Open index.html in Webstorm and on the upper-right side, click on the brower icon you want to run.

### Phaser Documentation

Please see [Phaser Example website](https://phaser.io/examples) to learn how Phaser works. Also check out [Phaser 2.6.2 Documentation](https://phaser.io/docs/2.6.2/index).

## Deployment Process

When working on the game, all changes should be pushed to the `master` branch. The link to play the game references the `gh-pages` branch. To merge changes from the `master` branch to the `gh-pages` branch, follow this process:
1. `cd` to the project directory on your computer
2. Check out the `gh-pages` branch using the command `git checkout gh-pages`
3. Make sure you have no uncommitted changes by running the command `git status`, and make sure you have the most recent version of the branch using `git pull`
4. Once everything is ready to go, run the command `git merge master` to merge all of the changes from the `master` branch into the `gh-pages` branch.
5. Now you can move back into the `master` branch with `git checkout master`
6. Run the command `yarn` to reinstall the Phaser library in your local directory (moving from `gh-pages` back to `master` will delete the Phaser directory, since it is not in the `master` branch)

## Built With

* [Phaser](https://phaser.io/) - HTML5 game framework with [Box2D plugin](https://phaser.io/shop/plugins/box2d).

## Authors
### Original Team
* **Wes Summers** - designer
* **Kayla Beckham** - physics expert
* **Zain Chaudhry** - enemy expert
* **Jin Kim** - level changer
### Release Team Members
* **Jin Kim**
* **William Kann**
* **Eric Huang**
* **Trevor Zapiecki**

## Acknowledgments

* Our deepest thanks and proud acknowledgements go to professor Paul Cantrell from Macalester College for all your help!

* Some of our physics was based on this tutorial: [Simulate planet gravity with Phaser + Box2D as seen on Angry Birds Space](http://www.emanueleferonato.com/2015/06/19/simulate-planet-gravity-with-phaser-box2d-as-seen-on-angry-birds-space/) by [Emanuele Feronato](http://www.emanueleferonato.com/).

#### Sound Credits
* Background music is from [Songs from an Unmade Forest World](http://freemusicarchive.org/music/Visager/Songs_from_an_Unmade_Forest_World/) by [Visager](http://freemusicarchive.org/music/Visager/).
* Teleporter sound is obtained from [ZAPSPLAT](https://www.zapsplat.com/music/magical-portal-open-1/).
* Gear pickup sound is obtained from [soundbible](http://soundbible.com/1628-Ting.html).
* Starting pad sound is obtained from [ZAPSPLAT](https://www.zapsplat.com/music/telekinesis-blast-magical-zap-2/).
* Jetpack audio is obtained from http://soundbible.com/2125-Wind-Blowing.html
* Teleporter sucking in noise was obtained from here: https://www.youtube.com/watch?v=gz3_nbHvjoY
