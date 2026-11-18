"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.squares = exports.sizeKey = exports.terrainLetters = void 0;
/** The terrain letters, by the original's terrain number: 0 is Desert, 10 is Ocean. */
exports.terrainLetters = 'DPGFHMTISJO';
const sizeKey = (width, height) => `${width}x${height}`;
exports.sizeKey = sizeKey;
/** The map's squares, row by row: each one's terrain letter, in upper case, and whether a river runs through it. */
const squares = (map) => Array.from(map.terrain.replace(/\n/g, ''), (letter) => ({
    letter: letter.toUpperCase(),
    river: letter !== letter.toUpperCase(),
}));
exports.squares = squares;
//# sourceMappingURL=EarthMap.js.map