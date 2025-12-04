import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import LiveStatusBar from '../components/LiveStatusBar';
import TimingsSection from '../components/TimingsSection';
import GamesSection from '../components/GamesSection';
import MenuSection from '../components/MenuSection';
import PartyPackages from '../components/PartyPackages';
import Footer from '../components/Footer';

const MainPage = () => {
  return (
    <div className="main-page">
      <Navbar />
      <main style={{ paddingTop: '120px' }}>
        <section id="home" aria-label="Hero section">
          <HeroSection />
        </section>
        <LiveStatusBar />
        <section id="timings-section" aria-label="Opening hours and timings">
          <TimingsSection />
        </section>
        <section id="games-section" aria-label="Games and entertainment">
          <GamesSection />
        </section>
        <section id="menu-section" aria-label="Menu and food options">
          <MenuSection />
        </section>
        <section id="party-packages" aria-label="Party packages and deals">
          <PartyPackages />
        </section>
        <section id="contact-section" aria-label="Contact information and social links">
          <Footer />
        </section>
      </main>
    </div>
  );
};

export default MainPage; 