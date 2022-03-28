import { Message } from 'whatsapp-chat-parser/types/types';
import moment from 'moment';
import { hours, weekdays } from '../constants/time';

/**
 * Get all the months date A and date B
 * @param from The starting date
 * @param to The ending date
 */
export const getMonthsBetween = (
  from: moment.Moment,
  to: moment.Moment,
): moment.Moment[] => {
  const dates = [];

  const countDate = moment(from);

  while (to.unix() >= countDate.unix()) {
    dates.push(moment(countDate));
    countDate.add(1, 'month');
  }

  return dates;
};

interface ConversationName {
  name: string;
  user: string;
  startDate: moment.Moment;
  endDate: moment.Moment;
}

export const getConversationSubjects = (
  systemMessages: WhatsappMessage[],
): ConversationName[] => systemMessages.reduce((prev, msg) => {
  // TODO: These only work in English now...
  const createMatch = msg.message.match(/^(.*) created group "(.+)"/);
  const renameMatch = msg.message.match(
    /^(.*) changed the subject from "(.+)" to "(.+)"/,
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

/**
 * Get the words in a message
 * @param message The message to dissect
 */
export const getWords = (message: string): string[] => message
  .split(/\b[^\w']+\b/)
  .map((w) => w.toLowerCase().replace(/[^a-zA-Z']/g, ''))
  .filter((w) => w !== '');

/**
 * Get the words in a message
 * @param message The message to dissect
 */
export const getEmojis = (message: string): string[] => [...message].filter((w) => /\p{Extended_Pictographic}/u.test(w));

export interface WhatsappMessage {
  date: moment.Moment;
  author: string;
  message: string;
}

class WhatsappData {
  readonly totalMessages: number;

  readonly totalCharacters: number;

  readonly totalWords: number;

  readonly totalEmojis: number;

  readonly totalFemke: number;

  readonly users: string[];

  readonly conversationNames: ConversationName[];

  readonly messagesPerUser: Record<string, WhatsappMessage[]>;

  readonly charactersPerUser: Record<string, number>;

  readonly femkePerUser: Record<string, number>;

  readonly wordsPerUser: Record<string, string[]>;

  readonly emojisPerUser: Record<string, string[]>;

  readonly wordUsagePerUser: Record<string, Record<string, number>>;

  readonly emojiUsagePerUser: Record<string, Record<string, number>>;

  readonly wordUsage: Record<string, number>;

  readonly emojiUsage: Record<string, number>;

  readonly messagesPerMonthPerUser: Record<string, Record<string, number>>;

  readonly messagesPerHourPerUser: Record<string, Record<string, number>>;

  readonly messagesPerDayPerUser: Record<string, Record<string, number>>;

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
      // This should take care of all <Media Omitted> messages, in whatever language the user has their phone
      .filter(
        (m) => !(m.message.trim().startsWith('<') && m.message.trim().endsWith('>')),
      )
      .sort((a, b) => a.date.unix() - b.date.unix());

    [this.firstMessage] = filtered;
    this.lastMessage = filtered[filtered.length - 1];

    this.totalFemke = filtered.reduce(
      (count, msg) => count + msg.message.replace(/[^A-Z]/g, '').length,
      0,
    );
    this.totalMessages = filtered.length;
    this.totalCharacters = filtered.reduce(
      (count, msg) => count + msg.message.length,
      0,
    );

    this.messagesPerUser = filtered.reduce((res, msg) => {
      if (!res[msg.author]) {
        res[msg.author] = [];
      }

      res[msg.author].push(msg);
      return res;
    }, {} as Record<string, WhatsappMessage[]>);

    this.charactersPerUser = Object.keys(this.messagesPerUser).reduce(
      (res, user) => {
        res[user] = this.messagesPerUser[user].reduce(
          (count, msg) => count + msg.message.length,
          0,
        );
        return res;
      },
      {} as Record<string, number>,
    );

    this.femkePerUser = Object.keys(this.messagesPerUser).reduce(
      (res, user) => {
        res[user] = this.messagesPerUser[user].reduce(
          (count, msg) => count + msg.message.replace(/[^A-Z]/g, '').length,
          0,
        );
        return res;
      },
      {} as Record<string, number>,
    );

    // Set users, we use the keys of wordsPerUser to sort them based on the amount of messages
    this.users = Object.keys(this.messagesPerUser).sort(
      (a, b) => this.messagesPerUser[b].length - this.messagesPerUser[a].length,
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
            result[word] = 0;
          }

          result[word] += 1;
          return result;
        }, {} as Record<string, number>);

        return res;
      },
      {} as Record<string, Record<string, number>>,
    );

    this.wordUsage = Object.keys(this.wordUsagePerUser).reduce((res, user) => {
      Object.keys(this.wordUsagePerUser[user]).forEach((word) => {
        if (!res[word]) {
          res[word] = 0;
        }

        res[word] += this.wordUsagePerUser[user][word];
      });

      return res;
    }, {} as Record<string, number>);

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

          result[word] += 1;
          return result;
        }, {} as Record<string, number>);

        return res;
      },
      {} as Record<string, Record<string, number>>,
    );

    this.emojiUsage = Object.keys(this.emojiUsagePerUser).reduce(
      (res, user) => {
        Object.keys(this.emojiUsagePerUser[user]).forEach((emoji) => {
          if (!res[emoji]) {
            res[emoji] = 0;
          }

          res[emoji] += this.emojiUsagePerUser[user][emoji];
        });

        return res;
      },
      {} as Record<string, number>,
    );

    this.totalWords = Object.keys(this.wordsPerUser).reduce(
      (res, user) => res + this.wordsPerUser[user].length,
      0,
    );

    this.totalEmojis = Object.keys(this.emojisPerUser).reduce(
      (res, user) => res + this.emojisPerUser[user].length,
      0,
    );

    // Set messages per hour
    this.messagesPerHourPerUser = hours.reduce((res, hour) => {
      res[hour] = this.users!.reduce(
        (result, user) => ({
          ...result,
          [user]: filtered.filter(
            (message) => message.date.hour() === hour && message.author === user,
          ).length,
        }),
        {},
      );

      return res;
    }, {} as Record<string, Record<string, number>>);

    // Set messages per hour
    this.messagesPerDayPerUser = weekdays.reduce((res, weekDay) => {
      res[weekDay] = this.users!.reduce(
        (result, user) => ({
          ...result,
          [user]: filtered.filter(
            (message) => message.date.weekday() === weekDay && message.author === user,
          ).length,
        }),
        {},
      );

      return res;
    }, {} as Record<string, Record<string, number>>);

    // Set messages per month, just use an empty array if there are no messages
    const dates = getMonthsBetween(
      this.firstMessage.date,
      this.lastMessage.date,
    );

    this.messagesPerMonthPerUser = dates.reduce((res, date) => {
      const dateFormat = date.format('MMM YYYY');

      res[dateFormat] = this.users.reduce(
        (list, user) => ({
          ...list,
          [user]: filtered.filter(
            (message) => message.date.month() === date.month()
              && message.date.year() === date.year()
              && message.author === user,
          ).length,
        }),
        {},
      );

      return res;
    }, {} as Record<string, Record<string, number>>);

    this.conversationNames = getConversationSubjects(this.systemMessages);
  }
}

export default WhatsappData;
