# civ2-earth-generator

Civilization II's own Earth, as a world `Generator`, on the staggered isometric grid: the twin of civ1-earth-generator.

- `Earth`: the generator, in Civilization II's three sizes, Small (40 × 50), Normal (50 × 80) and Large (75 × 120),
  always on the staggered isometric grid. A size without a map of its own gets the Normal map, so `width()` and
  `height()` say what was made. `map()` is the map it made.
- `Maps/`: each size's terrain, rivers, seed and start positions, as code (`EarthMap`). The terrain is one letter per
  square, in lower case where a river runs, as the original's file has it. A game is played on `playedSquares(map)`:
  the same, with the first and last rows Glacier, as the original makes them on a round world. Specials, huts and
  Grassland shields aren't stored in the original's maps: the original places them from the seed and each square's
  position, and hides the specials of ocean squares with no land in a city's reach, and so does civ2-world.
- `startTileOn(map, CivilizationType)`: where a tribe starts on `map` (`Earth#map()`), as the original's map has it, or
  `null`. Not every tribe has a start on every map (the Small map has 19 of the 21).
- `toDoubled` and `fromDoubled`: our squares in Civilization II's own coordinates, whose x is doubled, and back, for the
  original's formulas.

The maps are derived from the original's own `WORLD_S.MP`, `WORLD_M.MP` and `WORLD.MP` by `tools/generate.ts`, with
`lib/mp.ts` reading the files as the original does (`map_read`, checked against OpenCiv2). The original's files aren't
part of this package. To make the maps again, or to check them against your own copy:

```sh
CIV2_PATH=/path/to/civ2 npm run generate
CIV2_PATH=/path/to/civ2 npm test
```

The original's regional maps (Europe, the Pacific, Greece and the Mediterranean) are in the same format, but most are
flat worlds, which don't wrap east to west, and aren't offered yet.
