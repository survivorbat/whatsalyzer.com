import * as React from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import { parseStringSync } from 'whatsapp-chat-parser';
import { useState } from 'react';
import { Message } from 'whatsapp-chat-parser/types/types';
import Header from './components/Header';
import InputForm from './components/InputForm';
import AnalysisResults from './components/AnalysisResults';
import WhatsappData from './logic/whatsapp-data';
import Filters from './components/Filters';

function App() {
  const [whatsappData, setWhatsappData] = useState(
    (): WhatsappData | null => null,
  );
  const [filteredData, setFilteredData] = useState(
    (): WhatsappData | null => null,
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
    const data = whatsappData!.messages.filter(filter);
    setFilteredData(new WhatsappData(data));
  };

  // Only add analysis results if we have data
  const analysisResult = filteredData ? (
    <>
      <Filters data={whatsappData!} handleFilterChange={handleFilterChange} />
      <AnalysisResults data={filteredData!} />
    </>
  ) : null;

  return (
    <Container className="text-light main-container">
      <Header />
      <InputForm handleData={handleNewData} />
      {analysisResult}
    </Container>
  );
}

export default App;
