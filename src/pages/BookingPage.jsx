import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaPhone, FaCalendarAlt, FaClock, FaWhatsapp, FaInstagram, FaTimes, FaChevronDown, FaSun, FaMoon, FaArrowLeft } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Calendar from '../components/Calendar';

const BookingPage = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Time selection, 2: Contact info, 3: Summary
  const [guests, setGuests] = useState(2);
  const [selectedDate, setSelectedDate] = useState('');
  const [mealType, setMealType] = useState('lunch'); // 'lunch' or 'dinner'
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedOffer, setSelectedOffer] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedMenuImage, setSelectedMenuImage] = useState('');
  const [isMenuImageModalOpen, setIsMenuImageModalOpen] = useState(false);
  const [is128Menu, setIs128Menu] = useState(false);
  const [current128Page, setCurrent128Page] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Initialize date to today
  useEffect(() => {
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showGuestDropdown || showDateDropdown) {
        const target = event.target;
        if (!target.closest('[data-dropdown]')) {
          setShowGuestDropdown(false);
          setShowDateDropdown(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showGuestDropdown, showDateDropdown]);

  // Generate time slots (15-minute intervals)
  const generateTimeSlots = (type) => {
    const slots = [];
    if (type === 'lunch') {
      // Lunch: 12:00 PM to 6:30 PM
      for (let hour = 12; hour <= 18; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          if (hour === 18 && minute > 30) break;
          const displayHour = hour === 12 ? 12 : hour - 12;
          const period = hour < 12 ? 'AM' : 'PM';
          const minuteStr = minute.toString().padStart(2, '0');
          slots.push({
            value: `${hour.toString().padStart(2, '0')}:${minuteStr}`,
            label: `${displayHour}:${minuteStr} ${period}`,
            available: true
          });
        }
      }
    } else {
      // Dinner: 7:00 PM to 12:00 AM
      for (let hour = 19; hour <= 23; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const displayHour = hour - 12;
          const minuteStr = minute.toString().padStart(2, '0');
          slots.push({
            value: `${hour.toString().padStart(2, '0')}:${minuteStr}`,
            label: `${displayHour}:${minuteStr} PM`,
            available: true
          });
        }
      }
      // Add 12:00 AM
      slots.push({
        value: '00:00',
        label: '12:00 AM',
        available: true
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots(mealType);

  // Get available offers based on meal type
  const getAvailableOffers = () => {
    if (mealType === 'dinner') {
      return [
        {
          id: 'liquor-10',
          title: 'Flat 10% Off on Liquor',
          description: 'Get 10% discount on all liquor items',
          type: 'liquor'
        }
      ];
    } else {
      return [
        {
          id: 'eat-drink-128',
          title: 'Eat & Drink Anything @128',
          description: 'Special lunch offer - eat and drink anything for ₹128',
          type: '128'
        }
      ];
    }
  };

  const availableOffers = getAvailableOffers();

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Select Date';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.getDate()} ${date.toLocaleDateString('en-IN', { month: 'short' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.getDate()} ${date.toLocaleDateString('en-IN', { month: 'short' })}`;
    } else {
      return `${date.toLocaleDateString('en-IN', { weekday: 'short' })}, ${date.getDate()} ${date.toLocaleDateString('en-IN', { month: 'short' })}`;
    }
  };

  // Handle time slot selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setSelectedOffer(''); // Reset offer when time changes
  };

  // Handle proceed to next step
  const handleProceed = () => {
    if (currentStep === 1) {
      if (!selectedTime) {
        setErrors({ time: 'Please select a time slot' });
        return;
      }
      if (!selectedOffer) {
        setErrors({ offer: 'Please select an offer' });
        return;
      }
      setErrors({});
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!name.trim()) {
        setErrors({ name: 'Name is required' });
        return;
      }
      if (!mobile.trim()) {
        setErrors({ mobile: 'Mobile number is required' });
        return;
      } else if (!/^[6-9]\d{9}$/.test(mobile.replace(/\s/g, ''))) {
        setErrors({ mobile: 'Please enter a valid 10-digit mobile number' });
        return;
      }
      setErrors({});
      setCurrentStep(3);
    }
  };

  // Generate WhatsApp message
  const generateWhatsAppMessage = () => {
    const formattedDate = new Date(selectedDate).toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const formattedTime = new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const offerText = selectedOffer === 'liquor-10' 
      ? '10% Off on Liquor'
      : 'Eat & Drink Anything @128';

    const message = `Hi! I would like to book a table at KIIK 69.

BOOKING DETAILS

Name: ${name}
Mobile: ${mobile}
Guests: ${guests}
Date: ${formattedDate}
Time: ${formattedTime} (${mealType === 'lunch' ? 'Lunch' : 'Dinner'})
Offer: ${offerText}

Please confirm my table reservation. Thank you!`;

    return encodeURIComponent(message);
  };

  // Handle final booking
  const handleBookNow = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/917013884485?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Guest options (up to 300)
  const guestOptions = Array.from({ length: 300 }, (_, i) => i + 1);

  // Generate date options
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: formatDate(date.toISOString().split('T')[0]),
        date: date
      });
    }
    
    return dates;
  };

  const dateOptions = generateDateOptions();

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .booking-container {
            max-width: 800px !important;
            padding: 2rem !important;
          }
          .booking-time-grid {
            grid-template-columns: repeat(6, 1fr) !important;
          }
        }
        @media (min-width: 1024px) {
          .booking-time-grid {
            grid-template-columns: repeat(8, 1fr) !important;
          }
        }
      `}</style>
      <div className="booking-page" style={{ minHeight: '100vh', background: '#000000' }}>
        <Navbar />
        <main style={{ 
          paddingTop: 'clamp(140px, 10vw, 160px)', 
          minHeight: 'calc(100vh - 140px)',
          background: '#000000',
          paddingBottom: '2rem'
        }}>
        {/* Step 1: Time Selection */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="booking-container"
              style={{
                maxWidth: '600px',
                margin: '0 auto',
                padding: 'clamp(1rem, 3vw, 1.5rem)',
                background: '#0a0a0a',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                marginBottom: '1rem'
              }}
            >
              {/* Header */}
              <div style={{
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <h1 style={{
                  fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                  fontWeight: '400',
                  color: '#ffffff',
                  margin: 0,
                  marginBottom: '0.25rem',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.02em'
                }}>
                  Book Table
                </h1>
                <p style={{
                  fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  margin: 0,
                  fontFamily: 'var(--font-body)'
                }}>
                  KIIK 69 Sports Bar
                </p>
              </div>

              {/* Guests and Date */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                {/* Guests */}
                <div style={{ position: 'relative' }} data-dropdown>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    fontFamily: 'var(--font-body)'
                  }}>
                    Guests
                  </label>
                  <div
                    onClick={() => {
                      setShowGuestDropdown(!showGuestDropdown);
                      setShowDateDropdown(false);
                    }}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      background: '#1a1a1a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      color: '#ffffff',
                      transition: 'all 0.3s ease',
                      fontFamily: 'var(--font-body)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.currentTarget.style.background = '#252525';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.background = '#1a1a1a';
                    }}
                  >
                    <span>{guests}</span>
                    <FaChevronDown style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)', transition: 'transform 0.3s', transform: showGuestDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </div>
                  {showGuestDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: 'rgba(0, 0, 0, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        marginTop: '0.5rem',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        zIndex: 100,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                      }}
                    >
                      {guestOptions.map((num) => (
                        <div
                          key={num}
                          onClick={() => {
                            setGuests(num);
                            setShowGuestDropdown(false);
                          }}
                          style={{
                            padding: 'clamp(0.75rem, 2vw, 1rem)',
                            cursor: 'pointer',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            color: num === guests ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.9)',
                            fontWeight: num === guests ? '600' : '400',
                            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                            fontFamily: 'var(--font-body)',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 0, 60, 0.1)';
                            e.target.style.color = 'var(--color-primary)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = num === guests ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.9)';
                          }}
                        >
                          {num}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Date */}
                <div style={{ position: 'relative' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    fontFamily: 'var(--font-body)'
                  }}>
                    Date
                  </label>
                  <div
                    onClick={() => {
                      setShowCalendar(true);
                      setShowGuestDropdown(false);
                      setShowDateDropdown(false);
                    }}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      background: '#1a1a1a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      color: '#ffffff',
                      transition: 'all 0.3s ease',
                      fontFamily: 'var(--font-body)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.currentTarget.style.background = '#252525';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.background = '#1a1a1a';
                    }}
                  >
                    <span>{formatDate(selectedDate)}</span>
                    <FaChevronDown style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }} />
                  </div>
                </div>
              </div>

              {/* Meal Type Toggle */}
              <div style={{
                background: '#1a1a1a',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '1.25rem',
                  background: '#0a0a0a',
                  borderRadius: '8px',
                  padding: '0.25rem'
                }}>
                  <motion.button
                    onClick={() => {
                      setMealType('lunch');
                      setSelectedTime('');
                      setSelectedOffer('');
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      flex: 1,
                      padding: '0.625rem',
                      border: 'none',
                      borderRadius: '6px',
                      background: mealType === 'lunch' ? 'var(--color-primary)' : 'transparent',
                      color: mealType === 'lunch' ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      transition: 'all 0.3s ease',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    <FaSun style={{ fontSize: '0.9rem' }} />
                    Lunch
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setMealType('dinner');
                      setSelectedTime('');
                      setSelectedOffer('');
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      flex: 1,
                      padding: '0.625rem',
                      border: 'none',
                      borderRadius: '6px',
                      background: mealType === 'dinner' ? 'var(--color-primary)' : 'transparent',
                      color: mealType === 'dinner' ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      transition: 'all 0.3s ease',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    <FaMoon style={{ fontSize: '0.9rem' }} />
                    Dinner
                  </motion.button>
                </div>

                {/* Time Slots Grid */}
                <div className="booking-time-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.5rem'
                }}>
                  {timeSlots.map((slot) => (
                    <motion.button
                      key={slot.value}
                      onClick={() => handleTimeSelect(slot.value)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '0.625rem 0.5rem',
                        border: `1.5px solid ${selectedTime === slot.value ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)'}`,
                        borderRadius: '8px',
                        background: selectedTime === slot.value 
                          ? 'rgba(255, 0, 60, 0.15)' 
                          : '#0a0a0a',
                        color: selectedTime === slot.value ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.8)',
                        fontWeight: selectedTime === slot.value ? '600' : '400',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        transition: 'all 0.3s ease',
                        fontFamily: 'var(--font-body)'
                      }}
                    >
                      {slot.label}
                    </motion.button>
                  ))}
                </div>
                {errors.time && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      color: 'var(--color-primary)', 
                      fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', 
                      marginTop: '1rem',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    {errors.time}
                  </motion.p>
                )}
              </div>

              {/* Offers Section - Show after time selection */}
              <AnimatePresence>
                {selectedTime && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      marginBottom: '1.5rem'
                    }}
                  >
                    <h3 style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#ffffff',
                      marginBottom: '1rem',
                      fontFamily: 'var(--font-body)'
                    }}>
                      Booking option for {timeSlots.find(s => s.value === selectedTime)?.label}
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}>
                      {availableOffers.map((offer) => (
                        <motion.div
                          key={offer.id}
                          onClick={() => setSelectedOffer(offer.id)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          style={{
                            padding: '1rem',
                            border: `1.5px solid ${selectedOffer === offer.id ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '10px',
                            background: selectedOffer === offer.id 
                              ? 'rgba(255, 0, 60, 0.1)' 
                              : '#1a1a1a',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: `1.5px solid ${selectedOffer === offer.id ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.3)'}`,
                            background: selectedOffer === offer.id 
                              ? 'var(--color-primary)' 
                              : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '0.1rem',
                            transition: 'all 0.3s ease'
                          }}>
                            {selectedOffer === offer.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: '#ffffff'
                                }}
                              />
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: '#ffffff',
                              marginBottom: '0.25rem',
                              fontFamily: 'var(--font-body)'
                            }}>
                              {offer.title}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontFamily: 'var(--font-body)',
                              lineHeight: '1.4'
                            }}>
                              {offer.description}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    {errors.offer && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ 
                          color: 'var(--color-primary)', 
                          fontSize: '0.75rem', 
                          marginTop: '0.75rem',
                          fontFamily: 'var(--font-body)'
                        }}
                      >
                        {errors.offer}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Proceed Button */}
              <motion.button
                onClick={handleProceed}
                disabled={!selectedTime || !selectedOffer}
                whileHover={selectedTime && selectedOffer ? { scale: 1.02 } : {}}
                whileTap={selectedTime && selectedOffer ? { scale: 0.98 } : {}}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: selectedTime && selectedOffer 
                    ? 'var(--color-primary)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  color: selectedTime && selectedOffer ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: selectedTime && selectedOffer ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  marginTop: '1.5rem',
                  fontFamily: 'var(--font-body)'
                }}
              >
                Proceed
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="booking-container"
              className="booking-container"
              style={{
                maxWidth: '600px',
                margin: '0 auto',
                padding: 'clamp(1rem, 3vw, 1.5rem)',
                background: '#0a0a0a',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                marginBottom: '1rem'
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <motion.button
                  onClick={() => setCurrentStep(1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#252525';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#1a1a1a';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <FaArrowLeft style={{ fontSize: '1rem', color: '#ffffff' }} />
                </motion.button>
                <h1 style={{
                  fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                  fontWeight: '400',
                  color: '#ffffff',
                  margin: 0,
                  flex: 1,
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.02em'
                }}>
                  Contact Details
                </h1>
              </div>

              {/* Name Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  fontFamily: 'var(--font-body)'
                }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <FaUser style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontSize: '0.9rem'
                  }} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    placeholder="Enter your full name"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.75rem',
                      border: `1px solid ${errors.name ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '8px',
                      background: '#1a1a1a',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      fontFamily: 'var(--font-body)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-primary)';
                      e.target.style.background = '#252525';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.name ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)';
                      e.target.style.background = '#1a1a1a';
                    }}
                  />
                </div>
                {errors.name && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      color: 'var(--color-primary)', 
                      fontSize: '0.75rem', 
                      marginTop: '0.5rem',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>

              {/* Mobile Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  fontFamily: 'var(--font-body)'
                }}>
                  Mobile Number *
                </label>
                <div style={{ position: 'relative' }}>
                  <FaPhone style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontSize: '0.9rem'
                  }} />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value.replace(/\D/g, '').slice(0, 10));
                      if (errors.mobile) setErrors({ ...errors, mobile: '' });
                    }}
                    placeholder="Enter your 10-digit mobile number"
                    maxLength="10"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.75rem',
                      border: `1px solid ${errors.mobile ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '8px',
                      background: '#1a1a1a',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      fontFamily: 'var(--font-body)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-primary)';
                      e.target.style.background = '#252525';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.mobile ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)';
                      e.target.style.background = '#1a1a1a';
                    }}
                  />
                </div>
                {errors.mobile && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      color: 'var(--color-primary)', 
                      fontSize: '0.75rem', 
                      marginTop: '0.5rem',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    {errors.mobile}
                  </motion.p>
                )}
              </div>

              {/* Proceed Button */}
              <motion.button
                onClick={handleProceed}
                disabled={!name.trim() || !mobile.trim()}
                whileHover={name.trim() && mobile.trim() ? { scale: 1.02 } : {}}
                whileTap={name.trim() && mobile.trim() ? { scale: 0.98 } : {}}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: name.trim() && mobile.trim() 
                    ? 'var(--color-primary)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  color: name.trim() && mobile.trim() ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: name.trim() && mobile.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  fontFamily: 'var(--font-body)'
                }}
              >
                Proceed
              </motion.button>
            </motion.div>
          )}

          {/* Step 3: Booking Summary */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="booking-container"
              style={{
                maxWidth: '600px',
                margin: '0 auto',
                padding: 'clamp(1rem, 3vw, 1.5rem)',
                background: '#0a0a0a',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                minHeight: 'calc(100vh - 200px)',
                marginBottom: '1rem'
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <motion.button
                  onClick={() => setCurrentStep(2)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#252525';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#1a1a1a';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <FaArrowLeft style={{ fontSize: '1rem', color: '#ffffff' }} />
                </motion.button>
                <h1 style={{
                  fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                  fontWeight: '400',
                  color: '#ffffff',
                  margin: 0,
                  flex: 1,
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.02em'
                }}>
                  Booking Summary
                </h1>
              </div>

              {/* Restaurant Info */}
              <div style={{
                marginBottom: '1.5rem',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <h2 style={{
                  fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                  fontWeight: '400',
                  color: '#ffffff',
                  marginBottom: '0.25rem',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.02em'
                }}>
                  KIIK 69 SPORTS BAR
                </h2>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: 'var(--font-body)'
                }}>
                  Gachibowli, Hyderabad
                </p>
              </div>

              {/* Booking Details */}
              <div style={{
                background: '#1a1a1a',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem',
                  marginBottom: '1.25rem'
                }}>
                  <div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '0.375rem',
                      fontFamily: 'var(--font-body)'
                    }}>
                      Date
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#ffffff',
                      fontFamily: 'var(--font-body)'
                    }}>
                      {formatDate(selectedDate)}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '0.375rem',
                      fontFamily: 'var(--font-body)'
                    }}>
                      Time
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#ffffff',
                      fontFamily: 'var(--font-body)'
                    }}>
                      {timeSlots.find(s => s.value === selectedTime)?.label}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '0.375rem',
                      fontFamily: 'var(--font-body)'
                    }}>
                      Guests
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#ffffff',
                      fontFamily: 'var(--font-body)'
                    }}>
                      {guests}
                    </div>
                  </div>
                </div>

                {/* Selected Offer */}
                <div style={{
                  background: '#0a0a0a',
                  borderRadius: '8px',
                  padding: '1rem',
                  border: '1px solid var(--color-primary)'
                }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#ffffff',
                    marginBottom: '0.375rem',
                    fontFamily: 'var(--font-body)'
                  }}>
                    {availableOffers.find(o => o.id === selectedOffer)?.title}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontFamily: 'var(--font-body)',
                    lineHeight: '1.4'
                  }}>
                    {availableOffers.find(o => o.id === selectedOffer)?.description}
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div style={{
                marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '1rem',
                  fontFamily: 'var(--font-body)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Contact Details
                </h3>
                <div style={{
                  background: '#1a1a1a',
                  borderRadius: '8px',
                  padding: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#ffffff',
                    marginBottom: '0.75rem',
                    fontFamily: 'var(--font-body)'
                  }}>
                    <strong style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Name:</strong> {name}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#ffffff',
                    fontFamily: 'var(--font-body)'
                  }}>
                    <strong style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Mobile:</strong> {mobile}
                  </div>
                </div>
              </div>

              {/* Book Now Button */}
              <motion.button
                onClick={handleBookNow}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontFamily: 'var(--font-body)',
                  position: 'sticky',
                  bottom: '1rem'
                }}
              >
                <FaWhatsapp style={{ fontSize: '1.1rem' }} />
                Book Now via WhatsApp
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Calendar Modal */}
        <Calendar
          isOpen={showCalendar}
          onClose={() => setShowCalendar(false)}
          onDateSelect={(date) => {
            setSelectedDate(date);
            setShowCalendar(false);
          }}
          selectedDate={selectedDate}
          minDate={new Date().toISOString().split('T')[0]}
        />
        </main>
      </div>
    </>
  );
};

export default BookingPage;
