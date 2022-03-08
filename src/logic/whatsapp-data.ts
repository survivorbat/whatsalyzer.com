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
    .split(/\W+/)
    .filter((w) => /[a-zA-Z]/.test(w))
    .map((w) => w.toLowerCase());
};

class WhatsappData {
  readonly totalMessages: number;
  readonly totalMessageLength: number;
  readonly totalWords: number;

  // The participants in this conversation
  readonly participants: string[];

  // The amount of messages a user has posted in this conversation
  readonly userMessages: Record<string, Message[]>;

  // The words a user has posted in this conversation
  readonly userWords: Record<string, string[]>;

  // The amount of words a user has posted in this conversation
  readonly userWordUsage: Record<string, Record<string, number>>;

  // A mapping of months, with the messages of each user
  readonly monthUserCount: Record<string, Record<string, number>>;

  // A mapping of hours, with the messages of each user
  readonly hourUserCount: Record<string, Record<string, number>>;

  // The first message in the conversation, null if no messages were found
  readonly firstMessage?: Message;

  // The last message in this conversation, null if no messages were found
  readonly lastMessage?: Message;

  /**
   * Initialize the data class with the messages of this conversation.
   * @param messages The parsed messages
   */
  constructor(messages: Message[]) {
    const filtered = messages.filter((m) => m.message !== '<Media omitted>');

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

    // Set participants, use the Set to weed out non-uniques
    this.participants = [...new Set(filtered.map((m) => m.author))];

    // Set messages per user
    this.userMessages = sortedByDate.reduce((prev, cur) => {
      if (!prev[cur.author]) {
        prev[cur.author] = [];
      }

      prev[cur.author].push(cur);
      return prev;
    }, {} as Record<string, Message[]>);

    // Set words per user
    this.userWords = sortedByDate.reduce((prev, cur) => {
      if (!prev[cur.author]) {
        prev[cur.author] = [];
      }

      prev[cur.author].push(...getWords(cur.message));

      return prev;
    }, {} as Record<string, string[]>);

    this.userWordUsage = Object.keys(this.userWords).reduce((res, user) => {
      res[user] = this.userWords[user].reduce((result, word) => {
        if (!result[word]) {
          result[word] = 0;
        }

        result[word]++;
        return result;
      }, {} as Record<string, number>);

      return res;
    }, {} as Record<string, Record<string, number>>);

    this.totalWords = Object.keys(this.userWords).reduce(
      (res, user) => res + this.userWords[user].length,
      0
    );

    // Set messages per hour
    this.hourUserCount = hours.reduce((prev, cur) => {
      if (!prev[cur]) {
        prev[cur] = this.participants!.reduce(
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

    this.monthUserCount = dates.reduce((prev, cur) => {
      const dateFormat = cur.format('YYYY-MM');
      if (!prev[dateFormat]) {
        prev[dateFormat] = this.participants!.reduce(
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
