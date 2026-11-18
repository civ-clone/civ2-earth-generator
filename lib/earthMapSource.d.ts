import { MapFile } from './mp';
/** The terrain, a line per row, as `EarthMap.terrain` holds it: lower case where a river runs. */
export declare const terrainText: ({
  width,
  terrain,
  rivers,
}: MapFile) => string;
/**
 * The TypeScript of `Maps/Earth<width>x<height>.ts`, from `map`, read from the original's `file`. A flat world, or a
 *  square marked to have no special, isn't something an `EarthMap` can say, so either is refused rather than lost.
 */
export declare const earthMapSource: (map: MapFile, file: string) => string;
export default earthMapSource;
