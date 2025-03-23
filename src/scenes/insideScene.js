import * as Phaser from "phaser";
import { CONSTANTS } from "./constants";

class InsideScene extends Phaser.Scene {
  // Game variables that are likely to change values over time
  state = {
    inventory: [], // Right now this array just holds string values
    inventoryVisible: true,
  };

  // Layers imported into phaser from Tiled - populated during phaser Create phase
  layers = {
    ground: undefined,
  };

  // UI Elements - populated during phaser Create phase
  ui = {
    inventory: {
      background: undefined,
      text: undefined,
    },
  };

  // Registered Inputs - populated during phaser Create phase, read during phaser Update phase
  inputs = {
    cursors: undefined,
    toggleInventory: undefined,
  };

  // Interactive Elements - populated during phaser Create phase (see below)
  entities = {
    player: undefined,
  };

  constructor() {
    super({ key: "InsideSceneKey" });
  }

  // This method receives the state when switching scenes
  init(data) {
    if (data && data.state) {
      this.state = data.state;
    }
  }

  /**
   * Phaser scene configuration methods
   */
  preload() {
    // Player Sprite
    this.load.spritesheet(
      CONSTANTS.KEYS.SPRITES.PLAYER,
      "src/assets/images/wizard_run.png",
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );

    // Tiled map JSON file
    this.load.tilemapTiledJSON("insideMap", "src/assets/tiles/inside_map.json");

    // The tileset image defined in the Tilemap JSON file
    this.load.image("tiles", "src/assets/tiles/Tiles.png");
  }

  create() {
    this.#createMap();
    this.#createEntities();
    this.#createInventoryUI();
    this.#createInputs();
  }

  update() {
    this.entities.player.setVelocity(0); // Stop movement when no keys are pressed
    this.#readInputs();
  }

  /**
   * 'Private' methods that are only used inside this class, denoted by the leading hashtag
   * The leading hashtag is actual vanilla js syntax for private methods, not just convention.
   */
  #createMap() {
    // Creates the tilemap from the tiled JSON file loaded in preload
    const map = this.make.tilemap({ key: "insideMap" });
    const tileset = map.addTilesetImage("Tiles", "tiles");

    // Load the background layer
    this.layers.ground = map.createLayer("Tile Layer 1", tileset, 0, 0);
    this.layers.ground.setDepth(CONSTANTS.DEPTHS.Background);

    // Enable collision from Tiled properties
    this.layers.ground.setCollisionByProperty({ collides: true });
  }

  #createEntities() {
    // Load at coordinates (100, 100) and force frame 0 of the sprite
    this.entities.player = this.physics.add.sprite(
      100,
      100,
      CONSTANTS.KEYS.SPRITES.PLAYER,
      0
    );
    this.entities.player.setCollideWorldBounds(true); // Prevents leaving the screen
    this.entities.player.setDepth(CONSTANTS.DEPTHS.Foreground);
    this.entities.player.setSize(32, 48); // Adjust width and height as needed
    this.entities.player.setOffset(16, 22); // Adjust offset to center the hitbox

    // Player <-> Tilemap collision
    this.physics.add.collider(this.entities.player, this.layers.ground);

    // Animation only created once
    if (!this.anims.exists(CONSTANTS.KEYS.ANIMATIONS.WALK)) {
      this.anims.create({
        key: CONSTANTS.KEYS.ANIMATIONS.WALK,
        frames: this.anims.generateFrameNumbers(CONSTANTS.KEYS.SPRITES.PLAYER, {
          start: 0,
          end: 5,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }

  #createInventoryUI() {
    // Background panel
    //ADD: dynamic inventory background
    this.ui.inventory.background = this.add.rectangle(
      100,
      100,
      300,
      200,
      0x000000,
      0.7
    ); // Semi-transparent black box
    this.ui.inventory.background.setOrigin(0, 0);
    this.ui.inventory.background.setDepth(CONSTANTS.DEPTHS.UIBackground);
    this.ui.inventory.background.setVisible(false); // Hide by default

    // Inventory text
    this.ui.inventory.text = this.add.text(
      110,
      110,
      "Inventory: " + (this.state.inventory.join(", ") || "Empty"),
      {
        fontSize: "20px",
        fill: "#fff",
      }
    );
    this.ui.inventory.text.setDepth(CONSTANTS.DEPTHS.UIForeground);
    this.ui.inventory.text.setVisible(false);
  }

  #createInputs() {
    this.inputs.cursors = this.input.keyboard.createCursorKeys();
    this.inputs.toggleInventory = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.I
    );
  }

  #readInputs() {
    // Toggle inventory visibility when "I" is pressed
    if (Phaser.Input.Keyboard.JustDown(this.inputs.toggleInventory)) {
      this.state.inventoryVisible = !this.state.inventoryVisible;
      this.ui.inventory.background.setVisible(this.state.inventoryVisible);
      this.ui.inventory.text.setVisible(this.state.inventoryVisible);
    }

    // Diagonal Movement
    if (this.inputs.cursors.left.isDown && this.inputs.cursors.up.isDown) {
      this.entities.player.setVelocity(-200, -200);
      this.entities.player.anims.play(CONSTANTS.KEYS.ANIMATIONS.WALK, true);
    } else if (
      this.inputs.cursors.right.isDown &&
      this.inputs.cursors.up.isDown
    ) {
      this.entities.player.setVelocity(200, -200);
      this.entities.player.anims.play(CONSTANTS.KEYS.ANIMATIONS.WALK, true);
    } else if (
      this.inputs.cursors.left.isDown &&
      this.inputs.cursors.down.isDown
    ) {
      this.entities.player.setVelocity(-200, 200);
      this.entities.player.anims.play(CONSTANTS.KEYS.ANIMATIONS.WALK, true);
    } else if (
      this.inputs.cursors.right.isDown &&
      this.inputs.cursors.down.isDown
    ) {
      this.entities.player.setVelocity(200, 200);
      this.entities.player.anims.play(CONSTANTS.KEYS.ANIMATIONS.WALK, true);
    }

    // Regular movement
    else if (this.inputs.cursors.left.isDown) {
      this.entities.player.setVelocityX(-200);
      this.entities.player.anims.play(CONSTANTS.KEYS.ANIMATIONS.WALK, true);
    } else if (this.inputs.cursors.right.isDown) {
      this.entities.player.setVelocityX(200);
      this.entities.player.anims.play(CONSTANTS.KEYS.ANIMATIONS.WALK, true);
    } else if (this.inputs.cursors.up.isDown) {
      this.entities.player.setVelocityY(-200);
      this.entities.player.anims.play(CONSTANTS.KEYS.ANIMATIONS.WALK, true);
    } else if (this.inputs.cursors.down.isDown) {
      this.entities.player.setVelocityY(200);
      this.entities.player.anims.play(CONSTANTS.KEYS.ANIMATIONS.WALK, true);
    } else {
      this.entities.player.anims.stop();
    }
  }
}

export default InsideScene;
