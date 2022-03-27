import { colorIndex, getMaxWordFrequency, getTopWords } from './chart-helpers';
import defaultColors from '../constants/colors';

describe('getTopWords', () => {
  const testData = [
    {
      inputData: <Record<string, number>>{},
      amount: 100,
      minLength: 0,
      expected: [],
    },
    {
      inputData: <Record<string, number>>{
        a: 5,
        b: 2,
        c: 3,
      },
      amount: 3,
      minLength: 0,
      expected: [
        { amount: 5, name: 'a' },
        { amount: 3, name: 'c' },
        { amount: 2, name: 'b' },
      ],
    },
    {
      inputData: <Record<string, number>>{
        a: 6,
        e: 2,
        b: 5,
        f: 1,
        c: 4,
        d: 3,
      },
      amount: 3,
      minLength: 0,
      expected: [
        { amount: 6, name: 'a' },
        { amount: 5, name: 'b' },
        { amount: 4, name: 'c' },
      ],
    },
    {
      inputData: <Record<string, number>>{
        aaa: 6,
        bb: 2,
        a: 1,
      },
      amount: 3,
      minLength: 2,
      expected: [
        { amount: 6, name: 'aaa' },
        { amount: 2, name: 'bb' },
      ],
    },
  ];

  testData.forEach(({
    inputData, amount, minLength, expected,
  }) => {
    it(`returns '${expected}' on input '${inputData}'`, () => {
      // Act
      const result = getTopWords(inputData, minLength, amount);

      // Assert
      expect(result).toEqual(expected);
    });
  });
});

describe('getMaxWordFrequency', () => {
  const testData = [
    {
      minFrequency: 5,
      words: [],
      usage: <Record<string, number>>{},
      expected: 6,
    },
    {
      minFrequency: 12,
      words: ['n', 'm', 'o'],
      usage: <Record<string, number>>{
        n: 12,
        m: 12,
      },
      expected: 13,
    },
    {
      minFrequency: 5,
      words: ['a', 'b'],
      usage: <Record<string, number>>{
        a: 5,
        b: 12,
      },
      expected: 12,
    },
    {
      minFrequency: 0,
      words: ['a', 'b', 'c', 'd'],
      usage: <Record<string, number>>{
        a: 1,
        b: 2,
        c: 2,
        d: 1,
      },
      expected: 2,
    },
  ];

  testData.forEach(({
    minFrequency, expected, usage, words,
  }) => {
    it(`returns '${expected}' on '${words.length} words'`, () => {
      // Act
      const result = getMaxWordFrequency(minFrequency, words, usage);

      // Assert
      expect(result).toEqual(expected);
    });
  });
});

describe('colorIndex', () => {
  const testData = [
    {
      input: 5,
      expected: defaultColors[5],
    },
    {
      input: 2032,
      expected: defaultColors[12],
    },
  ];

  testData.forEach(({ input, expected }) => {
    it(`returns '${expected}' on '${input}'`, () => {
      // Act
      const result = colorIndex(input);

      // Assert
      expect(result).toEqual(expected);
    });
  });
});
