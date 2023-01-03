import defaultColors from '../constants/colors';

export interface TopWord {
  amount: number;
  name: string;
}

export const getTopWords = (
  inputData: Record<string, number>,
  minLength: number,
  amount: number
): TopWord[] => {
  const sorted = Object.keys(inputData)
    .filter((w) => w.length >= minLength)
    .sort((a, b) => inputData[b] - inputData[a]);

  // Create an empty array with zeroes with the specified amount as length
  return (
    new Array(amount)
      .fill(0)
      // Map the empty array to the expected values using the index of the empty array element
      .map((_, i) => ({ name: sorted[i], amount: inputData[sorted[i]] }))
      // Filter out empty values
      .filter((i) => !!i.name)
  );
};

export const getMaxWordFrequency = (
  minFrequency: number,
  words: string[],
  usage: Record<string, number>
) =>
  words.reduce(
    (result, word) => (usage[word] > result ? usage[word] : result),
    minFrequency + 1
  );

export const totalCount = (input: Record<string, number>): number =>
  Object.keys(input).reduce((res, key) => res + input[key], 0);

export const colorIndex = (index: number) =>
  defaultColors[index % defaultColors.length];
