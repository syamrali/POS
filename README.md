# POS System - Point of Sale Web Application

A modern, full-featured Point of Sale (POS) system built with React, TypeScript, Flask, and PostgreSQL. Designed for restaurants and food service businesses, deployable via Docker.

## 🚀 Features

- **Table Management**: Add, edit, and delete tables with real-time status tracking
- **Order Management**: Create, modify, and track orders with intuitive interface
- **Menu Management**: Organize menu items by categories and departments
- **Invoice Generation**: Generate and print professional invoices
- **Kitchen Order Tickets (KOT)**: Print kitchen orders with customizable settings
- **Reports & Analytics**: Sales reports, order history, and business insights
- **Settings & Configuration**: Customize restaurant info, KOT settings, and system preferences
- **Responsive Design**: Modern UI built with Tailwind CSS and Radix UI
- **Data Management**: Bulk import/export, reset functionality, and data backup

## 🛠️ Technology Stack

### Frontend
- **React** 18.3.1 with TypeScript
- **Vite** 6.3.5 for build tooling
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons
- **React Hook Form** for form management
- **Sonner** for toast notifications

### Backend
- **Flask** (Python) REST API
- **PostgreSQL** 15 database
- **SQLAlchemy** ORM

### Deployment
- **Docker** & **Docker Compose**
- Multi-container architecture (Frontend, Backend, Database)

## 📋 Prerequisites

- **Docker** and **Docker Compose** installed
- Ports available: 5173 (frontend), 5000 (backend), 5432 (database)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd POS
```

### 2. Configure Environment

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Update the `.env` file with your configuration (default values work for Docker setup).

### 3. Start with Docker

```bash
docker-compose up --build
```

This will:
- Build and start the PostgreSQL database
- Build and start the Flask backend API
- Build and start the React frontend

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432

Default login credentials will be displayed in the backend logs on first run.

## 📁 Project Structure

```
POS/
├── backend/                 # Flask backend application
│   ├── app.py              # Main Flask application
│   ├── models.py           # Database models
│   ├── init_db.py          # Database initialization
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Backend Docker configuration
│   └── .env               # Environment variables (create from .env.example)
├── src/                    # React frontend application
│   ├── components/         # React components and pages
│   │   ├── ui/            # Reusable UI components
│   │   ├── OrdersPage.tsx
│   │   ├── MenuPage.tsx
│   │   ├── TablesPage.tsx
│   │   ├── InvoicesPage.tsx
│   │   ├── ReportsPage.tsx
│   │   └── SettingsPage.tsx
│   ├── contexts/          # React context providers
│   ├── services/          # API service layer
│   │   └── api.ts        # Backend API integration
│   ├── styles/           # Global styles
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Application entry point
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile.frontend    # Frontend Docker configuration
├── vite.config.ts        # Vite configuration
├── package.json          # Frontend dependencies
└── index.html           # HTML template

```

## 🔧 Development

### Local Development (without Docker)

#### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs on http://localhost:5000

#### Frontend

```bash
npm install
npm run dev
```

Frontend runs on http://localhost:5173

### Building for Production

```bash
npm run build
```

## 🚢 Deployment Guide

### Deployment Options

This application can be deployed in multiple ways:

1. **Docker Deployment (Recommended)** - Production-ready containerized deployment
2. **Local Deployment** - Traditional server deployment
3. **Cloud Deployment** - AWS, Azure, Google Cloud, DigitalOcean, etc.

### Option 1: Docker Deployment (Recommended)

#### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+
- 2GB+ RAM
- 5GB+ disk space

#### Step-by-Step Deployment

**Step 1: Prepare the Server**

```bash
# Update system packages (Ubuntu/Debian)
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

**Step 2: Clone and Configure**

```bash
# Clone the repository
git clone <your-repository-url>
cd POS

# Create environment file
cd backend
cp .env.example .env

# Edit .env with production values
nano .env
```

**Important: Update these values in .env:**
```env
DATABASE_URL=postgresql://pos_user:STRONG_PASSWORD_HERE@db:5432/pos_db
SECRET_KEY=GENERATE_STRONG_SECRET_KEY_HERE
FLASK_ENV=production
```

**Generate a secure SECRET_KEY:**
```bash
python3 -c 'import secrets; print(secrets.token_hex(32))'
```

**Step 3: Update Docker Compose for Production**

Edit `docker-compose.yml` to update database password:

```yaml
services:
  db:
    environment:
      POSTGRES_PASSWORD: STRONG_PASSWORD_HERE  # Match .env password
```

**Step 4: Build and Start**

```bash
# Return to project root
cd ..

# Build and start all services
docker compose up -d --build

# Verify all containers are running
docker compose ps
```

**Step 5: Initialize Database**

```bash
# Database will auto-initialize on first run
# Check backend logs to verify
docker compose logs backend

# You should see "Database initialized successfully"
```

**Step 6: Access Your Application**

- Frontend: `http://your-server-ip:5173`
- Backend API: `http://your-server-ip:5000`

**Step 7: Setup Firewall (Optional but Recommended)**

```bash
# Allow necessary ports
sudo ufw allow 5173/tcp
sudo ufw allow 5000/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

**Step 8: Setup Reverse Proxy with Nginx (Recommended for Production)**

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/pos
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/pos /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Step 9: Setup SSL with Let's Encrypt (Production)**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

**Step 10: Setup Auto-Start on Boot**

```bash
# Enable Docker to start on boot
sudo systemctl enable docker

# Containers will auto-start with Docker
```

### Option 2: Local Server Deployment

**Step 1: Install Prerequisites**

```bash
# Install Python 3.10+
sudo apt install python3 python3-pip python3-venv -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y
```

**Step 2: Setup Database**

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE pos_db;
CREATE USER pos_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE pos_db TO pos_user;
\q
```

**Step 3: Deploy Backend**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure .env
cp .env.example .env
nano .env  # Update DATABASE_URL and SECRET_KEY

# Run backend
python app.py
```

**Step 4: Deploy Frontend**

```bash
cd ../
npm install
npm run build

# Serve with a static server
npm install -g serve
serve -s dist -p 5173
```

**Step 5: Setup Process Manager (PM2)**

```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start app.py --name pos-backend --interpreter python3

# Start frontend
cd ..
pm2 serve dist 5173 --name pos-frontend --spa

# Save PM2 configuration
pm2 save
pm2 startup
```

### Option 3: Cloud Deployment

#### AWS EC2 Deployment

1. Launch EC2 instance (t2.medium or better)
2. Configure security groups (ports 80, 443, 22)
3. Follow Docker deployment steps above
4. Use Elastic IP for static IP address
5. Setup RDS PostgreSQL for production database (optional)

#### DigitalOcean Deployment

1. Create Droplet (Ubuntu 22.04, 2GB+ RAM)
2. Follow Docker deployment steps
3. Use DigitalOcean Managed Database for PostgreSQL (optional)

#### Google Cloud Platform

1. Create Compute Engine instance
2. Configure firewall rules
3. Follow Docker deployment steps
4. Use Cloud SQL for PostgreSQL (optional)

### Post-Deployment Checklist

- [ ] Application is accessible via domain/IP
- [ ] HTTPS/SSL is configured
- [ ] Database backups are scheduled
- [ ] Firewall rules are configured
- [ ] Environment variables are secure
- [ ] Logs are being monitored
- [ ] Auto-restart on failure is configured
- [ ] Default credentials are changed

### Monitoring & Maintenance

**View Application Logs**
```bash
# Docker deployment
docker compose logs -f

# PM2 deployment
pm2 logs
```

**Backup Database**
```bash
# Docker deployment
docker compose exec db pg_dump -U pos_user pos_db > backup.sql

# Restore
docker compose exec -T db psql -U pos_user pos_db < backup.sql
```

**Update Application**
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker compose down
docker compose up -d --build
```

## 🐳 Docker Commands

### Start services
```bash
docker compose up
```

### Start services in detached mode
```bash
docker compose up -d
```

### Stop services
```bash
docker compose down
```

### Rebuild containers
```bash
docker compose up --build
```

### View logs
```bash
docker compose logs -f
```

### Remove volumes (reset database)
```bash
docker compose down -v
```

## 📝 Environment Variables

### Backend (.env)

```env
# Database Configuration
DATABASE_URL=postgresql://pos_user:pos_password@db:5432/pos_db

# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=production

# Security
SECRET_KEY=your-secret-key-here
```

## 🎯 Usage

1. **Login**: Access the application and log in with your credentials
2. **Setup Tables**: Navigate to Tables page to add your restaurant tables
3. **Setup Menu**: Add categories, departments, and menu items
4. **Create Orders**: Take orders from the Orders page
5. **Generate Invoices**: Process payments and print invoices
6. **View Reports**: Track sales and business metrics
7. **Configure Settings**: Customize restaurant info and system preferences

## 🔒 Security

- Change the `SECRET_KEY` in `.env` before production deployment
- Never commit `.env` file to version control
- Use strong passwords for database credentials
- Configure CORS settings appropriately for your domain

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change ports in docker-compose.yml if needed
ports:
  - "3000:5173"  # Change 3000 to another port
```

### Database Connection Issues
```bash
# Reset database
docker-compose down -v
docker-compose up --build
```

### Frontend Can't Connect to Backend
- Verify backend is running on http://localhost:5000
- Check browser console for CORS errors
- Ensure `api.ts` uses correct API base URL

## 📞 Support

For issues and questions, please open an issue in the repository.
