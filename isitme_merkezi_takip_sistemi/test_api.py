#!/usr/bin/env python
import requests
import json

# Test the hearing tests API
BASE_URL = 'http://127.0.0.1:8000/api'

def test_get_hearing_tests():
    """Test getting hearing tests"""
    try:
        response = requests.get(f'{BASE_URL}/hearing_tests/hearing_tests/')
        print(f"GET /hearing_tests/hearing_tests/ - Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Response count: {len(data) if isinstance(data, list) else data.get('count', 'N/A')}")
            if data and len(data) > 0:
                print(f"First test ID: {data[0].get('id', 'N/A')}")
                return data[0].get('id')
        else:
            print(f"Error response: {response.text}")
        return None
    except Exception as e:
        print(f"Error testing GET: {e}")
        return None

def test_update_hearing_test(test_id):
    """Test updating a hearing test"""
    if not test_id:
        print("No test ID available for update test")
        return
    
    # Test data for update
    update_data = {
        'notes': 'Test güncelleme - API test',
        'status': 'Completed'
    }
    
    try:
        print(f"\nTesting PATCH /hearing_tests/hearing_tests/{test_id}/")
        print(f"Update data: {update_data}")
        
        response = requests.patch(
            f'{BASE_URL}/hearing_tests/hearing_tests/{test_id}/',
            json=update_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"PATCH Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Update successful!")
        else:
            print("❌ Update failed!")
            
    except Exception as e:
        print(f"Error testing PATCH: {e}")

def test_update_with_form_data(test_id):
    """Test updating with form data (like the frontend does)"""
    if not test_id:
        print("No test ID available for form data update test")
        return
    
    # Test data for update (form data style)
    update_data = {
        'notes': 'Test güncelleme - Form data test',
        'status': 'Completed',
        'diagnosis': 'Test tanı'
    }
    
    try:
        print(f"\nTesting PATCH with form data /hearing_tests/hearing_tests/{test_id}/")
        print(f"Update data: {update_data}")
        
        response = requests.patch(
            f'{BASE_URL}/hearing_tests/hearing_tests/{test_id}/',
            data=update_data,
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        
        print(f"PATCH Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Form data update successful!")
        else:
            print("❌ Form data update failed!")
            
    except Exception as e:
        print(f"Error testing form data PATCH: {e}")

if __name__ == '__main__':
    print("Testing Hearing Tests API...")
    print("=" * 50)
    
    # Test getting hearing tests
    test_id = test_get_hearing_tests()
    
    if test_id:
        # Test updating with JSON
        test_update_hearing_test(test_id)
        
        # Test updating with form data
        test_update_with_form_data(test_id)
    else:
        print("No hearing tests found to test updates")
    
    print("\n" + "=" * 50)
    print("API testing completed!")
