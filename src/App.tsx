import * as React from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import { parseStringSync } from 'whatsapp-chat-parser';
import { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import Footer from './components/Footer';
import AnalysisResults from './components/AnalysisResults';
import WhatsappData from './logic/whatsapp-data';

function App() {
  const [whatsappData, setWhatsappData] = useState(() => {
    const savedData = localStorage.getItem('saved-data');
    const initialData = savedData ? parseStringSync(savedData) : [];

    return new WhatsappData(initialData);
  });

  const handleNewData = (data: string) => {
    const result = parseStringSync(data);
    const whatsapp = new WhatsappData(result);

    setWhatsappData(whatsapp);
    localStorage.setItem('saved-data', data);
  };

  return (
    <Container className="text-light main-container">
      <Header />
      <InputForm handleData={handleNewData} />
      <AnalysisResults data={whatsappData} />
      <Footer />
    </Container>
  );
}

export default App;
