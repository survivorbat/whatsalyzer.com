import { Message } from 'whatsapp-chat-parser/types/types';
import moment from 'moment';

const hours = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
];

/**
 * Get all the months date A and date B
 * @param a The starting date
 * @param b The ending date
 */
const getMonthsBetween = (a: Date, b: Date): moment.Moment[] => {
  const firstDate = moment(a);
  const lastDate = moment(b);

  const dates = [moment(firstDate)];

  while (lastDate.unix() >= firstDate.unix()) {
    dates.push(moment(firstDate));
    firstDate.add(1, 'month');
  }

  return dates;
};

/**
 * Get the words in a message
 * @param message The message to dissect
 */
const getWords = (message: string): string[] => {
  return message
    .split(/\b\W+\b/)
    .filter((w) => /[a-zA-Z']/.test(w))
    .map((w) => w.toLowerCase());
};

/**
 * Get the words in a message
 * @param message The message to dissect
 */
const getEmojis = (message: string): string[] => {
  return [...message].filter((w) => /\p{Extended_Pictographic}/u.test(w));
};

class WhatsappData {
  readonly totalMessages: number;
  readonly totalMessageLength: number;
  readonly totalWords: number;
  readonly totalEmojis: number;
  readonly users: string[];

  readonly messagesPerUser: Record<string, Message[]>;
  readonly wordsPerUser: Record<string, string[]>;
  readonly emojisPerUser: Record<string, string[]>;
  readonly wordUsagePerUser: Record<string, Record<string, number>>;
  readonly emojiUsagePerUser: Record<string, Record<string, number>>;

  readonly messagesPerMonthPerUser: Record<string, Record<string, number>>;
  readonly messagesPerHourPerUser: Record<string, Record<string, number>>;

  readonly systemMessages: Message[];

  readonly firstMessage?: Message;
  readonly lastMessage?: Message;

  /**
   * Initialize the data class with the messages of this conversation.
   * @param messages The parsed messages
   */
  constructor(readonly messages: Message[]) {
    this.systemMessages = messages.filter((m) => m.author === 'System');

    const filtered = messages
      .filter((m) => m.message !== '<Media omitted>')
      .filter((m) => m.author !== 'System');

    const sortedByDate = filtered.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    // Set first and last
    this.firstMessage = sortedByDate[0] || null;
    this.lastMessage = sortedByDate[sortedByDate.length - 1] || null;

    // Set totals
    this.totalMessages = filtered.length;
    this.totalMessageLength = filtered.reduce(
      (count, msg) => count + msg.message.length,
      0
    );

    // Set messages per user
    this.messagesPerUser = sortedByDate.reduce((prev, cur) => {
      if (!prev[cur.author]) {
        prev[cur.author] = [];
      }

      prev[cur.author].push(cur);
      return prev;
    }, {} as Record<string, Message[]>);

    // Set users, we use the keys of wordsPerUser to sort them based on the amount of messages
    this.users = Object.keys(this.messagesPerUser).sort(
      (a, b) => this.messagesPerUser[b].length - this.messagesPerUser[a].length
    );

    // Set words per user
    this.wordsPerUser = sortedByDate.reduce((prev, cur) => {
      if (!prev[cur.author]) {
        prev[cur.author] = [];
      }

      prev[cur.author].push(...getWords(cur.message));

      return prev;
    }, {} as Record<string, string[]>);

    this.wordUsagePerUser = Object.keys(this.wordsPerUser).reduce(
      (res, user) => {
        res[user] = this.wordsPerUser[user].reduce((result, word) => {
          if (!result[word]) {
            result[word] = 0;
          }

          result[word]++;
          return result;
        }, {} as Record<string, number>);

        return res;
      },
      {} as Record<string, Record<string, number>>
    );

    this.emojisPerUser = sortedByDate.reduce((prev, cur) => {
      if (!prev[cur.author]) {
        prev[cur.author] = [];
      }

      prev[cur.author].push(...getEmojis(cur.message));

      return prev;
    }, {} as Record<string, string[]>);

    this.emojiUsagePerUser = Object.keys(this.emojisPerUser).reduce(
      (res, user) => {
        res[user] = this.emojisPerUser[user].reduce((result, word) => {
          if (!result[word]) {
            result[word] = 0;
          }

          result[word]++;
          return result;
        }, {} as Record<string, number>);

        return res;
      },
      {} as Record<string, Record<string, number>>
    );

    this.totalWords = Object.keys(this.wordsPerUser).reduce(
      (res, user) => res + this.wordsPerUser[user].length,
      0
    );

    this.totalEmojis = Object.keys(this.emojisPerUser).reduce(
      (res, user) => res + this.emojisPerUser[user].length,
      0
    );

    // Set messages per hour
    this.messagesPerHourPerUser = hours.reduce((prev, cur) => {
      if (!prev[cur]) {
        prev[cur] = this.users!.reduce(
          (result, hour) => ({ ...result, [hour]: 0 }),
          {}
        );
      }

      filtered
        .filter((message) => message.date.getHours() === cur)
        .forEach((message) => prev[cur][message.author]++);

      return prev;
    }, {} as Record<string, Record<string, number>>);

    // Set messages per month, just use an empty array if there are no messages
    const dates = this.firstMessage
      ? getMonthsBetween(this.firstMessage.date, this.lastMessage.date)
      : [];

    this.messagesPerMonthPerUser = dates.reduce((prev, cur) => {
      const dateFormat = cur.format('MMM YYYY');
      if (!prev[dateFormat]) {
        prev[dateFormat] = this.users!.reduce(
          (list, participant) => ({ ...list, [participant]: 0 }),
          {}
        );
      }

      sortedByDate
        .filter(
          (message) =>
            message.date.getMonth() === cur.month() &&
            message.date.getFullYear() === cur.year()
        )
        .forEach((message) => prev[dateFormat][message.author]++);

      return prev;
    }, {} as Record<string, Record<string, number>>);
  }
}

export default WhatsappData;
