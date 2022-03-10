import * as React from 'react';
import {
  Button,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Row,
} from 'react-bootstrap';
import { FormEvent, useState } from 'react';

import './InputForm.css';

const InputForm = ({ handleData }: { handleData: Function }) => {
  const [whatsappFile, setWhatsappFile] = useState({} as File);

  const handleChange = (files: FileList) => {
    setWhatsappFile(files[0]);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const reader = new FileReader();
    reader.onload = function (processEvent) {
      handleData(processEvent.target!.result);
    };

    reader.readAsText(whatsappFile);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col lg={6} md={12} className="input-column">
          <FormGroup>
            <FormLabel htmlFor="input-file">Whatsapp file</FormLabel>
            <FormControl
              id="input-file"
              type="file"
              aria-describedby="input-file-help"
              placeholder="The file to upload"
              className="text-light"
              required={true}
              onChange={(e: any) => handleChange(e.target!.files)}
            />
            <FormText id="input-file-help" muted>
              The file to analyze, export the Whatsapp chat you want to analyze
              and put file here.
            </FormText>
          </FormGroup>
        </Col>
        <Col lg={6} md={12} className="input-column">
          <Button type="submit" id="submit-button" value="Submit">
            Analyze this conversation!
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default InputForm;
