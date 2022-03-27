import { getTopWords } from './chart-helpers';

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
