import { MapFile } from './mp';
import { terrainLetters } from '../EarthMap';
import tribes from '../tribes';

/** The terrain, a line per row, as `EarthMap.terrain` holds it: lower case where a river runs. */
export const terrainText = ({ width, terrain, rivers }: MapFile): string =>
  terrain
    .map((value, index) => {
      const letter = terrainLetters[value]!;

      return (
        (rivers[index] ? letter.toLowerCase() : letter) +
        ((index + 1) % width === 0 ? '\n' : '')
      );
    })
    .join('');

/**
 * The TypeScript of `Maps/Earth<width>x<height>.ts`, from `map`, read from the original's `file`. A flat world, or a
 *  square marked to have no special, isn't something an `EarthMap` can say, so either is refused rather than lost.
 */
export const earthMapSource = (map: MapFile, file: string): string => {
  if (map.flat) {
    throw new TypeError(
      `earthMapSource: ${file} is a flat world, which an EarthMap can't be.`
    );
  }

  if (map.noSpecial.some((marked) => marked)) {
    throw new TypeError(
      `earthMapSource: ${file} marks squares to have no special, which an EarthMap can't say.`
    );
  }

  const name = `earth${map.width}x${map.height}`,
    starts = map.starts
      .map((start, tribe) =>
        start === null
          ? null
          : `    [tribes[${tribe}] /* ${tribes[tribe]!.name} */, { x: ${
              start.x
            }, y: ${start.y} }],`
      )
      .filter((line) => line !== null);

  return `import EarthMap from '../EarthMap';
import tribes from '../tribes';

// Civilization II's own Earth, ${map.width} squares across and ${
    map.height
  } down: generated from the original's \`${file}\` by
//  \`npm run generate\` (tools/generate.ts). The terrain, rivers, seed and start positions are the map's own. A game makes
//  the first and last rows Glacier (\`playedSquares\`), and places the specials, huts and Grassland shields from the seed,
//  hiding the specials of ocean squares far from land, as civ2-world does.
export const ${name}: EarthMap = {
  width: ${map.width},
  height: ${map.height},
  seed: ${map.seed},
  startTiles: [
${starts.join('\n')}
  ],
  terrain: \`
${terrainText(map)}\`.slice(1),
};

export default ${name};
`;
};

export default earthMapSource;
