"""
Database initialization script for PythonAnywhere deployment
Run this script to create all database tables
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db

def init_database():
    """Initialize the database with all tables"""
    try:
        with app.app_context():
            # Create all tables
            db.create_all()
            print("✓ Database tables created successfully!")
            
            # Verify tables were created
            from models import Table, TableOrder, Invoice, MenuItem, Category, Department, RestaurantSettings, KOTConfig, BillConfig
            
            tables = [
                ('Tables', Table),
                ('Orders', TableOrder),
                ('Invoices', Invoice),
                ('Menu Items', MenuItem),
                ('Categories', Category),
                ('Departments', Department),
                ('Restaurant Settings', RestaurantSettings),
                ('KOT Config', KOTConfig),
                ('Bill Config', BillConfig)
            ]
            
            print("\nVerifying tables:")
            for name, model in tables:
                try:
                    count = model.query.count()
                    print(f"  ✓ {name}: {count} records")
                except Exception as e:
                    print(f"  ✗ {name}: Error - {e}")
            
            print("\n✓ Database initialization complete!")
            return True
            
    except Exception as e:
        print(f"\n✗ Error initializing database: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("="*50)
    print("Database Initialization Script")
    print("="*50)
    print()
    
    success = init_database()
    
    if success:
        print("\nYou can now start using the application!")
        sys.exit(0)
    else:
        print("\nPlease fix the errors above and try again.")
        sys.exit(1)
