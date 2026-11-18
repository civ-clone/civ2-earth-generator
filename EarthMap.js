"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playedSquares = exports.squares = exports.fromDoubled = exports.toDoubled = exports.terrainLetters = void 0;
/** The terrain letters, by the original's terrain number: 0 is Desert, 10 is Ocean. */
exports.terrainLetters = 'DPGFHMTISJO';
/**
 * Where our square (`x`, `y`) is in Civilization II's own coordinates, whose x is doubled: two per square across, odd
 *  on an odd row. The original's formulas for specials, huts and Grassland shields (`tile_resource`, `tile_has_hut`,
 *  `tile_grassland_has_shield`) take these.
 */
const toDoubled = ({ x, y }) => ({
    x: x * 2 + (y & 1),
    y,
});
exports.toDoubled = toDoubled;
/** Our square at Civilization II's doubled (`x`, `y`), which are both even or both odd: a `RangeError` otherwise. */
const fromDoubled = ({ x, y }) => {
    if (((x + y) & 1) !== 0) {
        throw new RangeError(`fromDoubled: (${x}, ${y}) is between two squares: a doubled x and its row are both even or both odd.`);
    }
    return { x: x >> 1, y };
};
exports.fromDoubled = fromDoubled;
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