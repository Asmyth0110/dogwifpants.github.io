// Phaser 3 Game Config for Pants Multiverse Runner: Dripfire Edition
const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  },
  pixelArt: true
};

const game = new Phaser.Game(config);

let player, cursors, bullets, lastFired = 0;
let bg1, bg2, bg3, jumpButton, fireButton, swapButton;

function preload() {
  this.load.image('bg1', 'assets/parallax_layer1.png');
  this.load.image('bg2', 'assets/parallax_layer2.png');
  this.load.image('bg3', 'assets/parallax_layer3.png');
  this.load.image('player', 'assets/teddy (1).png');
  this.load.image('ground', 'assets/ground.png');
  this.load.image('bullet', 'assets/bullet (1).png');
  this.load.image('enemy', 'assets/enemy.png');
  this.load.image('jumpButton', 'assets/jump_button.png');
  this.load.image('blasterButton', 'assets/blaster_button.png');
  this.load.image('swapButton', 'assets/swap_button.png');
}

function create() {
  bg1 = this.add.tileSprite(0, 0, 960, 540, 'bg1').setOrigin(0);
  bg2 = this.add.tileSprite(0, 0, 960, 540, 'bg2').setOrigin(0);
  bg3 = this.add.tileSprite(0, 0, 960, 540, 'bg3').setOrigin(0);

  player = this.physics.add.sprite(100, 400, 'player');
  player.setCollideWorldBounds(true);

  const ground = this.physics.add.staticImage(480, 500, 'ground');
  ground.setScale(4, 0.5).refreshBody();
  this.physics.add.collider(player, ground);

  bullets = this.physics.add.group({
    defaultKey: 'bullet',
    maxSize: 10
  });

  cursors = this.input.keyboard.createCursorKeys();

  // On-screen mobile controls
  jumpButton = this.add.image(100, 450, 'jumpButton').setInteractive();
  jumpButton.setScrollFactor(0).setDepth(1);
  jumpButton.setScale(0.4); 
  jumpButton.on('pointerdown', () => {
    if (player.body.touching.down) player.setVelocityY(-500);
  });

  fireButton = this.add.image(480, 450, 'blasterButton').setInteractive();
fireButton.setScrollFactor(0).setDepth(1);
fireButton.setScale(0.4); // Resize to better fit screen
fireButton.on('pointerdown', () => fireBullet(this));


  swapButton = this.add.image(860, 450, 'swapButton').setInteractive();
  swapButton.setScrollFactor(0).setDepth(1);
  swapButton.setScale(0.4); 
  swapButton.on('pointerdown', () => {
    console.log("Swap activated");
  });
}

function update(time, delta) {
  bg1.tilePositionX += 0.2;
  bg2.tilePositionX += 0.5;
  bg3.tilePositionX += 1;

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-500);
  }

  if (cursors.space.isDown && time > lastFired) {
    fireBullet(this);
    lastFired = time + 250;
  }

  bullets.children.each(function(bullet) {
    if (bullet.active && bullet.x > 1000) {
      bullets.killAndHide(bullet);
      bullet.body.enable = false;
    }
  }, this);
}

function fireBullet(scene) {
  const bullet = bullets.get(player.x + 20, player.y);
  if (bullet) {
    bullet.setActive(true);
    bullet.setVisible(true);
    bullet.body.enable = true;
    bullet.setVelocityX(600);
  }
}
