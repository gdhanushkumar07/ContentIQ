import sys
import json
import argparse
import subprocess
import os
import tempfile
from faster_whisper import WhisperModel

def extract_audio(video_url, output_audio_path):
    print(f"Extracting audio from {video_url} to {output_audio_path}", file=sys.stderr)
    try:
        subprocess.run([
            "ffmpeg", "-y", "-i", video_url,
            "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le",
            output_audio_path
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg audio extraction failed: {e}", file=sys.stderr)
        sys.exit(1)

def transcribe(audio_path):
    print(f"Loading faster-whisper small model...", file=sys.stderr)
    model = WhisperModel("small", compute_type="int8")
    
    print(f"Starting transcription...", file=sys.stderr)
    segments, info = model.transcribe(
        audio_path,
        beam_size=5,
        vad_filter=True
    )
    
    results = []
    for segment in segments:
        results.append({
            "start": round(segment.start, 2),
            "end": round(segment.end, 2),
            "text": segment.text.strip()
        })
        
    return results

def main():
    parser = argparse.ArgumentParser(description="Transcribe video URL to JSON using Faster-Whisper")
    parser.add_argument("video_url", help="Presigned S3 URL or local path to the video file")
    args = parser.parse_args()

    with tempfile.TemporaryDirectory() as temp_dir:
        audio_path = os.path.join(temp_dir, "audio.wav")
        extract_audio(args.video_url, audio_path)
        
        segments = transcribe(audio_path)
        
        # Print JSON to stdout so Node.js can parse it easily
        print(json.dumps(segments))

if __name__ == "__main__":
    main()
