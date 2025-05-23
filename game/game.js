const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

let player;

function preload() {
  this.load.image('bg', 'assets/background.png'); // Replace with actual background
  this.load.image('player', 'assets/teddy.png');  // Placeholder for Teddy
}

function create() {
  this.add.image(480, 270, 'bg').setScale(1.1); // background centered
  player = this.physics.add.sprite(100, 400, 'player');
  player.setCollideWorldBounds(true);
}

function update() {
  // Movement will go here
}
