import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import ChatNavigationButtons from './ChatNavigationButtons';
import { getNavigationButtonsForMessage, handleNavigationClick } from '../lib/chatNavigation.js';
import { loginUser, getCurrentUser, logoutUser, saveChatMessage, getChatHistory } from '../lib/chatAuth.js';

const ChatFullScreen = ({ isOpen, onClose, onBackToMain }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatBodyRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history when component mounts
  useEffect(() => {
    if (isOpen && currentUser) {
      loadChatHistory();
    }
  }, [isOpen, currentUser]);

  // Load chat history from backend
  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory();
      if (history && history.length > 0) {
        setMessages(history);
      } else {
        // Add welcome message if no history
        setMessages([
          {
            id: Date.now(),
            text: "Hey! Welcome to KIIK69 Sports Bar! 🍻\n\nI'm here to help you with:\n• Menu & Food 🍽️\n• Party Packages 🎉\n• Games & Entertainment 🎮\n• Timings & Location 📍\n\nWhat would you like to know?",
            isBot: true,
            timestamp: new Date()
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Add welcome message as fallback
      setMessages([
        {
          id: Date.now(),
          text: "Hey! Welcome to KIIK69 Sports Bar! 🍻\n\nI'm here to help you with:\n• Menu & Food 🍽️\n• Party Packages 🎉\n• Games & Entertainment 🎮\n• Timings & Location 📍\n\nWhat would you like to know?",
          isBot: true,
          timestamp: new Date()
        }
      ]);
    }
  };

  // Handle login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your phone number or email');
      return;
    }

    setIsLoginLoading(true);
    setLoginError('');

    try {
      const user = await loginUser(loginIdentifier);
      setCurrentUser(user);
      setShowLoginPopup(false);
      setLoginIdentifier('');
      await loadChatHistory();
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setMessages([]);
  };

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentUser) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Save user message
      await saveChatMessage(inputMessage, false);

      // Simulate bot thinking
      setTimeout(async () => {
        // Get navigation buttons for the message
        const navigationButtons = getNavigationButtonsForMessage(inputMessage);
        
        // Generate bot response
        const botResponse = generateBotResponse(inputMessage, navigationButtons);
        
        const botMessage = {
          id: Date.now() + 1,
          text: botResponse,
          isBot: true,
          timestamp: new Date(),
          navigationButtons: navigationButtons
        };

        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);

        // Save bot message
        await saveChatMessage(botResponse, true);
      }, 1000 + Math.random() * 1000); // Random delay for natural feel

    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  // Generate bot response
  const generateBotResponse = (userMessage, navigationButtons) => {
    const message = userMessage.toLowerCase();
    
    // Check for specific keywords and provide relevant responses
    if (message.includes('menu') || message.includes('food') || message.includes('eat')) {
      return "🍽️ Our menu features delicious starters, main courses, and desserts! We also have a great selection of drinks and cocktails. Would you like to see our full menu?";
    }
    
    if (message.includes('party') || message.includes('package') || message.includes('booking')) {
      return "🎉 We offer amazing party packages starting from 25 people! Our packages include food, drinks, and entertainment. Perfect for birthdays, corporate events, and celebrations!";
    }
    
    if (message.includes('game') || message.includes('pool') || message.includes('carrom')) {
      return "🎮 We have multiple gaming zones with pool tables, carroms, foosball, and more! It's the perfect place to have fun with friends while enjoying great food and drinks.";
    }
    
    if (message.includes('time') || message.includes('open') || message.includes('close')) {
      return "🕐 We're open daily from 12:00 PM to 2:00 AM! Perfect for lunch, dinner, or late-night fun. Come join us anytime!";
    }
    
    if (message.includes('location') || message.includes('where') || message.includes('address')) {
      return "📍 We're located in Gachibowli, Hyderabad! Easy to find and accessible. Great location for both locals and visitors.";
    }
    
    if (message.includes('price') || message.includes('cost') || message.includes('expensive')) {
      return "💰 Our prices are very reasonable! We offer great value for money with quality food, drinks, and entertainment. Come check us out!";
    }
    
    // Default response
    return "Thanks for your message! I'm here to help you with anything about KIIK69 Sports Bar. Feel free to ask about our menu, party packages, games, or anything else!";
  };

  // Handle enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#0a0a0a',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 20, 0.9))',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <button
              onClick={onBackToMain}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              whileHover={{ scale: 1.1 }}
            >
              <FaArrowLeft />
            </button>
            <div>
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#ffffff',
                margin: 0
              }}>
                KIIK69 Chat
              </h2>
              <p style={{
                fontSize: '0.8rem',
                color: '#888888',
                margin: 0
              }}>
                {currentUser ? `Logged in as ${currentUser.identifier}` : 'Please login to chat'}
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {currentUser ? (
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(255, 0, 60, 0.8)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => setShowLoginPopup(true)}
                style={{
                  background: 'rgba(0, 150, 255, 0.8)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Login
              </button>
            )}
            
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#ffffff',
                fontSize: '1.2rem',
                padding: '0.5rem',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div 
          ref={chatBodyRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            paddingBottom: '5rem', // Space for input bar
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.isBot ? 'flex-start' : 'flex-end',
                marginBottom: '0.5rem'
              }}
            >
              <div style={{
                maxWidth: '80%',
                padding: '0.75rem 1rem',
                borderRadius: '18px',
                background: message.isBot 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'linear-gradient(135deg, rgba(255, 0, 60, 0.9), rgba(255, 0, 60, 0.7))',
                color: '#ffffff',
                fontSize: '0.9rem',
                lineHeight: '1.4',
                wordWrap: 'break-word',
                borderBottomLeftRadius: message.isBot ? '4px' : '18px',
                borderBottomRightRadius: message.isBot ? '18px' : '4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}>
                {message.text}
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '18px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#888888',
                fontSize: '0.9rem',
                fontStyle: 'italic'
              }}>
                KIIK69 is typing...
              </div>
            </div>
          )}

          {/* Navigation buttons for last bot message */}
          {messages.length > 0 && 
           messages[messages.length - 1].isBot && 
           messages[messages.length - 1].navigationButtons && (
            <ChatNavigationButtons 
              buttons={messages[messages.length - 1].navigationButtons}
              onButtonClick={handleNavigationClick}
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Fixed Input Bar */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 10001
        }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={currentUser ? "Type your message..." : "Login to start chatting..."}
            disabled={!currentUser}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '25px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!currentUser || !inputMessage.trim()}
            style={{
              padding: '0.75rem',
              borderRadius: '50%',
              border: 'none',
              background: currentUser && inputMessage.trim() 
                ? 'linear-gradient(135deg, rgba(255, 0, 60, 0.9), rgba(255, 0, 60, 0.7))'
                : 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              cursor: currentUser && inputMessage.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              transform: currentUser && inputMessage.trim() ? 'scale(1)' : 'scale(0.9)'
            }}
          >
            <FaPaperPlane />
          </button>
        </div>

        {/* Login Popup */}
        {showLoginPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '2rem',
              width: '90%',
              maxWidth: '400px',
              zIndex: 10002
            }}
          >
            <h3 style={{
              fontSize: '1.5rem',
              color: '#ffffff',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              Login to Chat
            </h3>
            
            <form onSubmit={handleLoginSubmit}>
              <input
                type="text"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="Enter phone number or email"
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  marginBottom: '1rem',
                  outline: 'none'
                }}
              />
              
              {loginError && (
                <p style={{
                  color: '#ff6b6b',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  {loginError}
                </p>
              )}
              
              <div style={{
                display: 'flex',
                gap: '1rem'
              }}>
                <button
                  type="submit"
                  disabled={isLoginLoading}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, rgba(0, 150, 255, 0.9), rgba(0, 150, 255, 0.7))',
                    color: '#ffffff',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isLoginLoading ? 'Logging in...' : 'Login'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowLoginPopup(false)}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatFullScreen;
