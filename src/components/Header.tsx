import * as React from 'react';
import { Col, Collapse, Figure, Modal, Row } from 'react-bootstrap';
import './Header.css';
import { useState } from 'react';
import FigureCaption from 'react-bootstrap/FigureCaption';
import FigureImage from 'react-bootstrap/FigureImage';
import howto3 from '../assets/howto-3.png';
import howto2 from '../assets/howto-2.png';
import howto1 from '../assets/howto-1.png';
import howto0 from '../assets/howto-0.png';
import InputForm from './InputForm';

interface HeaderProps {
  handleData: (data: string | ArrayBuffer | null) => void;
}

function Header({ handleData }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState({
    qa: false,
    howto: false,
  } as Record<string, boolean>);

  const toggleMenu = (menu: string) =>
    setMenuOpen({
      qa: false,
      howto: false,
      [menu]: !menuOpen[menu],
    });

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
            How does it work?
          </button>
        </Col>
        <Col lg={4} md={12}>
          <InputForm handleData={handleData} />
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
      </Row>
      <Row className="info-container">
        <Col>
          <Modal
            onBackdropClick={() => toggleMenu('howto')}
            size="lg"
            onHide={() => toggleMenu('howto')}
            show={menuOpen.howto}
          >
            <Modal.Header
              className="input-modal-header text-center"
              closeVariant="white"
              closeButton
            >
              How does it work?
            </Modal.Header>
            <Modal.Body className="Body">
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
                <Col className="howto-image-container" xs={12} md={3}>
                  <Figure>
                    <FigureImage
                      className="howto-image"
                      src={howto0}
                      alt="Open the menu"
                    />
                    <FigureCaption>
                      2. Open options at the top-right
                    </FigureCaption>
                  </Figure>
                </Col>
                <Col className="howto-image-container" xs={12} md={3}>
                  <Figure>
                    <FigureImage
                      className="howto-image"
                      src={howto1}
                      alt="Select 'More'"
                    />
                    <FigureCaption>3. Select &apos;More&apos;</FigureCaption>
                  </Figure>
                </Col>
                <Col className="howto-image-container" xs={12} md={3}>
                  <Figure>
                    <FigureImage
                      className="howto-image"
                      src={howto2}
                      alt="Click on 'Export chat'"
                    />
                    <FigureCaption>
                      4. Click on &apos;Export chat&apos;
                    </FigureCaption>
                  </Figure>
                </Col>
                <Col className="howto-image-container" xs={12} md={3}>
                  <Figure>
                    <FigureImage
                      className="howto-image"
                      src={howto3}
                      alt="Select 'Without media'"
                    />
                    <FigureCaption>
                      5. Select &apos;Without media&apos;
                    </FigureCaption>
                  </Figure>
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
          <Modal
            onBackdropClick={() => toggleMenu('qa')}
            onHide={() => toggleMenu('qa')}
            show={menuOpen.qa}
          >
            <Modal.Header
              className="input-modal-header text-center"
              closeVariant="white"
              closeButton
            >
              Questions and Answers
            </Modal.Header>
            <Modal.Body>
              <p>
                <strong>Does Whatsalyzer save my data?</strong>
              </p>
              <p>
                No, Whatsalyzer is a fully client-side application. This means
                that your browser performs all the calculations and no data is
                ever uploaded to a server. Check the source code if you want to
                know more.
              </p>
              <p>
                <strong>Can I analyze group chats?</strong>
              </p>
              <p>
                Yes! Those stats are even more interesting than
                &apos;normal&apos; chats.
              </p>
              <p>
                <strong>Is Whatsalyzer open-source?</strong>
              </p>
              <p>
                Yes! You can view the code right here:{' '}
                <a
                  href="https://github.com/survivorbat/whatsalyzer"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/survivorbat/whatsalyzer
                </a>
              </p>
              <p>
                <strong>Will new features be added?</strong>
              </p>
              <p>
                Yes! The TODO list can be found in the README of the source
                code, check the link above.
              </p>
            </Modal.Body>
          </Modal>
        </Col>
      </Row>
    </div>
  );
}

export default Header;
