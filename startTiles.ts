import { Coordinates } from './EarthMap';
import Civilization from '@civ-clone/core-civilization/Civilization';
import { findEarthMap } from './EarthMaps';

/**
 * Where `CivilizationType` starts on the Earth map `width` by `height`: the map's own start for it, or `null` when the
 *  map has none for it, or there's no Earth map that size. A civilization that extends one of Civilization II's tribes
 *  starts where that tribe does.
 */
export const startTileFor = (
  CivilizationType: typeof Civilization,
  width: number,
  height: number
): Coordinates | null => {
  const map = findEarthMap(width, height);

  if (map === null) {
    return null;
  }

  const [, coordinates] =
    map.startTiles.find(
      ([TribeType]) =>
        CivilizationType === TribeType ||
        CivilizationType.prototype instanceof TribeType
    ) ?? [];

  return coordinates ?? null;
};

/** Every start on the Earth map `width` by `height`, whoever's: none for a size with no map. */
export const startTilesOn = (width: number, height: number): Coordinates[] =>
  (findEarthMap(width, height)?.startTiles ?? []).map(
    ([, coordinates]) => coordinates
  );

export default startTileFor;
