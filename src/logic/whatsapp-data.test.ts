import WhatsappData, {
  ConversationName,
  getConversationSubjects,
  getEmojis,
  getMonthsBetween,
  getWords,
  WhatsappMessage,
} from './whatsapp-data';
import { Message } from 'whatsapp-chat-parser/types/types';
import moment from 'moment';

describe('getMonthsBetween', () => {
  const tests = [
    {
      begin: moment(new Date(2019, 0, 1)),
      end: moment(new Date(2019, 0, 1)),
      expected: ['2019-01'],
    },
    {
      begin: moment(new Date(2019, 0, 1)),
      end: moment(new Date(2019, 1, 1)),
      expected: ['2019-01', '2019-02'],
    },
    {
      begin: moment(new Date(2019, 0, 1)),
      end: moment(new Date(2019, 11, 1)),
      expected: [
        '2019-01',
        '2019-02',
        '2019-03',
        '2019-04',
        '2019-05',
        '2019-06',
        '2019-07',
        '2019-08',
        '2019-09',
        '2019-10',
        '2019-11',
        '2019-12',
      ],
    },
    {
      begin: moment(new Date(2020, 0, 1)),
      end: moment(new Date(2021, 5, 30)),
      expected: [
        '2020-01',
        '2020-02',
        '2020-03',
        '2020-04',
        '2020-05',
        '2020-06',
        '2020-07',
        '2020-08',
        '2020-09',
        '2020-10',
        '2020-11',
        '2020-12',
        '2021-01',
        '2021-02',
        '2021-03',
        '2021-04',
        '2021-05',
        '2021-06',
      ],
    },
    {
      begin: moment(new Date(2030, 0, 1)),
      end: moment(new Date(2020, 5, 30)),
      expected: [],
    },
  ];

  tests.forEach(({ begin, end, expected }) => {
    it(`returns '${expected.length}' months between '${begin}' and '${end}'`, () => {
      // Act
      const result = getMonthsBetween(begin, end);

      // Assert
      const resultStrings = result.map((date) => date.format('YYYY-MM'));
      expect(resultStrings).toEqual(expected);
    });
  });
});

describe('getWords', () => {
  const tests = [
    {
      input: '',
      expected: [],
    },
    {
      input: 'Yes',
      expected: ['yes'],
    },
    {
      input: 'Hello World',
      expected: ['hello', 'world'],
    },
    {
      input: 'I, just need, to see, if. it: works without?! SPACE!',
      expected: [
        'i',
        'just',
        'need',
        'to',
        'see',
        'if',
        'it',
        'works',
        'without',
        'space',
      ],
    },
    {
      input: '%Q$#(!E(@!*@!#()DK!@E(D@IU#$(FDI*@!Q@#(',
      expected: ['q', 'e', 'dk', 'e', 'd', 'iu', 'fdi', 'q'],
    },
    {
      input: "I'm I'll m'ĺady",
      expected: ["i'm", "i'll", "m'ady"],
    },
    {
      input: 's            p              a                   c              e',
      expected: ['s', 'p', 'a', 'c', 'e'],
    },
  ];

  tests.forEach(({ input, expected }) => {
    it(`returns '${expected.join(', ')}' on '${input}'`, () => {
      // Act
      const result = getWords(input);

      // Assert
      expect(result).toEqual(expected);
    });
  });
});

describe('getEmojis', () => {
  const tests = [
    {
      input: '',
      expected: [],
    },
    {
      input: 'Yes',
      expected: [],
    },
    {
      input: 'Hello World 😊',
      expected: ['😊'],
    },
    {
      input: '😊😊😊😊😊',
      expected: ['😊', '😊', '😊', '😊', '😊'],
    },
    {
      input: '😊t😊e⚠s😊t😊',
      expected: ['😊', '😊', '⚠', '😊', '😊'],
    },
    {
      input: '😂😂😂 Who Did This 😂😂😂',
      expected: ['😂', '😂', '😂', '😂', '😂', '😂'],
    },
  ];

  tests.forEach(({ input, expected }) => {
    it(`returns '${expected.join(', ')}' on '${input}'`, () => {
      // Act
      const result = getEmojis(input);

      // Assert
      expect(result).toEqual(expected);
    });
  });
});

describe('getConversationSubjects', () => {
  const tests = [
    {
      input: <WhatsappMessage[]>[
        {
          date: moment(new Date(2019, 1, 1)),
          message: 'John Smith created group "Civil Conversation"',
        },
      ],
      expected: <ConversationName[]>[
        {
          name: 'Civil Conversation',
          startDate: moment(new Date(2019, 1, 1)),
          user: 'John Smith',
          endDate: expect.any(moment),
        },
      ],
    },
    {
      input: <WhatsappMessage[]>[
        {
          date: moment(new Date(2019, 2, 2)),
          message:
            'Smith John changed the subject from "Civil Conversation" to "Aggressive Conversation"',
        },
      ],
      expected: <ConversationName[]>[
        {
          name: 'Aggressive Conversation',
          startDate: moment(new Date(2019, 2, 2)),
          endDate: expect.any(moment),
          user: 'Smith John',
        },
      ],
    },
    {
      input: <WhatsappMessage[]>[
        {
          date: moment(new Date(2020, 1, 1)),
          message: 'My boy created group "Salad People 🥗"',
          author: '',
        },
        {
          date: moment(new Date(2020, 2, 1)),
          author: '',
          message:
            'You changed the subject from "Salad People 🥗" to "Brezus People"',
        },
        {
          date: moment(new Date(2021, 3, 2)),
          author: '',
          message:
            'My boy changed the subject from "Brezus People" to "🥖Brezus\' People🥖"',
        },
      ],
      expected: <ConversationName[]>[
        {
          name: 'Salad People 🥗',
          startDate: moment(new Date(2020, 1, 1)),
          endDate: moment(new Date(2020, 2, 1)),
          user: 'My boy',
        },
        {
          name: 'Brezus People',
          startDate: moment(new Date(2020, 2, 1)),
          endDate: moment(new Date(2021, 3, 2)),
          user: 'You',
        },
        {
          name: "🥖Brezus' People🥖",
          startDate: moment(new Date(2021, 3, 2)),
          endDate: expect.any(moment),
          user: 'My boy',
        },
      ],
    },
  ];

  tests.forEach(({ input, expected }) => {
    it(`it returns expected list from '${input.length}' system messages`, () => {
      // Act
      const result = getConversationSubjects(input);

      // Assert
      expect(result).toEqual(expected);
    });
  });
});

// TODO: Make this more comprehensible

describe('WhatsappData', () => {
  describe('constructor', () => {
    const tests = [
      {
        input: <Message[]>[
          {
            message: 'User joined your channel',
            author: 'System',
            date: new Date(2021, 2, 10, 5),
          },
          {
            message: 'Welcome to the chat!',
            author: 'Madame Trudeau',
            date: new Date(2021, 2, 10, 5),
          },
          {
            message: 'Thanks! Happy to be here 😊',
            author: 'Among Us Player',
            date: new Date(2021, 2, 12, 5),
          },
          {
            message: '<Media omitted>',
            author: 'Among Us Player',
            date: new Date(2022, 3, 10, 6),
          },
          {
            message: 'Sorry for being late to the meeting',
            author: 'Among Us Player',
            date: new Date(2022, 1, 10, 6),
          },
          {
            message: 'I forgive you 💩',
            author: 'Madame Trudeau',
            date: new Date(2022, 2, 10, 7),
          },
        ],
        expected: <WhatsappData>{
          totalMessages: 4,
          totalCharacters: 98,
          totalWords: 19,
          totalFemke: 5,
          totalEmojis: 2,
          users: ['Madame Trudeau', 'Among Us Player'],
          femkePerUser: {
            'Among Us Player': 3,
            'Madame Trudeau': 2,
          },
          charactersPerUser: {
            'Among Us Player': 62,
            'Madame Trudeau': 36,
          },
          systemMessages: [
            {
              message: 'User joined your channel',
              author: 'System',
              date: moment(new Date(2021, 2, 10, 5)),
            },
          ],
          lastMessage: {
            message: 'I forgive you 💩',
            author: 'Madame Trudeau',
            date: moment(new Date(2022, 2, 10, 7)),
          },
          firstMessage: {
            message: 'Welcome to the chat!',
            author: 'Madame Trudeau',
            date: moment(new Date(2021, 2, 10, 5)),
          },
          messagesPerUser: {
            'Among Us Player': [
              {
                author: 'Among Us Player',
                date: moment(new Date(2021, 2, 12, 5)),
                message: 'Thanks! Happy to be here 😊',
              },
              {
                message: 'Sorry for being late to the meeting',
                author: 'Among Us Player',
                date: moment(new Date(2022, 1, 10, 6)),
              },
            ],
            'Madame Trudeau': [
              {
                author: 'Madame Trudeau',
                date: moment(new Date(2021, 2, 10, 5)),
                message: 'Welcome to the chat!',
              },
              {
                author: 'Madame Trudeau',
                date: moment(new Date(2022, 2, 10, 7)),
                message: 'I forgive you 💩',
              },
            ],
          },
          emojisPerUser: {
            'Among Us Player': ['😊'],
            'Madame Trudeau': ['💩'],
          },
          emojiUsagePerUser: {
            'Among Us Player': {
              '😊': 1,
            },
            'Madame Trudeau': {
              '💩': 1,
            },
          },
          wordsPerUser: {
            'Among Us Player': [
              'thanks',
              'happy',
              'to',
              'be',
              'here',
              'sorry',
              'for',
              'being',
              'late',
              'to',
              'the',
              'meeting',
            ],
            'Madame Trudeau': [
              'welcome',
              'to',
              'the',
              'chat',
              'i',
              'forgive',
              'you',
            ],
          },
          wordUsagePerUser: {
            'Among Us Player': {
              be: 1,
              being: 1,
              for: 1,
              happy: 1,
              here: 1,
              late: 1,
              meeting: 1,
              sorry: 1,
              thanks: 1,
              the: 1,
              to: 2,
            },
            'Madame Trudeau': {
              chat: 1,
              forgive: 1,
              i: 1,
              the: 1,
              to: 1,
              welcome: 1,
              you: 1,
            },
          },
          conversationNames: [],
          messagesPerMonthPerUser: {
            'Apr 2021': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            'Aug 2021': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            'Dec 2021': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            'Feb 2022': {
              'Among Us Player': 1,
              'Madame Trudeau': 0,
            },
            'Jan 2022': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            'Jul 2021': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            'Jun 2021': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            'Mar 2021': {
              'Among Us Player': 1,
              'Madame Trudeau': 1,
            },
            'Mar 2022': {
              'Among Us Player': 0,
              'Madame Trudeau': 1,
            },
            'May 2021': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            'Nov 2021': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            'Oct 2021': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            'Sep 2021': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
          },
          messagesPerHourPerUser: {
            '0': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '1': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '10': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '11': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '12': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '13': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '14': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '15': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '16': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '17': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '18': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '19': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '2': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '20': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '21': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '22': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '23': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '3': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '4': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '5': {
              'Among Us Player': 1,
              'Madame Trudeau': 1,
            },
            '6': {
              'Among Us Player': 1,
              'Madame Trudeau': 0,
            },
            '7': {
              'Among Us Player': 0,
              'Madame Trudeau': 1,
            },
            '8': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
            '9': {
              'Among Us Player': 0,
              'Madame Trudeau': 0,
            },
          },
        },
      },
    ];

    tests.forEach(({ input, expected }) => {
      it(`returns expected calculations on '${input.length}' messages`, () => {
        // Act
        const result = new WhatsappData(input);

        // Assert
        expect(result).toEqual(expected);
      });
    });
  });
});
