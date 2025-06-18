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
        "description": "Filter products based on user preferences",
        "parameters": {
            "type": "object",
            "properties": {
                "category": {
                    "type": "string",
                    "description": "Product category (Electronics, Fitness, Kitchen, Books, Clothing)"
                },
                "max_price": {
                    "type": "number",
                    "description": "Maximum price of the product"
                },
                "min_rating": {
                    "type": "number",
                    "description": "Minimum rating of the product (1-5)"
                },
                "in_stock": {
                    "type": "boolean",
                    "description": "Whether the product should be in stock"
                }
            }
        }
    }]

    # Call OpenAI API with function calling
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that helps users find products based on their preferences."},
            {"role": "user", "content": f"Find products based on this request: {query}"}
        ],
        functions=functions,
        function_call={"name": "filter_products"}
    )

    # Extract the function call parameters
    function_call = response.choices[0].message.function_call
    filter_params = json.loads(function_call.arguments)

    # Apply the filters to the products
    filtered_products = []
    for product in products:
        if (filter_params.get('category') and product['category'] != filter_params['category']):
            continue
        if (filter_params.get('max_price') and product['price'] > filter_params['max_price']):
            continue
        if (filter_params.get('min_rating') and product['rating'] < filter_params['min_rating']):
            continue
        if (filter_params.get('in_stock') is not None and product['in_stock'] != filter_params['in_stock']):
            continue
        filtered_products.append(product)

    return filtered_products

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