# POS Application - PythonAnywhere Deployment Guide

This guide will help you deploy your POS (Point of Sale) application to PythonAnywhere.

## Prerequisites

1. A PythonAnywhere account (Free or Paid)
2. Your application code ready to upload
3. Basic knowledge of Git (optional but recommended)

## Deployment Steps

### Step 1: Sign Up for PythonAnywhere

1. Go to [https://www.pythonanywhere.com](https://www.pythonanywhere.com)
2. Sign up for an account (Free tier is fine for testing)
3. Note your username - you'll need it throughout this guide

### Step 2: Upload Your Code

**Option A: Using Git (Recommended)**

1. Open a Bash console from the PythonAnywhere dashboard
2. Clone your repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/POS.git
   cd POS
   ```

**Option B: Manual Upload**

1. Use the "Files" tab in PythonAnywhere
2. Create a folder called `POS`
3. Upload all your project files to this folder

### Step 3: Set Up PostgreSQL Database

**Note:** Free PythonAnywhere accounts only support MySQL/SQLite. For PostgreSQL, you need a paid account.

**For Paid Accounts (PostgreSQL):**
1. Go to the "Databases" tab
2. Create a new PostgreSQL database
3. Note the connection details provided

**For Free Accounts (MySQL Alternative):**
1. Go to the "Databases" tab
2. Create a MySQL database
3. Note your database name, username, and password
4. Update your `.env` file accordingly

**For Free Accounts (SQLite Alternative):**
You can use SQLite for testing purposes.

### Step 4: Create and Configure Virtual Environment

1. Open a Bash console from PythonAnywhere dashboard
2. Navigate to your project directory:
   ```bash
   cd ~/POS
   ```

3. Create a virtual environment:
   ```bash
   python3.10 -m venv venv
   ```

4. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```

5. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

6. For MySQL (if using MySQL instead of PostgreSQL):
   ```bash
   pip install mysqlclient
   ```

### Step 5: Configure Environment Variables

1. Navigate to the backend directory:
   ```bash
   cd ~/POS/backend
   ```

2. Create/edit the `.env` file:
   ```bash
   nano .env
   ```

3. Update the configuration based on your database choice:

   **For PostgreSQL (Paid accounts):**
   ```env
   DATABASE_URL=postgresql://USERNAME:PASSWORD@HOSTNAME/DATABASE_NAME
   FLASK_APP=app.py
   FLASK_ENV=production
   SECRET_KEY=your-super-secret-key-change-this-in-production
   ```

   **For MySQL (Free accounts):**
   ```env
   DATABASE_URL=mysql://USERNAME:PASSWORD@USERNAME.mysql.pythonanywhere-services.com/USERNAME$DATABASE_NAME
   FLASK_APP=app.py
   FLASK_ENV=production
   SECRET_KEY=your-super-secret-key-change-this-in-production
   ```

   **For SQLite (Free accounts - Testing only):**
   ```env
   DATABASE_URL=sqlite:///pos_database.db
   FLASK_APP=app.py
   FLASK_ENV=production
   SECRET_KEY=your-super-secret-key-change-this-in-production
   ```

4. Replace placeholders:
   - `USERNAME`: Your PythonAnywhere username
   - `PASSWORD`: Your database password
   - `HOSTNAME`: Database hostname (provided by PythonAnywhere)
   - `DATABASE_NAME`: Your database name
   - `SECRET_KEY`: Generate a random secret key

5. Save the file (Ctrl+X, then Y, then Enter)

### Step 6: Update app.py for Production

1. Edit `~/POS/backend/app.py`:
   ```bash
   nano ~/POS/backend/app.py
   ```

2. Add support for MySQL if using MySQL. Find this line:
   ```python
   app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://pos_user:pos_password@localhost:5432/pos_db')
   ```

3. Update it to handle MySQL URLs:
   ```python
   database_url = os.environ.get('DATABASE_URL', 'postgresql://pos_user:pos_password@localhost:5432/pos_db')
   # Fix MySQL URL if needed (mysqlclient uses mysql:// not mysql+pymysql://)
   if database_url.startswith('mysql://'):
       database_url = database_url.replace('mysql://', 'mysql+pymysql://')
   app.config['SQLALCHEMY_DATABASE_URI'] = database_url
   ```

4. If using MySQL, also update requirements.txt:
   ```bash
   nano ~/POS/backend/requirements.txt
   ```
   
   Add:
   ```
   PyMySQL==1.1.0
   ```

### Step 7: Initialize Database

1. From the Bash console, navigate to backend:
   ```bash
   cd ~/POS/backend
   source ~/POS/venv/bin/activate
   ```

2. Initialize the database:
   ```bash
   python
   ```

3. In Python shell:
   ```python
   from app import app, db
   with app.app_context():
       db.create_all()
   exit()
   ```

### Step 8: Build Frontend

1. Install Node.js (if not already installed):
   ```bash
   cd ~
   wget https://nodejs.org/dist/v18.17.0/node-v18.17.0-linux-x64.tar.xz
   tar -xf node-v18.17.0-linux-x64.tar.xz
   ```

2. Add Node.js to PATH (add to ~/.bashrc):
   ```bash
   echo 'export PATH=~/node-v18.17.0-linux-x64/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   ```

3. Build the frontend:
   ```bash
   cd ~/POS
   npm install
   npm run build
   ```

### Step 9: Configure Web App

1. Go to the "Web" tab in PythonAnywhere dashboard
2. Click "Add a new web app"
3. Choose "Manual configuration"
4. Select Python 3.10

5. **Configure WSGI file:**
   - Click on the WSGI configuration file link
   - Delete all existing content
   - Paste the following:

```python
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
from app import app as application
```

6. **Replace** `YOUR_USERNAME` with your actual PythonAnywhere username
7. Click "Save"

### Step 10: Configure Virtual Environment

1. In the "Web" tab, find the "Virtualenv" section
2. Enter the path to your virtual environment:
   ```
   /home/YOUR_USERNAME/POS/venv
   ```
3. Replace `YOUR_USERNAME` with your actual username

### Step 11: Configure Static Files

1. In the "Web" tab, scroll to "Static files" section
2. Add the following mappings:

   | URL              | Directory                                    |
   |------------------|----------------------------------------------|
   | `/assets`        | `/home/YOUR_USERNAME/POS/build/assets`       |
   | `/`              | `/home/YOUR_USERNAME/POS/build`              |

3. Replace `YOUR_USERNAME` with your actual username

### Step 12: Serve Frontend via Flask

Since PythonAnywhere's free tier has limitations, you may need to serve the frontend through Flask.

1. Edit `~/POS/backend/app.py`:
   ```bash
   nano ~/POS/backend/app.py
   ```

2. Add this route before the `if __name__ == '__main__':` line:

```python
# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    build_folder = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'build')
    if path != "" and os.path.exists(os.path.join(build_folder, path)):
        return send_file(os.path.join(build_folder, path))
    else:
        return send_file(os.path.join(build_folder, 'index.html'))
```

3. Add this import at the top:
   ```python
   from flask import Flask, request, jsonify, send_file
   ```
   (Already exists, just verify)

### Step 13: Reload Web App

1. Go back to the "Web" tab
2. Click the green "Reload" button
3. Wait for the reload to complete

### Step 14: Access Your Application

1. Your application should now be live at:
   ```
   https://YOUR_USERNAME.pythonanywhere.com
   ```

2. The API endpoints will be available at:
   ```
   https://YOUR_USERNAME.pythonanywhere.com/api/...
   ```

## Troubleshooting

### Check Error Logs

1. Go to the "Web" tab
2. Click on "Error log" and "Server log" to view logs
3. Look for any errors and fix accordingly

### Common Issues

**Issue 1: Database Connection Error**
- Verify your DATABASE_URL in `.env`
- Make sure the database exists
- Check credentials are correct

**Issue 2: Module Not Found**
- Make sure all packages are installed in the virtual environment
- Check that the virtual environment path is correct in the Web tab

**Issue 3: Static Files Not Loading**
- Verify static file mappings in the Web tab
- Ensure the build folder exists and contains files
- Check file permissions

**Issue 4: CORS Errors**
- The Flask app already has CORS enabled
- If issues persist, check that Flask-CORS is installed

### Viewing Logs

```bash
# View error logs
tail -f /var/log/YOUR_USERNAME.pythonanywhere.com.error.log

# View server logs
tail -f /var/log/YOUR_USERNAME.pythonanywhere.com.server.log
```

## Updating Your Application

Whenever you make changes:

1. **Update code:**
   ```bash
   cd ~/POS
   git pull  # If using Git
   ```

2. **Update backend dependencies:**
   ```bash
   source venv/bin/activate
   cd backend
   pip install -r requirements.txt
   ```

3. **Rebuild frontend:**
   ```bash
   cd ~/POS
   npm install
   npm run build
   ```

4. **Reload web app:**
   - Go to Web tab and click "Reload"

## Important Notes

1. **Free Account Limitations:**
   - No PostgreSQL (use MySQL or SQLite)
   - Limited CPU time
   - No always-on tasks
   - Limited storage

2. **Paid Account Benefits:**
   - PostgreSQL support
   - More CPU time
   - Always-on tasks
   - More storage
   - Custom domains

3. **Security:**
   - Always use a strong SECRET_KEY
   - Never commit `.env` file to Git
   - Use HTTPS (automatically provided by PythonAnywhere)

4. **Database Migrations:**
   - When you modify database models, you'll need to update the database
   - Consider using Flask-Migrate for production

## Support

- PythonAnywhere Help: https://help.pythonanywhere.com/
- PythonAnywhere Forums: https://www.pythonanywhere.com/forums/

## Production Checklist

- [ ] Database created and configured
- [ ] Environment variables set correctly
- [ ] Virtual environment created and activated
- [ ] All dependencies installed
- [ ] Database initialized
- [ ] Frontend built successfully
- [ ] WSGI file configured
- [ ] Virtual environment path set in Web tab
- [ ] Static files configured
- [ ] Web app reloaded
- [ ] Application accessible via browser
- [ ] All API endpoints working
- [ ] Error logs checked

---

**Good luck with your deployment!**
