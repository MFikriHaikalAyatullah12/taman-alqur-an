#!/bin/bash

echo "🚀 Setting up TPQ Al-Hikmah Website..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p public/uploads/gallery
mkdir -p public/uploads/documents
mkdir -p public/uploads/profiles

# Create images directory with placeholder images
echo "🖼️ Creating images directory..."
mkdir -p public/images

# Set environment variables if not exists
if [ ! -f .env.local ]; then
    echo "⚙️ Creating environment file..."
    cp .env.local.example .env.local 2>/dev/null || echo "Please create .env.local manually"
fi

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure PostgreSQL Neon database is accessible"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo "4. Use admin@tpq.com / admin123 for admin access"
echo ""
echo "🎉 Happy coding!"