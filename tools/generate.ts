// Writes `Maps/Earth<width>x<height>.ts` from your own copy of Civilization II's Earth maps: CIV2_PATH is the folder
//  that has WORLD_S.MP, WORLD_M.MP and WORLD.MP. The files are read, never copied.
//
//   CIV2_PATH=/path/to/civ2 npm run generate

import { readFileSync, writeFileSync } from 'fs';
import earthMapSource from '../lib/earthMapSource';
import { join } from 'path';
import readMap from '../lib/mp';

export const earthFiles = ['WORLD_S.MP', 'WORLD_M.MP', 'WORLD.MP'];

const folder = process.env.CIV2_PATH;

if (folder === undefined || folder === '') {
  process.stderr.write(
    'CIV2_PATH must be the folder with your copy of Civilization II.\n'
  );
  process.exit(1);
}

// Every map read before any is written: one that can't be leaves the others as they were.
const maps = earthFiles.map((file) => ({
  file,
  map: readMap(readFileSync(join(folder, file))),
}));

maps.forEach(({ file, map }) => {
  const path = join(
    __dirname,
    '..',
    'Maps',
    `Earth${map.width}x${map.height}.ts`
  );

  writeFileSync(path, earthMapSource(map, file));
  process.stdout.write(`${file} -> ${path}\n`);
});
