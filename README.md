# NeryByService

A minimal local service discovery platform connecting users with local service providers.

## Project Phases

### PHASE 1: Project Setup & Core Backend API

**Context:** Building a minimal local service discovery platform.
**Stack:** Node.js (TypeScript), Express, MongoDB (Mongoose).

**Key Requirements:**
- **Database:** MongoDB with `2dsphere` index for location-based queries.
- **Schema:** `Service` model includes `phoneNumber`, `serviceTitle`, `category`, `location` (GeoJSON), `radius`, `description`, `status` ('pending'/'approved'), `contactDetails`, `language`.
- **API Endpoints:**
    - `POST /api/services`: Create listing.
    - `GET /api/search`: Spatial search ($near/$geoWithin) with filters (text, radius).
- **Validation:** Zod/class-validator.

### PHASE 2: Frontend Setup & Provider Registration

**Context:** React (TypeScript) frontend connected to the Phase 1 backend.

**Key Requirements:**
- **Stack:** Vite + React + TypeScript + Tailwind CSS.
- **Maps:** Leaflet & React-Leaflet integration.
- **Add Service Page:**
    - Form inputs: Business Name, Category, Language, Description, Phone, WhatsApp.
    - Location Picker: Draggable pin on Leaflet map + Radius slider.
    - Submission: `POST /api/services`.
    - Mock OTP Modal for verification.

### PHASE 3: Search UI & Results Display

**Context:** User-facing search and results page.

**Key Requirements:**
- **Hero Section:** "Find Local Services" with search input (debounced).
- **Location:** Browser Geolocation API to center search.
- **Results View:**
    - **List View:** Service cards (Title, Category, Distance, Call/WhatsApp buttons). *No rating stars.*
    - **Map View:** Pins for results, Popups with "Call" button. User location shown as a distinct dot.
- **Category Chips:** Quick filters for "Plumbing", "Electrician", etc.

🚀 NeryByService: The Hyper-Local Real-Time Connection Engine
"Don't just search for help. Find it right around the corner."

🛑 The Problem
In a world of information overload, finding reliable local help is surprisingly difficult. Traditional directories are cluttered with outdated listings, irrelevant ads, and service providers located miles away. When you have a leaking pipe, a dead car battery, or need a last-minute tutor, you don't need a list of businesses—you need proximity, speed, and direct contact.

✅ The Solution: NeryByService
NeryByService is a next-generation local discovery platform built with a "Location-First" philosophy. It cuts through the noise to connect users with the nearest available service providers in real-time.

🌟 Key Features that Win Users
📍 Precision Geo-Location: Unlike generic directories, we use advanced geospatial querying (MongoDB 2dsphere + Leaflet Maps) to show services within a specific radius of the user. "Show me plumbers within 1km"—pros looking to work now, right where you are.
⚡ Zero-Friction Connectivity: We’ve removed the "middleman." No filling out long quote forms that go into a black hole. Users can connect instantly via Direct Call or WhatsApp with a single tap.
🔍 Visual Discovery: An interactive, map-based interface allows users to physically see where help is coming from, building trust and verifying proximity instantly.
🛠️ Dynamic Categories: From "Home Repair" to "Tutoring," our dynamic categorization engine scales with the market's needs, ensuring users find exactly what they're looking for.
💼 For Platform Owners (The Business Case)
This isn't just a utility; it's a monetization-ready SaaS platform.

💰 Built-in Revenue Streams: Includes a robust subscription system integrated with PayPal. Service providers can subscribe to premium plans for better visibility.
🏷️ Smart Marketing Tools: A fully functional Coupon & Discount System allows you to run promotions to attract new providers and retain existing ones.
🛡️ Complete Admin Control: A dedicated Admin Dashboard lets you manage users, approve listings (pending vs. approved workflows), and oversee subscription plans effortlessly.
🏗️ Technical Excellence (Under the Hood)
Built for speed, scale, and reliability:

Modern Stack: React (Vite) Frontend + Node.js/Express Backend + MongoDB.
Type-Safe: Written entirely in TypeScript for robust, bug-free code.
Performance: Optimized with Redis caching strategies and shimmer UI loading states for a premium, fast user experience.
🎯 The Bottom Line
NeryByService bridges the gap between digital search and physical reality. It empowers local service providers to be seen by their literal neighbors and gives users the power of immediate, local help. It is the modern town square for the gig economy.