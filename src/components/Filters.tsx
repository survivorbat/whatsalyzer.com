import * as React from 'react';
import { Message } from 'whatsapp-chat-parser/types/types';
import { ChangeEvent, FormEvent, useState } from 'react';
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
import WhatsappData from '../logic/whatsapp-data';
import './Filters.css';

interface FiltersProps {
  data: WhatsappData;
  handleFilterChange: (filter: (filter: Message) => boolean) => void;
}

function Filters({ data, handleFilterChange }: FiltersProps) {
  const [startDate, setStartDate] = useState(data.firstMessage.date);
  const [endDate, setEndDate] = useState(data.lastMessage.date);
  const [searchString, setSearchString] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const filter = (message: Message): boolean => {
      if (message.date.getUTCDate() <= startDate.unix()) {
        return false;
      }

      if (message.date.getUTCDate() >= endDate.unix()) {
        return false;
      }

      return message.message.includes(searchString);
    };

    handleFilterChange(filter);
  };

  const handleChange = (event: any) => {
    switch (event.target.id) {
      case 'start-date':
        setStartDate(event.target.value);
        break;
      case 'end-date':
        setEndDate(event.target.value);
        break;
      case 'search-string':
        setSearchString(event.target.value);
        break;
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="filters-row justify-content-around">
        <Col lg={12} md={12} className="text-center">
          <h2>Filters</h2>
        </Col>
        <Col lg={2} md={12} className="input-column">
          <FormGroup>
            <FormLabel htmlFor="filter-start">From</FormLabel>
            <FormControl
              id="filter-start"
              type="date"
              name="filter-start"
              aria-describedby="filter-start"
              min={data.firstMessage.date.format('YYYY-MM-DD')}
              max={data.lastMessage.date.format('YYYY-MM-DD')}
              className="text-light input-filter"
              onChange={(e: any) => handleChange}
            />
          </FormGroup>
        </Col>
        <Col lg={2} md={12} className="input-column">
          <FormGroup>
            <FormLabel htmlFor="filter-end">Until</FormLabel>
            <FormControl
              id="filter-end"
              type="date"
              name="filter-end"
              aria-describedby="filter-end"
              min={data.firstMessage.date.format('YYYY-MM-DD')}
              max={data.lastMessage.date.format('YYYY-MM-DD')}
              className="text-light input-filter"
              onChange={(e: any) => handleChange}
            />
          </FormGroup>
        </Col>
        <Col lg={2} md={12} className="input-column">
          <Button type="submit" id="submit-button" value="Submit">
            Filter
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default Filters;
