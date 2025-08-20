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
      <main>
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



        <section id="policies-section" aria-label="About KIIK69">
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '4rem 1rem'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontFamily: 'Bebas Neue, Arial Black, sans-serif',
              textAlign: 'center',
              marginBottom: '2rem',
              color: '#ffffff'
            }}>Policies & Rules</h2>
          </div>
        </section>
        <section id="booking-section" aria-label="Booking and reservations">
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '4rem 1rem'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontFamily: 'Bebas Neue, Arial Black, sans-serif',
              textAlign: 'center',
              marginBottom: '2rem',
              color: '#ffffff'
            }}>Book Your Party</h2>
          </div>
        </section>
        <section id="contact-section" aria-label="Contact information and social links">
          <Footer />
        </section>
      </main>

    </div>
  );
};

export default MainPage; 