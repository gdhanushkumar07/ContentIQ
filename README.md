ContentIQ
AI-Powered Media Intelligence Platform

Overview
ContentIQ is a comprehensive AI-powered platform designed to transform raw videos and footage into viral impact. It provides creators with advanced tools for scene intelligence, engagement prediction, script generation, and automated multilingual distribution. By building on top of cutting-edge AI models from AWS and ElevenLabs, ContentIQ streamlines the entire media creation lifecycle from conceptualization to global publishing without losing your authentic voice.

Key Features

* **Video Intelligence Pipeline**: Automated frame-level scene detection and audio transcription utilizing AWS Lambda Transcribe integration.
* **Script Generator**: AI-driven script writing featuring a Predicted Performance Matrix to optimize viewer retention and engagement metrics.
* **Universal Translator & Multilingual Dubbing**: Seamless text-to-text translation and text-to-audio AI dubbing algorithms to globalize your content.
* **BGM Suggestor**: Automated context-aware background music generation and reliable high-quality audio downloads.
* **Social Distribution**: Automatically generate platform-tailored social media copy and share seamlessly directly to networks like X (Twitter) and Facebook.


Tech Stack

* **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Framer Motion
* **Authentication**: NextAuth.js
* **Cloud Infrastructure & Data**: AWS S3, DynamoDB, AWS Lambda
* **AI & Machine Learning**:

  * Amazon Bedrock (Nova-Pro & Nova-Lite models)
  * AWS Rekognition (Image/Video Analysis)
  * AWS Transcribe, Translate & Polly
  * ElevenLabs (Advanced Text-to-Speech)

Installation

1. Clone the repository:

```bash
git clone https://github.com/gdhanushkumar07/ContentIQ.git
cd ContentIQ
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
```

Configuration / Environment Variables

Create a `.env.local` file in the root of your project and configure the following environment variables:

```env
 AWS Services Access
MY_AWS_ACCESS_KEY_ID=your_aws_access_key
MY_AWS_SECRET_ACCESS_KEY=your_aws_secret_key
MY_AWS_REGION=us-east-1
S3_BUCKET_NAME=your_s3_bucket_name

 ElevenLabs API Integration
ELEVENLABS_API_KEY_1=your_elevenlabs_key

Amazon Bedrock Nova Models
NOVA_LITE_MODEL_ID="us.amazon.nova-2-lite-v1:0"
NOVA_PRO_MODEL_ID="us.amazon.nova-pro-v1:0"

NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Serverless Subroutines
TRANSCRIBE_LAMBDA_NAME="lambda-transcribe"
```

Usage

1. **Run the development server:**

```bash
npm run dev
```

2. **Open the application:**
    Navigate to the link given in the terminal when  u run the command npm run dev.
    Deploy link: http://98.89.43.72:3000.

3. Authenticate using the robust NextAuth setup and navigate to the `/dashboard` to start processing media.

Project Structure

A brief overview of the top-level directory structure:

* `app/`: Next.js 14 App Router layout, global CSS, and main pages.

  * `app/dashboard/`: Contains isolated module sub-routes (`video-intelligence`, `script-generator`, `translator`, etc.).
  * `app/api/`: Backend Next.js API routes for securely interfacing with AWS and internal utilities.
* `components/`: Reusable React components (`Sidebar`, `PlexusBackground`, ` tubelight-navbar`). Includes dedicated sub-directories for `icons`, `ui`, and layout `sections`.
* `lib/`: Core utilities and external API library wrappers (`aws.ts`, `elevenlabs.ts`, `transcribe.py`).
* `public/`: Static application assets, fonts, and images.

API or Core Modules

* **AWS Bedrock Integration (`lib/aws.ts`)**: Secure handlers utilizing `us.amazon.nova` foundation models for intelligent content evaluation and text generation.
* **Transcription Engine (`lib/transcribe.py`)**: Dedicated processing workflows integrating Python, local models (Faster-Whisper), and `lambda-transcribe` to efficiently process long-form audio constraints.
* **ElevenLabs Module (`lib/elevenlabs.ts`)**: Direct wrappers for generating ultra-realistic AI dubbing audio tracks.

Future Improvements / Roadmap

* Expand the local video processing pipeline for complete offline capabilities.
* Add real-time performance analytics tracking directly within the Social Distribution dashboard.
* Increase integration support for additional social media APIs (LinkedIn, TikTok, Instagram Reels).
* Enhance the privacy filter with localized audio-bleep functionality for PII audio occurrences.

Contributing
Contributions are welcome! Please follow these steps to contribute:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

