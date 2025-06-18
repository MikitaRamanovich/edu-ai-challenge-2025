# Product Search Tool

A console-based product search tool that uses natural language processing and OpenAI's function calling to find products based on user preferences.

## Features

- Natural language input for product search
- Filtering by category, price, rating, and stock availability
- Uses OpenAI's GPT-4.1-mini model for intelligent query understanding
- Structured output format for easy reading

## Prerequisites

- Python 3.7 or higher
- OpenAI API key

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd <repository-directory>
```

2. Install the required dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the project root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your-api-key-here
```

## Usage

1. Run the application:
```bash
python product_search.py
```

2. Enter your search query in natural language. For example:
   - "I need a smartphone under $800 with a great camera"
   - "Show me all electronics with a rating above 4.5"
   - "Find me in-stock fitness equipment under $100"

3. The application will display matching products in a structured format.

4. Type 'quit' to exit the application.

## Example Queries

- "Find me all electronics under $500"
- "Show me books with a rating above 4.5"
- "I need kitchen appliances that are in stock"
- "Find me fitness equipment under $50 with good ratings"

## Notes

- The application uses the `products.json` file as its data source
- Make sure your OpenAI API key is properly set in the `.env` file
- The application uses OpenAI's function calling mechanism to interpret natural language queries
