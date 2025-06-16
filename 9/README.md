# Service Analysis Tool

A lightweight console application that generates comprehensive, markdown-formatted reports about services or products from multiple viewpoints.

## Features

- Accepts service names or raw service descriptions as input
- Generates detailed analysis including:
  - Brief History
  - Target Audience
  - Core Features
  - Unique Selling Points
  - Business Model
  - Tech Stack Insights
  - Perceived Strengths
  - Perceived Weaknesses

## Prerequisites

- Python 3.7 or higher
- OpenAI API key

## Setup

1. Clone this repository
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the project root and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## Usage

1. Run the application:
   ```bash
   python service_analyzer.py
   ```

2. Enter a service name (e.g., "Spotify") or paste a service description text
3. Press Ctrl+D (Unix) or Ctrl+Z (Windows) followed by Enter to submit
4. The analysis will be displayed in the terminal

## Sample Outputs

See `sample_outputs.md` for example analyses of different services.

## Security Note

Never commit your `.env` file or expose your API key. The `.env` file is already included in `.gitignore`.
