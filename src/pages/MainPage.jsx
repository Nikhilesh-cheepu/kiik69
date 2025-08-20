import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import LiveStatusBar from '../components/LiveStatusBar';
import TimingsSection from '../components/TimingsSection';
import GamesSection from '../components/GamesSection';
import MenuSection from '../components/MenuSection';
import PartyPackages from '../components/PartyPackages';
import VibesSection from '../components/VibesSection';
import CustomerReviews from '../components/CustomerReviews';
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
        <section id="whats-inside" aria-label="What's Inside KIIK69">
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
            }}>What's Inside KIIK69</h2>
            <div style={{
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#ffffff' }}>🎮 Multiple Gaming Zones with Pool Tables, Carroms, Foosball</p>
              <p style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#ffffff' }}>🍽️ Premium Food & Beverages</p>
              <p style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#ffffff' }}>📺 Multiple LED Screens for Sports & Entertainment</p>
              <p style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#ffffff' }}>🎉 Party Packages for Groups & Celebrations</p>
              <p style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#ffffff' }}>✨ Modern Ambience with LED Lighting</p>
            </div>

          </div>
        </section>
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

        <section id="vibes" aria-label="Events and gallery">
          <VibesSection />
        </section>
        <section id="reviews" aria-label="Customer reviews and testimonials">
          <CustomerReviews />
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
            <div style={{
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#ffffff' }}>Dress Code: Casual/Smart Casual</p>
              <p style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#ffffff' }}>Age Restriction: Alcohol only for 21+</p>
              <p style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#ffffff' }}>Minimum Booking: 25 Pax</p>
              <p style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#ffffff' }}>Advance Payment: 50% required</p>
            </div>
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
            <div style={{
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#ffffff' }}>Ready to celebrate? Book your party package now!</p>
              <p style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#ffffff' }}>Call us: +91 1234567890</p>
              <p style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#ffffff' }}>WhatsApp: +91 1234567890</p>
            </div>
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