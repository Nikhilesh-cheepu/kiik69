import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import MainPage from './pages/MainPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </Router>
    </HelmetProvider>
  </React.StrictMode>
);
