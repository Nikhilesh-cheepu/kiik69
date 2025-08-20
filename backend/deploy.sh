#!/bin/bash

echo "🚀 Deploying KIIK 69 Backend to Railway..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is not set"
    echo "Please set DATABASE_URL in Railway environment variables"
    exit 1
fi

echo "✅ Environment variables configured"
echo "🌐 Database: PostgreSQL (Cloud)"
echo "🔧 Starting server..."

# Start the server
npm start 