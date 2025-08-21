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
    
    // Use intelligent conversation handler for everything else
    await handleIntelligentConversation(messageText);
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
    
    // Extract people count (various formats) - IMPROVED LOGIC
    const peoplePatterns = [
      /(\d+)\s*(?:people|person|guests?|members?)/i,
      /(?:for|about|around)\s*(\d+)/i,
      /(\d+)\s*(?:guests?|members?)/i,
      /^(\d+)$/i, // Just a number (standalone)
      /(\d+)/ // Any number (fallback)
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
    

    
    return details;
  };

  // Smart defaults and partial completion logic
  const getSmartDefaults = (currentData) => {
    const defaults = {};
    
    // If no date given, suggest today/tonight
    if (!currentData.date && !currentData.time) {
      const now = new Date();
      const hour = now.getHours();
      
      if (hour < 12) {
        defaults.date = 'today';
        defaults.time = 'dinner time (7:00 PM)';
      } else if (hour < 17) {
        defaults.date = 'today';
        defaults.time = 'dinner time (7:00 PM)';
      } else {
        defaults.date = 'tonight';
        defaults.time = '8:00 PM';
      }
    } else if (currentData.date && !currentData.time) {
      // If date given but no time, suggest appropriate meal time
      const lowerDate = currentData.date.toLowerCase();
      if (lowerDate.includes('today') || lowerDate.includes('tonight')) {
        const now = new Date();
        const hour = now.getHours();
        
        if (hour < 12) {
          defaults.time = 'lunch time (1:00 PM)';
        } else if (hour < 17) {
          defaults.time = 'dinner time (7:00 PM)';
        } else {
          defaults.time = '8:00 PM';
        }
      } else {
        defaults.time = 'dinner time (7:00 PM)';
      }
    } else if (!currentData.date && currentData.time) {
      // If time given but no date, suggest today
      defaults.date = 'today';
    }
    
    return defaults;
  };

  // Check if we can complete booking with smart defaults
  const canCompleteWithDefaults = (currentData) => {
    const defaults = getSmartDefaults(currentData);
    return currentData.people && (currentData.date || defaults.date) && (currentData.time || defaults.time);
  };

  // Handle booking confirmation with smart defaults
  const handleBookingConfirmation = (action) => {
    if (action === 'confirm_booking') {
      // Complete the booking with smart defaults
      completeBooking();
    } else if (action === 'modify_booking') {
      // Reset to ask for more details
      setBookingData(prev => ({ ...prev, isActive: true }));
      
      const botResponse = {
        id: Date.now() + 1,
        text: "Sure! What would you like to change? I need:\n\n👥 Number of people\n📅 Date and time",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        navigationButtons: []
      };
      
      setMessages(prev => [...prev, botResponse]);
    }
  };

  // Intelligent conversation handler - like ChatGPT but with KIIK69 knowledge
  const handleIntelligentConversation = async (messageText) => {
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
      // Check if this is a booking-related conversation
      const isBookingContext = bookingData.isActive || 
        messageText.toLowerCase().includes('book') || 
        messageText.toLowerCase().includes('reservation') ||
        messageText.toLowerCase().includes('reserve') ||
        messageText.toLowerCase().includes('table') ||
        messageText.toLowerCase().includes('party');

      if (isBookingContext) {
        // Handle booking conversation intelligently
        await handleBookingConversation(messageText);
      } else {
        // Handle general conversation with AI
        let botResponse;
        
        if (isAIConfigured) {
          // Use real OpenAI API with KIIK69 context
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
      }
    } catch (error) {
      console.error('Error generating response:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble processing that right now. Could you try rephrasing your question?",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        navigationButtons: []
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Intelligent booking conversation handler
  const handleBookingConversation = async (messageText) => {
    // Parse the message for any details
    const parsedDetails = parseReservationDetails(messageText);
    
    // Update booking data with any found details
    const updatedBookingData = { ...bookingData };
    if (parsedDetails.people && !updatedBookingData.people) updatedBookingData.people = parsedDetails.people;
    if (parsedDetails.date && !updatedBookingData.date) updatedBookingData.date = parsedDetails.date;
    if (parsedDetails.time && !updatedBookingData.time) updatedBookingData.time = parsedDetails.time;
    
    setBookingData(prev => ({ ...prev, ...updatedBookingData, isActive: true, context: [...prev.context, messageText] }));

    // Check if we can complete with smart defaults
    if (canCompleteWithDefaults(updatedBookingData)) {
      const defaults = getSmartDefaults(updatedBookingData);
      const finalData = { ...updatedBookingData };
      
      // Apply smart defaults
      if (!finalData.date) finalData.date = defaults.date;
      if (!finalData.time) finalData.time = defaults.time;
      
      setBookingData(prev => ({ ...prev, ...finalData }));
      
      const botResponseText = `Great! I can complete your booking with smart defaults:\n\n👥 People: ${finalData.people}\n📅 Date: ${finalData.date}\n🕔 Time: ${finalData.time}\n\nShould I proceed with these details?`;
      
      const botResponse = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        navigationButtons: ['confirm_booking', 'modify_booking']
      };
      
      setMessages(prev => [...prev, botResponse]);
      return;
    }

    // Determine what's still needed
    const missingInfo = [];
    if (!updatedBookingData.people) missingInfo.push('number of people');
    if (!updatedBookingData.date) missingInfo.push('date');
    if (!updatedBookingData.time) missingInfo.push('time');

    let botResponseText = '';
    
    if (missingInfo.length === 0) {
      // All info provided! Complete the booking
      botResponseText = "Perfect! I have all the details. Let me process your booking...";
      
      setTimeout(() => {
        completeBooking();
      }, 1000);
    } else if (missingInfo.length === 1) {
      // More specific responses based on what's missing
      if (missingInfo[0] === 'number of people') {
        botResponseText = `Perfect! I have the date and time. How many people will be joining us?`;
      } else if (missingInfo[0] === 'date') {
        botResponseText = `Great! I have the number of people and time. What date would you like to book for?`;
      } else if (missingInfo[0] === 'time') {
        botResponseText = `Excellent! I have the number of people and date. What time would you prefer?`;
      } else {
        botResponseText = `Great! I just need to know the ${missingInfo[0]}.`;
      }
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

    setMessages(prev => [...prev, botResponse]);
  };



  // Complete booking and show options with WhatsApp integration
  const completeBooking = () => {
    const { people, date, time } = bookingData;
    
    let botResponse;
    let navigationButtons = [];
    
    if (people >= 20) {
      botResponse = {
        id: Date.now() + 1,
        text: `Perfect! ${people} people is definitely a celebration! 🥳\n\nWe have amazing party packages with unlimited food & drinks. Want to see the options?`,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        navigationButtons: ['scroll_to_packages']
      };
    } else {
      // Generate custom WhatsApp message
      const whatsappMessage = `Hi, I'd like to book a reservation at KIIK 69 Sports Bar!\n\n👥 People: ${people}\n📅 Date: ${date}\n🕔 Time: ${time}\n\nCan you help me with this?`;
      
      // Encode the message for WhatsApp URL
      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/919247696969?text=${encodedMessage}`;
      
      botResponse = {
        id: Date.now() + 1,
        text: `Perfect! Here's your booking summary:\n\n👥 People: ${people}\n📅 Date: ${date}\n🕔 Time: ${time}\n\nReady to send this to our team?`,
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
                          onButtonClick={(action) => {
                            // Handle booking-specific actions
                            if (action === 'confirm_booking' || action === 'modify_booking') {
                              handleBookingConfirmation(action);
                            } else {
                              // Handle regular navigation actions
                              handleNavigationClick(action);
                            }
                          }}
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
