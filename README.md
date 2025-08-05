# My Voice Memos

Create notes in English using your voice

## Project Overview

**My Voice Memos** is a SPA application that allows users to record voice memos with instant speech-to-text conversion.

## Architectural Decisions

### Feature-based Architecture
The project is organized following **feature-driven development** principles:
- Allows developing new features independently
- High cohesion within modules and loose coupling between adjacent ones

### Repository Pattern
Implemented **Repository Pattern** for data access abstraction:
- Uses LocalStorage for data persistence because it's the easiest to implement
- For more proper data handling (e.g., saving audio with text for future playback), other data sources can be easily plugged in (API, IndexedDB, etc.)

### Service Layer
**Business logic** is extracted into a separate service layer:
- Data validation, encapsulation, and unification

### Custom Hooks
Extracting **complex logic** into reusable hooks:
- The main idea is to separate logic from presentation

## Technology Stack

### Core
- **React 19** - trendy
- **TypeScript** - reliable
- **Vite** - fast
- **Tailwind CSS 4** - fast
- **React Hook Form** - convenient
- **Zod** - easy, convenient, fast

### Code Quality
- **Biome** - fast (instead of ESLint + Prettier)
- **Vitest** - since Vite is already there
- **Testing Library** - foundation for component testing

### Web APIs
- **Web Speech API** - real-time speech recognition
- **MediaRecorder API** - audio recording

## Key Features

### Voice Memo Recording
- Audio recording through browser with microphone permission
- Real-time speech transcription to text
- Visual indication of recording state

### Memo Management
- CRUD operations

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AudioRecorder/   # Complex recording component
│   ├── Button/          # Basic button component
│   └── ...
├── features/
│   └── memos/           # Memos feature
│       ├── components/  # Feature-specific components
│       ├── hooks/       # Data handling hooks
│       ├── pages/       # Feature pages
│       ├── services/    # Business logic
│       └── types.ts     # Data types
├── shared/              # Common infrastructure
│   ├── repositories/    # Data abstraction
│   └── types/          # Common types
└── routes/              # Routing configuration
```

## Potential Improvements

- **Memo size limitations** - currently there are none
- **AI model replacement** - for recognizing more languages with better quality
- **Memo editing improvements** - ability to synchronize text and audio recording, partial memo replacement, audio playback (if memo was made using audio)
- **Design improvements** - currently not perfect
- **Adding other test types** - currently only a few unit tests

## Running the Project

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Testing
npm run test

# Linting
npm run lint
```