import json
import os
from typing import List, Dict, Any
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def load_products() -> List[Dict[str, Any]]:
    """Load products from the JSON file."""
    with open('products.json', 'r') as f:
        return json.load(f)

def search_products(query: str, products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Search products using OpenAI's function calling."""
    
    # Define the function schema for product filtering
    functions = [{
        "name": "filter_products",
        "description": "Filter products based on user preferences and return matching products",
        "parameters": {
            "type": "object",
            "properties": {
                "matching_products": {
                    "type": "array",
                    "description": "List of products that match the user's criteria",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string"},
                            "category": {"type": "string"},
                            "price": {"type": "number"},
                            "rating": {"type": "number"},
                            "in_stock": {"type": "boolean"}
                        },
                        "required": ["name", "category", "price", "rating", "in_stock"]
                    }
                }
            },
            "required": ["matching_products"]
        }
    }]

    # Call OpenAI API with function calling
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that helps users find products based on their preferences. You have access to the following products: " + json.dumps(products) + "\nPlease return only products that exactly match the user's criteria. Each product must include all required fields: name, category, price, rating, and in_stock."},
            {"role": "user", "content": f"Find products based on this request: {query}"}
        ],
        functions=functions,
        function_call={"name": "filter_products"}
    )

    try:
        # Extract the function call parameters
        function_call = response.choices[0].message.function_call
        result = json.loads(function_call.arguments)
        
        # Validate the response format
        if not isinstance(result.get("matching_products"), list):
            raise ValueError("Invalid response format: matching_products must be a list")
            
        # Validate each product in the response
        for product in result["matching_products"]:
            required_fields = ["name", "category", "price", "rating", "in_stock"]
            for field in required_fields:
                if field not in product:
                    raise ValueError(f"Invalid product format: missing required field '{field}'")
                if not isinstance(product[field], (str, int, float, bool)):
                    raise ValueError(f"Invalid product format: field '{field}' has incorrect type")
        
        return result["matching_products"]
    except Exception as e:
        print(f"Error processing API response: {str(e)}")
        return []

def display_products(products: List[Dict[str, Any]]):
    """Display the filtered products in a formatted way."""
    if not products:
        print("No products found matching your criteria.")
        return

    print("\nFiltered Products:")
    for i, product in enumerate(products, 1):
        stock_status = "In Stock" if product['in_stock'] else "Out of Stock"
        print(f"{i}. {product['name']} - ${product['price']:.2f}, Rating: {product['rating']}, {stock_status}")

def main():
    """Main function to run the product search application."""
    print("Welcome to the Product Search Tool!")
    print("Enter your product preferences in natural language (e.g., 'I need a smartphone under $800 with a great camera')")
    print("Type 'quit' to exit")
    
    products = load_products()
    
    while True:
        query = input("\nEnter your search query: ").strip()
        if query.lower() == 'quit':
            break
            
        try:
            filtered_products = search_products(query, products)
            display_products(filtered_products)
        except Exception as e:
            print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main() 