"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEarthMap = exports.findEarthMap = exports.earthMaps = void 0;
const Earth40x50_1 = require("./Maps/Earth40x50");
const Earth50x80_1 = require("./Maps/Earth50x80");
const Earth75x120_1 = require("./Maps/Earth75x120");
/** Civilization II's Earth in each of its sizes, Small, Normal and Large, smallest first. */
exports.earthMaps = [Earth40x50_1.default, Earth50x80_1.default, Earth75x120_1.default];
/** The Earth map `width` squares across and `height` down, or `null` when there isn't one that size. */
const findEarthMap = (width, height) => { var _a; return (_a = exports.earthMaps.find((map) => map.width === width && map.height === height)) !== null && _a !== void 0 ? _a : null; };
exports.findEarthMap = findEarthMap;
/** The Earth map for the size asked for, or the Normal map, 50 × 80, when there isn't one. */
const getEarthMap = (width, height) => { var _a; return (_a = (0, exports.findEarthMap)(width, height)) !== null && _a !== void 0 ? _a : Earth50x80_1.default; };
exports.getEarthMap = getEarthMap;
exports.default = exports.earthMaps;
//# sourceMappingURL=EarthMaps.js.map