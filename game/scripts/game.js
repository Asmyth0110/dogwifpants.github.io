const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  parent: null,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
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

let player, cursors;

function preload() {
  this.load.image('bg1', 'assets/parallax_layer1.png');
  this.load.image('bg2', 'assets/parallax_layer2.png');
  this.load.image('bg3', 'assets/parallax_layer3.png');
  this.load.image('player', 'assets/teddy.png');
}

function create() {
  // Background layers
  this.bg1 = this.add.tileSprite(0, 0, 960, 540, 'bg1').setOrigin(0);
  this.bg2 = this.add.tileSprite(0, 0, 960, 540, 'bg2').setOrigin(0);
  this.bg3 = this.add.tileSprite(0, 0, 960, 540, 'bg3').setOrigin(0);

  // Ground using one of the background layers temporarily
  const ground = this.physics.add.staticGroup();
  ground.create(480, 520, 'bg1').setScale(2).refreshBody();

  // Teddy character
  player = this.physics.add.sprite(100, 400, 'player');
  player.setCollideWorldBounds(true);

  // Collide player with ground
  this.physics.add.collider(player, ground);

  // Controls
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-500);
  }

  // Scroll background
  this.bg1.tilePositionX += 0.5;
  this.bg2.tilePositionX += 1;
  this.bg3.tilePositionX += 2;
}
