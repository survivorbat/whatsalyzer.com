import * as React from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import { parseStringSync } from 'whatsapp-chat-parser';
import { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import AnalysisResults from './components/AnalysisResults';
import WhatsappData from './logic/whatsapp-data';

const App = () => {
  const [whatsappData, setWhatsappData] = useState(
    (): WhatsappData | null => null
  );

  const handleNewData = (data: string) => {
    const result = parseStringSync(data);

    if (result.length > 0) {
      const whatsapp = new WhatsappData(result);
      setWhatsappData(whatsapp);
    }
  };

  let analysisResult;
  if (whatsappData) {
    analysisResult = <AnalysisResults data={whatsappData!} />;
  }

  return (
    <Container className="text-light main-container">
      <Header />
      <InputForm handleData={handleNewData} />
      {analysisResult}
    </Container>
  );
};

export default App;
