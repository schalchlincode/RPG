import { CONSTANTS } from "./constants";
import BaseScene from "./BaseScene";
import InsideScene from "./insideScene";

export default class MainScene extends BaseScene {
  static KEY = "MainScene";

  constructor() {
    super({ key: MainScene.KEY });
  }

  preload() {
    super.preload();

    // Tiled map JSON file
    this.load.tilemapTiledJSON(
      CONSTANTS.KEYS.TILED.MAP,
      "src/assets/tiles/map.json"
    );

    // Cat
    this.load.spritesheet(
      CONSTANTS.KEYS.SPRITES.NPC,
      "src/assets/images/cat_spritesheet.png",
      { frameWidth: 64, frameHeight: 64 }
    );

    // Items
    this.load.image(
      CONSTANTS.KEYS.IMAGES.STUFFED_PEANUT,
      "src/assets/images/stuffedPeanut.png"
    );
    this.load.image(
      CONSTANTS.KEYS.IMAGES.PHOTO_FRAME,
      "src/assets/images/photo_frame.png"
    );
  }

  create() {
    this.#createMap();
    this.#createEntities();
    super.create(500, 300);
    this.#createPhysics();

    this.time.delayedCall(100, () => {
      const blinkOverlay = this.add
        .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000)
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(100)
        .setAlpha(1);

      this.tweens.add({
        targets: blinkOverlay,
        alpha: 0,
        duration: 1000,
        ease: "Quad.easeOut",
        onComplete: () => blinkOverlay.destroy(),
      });
    });
  }

  update() {
    super.update();
  }

  #createMap() {
    // Creates the tilemap from the tiled JSON file loaded in preload
    const map = this.make.tilemap({ key: CONSTANTS.KEYS.TILED.MAP });

    const tileSet = map.addTilesetImage(
      CONSTANTS.KEYS.TILED.TILE_SETS.TILES,
      CONSTANTS.KEYS.IMAGES.TILES
    );

    const interiors = map.addTilesetImage(
      CONSTANTS.KEYS.TILED.TILE_SETS.INTERIORS,
      CONSTANTS.KEYS.IMAGES.INTERIORS
    );

    const room_builder = map.addTilesetImage(
      CONSTANTS.KEYS.TILED.TILE_SETS.ROOMBUILDER,
      CONSTANTS.KEYS.IMAGES.ROOMBUILDER
    );

    // Load the background layer
    this.backgroundLayer = map
      .createLayer(
        CONSTANTS.KEYS.TILED.LAYERS.FLOOR,
        [tileSet, room_builder],
        0,
        0
      )
      .setDepth(CONSTANTS.DEPTHS.Background);

    // Load the Buildings layer
    this.buildingLayer = map
      .createLayer(
        CONSTANTS.KEYS.TILED.LAYERS.FLOOR_DETAILS,
        [room_builder, interiors],
        0,
        0
      )
      .setDepth(CONSTANTS.DEPTHS.Foreground);
  }

  #createEntities() {
    this.entities.cat = this.physics.add.sprite(
      300,
      325,
      CONSTANTS.KEYS.SPRITES.NPC,
      0
    );
    this.entities.cat.setDepth(CONSTANTS.DEPTHS.Foreground);

    this.anims.create({
      key: "catSleep",
      frames: this.anims.generateFrameNumbers(CONSTANTS.KEYS.SPRITES.NPC, {
        start: 8,
        end: 11,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.entities.cat.anims.play("catSleep", true);

    this.entities.items = this.physics.add.group(); // Create a group for items

    const peanut = this.entities.items.create(
      150,
      150,
      CONSTANTS.KEYS.IMAGES.STUFFED_PEANUT
    );
    peanut.setScale(0.1);
    peanut.setDepth(CONSTANTS.DEPTHS.Foreground); // Ensure it’s above the background

    const photoFrame = this.entities.items.create(
      200,
      200,
      CONSTANTS.KEYS.IMAGES.PHOTO_FRAME
    );
    photoFrame.setScale(0.1);
    photoFrame.setDepth(CONSTANTS.DEPTHS.Foreground);

    // ADD THE DOOR ENTITY (Trigger Zone)
    this.entities.door = this.physics.add.staticSprite(400, 400, null);
    this.entities.door.setSize(50, 50).setVisible(false); // Invisible trigger area
  }

  #createPhysics() {
    // this.physics.add.collider(this.entities.player, this.layers.building);
    // this.layers.building.setCollisionByProperty({ collides: true });

    // Items Overlap Behavior
    this.physics.add.overlap(
      this.entities.player,
      this.entities.items,
      this.interactions.collectItem
    );

    // ADD DOOR COLLISION DETECTION
    this.physics.add.overlap(this.entities.player, this.entities.door, () => {
      this.scene.start(InsideScene.KEY, { state: this.state });
      // Switch to the inside scene
    });
  }
}
