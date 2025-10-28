"""
WSGI configuration for PythonAnywhere deployment
"""
import sys
import os

# Add your project directory to the sys.path
project_home = '/home/YOUR_USERNAME/POS'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Add backend directory to sys.path
backend_path = os.path.join(project_home, 'backend')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# Load environment variables from .env file
from dotenv import load_dotenv
dotenv_path = os.path.join(backend_path, '.env')
load_dotenv(dotenv_path)

# Import Flask app
from backend.app import app as application
