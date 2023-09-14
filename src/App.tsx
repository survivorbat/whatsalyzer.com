import * as React from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import { parseStringSync } from 'whatsapp-chat-parser';
import { useState } from 'react';
import Header from './components/Header';
import AnalysisResults from './components/AnalysisResults';
import WhatsappData from './logic/whatsapp-data';
import dummyData from "./constants/dummy";
import {Message} from "whatsapp-chat-parser/dist/types";

function App() {
  const [whatsappData, setWhatsappData] = useState(
    new WhatsappData(dummyData)
  );
  const [filteredData, setFilteredData] = useState(
    new WhatsappData(dummyData)
  );

  const handleNewData = (data: string | ArrayBuffer | null) => {
    const result = parseStringSync(data as string);

    if (result.length > 0) {
      const whatsapp = new WhatsappData(result);
      setWhatsappData(whatsapp);
      setFilteredData(whatsapp);
    }
  };

  const handleFilterChange = (filter: (filter: Message) => boolean) => {
    const data = whatsappData.messages.filter(filter);
    setFilteredData(new WhatsappData(data));
  };

  // Only add analysis results if we have data
  const analysisResult = filteredData.users.length > 0 ? (
    <>
      {/*TODO: Re-enable filters*/}
      {/*<Filters data={whatsappData} handleFilterChange={handleFilterChange} />*/}
      <AnalysisResults data={filteredData!} />
    </>
  ) : null;

  return (
    <Container className="text-light main-container">
      <Header handleData={handleNewData} />
      {analysisResult}
    </Container>
  );
}

export default App;
