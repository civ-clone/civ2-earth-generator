// Reads a Civilization II map file (`.MP`), as the original reads one to play on (`map_read(file, 1)`, `map.cpp`, in
//  OpenCiv2, richardpenman/civ2):
//
//  - a 14-byte header, little-endian 16-bit numbers: the width in doubled x (two per square across), the height, the
//    number of squares, whether the world is flat (doesn't wrap east to west), the seed that places specials and huts,
//    and two numbers the game works out for itself;
//  - 21 start positions, one per tribe in the order of `RULES.TXT` `@LEADERS`: the 21 x (doubled), then the 21 y, -1
//    where a tribe has none;
//  - 6 bytes per square, row by row. The game keeps only the first when it loads a map, and resets the rest: its low 4
//    bits are the terrain (0 Desert … 10 Ocean), 0x80 a river and 0x40 no special resource.
//
// A square at doubled x `X` and row `y` is `X / 2` (rounded down) across on the staggered isometric grid, whose odd
//  rows are shifted half a square right as Civilization II's are: `X` and `y` are both even or both odd.

import { fromDoubled } from '../EarthMap';

export const HEADER_SIZE = 14;
export const TRIBES = 21;
export const STARTS_SIZE = TRIBES * 2 * 2;
export const SQUARE_SIZE = 6;

export const RIVER = 0x80;
export const NO_SPECIAL = 0x40;
export const TERRAIN = 0x0f;
export const OCEAN = 10;

export type MapStart = { x: number; y: number } | null;

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
export const readMap = (data: Uint8Array): MapFile => {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength),
    word = (offset: number): number => view.getInt16(offset, true);

  if (data.byteLength < HEADER_SIZE + STARTS_SIZE) {
    throw new TypeError(
      `readMap: ${data.byteLength} bytes is too short for a map file.`
    );
  }

  const doubledWidth = word(0),
    height = word(2),
    area = word(4);

  if (
    doubledWidth < 2 ||
    doubledWidth % 2 !== 0 ||
    height < 1 ||
    area !== (doubledWidth / 2) * height
  ) {
    throw new TypeError(
      `readMap: a header of ${doubledWidth} (doubled) by ${height} with ${area} squares isn't a map's.`
    );
  }

  const offset = HEADER_SIZE + STARTS_SIZE,
    width = doubledWidth / 2;

  if (data.byteLength !== offset + area * SQUARE_SIZE) {
    throw new TypeError(
      `readMap: ${
        data.byteLength
      } bytes, where a ${width} by ${height} map has ${
        offset + area * SQUARE_SIZE
      }.`
    );
  }

  const first = Array.from({ length: area }, (_, index) =>
      view.getUint8(offset + index * SQUARE_SIZE)
    ),
    terrain = first.map((byte) => byte & TERRAIN);

  const invalid = terrain.findIndex((value) => value > OCEAN);

  if (invalid !== -1) {
    throw new TypeError(
      `readMap: square ${invalid} has terrain ${terrain[invalid]}, past Ocean (${OCEAN}).`
    );
  }

  return {
    width,
    height,
    flat: view.getUint16(6, true) !== 0,
    seed: view.getUint16(8, true),
    terrain,
    rivers: first.map((byte) => (byte & RIVER) !== 0),
    noSpecial: first.map((byte) => (byte & NO_SPECIAL) !== 0),
    starts: Array.from({ length: TRIBES }, (_, tribe): MapStart => {
      const x = word(HEADER_SIZE + tribe * 2),
        y = word(HEADER_SIZE + TRIBES * 2 + tribe * 2);

      if (x < 0 || y < 0) {
        return null;
      }

      if ((x + y) % 2 !== 0 || x >= doubledWidth || y >= height) {
        throw new TypeError(
          `readMap: tribe ${tribe} starts at (${x}, ${y}), which isn't a square on a ${doubledWidth} (doubled) by ${height} map.`
        );
      }

      return fromDoubled({ x, y });
    }),
  };
};

export default readMap;
