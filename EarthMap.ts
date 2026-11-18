import Civilization from '@civ-clone/core-civilization/Civilization';

export type Coordinates = { x: number; y: number };

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
export const terrainLetters = 'DPGFHMTISJO';

export const sizeKey = (width: number, height: number): string =>
  `${width}x${height}`;

/** The map's squares, row by row: each one's terrain letter, in upper case, and whether a river runs through it. */
export const squares = (map: EarthMap): { letter: string; river: boolean }[] =>
  Array.from(map.terrain.replace(/\n/g, ''), (letter) => ({
    letter: letter.toUpperCase(),
    river: letter !== letter.toUpperCase(),
  }));

export default EarthMap;
