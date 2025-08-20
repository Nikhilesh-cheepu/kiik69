// Environment configuration for KIIK 69
export const config = {
  // OpenAI Configuration
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
    maxTokens: parseInt(import.meta.env.VITE_OPENAI_MAX_TOKENS) || 600,
    temperature: parseFloat(import.meta.env.VITE_OPENAI_TEMPERATURE) || 0.7,
    timeout: parseInt(import.meta.env.VITE_OPENAI_TIMEOUT) || 30000
  },
  
  // Backend Configuration
  backend: {
    url: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
    apiEndpoints: {
      chatAuth: '/api/chat-auth',
      instagramBot: '/api/instagram-bot',
      assets: '/api/assets',
      health: '/api/health'
    }
  },
  
  // App Configuration
  app: {
    name: 'KIIK 69 Sports Bar',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development'
  }
};

// Validation function to check if required environment variables are set
export const validateEnvironment = () => {
  const required = [
    'VITE_OPENAI_API_KEY',
    'VITE_BACKEND_URL'
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    if (import.meta.env.MODE === 'production') {
      console.error('Critical: Missing required environment variables in production');
    }
  }
  
  return missing.length === 0;
};

// Export individual configs for backward compatibility
export const openaiConfig = config.openai;
export const backendConfig = config.backend;
export const appConfig = config.app;
