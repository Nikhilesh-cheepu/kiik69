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
    isActive: false,
    step: 'initial', // 'initial', 'collecting', 'confirming', 'completed'
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
    
    // Reset booking flow
    setBookingData({
      people: null,
      date: null,
      time: null,
      isActive: false,
      step: 'initial',
      context: []
    });
  };



  





  // Enhanced booking flow handler
  const handleBookingFlow = async (messageText, botResponse) => {
    const lowerMessage = messageText.toLowerCase();
    
    // Check if this is a booking request
    const isBookingRequest = lowerMessage.includes('book') || 
      lowerMessage.includes('reservation') ||
      lowerMessage.includes('reserve') ||
      lowerMessage.includes('table') ||
      lowerMessage.includes('party') ||
      lowerMessage.includes('booking');
    
    if (isBookingRequest && bookingData.step === 'initial') {
      // Start booking flow
      setBookingData(prev => ({
        ...prev,
        isActive: true,
        step: 'collecting'
      }));
      
      const enhancedResponse = botResponse + `\n\nGreat! Let's get your booking sorted! 🎉\n\nI need a few details:\n\n1️⃣ **How many people?**\n2️⃣ **What date?**\n3️⃣ **What time?**\n\nPlease share these details and I'll help you complete the booking! 😊`;
      
      return {
        text: enhancedResponse,
        navigationButtons: ['scroll_to_packages', 'scroll_to_menu']
      };
    }
    
    // If already collecting details, try to extract information
    if (bookingData.step === 'collecting') {
      let updatedData = { ...bookingData };
      let needsMoreInfo = [];
      
      // Extract people count
      const peopleMatch = lowerMessage.match(/(\d+)\s*(?:people|person|guests?|members?|guys?)/i) || 
                          lowerMessage.match(/(\d+)/);
      if (peopleMatch && !updatedData.people) {
        updatedData.people = parseInt(peopleMatch[1]);
      }
      
      // Extract date
      if (lowerMessage.includes('today')) {
        updatedData.date = 'today';
      } else if (lowerMessage.includes('tomorrow')) {
        updatedData.date = 'tomorrow';
      } else if (lowerMessage.includes('tonight')) {
        updatedData.date = 'tonight';
      } else if (lowerMessage.includes('next week')) {
        updatedData.date = 'next week';
      } else if (lowerMessage.includes('next month')) {
        updatedData.date = 'next month';
      }
      
      // Extract time
      const timeMatch = lowerMessage.match(/(\d{1,2}:\d{2}\s*(?:am|pm)?)/i) ||
                       lowerMessage.match(/(\d{1,2}\s*(?:am|pm))/i);
      if (timeMatch) {
        updatedData.time = timeMatch[1];
      }
      
      // Check if we have all required info
      if (updatedData.people && updatedData.date && updatedData.time) {
        // Move to confirmation step
        updatedData.step = 'confirming';
        setBookingData(updatedData);
        
        const confirmationResponse = `Perfect! Here's what I have for your booking:\n\n📅 **Date:** ${updatedData.date}\n⏰ **Time:** ${updatedData.time}\n👥 **People:** ${updatedData.people}\n\nDoes this look correct? Please confirm with "yes" or "ok" and I'll create a WhatsApp message for you! 😊`;
        
        return {
          text: confirmationResponse,
          navigationButtons: ['scroll_to_packages', 'scroll_to_menu']
        };
      } else {
        // Still need more info
        needsMoreInfo = [];
        if (!updatedData.people) needsMoreInfo.push('number of people');
        if (!updatedData.date) needsMoreInfo.push('date');
        if (!updatedData.time) needsMoreInfo.push('time');
        
        setBookingData(updatedData);
        
        const followUpResponse = `Thanks! I still need:\n\n${needsMoreInfo.map((item, index) => `${index + 1}️⃣ **${item}**`).join('\n')}\n\nPlease provide these details so I can complete your booking! 😊`;
        
        return {
          text: followUpResponse,
          navigationButtons: ['scroll_to_packages', 'scroll_to_menu']
        };
      }
    }
    
    // If confirming, check for confirmation
    if (bookingData.step === 'confirming') {
      const isConfirmed = lowerMessage.includes('yes') || 
                          lowerMessage.includes('ok') || 
                          lowerMessage.includes('sure') || 
                          lowerMessage.includes('confirm') ||
                          lowerMessage.includes('correct') ||
                          lowerMessage.includes('perfect');
      
      if (isConfirmed) {
        // Complete booking and show WhatsApp button
        setBookingData(prev => ({ ...prev, step: 'completed' }));
        
        const whatsappMessage = `Hi! I'd like to book a table at KIIK 69 Sports Bar! 🎉\n\n📅 Date: ${bookingData.date}\n⏰ Time: ${bookingData.time}\n👥 People: ${bookingData.people}\n\nCan you help me confirm this booking? Thanks! 😊`;
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappUrl = `https://wa.me/919274696969?text=${encodedMessage}`;
        
        const completionResponse = `Excellent! 🎉 Your booking details are ready!\n\n📅 **Date:** ${bookingData.date}\n⏰ **Time:** ${bookingData.time}\n👥 **People:** ${bookingData.people}\n\nI've created a WhatsApp message with all your details. Click the button below to send it to our team at +91 9274696969! 📱`;
        
        return {
          text: completionResponse,
          navigationButtons: ['scroll_to_packages', 'scroll_to_menu'],
          whatsappUrl: whatsappUrl
        };
      } else {
        // Not confirmed, ask again
        const reconfirmationResponse = `I have:\n\n📅 **Date:** ${bookingData.date}\n⏰ **Time:** ${bookingData.time}\n👥 **People:** ${bookingData.people}\n\nPlease confirm with "yes" or "ok" if this is correct, or let me know what needs to be changed! 😊`;
        
        return {
          text: reconfirmationResponse,
          navigationButtons: ['scroll_to_packages', 'scroll_to_menu']
        };
      }
    }
    
    // Default case - no booking flow changes
    return null;
  };

  // Let OpenAI handle ALL conversations naturally - like ChatGPT
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
      let botResponse;
      
      if (isAIConfigured) {
        // Use real OpenAI API with KIIK69 context - handle ALL conversations
        botResponse = await generateAIResponse(messageText, messages);
      } else {
        // Fallback response if OpenAI not configured
        botResponse = "I'm currently in demo mode. Please configure your OpenAI API key to get real AI responses!";
      }
      
      // Handle booking flow if applicable
      const bookingResult = await handleBookingFlow(messageText, botResponse);
      
      if (bookingResult) {
        // Use the enhanced booking response
        botResponse = bookingResult.text;
      }
      
      // Generate navigation buttons based on user message
      const navigationButtons = getNavigationButtonsForMessage(messageText);
      
      // Add custom booking buttons if it's a booking context
      let customButtons = navigationButtons;
      if (bookingData.isActive || messageText.toLowerCase().includes('book') || 
          messageText.toLowerCase().includes('reservation') || 
          messageText.toLowerCase().includes('reserve')) {
        customButtons = [...navigationButtons, 'scroll_to_packages', 'scroll_to_menu'];
      }
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        navigationButtons: customButtons,
        whatsappUrl: bookingResult?.whatsappUrl
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
            background: 'rgba(0, 0, 0, 0.95)',
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
              padding: '1.5rem 1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(15px)'
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
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'var(--color-white)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
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
              padding: '1.5rem',
              paddingBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              minHeight: 0,
              background: 'rgba(255, 255, 255, 0.02)'
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
                              padding: '1rem 2rem',
                              background: 'linear-gradient(135deg, #25D366, #128C7E)',
                              border: 'none',
                              borderRadius: '16px',
                              color: 'white',
                              fontFamily: 'var(--font-body)',
                              fontSize: '1.1rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.8rem',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 6px 20px rgba(37, 211, 102, 0.4)',
                              textDecoration: 'none',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-3px) scale(1.02)';
                              e.target.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0) scale(1)';
                              e.target.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.4)';
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
              padding: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(15px)',
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
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '24px',
                    padding: '1rem 1.5rem',
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
                    lineHeight: '1.4',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
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
                    background: 'rgba(255, 0, 60, 0.25)',
                    backdropFilter: 'blur(15px)',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: 'var(--color-white)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(255, 0, 60, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.background = 'rgba(255, 0, 60, 0.35)';
                      e.target.style.boxShadow = '0 6px 20px rgba(255, 0, 60, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.background = 'rgba(255, 0, 60, 0.25)';
                    e.target.style.boxShadow = '0 4px 15px rgba(255, 0, 60, 0.3)';
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
