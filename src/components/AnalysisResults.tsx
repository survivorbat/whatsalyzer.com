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

function AnalysisResults({ data }: InputData) {
  if (data.totalMessages === 0) {
    return <></>;
  }

  return (
    <>
      <Row>
        <Col className="header-container">
          <h2>Users</h2>
          <div className="d-inline-flex flex-wrap justify-content-center">
            {data.participants.map((name) => (
              <div key={name} className="participant-pill rounded-pill">
                {name}
              </div>
            ))}
          </div>
        </Col>
        <Col className="header-container">
          <h2>Total Messages</h2>
          <div className="display-1 fw-bold">{data.totalMessages}</div>
        </Col>
        <Col className="header-container">
          <h2>Total words</h2>
          <div className="display-1 fw-bold">{data.totalWords}</div>
        </Col>
      </Row>
      <Row className="chart-title">
        <Col>
          <h2>User Activity</h2>
        </Col>
      </Row>
      <Row>
        <Col className="chart-container" xs={6}>
          <h3>Message Distribution</h3>
          <Row>
            <Col>
              <UserMessageCountDoughnut data={data} />
            </Col>
          </Row>
        </Col>
        <Col className="chart-container" xs={6}>
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
          <h2>Message Contents</h2>
        </Col>
      </Row>
      <Row className="justify-content-around">
        <Col className="chart-container" xs={6}>
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
        <Col className="chart-container" xs={6}>
          <h3>Popular words</h3>
          <UserWordUsageTable data={data} />
        </Col>
      </Row>
    </>
  );
}

export default AnalysisResults;
