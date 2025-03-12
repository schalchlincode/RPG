import * as Phaser from "phaser";

class InsideScene extends Phaser.Scene {
  constructor() {
    super({
      key: "InsideSceneKey",
    });
  }

  preload() {
    this.load.spritesheet("player", "src/assets/images/wizard_run.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image("rick", "src/assets/images/rick.png");
  }

  create() {
    this.add.image(400, 300, "rick").setOrigin(0.5, 0.5).setDepth(-1);
    this.#createEntities();
    this.#createInventoryUI();
    this.#createInputs();
  }

  update() {
    this.entities.player.setVelocity(0);
    this.#readInputs();
  }

  // Commented out map-related code
  // #createMap() {
  //   const map = this.make.tilemap({ key: "map" });
  //   const tileSet = map.addTilesetImage("Tiles", "tiles");
  //   const buildingTileSet = map.addTilesetImage("building_tilemap", "buildingTiles");
  //   this.layers.background = map.createLayer("Tile Layer 1", tileSet, 0, 0);
  //   this.layers.building = map.createLayer("Buildings", buildingTileSet, 0, 0);
  // }

  #createEntities() {
    this.entities = {};
    this.entities.player = this.physics.add.sprite(100, 100, "player", 0);
    this.entities.player.setCollideWorldBounds(true);
    this.entities.player.setDepth(1);
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  #createInventoryUI() {
    this.ui = {};
    this.ui.inventory = {
      background: this.add
        .rectangle(100, 100, 300, 200, 0x000000, 0.7)
        .setOrigin(0, 0)
        .setVisible(false),
      text: this.add
        .text(110, 110, "Inventory:", { fontSize: "20px", fill: "#fff" })
        .setVisible(false),
    };
  }

  #createInputs() {
    this.inputs = {
      cursors: this.input.keyboard.createCursorKeys(),
      toggleInventory: this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.I
      ),
    };
  }

  #readInputs() {
    if (Phaser.Input.Keyboard.JustDown(this.inputs.toggleInventory)) {
      this.ui.inventory.background.setVisible(
        !this.ui.inventory.background.visible
      );
      this.ui.inventory.text.setVisible(!this.ui.inventory.text.visible);
    }

    let velocityX = 0;
    let velocityY = 0;

    if (this.inputs.cursors.left.isDown) {
      velocityX = -200;
    }
    if (this.inputs.cursors.right.isDown) {
      velocityX = 200;
    }
    if (this.inputs.cursors.up.isDown) {
      velocityY = -200;
    }
    if (this.inputs.cursors.down.isDown) {
      velocityY = 200;
    }

    if (velocityX !== 0 || velocityY !== 0) {
      this.entities.player.setVelocity(velocityX, velocityY);
      this.entities.player.anims.play("walk", true);
    } else {
      this.entities.player.anims.stop();
    }
  }
}

export default InsideScene;
