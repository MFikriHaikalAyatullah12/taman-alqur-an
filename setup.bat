@echo off
echo 🚀 Setting up TPQ Al-Hikmah Website...

echo 📦 Installing dependencies...
call npm install

echo 📁 Creating directories...
if not exist "public\uploads\gallery" mkdir public\uploads\gallery
if not exist "public\uploads\documents" mkdir public\uploads\documents
if not exist "public\uploads\profiles" mkdir public\uploads\profiles
if not exist "public\images" mkdir public\images

echo ⚙️ Checking environment file...
if not exist ".env.local" (
    echo Please create .env.local file manually with the database configuration
)

echo.
echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo 1. Make sure PostgreSQL Neon database is accessible
echo 2. Run 'npm run dev' to start the development server
echo 3. Open http://localhost:3000 in your browser
echo 4. Use admin@tpq.com / admin123 for admin access
echo.
echo 🎉 Happy coding!
pause