import { CONSTANTS } from "./constants";
import BaseScene from "./BaseScene";

export default class InsideScene extends BaseScene {
  static KEY = "InsideScene"

  constructor() {
    super({ key: InsideScene.KEY });
  }

  preload() {
    super.preload()
    
    // Tiled map JSON file
    this.load.tilemapTiledJSON("insideMap", "src/assets/tiles/inside_map.json");
  }

  create() {
    this.#createMap();
    super.create(100, 100);
  }

  update() {
    super.update()
  }

  #createMap() {
    // Creates the tilemap from the tiled JSON file loaded in preload
    const map = this.make.tilemap({ key: "insideMap" });
    const tileset = map.addTilesetImage("Tiles", "tiles");

    // Load the background layer
    this.groundLayer = map.createLayer("Tile Layer 1", tileset, 0, 0);
    this.groundLayer.setDepth(CONSTANTS.DEPTHS.Background);
  }
}