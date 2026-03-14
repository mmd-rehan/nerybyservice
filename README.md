# NeryByService: AI-Powered Hyper-Local Help

A minimal local service discovery platform connecting users with local service providers.
**“Don’t search for services. Show or describe your problem and let AI find the right help nearby.”**

---

# The Problem

Finding reliable local help is still surprisingly frustrating.

When something breaks in real life, people rarely know **which service category to search for**. A leaking pipe, a strange noise in the car engine, or a malfunctioning appliance often requires guessing the right keywords or browsing through dozens of irrelevant listings.

Traditional directories make the process even harder. They show businesses far away, outdated listings, or require users to fill long request forms and wait hours for responses.

But when real problems happen, people need something much simpler:

**Show the problem Get help nearby Contact instantly.**

---

# The Solution: NeryByService

NeryByService is an **AI-powered hyper-local service discovery platform** that connects users with nearby service providers in real time.

Instead of manually searching through categories, users can simply:

• Type a request
• Speak to the app
• Upload a photo
• Record a short video

AI analyzes the input, understands the problem, and instantly finds the most relevant service providers nearby.

By combining **multimodal AI understanding with precise geolocation**, NeryByService turns real-world problems into actionable service matches within seconds.

---

# Core Capabilities

### AI Problem Understanding

Users can describe their issue naturally, and AI converts it into a structured service search.

Example:

User input
*"My AC is not cooling."*

AI interprets
**Service:** AC Repair
**Category:** Home Repair

Nearby technicians are instantly displayed.

---

### 🎤 Voice-Based Search

Users can simply **speak their problem**, and AI transcribes and interprets the request to find nearby services.

This makes the platform accessible even when typing is inconvenient or impossible.

---

###  Image-Based Problem Detection

Users can upload a photo of the issue.

Example:
A photo of a leaking pipe.

AI detects the problem and automatically searches for **plumbers nearby**.

---

###  Video-Based Service Discovery

For more complex issues, users can upload a short video.

The system analyzes visual frames and audio to determine the problem and recommend the appropriate service providers.

---

###  Hyper-Local Precision

Using MongoDB geospatial indexing and interactive maps, NeryByService displays services within a specific radius of the user.

Instead of generic results, users see **real providers close to them right now**.

---

### ⚡ Instant Connection

Once a service is found, users can connect immediately via:

• Direct phone call
• WhatsApp messaging

No quote forms. No waiting.

---

#  Built for a New Generation of Local Marketplaces

NeryByService is not only a consumer tool but also a **scalable marketplace platform** for local services.

Service providers gain visibility to customers in their immediate area, helping them receive jobs faster without expensive advertising.

Platform operators can monetize through:

• provider subscriptions
• premium listings
• promotional campaigns
• coupon and discount systems

---

#  Technical Architecture

The platform is built with a modern, scalable architecture designed for real-time discovery and AI integration.

Frontend
React (Vite) with Leaflet interactive maps

Backend
Node.js + Express

Database
MongoDB with 2dsphere geospatial indexing

AI Layer
Amazon Nova foundation models enabling natural language reasoning, voice processing, and multimodal understanding.

---

# How the AI System Works

NeryByService uses a **multimodal AI pipeline** that allows users to search for local services using **text, voice, images, or video**. The system converts these different types of inputs into a structured search query, which is then used to find the most relevant nearby service providers.

The core idea is simple:

**Understand the user's problem → Convert it into a service request → Find the nearest providers.**

---

# Multimodal Input Processing Pipeline

The platform accepts four types of inputs:

• Text
• Voice recording
• Image upload
• Video upload

Regardless of the input type, the system converts everything into **text describing the problem**, which is then interpreted by AI.

---

# 1. Text Input Processing

When a user types a request such as:

> "My washing machine stopped working"

The request is sent to the reasoning model Amazon Nova 2 Lite.

Nova analyzes the request and extracts structured search information.

Example output:

```json
{
  "serviceTitle": "appliance repair",
  "category": "home repair",
  "keywords": ["washing machine", "repair", "appliance"]
}
```

This structured data allows the backend to perform a precise search in the database.

---

# 2. Voice Input Processing

If the user records a voice message, the system captures the audio using the browser’s recording API and uploads it to the backend.

The audio is processed using Amazon Nova 2 Sonic, which converts speech into text.

Example transcription:

> "My air conditioner is not cooling."

The transcribed text is then passed to Nova 2 Lite to extract the structured service request, just like a typed query.

---

# 3. Image Input Processing

When a user uploads an image of a problem, the system analyzes the visual content using Amazon Nova Multimodal Embeddings.

The model identifies relevant objects and issues within the image.

Example:

Image: leaking pipe under a sink

AI interpretation:

> "Leaking water pipe under kitchen sink."

This description is then sent to Nova 2 Lite to generate the structured search query:

```json
{
  "serviceTitle": "plumber",
  "category": "home repair",
  "keywords": ["pipe", "leak", "sink"]
}
```

---

# 4. Video Input Processing

For video uploads, the system performs two processing steps.

First, the backend extracts a few **key frames** from the video using FFmpeg. These frames are analyzed as images to identify the visual problem.

Second, if the video contains audio, the system extracts the audio track and transcribes it using Nova 2 Sonic.

Example video:

User records a video of a leaking pipe and says:

> "This pipe is leaking under the sink."

Processing pipeline:

Video Upload
↓
Frame Extraction (FFmpeg)
↓
Image Analysis (Multimodal Model)
↓
Audio Extraction
↓
Speech-to-Text (Nova Sonic)

The system combines both results to produce a text description of the problem.

Example combined description:

> "Leaking pipe under kitchen sink."

This description is then sent to Nova 2 Lite to generate the structured service request.

---

# Converting AI Understanding into Local Results

Once the AI extracts the structured service request, the backend performs a **geospatial search** in MongoDB.

The database stores service providers with geographic coordinates using a **2dsphere index**.

Example query:

```
Find approved services
where category = "plumber"
within 5km of the user's location
sorted by nearest distance
```

This allows the platform to return the **closest relevant service providers instantly**.

---

# Real-Time Results for the User

After the search completes:

• Results appear on an interactive map
• Each provider is shown as a location marker
• Users can contact providers instantly via phone or WhatsApp

The system also shows the AI interpretation to the user.

Example:

**AI detected: Plumbing issue**
Showing plumbers near you.

---

# Why This Approach Works

This architecture enables a natural and intuitive way for users to find local help.

Instead of manually browsing categories or guessing keywords, users can simply **show or describe their problem**, and the system automatically connects them with nearby professionals who can solve it.

By combining **multimodal AI understanding with precise geospatial search**, NeryByService transforms real-world problems into immediate local solutions.

---

If you'd like, I can also help you create a **simple architecture diagram for this pipeline** (something like a clean visual flow). That kind of diagram **dramatically improves hackathon submissions and GitHub READMEs** because judges understand the system in seconds.


#  The Bigger Vision

NeryByService bridges the gap between **digital search and real-world problems**.

By combining AI understanding with hyper-local service discovery, it enables a future where people no longer need to search through directories or guess service categories.

Instead, they simply show the problem—and the right help appears nearby.

In essence, NeryByService becomes **the AI-powered gateway between everyday problems and real-world solutions.**
