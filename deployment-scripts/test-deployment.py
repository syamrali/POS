#!/usr/bin/env python3
"""
Deployment Testing Script
Run this script to verify your PythonAnywhere deployment
"""

import requests
import sys
from typing import Dict, List, Tuple

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_header(text: str):
    print(f"\n{Colors.BLUE}{Colors.BOLD}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}{Colors.BOLD}{text.center(60)}{Colors.END}")
    print(f"{Colors.BLUE}{Colors.BOLD}{'='*60}{Colors.END}\n")

def print_success(text: str):
    print(f"{Colors.GREEN}✓ {text}{Colors.END}")

def print_error(text: str):
    print(f"{Colors.RED}✗ {text}{Colors.END}")

def print_warning(text: str):
    print(f"{Colors.YELLOW}⚠ {text}{Colors.END}")

def print_info(text: str):
    print(f"{Colors.BLUE}ℹ {text}{Colors.END}")

def test_endpoint(base_url: str, endpoint: str, method: str = 'GET') -> Tuple[bool, str]:
    """Test a single API endpoint"""
    url = f"{base_url}{endpoint}"
    try:
        if method == 'GET':
            response = requests.get(url, timeout=10)
        else:
            return False, f"Method {method} not implemented"
        
        if response.status_code == 200:
            return True, f"Status: {response.status_code}"
        elif response.status_code == 404:
            return False, f"Not Found (404)"
        elif response.status_code == 500:
            return False, f"Server Error (500)"
        else:
            return False, f"Status: {response.status_code}"
    except requests.exceptions.ConnectionError:
        return False, "Connection failed - Is the server running?"
    except requests.exceptions.Timeout:
        return False, "Request timeout"
    except Exception as e:
        return False, f"Error: {str(e)}"

def main():
    print_header("PythonAnywhere Deployment Test")
    
    # Get base URL from user
    print_info("Enter your PythonAnywhere URL")
    username = input(f"{Colors.BOLD}Username: {Colors.END}").strip()
    
    if not username:
        print_error("Username is required")
        sys.exit(1)
    
    base_url = f"https://{username}.pythonanywhere.com"
    
    print(f"\n{Colors.BOLD}Testing: {base_url}{Colors.END}\n")
    
    # Test frontend
    print_header("Frontend Tests")
    
    success, message = test_endpoint(base_url, "/")
    if success:
        print_success(f"Homepage accessible - {message}")
    else:
        print_error(f"Homepage failed - {message}")
    
    # Test API endpoints
    print_header("API Endpoint Tests")
    
    endpoints = [
        ("/api/tables", "Tables"),
        ("/api/orders", "Orders"),
        ("/api/invoices", "Invoices"),
        ("/api/menu-items", "Menu Items"),
        ("/api/categories", "Categories"),
        ("/api/departments", "Departments"),
        ("/api/restaurant-settings", "Restaurant Settings"),
        ("/api/config/kot", "KOT Configuration"),
        ("/api/config/bill", "Bill Configuration"),
    ]
    
    passed = 0
    failed = 0
    
    for endpoint, name in endpoints:
        success, message = test_endpoint(base_url, endpoint)
        if success:
            print_success(f"{name:.<30} {message}")
            passed += 1
        else:
            print_error(f"{name:.<30} {message}")
            failed += 1
    
    # Summary
    print_header("Test Summary")
    
    total = passed + failed
    print(f"Total Tests: {total}")
    print_success(f"Passed: {passed}")
    if failed > 0:
        print_error(f"Failed: {failed}")
    else:
        print_success(f"Failed: {failed}")
    
    print(f"\nSuccess Rate: {(passed/total*100):.1f}%\n")
    
    if failed == 0:
        print_success("All tests passed! Your deployment is working correctly. ✓")
        return 0
    else:
        print_warning(f"{failed} test(s) failed. Please check:")
        print("  1. Error logs in PythonAnywhere Web tab")
        print("  2. Database connection in .env file")
        print("  3. WSGI configuration")
        print("  4. Virtual environment path")
        return 1

if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
        sys.exit(1)
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        sys.exit(1)
