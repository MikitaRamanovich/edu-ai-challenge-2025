import os
import sys
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def generate_analysis(input_text):
    """Generate a comprehensive analysis using OpenAI API."""
    prompt = f"""Analyze the following service or product and provide a comprehensive markdown-formatted report. 
    Include all of these sections:
    - Brief History
    - Target Audience
    - Core Features
    - Unique Selling Points
    - Business Model
    - Tech Stack Insights
    - Perceived Strengths
    - Perceived Weaknesses

    Input: {input_text}

    Provide the analysis in markdown format with clear section headers."""

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are a professional service/product analyst."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating analysis: {str(e)}")
        sys.exit(1)

def main():
    print("Service Analysis Tool")
    print("====================")
    print("Enter a service name (e.g., 'Spotify') or paste a service description text.")
    print("Press Ctrl+D (Unix) or Ctrl+Z (Windows) followed by Enter to submit.")
    print("\nInput:")
    
    # Read multiline input
    lines = []
    try:
        while True:
            line = input()
            lines.append(line)
    except EOFError:
        pass
    
    input_text = "\n".join(lines)
    
    if not input_text.strip():
        print("Error: No input provided")
        sys.exit(1)
    
    print("\nGenerating analysis...\n")
    analysis = generate_analysis(input_text)
    print(analysis)

if __name__ == "__main__":
    main() 