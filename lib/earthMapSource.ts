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

/** The TypeScript of `Maps/Earth<width>x<height>.ts`, from `map`, read from the original's `file`. */
export const earthMapSource = (map: MapFile, file: string): string => {
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
//  \`npm run generate\` (tools/generate.ts). The terrain, rivers, seed and start positions are the map's own; the
//  specials, huts and grassland shields come from the seed, as civ2-world places them.
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
