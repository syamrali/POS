# POS Application - Deployment Guide

## 📋 Overview

This POS (Point of Sale) application is a full-stack web application built with:
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Flask + SQLAlchemy
- **Database:** PostgreSQL / MySQL / SQLite

This guide will help you deploy the application to **PythonAnywhere**, a popular Python hosting platform.

---

## 🚀 Quick Start

**Choose your path:**

1. **⚡ 5-Minute Setup** → Read [`QUICK_START_PYTHONANYWHERE.md`](QUICK_START_PYTHONANYWHERE.md)
2. **📚 Complete Guide** → Read [`PYTHONANYWHERE_DEPLOYMENT.md`](PYTHONANYWHERE_DEPLOYMENT.md)
3. **✅ Checklist Format** → Use [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md)

---

## 📁 Important Files

### Deployment Documentation
- [`QUICK_START_PYTHONANYWHERE.md`](QUICK_START_PYTHONANYWHERE.md) - Fastest way to deploy (5 minutes)
- [`PYTHONANYWHERE_DEPLOYMENT.md`](PYTHONANYWHERE_DEPLOYMENT.md) - Complete deployment guide
- [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md) - Step-by-step checklist
- [`README_DEPLOYMENT.md`](README_DEPLOYMENT.md) - This file

### Configuration Files
- [`wsgi.py`](wsgi.py) - WSGI configuration for PythonAnywhere
- [`backend/.env`](backend/.env) - Environment variables (DO NOT COMMIT)
- [`backend/requirements.txt`](backend/requirements.txt) - Python dependencies
- [`backend/requirements-pythonanywhere.txt`](backend/requirements-pythonanywhere.txt) - PythonAnywhere-specific requirements

### Deployment Scripts
- [`deployment-scripts/setup-pythonanywhere.sh`](deployment-scripts/setup-pythonanywhere.sh) - Automated setup script
- [`deployment-scripts/test-deployment.py`](deployment-scripts/test-deployment.py) - Test your deployment
- [`backend/init_database.py`](backend/init_database.py) - Initialize database tables

---

## 🎯 Recommended Deployment Path

### For Beginners
1. ✅ Read the [Quick Start Guide](QUICK_START_PYTHONANYWHERE.md)
2. ✅ Use the [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) 
3. ✅ Run the test script to verify

### For Experienced Users
1. ✅ Clone your repository to PythonAnywhere
2. ✅ Run `deployment-scripts/setup-pythonanywhere.sh`
3. ✅ Configure Web app (WSGI, virtualenv, static files)
4. ✅ Test with `python deployment-scripts/test-deployment.py`

---

## 🔑 Key Configuration Steps

### 1. Database Setup

**Free Account (MySQL):**
```env
DATABASE_URL=mysql://USERNAME:PASSWORD@USERNAME.mysql.pythonanywhere-services.com/USERNAME$DBNAME
```

**Paid Account (PostgreSQL):**
```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOSTNAME/DBNAME
```

### 2. WSGI Configuration

File location: PythonAnywhere Web Tab → WSGI configuration file

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

### 3. Virtual Environment

Create and configure:
```bash
cd ~/POS
python3.10 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

Set in Web Tab: `/home/YOUR_USERNAME/POS/venv`

### 4. Static Files

Add in Web Tab → Static files:

| URL       | Directory                          |
|-----------|------------------------------------|
| `/assets` | `/home/USERNAME/POS/build/assets`  |
| `/`       | `/home/USERNAME/POS/build`         |

---

## 🧪 Testing Your Deployment

### Automated Testing
```bash
python deployment-scripts/test-deployment.py
```

### Manual Testing
1. Visit `https://YOUR_USERNAME.pythonanywhere.com`
2. Test API: `https://YOUR_USERNAME.pythonanywhere.com/api/tables`
3. Check error logs in Web tab

---

## 🛠️ Troubleshooting

### Issue: "Database connection failed"
**Solution:**
1. Check `.env` file has correct DATABASE_URL
2. Verify database was created in PythonAnywhere
3. Test connection:
   ```bash
   cd ~/POS/backend
   source ../venv/bin/activate
   python -c "from app import db; print('OK')"
   ```

### Issue: "Module not found"
**Solution:**
1. Activate virtual environment
2. Reinstall dependencies:
   ```bash
   cd ~/POS/backend
   source ../venv/bin/activate
   pip install -r requirements.txt
   ```

### Issue: "404 Not Found"
**Solution:**
1. Verify frontend build exists: `ls ~/POS/build/index.html`
2. Check WSGI configuration
3. Verify static file mappings
4. Reload web app

### Issue: "500 Internal Server Error"
**Solution:**
1. Check error logs (Web tab → Error log)
2. Look for Python exceptions
3. Verify database initialization:
   ```bash
   cd ~/POS/backend
   python init_database.py
   ```

---

## 📚 Additional Resources

### PythonAnywhere Documentation
- Help Center: https://help.pythonanywhere.com/
- Forums: https://www.pythonanywhere.com/forums/
- Flask Tutorial: https://help.pythonanywhere.com/pages/Flask/

### Application Documentation
- Main README: [`README.md`](README.md)
- Solution Summary: [`SOLUTION_SUMMARY.md`](SOLUTION_SUMMARY.md)

---

## 🔄 Updating Your Deployment

After making code changes:

```bash
# 1. Update code
cd ~/POS
git pull  # If using Git

# 2. Activate virtual environment
source venv/bin/activate

# 3. Update backend dependencies (if changed)
cd backend
pip install -r requirements.txt

# 4. Rebuild frontend
cd ~/POS
npm run build

# 5. Reload web app (in Web tab) or via console:
touch /var/www/YOUR_USERNAME_pythonanywhere_com_wsgi.py
```

---

## 🔐 Security Checklist

- [x] `.env` file not committed to Git (.gitignore configured)
- [x] Strong SECRET_KEY generated (32+ characters)
- [x] FLASK_ENV set to `production`
- [x] Debug mode disabled in production
- [x] Database credentials secured
- [x] HTTPS enabled (automatic on PythonAnywhere)

---

## 📞 Support

Having issues? Try these steps in order:

1. ✅ Check the [Troubleshooting](#-troubleshooting) section above
2. ✅ Review the [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)
3. ✅ Read PythonAnywhere [Help Center](https://help.pythonanywhere.com/)
4. ✅ Check error logs in PythonAnywhere Web tab
5. ✅ Post on [PythonAnywhere Forums](https://www.pythonanywhere.com/forums/)

---

## 🎉 Success!

Once deployed, your application will be available at:

```
https://YOUR_USERNAME.pythonanywhere.com
```

**Happy deploying! 🚀**

---

## 📝 License

This deployment guide is provided as-is for the POS application.

---

*Last updated: 2025-10-28*
