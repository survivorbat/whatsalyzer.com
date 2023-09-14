import * as React from 'react';
import { Message } from 'whatsapp-chat-parser/dist/types';
import { useState } from 'react';
import {
  Col,
  Collapse,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from 'react-bootstrap';
import Select from 'react-select';
import WhatsappData from '../logic/whatsapp-data';
import './Filters.css';
import moment from 'moment';

interface FiltersProps {
  data: WhatsappData;
  handleFilterChange: (filter: (filter: Message) => boolean) => void;
}

function Filters({ data, handleFilterChange }: FiltersProps) {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(data.firstMessage.date);
  const [endDate, setEndDate] = useState(data.lastMessage.date);
  const [users, setUsers] = useState(data.users);
  const [searchString, setSearchString] = useState('');

  const handleChange = (event: any) => {
    switch (event.target.id) {
      case 'filter-start':
        setStartDate(moment(event.target.value));
        break;
      case 'filter-end':
        setEndDate(moment(event.target.value));
        break;
      case 'filter-users':
        setUsers(event.target.value.map((opt: any) => opt.value));
        break;
      case 'search-string':
        setSearchString(event.target.value);
        break;
    }

    handleFilterChange((message: Message): boolean => {
      if (message.date.getUTCDate() <= startDate.unix()) {
        return false;
      }

      if (message.date.getUTCDate() >= endDate.unix()) {
        return false;
      }

      if (!users.includes(message.author)) {
        return false;
      }

      return message.message.includes(searchString);
    });
  };

  return (
    <div className="filters-row">
      <Row>
        <Col
          lg={12}
          md={12}
          className="text-center"
          onClick={() => setOpen(!open)}
        >
          <h2 className="clickable">
            Filters{' '}
            {open ? (
              <span className="material-icons">keyboard_arrow_down</span>
            ) : (
              <span className="material-icons">keyboard_arrow_up</span>
            )}
          </h2>
        </Col>
      </Row>

      <Collapse in={open}>
        <Row>
          <Col>
            <FormGroup>
              <FormLabel htmlFor="filter-users">Users</FormLabel>
              <Select
                isSearchable
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    text: '#3599B8',
                    font: '#3599B8',
                    primary25: '#3599B8',
                    primary: '#3599B8',
                    neutral80: 'black',
                    neutral0: 'black',
                    color: 'black',
                  },
                })}
                value={data.users.map((user) => ({ label: user, value: user }))}
                options={data.users.map((user) => ({
                  label: user,
                  value: user,
                }))}
                onChange={(value) =>
                  handleChange({ target: { id: 'filter-users', value } })
                }
                isMulti
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <FormLabel htmlFor="filter-start">From</FormLabel>
              <FormControl
                id="filter-start"
                type="date"
                name="filter-start"
                aria-describedby="filter-start"
                value={startDate.format('YYYY-MM-DD')}
                min={data.firstMessage.date.format('YYYY-MM-DD')}
                max={data.lastMessage.date.format('YYYY-MM-DD')}
                className="text-light input-filter"
                onChange={handleChange}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <FormLabel htmlFor="filter-end">Until</FormLabel>
              <FormControl
                id="filter-end"
                type="date"
                name="filter-end"
                aria-describedby="filter-end"
                value={endDate.format('YYYY-MM-DD')}
                min={data.firstMessage.date.format('YYYY-MM-DD')}
                max={data.lastMessage.date.format('YYYY-MM-DD')}
                className="text-light input-filter"
                onChange={handleChange}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <FormLabel htmlFor="search-string">Search</FormLabel>
              <FormControl
                id="search-string"
                name="search-string"
                aria-describedby="search-string"
                className="text-light input-filter"
                onChange={handleChange}
              />
            </FormGroup>
          </Col>
        </Row>
      </Collapse>
    </div>
  );
}

export default Filters;
