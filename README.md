# Pulpuluck - Water Fountain Locator

**Find clean, accessible drinking water fountains across Yerevan, Armenia**

Pulpuluck is an interactive web application that helps users locate pulpulaks (traditional Armenian water fountains) throughout Yerevan. Built with modern web technologies, it combines real-time geolocation with interactive mapping to provide a comprehensive solution for finding nearby water sources.

## 🚰 What is a Pulpulak?

A pulpulak is a public water fountain common in Armenia and in the former Armenian-populated Republic of Artsakh. These small, usually one-meter tall stone memorials with running water are often fed by mountain springs and serve as beloved cultural icons. The name "pulpulak" is onomatopoeic - it sounds like water running from the tap.

## ✨ Features

- **Interactive Map**: Browse all pulpulaks across Yerevan on an intuitive map interface
- **Geolocation**: Find the nearest water fountain based on your current location
- **Walking Directions**: Get routing guidance to the closest pulpulak
- **Detailed Information**: View fountain details including images, accessibility, and distance
- **Cultural Education**: Learn about Armenian water fountain culture through built-in onboarding
- **Real-time Data**: Powered by OpenStreetMap for up-to-date fountain locations

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and building
- **Wouter** for lightweight client-side routing
- **shadcn/ui** component library built on Radix UI
- **Tailwind CSS** for responsive styling
- **Leaflet.js** for interactive mapping
- **TanStack Query** for server state management

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** with PostgreSQL
- **Neon Database** for serverless PostgreSQL hosting
- **OpenStreetMap/Overpass API** for fountain data

### Development Tools
- **Replit** for cloud development environment
- **Hot Module Replacement** for instant updates
- **ESBuild** for fast TypeScript compilation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Access to a PostgreSQL database (or use the included Neon integration)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
3. Set up environment variables:
- DATABASE_URL=your_postgresql_connection_string
Start the development server:
- npm run dev

Open your browser and navigate to the application

###  🗺️ Data Sources
- Fountain Locations: OpenStreetMap via Overpass API
- Map Tiles: OpenStreetMap contributors
- Routing: Integrated walking route calculation
- Images: OpenStreetMap image tags where available

###  🤝 Contributing
- Adding New Fountains
- Since Pulpuluck uses OpenStreetMap data, you can contribute by:

###  Sign up for OpenStreetMap
- Click the "Edit" button to access the visual map editor
- Add a new point of interest under "Public services" → "Drinking water"
- Your addition will appear in Pulpuluck immediately

###  Development
The project follows modern full-stack development patterns:

- Frontend-heavy: Most logic handled in React components
- Type Safety: End-to-end TypeScript with shared schemas
- Component Architecture: Modular UI with consistent design system
- Responsive Design: Mobile-first approach

### 📱 Browser Support
- Chrome/Chromium 88+
- Firefox 85+
- Safari 14+
- Edge 88+

###  🌍 Roadmap
 -  Expand to other Armenian cities
 - User-generated content (reviews, photos)
 - Offline functionality
 - Multi-language support
 - Mobile app versions
 
###  📧 Contact
Have suggestions or found a bug? Email keiichi44@gmail.com

###  📄 License
This project is open source and available under the MIT License.

###  🙏 Acknowledgments
OpenStreetMap contributors for fountain data
The Armenian community for preserving pulpulak culture
Replit for providing the development platform
### Pulpuluk brings you luck! 🍀
