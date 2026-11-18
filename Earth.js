"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Earth = exports.terrainTypes = void 0;
const Desert_1 = require("@civ-clone/base-terrain-desert/Desert");
const EarthMap_1 = require("./EarthMap");
const Forest_1 = require("@civ-clone/base-terrain-forest/Forest");
const Generator_1 = require("@civ-clone/core-world-generator/Generator");
const Glacier_1 = require("@civ-clone/base-terrain-glacier/Glacier");
const Grassland_1 = require("@civ-clone/base-terrain-grassland/Grassland");
const Hills_1 = require("@civ-clone/base-terrain-hills/Hills");
const Jungle_1 = require("@civ-clone/base-terrain-jungle/Jungle");
const Mountains_1 = require("@civ-clone/base-terrain-mountains/Mountains");
const Ocean_1 = require("@civ-clone/base-terrain-ocean/Ocean");
const Plains_1 = require("@civ-clone/base-terrain-plains/Plains");
const Swamp_1 = require("@civ-clone/base-terrain-swamp/Swamp");
const Tundra_1 = require("@civ-clone/base-terrain-tundra/Tundra");
const EarthMaps_1 = require("./EarthMaps");
/** Each terrain letter's terrain, in `terrainLetters`' order. */
exports.terrainTypes = [
    Desert_1.Desert,
    Plains_1.Plains,
    Grassland_1.Grassland,
    Forest_1.Forest,
    Hills_1.Hills,
    Mountains_1.Mountains,
    Tundra_1.Tundra,
    Glacier_1.Glacier,
    Swamp_1.Swamp,
    Jungle_1.Jungle,
    Ocean_1.Ocean,
];
/**
 * Civilization II's Earth, on the staggered isometric grid, in each size `earthMaps` has. A size without a map of its
 *  own gets the Normal map, 50 × 80, so `width()` and `height()` report the size actually generated. The rivers, the map's
 *  seed and where each civilization starts are the map's (`map()`), for the rules to place.
 */
class Earth extends Generator_1.default {
    constructor(height = 80, width = 50, options = {}) {
        const map = (0, EarthMaps_1.getEarthMap)(width, height);
        super(map.height, map.width, {
            ...options,
            topologyId: 'staggered-iso',
        });
        this._map = map;
    }
    async generate() {
        return (0, EarthMap_1.squares)(this._map).map(({ letter }) => new exports.terrainTypes[EarthMap_1.terrainLetters.indexOf(letter)]());
    }
    map() {
        return this._map;
    }
}
exports.Earth = Earth;
exports.default = Earth;
//# sourceMappingURL=Earth.js.map