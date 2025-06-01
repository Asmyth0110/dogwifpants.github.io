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
let laserCharge = 100, laserCooldown = false;
let platforms, enemies;

function preload() {
  this.load.spritesheet('player', 'assets/teddy_run.png', {
    frameWidth: 64,
    frameHeight: 64
  });
  this.load.image('bg1', 'assets/city_far.png');
  this.load.image('bg2', 'assets/city_mid.png');
  this.load.image('bg3', 'assets/city_near.png');
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

  player = this.physics.add.sprite(100, 320, 'player');
  player.setScale(0.28);
  player.setCollideWorldBounds(true);
  this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
    frameRate: 10,
    repeat: -1
  });
  player.anims.play('run', true);

  platforms = this.physics.add.staticGroup();
  this.time.addEvent({
    delay: 1000,
    callback: () => {
      if (Phaser.Math.Between(0, 1)) return;
      const plat = platforms.create(1000, 520, 'ground');
      plat.setScale(0.4).refreshBody();
      plat.body.setVelocityX(-200);
    },
    loop: true
  });
  this.physics.add.collider(player, platforms);

  bullets = this.physics.add.group({
    defaultKey: 'bullet',
    maxSize: 10
  });

  cursors = this.input.keyboard.createCursorKeys();

  jumpButton = this.add.image(120, 470, 'jumpButton').setInteractive().setScale(0.24);
  jumpButton.setScrollFactor(0).setDepth(1);
  jumpButton.on('pointerdown', () => {
    if (player.body.touching.down) player.setVelocityY(-500);
  });

  fireButton = this.add.image(480, 470, 'blasterButton').setInteractive().setScale(0.24);
  fireButton.setScrollFactor(0).setDepth(1);
  fireButton.on('pointerdown', () => fireBullet(this));

  swapButton = this.add.image(840, 470, 'swapButton').setInteractive().setScale(0.24);
  swapButton.setScrollFactor(0).setDepth(1);
  swapButton.on('pointerdown', () => {
    console.log("Swap activated");
  });

  enemies = this.physics.add.group();
  this.time.addEvent({
    delay: 2000,
    callback: () => {
      const enemy = enemies.create(1000, 500, 'enemy');
      enemy.setVelocityX(-150);
    },
    loop: true
  });

  this.physics.add.overlap(bullets, enemies, (bullet, enemy) => {
    bullet.destroy();
    enemy.destroy();
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
  if (laserCooldown || laserCharge <= 0) return;
  const bullet = bullets.get(player.x + 20, player.y);
  if (bullet) {
    bullet.setActive(true);
    bullet.setVisible(true);
    bullet.body.enable = true;
    bullet.setVelocityX(800);
    laserCharge -= 20;
    if (laserCharge <= 0) {
      laserCooldown = true;
      scene.time.delayedCall(2000, () => {
        laserCharge = 100;
        laserCooldown = false;
      });
    }
  }
}
