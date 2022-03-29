import * as React from 'react';
import 'chart.js/auto';
import './AnalysisResults.css';
import { Col, Row } from 'react-bootstrap';
import UserMessageCountDoughnut from './charts/UserMessageCountDoughnut';
import UserActivityGraph from './charts/UserMonthlyActivityGraph';
import UserMessageCountTable from './charts/UserMessageCountTable';
import UserHourlyActivityGraph from './charts/UserHourlyActivityGraph';
import { DefaultProps } from './charts/input-interface';
import UserWordUsageTable from './charts/UserWordUsageTable';
import UserEmojiUsageTable from './charts/UserEmojiUsageTable';
import SubjectTimelineBars from './charts/SubjectTimelineBars';
import DiagramHint from './DiagramHint';
import WordCloud from './charts/WordCloud';
import EmojiCloud from './charts/EmojiCloud';
import UserWeeklyActivityGraph from './charts/UserWeeklyActivityGraph';
import { colorIndex } from '../logic/chart-helpers';
import MinimalFrequencyTag from './charts/reusable/MinimalFrequencyTag';
import SectionTitle from './charts/reusable/SectionTitle';

function AnalysisResults({ data }: DefaultProps) {
  let conversationTimeline;

  if (data.conversationNames.length > 0) {
    conversationTimeline = (
      <>
        <SectionTitle
          title="Timelines related to group conversations"
          name="Group Timelines"
        />
        <Row>
          <Col className="chart-container">
            <h3 title="A timeline of the 'names' of the conversation, only works for English chats now">
              Group Subject Timeline
            </h3>
            <SubjectTimelineBars data={data} />
          </Col>
        </Row>
      </>
    );
  }

  // I want to filter on simple words, so I found 6 to be fair
  const minWordLength = 6;

  // This should ensure that the word cloud does not get too big but still appears
  // if there aren't that many words
  const minWordFrequency = Math.round(data.totalWords / 8000);

  // Fair number, we only want emojis that appear more frequent
  const minEmojiFrequency = 2;

  // A top-5 is nice, but I want to make it a slider or something
  const topUsageAmount = 5;

  return (
    <>
      <SectionTitle
        title="General conversation stats"
        name="Conversation Stats"
      />
      <Row>
        <Col className="header-container" md={12} lg={4}>
          <h3 title="All the users in this conversation">Users</h3>
          <div className="d-inline-flex flex-wrap justify-content-center">
            {data.users.map((name, index) => (
              <div
                key={name}
                style={{ color: colorIndex(index) }}
                className="fw-bold participant-pill"
              >
                {name}
              </div>
            ))}
          </div>
        </Col>
        <Col className="header-container" md={12} lg={4}>
          <h3 title="The total amount of messages in this conversation">
            Total Messages
          </h3>
          <div className="display-1 fw-bold">{data.totalMessages}</div>
        </Col>
        <Col className="header-container" md={12} lg={4}>
          <h3 title="The total amount of emojis in this conversation">
            Total Emojis
          </h3>
          <div className="display-1 fw-bold">{data.totalEmojis}</div>
        </Col>
      </Row>
      <Row>
        <Col className="header-container" md={12} lg={6}>
          <h3 title="The first message in this conversation">First Message</h3>
          <div className="fw-bold">{data.firstMessage.message}</div>
          <div className="text-muted">
            {data.firstMessage.author}
            ,
            {' '}
            {data.firstMessage.date.format('DD-MM-YYYY')}
          </div>
        </Col>
        <Col
          title="The last message in this conversation"
          className="header-container"
          md={12}
          lg={6}
        >
          <h3>Last Message</h3>
          <div className="fw-bold">{data.lastMessage.message}</div>
          <div className="text-muted">
            {data.lastMessage.author}
            ,
            {' '}
            {data.lastMessage.date.format('DD-MM-YYYY')}
          </div>
        </Col>
      </Row>
      <SectionTitle
        title="All data related to user activity"
        name="User Activity"
      />
      <Row>
        <Col className="chart-container" md={12} lg={6}>
          <h3 title="The percentage of messages a specific user has contributed to the conversation">
            Message Distribution
          </h3>
          <Row>
            <Col>
              <DiagramHint />
              <UserMessageCountDoughnut data={data} />
            </Col>
          </Row>
        </Col>
        <Col className="chart-container" md={12} lg={6}>
          <h3 title="The total amount of messages">Total Messages</h3>
          <UserMessageCountTable data={data} />
        </Col>
      </Row>
      <Row>
        <Col className="chart-container">
          <h3 title="The amount of messages per user per month">
            Monthly Activity
          </h3>
          <DiagramHint />
          <UserActivityGraph data={data} />
        </Col>
      </Row>
      <Row>
        <Col className="chart-container">
          <h3 title="The activity of a user on a particular week day, relative to their total activity">
            Relative Weekly Activity
          </h3>
          <DiagramHint />
          <UserWeeklyActivityGraph data={data} />
        </Col>
      </Row>
      <Row>
        <Col className="chart-container">
          <h3 title="The activity of a user on a particular hour, relative to their total activity">
            Relative Hourly Activity
          </h3>
          <DiagramHint />
          <UserHourlyActivityGraph data={data} />
        </Col>
      </Row>
      <SectionTitle
        title="All data related to the contents of a user's messages"
        name="Message Contents"
      />
      <Row>
        <Col className="chart-container">
          <h3
            title={`Most popular words, only words with at least 6 characters and a frequency higher than ${minWordFrequency}`}
          >
            Popular Words
          </h3>
          <MinimalFrequencyTag frequency={minWordFrequency} />
          <WordCloud
            minFrequency={minWordFrequency}
            minLength={minWordLength}
            minFontSize={14}
            maxFontSize={80}
            data={data}
          />
        </Col>
      </Row>
      <Row>
        <Col className="chart-container">
          <UserWordUsageTable
            data={data}
            displayAmount={topUsageAmount}
            minLength={minWordLength}
          />
        </Col>
      </Row>
      <Row>
        <Col className="chart-container">
          <h3
            title={`Most popular emojis, only emojis with a frequency higher than ${minEmojiFrequency}`}
          >
            Popular Emojis
          </h3>
          <MinimalFrequencyTag frequency={minEmojiFrequency} />
          <EmojiCloud
            minFrequency={minEmojiFrequency}
            minFontSize={24}
            maxFontSize={120}
            data={data}
          />
        </Col>
      </Row>
      <Row>
        <Col className="chart-container">
          <UserEmojiUsageTable
            data={data}
            displayAmount={topUsageAmount}
            minLength={1}
          />
        </Col>
      </Row>
      {conversationTimeline}
    </>
  );
}

export default AnalysisResults;
