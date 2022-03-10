import { Message } from 'whatsapp-chat-parser/types/types';
import moment from 'moment';
import { Simulate } from 'react-dom/test-utils';

const hours = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
];

/**
 * Get all the months date A and date B
 * @param a The starting date
 * @param b The ending date
 */
export const getMonthsBetween = (a: Date, b: Date): moment.Moment[] => {
  const firstDate = moment(a);
  const lastDate = moment(b);

  const dates = [];

  while (lastDate.unix() >= firstDate.unix()) {
    dates.push(moment(firstDate));
    firstDate.add(1, 'month');
  }

  return dates;
};

export interface ConversationName {
  name: string
  user: string
  startDate: moment.Moment
  endDate: moment.Moment
}

export const getConversationSubjects = (systemMessages: Message[]): ConversationName[] => {
  return systemMessages.reduce((prev, cur) => {
    const createMatch = cur.message.match(/^(.*) created group "(.+)"/);
    const renameMatch = cur.message.match(/^(.*) changed the subject from "(.+)" to "(.+)"/);

    // If we find the create message, we add it as the first item in the list with an unspecified end date
    if (createMatch) {
      prev.push({name: createMatch[2], user: createMatch[1], startDate: moment(cur.date), endDate: moment()});
    }

    // If we find a rename message, we...
    if (renameMatch) {
      // First check if a message came before it, because if it does, that message now gets an
      // end date
      if (prev.length > 0) {
        prev[prev.length - 1].endDate = moment(cur.date);
      }

      // Then we add the new item with an unspecified end date
      prev.push({name: renameMatch[3], user: renameMatch[1], startDate: moment(cur.date), endDate: moment()});
    }

    return prev;
  }, [] as ConversationName[])
}

export interface UserTimeline {
  joinDate: moment.Moment
  leaveDate: moment.Moment
}

export const getUserTimelines = (systemMessages: Message[], users: string[], firstDate: Date): Record<string, UserTimeline[]> => {
  const result = systemMessages.reduce((prev, cur) => {
    const addMatch = cur.message.match(/^.* added (.+)/);
    const removeMatch = cur.message.match(/^.* removed (.+)/);

    if (addMatch) {
      const userName = addMatch[1];

      if (!prev[userName]) {
        prev[userName] = []
      }

      prev[userName].push({joinDate: moment(cur.date), leaveDate: moment()});
    }

    if (removeMatch) {
      const userName = removeMatch[1];

      if (!prev[userName]) {
        prev[userName] = []
      }

      if (prev[userName].length > 0) {
        prev[userName][prev[userName].length-1].leaveDate = moment(cur.date);
      } else {
        prev[userName].push({joinDate: moment(firstDate), leaveDate: moment(cur.date)});
      }
    }

    return prev;
  }, {} as Record<string, UserTimeline[]>)

  users.forEach((user) => {
    if (!result[user]) {
      result[user] = [{joinDate: moment(firstDate), leaveDate: moment()}];
    }
  });

  return result;
}

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

class WhatsappData {
  readonly totalMessages: number;
  readonly totalMessageLength: number;
  readonly totalWords: number;
  readonly totalEmojis: number;

  readonly users: string[];
  readonly userTimelines: Record<string, UserTimeline[]>;
  readonly conversationNames: ConversationName[];

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
    this.firstMessage = sortedByDate[0] || undefined;
    this.lastMessage = sortedByDate[sortedByDate.length - 1] || undefined;

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

    this.conversationNames = getConversationSubjects(this.systemMessages);
    this.userTimelines = getUserTimelines(this.systemMessages, this.users, (this.firstMessage || {}).date);
  }
}

export default WhatsappData;
