# Pulpuluck - Water Fountain Locator

## Overview

Pulpuluck is a web application that helps users find clean, accessible drinking water fountains throughout Yerevan, Armenia. The application combines real-time geolocation with interactive mapping to provide a comprehensive solution for locating nearby water sources. Built as a full-stack TypeScript application, it features a React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration using Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: TanStack Query (React Query) for server state and caching
- **Mapping**: Leaflet.js for interactive maps with custom markers
- **Geolocation**: Browser Geolocation API with custom utilities

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Development**: Hot-reloading with tsx and Vite middleware integration
- **Storage**: Pluggable storage interface with in-memory implementation for development
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple

### Data Layer
- **Database**: PostgreSQL (configured via DATABASE_URL)
- **Schema**: User management with username/password authentication
- **Migrations**: Drizzle Kit for schema migrations and database management
- **Validation**: Zod schemas integrated with Drizzle for type-safe data validation

### External Dependencies
- **Mapping Data**: OpenStreetMap tiles for base map rendering
- **Fountain Data**: Overpass API integration for querying drinking water amenities in Yerevan
- **Database Hosting**: Neon Database serverless PostgreSQL
- **Fonts**: Google Fonts integration (Architects Daughter, DM Sans, Fira Code, Geist Mono)
- **Development Tools**: Replit-specific plugins for error handling and development banner

### Key Design Patterns
- **Separation of Concerns**: Clear separation between client, server, and shared code
- **Type Safety**: End-to-end TypeScript with shared types and schemas
- **Component Architecture**: Modular UI components with consistent design system
- **Data Fetching**: Centralized API client with error handling and caching strategies
- **Responsive Design**: Mobile-first approach with adaptive layouts