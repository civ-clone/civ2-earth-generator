import readMap, {
  HEADER_SIZE,
  SQUARE_SIZE,
  STARTS_SIZE,
  TRIBES,
} from '../lib/mp';
import { expect } from 'chai';
import { terrainText } from '../lib/earthMapSource';

// A map file made up here, 2 squares across (4 doubled) and 2 rows down, as the original writes one.
const mapFile = (
  squares: number[],
  { doubledWidth = 4, height = 2, area = 4, flat = 0, seed = 33 } = {},
  starts: [number, number][] = []
): Uint8Array => {
  const data = new Uint8Array(
      HEADER_SIZE + STARTS_SIZE + squares.length * SQUARE_SIZE
    ),
    view = new DataView(data.buffer);

  [doubledWidth, height, area, flat, seed, 1, 1].forEach((value, index) =>
    view.setInt16(index * 2, value, true)
  );

  for (let tribe = 0; tribe < TRIBES; tribe++) {
    const [x, y] = starts[tribe] ?? [-1, -1];

    view.setInt16(HEADER_SIZE + tribe * 2, x, true);
    view.setInt16(HEADER_SIZE + TRIBES * 2 + tribe * 2, y, true);
  }

  squares.forEach((byte, index) => {
    data[HEADER_SIZE + STARTS_SIZE + index * SQUARE_SIZE] = byte;
    // The rest of each square is the game's own, cleared as it loads: never read.
    data[HEADER_SIZE + STARTS_SIZE + index * SQUARE_SIZE + 1] = 0xff;
  });

  return data;
};

describe('readMap', (): void => {
  it('reads the size, seed, terrain, rivers and starts, in squares', (): void => {
    const map = readMap(
      mapFile([0x0a, 0x82, 0x40 | 0x03, 0x80 | 0x07], {}, [
        [2, 0],
        [-1, -1],
        [1, 1],
      ])
    );

    expect([map.width, map.height, map.flat, map.seed]).eql([2, 2, false, 33]);
    expect(map.terrain).eql([10, 2, 3, 7]);
    expect(map.rivers).eql([false, true, false, true]);
    expect(map.noSpecial).eql([false, false, true, false]);
    expect(map.starts.slice(0, 4)).eql([
      { x: 1, y: 0 },
      null,
      { x: 0, y: 1 },
      null,
    ]);
    expect(map.starts.length).equal(TRIBES);
    expect(terrainText(map)).equal('Og\nFi\n');
  });

  it('reads a flat world', (): void => {
    expect(readMap(mapFile([10, 10, 10, 10], { flat: 1 })).flat).true;
  });

  (
    [
      ['too few bytes', new Uint8Array(10)],
      [
        'an odd doubled width',
        mapFile([10, 10, 10], { doubledWidth: 3, area: 3 }),
      ],
      ['an area that is not the size', mapFile([10, 10, 10, 10], { area: 5 })],
      ['squares missing', mapFile([10, 10, 10])],
      ['a terrain past Ocean', mapFile([10, 11, 10, 10])],
      ['a start between squares', mapFile([10, 10, 10, 10], {}, [[1, 0]])],
      ['a start off the map', mapFile([10, 10, 10, 10], {}, [[4, 0]])],
    ] as [string, Uint8Array][]
  ).forEach(([name, data]): void => {
    it(`refuses ${name}`, (): void => {
      expect(() => readMap(data)).throw(TypeError);
    });
  });
});
