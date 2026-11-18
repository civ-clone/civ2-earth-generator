import EarthMap, {
  fromDoubled,
  playedSquares,
  squares,
  terrainLetters,
  toDoubled,
} from '../EarthMap';
import { earthMaps, findEarthMap, getEarthMap } from '../EarthMaps';
import { startTileOn, startTilesOn } from '../startTiles';
import Civilization from '@civ-clone/core-civilization/Civilization';
import Earth from '../Earth';
import { Glacier } from '@civ-clone/base-terrain-glacier/Glacier';
import SquareTopology from '@civ-clone/core-world/SquareTopology';
import { Roman } from '@civ-clone/base-civilization-roman/Roman';
import { expect } from 'chai';
import tribes from '../tribes';

const at = (map: EarthMap, x: number, y: number) =>
  squares(map)[y * map.width + x]!;

describe('Earth maps', (): void => {
  it("come in Civilization II's three sizes", (): void => {
    expect(earthMaps.map(({ width, height }) => [width, height])).eql([
      [40, 50],
      [50, 80],
      [75, 120],
    ]);
  });

  earthMaps.forEach((map): void => {
    const name = `${map.width} × ${map.height}`;

    it(`${name} has a row of ${map.width} known letters for each of its ${map.height} rows`, (): void => {
      const rows = map.terrain.split('\n');

      expect(rows.pop()).equal('');
      expect(rows.length).equal(map.height);
      rows.forEach((row) => expect(row.length).equal(map.width));
      squares(map).forEach(({ letter }) =>
        expect(terrainLetters).include(letter)
      );
    });

    it(`${name} is mostly ocean, has land, rivers and Glacier, and a seed the original could make`, (): void => {
      const all = squares(map),
        count = (test: (square: (typeof all)[0]) => boolean) =>
          all.filter(test).length;

      expect(count(({ letter }) => letter === 'O')).within(
        all.length / 2,
        all.length * 0.8
      );
      expect(count(({ river }) => river)).above(0);
      expect(count(({ letter }) => letter === 'I')).above(0);
      expect(map.seed).within(1, 0x7fff);
    });

    it(`${name}'s starts are on land, one per tribe at most, and at least 19 of them`, (): void => {
      const tribesStarting = map.startTiles.map(([TribeType]) => TribeType);

      expect(map.startTiles.length).within(19, 21);
      expect(new Set(tribesStarting).size).equal(tribesStarting.length);
      tribesStarting.forEach((TribeType) => expect(tribes).include(TribeType));
      map.startTiles.forEach(([, { x, y }]) => {
        expect(x).within(0, map.width - 1);
        // Never on a polar row, which a game makes Glacier.
        expect(y).within(1, map.height - 2);
        expect(at(map, x, y).letter).not.equal('O');
      });
    });
  });
});

describe('toDoubled and fromDoubled', (): void => {
  it("are Civilization II's doubled x, odd on an odd row, and back", (): void => {
    expect(
      [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 3, y: 2 },
        { x: 3, y: 7 },
      ].map((square) => [toDoubled(square), fromDoubled(toDoubled(square))])
    ).eql([
      [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ],
      [
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ],
      [
        { x: 6, y: 2 },
        { x: 3, y: 2 },
      ],
      [
        { x: 7, y: 7 },
        { x: 3, y: 7 },
      ],
    ]);
  });

  it('refuses a doubled x and row that are between two squares', (): void => {
    expect(() => fromDoubled({ x: 3, y: 2 })).throw(RangeError);
    expect(() => fromDoubled({ x: 2, y: 1 })).throw(RangeError);
  });
});

describe('getEarthMap', (): void => {
  it('finds each size, and gives the Normal map for any other', (): void => {
    expect(getEarthMap(75, 120)).equal(earthMaps[2]);
    expect(getEarthMap(80, 50)).equal(earthMaps[1]);
    expect(findEarthMap(80, 50)).null;
  });
});

describe('Earth', (): void => {
  it('generates the map on the staggered isometric grid, one terrain per square', async (): Promise<void> => {
    const earth = new Earth(50, 40, { topologyId: 'square' }),
      terrains = await earth.generate(),
      map = earthMaps[0]!;

    expect([earth.width(), earth.height()]).eql([40, 50]);
    expect(earth.options().topologyId).equal('staggered-iso');
    expect(earth.topology().constructor.name).equal('StaggeredIsoTopology');
    expect(earth.map()).equal(map);
    expect(terrains.length).equal(2000);
    expect(terrains[0]).instanceOf(Glacier);
    playedSquares(map).forEach(({ letter }, index) =>
      expect(terrains[index]!.constructor.name).equal(
        [
          'Desert',
          'Plains',
          'Grassland',
          'Forest',
          'Hills',
          'Mountains',
          'Tundra',
          'Glacier',
          'Swamp',
          'Jungle',
          'Ocean',
        ][terrainLetters.indexOf(letter)]
      )
    );
  });

  it('makes the first and last rows Glacier, with no river, as the original does on a round world, and leaves the rest as the map has it', async (): Promise<void> => {
    for (const map of earthMaps) {
      const earth = new Earth(map.height, map.width),
        terrains = await earth.generate(),
        polar = (index: number) =>
          index < map.width || index >= map.width * (map.height - 1);

      expect(
        terrains
          .filter((terrain, index) => polar(index))
          .every((terrain) => terrain instanceof Glacier)
      ).true;
      expect(
        playedSquares(map).filter(
          (square, index) => polar(index) && square.river
        )
      ).eql([]);
      expect(playedSquares(map).filter((square, index) => !polar(index))).eql(
        squares(map).filter((square, index) => !polar(index))
      );
    }
  });

  it('is on the staggered isometric grid whatever grid it is given', (): void => {
    const square = new SquareTopology(40, 50),
      earth = new Earth(50, 40, { topology: square, topologyId: 'square' });

    expect(earth.topology()).not.equal(square);
    expect(earth.topology().constructor.name).equal('StaggeredIsoTopology');
  });

  it('is the Normal map, 50 × 80, by default or for a size there is no map for', (): void => {
    const sizes = [new Earth(), new Earth(64, 40)].map((earth) => [
      earth.width(),
      earth.height(),
    ]);

    expect(sizes).eql([
      [50, 80],
      [50, 80],
    ]);
  });
});

describe('startTileOn', (): void => {
  it("is the map's own start for a tribe, or one that extends it, or none", (): void => {
    class Latin extends Roman {}

    const map = earthMaps[1]!,
      [, rome] = map.startTiles.find(([TribeType]) => TribeType === Roman)!;

    expect(startTileOn(map, Roman)).eql(rome);
    expect(startTileOn(map, Latin)).eql(rome);
    expect(startTileOn(map, class Other extends Civilization {})).null;
    expect(startTilesOn(map).length).equal(map.startTiles.length);
    // The map Earth made for a size it has no map for: the Normal map's starts.
    expect(startTileOn(new Earth(64, 64).map(), Roman)).eql(rome);
  });

  it('pins each map: its seed, and the tribes without a start', (): void => {
    expect(earthMaps.map(({ seed }) => seed)).eql([40, 33, 33]);
    expect(
      earthMaps.map((map) =>
        tribes
          .filter((TribeType) => startTileOn(map, TribeType) === null)
          .map(({ name }) => name)
      )
    ).eql([['Mongol', 'Celtic'], [], []]);
  });

  it('hands out copies of the starts', (): void => {
    const map = earthMaps[1]!,
      start = startTileOn(map, Roman)!;

    start.x += 1;
    startTilesOn(map)[0]!.y += 1;

    expect(startTileOn(map, Roman)).not.eql(start);
    expect(startTilesOn(map)[0]).eql(map.startTiles[0]![1]);
  });

  it("pins a known start on each map: Rome's, on land", (): void => {
    earthMaps.forEach((map) => {
      const start = startTileOn(map, Roman)!;

      expect(start).not.null;
      expect('O').not.equal(at(map, start.x, start.y).letter);
    });
  });
});

describe('index', (): void => {
  it('exports what a ruleset needs', (): void => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const exported = Object.keys(require('../index')).sort();

    expect(exported).eql(
      [
        'Earth',
        'earthMaps',
        'findEarthMap',
        'fromDoubled',
        'getEarthMap',
        'playedSquares',
        'squares',
        'startTileOn',
        'startTilesOn',
        'terrainLetters',
        'terrainTypes',
        'toDoubled',
        'tribes',
      ].sort()
    );
  });
});
