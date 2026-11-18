// The maps shipped are the original's own: run with CIV2_PATH set to your copy of Civilization II to check them.

import { earthMapSource } from '../lib/earthMapSource';
import { expect } from 'chai';
import { join } from 'path';
import readMap from '../lib/mp';
import { readFileSync } from 'fs';

const folder = process.env.CIV2_PATH;

(folder ? describe : describe.skip)(
  "the Earth maps, against the original's",
  (): void => {
    ['WORLD_S.MP', 'WORLD_M.MP', 'WORLD.MP'].forEach((file): void => {
      it(`are ${file}`, (): void => {
        const map = readMap(readFileSync(join(folder!, file))),
          shipped = readFileSync(
            join(__dirname, '..', 'Maps', `Earth${map.width}x${map.height}.ts`),
            'utf8'
          );

        expect(shipped).equal(earthMapSource(map, file));
      });
    });
  }
);
