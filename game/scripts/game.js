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
let bg1, bg2, bg3;

function preload() {
  this.load.image('bg1', 'assets/parallax_layer1.png');
  this.load.image('bg2', 'assets/parallax_layer2.png');
  this.load.image('bg3', 'assets/parallax_layer3.png');
  this.load.image('player', 'assets/teddy.png');
  this.load.image('ground', 'assets/ground.png');
  this.load.image('bullet', 'assets/bullet.png');
}

function create() {
  // Parallax background layers
  bg1 = this.add.tileSprite(0, 0, 960, 540, 'bg1').setOrigin(0);
  bg2 = this.add.tileSprite(0, 0, 960, 540, 'bg2').setOrigin(0);
  bg3 = this.add.tileSprite(0, 0, 960, 540, 'bg3').setOrigin(0);

  // Player setup
  player = this.physics.add.sprite(100, 400, 'player');
  player.setCollideWorldBounds(true);

  // Ground platform (scaled to stretch)
  const ground = this.physics.add.staticImage(480, 520, 'ground');
  ground.setScale(4, 1).refreshBody(); // Stretch platform look
  this.physics.add.collider(player, ground);

  // Bullet group
  bullets = this.physics.add.group({
    defaultKey: 'bullet',
    maxSize: 10
  });

  // Input controls
  cursors = this.input.keyboard.createCursorKeys();
}

function update(time, delta) {
  // Parallax scroll
  bg1.tilePositionX += 0.2;
  bg2.tilePositionX += 0.5;
  bg3.tilePositionX += 1;

  // Jumping
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-500);
  }

  // Bullet shooting (spacebar)
  if (cursors.space.isDown && time > lastFired) {
    const bullet = bullets.get(player.x + 20, player.y);
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.body.enable = true;
      bullet.setVelocityX(600);
      lastFired = time + 250;
    }
  }

  // Clean bullets off-screen
  bullets.children.each(function(bullet) {
    if (bullet.active && bullet.x > 1000) {
      bullets.killAndHide(bullet);
      bullet.body.enable = false;
    }
  }, this);
}
