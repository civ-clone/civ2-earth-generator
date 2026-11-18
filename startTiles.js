"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTilesOn = exports.startTileFor = void 0;
const EarthMaps_1 = require("./EarthMaps");
/**
 * Where `CivilizationType` starts on the Earth map `width` by `height`: the map's own start for it, or `null` when the
 *  map has none for it, or there's no Earth map that size. A civilization that extends one of Civilization II's tribes
 *  starts where that tribe does.
 */
const startTileFor = (CivilizationType, width, height) => {
    var _a;
    const map = (0, EarthMaps_1.findEarthMap)(width, height);
    if (map === null) {
        return null;
    }
    const [, coordinates] = (_a = map.startTiles.find(([TribeType]) => CivilizationType === TribeType ||
        CivilizationType.prototype instanceof TribeType)) !== null && _a !== void 0 ? _a : [];
    return coordinates !== null && coordinates !== void 0 ? coordinates : null;
};
exports.startTileFor = startTileFor;
/** Every start on the Earth map `width` by `height`, whoever's: none for a size with no map. */
const startTilesOn = (width, height) => {
    var _a, _b;
    return ((_b = (_a = (0, EarthMaps_1.findEarthMap)(width, height)) === null || _a === void 0 ? void 0 : _a.startTiles) !== null && _b !== void 0 ? _b : []).map(([, coordinates]) => coordinates);
};
exports.startTilesOn = startTilesOn;
exports.default = exports.startTileFor;
//# sourceMappingURL=startTiles.js.map