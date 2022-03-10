import * as React from 'react';
import 'chart.js/auto';
import './AnalysisResults.css';
import { Col, Row } from 'react-bootstrap';
import UserMessageCountDoughnut from './charts/UserMessageCountDoughnut';
import UserActivityGraph from './charts/UserActivityGraph';
import UserMessageCountTable from './charts/UserMessageCountTable';
import UserHourlyActivityGraph from './charts/UserHourlyActivityGraph';
import { InputData } from './charts/input-interface';
import UserWordCountDoughnut from './charts/UserWordCountDoughnut';
import UserWordCountTable from './charts/UserWordCountTable';
import UserWordUsageTable from './charts/UserWordUsageTable';
import UserEmojiCountTable from './charts/UserEmojiCountTable';
import UserEmojiUsageTable from './charts/UserEmojiUsageTable';
import UserEmojiCountDoughnut from './charts/UserEmojiCountDoughnut';
import UserTimelineBars from './charts/UserTimelineBars';
import SubjectTimelineBars from './charts/SubjectTimelineBars';

function AnalysisResults({ data }: InputData) {
  if (data.totalMessages === 0) {
    return <></>;
  }

  let conversationTimeline;

  if (data.conversationNames.length > 0) {
    conversationTimeline = <>
      <Row className="chart-title">
        <Col>
          <h3 className="section-title">Group Timelines</h3>
        </Col>
      </Row>
      <Row>
        <Col className="chart-container">
          <h3>Group Subject Timeline</h3>
          <SubjectTimelineBars data={data} />
        </Col>
      </Row>
      <Row>
        <Col className="chart-container">
          <h3>Users Timeline</h3>
          <UserTimelineBars data={data} />
        </Col>
      </Row>
    </>
  }

  return (
    <>
      <Row className="chart-title">
        <Col>
          <h2 className="section-title">Conversation Stats</h2>
        </Col>
      </Row>
      <Row>
        <Col className="header-container" md={12} lg={4}>
          <h3>Users</h3>
          <div className="d-inline-flex flex-wrap justify-content-center">
            {data.users.map((name) => (
              <div key={name} className="participant-pill rounded-pill">
                {name}
              </div>
            ))}
          </div>
        </Col>
        <Col className="header-container" md={12} lg={4}>
          <h3>Total Messages</h3>
          <div className="display-1 fw-bold">{data.totalMessages}</div>
        </Col>
        <Col className="header-container" md={12} lg={4}>
          <h3>Total Words</h3>
          <div className="display-1 fw-bold">{data.totalWords}</div>
        </Col>
      </Row>
      <Row>
        <Col className="header-container" md={12} lg={4}>
          <h3>Total Emojis</h3>
          <div className="display-1 fw-bold">{data.totalEmojis}</div>
        </Col>
        <Col className="header-container" md={12} lg={4}>
          <h3>Total Characters</h3>
          <div className="display-1 fw-bold">{data.totalMessageLength}</div>
        </Col>
        <Col className="header-container" md={12} lg={4}>
          <h3>Total System Messages</h3>
          <div className="display-1 fw-bold">{data.systemMessages.length}</div>
        </Col>
      </Row>
      <Row className="chart-title">
        <Col>
          <h3 className="section-title">User Activity</h3>
        </Col>
      </Row>
      <Row>
        <Col className="chart-container" md={12} lg={6}>
          <h3>Message Distribution</h3>
          <Row>
            <Col>
              <UserMessageCountDoughnut data={data} />
            </Col>
          </Row>
        </Col>
        <Col className="chart-container" md={12} lg={6}>
          <h3>Total Messages</h3>
          <UserMessageCountTable data={data} />
        </Col>
      </Row>
      <Row>
        <Col className="chart-container">
          <h3>Monthly Activity</h3>
          <UserActivityGraph data={data} />
        </Col>
      </Row>
      <Row>
        <Col className="chart-container">
          <h3>Relative Hourly Activity</h3>
          <UserHourlyActivityGraph data={data} />
        </Col>
      </Row>
      <Row className="chart-title">
        <Col>
          <h2 className="section-title">Message Contents</h2>
        </Col>
      </Row>
      <Row>
        <Col className="chart-container" md={12} lg={6}>
          <h3>Total Words</h3>
          <Row>
            <Col>
              <UserWordCountDoughnut data={data} />
            </Col>
          </Row>
          <Row>
            <Col>
              <UserWordCountTable data={data} />
            </Col>
          </Row>
        </Col>
        <Col className="chart-container" md={12} lg={6}>
          <h3>Popular Words</h3>
          <UserWordUsageTable data={data} />
        </Col>
      </Row>
      <Row>
        <Col className="chart-container" md={12} lg={6}>
          <h3>Total Emojis</h3>
          <Row>
            <Col>
              <UserEmojiCountDoughnut data={data} />
            </Col>
          </Row>
          <Row>
            <Col>
              <UserEmojiCountTable data={data} />
            </Col>
          </Row>
        </Col>
        <Col className="chart-container" md={12} lg={6}>
          <h3>Popular Emojis</h3>
          <UserEmojiUsageTable data={data} />
        </Col>
      </Row>
      {conversationTimeline}
    </>
  );
}

export default AnalysisResults;
