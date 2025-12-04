import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import MainPage from './pages/MainPage';
import BookingPage from './pages/BookingPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </Router>
      <Analytics />
    </HelmetProvider>
  </React.StrictMode>
);
