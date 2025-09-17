// Create a scrollable mobile-first section for KIIK 69 Party Packages
// Each package appears as a visually styled card with clean layout, icons, and sports theme

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaUsers, FaClock, FaUtensils, FaWineGlassAlt, FaGamepad, FaStar, FaCheckCircle, FaPhone } from 'react-icons/fa';

const packages = [
  {
    id: 1,
    title: "Power Play",
    price: "₹1300",
    originalPrice: "",
    discount: "+ 5% Taxes",
    badge: "FOOD ONLY",
    icon: "🏆",
    color: "from-green-500 to-emerald-600",
    items: [
      { icon: <FaUtensils />, text: "Bar Snack: Peanut Masala (on table throughout the party)" },
      { icon: <FaUtensils />, text: "Starters: 3 Veg & 3 Non-Veg (passing around for 90 mins)" },
      { icon: <FaUtensils />, text: "Main Course (60 mins): 2 Veg & 2 Non-Veg, 1 Dal, Steam Rice, Roti & Naan Basket, 2 Salads" },
      { icon: <FaUtensils />, text: "Dessert: 1 Ice Cream, 1 Gulab Jamun" },
      { icon: <FaGamepad />, text: "Access to all games included" },
      { icon: <FaGamepad />, text: "Bowling: ₹300 extra (Mon-Thu) | ₹400 extra (Fri-Sun)" },
    ],
  },
  {
    id: 2,
    title: "Super Sixer",
    price: "₹1800",
    originalPrice: "",
    discount: "+ 5% Taxes",
    badge: "BEST VALUE",
    icon: "🏏",
    color: "from-blue-500 to-cyan-600",
    items: [
      { icon: <FaWineGlassAlt />, text: "Drinks: 3 KF & BUD Craft Beers per head" },
      { icon: <FaUtensils />, text: "Bar Snack: Peanut Masala (on table throughout the party)" },
      { icon: <FaUtensils />, text: "Starters: 3 Veg & 3 Non-Veg (passing around for 90 mins)" },
      { icon: <FaUtensils />, text: "Main Course (60 mins): 2 Veg & 2 Non-Veg, 1 Dal, Steam Rice, Roti & Naan Basket, 2 Salads" },
      { icon: <FaUtensils />, text: "Dessert: 1 Ice Cream, 1 Gulab Jamun" },
      { icon: <FaGamepad />, text: "Access to all games included" },
      { icon: <FaGamepad />, text: "Bowling: ₹300 extra (Mon-Thu) | ₹400 extra (Fri-Sun)" },
    ],
  },
  {
    id: 3,
    title: "Hat-Trick Hero",
    price: "₹2100",
    originalPrice: "",
    discount: "+ 5% Taxes",
    badge: "PREMIUM",
    icon: "⚽",
    color: "from-purple-500 to-violet-600",
    items: [
      { icon: <FaWineGlassAlt />, text: "Unlimited Indian Made Liquor for 120 mins (Blenders Pride & Equivalent + KF & BUD Craft Beers)" },
      { icon: <FaUtensils />, text: "Bar Snack: Peanut Masala (on table throughout the party)" },
      { icon: <FaUtensils />, text: "Starters: 3 Veg & 3 Non-Veg (passing around for 90 mins)" },
      { icon: <FaUtensils />, text: "Main Course (60 mins): 2 Veg & 2 Non-Veg, 1 Dal, Steam Rice, Roti & Naan Basket, 2 Salads" },
      { icon: <FaUtensils />, text: "Dessert: 1 Ice Cream, 1 Gulab Jamun" },
      { icon: <FaGamepad />, text: "Access to all games included" },
      { icon: <FaGamepad />, text: "Bowling: ₹300 extra (Mon-Thu) | ₹400 extra (Fri-Sun)" },
    ],
  },
  {
    id: 4,
    title: "Master Blaster",
    price: "₹2500",
    originalPrice: "",
    discount: "+ 5% Taxes",
    badge: "ELITE",
    icon: "🏏",
    color: "from-orange-500 to-amber-600",
    items: [
      { icon: <FaWineGlassAlt />, text: "Unlimited Indian Made Foreign Liquor for 120 mins (100 Pipers & Equivalent + KF & BUD Craft Beers)" },
      { icon: <FaUtensils />, text: "Bar Snack: Peanut Masala (on table throughout the party)" },
      { icon: <FaUtensils />, text: "Starters: 3 Veg & 3 Non-Veg (passing around for 90 mins)" },
      { icon: <FaUtensils />, text: "Main Course (60 mins): 2 Veg & 2 Non-Veg, 1 Dal, Steam Rice, Roti & Naan Basket, 2 Salads" },
      { icon: <FaUtensils />, text: "Dessert: 1 Ice Cream, 1 Gulab Jamun" },
      { icon: <FaGamepad />, text: "Access to all games included" },
      { icon: <FaGamepad />, text: "Bowling: ₹300 extra (Mon-Thu) | ₹400 extra (Fri-Sun)" },
    ],
  },
  {
    id: 5,
    title: "Champions League",
    price: "₹2900",
    originalPrice: "",
    discount: "+ 5% Taxes",
    badge: "VIP",
    icon: "🏆",
    color: "from-yellow-500 to-orange-600",
    items: [
      { icon: <FaWineGlassAlt />, text: "Unlimited Foreign Liquor for 120 mins (Ballantine's & Equivalent + KF & BUD Craft Beers)" },
      { icon: <FaUtensils />, text: "Bar Snack: Peanut Masala (on table throughout the party)" },
      { icon: <FaUtensils />, text: "Starters: 3 Veg & 3 Non-Veg (passing around for 90 mins)" },
      { icon: <FaUtensils />, text: "Main Course (60 mins): 2 Veg & 2 Non-Veg, 1 Dal, Steam Rice, Roti & Naan Basket, 2 Salads" },
      { icon: <FaUtensils />, text: "Dessert: 1 Ice Cream, 1 Gulab Jamun" },
      { icon: <FaGamepad />, text: "Access to all games included" },
      { icon: <FaGamepad />, text: "Bowling: ₹300 extra (Mon-Thu) | ₹400 extra (Fri-Sun)" },
    ],
  },
  {
    id: 6,
    title: "Hall of Fame",
    price: "₹3200",
    originalPrice: "",
    discount: "+ 5% Taxes",
    badge: "LUXURY",
    icon: "👑",
    color: "from-amber-500 to-yellow-600",
    items: [
      { icon: <FaWineGlassAlt />, text: "Unlimited Foreign Liquor for 120 mins (Jack Daniels, Jameson & Equivalent + KF & BUD Craft Beers)" },
      { icon: <FaUtensils />, text: "Bar Snack: Peanut Masala (on table throughout the party)" },
      { icon: <FaUtensils />, text: "Starters: 3 Veg & 3 Non-Veg (passing around for 90 mins)" },
      { icon: <FaUtensils />, text: "Main Course (60 mins): 2 Veg & 2 Non-Veg, 1 Dal, Steam Rice, Roti & Naan Basket, 2 Salads" },
      { icon: <FaUtensils />, text: "Dessert: 1 Ice Cream, 1 Gulab Jamun" },
      { icon: <FaGamepad />, text: "Access to all games included" },
      { icon: <FaGamepad />, text: "Bowling: ₹300 extra (Mon-Thu) | ₹400 extra (Fri-Sun)" },
    ],
  },
  {
    id: 7,
    title: "World Cup Edition",
    price: "₹3900",
    originalPrice: "",
    discount: "+ 5% Taxes",
    badge: "ULTIMATE",
    icon: "🌍",
    color: "from-red-500 to-pink-600",
    items: [
      { icon: <FaWineGlassAlt />, text: "Unlimited Premium Foreign Liquor for 120 mins (Dewars 15 Years, Black Label, JD, Jameson & Equivalent + KF & BUD Craft & Bottled Beers)" },
      { icon: <FaUtensils />, text: "Bar Snack: Peanut Masala (on table throughout the party)" },
      { icon: <FaUtensils />, text: "Starters: 3 Veg & 3 Non-Veg (passing around for 90 mins)" },
      { icon: <FaUtensils />, text: "Main Course (60 mins): 2 Veg & 2 Non-Veg, 1 Dal, Steam Rice, Roti & Naan Basket, 2 Salads" },
      { icon: <FaUtensils />, text: "Dessert: 1 Ice Cream, 1 Gulab Jamun" },
      { icon: <FaGamepad />, text: "Access to all games included" },
      { icon: <FaGamepad />, text: "Bowling: ₹300 extra (Mon-Thu) | ₹400 extra (Fri-Sun)" },
    ],
  },
];

export default function PartyPackages() {
  const [selectedPackage, setSelectedPackage] = useState(null);

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
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #ffd700 0%, #ff6b35 50%, #ff003c 100%)',
            borderRadius: '50%',
            marginBottom: '1.5rem',
            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)'
          }}>
            <FaCrown style={{ fontSize: '2rem', color: '#000' }} />
          </div>
          
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-heading)',
            marginBottom: '1rem',
            fontWeight: '400'
          }}>
            Party Packages
          </h2>
          <h3 style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            color: 'var(--color-gray)',
            marginBottom: '1.5rem',
            fontWeight: '400'
          }}>
            Choose Your Championship Experience
          </h3>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
            color: 'var(--color-gray)',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            From Power Play to World Cup Edition, every package is designed to deliver an unforgettable night of unlimited food, drinks, and entertainment.
          </p>
        </motion.div>

        {/* Package Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              style={{
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onClick={() => setSelectedPackage(selectedPackage === pkg.id ? null : pkg.id)}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Card Container */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(15px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
              }}>
                {/* Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  padding: '0.5rem 1rem',
                  background: `linear-gradient(135deg, ${pkg.color})`,
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  color: '#fff',
                  zIndex: 10
                }}>
                  {pkg.badge}
                </div>


                {/* Package Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80px',
                    height: '80px',
                    background: `linear-gradient(135deg, ${pkg.color})`,
                    borderRadius: '20px',
                    marginBottom: '1rem',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                  }}>
                    <span style={{ fontSize: '2rem' }}>{pkg.icon}</span>
                  </div>
                  
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'var(--color-white)',
                    marginBottom: '0.5rem'
                  }}>
                    {pkg.title}
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#ffd700'
                    }}>
                      {pkg.price}
                    </span>
                    <span style={{
                      fontSize: '0.9rem',
                      color: 'var(--color-gray)',
                      background: 'rgba(255, 215, 0, 0.1)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 215, 0, 0.2)'
                    }}>
                      {pkg.discount}
                    </span>
                  </div>
                  
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-gray)',
                    margin: 0
                  }}>
                    per person
                  </p>
                </div>

                {/* Package Features */}
                <AnimatePresence>
                  {selectedPackage === pkg.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ marginBottom: '1.5rem' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {pkg.items.map((item, idx) => (
                          <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <div style={{
                              color: '#ffd700',
                              fontSize: '1rem',
                              marginTop: '0.125rem'
                            }}>
                              {item.icon}
                            </div>
                            <span style={{
                              fontSize: '0.9rem',
                              color: 'var(--color-gray)',
                              lineHeight: '1.4'
                            }}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick Preview */}
                {selectedPackage !== pkg.id && (
                  <div style={{
                    textAlign: 'center',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <p style={{
                      fontSize: '0.9rem',
                      color: 'var(--color-gray)',
                      marginBottom: '0.5rem'
                    }}>
                      Click to see full details
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '0.25rem'
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        background: '#ffd700',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite'
                      }}></div>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        background: '#ff6b35',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite 0.3s'
                      }}></div>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        background: '#ff003c',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite 0.6s'
                      }}></div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                                 <motion.button
                   style={{
                     width: '100%',
                     padding: '1rem',
                     marginTop: '1.5rem',
                     border: '1px solid rgba(255, 255, 255, 0.2)',
                     borderRadius: '12px',
                     background: selectedPackage === pkg.id 
                       ? `linear-gradient(135deg, ${pkg.color})`
                       : 'rgba(255, 255, 255, 0.1)',
                     color: 'var(--color-white)',
                     fontSize: '1rem',
                     fontWeight: '600',
                     cursor: 'pointer',
                     transition: 'all 0.3s ease'
                   }}
                  whileHover={{
                    background: selectedPackage === pkg.id 
                      ? `linear-gradient(135deg, ${pkg.color})`
                      : 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-2px)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {selectedPackage === pkg.id ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <FaCheckCircle />
                      Selected
                    </span>
                  ) : (
                    'Select Package'
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Terms & Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            maxWidth: '1200px',
            margin: '0 auto 3rem auto'
          }}
        >
          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(15px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #ff003c, #ff6b35)',
                borderRadius: '15px',
                marginBottom: '1rem'
              }}>
                <FaStar style={{ fontSize: '1.5rem', color: '#fff' }} />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--color-white)',
                marginBottom: '0.5rem'
              }}>
                Important Information
              </h3>
              <p style={{
                fontSize: '1rem',
                color: 'var(--color-gray)',
                margin: 0
              }}>
                Everything you need to know about our party packages
              </p>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {[
                { icon: <FaUsers />, title: "Group Size", text: "Minimum 25 pax" },
                { icon: <FaClock />, title: "Duration", text: "3 hours party time" },
                { icon: <FaUtensils />, title: "Service", text: "90 mins starters, 120 mins drinks" },
                { icon: <FaWineGlassAlt />, title: "Age Limit", text: "21+ for alcohol" }
              ].map((item, idx) => (
                <div key={idx} style={{
                  textAlign: 'center',
                  padding: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  minHeight: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    color: '#ffd700',
                    fontSize: '1.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    {item.icon}
                  </div>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: 'var(--color-white)',
                    marginBottom: '0.25rem'
                  }}>
                    {item.title}
                  </h4>
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-gray)',
                    margin: 0
                  }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ textAlign: 'center' }}
        >
          <motion.button
            style={{
              display: 'inline-flex',
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
            <FaPhone style={{ fontSize: '1.2rem' }} />
            Book Your Championship Party
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
