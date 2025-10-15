import os
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import logging

# Initialize Flask app
app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure CORS
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://pos_user:pos_password@localhost:5432/pos_db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Import models after db initialization
from models import db, Table, TableOrder, Invoice, KOTConfig, BillConfig

# Initialize database
db.init_app(app)

# Retry database connection
def connect_db():
    retries = 5
    while retries > 0:
        try:
            with app.app_context():
                db.create_all()
            logger.info("Database connected successfully")
            return True
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            retries -= 1
            if retries == 0:
                raise e
            logger.info(f"Retrying in 5 seconds... ({retries} attempts left)")
            time.sleep(5)

# Connect to database
try:
    connect_db()
except Exception as e:
    logger.error(f"Failed to connect to database after retries: {e}")

# Routes
@app.route('/api/tables', methods=['GET'])
def get_tables():
    """Get all tables"""
    try:
        tables = Table.query.all()
        return jsonify([table.to_dict() for table in tables])
    except Exception as e:
        logger.error(f"Error getting tables: {e}")
        return jsonify({'error': 'Failed to retrieve tables'}), 500

@app.route('/api/tables', methods=['POST'])
def create_table():
    """Create a new table"""
    try:
        data = request.get_json()
        
        new_table = Table(
            id=data.get('id', str(int(time.time() * 1000))),  # Generate ID if not provided
            name=data['name'],
            seats=data['seats'],
            category=data['category'],
            status=data.get('status', 'available')
        )
        
        db.session.add(new_table)
        db.session.commit()
        
        return jsonify(new_table.to_dict()), 201
    except Exception as e:
        logger.error(f"Error creating table: {e}")
        return jsonify({'error': 'Failed to create table'}), 500

@app.route('/api/tables/<string:table_id>', methods=['PUT'])
def update_table(table_id):
    """Update a table"""
    try:
        table = Table.query.get(table_id)
        if not table:
            return jsonify({'error': 'Table not found'}), 404
        
        data = request.get_json()
        table.name = data.get('name', table.name)
        table.seats = data.get('seats', table.seats)
        table.category = data.get('category', table.category)
        table.status = data.get('status', table.status)
        
        db.session.commit()
        
        return jsonify(table.to_dict())
    except Exception as e:
        logger.error(f"Error updating table: {e}")
        return jsonify({'error': 'Failed to update table'}), 500

@app.route('/api/tables/<string:table_id>', methods=['DELETE'])
def delete_table(table_id):
    """Delete a table"""
    try:
        table = Table.query.get(table_id)
        if not table:
            return jsonify({'error': 'Table not found'}), 404
        
        db.session.delete(table)
        db.session.commit()
        
        return jsonify({'message': 'Table deleted successfully'})
    except Exception as e:
        logger.error(f"Error deleting table: {e}")
        return jsonify({'error': 'Failed to delete table'}), 500

@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Get all orders"""
    try:
        orders = TableOrder.query.all()
        return jsonify([order.to_dict() for order in orders])
    except Exception as e:
        logger.error(f"Error getting orders: {e}")
        return jsonify({'error': 'Failed to retrieve orders'}), 500

@app.route('/api/orders/table/<string:table_id>', methods=['GET'])
def get_table_order(table_id):
    """Get order for a specific table"""
    try:
        order = TableOrder.query.filter_by(table_id=table_id).first()
        if order:
            return jsonify(order.to_dict())
        return jsonify(None)
    except Exception as e:
        logger.error(f"Error getting table order: {e}")
        return jsonify({'error': 'Failed to retrieve table order'}), 500

@app.route('/api/orders/table/<string:table_id>', methods=['POST'])
def add_items_to_table(table_id):
    """Add items to a table order"""
    try:
        data = request.get_json()
        
        # Check if order exists for this table
        order = TableOrder.query.filter_by(table_id=table_id).first()
        
        if not order:
            # Create new order
            order = TableOrder(
                table_id=table_id,
                table_name=data['table_name'],
                items=json.dumps(data['items']),
                start_time=datetime.now()
            )
            db.session.add(order)
            
            # Update table status
            table = Table.query.get(table_id)
            if table:
                table.status = 'occupied'
        else:
            # Update existing order
            existing_items = json.loads(order.items) if order.items else []
            new_items = data['items']
            
            # Merge items
            for new_item in new_items:
                existing_item_index = None
                for i, item in enumerate(existing_items):
                    if item['id'] == new_item['id'] and item.get('sentToKitchen', False):
                        # Item already sent to kitchen, add as new item
                        existing_items.append(new_item)
                        existing_item_index = -1
                        break
                    elif item['id'] == new_item['id'] and not item.get('sentToKitchen', False):
                        # Update quantity of pending item
                        existing_items[i]['quantity'] += new_item['quantity']
                        existing_item_index = i
                        break
                
                if existing_item_index is None:
                    # New item
                    existing_items.append(new_item)
            
            order.items = json.dumps(existing_items)
            
            # Update table status
            table = Table.query.get(table_id)
            if table:
                table.status = 'occupied'
        
        db.session.commit()
        
        return jsonify(order.to_dict())
    except Exception as e:
        logger.error(f"Error adding items to table: {e}")
        return jsonify({'error': 'Failed to add items to table'}), 500

@app.route('/api/orders/table/<string:table_id>/sent', methods=['POST'])
def mark_items_as_sent(table_id):
    """Mark all items in an order as sent to kitchen"""
    try:
        order = TableOrder.query.filter_by(table_id=table_id).first()
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        items = json.loads(order.items) if order.items else []
        for item in items:
            item['sentToKitchen'] = True
        
        order.items = json.dumps(items)
        db.session.commit()
        
        return jsonify(order.to_dict())
    except Exception as e:
        logger.error(f"Error marking items as sent: {e}")
        return jsonify({'error': 'Failed to mark items as sent'}), 500

@app.route('/api/orders/table/<string:table_id>/complete', methods=['POST'])
def complete_table_order(table_id):
    """Complete an order and remove it"""
    try:
        order = TableOrder.query.filter_by(table_id=table_id).first()
        if order:
            db.session.delete(order)
        
        # Update table status
        table = Table.query.get(table_id)
        if table:
            table.status = 'available'
        
        db.session.commit()
        
        return jsonify({'message': 'Order completed successfully'})
    except Exception as e:
        logger.error(f"Error completing table order: {e}")
        return jsonify({'error': 'Failed to complete order'}), 500

@app.route('/api/invoices', methods=['GET'])
def get_invoices():
    """Get all invoices"""
    try:
        invoices = Invoice.query.all()
        return jsonify([invoice.to_dict() for invoice in invoices])
    except Exception as e:
        logger.error(f"Error getting invoices: {e}")
        return jsonify({'error': 'Failed to retrieve invoices'}), 500

@app.route('/api/invoices', methods=['POST'])
def add_invoice():
    """Add a new invoice"""
    try:
        data = request.get_json()
        
        new_invoice = Invoice(
            id=data.get('id', str(int(time.time() * 1000))),  # Generate ID if not provided
            bill_number=data['billNumber'],
            order_type=data['orderType'],
            table_name=data.get('tableName'),
            items=json.dumps(data['items']),
            subtotal=data['subtotal'],
            tax=data['tax'],
            total=data['total'],
            timestamp=datetime.fromisoformat(data['timestamp'].replace('Z', '+00:00'))
        )
        
        db.session.add(new_invoice)
        db.session.commit()
        
        return jsonify(new_invoice.to_dict()), 201
    except Exception as e:
        logger.error(f"Error adding invoice: {e}")
        return jsonify({'error': 'Failed to add invoice'}), 500

@app.route('/api/config/kot', methods=['GET'])
def get_kot_config():
    """Get KOT configuration"""
    try:
        config = KOTConfig.query.first()
        if not config:
            # Create default config
            config = KOTConfig(
                print_by_department=False,
                number_of_copies=1
            )
            db.session.add(config)
            db.session.commit()
        
        return jsonify(config.to_dict())
    except Exception as e:
        logger.error(f"Error getting KOT config: {e}")
        return jsonify({'error': 'Failed to retrieve KOT configuration'}), 500

@app.route('/api/config/kot', methods=['PUT'])
def update_kot_config():
    """Update KOT configuration"""
    try:
        config = KOTConfig.query.first()
        if not config:
            config = KOTConfig()
            db.session.add(config)
        
        data = request.get_json()
        config.print_by_department = data.get('printByDepartment', config.print_by_department)
        config.number_of_copies = data.get('numberOfCopies', config.number_of_copies)
        
        db.session.commit()
        
        return jsonify(config.to_dict())
    except Exception as e:
        logger.error(f"Error updating KOT config: {e}")
        return jsonify({'error': 'Failed to update KOT configuration'}), 500

@app.route('/api/config/bill', methods=['GET'])
def get_bill_config():
    """Get bill configuration"""
    try:
        config = BillConfig.query.first()
        if not config:
            # Create default config
            config = BillConfig(
                auto_print_dine_in=False,
                auto_print_takeaway=False
            )
            db.session.add(config)
            db.session.commit()
        
        return jsonify(config.to_dict())
    except Exception as e:
        logger.error(f"Error getting bill config: {e}")
        return jsonify({'error': 'Failed to retrieve bill configuration'}), 500

@app.route('/api/config/bill', methods=['PUT'])
def update_bill_config():
    """Update bill configuration"""
    try:
        config = BillConfig.query.first()
        if not config:
            config = BillConfig()
            db.session.add(config)
        
        data = request.get_json()
        config.auto_print_dine_in = data.get('autoPrintDineIn', config.auto_print_dine_in)
        config.auto_print_takeaway = data.get('autoPrintTakeaway', config.auto_print_takeaway)
        
        db.session.commit()
        
        return jsonify(config.to_dict())
    except Exception as e:
        logger.error(f"Error updating bill config: {e}")
        return jsonify({'error': 'Failed to update bill configuration'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """User login"""
    try:
        data = request.get_json()
        # In a real application, you would validate credentials against a user database
        # For now, we'll just return a success response
        return jsonify({'message': 'Login successful'})
    except Exception as e:
        logger.error(f"Error during login: {e}")
        return jsonify({'error': 'Login failed'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)