# PythonAnywhere Deployment Checklist

Use this checklist to ensure a smooth deployment of your POS application to PythonAnywhere.

## Pre-Deployment Checklist

### Local Testing
- [ ] Application runs successfully locally
- [ ] Frontend builds without errors (`npm run build`)
- [ ] Backend runs without errors
- [ ] Database migrations are up to date
- [ ] All tests pass (if applicable)

### Account Setup
- [ ] PythonAnywhere account created
- [ ] Username noted down: `___________________________`
- [ ] Account type: [ ] Free [ ] Paid
- [ ] Database type available: [ ] PostgreSQL (Paid) [ ] MySQL (Free) [ ] SQLite

## Deployment Steps

### 1. Upload Code ✓
- [ ] Code uploaded via Git clone OR
- [ ] Code uploaded via Files tab
- [ ] All files present in `/home/USERNAME/POS`

### 2. Database Setup ✓
- [ ] Database created in PythonAnywhere
- [ ] Database name: `___________________________`
- [ ] Database password: (stored securely)
- [ ] Connection string tested

### 3. Virtual Environment ✓
```bash
cd ~/POS
python3.10 -m venv venv
source venv/bin/activate
```
- [ ] Virtual environment created
- [ ] Virtual environment activated
- [ ] Path: `/home/USERNAME/POS/venv`

### 4. Backend Dependencies ✓
```bash
cd ~/POS/backend
pip install -r requirements.txt
```
- [ ] Flask installed
- [ ] Flask-SQLAlchemy installed
- [ ] Flask-CORS installed
- [ ] Database driver installed (psycopg2-binary OR PyMySQL)
- [ ] python-dotenv installed
- [ ] openpyxl installed
- [ ] No installation errors

### 5. Environment Configuration ✓
File: `/home/USERNAME/POS/backend/.env`

For MySQL (Free Account):
```env
DATABASE_URL=mysql://USERNAME:PASSWORD@USERNAME.mysql.pythonanywhere-services.com/USERNAME$DBNAME
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=your-generated-secret-key
```

For PostgreSQL (Paid Account):
```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOSTNAME/DBNAME
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=your-generated-secret-key
```

- [ ] `.env` file created
- [ ] DATABASE_URL configured correctly
- [ ] SECRET_KEY generated (run: `python -c 'import secrets; print(secrets.token_hex(32))'`)
- [ ] FLASK_ENV set to `production`

### 6. Database Initialization ✓
```bash
cd ~/POS/backend
source ../venv/bin/activate
python
```
```python
from app import app, db
with app.app_context():
    db.create_all()
exit()
```
- [ ] Database tables created
- [ ] No errors during initialization
- [ ] Can connect to database

### 7. Frontend Build ✓
```bash
cd ~/POS
npm install
npm run build
```
- [ ] Node.js installed (or downloaded)
- [ ] npm dependencies installed
- [ ] Build completed successfully
- [ ] `build` folder created with files
- [ ] `build/index.html` exists
- [ ] `build/assets` folder exists

### 8. Web App Configuration ✓

In PythonAnywhere Web Tab:
- [ ] Web app created (Manual configuration, Python 3.10)
- [ ] Web app URL: `https://USERNAME.pythonanywhere.com`

### 9. WSGI Configuration ✓

WSGI file location: (click on link in Web tab)

Content to paste (replace YOUR_USERNAME):
```python
import sys
import os

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

- [ ] WSGI file updated with correct content
- [ ] USERNAME replaced with actual username
- [ ] WSGI file saved

### 10. Virtual Environment Path ✓

In Web Tab → Virtualenv section:
- [ ] Path set to: `/home/USERNAME/POS/venv`
- [ ] Path verified (no typos)

### 11. Static Files Configuration ✓

In Web Tab → Static files section:

| URL       | Directory                                  | Status |
|-----------|-------------------------------------------|--------|
| `/assets` | `/home/USERNAME/POS/build/assets`         | [ ]    |
| `/`       | `/home/USERNAME/POS/build`                | [ ]    |

- [ ] Both static file mappings added
- [ ] Paths verified (no typos)
- [ ] USERNAME replaced correctly

### 12. Reload Web App ✓
- [ ] Green "Reload" button clicked
- [ ] Reload completed (no errors shown)
- [ ] Wait 10-15 seconds after reload

## Post-Deployment Testing

### Basic Access ✓
- [ ] Website loads: `https://USERNAME.pythonanywhere.com`
- [ ] No 404 error
- [ ] No 500 error
- [ ] Frontend displays correctly

### API Testing ✓
Test these endpoints:

- [ ] GET `https://USERNAME.pythonanywhere.com/api/tables`
- [ ] GET `https://USERNAME.pythonanywhere.com/api/menu-items`
- [ ] GET `https://USERNAME.pythonanywhere.com/api/categories`
- [ ] GET `https://USERNAME.pythonanywhere.com/api/departments`
- [ ] GET `https://USERNAME.pythonanywhere.com/api/restaurant-settings`

### Functionality Testing ✓
- [ ] Can view tables
- [ ] Can create new table
- [ ] Can view menu items
- [ ] Can create menu item
- [ ] Can create order
- [ ] Can generate invoice
- [ ] Settings page loads

### UI Testing ✓
- [ ] All pages load correctly
- [ ] Navigation works
- [ ] Buttons respond
- [ ] Forms work
- [ ] Styling appears correct
- [ ] No console errors (check browser DevTools)

## Troubleshooting

### If Website Shows 404
- [ ] Check WSGI configuration
- [ ] Verify build folder exists: `ls ~/POS/build`
- [ ] Check error logs
- [ ] Reload web app

### If API Returns Errors
- [ ] Check error logs in Web tab
- [ ] Verify database connection
- [ ] Check .env file configuration
- [ ] Test database: `cd ~/POS/backend && python -c "from app import db; print('OK')"`

### If Static Files Don't Load
- [ ] Verify static file mappings
- [ ] Check build folder contents
- [ ] Ensure paths are correct
- [ ] Reload web app

### Check Logs
Location of logs (in Web tab):
- [ ] Error log checked
- [ ] Server log checked
- [ ] No critical errors

Error log command line:
```bash
tail -f /var/log/USERNAME.pythonanywhere.com.error.log
```

## Security Checklist

- [ ] `.env` file not committed to Git
- [ ] Strong SECRET_KEY used (32+ characters)
- [ ] Database password is secure
- [ ] FLASK_ENV set to `production` (not `development`)
- [ ] Debug mode disabled in production

## Maintenance

### Regular Updates
- [ ] Process documented for updating code
- [ ] Process documented for database migrations
- [ ] Backup strategy defined

### Monitoring
- [ ] Bookmark error log URL
- [ ] Bookmark server log URL
- [ ] Set calendar reminder to check logs weekly

## Common Commands Reference

### Activate Virtual Environment
```bash
cd ~/POS
source venv/bin/activate
```

### Update Dependencies
```bash
cd ~/POS/backend
source ../venv/bin/activate
pip install -r requirements.txt
```

### Rebuild Frontend
```bash
cd ~/POS
npm run build
```

### Check Database
```bash
cd ~/POS/backend
source ../venv/bin/activate
python -c "from app import app, db; print('Database OK')"
```

### View Error Logs
```bash
tail -20 /var/log/USERNAME.pythonanywhere.com.error.log
```

## Important URLs

- [ ] Application: `https://USERNAME.pythonanywhere.com`
- [ ] PythonAnywhere Dashboard: `https://www.pythonanywhere.com/user/USERNAME/`
- [ ] Web Tab: `https://www.pythonanywhere.com/user/USERNAME/webapps/`
- [ ] Files Tab: `https://www.pythonanywhere.com/user/USERNAME/files/`
- [ ] Databases Tab: `https://www.pythonanywhere.com/user/USERNAME/databases/`
- [ ] Consoles Tab: `https://www.pythonanywhere.com/user/USERNAME/consoles/`

## Support Resources

- [ ] PythonAnywhere Help: https://help.pythonanywhere.com/
- [ ] PythonAnywhere Forums: https://www.pythonanywhere.com/forums/
- [ ] Full Deployment Guide: `PYTHONANYWHERE_DEPLOYMENT.md`
- [ ] Quick Start Guide: `QUICK_START_PYTHONANYWHERE.md`

---

## Deployment Status

Deployment Date: _______________

Deployed By: _______________

Application URL: https://_______________.pythonanywhere.com

Status: [ ] Success [ ] Partial [ ] Failed

Notes:
______________________________________________________________________
______________________________________________________________________
______________________________________________________________________

---

**Remember to reload your web app after any code changes!**
