# Tasks: Plot AI Content Gallery Platform

**Input**: Design documents from `/specs/001-ai-3d-plot/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → ✓ Next.js 15 + React 19 + TypeScript + Tailwind CSS + shadcn/ui stack
   → ✓ Web application structure with static data approach
2. Load optional design documents:
   → ✓ data-model.md: Post, User, Tag, SearchQuery, UserSession entities
   → ✓ contracts/: API routes and component props contracts
   → ✓ research.md: Technology decisions and best practices
3. Generate tasks by category:
   → ✓ Setup: Next.js project, dependencies, configuration
   → ✓ Tests: E2E tests with Playwright, component tests
   → ✓ Core: TypeScript types, components, API routes
   → ✓ Integration: Authentication, theme, data loading
   → ✓ Polish: Performance, accessibility, documentation
4. Apply task rules:
   → ✓ Different files = marked [P] for parallel
   → ✓ Same file = sequential (no [P])
   → ✓ Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: `src/` at repository root (Next.js App Router structure)
- All paths assume Next.js project structure with `src/` directory

## Phase 3.1: Setup & Configuration

### T001 - Initialize Next.js Project
- [x] Create Next.js 15 project with TypeScript, Tailwind CSS, and ESLint:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```
**Files**: Package configuration, Next.js config, TypeScript config

### T002 - Install Core Dependencies  
- [x] Install required dependencies for shadcn/ui, authentication, and testing:
```bash
npm install @radix-ui/react-dialog @radix-ui/react-tabs next-themes lucide-react class-variance-authority clsx tailwind-merge next-auth
```
**Files**: `package.json`, `package-lock.json`

### T003 - [P] Install Development Dependencies
- [x] Install Playwright, Jest, and testing utilities:
```bash
npm install -D @playwright/test playwright jest @testing-library/react @testing-library/jest-dom
```
**Files**: `package.json` (different section from T002)

### T004 - Configure shadcn/ui
- [x] Initialize shadcn/ui configuration and install core components:
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog input tabs avatar badge
```
**Files**: `components.json`, `src/lib/utils.ts`, `src/components/ui/`

### T005 - [P] Configure Playwright
- [x] Set up Playwright configuration and test structure in `playwright.config.ts`
**Files**: `playwright.config.ts`, `tests/e2e/` directory structure

### T006 - [P] Setup Project Structure
- [x] Create directory structure per design documents:
```
src/
├── app/
├── components/{ui,layout,posts,auth,search,user}/
├── types/
├── data/
├── hooks/
└── lib/
```
**Files**: Directory structure only

### T007 - [P] Configure Theme Provider
- [x] Set up next-themes configuration and dark mode support in `src/components/providers/theme-provider.tsx`
**Files**: `src/components/providers/theme-provider.tsx`

## Phase 3.2: Types & Data (TDD - Tests First) ⚠️ MUST COMPLETE BEFORE 3.3

### T008 - [P] Create TypeScript Interfaces
- [x] Create all TypeScript interfaces from data model in `src/types/index.ts`:
- Post, User, Tag, SearchQuery, UserSession interfaces
- ContentCategory, SortOption, License types
**Files**: `src/types/index.ts`

### T009 - [P] Create Sample Data Files
- [x] Create JSON sample data files (20+ posts) in `src/data/`:
- `posts.json`, `users.json`, `tags.json`, `categories.json`
**Files**: `src/data/posts.json`, `src/data/users.json`, `src/data/tags.json`, `src/data/categories.json`

### T010 - [P] E2E Test: Homepage Loading
- [x] Playwright test for homepage loading and displaying posts in `tests/e2e/homepage.spec.ts`:
- Navigation visible, Plot branding, category tabs, search bar, post grid
**Files**: `tests/e2e/homepage.spec.ts`

### T011 - [P] E2E Test: Post Interactions
- [x] Playwright test for post hover effects and modal opening in `tests/e2e/post-interactions.spec.ts`:
- Hover overlays, creator info, action buttons, modal functionality
**Files**: `tests/e2e/post-interactions.spec.ts`

### T012 - [P] E2E Test: Navigation & Filtering
- [x] Playwright test for category filtering and search in `tests/e2e/navigation.spec.ts`:
- Category tabs switching, search functionality, filtering
**Files**: `tests/e2e/navigation.spec.ts`

### T013 - [P] E2E Test: Authentication Flow
- [x] Playwright test for login/signup pages in `tests/e2e/auth.spec.ts`:
- Split layout, form validation, Google OAuth button
**Files**: `tests/e2e/auth.spec.ts`

### T014 - [P] E2E Test: Theme Toggle
- [x] Playwright test for dark mode functionality in `tests/e2e/theme.spec.ts`:
- Theme switching, persistent storage, hamburger menu
**Files**: `tests/e2e/theme.spec.ts`

## Phase 3.3: API Routes (ONLY after tests are failing)

### T015 - [P] API Route: GET /api/posts
- [x] Implement posts API with filtering and pagination in `src/app/api/posts/route.ts`:
- Query parameter parsing, static data filtering, pagination logic
**Files**: `src/app/api/posts/route.ts`

### T016 - [P] API Route: GET /api/posts/[id]
- [x] Implement single post detail API in `src/app/api/posts/[id]/route.ts`:
- Post lookup, similar posts logic, creator details
**Files**: `src/app/api/posts/[id]/route.ts`

### T017 - [P] API Route: GET /api/posts/featured
- [x] Implement featured posts API in `src/app/api/posts/featured/route.ts`:
- Featured post filtering, limit parameter
**Files**: `src/app/api/posts/featured/route.ts`

### T018 - [P] API Route: GET /api/search
- [x] Implement search API with faceting in `src/app/api/search/route.ts`:
- Full-text search, category filtering, result faceting
**Files**: `src/app/api/search/route.ts`

### T019 - [P] API Route: GET /api/categories
- [x] Implement categories API in `src/app/api/categories/route.ts`:
- Category metadata, post counts, featured posts per category
**Files**: `src/app/api/categories/route.ts`

### T020 - [P] Authentication API Routes
- [x] Implement simulated auth routes in `src/app/api/auth/`:
- signin, signup, google oauth simulation
**Files**: `src/app/api/auth/signin/route.ts`, `src/app/api/auth/signup/route.ts`, `src/app/api/auth/google/route.ts`

## Phase 3.4: Core Components (Tests must fail first)

### T021 - [P] PostCard Component
- [ ] Create PostCard component in `src/components/posts/PostCard.tsx`:
- Thumbnail display, hover effects, creator info, action buttons
**Files**: `src/components/posts/PostCard.tsx`

### T022 - [P] PostModal Component  
- [ ] Create PostModal component in `src/components/posts/PostModal.tsx`:
- Full post display, similar posts, detailed metadata
**Files**: `src/components/posts/PostModal.tsx`

### T023 - [P] PostGrid Component
- [ ] Create PostGrid component with infinite scroll in `src/components/posts/PostGrid.tsx`:
- Responsive grid layout, infinite scroll, loading states
**Files**: `src/components/posts/PostGrid.tsx`

### T024 - [P] SearchBar Component
- [ ] Create SearchBar component in `src/components/search/SearchBar.tsx`:
- Search input, filtering, suggestions, keyboard shortcuts
**Files**: `src/components/search/SearchBar.tsx`

### T025 - [P] Navigation Component
- [ ] Create main navigation in `src/components/layout/Navigation.tsx`:
- Plot branding, category navigation, user actions, hamburger menu
**Files**: `src/components/layout/Navigation.tsx`

### T026 - [P] CategoryTabs Component
- [ ] Create category filter tabs in `src/components/navigation/CategoryTabs.tsx`:
- Photos/Illustrations/3D tabs, active states, icons
**Files**: `src/components/navigation/CategoryTabs.tsx`

### T027 - [P] AuthForm Component
- [ ] Create authentication form in `src/components/auth/AuthForm.tsx`:
- Login/signup modes, validation, Google OAuth integration
**Files**: `src/components/auth/AuthForm.tsx`

### T028 - [P] HamburgerMenu Component
- [ ] Create mobile menu in `src/components/layout/HamburgerMenu.tsx`:
- Footer content, theme toggle, navigation items
**Files**: `src/components/layout/HamburgerMenu.tsx`

### T029 - [P] ThemeToggle Component
- [ ] Create theme toggle in `src/components/ui/ThemeToggle.tsx`:
- Dark/light/system modes, icon variations
**Files**: `src/components/ui/ThemeToggle.tsx`

### T030 - [P] UserProfile Component
- [ ] Create user profile display in `src/components/user/UserProfile.tsx`:
- Profile info, stats, social links, follow functionality
**Files**: `src/components/user/UserProfile.tsx`

## Phase 3.5: Layout Components

### T031 - [P] PageLayout Component
- [ ] Create main page wrapper in `src/components/layout/PageLayout.tsx`:
- SEO metadata, navigation, footer integration
**Files**: `src/components/layout/PageLayout.tsx`

### T032 - [P] AuthLayout Component
- [ ] Create split auth layout in `src/components/layout/AuthLayout.tsx`:
- 3/10 form, 7/10 image layout, responsive design
**Files**: `src/components/layout/AuthLayout.tsx`

### T033 - [P] ErrorBoundary Component
- [ ] Create error boundary in `src/components/ui/ErrorBoundary.tsx`:
- React error boundary, fallback UI, error logging
**Files**: `src/components/ui/ErrorBoundary.tsx`

### T034 - [P] LoadingSpinner Component
- [ ] Create loading indicator in `src/components/ui/LoadingSpinner.tsx`:
- Multiple variants, sizes, animated states
**Files**: `src/components/ui/LoadingSpinner.tsx`

## Phase 3.6: Pages & Routing

### T035 - Update Root Layout
- [ ] Update `src/app/layout.tsx` with theme provider, error boundary, and proper metadata
**Files**: `src/app/layout.tsx`

### T036 - Create Homepage
- [ ] Implement homepage in `src/app/page.tsx`:
- Featured posts, category navigation, infinite scroll integration
**Files**: `src/app/page.tsx`

### T037 - [P] Create Auth Pages
- [ ] Create login and signup pages in `src/app/auth/`:
- Split layout implementation, form integration
**Files**: `src/app/auth/signin/page.tsx`, `src/app/auth/signup/page.tsx`

### T038 - [P] Create Category Pages
- [ ] Create category-specific pages in `src/app/[category]/`:
- Dynamic routing for photos/illustrations/3d
**Files**: `src/app/[category]/page.tsx`

### T039 - [P] Create Search Page
- [ ] Create search results page in `src/app/search/page.tsx`:
- Search results display, filtering, pagination
**Files**: `src/app/search/page.tsx`

## Phase 3.7: Integration & State Management

### T040 - Create Authentication Context
- [ ] Set up authentication state management in `src/contexts/AuthContext.tsx`:
- User session, login/logout handlers, state persistence
**Files**: `src/contexts/AuthContext.tsx`

### T041 - Create Search Context
- [ ] Set up search state management in `src/contexts/SearchContext.tsx`:
- Search queries, filters, results caching
**Files**: `src/contexts/SearchContext.tsx`

### T042 - Custom Hooks for Data Fetching
- [ ] Create data fetching hooks in `src/hooks/`:
- usePost, usePosts, useSearch, useAuth hooks
**Files**: `src/hooks/usePost.ts`, `src/hooks/usePosts.ts`, `src/hooks/useSearch.ts`, `src/hooks/useAuth.ts`

### T043 - Utility Functions
- [ ] Create utility functions in `src/lib/`:
- API helpers, validation, formatting, constants
**Files**: `src/lib/api.ts`, `src/lib/validation.ts`, `src/lib/utils.ts`, `src/lib/constants.ts`

## Phase 3.8: Polish & Testing

### T044 - [P] Component Unit Tests
- [ ] Create Jest tests for critical components in `tests/unit/`:
- PostCard, SearchBar, AuthForm component tests
**Files**: `tests/unit/PostCard.test.tsx`, `tests/unit/SearchBar.test.tsx`, `tests/unit/AuthForm.test.tsx`

### T045 - [P] API Route Tests
- [ ] Create tests for API routes in `tests/api/`:
- Posts, search, auth endpoint tests
**Files**: `tests/api/posts.test.ts`, `tests/api/search.test.ts`

### T046 - [P] Performance Optimization
- [ ] Implement performance optimizations:
- Image optimization, code splitting, lazy loading
**Files**: `next.config.js`, component optimizations

### T047 - [P] Accessibility Features
- [ ] Add accessibility features:
- ARIA labels, keyboard navigation, screen reader support
**Files**: Component updates for accessibility

### T048 - [P] SEO Optimization
- [ ] Implement SEO features:
- Metadata, sitemap, structured data
**Files**: `src/app/sitemap.ts`, metadata configurations

### T049 - Mobile Responsive Design
- [ ] Ensure mobile responsiveness across all components:
- Breakpoint testing, touch interactions, mobile navigation
**Files**: Component style updates

### T050 - Error Handling & Validation
- [ ] Implement comprehensive error handling:
- Input validation, API error handling, user feedback
**Files**: Error handling across components and APIs

## Dependencies

**Setup Phase (T001-T007)**: Must complete before any development
- T001 blocks all other tasks
- T002-T007 can run in parallel after T001

**Testing Phase (T008-T014)**: Must complete before implementation
- T008-T009 can run in parallel 
- T010-T014 can run in parallel after T008-T009 complete

**API Phase (T015-T020)**: Requires T008-T009 (types and data)
- All T015-T020 can run in parallel

**Components Phase (T021-T034)**: Requires T008 (types)
- All component tasks can run in parallel

**Pages Phase (T035-T039)**: Requires components
- T035 blocks T036
- T037-T039 can run in parallel after components complete

**Integration Phase (T040-T043)**: Requires components and API routes
- T040-T041 can run in parallel
- T042-T043 depend on contexts

**Polish Phase (T044-T050)**: Requires core implementation
- Most polish tasks can run in parallel

## Parallel Execution Examples

### Phase 1: Setup Dependencies
```bash
# After T001 completes, run these in parallel:
Task: "Install core dependencies (T002)"
Task: "Install development dependencies (T003)" 
Task: "Configure Playwright (T005)"
Task: "Setup project structure (T006)"
Task: "Configure theme provider (T007)"
```

### Phase 2: Core Development
```bash
# After types are ready, run these in parallel:
Task: "API Route: GET /api/posts (T015)"
Task: "API Route: GET /api/posts/[id] (T016)"
Task: "PostCard Component (T021)"
Task: "PostModal Component (T022)"
Task: "SearchBar Component (T024)"
```

### Phase 3: Polish & Testing
```bash
# Run these final tasks in parallel:
Task: "Component Unit Tests (T044)"
Task: "Performance Optimization (T046)"
Task: "Accessibility Features (T047)"
Task: "SEO Optimization (T048)"
```

## Validation Checklist

- [x] All API endpoints from contracts have implementation tasks
- [x] All entities from data model have TypeScript interfaces
- [x] All components from contracts have creation tasks  
- [x] All tests come before implementation (TDD)
- [x] Parallel tasks are truly independent (different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Dependencies properly mapped
- [x] 50 tasks cover complete implementation

## Notes

- **[P] tasks** = different files, no dependencies, can run in parallel
- **Verify tests fail** before implementing features (TDD approach)
- **Commit after each task** for proper git history
- **Use Playwright MCP** to test and debug when issues occur
- **Follow shadcn/ui patterns** for consistent component design
- **Test on multiple browsers** using Playwright configuration