import * as React from 'react';
import {
  Col, Collapse, Figure, Row,
} from 'react-bootstrap';
import './Header.css';
import { useState } from 'react';
import FigureCaption from 'react-bootstrap/FigureCaption';
import FigureImage from 'react-bootstrap/FigureImage';
import howto2 from '../assets/howto-2.jpeg';
import howto1 from '../assets/howto-1.jpeg';

function Header() {
  const [menuOpen, setMenuOpen] = useState({
    qa: false,
    howto: false,
    privacy: false,
  } as Record<string, boolean>);

  const toggleMenu = (menu: string) => setMenuOpen({ qa: false, howto: false, privacy: false, [menu]: !menuOpen[menu] });

  return (
    <div className="header-container">
      <Row>
        <Col>
          <header className="header">
            <h1 className="header-title">Whatsalyzer</h1>
          </header>
        </Col>
      </Row>
      <Row className="menu-container">
        <Col lg={4} md={12}>
          <button
            type="button"
            className="menu-button"
            onClick={() => toggleMenu('howto')}
          >
            Getting Started
          </button>
        </Col>
        <Col lg={4} md={12}>
          <button
            type="button"
            className="menu-button"
            onClick={() => toggleMenu('qa')}
          >
            Q&A
          </button>
        </Col>
        <Col lg={4} md={12}>
          <button
            type="button"
            className="menu-button"
            onClick={() => toggleMenu('privacy')}
          >
            Privacy
          </button>
        </Col>
      </Row>
      <Row className="info-container">
        <Col>
          <Collapse in={menuOpen.howto}>
            <div>
              <h2>How does it work?</h2>
              <ol>
                <li>Go to the Whatsapp chat you want to analyze</li>
                <li>Click on the menu button at the top-right</li>
                <li>Select &apos;More&apos;</li>
                <li>Click on &apos;Export chat&apos;</li>
                <li>Click &apos;Without media&apos;</li>
                <li>
                  Send the export to yourself by email or through Whatsapp
                </li>
              </ol>
              <p>Then select the file below to analyze the conversation.</p>
              <Row>
                <Col className="howto-image-container" xs={12} md={6}>
                  <Figure>
                    <FigureImage
                      className="howto-image"
                      src={howto1}
                      alt="Select 'More'"
                    />
                    <FigureCaption>Select &apos;More&apos;</FigureCaption>
                  </Figure>
                </Col>
                <Col className="howto-image-container" xs={12} md={6}>
                  <Figure>
                    <FigureImage
                      className="howto-image"
                      src={howto2}
                      alt="Click on 'Export chat'"
                    />
                    <FigureCaption>
                      Click on &apos;Export chat&apos;
                    </FigureCaption>
                  </Figure>
                </Col>
              </Row>
              <hr />
            </div>
          </Collapse>
          <Collapse in={menuOpen.qa}>
            <div>
              <h2>Questions and Answers</h2>
              <p>Q: Does Whatsalyzer save my data?</p>
              <p>
                A: No, Whatsalyzer is a fully client-side application. This
                means that your browser performs all the calculations and no
                data is ever uploaded to a server.
              </p>
              <p>Q: Can I analyze group chats?</p>
              <p>
                A: Yes! Those stats are even more interesting than
                &apos;normal&apos; chats.
              </p>
              <p>Q: Is Whatsalyzer open-source?</p>
              <p>
                A: Yes! You can view the code right here:
                <a
                  href="https://github.com/survivorbat/whatsalyzer"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/survivorbat/whatsalyzer
                </a>
              </p>
              <p>Q: Will new features be added?</p>
              <p>
                A: Yes! The TODO list can be found in the README of the source
                code, check the link above.
              </p>
              <hr />
            </div>
          </Collapse>
          <Collapse in={menuOpen.privacy}>
            <div>
              <h2>Privacy</h2>
              <p>
                Whatsalyzer does not collect any data from you. All the
                calculations are performed in your browser, so no data is ever
                uploaded to a server.
              </p>
              <hr />
            </div>
          </Collapse>
        </Col>
      </Row>
    </div>
  );
}

export default Header;
