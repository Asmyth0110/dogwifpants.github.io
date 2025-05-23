const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  parent: null,
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

function preload() {
  this.load.image('bg1', 'assets/parallax_layer1.png');
  this.load.image('bg2', 'assets/parallax_layer2.png');
  this.load.image('bg3', 'assets/parallax_layer3.png');
  this.load.image('player', 'assets/teddy.png');
  this.load.image('bullet', 'assets/bullet.png');
}



function create() {
  this.bg1 = this.add.tileSprite(0, 0, 960, 540, 'bg1').setOrigin(0);
  this.bg2 = this.add.tileSprite(0, 0, 960, 540, 'bg2').setOrigin(0);
  this.bg3 = this.add.tileSprite(0, 0, 960, 540, 'bg3').setOrigin(0);

  player = this.physics.add.sprite(100, 400, 'player');
  player.setCollideWorldBounds(true);

  bullets = this.physics.add.group({ defaultKey: 'bullet', maxSize: 10 });

  cursors = this.input.keyboard.createCursorKeys();
}



function update(time) {
  this.bg1.tilePositionX += 0.3;
  this.bg2.tilePositionX += 1;
  this.bg3.tilePositionX += 2;

  player.setVelocityX(160);

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-400);
  }

  if (this.input.keyboard.checkDown(this.input.keyboard.addKey('Z'), 250)) {
    fireBullet(this, time);
  }
}


function fireBullet(scene, time) {
  if (time > lastFired) {
    const bullet = bullets.get(player.x + 20, player.y);
    if (bullet) {
      bullet.setActive(true).setVisible(true);
      bullet.body.velocity.x = 400;
      lastFired = time + 300;
    }
  }
}




