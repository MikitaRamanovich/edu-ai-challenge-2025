# Audio Transcription & Analysis Console App

## Overview
This console application:
- Accepts a spoken audio file (e.g., mp3, wav)
- Transcribes it using OpenAI's Whisper API
- Summarizes the transcription using OpenAI GPT
- Extracts analytics: word count, speaking speed (WPM), and frequently mentioned topics
- Saves each transcription, summary, and analysis in separate files
- Outputs summary and analytics to the console

## Requirements
- Python 3.8+
- An OpenAI API key (not stored in the repo)

## Setup
1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Set up your OpenAI API key:**
   - Create a file named `.env` in the project root.
   - Add your API key:
     ```env
     OPENAI_API_KEY=your_openai_api_key_here
     ```

## Usage
To transcribe and analyze an audio file (e.g., `CAR0004.mp3`):

```bash
python transcribe_and_analyze.py CAR0004.mp3
```

- The script will output the summary and analytics to the console.
- It will also create:
  - `transcription_<timestamp>.md` (full transcript)
  - `summary_<timestamp>.md` (summary)
  - `analysis_<timestamp>.json` (analytics)

## Output Example
```
Summary:
<summary text>

Analytics:
{
  "word_count": 1280,
  "speaking_speed_wpm": 132,
  "frequently_mentioned_topics": [
    { "topic": "Customer Onboarding", "mentions": 6 },
    { "topic": "Q4 Roadmap", "mentions": 4 },
    { "topic": "AI Integration", "mentions": 3 }
  ]
}
```

## Notes
- The app works with any audio file supported by OpenAI Whisper.
- Your OpenAI API key is required and must be kept private.
