"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playedSquares = exports.squares = exports.sizeKey = exports.terrainLetters = void 0;
/** The terrain letters, by the original's terrain number: 0 is Desert, 10 is Ocean. */
exports.terrainLetters = 'DPGFHMTISJO';
const sizeKey = (width, height) => `${width}x${height}`;
exports.sizeKey = sizeKey;
/** The map's squares as the original's file has them, row by row: each one's terrain letter, in upper case, and whether a
 *  river runs through it. */
const squares = (map) => Array.from(map.terrain.replace(/\n/g, ''), (letter) => ({
    letter: letter.toUpperCase(),
    river: letter !== letter.toUpperCase(),
}));
exports.squares = squares;
/**
 * The map's squares as a game is played on them: as the file has them, but with the first and last rows Glacier, with
 *  no river, as the original makes them for every game on a round world (`mapgen_place_polar_caps`, which `map_generate`
 *  runs on a map loaded from a file too).
 */
const playedSquares = (map) => (0, exports.squares)(map).map((square, index) => index < map.width || index >= map.width * (map.height - 1)
    ? { letter: 'I', river: false }
    : square);
exports.playedSquares = playedSquares;
//# sourceMappingURL=EarthMap.js.map