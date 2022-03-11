import { Attachment, Message } from 'whatsapp-chat-parser/types/types';
import moment from 'moment';
import { Simulate } from 'react-dom/test-utils';

const hours = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
];

/**
 * Get all the months date A and date B
 * @param from The starting date
 * @param to The ending date
 */
export const getMonthsBetween = (
  from: moment.Moment,
  to: moment.Moment
): moment.Moment[] => {
  const dates = [];

  const countDate = moment(from);

  while (to.unix() >= countDate.unix()) {
    dates.push(moment(countDate));
    countDate.add(1, 'month');
  }

  return dates;
};

export interface ConversationName {
  name: string;
  user: string;
  startDate: moment.Moment;
  endDate: moment.Moment;
}

export const getConversationSubjects = (
  systemMessages: WhatsappMessage[]
): ConversationName[] => {
  return systemMessages.reduce((prev, msg) => {
    const createMatch = msg.message.match(/^(.*) created group "(.+)"/);
    const renameMatch = msg.message.match(
      /^(.*) changed the subject from "(.+)" to "(.+)"/
    );

    // If we find the create message, we add it as the first item in the list with an unspecified end date
    if (createMatch) {
      prev.push({
        name: createMatch[2],
        user: createMatch[1],
        startDate: msg.date,
        endDate: moment(),
      });
    }

    // If we find a rename message, we...
    if (renameMatch) {
      // First check if a message came before it, because if it does, that message now gets an
      // end date
      if (prev.length > 0) {
        prev[prev.length - 1].endDate = msg.date;
      }

      // Then we add the new item with an unspecified end date
      prev.push({
        name: renameMatch[3],
        user: renameMatch[1],
        startDate: msg.date,
        endDate: moment(),
      });
    }

    return prev;
  }, [] as ConversationName[]);
};

/**
 * Get the words in a message
 * @param message The message to dissect
 */
export const getWords = (message: string): string[] => {
  return message
    .split(/\b[^\w']+\b/)
    .map((w) => w.toLowerCase().replace(/[^a-zA-Z']/g, ''))
    .filter((w) => w !== '');
};

/**
 * Get the words in a message
 * @param message The message to dissect
 */
export const getEmojis = (message: string): string[] => {
  return [...message].filter((w) => /\p{Extended_Pictographic}/u.test(w));
};

export interface WhatsappMessage {
  date: moment.Moment;
  author: string;
  message: string;
}

class WhatsappData {
  readonly totalMessages: number;
  readonly totalMessageLength: number;
  readonly totalWords: number;
  readonly totalEmojis: number;

  readonly users: string[];
  readonly conversationNames: ConversationName[];

  readonly messagesPerUser: Record<string, WhatsappMessage[]>;
  readonly wordsPerUser: Record<string, string[]>;
  readonly emojisPerUser: Record<string, string[]>;
  readonly wordUsagePerUser: Record<string, Record<string, number>>;
  readonly emojiUsagePerUser: Record<string, Record<string, number>>;

  readonly messagesPerMonthPerUser: Record<string, Record<string, number>>;
  readonly messagesPerHourPerUser: Record<string, Record<string, number>>;

  readonly systemMessages: WhatsappMessage[];

  readonly firstMessage: WhatsappMessage;
  readonly lastMessage: WhatsappMessage;

  /**
   * Initialize the data class with the messages of this conversation.
   * @param messages The parsed messages
   */
  constructor(messages: Message[]) {
    if (messages.length === 0) {
      throw new Error('No messages to analyze');
    }

    const whatsappMessages = messages.map((m) => ({
      message: m.message,
      author: m.author,
      date: moment(m.date),
    }));

    this.systemMessages = whatsappMessages.filter((m) => m.author === 'System');

    const filtered = whatsappMessages
      .filter((m) => m.author !== 'System')
      .filter((m) => m.message !== '<Media omitted>')
      .sort((a, b) => a.date.unix() - b.date.unix());

    this.firstMessage = filtered[0];
    this.lastMessage = filtered[filtered.length - 1];

    this.totalMessages = filtered.length;
    this.totalMessageLength = filtered.reduce(
      (count, msg) => count + msg.message.length,
      0
    );

    this.messagesPerUser = filtered.reduce((res, msg) => {
      if (!res[msg.author]) {
        res[msg.author] = [];
      }

      res[msg.author].push(msg);
      return res;
    }, {} as Record<string, WhatsappMessage[]>);

    // Set users, we use the keys of wordsPerUser to sort them based on the amount of messages
    this.users = Object.keys(this.messagesPerUser).sort(
      (a, b) => this.messagesPerUser[b].length - this.messagesPerUser[a].length
    );

    // Set words per user
    this.wordsPerUser = filtered.reduce((res, msg) => {
      if (!res[msg.author]) {
        res[msg.author] = [];
      }

      res[msg.author].push(...getWords(msg.message));
      return res;
    }, {} as Record<string, string[]>);

    this.wordUsagePerUser = Object.keys(this.wordsPerUser).reduce(
      (res, user) => {
        res[user] = this.wordsPerUser[user].reduce((result, word) => {
          if (!result[word]) {
            result[word] = 1;
            return result;
          }

          result[word]++;
          return result;
        }, {} as Record<string, number>);

        return res;
      },
      {} as Record<string, Record<string, number>>
    );

    this.emojisPerUser = filtered.reduce((prev, msg) => {
      if (!prev[msg.author]) {
        prev[msg.author] = [];
      }

      prev[msg.author].push(...getEmojis(msg.message));

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
    this.messagesPerHourPerUser = hours.reduce((res, hour) => {
      res[hour] = this.users!.reduce(
        (result, user) => ({
          ...result,
          [user]: filtered.filter(
            (message) => message.date.hour() === hour && message.author === user
          ).length,
        }),
        {}
      );

      return res;
    }, {} as Record<string, Record<string, number>>);

    // Set messages per month, just use an empty array if there are no messages
    const dates = getMonthsBetween(
      this.firstMessage.date,
      this.lastMessage.date
    );

    this.messagesPerMonthPerUser = dates.reduce((res, date) => {
      const dateFormat = date.format('MMM YYYY');

      res[dateFormat] = this.users.reduce(
        (list, user) => ({
          ...list,
          [user]: filtered.filter(
            (message) =>
              message.date.month() === date.month() &&
              message.date.year() === date.year() &&
              message.author === user
          ).length,
        }),
        {}
      );

      return res;
    }, {} as Record<string, Record<string, number>>);

    this.conversationNames = getConversationSubjects(this.systemMessages);
  }
}

export default WhatsappData;
