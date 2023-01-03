import * as React from 'react';
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormText,
  Modal,
} from 'react-bootstrap';
import { FormEvent, useState } from 'react';
import './InputForm.css';

interface InputFormProps {
  handleData: (data: string | ArrayBuffer | null) => void;
}

function InputForm({ handleData }: InputFormProps) {
  const [whatsappFile, setWhatsappFile] = useState({} as File);
  const [inputOpen, setInputOpen] = useState(false);

  const handleChange = (files: FileList) => setWhatsappFile(files[0]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const reader = new FileReader();
    reader.onload = (processEvent) => handleData(processEvent.target!.result);
    reader.readAsText(whatsappFile);

    setInputOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="menu-button start-button"
        onClick={() => setInputOpen(true)}
      >
        Start
      </button>
      <Modal show={inputOpen} onHide={() => setInputOpen(false)}>
        <Modal.Header
          className="input-modal-header text-center"
          closeVariant="white"
          closeButton
        >
          Get Whatsalyzing
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <FormGroup>
              <FormControl
                type="file"
                aria-describedby="input-file-help"
                placeholder="The file to upload"
                required
                onChange={(e: any) => handleChange(e.target!.files)}
                accept=".txt"
              />
              <FormText id="input-file-help" muted>
                The file to analyze, check &apos;Getting Started&apos; to learn
                more.
              </FormText>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="light" value="Submit">
              Analyze
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default InputForm;
