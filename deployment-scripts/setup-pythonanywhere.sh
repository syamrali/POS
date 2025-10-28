#!/bin/bash

# PythonAnywhere Setup Script
# This script automates the deployment setup on PythonAnywhere

echo "=========================================="
echo "POS Application - PythonAnywhere Setup"
echo "=========================================="
echo ""

# Get username
read -p "Enter your PythonAnywhere username: " PA_USERNAME

# Set paths
PROJECT_DIR="/home/$PA_USERNAME/POS"
VENV_DIR="$PROJECT_DIR/venv"
BACKEND_DIR="$PROJECT_DIR/backend"

echo ""
echo "Step 1: Creating virtual environment..."
cd $PROJECT_DIR
python3.10 -m venv venv
echo "✓ Virtual environment created"

echo ""
echo "Step 2: Activating virtual environment..."
source $VENV_DIR/bin/activate
echo "✓ Virtual environment activated"

echo ""
echo "Step 3: Installing backend dependencies..."
cd $BACKEND_DIR
pip install --upgrade pip
pip install -r requirements.txt
echo "✓ Backend dependencies installed"

echo ""
echo "Step 4: Database configuration..."
read -p "Which database are you using? (postgresql/mysql/sqlite): " DB_TYPE

case $DB_TYPE in
  postgresql)
    read -p "Enter PostgreSQL hostname: " DB_HOST
    read -p "Enter database name: " DB_NAME
    read -p "Enter database username: " DB_USER
    read -sp "Enter database password: " DB_PASS
    echo ""
    DATABASE_URL="postgresql://$DB_USER:$DB_PASS@$DB_HOST/$DB_NAME"
    ;;
  mysql)
    read -p "Enter database name: " DB_NAME
    read -sp "Enter database password: " DB_PASS
    echo ""
    DATABASE_URL="mysql://$PA_USERNAME:$DB_PASS@$PA_USERNAME.mysql.pythonanywhere-services.com/$PA_USERNAME\$$DB_NAME"
    pip install PyMySQL
    ;;
  sqlite)
    DATABASE_URL="sqlite:///$BACKEND_DIR/pos_database.db"
    ;;
  *)
    echo "Invalid database type"
    exit 1
    ;;
esac

echo ""
echo "Step 5: Creating .env file..."
cat > $BACKEND_DIR/.env << EOF
# Database configuration
DATABASE_URL=$DATABASE_URL

# Flask configuration
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=$(python -c 'import secrets; print(secrets.token_hex(32))')
EOF
echo "✓ .env file created"

echo ""
echo "Step 6: Initializing database..."
cd $BACKEND_DIR
python << PYEOF
from app import app, db
with app.app_context():
    db.create_all()
    print("✓ Database initialized")
PYEOF

echo ""
echo "Step 7: Installing Node.js (if not already installed)..."
if ! command -v node &> /dev/null; then
    cd ~
    wget -q https://nodejs.org/dist/v18.17.0/node-v18.17.0-linux-x64.tar.xz
    tar -xf node-v18.17.0-linux-x64.tar.xz
    echo 'export PATH=~/node-v18.17.0-linux-x64/bin:$PATH' >> ~/.bashrc
    source ~/.bashrc
    echo "✓ Node.js installed"
else
    echo "✓ Node.js already installed"
fi

echo ""
echo "Step 8: Building frontend..."
cd $PROJECT_DIR
npm install
npm run build
echo "✓ Frontend built successfully"

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Go to the PythonAnywhere Web tab"
echo "2. Create a new web app (Manual configuration, Python 3.10)"
echo "3. Configure WSGI file with content from wsgi.py"
echo "4. Set virtualenv path to: $VENV_DIR"
echo "5. Add static file mappings:"
echo "   URL: /assets -> Directory: $PROJECT_DIR/build/assets"
echo "   URL: / -> Directory: $PROJECT_DIR/build"
echo "6. Reload your web app"
echo ""
echo "Your app will be available at:"
echo "https://$PA_USERNAME.pythonanywhere.com"
echo ""
