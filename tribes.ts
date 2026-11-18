import { American } from '@civ-clone/base-civilization-american/American';
import { Aztec } from '@civ-clone/base-civilization-aztec/Aztec';
import { Babylonian } from '@civ-clone/base-civilization-babylonian/Babylonian';
import { Carthaginian } from '@civ-clone/base-civilization-carthaginian/Carthaginian';
import { Celtic } from '@civ-clone/base-civilization-celtic/Celtic';
import { Chinese } from '@civ-clone/base-civilization-chinese/Chinese';
import Civilization from '@civ-clone/core-civilization/Civilization';
import { Egyptian } from '@civ-clone/base-civilization-egyptian/Egyptian';
import { English } from '@civ-clone/base-civilization-english/English';
import { French } from '@civ-clone/base-civilization-french/French';
import { German } from '@civ-clone/base-civilization-german/German';
import { Greek } from '@civ-clone/base-civilization-greek/Greek';
import { Indian } from '@civ-clone/base-civilization-indian/Indian';
import { Japanese } from '@civ-clone/base-civilization-japanese/Japanese';
import { Mongol } from '@civ-clone/base-civilization-mongol/Mongol';
import { Persian } from '@civ-clone/base-civilization-persian/Persian';
import { Roman } from '@civ-clone/base-civilization-roman/Roman';
import { Russian } from '@civ-clone/base-civilization-russian/Russian';
import { Sioux } from '@civ-clone/base-civilization-sioux/Sioux';
import { Spanish } from '@civ-clone/base-civilization-spanish/Spanish';
import { Viking } from '@civ-clone/base-civilization-viking/Viking';
import { Zulu } from '@civ-clone/base-civilization-zulu/Zulu';

/** Civilization II's 21 tribes, in the order a map file lists their starts (`RULES.TXT` `@LEADERS`, civ2-civilization's). */
export const tribes: (typeof Civilization)[] = [
  Roman,
  Babylonian,
  German,
  Egyptian,
  American,
  Greek,
  Indian,
  Russian,
  Zulu,
  French,
  Aztec,
  Chinese,
  English,
  Mongol,
  Celtic,
  Japanese,
  Viking,
  Spanish,
  Persian,
  Carthaginian,
  Sioux,
];

export default tribes;
