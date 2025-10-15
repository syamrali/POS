#!/bin/bash

# Setup script for Restaurant POS System

echo "Setting up Restaurant POS System..."

# Check if we're on Windows (Git Bash) or Linux/Mac
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    echo "Detected Windows environment"
    
    # Setup backend
    echo "Setting up backend..."
    cd backend
    if ! command -v python &> /dev/null; then
        echo "Python is not installed. Please install Python 3.9 or later."
        exit 1
    fi
    
    # Create virtual environment
    python -m venv venv
    source venv/Scripts/activate
    
    # Install Python dependencies
    pip install -r requirements.txt
    
    # Go back to root
    cd ..
    
    # Setup frontend
    echo "Setting up frontend..."
    if ! command -v npm &> /dev/null; then
        echo "npm is not installed. Please install Node.js and npm."
        exit 1
    fi
    
    npm install
    
    echo "Setup complete!"
    echo ""
    echo "To run the application:"
    echo "1. Start the backend: cd backend && source venv/Scripts/activate && python app.py"
    echo "2. In a new terminal, start the frontend: npm run dev"
    echo ""
    echo "Or use Docker: docker-compose up"
    
else
    # Linux/Mac
    echo "Detected Linux/Mac environment"
    
    # Setup backend
    echo "Setting up backend..."
    cd backend
    if ! command -v python3 &> /dev/null; then
        echo "Python 3 is not installed. Please install Python 3.9 or later."
        exit 1
    fi
    
    # Create virtual environment
    python3 -m venv venv
    source venv/bin/activate
    
    # Install Python dependencies
    pip install -r requirements.txt
    
    # Go back to root
    cd ..
    
    # Setup frontend
    echo "Setting up frontend..."
    if ! command -v npm &> /dev/null; then
        echo "npm is not installed. Please install Node.js and npm."
        exit 1
    fi
    
    npm install
    
    echo "Setup complete!"
    echo ""
    echo "To run the application:"
    echo "1. Start the backend: cd backend && source venv/bin/activate && python3 app.py"
    echo "2. In a new terminal, start the frontend: npm run dev"
    echo ""
    echo "Or use Docker: docker-compose up"
fi