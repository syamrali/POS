import os
import sys
from app import app, db
from models import Table, KOTConfig, BillConfig

def init_database():
    """Initialize the database with sample data"""
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Check if we already have data
        if Table.query.first() is None:
            # Add sample tables
            sample_tables = [
                Table(id="1", name="A1", seats=2, category="General", status="available"),
                Table(id="2", name="A2", seats=2, category="General", status="available"),
                Table(id="3", name="B1", seats=4, category="Family", status="available"),
                Table(id="4", name="B2", seats=4, category="Family", status="available"),
                Table(id="5", name="M1", seats=6, category="Mandi", status="available"),
                Table(id="6", name="M2", seats=6, category="Mandi", status="available"),
                Table(id="7", name="VIP1", seats=8, category="Party Hall", status="available"),
                Table(id="8", name="C1", seats=4, category="General", status="available"),
            ]
            
            for table in sample_tables:
                db.session.add(table)
            
            print("Added sample tables to database")
        
        # Check if we have KOT config
        if KOTConfig.query.first() is None:
            kot_config = KOTConfig(print_by_department=False, number_of_copies=1)
            db.session.add(kot_config)
            print("Added default KOT configuration")
        
        # Check if we have Bill config
        if BillConfig.query.first() is None:
            bill_config = BillConfig(auto_print_dine_in=False, auto_print_takeaway=False)
            db.session.add(bill_config)
            print("Added default Bill configuration")
        
        # Commit changes
        db.session.commit()
        print("Database initialized successfully!")

if __name__ == "__main__":
    init_database()