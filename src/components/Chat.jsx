import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane, FaRobot, FaUser, FaComments, FaExclamationTriangle, FaSignOutAlt, FaPhone, FaEnvelope, FaSignInAlt } from 'react-icons/fa';
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
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
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
    
    // Check if message requires login
    if (checkLoginRequirement(messageText)) {
      const loginPromptMessage = {
        id: Date.now(),
        text: "👋 Hey! To fetch your past reservations or data, please log in with your number first.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        navigationButtons: [] // No navigation buttons for login prompts
      };
      
      setMessages(prev => [...prev, {
        id: Date.now() - 1,
        text: messageText,
        sender: 'user',
        timestamp: new Date().toISOString()
      }, loginPromptMessage]);
      
      setInputMessage('');
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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

  // Handle login success
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setSessionId(user.sessionId);
    
    // Add welcome message
    const welcomeMessage = {
      id: Date.now(),
      text: `Welcome back, ${user.phone || user.email} 🎉`,
      sender: 'bot',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [prev[0], welcomeMessage]);
  };



  // Handle logout
  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setSessionId(getGuestSessionId());
    
    // Add guest message
    const guestMessage = {
      id: Date.now(),
      text: "You're now chatting as Guest 👤",
      sender: 'bot',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [prev[0], guestMessage]);
  };

  // Handle login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your email or phone number');
      return;
    }

    // Check if it's a phone number (10 digits) or email
    const isPhone = /^\d{10}$/.test(loginIdentifier.replace(/\D/g, ''));
    const isEmail = loginIdentifier.includes('@') && loginIdentifier.includes('.');

    if (!isPhone && !isEmail) {
      setLoginError('Please enter a valid 10-digit phone number or email address');
      return;
    }

    setIsLoginLoading(true);
    setLoginError('');

    try {
      const result = await loginUser({ identifier: loginIdentifier });
      
      if (result.success) {
        setCurrentUser(result.user);
        setSessionId(result.user.sessionId);
        setLoginIdentifier('');
        setIsLoginPopupOpen(false);
        
        // Add welcome message
        const welcomeMessage = {
          id: Date.now(),
          text: `Welcome back! You're now logged in as ${result.user.phone || result.user.email}`,
          sender: 'bot',
          timestamp: new Date().toISOString(),
          navigationButtons: []
        };
        
        setMessages(prev => [welcomeMessage, ...prev]);
      } else {
        setLoginError(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  // Check if message requires login
  const checkLoginRequirement = (message) => {
    // Simple check for login-required keywords
    const loginKeywords = ['reservation', 'booking', 'my data', 'profile', 'history'];
    const lowerMessage = message.toLowerCase();
    return loginKeywords.some(keyword => lowerMessage.includes(keyword)) && !currentUser;
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
                  background: 'linear-gradient(135deg, var(--color-primary), rgba(255, 0, 60, 0.8))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(255, 0, 60, 0.3)'
                }}>
                  <FaRobot style={{ fontSize: '1.5rem', color: 'var(--color-white)' }} />
                </div>
                <div>
                  <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.6rem',
                    color: 'var(--color-white)',
                    margin: 0,
                    letterSpacing: '0.02em'
                  }}>
                    KIKKI
                  </h2>
                                     <p style={{
                     fontFamily: 'var(--font-body)',
                     fontSize: '0.9rem',
                     color: 'var(--color-gray)',
                     margin: 0,
                     fontWeight: '500'
                   }}>
                     AI Assistant
                   </p>
                   
                   {/* User Status */}
                   <p style={{
                     fontFamily: 'var(--font-body)',
                     fontSize: '0.8rem',
                     color: currentUser ? '#51cf66' : 'var(--color-gray)',
                     margin: '0.25rem 0 0 0',
                     fontWeight: '400'
                   }}>
                     {currentUser ? `Welcome back, ${currentUser.phone} 🎉` : "You're chatting as Guest 👤"}
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
                {/* Logout Button - Only show when user is logged in */}
                {currentUser && (
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: '20px',
                      color: 'var(--color-white)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 4px 15px rgba(255, 0, 60, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                )}

                {/* Login Button - Only show when user is not logged in */}
                {!currentUser && (
                  <button
                    onClick={() => setIsLoginPopupOpen(true)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(255, 0, 60, 0.25)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: '20px',
                      color: 'var(--color-white)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(255, 0, 60, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.background = 'rgba(255, 0, 60, 0.35)';
                      e.target.style.boxShadow = '0 4px 15px rgba(255, 0, 60, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0 2px 8px rgba(255, 0, 60, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <FaSignInAlt />
                    Login
                  </button>
                )}
                
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
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
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
                        background: 'linear-gradient(135deg, var(--color-primary), rgba(255, 0, 60, 0.8))',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <FaRobot style={{ color: 'var(--color-white)', fontSize: '1rem' }} />
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
                      background: 'linear-gradient(135deg, var(--color-primary), rgba(255, 0, 60, 0.8))',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FaRobot style={{ color: 'var(--color-white)', fontSize: '1rem' }} />
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
              background: 'rgba(0, 0, 0, 0.6)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                maxWidth: '100%',
                overflow: 'hidden'
              }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message"
                  style={{
                    flex: '1 1 auto',
                    minWidth: '0',
                    maxWidth: '100%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '24px',
                    padding: '0.9rem 1.2rem',
                    color: 'var(--color-white)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid var(--color-primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 0, 60, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
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

      {/* Login Popup Modal */}
      <AnimatePresence>
        {isLoginPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
              padding: '1rem'
            }}
            onClick={() => setIsLoginPopupOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                width: '100%',
                maxWidth: '400px',
                background: 'rgba(0, 0, 0, 0.95)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                overflow: 'hidden'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.5rem 2rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)'
              }}>
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  color: 'var(--color-white)',
                  margin: 0
                }}>
                  Login to Chat
                </h2>
                <button
                  onClick={() => setIsLoginPopupOpen(false)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'var(--color-white)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: '2rem' }}>
                <form onSubmit={handleLoginSubmit}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      color: 'var(--color-gray)',
                      marginBottom: '0.5rem'
                    }}>
                      Email or Phone Number
                    </label>
                    <div style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        position: 'absolute',
                        left: '1rem',
                        color: 'var(--color-gray)',
                        fontSize: '1.1rem',
                        zIndex: 1
                      }}>
                        {loginIdentifier.includes('@') ? <FaEnvelope /> : <FaPhone />}
                      </div>
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="Enter email or 10-digit phone number"
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderColor: loginError ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '1rem 1rem 1rem 3rem',
                          color: 'var(--color-white)',
                          fontFamily: 'var(--font-body)',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.border = '1px solid var(--color-primary)';
                          e.target.style.boxShadow = '0 0 0 3px rgba(255, 0, 60, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-gray)',
                      marginTop: '0.5rem',
                      fontFamily: 'var(--font-body)'
                    }}>
                      {loginIdentifier.includes('@') 
                        ? 'We\'ll use your email as your unique identifier'
                        : 'We\'ll automatically add +91 country code for India'
                      }
                    </p>
                  </div>

                  {loginError && (
                    <div style={{
                      background: 'rgba(255, 0, 0, 0.1)',
                      border: '1px solid rgba(255, 0, 0, 0.3)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      marginBottom: '1rem',
                      color: '#ff6b6b',
                      fontSize: '0.9rem'
                    }}>
                      {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoginLoading || !loginIdentifier.trim()}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, var(--color-primary), rgba(255, 0, 60, 0.8))',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '1rem',
                      color: 'var(--color-white)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 20px rgba(255, 0, 60, 0.3)',
                      opacity: isLoginLoading || !loginIdentifier.trim() ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!e.target.disabled) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 25px rgba(255, 0, 60, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 20px rgba(255, 0, 60, 0.3)';
                    }}
                  >
                    {isLoginLoading ? 'Logging in...' : 'Login'}
                  </button>
                </form>

                <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-gray)',
                  textAlign: 'center',
                  marginTop: '1rem',
                  fontFamily: 'var(--font-body)'
                }}>
                  No password required! Just enter your phone or email to start chatting.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </AnimatePresence>
  );
};

export default Chat;
