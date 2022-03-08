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

function InputForm({ handleData }: { handleData: Function }) {
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
    <Row>
      <Col>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="inputFile">Whatsapp file</FormLabel>
            <FormControl
              id="inputFile"
              type="file"
              aria-describedby="inputFileHelp"
              placeholder="The file to upload"
              className="bg-dark text-light"
              onChange={(e: any) => handleChange(e.target!.files)}
            />
            <FormText id="inputFileHelp" muted>
              The file to analyze and generate a report from
            </FormText>
          </FormGroup>
          <Button type="submit" className="btn-dark" value="Submit">
            Submit
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

export default InputForm;
