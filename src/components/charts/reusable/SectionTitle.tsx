import { Col, Row } from 'react-bootstrap';
import * as React from 'react';

interface SectionTitleProps {
  title: string;
  name: string;
}

function SectionTitle({ name, title }: SectionTitleProps) {
  return (
    <Row className="chart-title">
      <Col>
        <h2 className="section-title" title={title}>
          {name}
        </h2>
      </Col>
    </Row>
  );
}

export default SectionTitle;
