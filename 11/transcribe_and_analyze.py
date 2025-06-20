import os
import sys
import time
import json
from collections import Counter
from dotenv import load_dotenv
import openai
from mutagen import File as MutagenFile

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    print('Error: OPENAI_API_KEY not found in .env file.')
    sys.exit(1)
openai.api_key = OPENAI_API_KEY

# Helper: get audio duration (requires ffmpeg)
def get_audio_duration(filename):
    try:
        audio = MutagenFile(filename)
        if audio is not None and audio.info is not None:
            return audio.info.length
        else:
            return None
    except Exception:
        return None

def transcribe_audio(file_path):
    with open(file_path, 'rb') as audio_file:
        transcript = openai.audio.transcriptions.create(
            model='whisper-1',
            file=audio_file,
            response_format='text'
        )
    return transcript

def summarize_text(text):
    prompt = (
        "Summarize the following transcript in a concise paragraph, "
        "highlighting the main topics and key points:\n" + text
    )
    response = openai.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300
    )
    return response.choices[0].message.content.strip()

def extract_topics(text, top_n=3):
    prompt = (
        "Given the following transcript, identify the most frequently mentioned topics or themes. "
        "Return a JSON array of objects, each with 'topic' and 'mentions' fields, sorted by mentions descending. "
        f"Return at least {top_n} topics.\nTranscript:\n" + text
    )
    response = openai.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300
    )
    import re
    import ast
    # Try to extract JSON from the response
    match = re.search(r'\[.*\]', response.choices[0].message.content, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except Exception:
            try:
                return ast.literal_eval(match.group(0))
            except Exception:
                return []
    return []

def analyze_transcript(text, audio_duration_sec):
    words = text.split()
    word_count = len(words)
    wpm = int(word_count / (audio_duration_sec / 60)) if audio_duration_sec else None
    topics = extract_topics(text, top_n=3)
    return {
        "word_count": word_count,
        "speaking_speed_wpm": wpm,
        "frequently_mentioned_topics": topics
    }

def save_file(prefix, ext, content):
    timestamp = time.strftime('%Y%m%d_%H%M%S')
    filename = f"{prefix}_{timestamp}.{ext}"
    with open(filename, 'w', encoding='utf-8') as f:
        if ext == 'json':
            json.dump(content, f, indent=2, ensure_ascii=False)
        else:
            f.write(content)
    return filename

def main():
    if len(sys.argv) != 2:
        print("Usage: python transcribe_and_analyze.py <audio_file>")
        sys.exit(1)
    audio_file = sys.argv[1]
    if not os.path.isfile(audio_file):
        print(f"File not found: {audio_file}")
        sys.exit(1)
    print("Transcribing audio... (this may take a while)")
    transcript = transcribe_audio(audio_file)
    print("Transcription complete. Summarizing...")
    summary = summarize_text(transcript)
    print("Summary complete. Analyzing...")
    duration = get_audio_duration(audio_file)
    analysis = analyze_transcript(transcript, duration)
    # Save outputs
    trans_file = save_file('transcription', 'md', transcript)
    summ_file = save_file('summary', 'md', summary)
    analysis_file = save_file('analysis', 'json', analysis)
    # Output to console
    print("\nSummary:\n" + summary)
    print("\nAnalytics:")
    print(json.dumps(analysis, indent=2, ensure_ascii=False))
    print(f"\nFiles saved: {trans_file}, {summ_file}, {analysis_file}")

if __name__ == "__main__":
    main() 