export declare const HEADER_SIZE = 14;
export declare const TRIBES = 21;
export declare const STARTS_SIZE: number;
export declare const SQUARE_SIZE = 6;
export declare const RIVER = 128;
export declare const NO_SPECIAL = 64;
export declare const TERRAIN = 15;
export declare const OCEAN = 10;
export type MapStart = {
  x: number;
  y: number;
} | null;
export interface MapFile {
  /** Squares across. */
  width: number;
  /** Rows down. */
  height: number;
  /** Whether the world is flat: it doesn't wrap east to west. */
  flat: boolean;
  /** The seed the original places specials and huts with (`tile_resource`, `tile_has_hut`). */
  seed: number;
  /** Each square's terrain, 0 to 10, row by row. */
  terrain: number[];
  /** Whether a river runs through each square. */
  rivers: boolean[];
  /** Whether each square is marked to have no special resource. */
  noSpecial: boolean[];
  /** Each tribe's start, by `@LEADERS` row, in squares, or `null`. */
  starts: MapStart[];
}
/** Reads `data`, a `.MP` file's bytes, throwing a `TypeError` when they aren't one. */
export declare const readMap: (data: Uint8Array) => MapFile;
export default readMap;
