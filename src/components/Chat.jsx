import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane, FaUser, FaRobot, FaSpinner } from 'react-icons/fa';
import { getCurrentUser, isLoggedIn, getGuestSessionId } from '../lib/chatAuth';
import { getNavigationButtonsForMessage, handleNavigationClick } from '../lib/chatNavigation';
import ChatNavigationButtons from './ChatNavigationButtons';
import LoginModal from './LoginModal';

const Chat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize chat
  useEffect(() => {
    if (isOpen) {
      initializeChat();
      // Focus input when chat opens
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300);
    }
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadChatHistory();
    } else {
      // Guest user
      setUser({ 
        name: 'Guest', 
        sessionId: getGuestSessionId(),
        isGuest: true 
      });
      addWelcomeMessage();
    }
  };

  const addWelcomeMessage = () => {
    const welcomeMessage = {
      id: Date.now(),
      text: "Hi! I'm KIKKI, your virtual assistant for KIIK69 Sports Bar! 🎉 I can help you with our menu, party packages, games, timings, and more. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
      navigationButtons: getNavigationButtonsForMessage("welcome")
    };
    setMessages([welcomeMessage]);
  };

  const loadChatHistory = async () => {
    try {
      // This would load from the backend in a real implementation
      // For now, we'll just show the welcome message
      addWelcomeMessage();
    } catch (error) {
      console.error('Error loading chat history:', error);
      addWelcomeMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      isBot: false,
      timestamp: new Date(),
      user: user.name
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate bot response (in real implementation, this would call the backend)
      const botResponse = await generateBotResponse(inputMessage.trim());
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse.text,
        isBot: true,
        timestamp: new Date(),
        navigationButtons: botResponse.navigationButtons
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble right now. Please try again or contact us directly! 📞",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateBotResponse = async (userMessage) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const message = userMessage.toLowerCase();
    
    // Menu related responses
    if (message.includes('menu') || message.includes('food') || message.includes('eat')) {
      return {
        text: "🍽️ We have an amazing menu with starters, burgers, pizzas, Indian cuisine, Chinese dishes, and more! Our food is fresh and delicious. Would you like to see our full menu?",
        navigationButtons: getNavigationButtonsForMessage(userMessage)
      };
    }

    // Drinks related responses
    if (message.includes('drink') || message.includes('alcohol') || message.includes('beer') || message.includes('cocktail')) {
      return {
        text: "🍹 We have an extensive drinks menu including premium spirits, cocktails, craft beers, and mocktails! From Grey Goose to local favorites, we've got you covered. Check out our drinks menu!",
        navigationButtons: getNavigationButtonsForMessage(userMessage)
      };
    }

    // Party packages
    if (message.includes('party') || message.includes('package') || message.includes('booking') || message.includes('event')) {
      return {
        text: "🎉 We offer amazing party packages for all occasions! From birthday parties to corporate events, we have packages that include food, drinks, and entertainment. Let me show you our packages!",
        navigationButtons: getNavigationButtonsForMessage(userMessage)
      };
    }

    // Games
    if (message.includes('game') || message.includes('play') || message.includes('carrom') || message.includes('pool')) {
      return {
        text: "🎮 We have awesome games including carrom, pool, foosball, and more! It's the perfect place to have fun with friends while enjoying great food and drinks.",
        navigationButtons: getNavigationButtonsForMessage(userMessage)
      };
    }

    // Timings
    if (message.includes('time') || message.includes('open') || message.includes('close') || message.includes('hour')) {
      return {
        text: "🕐 We're open daily from 12:00 PM to 1:00 AM! Perfect for lunch, dinner, or late-night fun. Come visit us anytime!",
        navigationButtons: getNavigationButtonsForMessage(userMessage)
      };
    }

    // Location
    if (message.includes('location') || message.includes('address') || message.includes('where') || message.includes('map')) {
      return {
        text: "📍 We're located in Gachibowli, Hyderabad! Easy to find and accessible. Get directions to our location!",
        navigationButtons: getNavigationButtonsForMessage(userMessage)
      };
    }

    // Contact
    if (message.includes('contact') || message.includes('phone') || message.includes('call') || message.includes('whatsapp')) {
      return {
        text: "📞 You can reach us at +91 9274696969 or WhatsApp us directly! We're here to help with reservations and any questions you might have.",
        navigationButtons: getNavigationButtonsForMessage(userMessage)
      };
    }

    // Social media
    if (message.includes('instagram') || message.includes('facebook') || message.includes('social')) {
      return {
        text: "📸 Follow us on Instagram and Facebook for the latest updates, events, and mouth-watering food photos! Check out our social media!",
        navigationButtons: getNavigationButtonsForMessage(userMessage)
      };
    }

    // Greeting
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return {
        text: "Hello! 👋 Welcome to KIIK69 Sports Bar! I'm KIKKI, your virtual assistant. How can I help you today?",
        navigationButtons: getNavigationButtonsForMessage(userMessage)
      };
    }

    // Default response
    return {
      text: "Thanks for your message! 😊 I'm here to help you with information about our menu, party packages, games, timings, and more. Feel free to ask me anything about KIIK69 Sports Bar!",
      navigationButtons: getNavigationButtonsForMessage(userMessage)
    };
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNavigationButtonClick = (action) => {
    handleNavigationClick(action);
    // Close chat after navigation for better UX
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
    // Reload chat history for logged-in user
    loadChatHistory();
  };

  if (!isOpen) return null;

  return (
    <>
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
          backdropFilter: 'blur(10px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        data-chat-modal
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            width: '100%',
            maxWidth: '500px',
            height: '80vh',
            maxHeight: '600px',
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(255, 0, 60, 0.1), rgba(0, 0, 0, 0.1))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-primary), #ff6b9d)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                🤖
              </div>
              <div>
                <h3 style={{
                  margin: 0,
                  color: 'var(--color-white)',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  fontFamily: 'var(--font-body)'
                }}>
                  KIKKI Assistant
                </h3>
                <p style={{
                  margin: 0,
                  color: 'var(--color-gray)',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-body)'
                }}>
                  {user?.isGuest ? 'Guest User' : user?.name || 'User'}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-gray)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '50%',
                transition: 'all 0.3s ease'
              }}
            >
              <FaTimes />
            </motion.button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.isBot ? 'flex-start' : 'flex-end',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexDirection: message.isBot ? 'row' : 'row-reverse'
                  }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: message.isBot 
                        ? 'linear-gradient(135deg, var(--color-primary), #ff6b9d)'
                        : 'linear-gradient(135deg, #4CAF50, #45a049)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      flexShrink: 0
                    }}>
                      {message.isBot ? <FaRobot /> : <FaUser />}
                    </div>
                    <div style={{
                      maxWidth: '80%',
                      padding: '0.75rem 1rem',
                      borderRadius: message.isBot ? '20px 20px 20px 5px' : '20px 20px 5px 20px',
                      background: message.isBot 
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'linear-gradient(135deg, var(--color-primary), #ff6b9d)',
                      color: 'var(--color-white)',
                      fontSize: '0.9rem',
                      lineHeight: '1.4',
                      fontFamily: 'var(--font-body)',
                      wordWrap: 'break-word'
                    }}>
                      {message.text}
                    </div>
                  </div>
                  
                  {/* Navigation buttons for bot messages */}
                  {message.navigationButtons && message.navigationButtons.length > 0 && (
                    <ChatNavigationButtons
                      buttons={message.navigationButtons}
                      onButtonClick={handleNavigationButtonClick}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  alignSelf: 'flex-start'
                }}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-primary), #ff6b9d)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem'
                }}>
                  <FaRobot />
                </div>
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '20px 20px 20px 5px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--color-white)',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                  KIKKI is typing...
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(0, 0, 0, 0.3)'
          }}>
            {user?.isGuest && (
              <div style={{
                marginBottom: '0.75rem',
                padding: '0.5rem',
                background: 'rgba(255, 193, 7, 0.1)',
                border: '1px solid rgba(255, 193, 7, 0.3)',
                borderRadius: '10px',
                fontSize: '0.8rem',
                color: 'var(--color-gray)',
                textAlign: 'center'
              }}>
                💡 <button 
                  onClick={handleLogin}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  Login
                </button> to save your chat history
              </div>
            )}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-end'
            }}>
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about KIIK69 Sports Bar..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  minHeight: '40px',
                  maxHeight: '120px',
                  padding: '0.75rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--color-white)',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-body)',
                  resize: 'none',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary)';
                  e.target.style.boxShadow = '0 0 0 2px rgba(255, 0, 60, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: 'none',
                  background: inputMessage.trim() && !isLoading 
                    ? 'linear-gradient(135deg, var(--color-primary), #ff6b9d)'
                    : 'rgba(255, 255, 255, 0.2)',
                  color: 'var(--color-white)',
                  cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <FaPaperPlane />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default Chat;

