import { Desert } from '@civ-clone/base-terrain-desert/Desert';
import EarthMap, { playedSquares, terrainLetters } from './EarthMap';
import { Forest } from '@civ-clone/base-terrain-forest/Forest';
import Generator from '@civ-clone/core-world-generator/Generator';
import { Glacier } from '@civ-clone/base-terrain-glacier/Glacier';
import { Grassland } from '@civ-clone/base-terrain-grassland/Grassland';
import { Hills } from '@civ-clone/base-terrain-hills/Hills';
import { Jungle } from '@civ-clone/base-terrain-jungle/Jungle';
import { Mountains } from '@civ-clone/base-terrain-mountains/Mountains';
import { Ocean } from '@civ-clone/base-terrain-ocean/Ocean';
import { Plains } from '@civ-clone/base-terrain-plains/Plains';
import { Swamp } from '@civ-clone/base-terrain-swamp/Swamp';
import Terrain from '@civ-clone/core-terrain/Terrain';
import { Tundra } from '@civ-clone/base-terrain-tundra/Tundra';
import { getEarthMap } from './EarthMaps';

/** Each terrain letter's terrain, in `terrainLetters`' order. */
export const terrainTypes: (typeof Terrain)[] = [
  Desert,
  Plains,
  Grassland,
  Forest,
  Hills,
  Mountains,
  Tundra,
  Glacier,
  Swamp,
  Jungle,
  Ocean,
];

/**
 * Civilization II's Earth, on the staggered isometric grid, in each size `earthMaps` has, with its polar rows Glacier
 *  (`playedSquares`). A size without a map of its own gets the Normal map, 50 × 80, so `width()` and `height()` report
 *  the size actually generated. The rivers, the map's seed and where each civilization starts are the map's (`map()`),
 *  for the rules to place.
 */
export class Earth extends Generator {
  private _map: EarthMap;

  constructor(
    height: number = 80,
    width: number = 50,
    options: { [key: string]: any } = {}
  ) {
    const map = getEarthMap(width, height);

    // Always the staggered isometric grid: a grid given (`topology`) or named (`topologyId`) is left out.
    const { topology, ...rest } = options;

    super(map.height, map.width, {
      ...rest,
      topologyId: 'staggered-iso',
    });

    this._map = map;
  }

  async generate(): Promise<Terrain[]> {
    return playedSquares(this._map).map(
      ({ letter }) => new terrainTypes[terrainLetters.indexOf(letter)]!()
    );
  }

  map(): EarthMap {
    return this._map;
  }
}

export default Earth;
