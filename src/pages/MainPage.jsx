import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import LiveStatusBar from '../components/LiveStatusBar';
import WhatsInsideSection from '../components/WhatsInsideSection';
import MenuSection from '../components/MenuSection';
import PartyPackagesSection from '../components/PartyPackagesSection';
import VibesSection from '../components/VibesSection';
import CustomerReviews from '../components/CustomerReviews';
import Footer from '../components/Footer';
import MusicPlayer from '../components/MusicPlayer';

const MainPage = () => {
  return (
    <div className="main-page">
      <Navbar />
      <main>
        <section id="home" aria-label="Hero section">
          <HeroSection />
        </section>
        <LiveStatusBar />
        <section id="whats-inside" aria-label="What's inside KIIK69">
          <WhatsInsideSection />
        </section>
        <section id="menu" aria-label="Menu and food options">
          <MenuSection />
        </section>
        <section id="packages" aria-label="Party packages and deals">
          <PartyPackagesSection />
        </section>
        <section id="vibes" aria-label="Events and gallery">
          <VibesSection />
        </section>
        <section id="reviews" aria-label="Customer reviews and testimonials">
          <CustomerReviews />
        </section>
        <section id="about" aria-label="About KIIK69">
          {/* About section content will be added */}
        </section>
        <section id="contact" aria-label="Contact information and social links">
          <Footer />
        </section>
      </main>
      <MusicPlayer />
    </div>
  );
};

export default MainPage; 