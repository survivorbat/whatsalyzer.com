import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import './Header.css';

function Header() {
  return (
    <Row>
      <Col>
        <header className="header">
          <h1 className="header-title">Whatsalyzer</h1>
        </header>
      </Col>
    </Row>
  );
}

export default Header;
