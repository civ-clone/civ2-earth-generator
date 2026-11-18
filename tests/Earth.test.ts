import EarthMap, { squares, terrainLetters } from '../EarthMap';
import { earthMaps, findEarthMap, getEarthMap } from '../EarthMaps';
import { startTileFor, startTilesOn } from '../startTiles';
import Civilization from '@civ-clone/core-civilization/Civilization';
import Earth from '../Earth';
import { Glacier } from '@civ-clone/base-terrain-glacier/Glacier';
import { Ocean } from '@civ-clone/base-terrain-ocean/Ocean';
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
        expect(y).within(0, map.height - 1);
        expect(at(map, x, y).letter).not.equal('O');
      });
    });
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
    expect(terrains[0]).instanceOf(
      squares(map)[0]!.letter === 'I' ? Glacier : Ocean
    );
    squares(map).forEach(({ letter }, index) =>
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

describe('startTileFor', (): void => {
  it("is the map's own start for a tribe, or one that extends it, and none off the maps", (): void => {
    class Latin extends Roman {}

    const map = earthMaps[1]!,
      [, rome] = map.startTiles.find(([TribeType]) => TribeType === Roman)!;

    expect(startTileFor(Roman, 50, 80)).eql(rome);
    expect(startTileFor(Latin, 50, 80)).eql(rome);
    expect(startTileFor(class Other extends Civilization {}, 50, 80)).null;
    expect(startTileFor(Roman, 80, 50)).null;
    expect(startTilesOn(50, 80).length).equal(map.startTiles.length);
    expect(startTilesOn(80, 50)).eql([]);
  });
});
