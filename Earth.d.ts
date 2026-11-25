import EarthMap from './EarthMap';
import Generator from '@civ-clone/core-world-generator/Generator';
import Terrain from '@civ-clone/core-terrain/Terrain';
/** Each terrain letter's terrain, in `terrainLetters`' order. */
export declare const terrainTypes: (typeof Terrain)[];
/**
 * What `Earth#id()` says, and so what a world made from it records (`World#generatorId()`): how a rule tells a game on
 *  the Earth, before or after a load.
 */
export declare const earthGeneratorId = 'earth';
/**
 * Civilization II's Earth, on the staggered isometric grid, in each size `earthMaps` has, with its polar rows Glacier
 *  (`playedSquares`). A size without a map of its own gets the Normal map, 50 × 80, so `width()` and `height()` report
 *  the size actually generated. The rivers, the map's seed and where each civilization starts are the map's (`map()`),
 *  for the rules to place.
 */
export declare class Earth extends Generator {
  private _map;
  constructor(
    height?: number,
    width?: number,
    options?: {
      [key: string]: any;
    }
  );
  id(): string;
  generate(): Promise<Terrain[]>;
  map(): EarthMap;
}
export default Earth;
