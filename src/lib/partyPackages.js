import { backendConfig } from './config.js';

const API_BASE_URL = backendConfig.url
  ? `${backendConfig.url}/api/party-packages`
  : 'http://localhost:5001/api/party-packages';

/**
 * Fetch all active party packages from the backend
 * @returns {Promise<Array>} Array of party packages
 */
export const fetchPartyPackages = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    
    if (!response.ok) {
      throw new Error('Failed to fetch party packages');
    }
    
    const data = await response.json();
    return data.packages || [];
  } catch (error) {
    console.error('Error fetching party packages:', error);
    // Return fallback data if API fails
    return getFallbackPackages();
  }
};

/**
 * Fetch a specific party package by ID
 * @param {number} id - Package ID
 * @returns {Promise<Object>} Party package object
 */
export const fetchPartyPackageById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error('Party package not found');
    }
    
    const data = await response.json();
    return data.package;
  } catch (error) {
    console.error('Error fetching party package:', error);
    throw error;
  }
};

/**
 * Fallback party packages data (used if API is unavailable)
 * @returns {Array} Array of fallback party packages
 */
const getFallbackPackages = () => [
  {
    id: 1,
    name: "Power Play",
    description: "Perfect for small groups and casual gatherings",
    price: 2999,
    features: [
      "2 hours of gaming",
      "Unlimited soft drinks",
      "Snacks platter",
      "Basic sound system",
      "Up to 8 people"
    ],
    image_url: "/images/packages/power-play.jpg",
    is_active: true
  },
  {
    id: 2,
    name: "Game Changer",
    description: "Ideal for medium-sized parties with enhanced gaming experience",
    price: 5999,
    features: [
      "4 hours of premium gaming",
      "Unlimited beverages (soft drinks + mocktails)",
      "Deluxe snacks & starters",
      "Premium sound system",
      "Gaming tournament setup",
      "Up to 15 people"
    ],
    image_url: "/images/packages/game-changer.jpg",
    is_active: true
  },
  {
    id: 3,
    name: "World Cup Edition",
    description: "Ultimate sports bar experience for large groups",
    price: 9999,
    features: [
      "6 hours of unlimited gaming",
      "All-inclusive food & beverages",
      "Premium sound & lighting system",
      "Multiple gaming zones",
      "Dedicated host",
      "Photo booth",
      "Up to 25 people"
    ],
    image_url: "/images/packages/world-cup.jpg",
    is_active: true
  },
  {
    id: 4,
    name: "VIP Experience",
    description: "Luxury package with exclusive amenities",
    price: 14999,
    features: [
      "8 hours of premium gaming",
      "Gourmet food & premium drinks",
      "Private gaming lounge",
      "Professional DJ setup",
      "Custom decorations",
      "Dedicated staff",
      "Up to 30 people"
    ],
    image_url: "/images/packages/vip-experience.jpg",
    is_active: true
  }
];
