# Quick Start Guide - PythonAnywhere Deployment

This is a simplified guide to get your POS application running on PythonAnywhere quickly.

## Prerequisites

- PythonAnywhere account (sign up at https://www.pythonanywhere.com)
- Your application code

## 5-Minute Setup (Free Account with MySQL)

### 1. Upload Code

**Option A: Using Git**
```bash
# Open Bash console in PythonAnywhere
git clone YOUR_REPOSITORY_URL POS
cd POS
```

**Option B: Upload Files**
- Use the "Files" tab to upload your project folder

### 2. Setup Script

Run this in a Bash console:

```bash
cd ~/POS
bash deployment-scripts/setup-pythonanywhere.sh
```

Follow the prompts to configure your database.

**For Free Account Users:**
- Choose "mysql" when asked for database type
- Create a MySQL database from the "Databases" tab first
- Note your database name and password

### 3. Configure Web App

1. Go to "Web" tab → "Add a new web app"
2. Choose "Manual configuration" → Python 3.10
3. Click on WSGI configuration file
4. **Delete all content** and paste (replace YOUR_USERNAME):

```python
import sys
import os

# Add your project directory to the sys.path
project_home = '/home/YOUR_USERNAME/POS'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

backend_path = os.path.join(project_home, 'backend')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from dotenv import load_dotenv
dotenv_path = os.path.join(backend_path, '.env')
load_dotenv(dotenv_path)

from app import app as application
```

5. Set **Virtualenv** to: `/home/YOUR_USERNAME/POS/venv`

6. In **Static files** section, add:
   - URL: `/assets` → Directory: `/home/YOUR_USERNAME/POS/build/assets`
   - URL: `/` → Directory: `/home/YOUR_USERNAME/POS/build`

7. Click **Reload** button

### 4. Access Your App

Visit: `https://YOUR_USERNAME.pythonanywhere.com`

## Manual Setup (If script doesn't work)

### Step 1: Create Virtual Environment
```bash
cd ~/POS
python3.10 -m venv venv
source venv/bin/activate
```

### Step 2: Install Dependencies
```bash
cd backend
pip install -r requirements.txt
pip install PyMySQL  # For MySQL support
```

### Step 3: Configure Database

Create `backend/.env`:
```env
# For MySQL (Free account)
DATABASE_URL=mysql://YOUR_USERNAME:YOUR_PASSWORD@YOUR_USERNAME.mysql.pythonanywhere-services.com/YOUR_USERNAME$DATABASE_NAME

FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=generate-a-random-secret-key-here
```

**Generate SECRET_KEY:**
```bash
python -c 'import secrets; print(secrets.token_hex(32))'
```

### Step 4: Initialize Database
```bash
cd ~/POS/backend
source ../venv/bin/activate
python
```

In Python shell:
```python
from app import app, db
with app.app_context():
    db.create_all()
exit()
```

### Step 5: Build Frontend
```bash
cd ~/POS
npm install
npm run build
```

### Step 6: Follow Step 3 from 5-Minute Setup above

## Database Setup

### For Free Accounts (MySQL):

1. Go to "Databases" tab
2. Create a new MySQL database
3. Note your:
   - Database name: `YOUR_USERNAME$DATABASE_NAME`
   - Password: (set by you)
   - Hostname: `YOUR_USERNAME.mysql.pythonanywhere-services.com`

4. Use this DATABASE_URL format:
   ```
   mysql://YOUR_USERNAME:PASSWORD@YOUR_USERNAME.mysql.pythonanywhere-services.com/YOUR_USERNAME$DATABASE_NAME
   ```

### For Paid Accounts (PostgreSQL):

1. Go to "Databases" tab
2. Create a PostgreSQL database
3. Note the connection details
4. Use this DATABASE_URL format:
   ```
   postgresql://USERNAME:PASSWORD@HOSTNAME/DATABASE_NAME
   ```

## Troubleshooting

### Check Logs
- Go to "Web" tab
- Click "Error log" and "Server log"

### Common Fixes

**Database Connection Failed:**
```bash
# Check .env file
cat ~/POS/backend/.env

# Test database connection
cd ~/POS/backend
source ../venv/bin/activate
python -c "from app import db; print('Connected!' if db else 'Failed')"
```

**Module Not Found:**
```bash
# Reinstall dependencies
cd ~/POS/backend
source ../venv/bin/activate
pip install -r requirements.txt
```

**Static Files Not Loading:**
- Verify build folder exists: `ls ~/POS/build`
- Check static file mappings in Web tab
- Ensure paths don't have typos

**Blank Page:**
```bash
# Rebuild frontend
cd ~/POS
npm run build
# Reload web app from Web tab
```

## Update Your App

After making changes:

```bash
cd ~/POS
git pull  # If using Git
source venv/bin/activate
cd backend
pip install -r requirements.txt
cd ..
npm run build
```

Then reload from Web tab.

## Need More Help?

- Full guide: See `PYTHONANYWHERE_DEPLOYMENT.md`
- PythonAnywhere help: https://help.pythonanywhere.com/
- Forums: https://www.pythonanywhere.com/forums/

## URLs to Remember

- Your app: `https://YOUR_USERNAME.pythonanywhere.com`
- API endpoint: `https://YOUR_USERNAME.pythonanywhere.com/api/...`
- Admin console: `https://www.pythonanywhere.com/user/YOUR_USERNAME/`
