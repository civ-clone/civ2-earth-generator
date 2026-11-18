import EarthMap from './EarthMap';
/** Civilization II's Earth in each of its sizes, Small, Normal and Large, smallest first. */
export declare const earthMaps: EarthMap[];
/** The Earth map `width` squares across and `height` down, or `null` when there isn't one that size. */
export declare const findEarthMap: (
  width: number,
  height: number
) => EarthMap | null;
/** The Earth map for the size asked for, or the Normal map, 50 × 80, when there isn't one. */
export declare const getEarthMap: (width: number, height: number) => EarthMap;
export default earthMaps;
