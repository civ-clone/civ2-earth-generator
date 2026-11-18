import Civilization from '@civ-clone/core-civilization/Civilization';
export type Coordinates = {
  x: number;
  y: number;
};
/**
 * One size of Civilization II's Earth, on the staggered isometric grid. `terrain` is one letter per square, a line per
 *  row (`terrainLetters`, in the original's order): `D`esert, `P`lains, `G`rassland, `F`orest, `H`ills, `M`ountains,
 *  `T`undra, `I` for Glacier, `S`wamp, `J`ungle and `O`cean, in lower case where a river runs through the square.
 */
export interface EarthMap {
  width: number;
  height: number;
  /** The seed the original places specials and huts with on this map. */
  seed: number;
  /** Each civilization's start, where the map has one. */
  startTiles: [typeof Civilization, Coordinates][];
  terrain: string;
}
/** The terrain letters, by the original's terrain number: 0 is Desert, 10 is Ocean. */
export declare const terrainLetters = 'DPGFHMTISJO';
export declare const sizeKey: (width: number, height: number) => string;
export type Square = {
  letter: string;
  river: boolean;
};
/** The map's squares as the original's file has them, row by row: each one's terrain letter, in upper case, and whether a
 *  river runs through it. */
export declare const squares: (map: EarthMap) => Square[];
/**
 * The map's squares as a game is played on them: as the file has them, but with the first and last rows Glacier, with
 *  no river, as the original makes them for every game on a round world (`mapgen_place_polar_caps`, which `map_generate`
 *  runs on a map loaded from a file too).
 */
export declare const playedSquares: (map: EarthMap) => Square[];
export default EarthMap;
