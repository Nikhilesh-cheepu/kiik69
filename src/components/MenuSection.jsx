import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUtensils, FaWineGlassAlt, FaFilter, FaShoppingCart, FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import { menuData } from '../data/menuData';

const MenuSection = () => {
  const [activeTab, setActiveTab] = useState('food');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartAnimation, setCartAnimation] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('kiik69_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kiik69_cart', JSON.stringify(cart));
  }, [cart]);

  // Get current menu data based on active tab
  const currentMenuData = menuData[activeTab];

  // Filter items based on search term and category
  const filteredItems = currentMenuData.items.filter(item => {
    const matchesSearch = searchTerm.trim() === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group items by category with custom sorting
  const groupedItems = filteredItems.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  // Sort items within each category by price
  Object.keys(groupedItems).forEach(category => {
    groupedItems[category].sort((a, b) => a.price - b.price);
  });

  // Custom sorting for categories
  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    if (activeTab === 'food') {
      // Food menu: Starters first, then Extras, then rest alphabetically
      if (a === 'Starters') return -1;
      if (b === 'Starters') return 1;
      if (a === 'Extras') return -1;
      if (b === 'Extras') return 1;
      return a.localeCompare(b);
    } else {
      // Liquor menu: Drink & Munch at 69 first, then rest alphabetically
      if (a === 'Drink & Munch at 69') return -1;
      if (b === 'Drink & Munch at 69') return 1;
      return a.localeCompare(b);
    }
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    setSelectedCategory('All');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  const handleAddToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      // Item already in cart - increase quantity
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      // Add new item to cart
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalCost = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowCart(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      style={{
        padding: '4rem 0 2rem 0',
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
            Our Menu
          </h2>
          <h3 style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            color: 'var(--color-gray)',
            marginBottom: '1.5rem',
            fontWeight: '400'
          }}>
            Browse over 100+ irresistible dishes & handcrafted drinks
          </h3>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
            color: 'var(--color-gray)',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            From sizzling starters and gourmet mains to signature cocktails and mocktails, discover why KIIK69 is Gachibowli's #1 choice for food, drinks, and vibes.
          </p>
        </motion.div>

        {/* Category Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3rem',
            flexWrap: 'wrap'
          }}
        >
          {[
            { icon: '🍛', label: 'Indian', category: 'Indian' },
            { icon: '🍜', label: 'Asian / Chinese', category: 'Chinese' },
            { icon: '🍸', label: 'Drinks & Cocktails', category: 'liquor' }
          ].map((tag, index) => (
                      <motion.button
            key={tag.label}
            onClick={() => {
              setActiveTab(tag.category === 'liquor' ? 'liquor' : 'food');
              setSelectedCategory(tag.category === 'liquor' ? 'All' : tag.category);
              openModal();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2rem',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(15px)',
              color: 'var(--color-white)',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
              position: 'relative',
              overflow: 'hidden'
            }}
            whileHover={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              transform: 'translateY(-3px)'
            }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            <span style={{ fontSize: '1.4rem' }}>{tag.icon}</span>
            {tag.label}
          </motion.button>
          ))}
        </motion.div>



        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}
        >
          <motion.button
            onClick={() => {
              setActiveTab('food');
              openModal();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1.25rem 2.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              color: 'var(--color-white)',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            whileHover={{
              scale: 1.02,
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              transform: 'translateY(-2px)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span style={{ fontSize: '1.3rem' }}>🔥</span>
            View All Dishes
          </motion.button>

          <motion.button
            onClick={() => {
              setActiveTab('liquor');
              openModal();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1.25rem 2.5rem',
              border: '1px solid rgba(255, 0, 60, 0.3)',
              borderRadius: '16px',
              background: 'rgba(255, 0, 60, 0.08)',
              backdropFilter: 'blur(20px)',
              color: 'var(--color-primary)',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 8px 32px rgba(255, 0, 60, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            whileHover={{
              scale: 1.02,
              background: 'rgba(255, 0, 60, 0.15)',
              border: '1px solid rgba(255, 0, 60, 0.5)',
              boxShadow: '0 12px 40px rgba(255, 0, 60, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              transform: 'translateY(-2px)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span style={{ fontSize: '1.3rem' }}>🍹</span>
            Drinks & Cocktails Only
          </motion.button>
        </motion.div>

        {/* Full Screen Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(15px)',
                zIndex: 1000,
                overflow: 'hidden'
              }}
            >
              {/* Modal Header */}
              <div style={{
                position: 'sticky',
                top: 0,
                background: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(20px)',
                padding: '1rem 2rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 1001
              }}>
                 {/* Cart Button */}
                 <motion.button
                   onClick={() => setShowCart(!showCart)}
                   style={{
                     display: 'flex',
                     alignItems: 'center',
                     gap: '0.5rem',
                     padding: '0.5rem 1rem',
                     border: 'none',
                     borderRadius: '8px',
                     background: 'rgba(255, 255, 255, 0.1)',
                     color: 'var(--color-white)',
                     cursor: 'pointer',
                     position: 'relative'
                   }}
                   whileHover={{ background: 'rgba(255, 255, 255, 0.2)' }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <FaShoppingCart />
                   <span>Cart</span>
                   {getTotalItems() > 0 && (
                     <motion.div
                       initial={{ scale: 0 }}
                       animate={{ scale: 1 }}
                       style={{
                         position: 'absolute',
                         top: '-8px',
                         right: '-8px',
                         background: 'var(--color-primary)',
                         color: 'var(--color-white)',
                         borderRadius: '50%',
                         width: '20px',
                         height: '20px',
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         fontSize: '0.8rem',
                         fontWeight: 'bold'
                       }}
                     >
                       {getTotalItems()}
                     </motion.div>
                   )}
                 </motion.button>

                {/* Close Button */}
                <motion.button
                  onClick={closeModal}
                  style={{
                    padding: '0.5rem',
                    border: 'none',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--color-white)',
                    cursor: 'pointer',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  whileHover={{ background: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <FaTimes />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div style={{
                height: 'calc(100vh - 80px)',
                overflow: 'auto',
                padding: '1rem 2rem'
              }}>
                {/* Tab Navigation */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '2rem',
                  gap: '1rem'
                }}>
                  {[
                    { id: 'food', label: 'Food Menu', icon: <FaUtensils /> },
                    { id: 'liquor', label: 'Liquor Menu', icon: <FaWineGlassAlt /> }
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        borderRadius: '8px',
                        background: activeTab === tab.id ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)',
                        color: 'var(--color-white)',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      whileHover={{ background: activeTab === tab.id ? 'rgba(255, 0, 60, 0.8)' : 'rgba(255, 255, 255, 0.2)' }}
                    >
                      {tab.icon}
                      {tab.label}
                    </motion.button>
                  ))}
                </div>

                {/* Search and Filter Controls */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  marginBottom: '2rem',
                  maxWidth: '800px',
                  margin: '0 auto 2rem auto'
                }}>
                  {/* Search Bar */}
                  <div style={{ position: 'relative' }}>
                    <FaSearch style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-gray)',
                      fontSize: '1rem'
                    }} />
                    <input
                      type="text"
                      placeholder={`Search ${activeTab === 'food' ? 'food' : 'drinks'}...`}
                      value={searchTerm}
                      onChange={handleSearchChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--color-white)',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Filter Controls */}
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaFilter style={{ color: 'var(--color-gray)', fontSize: '0.9rem' }} />
                      <span style={{ color: 'var(--color-gray)', fontSize: '0.9rem' }}>Filter by:</span>
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--color-white)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {currentMenuData.categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {(searchTerm || selectedCategory !== 'All') && (
                      <motion.button
                        onClick={clearFilters}
                        style={{
                          padding: '0.5rem 1rem',
                          border: '1px solid var(--color-primary)',
                          borderRadius: '25px',
                          background: 'rgba(255, 0, 60, 0.1)',
                          color: 'var(--color-primary)',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        whileHover={{
                          background: 'var(--color-primary)',
                          color: 'var(--color-white)'
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        Clear Filters
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Results Count */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: '2rem',
                  color: 'var(--color-gray)',
                  fontSize: '0.9rem'
                }}>
                  {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
                </div>

                {/* Menu Items List */}
                <div style={{
                  maxWidth: '800px',
                  margin: '0 auto'
                }}>
                  {sortedCategories.map(category => (
                    <div key={category} style={{ marginBottom: '2rem' }}>
                      <h3 style={{
                        color: 'var(--color-white)',
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        paddingBottom: '0.5rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        {category}
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {groupedItems[category].map((item) => (
                          <motion.div
                            key={item.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '1rem',
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '8px',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              transition: 'all 0.3s ease'
                            }}
                            whileHover={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{
                                color: 'var(--color-white)',
                                fontWeight: '500',
                                marginBottom: '0.25rem'
                              }}>
                                {item.name}
                              </div>
                              {item.description && (
                                <div style={{
                                  color: 'var(--color-gray)',
                                  fontSize: '0.85rem',
                                  marginBottom: '0.5rem'
                                }}>
                                  {item.description}
                                </div>
                              )}
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1rem'
                            }}>
                              <div style={{
                                color: '#ffd700',
                                fontWeight: '600',
                                fontSize: '1.1rem'
                              }}>
                                ₹{item.price}
                              </div>
                                                             <div style={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 gap: '0.5rem'
                               }}>
                                 {/* Quantity Display */}
                                 {cart.find(cartItem => cartItem.id === item.id) && (
                                   <div style={{
                                     display: 'flex',
                                     alignItems: 'center',
                                     gap: '0.25rem',
                                     padding: '0.25rem 0.5rem',
                                     background: 'rgba(255, 0, 60, 0.2)',
                                     borderRadius: '12px',
                                     border: '1px solid rgba(255, 0, 60, 0.3)'
                                   }}>
                                     <span style={{
                                       color: 'var(--color-primary)',
                                       fontSize: '0.8rem',
                                       fontWeight: '600'
                                     }}>
                                       {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                                     </span>
                                   </div>
                                 )}
                                 
                                 {/* Add Button */}
                                 <motion.button
                                   onClick={() => handleAddToCart(item)}
                                   style={{
                                     width: '32px',
                                     height: '32px',
                                     border: 'none',
                                     borderRadius: '50%',
                                     background: 'var(--color-primary)',
                                     color: 'var(--color-white)',
                                     cursor: 'pointer',
                                     display: 'flex',
                                     alignItems: 'center',
                                     justifyContent: 'center',
                                     fontSize: '0.9rem'
                                   }}
                                   whileHover={{ scale: 1.1 }}
                                   whileTap={{ scale: 0.9 }}
                                   transition={{ duration: 0.3 }}
                                 >
                                   <FaPlus />
                                 </motion.button>
                               </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cart Sidebar */}
        <AnimatePresence>
          {showCart && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: 'clamp(300px, 30vw, 400px)',
                height: '100vh',
                background: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                zIndex: 1002,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Cart Header */}
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{
                  color: 'var(--color-white)',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  margin: 0
                }}>
                  Your Cart
                </h3>
                <motion.button
                  onClick={() => setShowCart(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-gray)',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '0.25rem'
                  }}
                  whileHover={{ color: 'var(--color-white)' }}
                >
                  <FaTimes />
                </motion.button>
              </div>

              {/* Cart Warning */}
              {cart.length > 0 && (
                <div style={{
                  padding: '1rem 1.5rem',
                  background: 'rgba(255, 193, 7, 0.1)',
                  borderBottom: '1px solid rgba(255, 193, 7, 0.3)',
                  borderTop: '1px solid rgba(255, 193, 7, 0.3)'
                }}>
                  <div style={{
                    textAlign: 'center',
                    color: '#ffc107',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    lineHeight: '1.4'
                  }}>
                    🚫 Oops alert!<br />
                    Refresh or close the website = Empty cart.<br />
                    Gone. Like your ex. 💔
                  </div>
                </div>
              )}

              {/* Cart Items */}
              <div style={{
                flex: 1,
                overflow: 'auto',
                padding: '1rem 1.5rem'
              }}>
                {cart.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'var(--color-gray)'
                  }}>
                    <FaShoppingCart style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   {cart.map((item) => (
                     <div key={item.id} style={{
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'space-between',
                       padding: '1rem',
                       borderRadius: '8px',
                       background: 'rgba(255, 255, 255, 0.05)',
                       border: '1px solid rgba(255, 255, 255, 0.1)'
                     }}>
                       <div style={{ flex: 1 }}>
                         <div style={{
                           color: 'var(--color-white)',
                           fontWeight: '500',
                           marginBottom: '0.25rem'
                         }}>
                           {item.name}
                         </div>
                         <div style={{
                           color: '#ffd700',
                           fontWeight: '600'
                         }}>
                           ₹{item.price}
                         </div>
                       </div>
                       <div style={{
                         display: 'flex',
                         alignItems: 'center',
                         gap: '0.5rem'
                       }}>
                         <motion.button
                           onClick={() => updateQuantity(item.id, item.quantity - 1)}
                           style={{
                             width: '28px',
                             height: '28px',
                             border: 'none',
                             borderRadius: '4px',
                             background: 'rgba(255, 0, 60, 0.2)',
                             color: 'var(--color-white)',
                             cursor: 'pointer',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center'
                           }}
                           whileHover={{ background: 'rgba(255, 0, 60, 0.3)' }}
                         >
                           -
                         </motion.button>
                         <span style={{
                           color: 'var(--color-white)',
                           fontWeight: '600',
                           minWidth: '20px',
                           textAlign: 'center'
                         }}>
                           {item.quantity}
                         </span>
                         <motion.button
                           onClick={() => updateQuantity(item.id, item.quantity + 1)}
                           style={{
                             width: '28px',
                             height: '28px',
                             border: 'none',
                             borderRadius: '4px',
                             background: 'var(--color-primary)',
                             color: 'var(--color-white)',
                             cursor: 'pointer',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center'
                           }}
                           whileHover={{ background: 'rgba(255, 0, 60, 0.8)' }}
                         >
                           +
                         </motion.button>
                       </div>
                     </div>
                   ))}
                 </div>
                )}
              </div>

                             {/* Cart Footer */}
               {cart.length > 0 && (
                 <div style={{
                   padding: '1rem 1.5rem',
                   borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                   background: 'rgba(0, 0, 0, 0.5)'
                 }}>
                   <div style={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     marginBottom: '1rem'
                   }}>
                     <span style={{ color: 'var(--color-white)', fontWeight: '600' }}>
                       Total:
                     </span>
                     <span style={{
                       color: '#ffd700',
                       fontSize: '1.2rem',
                       fontWeight: 'bold'
                     }}>
                       ₹{getTotalCost()}
                     </span>
                   </div>
                   
                   {/* Clear Cart Button */}
                   <motion.button
                     onClick={clearCart}
                     style={{
                       width: '100%',
                       padding: '0.75rem',
                       marginBottom: '1rem',
                       border: '1px solid rgba(255, 0, 60, 0.3)',
                       borderRadius: '8px',
                       background: 'rgba(255, 0, 60, 0.1)',
                       color: 'var(--color-primary)',
                       cursor: 'pointer',
                       fontSize: '0.9rem',
                       fontWeight: '500',
                       transition: 'all 0.3s ease'
                     }}
                     whileHover={{
                       background: 'rgba(255, 0, 60, 0.2)',
                       border: '1px solid rgba(255, 0, 60, 0.5)'
                     }}
                     whileTap={{ scale: 0.95 }}
                   >
                     Clear Cart
                   </motion.button>
                   
                   <div style={{
                     fontSize: '0.9rem',
                     color: 'var(--color-gray)',
                     textAlign: 'center',
                     fontStyle: 'italic',
                     lineHeight: '1.4',
                     marginBottom: '1rem'
                   }}>
                     🧾 Show this cart to our staff. They'll take care of the rest 😉
                   </div>
                   
                   <div style={{
                     fontSize: '0.8rem',
                     color: '#ffc107',
                     textAlign: 'center',
                     fontWeight: '500',
                     padding: '0.75rem',
                     background: 'rgba(255, 193, 7, 0.1)',
                     borderRadius: '6px',
                     border: '1px solid rgba(255, 193, 7, 0.3)',
                     lineHeight: '1.3'
                   }}>
                     🚫 Oops alert! Refresh = Empty cart. Poof! 💔
                   </div>
                 </div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default MenuSection; 