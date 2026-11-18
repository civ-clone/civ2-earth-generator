"use strict";
// Reads a Civilization II map file (`.MP`), as the original reads one to play on (`map_read(file, 1)`, `map.cpp`, in
//  OpenCiv2, richardpenman/civ2):
//
//  - a 14-byte header, little-endian 16-bit numbers: the width in doubled x (two per square across), the height, the
//    number of squares, whether the world is flat (doesn't wrap east to west), the seed that places specials and huts,
//    and two numbers the game works out for itself;
//  - 21 start positions, one per tribe in the order of `RULES.TXT` `@LEADERS`: the 21 x (doubled), then the 21 y, -1
//    where a tribe has none;
//  - 6 bytes per square, row by row. The game keeps only the first when it loads a map, and clears the rest: its low 4
//    bits are the terrain (0 Desert … 10 Ocean), 0x80 a river and 0x40 no special resource.
//
// A square at doubled x `X` and row `y` is `X / 2` (rounded down) across on the staggered isometric grid, whose odd
//  rows are shifted half a square right as Civilization II's are: `X` and `y` are both even or both odd.
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMap = exports.OCEAN = exports.TERRAIN = exports.NO_SPECIAL = exports.RIVER = exports.SQUARE_SIZE = exports.STARTS_SIZE = exports.TRIBES = exports.HEADER_SIZE = void 0;
const EarthMap_1 = require("../EarthMap");
exports.HEADER_SIZE = 14;
exports.TRIBES = 21;
exports.STARTS_SIZE = exports.TRIBES * 2 * 2;
exports.SQUARE_SIZE = 6;
exports.RIVER = 0x80;
exports.NO_SPECIAL = 0x40;
exports.TERRAIN = 0x0f;
exports.OCEAN = 10;
/** Reads `data`, a `.MP` file's bytes, throwing a `TypeError` when they aren't one. */
const readMap = (data) => {
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength), word = (offset) => view.getInt16(offset, true);
    if (data.byteLength < exports.HEADER_SIZE + exports.STARTS_SIZE) {
        throw new TypeError(`readMap: ${data.byteLength} bytes is too short for a map file.`);
    }
    const doubledWidth = word(0), height = word(2), area = word(4);
    if (doubledWidth < 2 ||
        doubledWidth % 2 !== 0 ||
        height < 1 ||
        area !== (doubledWidth / 2) * height) {
        throw new TypeError(`readMap: a header of ${doubledWidth} (doubled) by ${height} with ${area} squares isn't a map's.`);
    }
    const offset = exports.HEADER_SIZE + exports.STARTS_SIZE, width = doubledWidth / 2;
    if (data.byteLength !== offset + area * exports.SQUARE_SIZE) {
        throw new TypeError(`readMap: ${data.byteLength} bytes, where a ${width} by ${height} map has ${offset + area * exports.SQUARE_SIZE}.`);
    }
    const first = Array.from({ length: area }, (_, index) => view.getUint8(offset + index * exports.SQUARE_SIZE)), terrain = first.map((byte) => byte & exports.TERRAIN);
    const invalid = terrain.findIndex((value) => value > exports.OCEAN);
    if (invalid !== -1) {
        throw new TypeError(`readMap: square ${invalid} has terrain ${terrain[invalid]}, past Ocean (${exports.OCEAN}).`);
    }
    return {
        width,
        height,
        flat: view.getUint16(6, true) !== 0,
        seed: view.getUint16(8, true),
        terrain,
        rivers: first.map((byte) => (byte & exports.RIVER) !== 0),
        noSpecial: first.map((byte) => (byte & exports.NO_SPECIAL) !== 0),
        starts: Array.from({ length: exports.TRIBES }, (_, tribe) => {
            const x = word(exports.HEADER_SIZE + tribe * 2), y = word(exports.HEADER_SIZE + exports.TRIBES * 2 + tribe * 2);
            if (x < 0 || y < 0) {
                return null;
            }
            if ((x + y) % 2 !== 0 || x >= doubledWidth || y >= height) {
                throw new TypeError(`readMap: tribe ${tribe} starts at (${x}, ${y}), which isn't a square on a ${doubledWidth} (doubled) by ${height} map.`);
            }
            return (0, EarthMap_1.fromDoubled)({ x, y });
        }),
    };
};
exports.readMap = readMap;
exports.default = exports.readMap;
//# sourceMappingURL=mp.js.map