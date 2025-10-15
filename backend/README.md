# Restaurant POS Backend API

This is the backend API for the Restaurant POS system, built with Python Flask and PostgreSQL.

## API Endpoints

### Tables
- `GET /api/tables` - Get all tables
- `POST /api/tables` - Create a new table
- `PUT /api/tables/<table_id>` - Update a table
- `DELETE /api/tables/<table_id>` - Delete a table

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/table/<table_id>` - Get order for a specific table
- `POST /api/orders/table/<table_id>` - Add items to a table order
- `POST /api/orders/table/<table_id>/sent` - Mark all items in an order as sent to kitchen
- `POST /api/orders/table/<table_id>/complete` - Complete an order and remove it

### Invoices
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Add a new invoice

### Configuration
- `GET /api/config/kot` - Get KOT configuration
- `PUT /api/config/kot` - Update KOT configuration
- `GET /api/config/bill` - Get bill configuration
- `PUT /api/config/bill` - Update bill configuration

### Authentication
- `POST /api/login` - User login

## Database Schema

The application uses the following tables:

1. **tables** - Restaurant tables
2. **table_orders** - Table orders with items
3. **invoices** - Generated invoices
4. **kot_config** - Kitchen Order Ticket configuration
5. **bill_config** - Bill printing configuration

## Deployment with Docker

To deploy the application using Docker:

1. Make sure Docker and Docker Compose are installed
2. Run `docker-compose up` from the root directory
3. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - PostgreSQL: localhost:5432

## Local Development

To run the backend locally:

1. Install dependencies: `pip install -r requirements.txt`
2. Set up PostgreSQL database
3. Update the DATABASE_URL in [.env](file:///C:/Users/pc/OneDrive/Desktop/POS%20Figma/New%20folder/POS_FINAL/backend/.env) file
4. Run the application: `python app.py`

The API will be available at http://localhost:5000