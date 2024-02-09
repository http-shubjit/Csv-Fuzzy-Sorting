import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CsvDataDisplay from '../src/components/CsvDataDisplay';
import DetailsPage from '../src/components/DetailsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CsvDataDisplay />} />
        <Route path="/details/:symbol" element={<DetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
