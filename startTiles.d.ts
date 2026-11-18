import EarthMap, { Coordinates } from './EarthMap';
import Civilization from '@civ-clone/core-civilization/Civilization';
/**
 * Where `CivilizationType` starts on `map` (`Earth#map()`, the map a game is played on): the map's own start for it,
 *  or `null` when it has none. A civilization that extends one of Civilization II's tribes starts where that tribe does.
 */
export declare const startTileOn: (
  map: EarthMap,
  CivilizationType: typeof Civilization
) => Coordinates | null;
/** Every start on `map`, whoever's. */
export declare const startTilesOn: (map: EarthMap) => Coordinates[];
export default startTileOn;
