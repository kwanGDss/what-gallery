# Plot AI Gallery Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-09-10

## Active Technologies
- **Frontend**: Next.js 15, React 19, TypeScript 5
- **Styling**: Tailwind CSS, shadcn/ui components  
- **Testing**: Playwright (E2E), Jest + React Testing Library (unit)
- **Authentication**: NextAuth.js with Google OAuth
- **State**: React Context + useReducer
- **Theme**: next-themes with dark mode support

## Project Structure
```
src/
├── app/                    # Next.js App Router
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Navigation, layouts
│   ├── posts/             # Post-related components
│   ├── auth/              # Authentication components
│   └── search/            # Search components
├── types/                 # TypeScript interfaces
├── data/                  # Static JSON data files
├── hooks/                 # Custom React hooks
└── lib/                   # Utility functions

tests/
├── e2e/                   # Playwright E2E tests
└── unit/                  # Jest unit tests
```

## Commands
```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run start              # Start production server

# Testing
npm run test:e2e           # Run Playwright tests
npm run test:unit          # Run Jest unit tests
npm run test:watch         # Watch mode for unit tests

# Code Quality
npm run lint               # ESLint check
npm run type-check         # TypeScript check
```

## Code Style
- **Components**: Use function components with TypeScript interfaces
- **Styling**: Tailwind CSS utilities, shadcn/ui components
- **State**: React Context for global state, local state for components  
- **Testing**: Test-driven development with Playwright first, then Jest
- **Data**: Static JSON files with TypeScript interfaces for type safety
- **API**: Next.js API routes serving static data initially

## Key Patterns
- All components have proper TypeScript interfaces
- Use `data-testid` attributes for reliable test selectors
- Implement error boundaries for robust error handling
- Follow atomic design principles for component structure
- Use Next.js Image component for optimized image loading
- Implement proper loading states and error handling

## Recent Changes
- 001-ai-3d-plot: Added Next.js 15 + React 19 + TypeScript + Tailwind CSS + shadcn/ui stack

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->