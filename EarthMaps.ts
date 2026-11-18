import EarthMap from './EarthMap';
import earth40x50 from './Maps/Earth40x50';
import earth50x80 from './Maps/Earth50x80';
import earth75x120 from './Maps/Earth75x120';

/** Civilization II's Earth in each of its sizes, Small, Normal and Large, smallest first. */
export const earthMaps: EarthMap[] = [earth40x50, earth50x80, earth75x120];

/** The Earth map `width` squares across and `height` down, or `null` when there isn't one that size. */
export const findEarthMap = (width: number, height: number): EarthMap | null =>
  earthMaps.find((map) => map.width === width && map.height === height) ?? null;

/** The Earth map for the size asked for, or the Normal map, 50 × 80, when there isn't one. */
export const getEarthMap = (width: number, height: number): EarthMap =>
  findEarthMap(width, height) ?? earth50x80;

export default earthMaps;
