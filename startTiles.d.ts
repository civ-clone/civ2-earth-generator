import { Coordinates } from './EarthMap';
import Civilization from '@civ-clone/core-civilization/Civilization';
/**
 * Where `CivilizationType` starts on the Earth map `width` by `height`: the map's own start for it, or `null` when the
 *  map has none for it, or there's no Earth map that size. A civilization that extends one of Civilization II's tribes
 *  starts where that tribe does.
 */
export declare const startTileFor: (
  CivilizationType: typeof Civilization,
  width: number,
  height: number
) => Coordinates | null;
/** Every start on the Earth map `width` by `height`, whoever's: none for a size with no map. */
export declare const startTilesOn: (
  width: number,
  height: number
) => Coordinates[];
export default startTileFor;
