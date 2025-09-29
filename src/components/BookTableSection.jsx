import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaPhone, FaUsers, FaCalendarAlt, FaClock, FaWhatsapp } from 'react-icons/fa';

const BookTableSection = () => {
  // Get tomorrow's date as default
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get default time (7:00 PM)
  const getDefaultTime = () => {
    return '19:00';
  };

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    men: '',
    women: '',
    couples: '',
    date: '',
    time: ''
  });

  const [errors, setErrors] = useState({});
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile.replace(/\s/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    
    // Check if at least one category has people
    const totalPeople = (parseInt(formData.men) || 0) + (parseInt(formData.women) || 0) + (parseInt(formData.couples) || 0) * 2;
    
    if (totalPeople === 0) {
      newErrors.people = 'Please enter number of people in at least one category';
    } else if (totalPeople < 1) {
      newErrors.people = 'Total number of people must be at least 1';
    }
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    
    if (!formData.time) {
      newErrors.time = 'Please select a time';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const generateWhatsAppMessage = () => {
    const formattedDate = new Date(formData.date).toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const formattedTime = new Date(`2000-01-01T${formData.time}`).toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const men = parseInt(formData.men) || 0;
    const women = parseInt(formData.women) || 0;
    const couples = parseInt(formData.couples) || 0;
    const totalPeople = men + women + (couples * 2);

    const message = `Hi! I would like to book a table at KIIK 69.

**BOOKING DETAILS**

**Name:** ${formData.name}

**Mobile:** ${formData.mobile}

**Guest Count:**
• Men: ${men}
• Women: ${women}
• Couples: ${couples}
• Total People: ${totalPeople}

**Date:** ${formattedDate}

**Time:** ${formattedTime}

Please confirm my table reservation. Thank you!`;

    return encodeURIComponent(message);
  };

  const handleBookTable = () => {
    if (validateForm()) {
      const message = generateWhatsAppMessage();
      const whatsappUrl = `https://wa.me/919274696969?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const isFormValid = formData.name.trim() && 
                     formData.mobile.trim() && 
                     ((parseInt(formData.men) || 0) + (parseInt(formData.women) || 0) + (parseInt(formData.couples) || 0) * 2) > 0 &&
                     formData.date &&
                     formData.time &&
                     Object.keys(errors).length === 0;

  // Generate date options for next 30 days
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const isPast = i === 0 && new Date().getHours() >= 18;
      const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
      const dayNumber = date.getDate();
      const monthName = date.toLocaleDateString('en-IN', { month: 'short' });
      
      dates.push({
        value: date.toISOString().split('T')[0],
        label: `${dayName}, ${dayNumber} ${monthName}`,
        available: !isPast,
        isPast: isPast
      });
    }
    
    return dates;
  };

  // Generate time options (12 PM to 11 PM)
  const generateTimeOptions = () => {
    const times = [];
    
    for (let hour = 12; hour <= 23; hour++) {
      const displayHour = hour === 12 ? 12 : hour - 12;
      const period = 'PM';
      
      times.push({
        value: `${hour.toString().padStart(2, '0')}:00`,
        label: `${displayHour} ${period}`,
        available: true
      });
    }
    
    return times;
  };

  const dateOptions = generateDateOptions();
  const timeOptions = generateTimeOptions();

  const handleDateSelect = (date) => {
    setFormData(prev => ({ ...prev, date: date.value }));
    setShowDateDropdown(false);
  };

  const handleTimeSelect = (time) => {
    setFormData(prev => ({ ...prev, time: time.value }));
    setShowTimeDropdown(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDateDropdown || showTimeDropdown) {
        const target = event.target;
        if (!target.closest('[data-dropdown]')) {
          setShowDateDropdown(false);
          setShowTimeDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDateDropdown, showTimeDropdown]);


  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      style={{
        padding: '4rem 0',
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(255, 0, 60, 0.05) 50%, rgba(0, 0, 0, 0.95) 100%)',
        minHeight: 'auto',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-heading)',
            marginBottom: '1rem',
            fontWeight: '400'
          }}>
            Book a Table
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
            color: 'var(--color-gray)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Reserve your table for an unforgettable dining experience at KIIK 69
          </p>
        </motion.div>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(15px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '2.5rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
          }}>
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Name Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: 'var(--color-white)',
                  marginBottom: '0.5rem'
                }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <FaUser style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-gray)',
                    fontSize: '1rem'
                  }} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3rem',
                      border: `1px solid ${errors.name ? '#ff003c' : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--color-white)',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#ff003c';
                      e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.name ? '#ff003c' : 'rgba(255, 255, 255, 0.2)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                  />
                </div>
                {errors.name && (
                  <p style={{ color: '#ff003c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Mobile Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: 'var(--color-white)',
                  marginBottom: '0.5rem'
                }}>
                  Mobile Number *
                </label>
                <div style={{ position: 'relative' }}>
                  <FaPhone style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-gray)',
                    fontSize: '1rem'
                  }} />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter your 10-digit mobile number"
                    maxLength="10"
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3rem',
                      border: `1px solid ${errors.mobile ? '#ff003c' : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--color-white)',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#ff003c';
                      e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.mobile ? '#ff003c' : 'rgba(255, 255, 255, 0.2)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                  />
                </div>
                {errors.mobile && (
                  <p style={{ color: '#ff003c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.mobile}
                  </p>
                )}
              </div>

              {/* Guest Count Fields - Men, Women, Couples */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: 'var(--color-white)',
                  marginBottom: '0.75rem'
                }}>
                  Guest Count *
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '0.75rem'
                }}>
                  {/* Men Count */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '0.5rem'
                    }}>
                      Men
                    </label>
                    <input
                      type="number"
                      name="men"
                      value={formData.men}
                      onChange={handleInputChange}
                      min="0"
                      max="20"
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid rgba(255, 255, 255, 0.2)`,
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: 'var(--color-white)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        textAlign: 'center'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#ff003c';
                        e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                      }}
                    />
                  </div>

                  {/* Women Count */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '0.5rem'
                    }}>
                      Women
                    </label>
                    <input
                      type="number"
                      name="women"
                      value={formData.women}
                      onChange={handleInputChange}
                      min="0"
                      max="20"
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid rgba(255, 255, 255, 0.2)`,
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: 'var(--color-white)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        textAlign: 'center'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#ff003c';
                        e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                      }}
                    />
                  </div>

                  {/* Couples Count */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '0.5rem'
                    }}>
                      Couples
                    </label>
                    <input
                      type="number"
                      name="couples"
                      value={formData.couples}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid rgba(255, 255, 255, 0.2)`,
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: 'var(--color-white)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        textAlign: 'center'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#ff003c';
                        e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                      }}
                    />
                  </div>
                </div>
                {errors.people && (
                  <p style={{ color: '#ff003c', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    {errors.people}
                  </p>
                )}
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.6)', 
                  fontSize: '0.75rem', 
                  marginTop: '0.5rem',
                  textAlign: 'center'
                }}>
                  Total: {((parseInt(formData.men) || 0) + (parseInt(formData.women) || 0) + (parseInt(formData.couples) || 0) * 2)} people
                </p>
              </div>

              {/* Date and Time Selection - Clickable Dropdowns */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1.5rem'
                }}>
                  {/* Date Picker */}
                  <div data-dropdown>
                    <label style={{
                      display: 'block',
                      fontSize: '1rem',
                      fontWeight: '500',
                      color: 'var(--color-white)',
                      marginBottom: '0.75rem'
                    }}>
                      Select Date *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div
                        onClick={() => setShowDateDropdown(!showDateDropdown)}
                        style={{
                          width: '100%',
                          padding: '1rem',
                          border: `2px solid ${errors.date ? '#ff003c' : 'rgba(255, 255, 255, 0.1)'}`,
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--color-white)',
                          fontSize: '1rem',
                          cursor: 'pointer',
                          transition: 'border-color 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          minHeight: '20px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = '#ff003c';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.borderColor = errors.date ? '#ff003c' : 'rgba(255, 255, 255, 0.1)';
                        }}
                      >
                        <span style={{ 
                          color: formData.date ? 'var(--color-white)' : 'rgba(255, 255, 255, 0.5)',
                          fontSize: '1rem'
                        }}>
                          {formData.date 
                            ? dateOptions.find(d => d.value === formData.date)?.label || formData.date
                            : 'dd/mm/yyyy'
                          }
                        </span>
                        <FaCalendarAlt style={{ 
                          color: 'rgba(255, 255, 255, 0.5)', 
                          fontSize: '1rem' 
                        }} />
                      </div>
                      
                      {showDateDropdown && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          background: 'rgba(0, 0, 0, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          marginTop: '0.5rem',
                          zIndex: 1000,
                          maxHeight: '200px',
                          overflowY: 'auto',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
                        }}>
                          {dateOptions.map((date) => (
                            <div
                              key={date.value}
                              onClick={() => handleDateSelect(date)}
                              style={{
                                padding: '0.75rem 1rem',
                                cursor: date.available ? 'pointer' : 'not-allowed',
                                background: formData.date === date.value 
                                  ? 'rgba(255, 0, 60, 0.2)' 
                                  : 'transparent',
                                color: date.available ? 'var(--color-white)' : 'rgba(255, 255, 255, 0.5)',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s ease',
                                opacity: date.available ? 1 : 0.5
                              }}
                              onMouseEnter={(e) => {
                                if (date.available) {
                                  e.target.style.background = formData.date === date.value 
                                    ? 'rgba(255, 0, 60, 0.3)' 
                                    : 'rgba(255, 255, 255, 0.1)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (date.available) {
                                  e.target.style.background = formData.date === date.value 
                                    ? 'rgba(255, 0, 60, 0.2)' 
                                    : 'transparent';
                                }
                              }}
                            >
                              {date.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.date && (
                      <p style={{ color: '#ff003c', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        {errors.date}
                      </p>
                    )}
                  </div>

                  {/* Time Picker */}
                  <div data-dropdown>
                    <label style={{
                      display: 'block',
                      fontSize: '1rem',
                      fontWeight: '500',
                      color: 'var(--color-white)',
                      marginBottom: '0.75rem'
                    }}>
                      Select Time *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div
                        onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                        style={{
                          width: '100%',
                          padding: '1rem',
                          border: `2px solid ${errors.time ? '#ff003c' : 'rgba(255, 255, 255, 0.1)'}`,
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--color-white)',
                          fontSize: '1rem',
                          cursor: 'pointer',
                          transition: 'border-color 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          minHeight: '20px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = '#ff003c';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.borderColor = errors.time ? '#ff003c' : 'rgba(255, 255, 255, 0.1)';
                        }}
                      >
                        <span style={{ 
                          color: formData.time ? 'var(--color-white)' : 'rgba(255, 255, 255, 0.5)',
                          fontSize: '1rem'
                        }}>
                          {formData.time 
                            ? timeOptions.find(t => t.value === formData.time)?.label || formData.time
                            : '--:--'
                          }
                        </span>
                        <FaClock style={{ 
                          color: 'rgba(255, 255, 255, 0.5)', 
                          fontSize: '1rem' 
                        }} />
                      </div>
                      
                      {showTimeDropdown && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          background: 'rgba(0, 0, 0, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          marginTop: '0.5rem',
                          zIndex: 1000,
                          maxHeight: '200px',
                          overflowY: 'auto',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
                        }}>
                          {timeOptions.map((time) => (
                            <div
                              key={time.value}
                              onClick={() => handleTimeSelect(time)}
                              style={{
                                padding: '0.75rem 1rem',
                                cursor: 'pointer',
                                background: formData.time === time.value 
                                  ? 'rgba(255, 0, 60, 0.2)' 
                                  : 'transparent',
                                color: 'var(--color-white)',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = formData.time === time.value 
                                  ? 'rgba(255, 0, 60, 0.3)' 
                                  : 'rgba(255, 255, 255, 0.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = formData.time === time.value 
                                  ? 'rgba(255, 0, 60, 0.2)' 
                                  : 'transparent';
                              }}
                            >
                              {time.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.time && (
                      <p style={{ color: '#ff003c', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        {errors.time}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Book Table Button */}
              <motion.button
                type="button"
                onClick={handleBookTable}
                disabled={!isFormValid}
                style={{
                  width: '100%',
                  padding: '1rem 2rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: isFormValid 
                    ? '#25D366'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--color-white)',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isFormValid ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  opacity: isFormValid ? 1 : 0.5
                }}
                whileHover={isFormValid ? {
                  background: '#128C7E',
                  transform: 'translateY(-1px)'
                } : {}}
                whileTap={isFormValid ? { scale: 0.98 } : {}}
              >
                <FaWhatsapp style={{ fontSize: '1.1rem' }} />
                {isFormValid ? 'Book Table via WhatsApp' : 'Fill all fields to book'}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default BookTableSection;
