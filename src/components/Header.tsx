import * as React from 'react';
import { Button, Col, Collapse, Row } from 'react-bootstrap';
import './Header.css';
import { useState } from 'react';

function Header() {
  const [menuOpen, setMenuOpen] = useState({qa: false, howto: false} as Record<string, boolean>);

  const toggleMenu = (menu: string) => {
    setMenuOpen({...menuOpen, [menu]: !menuOpen[menu]})
  }

  return (
    <>
      <Row>
        <Col>
          <header className="header">
            <h1 className="header-title">Whatsalyzer</h1>
          </header>
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={12}>
          <button className="menu-button" onClick={() => toggleMenu('howto')}>Get Started</button>
        </Col>
        <Col lg={6} md={12}>
          <button className="menu-button" onClick={() => toggleMenu('qa')}>Q&A</button>
        </Col>
      </Row>
      <Row className="info-container">
        <Col>
          <Collapse in={menuOpen.qa}>
            <div>qa</div>
          </Collapse>
          <Collapse in={menuOpen.howto}>
            <div>howto</div>
          </Collapse>
        </Col>
      </Row>
    </>
  );
}

export default Header;
