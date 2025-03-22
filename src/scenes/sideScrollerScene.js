import * as Phaser from "phaser";

class SideScrollerScene extends Phaser.Scene {
  constructor() {
    super({ key: "SideScrollerScene" });
  }

  preload() {
    this.load.spritesheet("player", "src/assets/images/wizard_run.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    // Ground
    const ground = this.physics.add.staticGroup();
    ground.create(400, 580, null).setDisplaySize(800, 40).refreshBody();

    // Player
    this.player = this.physics.add.sprite(100, 450, "player", 0);
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.1);

    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    this.physics.add.collider(this.player, ground);

    this.cursors = this.input.keyboard.createCursorKeys();

    // Camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, 2000, 600);
  }

  update() {
    this.player.setVelocityX(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.anims.play("walk", true);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
      this.player.anims.play("walk", true);
      this.player.setFlipX(false);
    } else {
      this.player.anims.stop();
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-400);
    }
  }
}

export default SideScrollerScene;
