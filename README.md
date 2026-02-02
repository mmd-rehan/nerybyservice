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
