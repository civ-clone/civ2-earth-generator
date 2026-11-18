"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTilesOn = exports.startTileOn = void 0;
/**
 * Where `CivilizationType` starts on `map` (`Earth#map()`, the map a game is played on): the map's own start for it,
 *  or `null` when it has none. A civilization that extends one of Civilization II's tribes starts where that tribe does.
 */
const startTileOn = (map, CivilizationType) => {
    var _a;
    const [, coordinates] = (_a = map.startTiles.find(([TribeType]) => CivilizationType === TribeType ||
        CivilizationType.prototype instanceof TribeType)) !== null && _a !== void 0 ? _a : [];
    return coordinates !== null && coordinates !== void 0 ? coordinates : null;
};
exports.startTileOn = startTileOn;
/** Every start on `map`, whoever's. */
const startTilesOn = (map) => map.startTiles.map(([, coordinates]) => coordinates);
exports.startTilesOn = startTilesOn;
exports.default = exports.startTileOn;
//# sourceMappingURL=startTiles.js.map