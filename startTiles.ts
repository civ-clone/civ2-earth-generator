import EarthMap, { Coordinates } from './EarthMap';
import Civilization from '@civ-clone/core-civilization/Civilization';

/**
 * Where `CivilizationType` starts on `map` (`Earth#map()`, the map a game is played on): the map's own start for it,
 *  or `null` when it has none. A civilization that extends one of Civilization II's tribes starts where that tribe does.
 */
export const startTileOn = (
  map: EarthMap,
  CivilizationType: typeof Civilization
): Coordinates | null => {
  const [, coordinates] =
    map.startTiles.find(
      ([TribeType]) =>
        CivilizationType === TribeType ||
        CivilizationType.prototype instanceof TribeType
    ) ?? [];

  // A copy: the map's own is every game's.
  return coordinates === undefined ? null : { ...coordinates };
};

/** Every start on `map`, whoever's. */
export const startTilesOn = (map: EarthMap): Coordinates[] =>
  map.startTiles.map(([, coordinates]) => ({ ...coordinates }));

export default startTileOn;
