# Restaurant POS System

A modern Point of Sale system for restaurants built with React, TypeScript, and Tailwind CSS for the frontend, and Python Flask with PostgreSQL for the backend.

## Features

- Table management (add, edit, delete tables)
- Order management (create, modify, complete orders)
- Invoice generation and printing
- Kitchen Order Ticket (KOT) printing
- Configuration settings for KOT and billing
- Responsive design for different screen sizes

## Project Structure

```
.
├── backend/              # Python Flask backend
│   ├── app.py           # Main Flask application
│   ├── models.py        # Database models
│   ├── requirements.txt # Python dependencies
│   └── ...              # Other backend files
├── src/                 # React frontend source
│   ├── components/      # React components
│   ├── contexts/        # React contexts
│   ├── services/        # API service layer
│   └── ...              # Other frontend files
├── docker-compose.yml   # Docker Compose configuration
└── ...                  # Other project files
```

## Deployment with Docker

1. Make sure Docker and Docker Compose are installed
2. Run `docker-compose up` from the root directory
3. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - PostgreSQL: localhost:5432

## Local Development

### Frontend

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Access the application at http://localhost:3000

### Backend

1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Set up PostgreSQL database
4. Update the DATABASE_URL in [.env](file:///C:/Users/pc/OneDrive/Desktop/POS%20Figma/New%20folder/POS_FINAL/backend/.env) file
5. Run the application: `python app.py`
6. The API will be available at http://localhost:5000

## API Documentation

See [backend/README.md](file:///C:/Users/pc/OneDrive/Desktop/POS%20Figma/New%20folder/POS_FINAL/backend/README.md) for detailed API documentation.

## Database Schema

The application uses PostgreSQL with the following tables:
- `tables` - Restaurant tables
- `table_orders` - Table orders with items
- `invoices` - Generated invoices
- `kot_config` - Kitchen Order Ticket configuration
- `bill_config` - Bill printing configuration

## License

This project is licensed under the MIT License.