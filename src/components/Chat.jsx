import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane, FaUser, FaComments, FaExclamationTriangle, FaSignOutAlt, FaPhone, FaEnvelope, FaWhatsapp, FaMapMarkerAlt, FaInstagram, FaFacebook, FaCalendarAlt, FaUsers, FaGift } from 'react-icons/fa';
import { generateAIResponse, isOpenAIConfigured } from '../lib/openai.js';
import { 
  isLoggedIn, 
  getCurrentUser, 
  logoutUser, 
  getGuestSessionId, 
  saveChatMessage,
  getUserProfile,
  loginUser
} from '../lib/chatAuth.js';
import { getNavigationButtonsForMessage, handleNavigationClick } from '../lib/chatNavigation.js';
import ChatNavigationButtons from './ChatNavigationButtons';

const Chat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAIConfigured, setIsAIConfigured] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const [bookingData, setBookingData] = useState({
    people: null,
    date: null,
    time: null,
    occasion: null,
    isActive: false,
    context: [] // Store conversation context
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check OpenAI configuration and user authentication on mount
  useEffect(() => {
    setIsAIConfigured(isOpenAIConfigured());
    
    // Check if user is logged in
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setSessionId(user.sessionId);
    } else {
      // Set guest session ID
      setSessionId(getGuestSessionId());
    }
  }, []);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('kiik69-chat-history');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    } else {
      // Add default welcome message
      setMessages([
        {
          id: Date.now(),
          text: "Hi! I'm your KIIK 69 Assistant. Ask me anything!",
          sender: 'bot',
          timestamp: new Date().toISOString(),
          navigationButtons: [] // No navigation buttons for welcome message
        }
      ]);
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('kiik69-chat-history', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageText = inputMessage.trim();
    
    // Check if message is a greeting
    if (isGreeting(messageText)) {
      const greetingResponse = getGreetingResponseForUser(messageText);
      const greetingMessage = {
        id: Date.now(),
        text: messageText,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      
      const botGreetingResponse = {
        id: Date.now() + 1,
        text: greetingResponse,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        navigationButtons: [] // No navigation buttons for greetings
      };
      
      setMessages(prev => [...prev, greetingMessage, botGreetingResponse]);
      setInputMessage('');
      
      // Save chat message to database if user is logged in
      if (currentUser) {
        try {
          await saveChatMessage(messageText, false);
          await saveChatMessage(greetingResponse, true);
        } catch (error) {
          console.error('Failed to save chat:', error);
        }
      }
      return;
    }
    
    // Check if message is about booking/reservation
    if (isBookingRequest(messageText)) {
      handleBookingRequest(messageText);
      return;
    }
    
    // Handle booking data collection
    if (bookingData.isActive) {
      handleBookingDataCollection(messageText);
      return;
    }

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let botResponse;
      
      if (isAIConfigured) {
        // Use real OpenAI API
        botResponse = await generateAIResponse(messageText, messages);
      } else {
        // Fallback response if OpenAI not configured
        botResponse = "I'm currently in demo mode. Please configure your OpenAI API key to get real AI responses!";
      }
      
      // Generate navigation buttons based on user message
      const navigationButtons = getNavigationButtonsForMessage(messageText);
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        navigationButtons: navigationButtons
      };

      setMessages(prev => [...prev, botMessage]);

      // Save chat message to database if user is logged in
      if (currentUser) {
        try {
          await saveChatMessage(messageText, false);
          await saveChatMessage(botResponse, true);
        } catch (error) {
          console.error('Failed to save chat:', error);
        }
      }
    } catch (error) {
      console.error('Error generating response:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: error.message || "Sorry, I'm having trouble responding right now. Please try again!",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        navigationButtons: [] // No navigation buttons for error messages
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };



  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        text: "Hi! I'm your KIIK 69 Assistant. Ask me anything!",
        sender: 'bot',
        timestamp: new Date().toISOString()
      }
    ]);
    localStorage.removeItem('kiik69-chat-history');
  };



  // Enhanced NLP parsing for reservation details
  const parseReservationDetails = (message) => {
    const lowerMessage = message.toLowerCase();
    const details = {};
    
    // Extract people count (various formats)
    const peoplePatterns = [
      /(\d+)\s*(?:people|person|guests?|members?)/i,
      /(?:for|about|around)\s*(\d+)/i,
      /(\d+)\s*(?:guests?|members?)/i,
      /(\d+)/ // Just a number
    ];
    
    for (const pattern of peoplePatterns) {
      const match = lowerMessage.match(pattern);
      if (match && !details.people) {
        details.people = parseInt(match[1]);
        break;
      }
    }
    
    // Extract date/time (various formats)
    const dateTimePatterns = [
      // Specific dates
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g,
      /(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4})/gi,
      // Relative dates
      /(today|tomorrow|next\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month))/gi,
      // Time
      /(\d{1,2}:\d{2}\s*(?:am|pm)?)/gi,
      /(\d{1,2}\s*(?:am|pm))/gi,
      // Time ranges
      /(\d{1,2}\s*(?:am|pm)\s*to\s*\d{1,2}\s*(?:am|pm))/gi
    ];
    
    for (const pattern of dateTimePatterns) {
      const matches = lowerMessage.match(pattern);
      if (matches && matches.length > 0) {
        if (!details.date) details.date = matches[0];
        if (!details.time && matches.length > 1) details.time = matches[1];
      }
    }
    
    // Extract occasion/event type
    const occasionPatterns = [
      /(?:for|celebration\s+of|event\s+is)\s+([a-z\s]+?)(?:\s+(?:tomorrow|today|next|at|on|$))/gi,
      /(birthday|anniversary|corporate|meeting|party|celebration|dinner|lunch|brunch)/gi,
      /(?:special\s+occasion|event)\s*:?\s*([a-z\s]+)/gi
    ];
    
    for (const pattern of occasionPatterns) {
      const match = lowerMessage.match(pattern);
      if (match && !details.occasion) {
        details.occasion = match[1] || match[0];
        break;
      }
    }
    
    return details;
  };

  // Check if message is about booking/reservation
  const isBookingRequest = (message) => {
    const bookingKeywords = ['book', 'booking', 'reservation', 'reserve', 'table', 'party', 'event', 'celebration', 'reserve', 'arrange'];
    const lowerMessage = message.toLowerCase();
    return bookingKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  // Handle initial booking request with smart parsing
  const handleBookingRequest = (messageText) => {
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    // Parse the message for any existing details
    const parsedDetails = parseReservationDetails(messageText);
    
    // Update booking data with any found details
    const updatedBookingData = { ...bookingData };
    if (parsedDetails.people) updatedBookingData.people = parsedDetails.people;
    if (parsedDetails.date) updatedBookingData.date = parsedDetails.date;
    if (parsedDetails.time) updatedBookingData.time = parsedDetails.time;
    if (parsedDetails.occasion) updatedBookingData.occasion = parsedDetails.occasion;
    
    setBookingData(prev => ({ ...prev, ...updatedBookingData, isActive: true, context: [...prev.context, messageText] }));

    // Determine what's still needed
    const missingInfo = [];
    if (!updatedBookingData.people) missingInfo.push('number of people');
    if (!updatedBookingData.date && !updatedBookingData.time) missingInfo.push('date and time');
    if (!updatedBookingData.occasion) missingInfo.push('occasion or special message');

    let botResponseText = '';
    
    if (missingInfo.length === 0) {
      // All info provided! Complete the booking
      botResponseText = "Perfect! I have all the details. Let me process your booking...";
      setMessages(prev => [...prev, userMessage]);
      
      setTimeout(() => {
        completeBooking();
      }, 1000);
      return;
    } else if (missingInfo.length === 1) {
      botResponseText = `Great! I just need to know the ${missingInfo[0]}.`;
    } else {
      const lastItem = missingInfo.pop();
      botResponseText = `I need a few more details: ${missingInfo.join(', ')} and ${lastItem}.`;
    }

    const botResponse = {
      id: Date.now() + 1,
      text: botResponseText,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      navigationButtons: []
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setInputMessage('');
  };

  // Smart booking data collection with context awareness
  const handleBookingDataCollection = (messageText) => {
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Add to context
    setBookingData(prev => ({ ...prev, context: [...prev.context, messageText] }));

    // Parse the new message for additional details
    const newDetails = parseReservationDetails(messageText);
    
    // Update booking data with new information
    const updatedData = { ...bookingData };
    if (newDetails.people && !updatedData.people) updatedData.people = newDetails.people;
    if (newDetails.date && !updatedData.date) updatedData.date = newDetails.date;
    if (newDetails.time && !updatedData.time) updatedData.time = newDetails.time;
    if (newDetails.occasion && !updatedData.occasion) updatedData.occasion = newDetails.occasion;
    
    setBookingData(prev => ({ ...prev, ...updatedData }));

    // Wait a moment to simulate thinking
    setTimeout(() => {
      // Check what's still missing
      const missingInfo = [];
      if (!updatedData.people) missingInfo.push('number of people');
      if (!updatedData.date && !updatedData.time) missingInfo.push('date and time');
      if (!updatedData.occasion) missingInfo.push('occasion or special message');

      let botResponseText = '';
      
      if (missingInfo.length === 0) {
        // All info collected! Complete the booking
        botResponseText = "Excellent! I have all the details now. Let me process your booking...";
        
        setTimeout(() => {
          completeBooking();
        }, 1000);
      } else if (missingInfo.length === 1) {
        botResponseText = `Great! I just need to know the ${missingInfo[0]}.`;
      } else {
        const lastItem = missingInfo.pop();
        botResponseText = `I still need: ${missingInfo.join(', ')} and ${lastItem}.`;
      }

      const botResponse = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        navigationButtons: []
      };

      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  // Complete booking and show options with WhatsApp integration
  const completeBooking = () => {
    const { people, date, time, occasion } = bookingData;
    
    let botResponse;
    let navigationButtons = [];
    
    if (people >= 20) {
      botResponse = {
        id: Date.now() + 1,
        text: `Looks like a celebration! 🥳 We have party packages with unlimited food & drinks — want to see the options?`,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        navigationButtons: ['scroll_to_packages']
      };
    } else {
      // Generate custom WhatsApp message
      const whatsappMessage = `Hi, I'd like to book a reservation at KIIK 69 Sports Bar!\n\n👥 People: ${people}\n📅 Date: ${date}\n🕔 Time: ${time}\n🎉 Occasion: ${occasion || 'Regular booking'}\n\nCan you help me with this?`;
      
      // Encode the message for WhatsApp URL
      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/919247696969?text=${encodedMessage}`;
      
      botResponse = {
        id: Date.now() + 1,
        text: `Perfect! Here's your booking summary:\n\n👥 People: ${people}\n📅 Date: ${date}\n🕔 Time: ${time}\n🎉 Occasion: ${occasion || 'Regular booking'}\n\nReady to send this to our team?`,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        navigationButtons: [],
        whatsappUrl: whatsappUrl // Store WhatsApp URL for the button
      };
    }
    
    setMessages(prev => [...prev, botResponse]);
    setBookingData({ people: null, date: null, time: null, occasion: null, isActive: false, context: [] });
  };

  // Check if message is a greeting
  const isGreeting = (message) => {
    const greetingWords = [
      'hi', 'hello', 'hey', 'whats up', 'sup', 'good morning', 'good afternoon',
      'good evening', 'namaste', 'namaskaram', 'em chestunnav', 'kya haal hai'
    ];
    
    const lowerMessage = message.toLowerCase();
    return greetingWords.some(word => lowerMessage.includes(word));
  };

  // Get appropriate response for greeting
  const getGreetingResponseForUser = (message) => {
    // Simple greeting responses
    const responses = [
      "Hi there! Welcome to KIIK 69 Sports Bar! 🎮",
      "Hello! How can I help you today? 🏆",
      "Hey! Ready for some gaming fun? 🎯",
      "Namaste! What would you like to know about KIIK 69? 🎪"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          data-chat-modal="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(255, 0, 60, 0.05) 50%, rgba(0, 0, 0, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'stretch',
            padding: 0
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="chat-container"
            style={{
              width: '100vw',
              height: '100vh',
              maxWidth: '100vw',
              maxHeight: '100vh',
              background: 'rgba(0, 0, 0, 0.90)',
              borderRadius: 0,
              border: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.05)'
            }}>
                              <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(255, 0, 60, 0.3)'
                  }}>
                    <img 
                      src="/logos/logo.PNG" 
                      alt="KIIK69" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover'
                      }} 
                    />
                  </div>
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      color: 'var(--color-gray)',
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      Welcome to KIIK 69 🥂 Let's plan your night!
                    </p>
                  {!isAIConfigured && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      background: 'rgba(255, 193, 7, 0.2)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 193, 7, 0.3)'
                    }}>
                      <FaExclamationTriangle style={{ 
                        color: '#ffc107', 
                        fontSize: '0.7rem' 
                      }} />
                      <span style={{
                        color: '#ffc107',
                        fontSize: '0.7rem',
                        fontWeight: '500'
                      }}>
                        OpenAI not configured
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <button
                  onClick={onClose}
                  style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: 'var(--color-white)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '1rem',
              paddingBottom: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              minHeight: 0
            }}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '0.6rem',
                    maxWidth: '92%'
                  }}>
                    {message.sender === 'bot' && (
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}>
                        <img 
                          src="/logos/logo.PNG" 
                          alt="KIIK69" 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover'
                          }} 
                        />
                      </div>
                    )}
                    
                    <div style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '16px',
                      background: message.sender === 'user' 
                        ? 'linear-gradient(135deg, var(--color-primary), rgba(255, 0, 60, 0.8))'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: message.sender === 'user' 
                        ? 'none'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--color-white)',
                      boxShadow: message.sender === 'user' 
                        ? '0 4px 20px rgba(255, 0, 60, 0.3)'
                        : 'none',
                      overflowWrap: 'anywhere',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap'
                    }}>
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        margin: 0,
                        marginBottom: '0.5rem'
                      }}>
                        {message.text}
                      </p>
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.75rem',
                        color: message.sender === 'user' ? 'rgba(255, 255, 255, 0.7)' : 'var(--color-gray)',
                        margin: 0
                      }}>
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      
                      {/* Navigation Buttons for Bot Messages */}
                      {message.sender === 'bot' && message.navigationButtons && (
                        <ChatNavigationButtons 
                          buttons={message.navigationButtons}
                          onButtonClick={handleNavigationClick}
                        />
                      )}
                      
                      {/* WhatsApp Button for Booking Messages */}
                      {message.sender === 'bot' && message.whatsappUrl && (
                        <div style={{ marginTop: '1rem' }}>
                          <button
                            onClick={() => window.open(message.whatsappUrl, '_blank')}
                            style={{
                              width: '100%',
                              padding: '0.75rem 1.5rem',
                              background: 'linear-gradient(135deg, #25D366, #128C7E)',
                              border: 'none',
                              borderRadius: '12px',
                              color: 'white',
                              fontFamily: 'var(--font-body)',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
                              textDecoration: 'none'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.3)';
                            }}
                          >
                            <FaWhatsapp style={{ fontSize: '1.1rem' }} />
                            Send on WhatsApp
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {message.sender === 'user' && (
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, rgba(0, 0, 60, 0.8), rgba(0, 0, 120, 0.8))',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <FaUser style={{ color: 'var(--color-white)', fontSize: '1rem' }} />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Loading Animation */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src="/logos/logo.PNG" 
                        alt="KIIK69" 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover'
                        }} 
                      />
                    </div>
                    <div style={{
                      padding: '1rem 1.5rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '18px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center'
                      }}>
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                          style={{
                            width: '8px',
                            height: '8px',
                            background: 'var(--color-primary)',
                            borderRadius: '50%'
                          }}
                        />
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                          style={{
                            width: '8px',
                            height: '8px',
                            background: 'var(--color-primary)',
                            borderRadius: '50%'
                          }}
                        />
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                          style={{
                            width: '8px',
                            height: '8px',
                            background: 'var(--color-primary)',
                            borderRadius: '50%'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>



            {/* Input Section */}
            <div style={{
              padding: '0.8rem 1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(0, 0, 0, 0.6)',
              position: 'sticky',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 10
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                maxWidth: '100%',
                overflow: 'hidden'
              }}>
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    // Auto-resize the textarea
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message"
                  rows={1}
                  style={{
                    flex: '1 1 auto',
                    minWidth: '0',
                    maxWidth: '100%',
                    minHeight: '48px',
                    maxHeight: '120px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '24px',
                    padding: '0.9rem 1.2rem',
                    color: 'var(--color-white)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    WebkitAppearance: 'none',
                    WebkitBorderRadius: '24px',
                    resize: 'none',
                    overflowY: 'auto',
                    lineHeight: '1.4'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid var(--color-primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 0, 60, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid rgba(255, 255, 255, 0.12)';
                    e.target.style.boxShadow = 'none';
                  }}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(255, 0, 60, 0.28)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'var(--color-white)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(255, 0, 60, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.transform = 'scale(1.1)';
                      e.target.style.background = 'rgba(255, 0, 60, 0.35)';
                      e.target.style.boxShadow = '0 6px 20px rgba(255, 0, 60, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.background = 'rgba(255, 0, 60, 0.25)';
                    e.target.style.boxShadow = '0 4px 15px rgba(255, 0, 60, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <FaPaperPlane />
                </button>
              </div>
              
              {/* Clear Chat Button */}
              {messages.length > 1 && (
                <button
                  onClick={clearChat}
                  style={{
                    marginTop: '1rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-gray)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = 'var(--color-white)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'var(--color-gray)';
                  }}
                >
                  Clear chat history
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      

    </AnimatePresence>
  );
};

export default Chat;
