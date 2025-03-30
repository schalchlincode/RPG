import * as Phaser from "phaser";
import { CONSTANTS } from "./constants";

export default class BaseScene extends Phaser.Scene {
  state = {
    inventory: [], // Right now this array just holds string values
    inventoryVisible: false,
  };

  // UI Elements - populated during phaser Create phase
  ui = {
    inventory: {
      background: undefined, // Phaser.GameObjects.Rectangle: https://docs.phaser.io/api-documentation/class/gameobjects-rectangle
      text: undefined, // Phaser.GameObjects.Text: https://docs.phaser.io/api-documentation/class/gameobjects-text
    },
  };

  // Registered Inputs - populated during phaser Create phase, read during phaser Update phase
  // https://docs.phaser.io/api-documentation/class/input-keyboard-key
  inputs = {
    cursors: undefined,
    toggleInventory: undefined,
  };

  // Interactive Elements - populated during phaser Create phase (see below)
  entities = {
    player: undefined, // Phaser.Types.Physics.Arcade.SpriteWithDynamicBody: https://docs.phaser.io/api-documentation/class/physics-arcade-sprite
    items: undefined, // Phaser.Physics.Arcade.Group: https://docs.phaser.io/api-documentation/class/physics-arcade-group
  };

  interactions = {
    collectItem: (player, item) => {
      item.destroy(); // Remove item from world

      let itemName = "Unknown Item";

      if (item.texture.key === CONSTANTS.KEYS.IMAGES.STUFFED_PEANUT) {
        itemName = "Stuffed Peanut";
      } else if (item.texture.key === CONSTANTS.KEYS.IMAGES.PHOTO_FRAME) {
        itemName = "Picture Frame";
      }

      this.state.inventory.push(itemName); // Add to inventory

      this.ui.inventory.text.setText(
        "Inventory: " + this.state.inventory.join(", ")
      );
    },
  };

  constructor(config) {
    super(config)
  }

  init(data) {
    if (data && data.state) {
      this.state = data.state;
    }
  }

  preload() {
    // Player
    this.load.spritesheet(
      CONSTANTS.KEYS.SPRITES.PLAYER,
      "src/assets/images/wizard_run.png",
      { frameWidth: 64, frameHeight: 64 } // Adjust this based on your sprite size
    );

    // Tilesets
    this.load.image(
      CONSTANTS.KEYS.IMAGES.TILES, 
      "src/assets/tiles/Tiles.png"
    );
    this.load.image(
      CONSTANTS.KEYS.IMAGES.BUILDING_TILES,
      "src/assets/tiles/building_tilemap.png"
    );
    this.load.image(
      CONSTANTS.KEYS.IMAGES.INTERIORS,
      "src/assets/tiles/interiors.png"
    );
    this.load.image(
      CONSTANTS.KEYS.IMAGES.ROOMBUILDER,
      "src/assets/tiles/room_builder.png"
    );
  }

  create(playerX, playerY) {
    this.entities.player = this.physics.add.sprite(
      playerX,
      playerY,
      CONSTANTS.KEYS.SPRITES.PLAYER,
      0
    );
    this.entities.player.setCollideWorldBounds(true); // Prevents leaving the screen
    this.entities.player.setDepth(CONSTANTS.DEPTHS.Foreground);
    this.entities.player.setSize(32, 48); // Adjust width and height as needed
    this.entities.player.setOffset(16, 22); // Adjust offset to center the hitbox

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
    
    this.#createInventoryUI()
    this.#createInputs()
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
    this.ui.inventory.text = this.add.text(110, 110, "Inventory:", {
      fontSize: "20px",
      fill: "#fff",
    });
    this.ui.inventory.text.setDepth(CONSTANTS.DEPTHS.UIForeground);
    this.ui.inventory.text.setVisible(false);
  }

  #createInputs() {
    this.inputs.cursors = this.input.keyboard.createCursorKeys();
    this.inputs.toggleInventory = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.I
    );
  }

  update() {
    this.entities.player.setVelocity(0); // Stop movement when no keys are pressed
    this.#readInputs();
  }

  #readInputs() {
    // Toggle inventory visibility when "I" is pressed
    if (Phaser.Input.Keyboard.JustDown(this.inputs.toggleInventory)) {
        this.state.inventoryVisible = !this.state.inventoryVisible;
        this.ui.inventory.background.setVisible(this.state.inventoryVisible);
        this.ui.inventory.text.setVisible(this.state.inventoryVisible);
    }

    // Movement handling
    const cursors = this.inputs.cursors;
    const velocityX = (cursors.right.isDown ? 200 : 0) - (cursors.left.isDown ? 200 : 0);
    const velocityY = (cursors.down.isDown ? 200 : 0) - (cursors.up.isDown ? 200 : 0);
    
    this.entities.player.setVelocity(velocityX, velocityY);
    
    // Animation handling
    if (velocityX !== 0 || velocityY !== 0) {
        this.entities.player.anims.play(CONSTANTS.KEYS.ANIMATIONS.WALK, true);
    } else {
        this.entities.player.anims.stop();
    }
  }
}