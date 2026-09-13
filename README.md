# Samanvaya (LDMS Monorepo)

A full-stack enterprise monorepo powered by **Turborepo**, **NestJS** (backend), and **Next.js 14+ App Router** (frontend) built for devotional community coordination, yatra/travel planning, seva task management, and devotee administration.

---

## Apps & Ports

| App | Description | Framework | Port |
|-----|-------------|-----------|------|
| `backend` | REST API Server | NestJS, Mongoose, MongoDB | `3001` |
| `frontend` | Web Portal | Next.js 14+ (App Router), Tailwind CSS | `3000` |

---

## Detailed Directory & Codebase Structure

```
Samanvaya/
├── apps/
│   │
│   ├── frontend/                       # Next.js 14+ Client Application
│   │   ├── app/                        # Next.js App Router Pages & Layouts
│   │   │   ├── (auth)/                 # Authentication routes (Login, Signup, Recovery)
│   │   │   ├── dashboard/              # Executive Devotee Dashboard
│   │   │   ├── travel/                 # Travel & Yatra management (/travel, /travel/[id])
│   │   │   ├── calendar/               # Devotional Calendar & Schedule
│   │   │   ├── documentation/          # Resource & Document Library
│   │   │   └── ...                     # Other app routes
│   │   │
│   │   ├── components/                 # Frontend UI Components
│   │   │   │
│   │   │   ├── common/                 # 🌐 GLOBAL REUSABLE UI PRIMITIVES (E* & Sacred*)
│   │   │   │   ├── EInput.tsx          # Standard input with label, icons & error
│   │   │   │   ├── EPasswordInput.tsx  # Password field with eye visibility toggle
│   │   │   │   ├── EMobileInput.tsx    # Phone number input with +91 country prefix
│   │   │   │   ├── EEmailInput.tsx     # Email input with mail icon
│   │   │   │   ├── ETextarea.tsx       # Textarea field
│   │   │   │   ├── ESelect.tsx         # Searchable dropdown select popover
│   │   │   │   ├── EDateTimePicker.tsx# Date & time picker with calendar popover
│   │   │   │   ├── EButton.tsx         # Sacred emerald/outline buttons with loading states
│   │   │   │   ├── ECard.tsx           # Sacred ivory themed content card
│   │   │   │   ├── EModal.tsx          # Centered dialog modal
│   │   │   │   ├── EResponsiveDrawer.tsx# Mobile bottom-sheet / Desktop right-drawer
│   │   │   │   ├── S3Uploader.tsx      # Unified S3 uploader, preview & viewOnly document grid
│   │   │   │   ├── EAvatar.tsx         # User avatar display with initials fallback
│   │   │   │   ├── SacredAvatarUpload.tsx # Avatar crop & upload component
│   │   │   │   ├── SacredPageHeader.tsx# Standard page title & action banner
│   │   │   │   ├── SacredPillTabs.tsx  # Segmented filter pill tabs with counts
│   │   │   │   ├── SacredStatCard.tsx  # Metric card with icons & trends
│   │   │   │   ├── SacredTableContainer.tsx # Table card wrapper with empty state graphics
│   │   │   │   ├── ETable.tsx          # Standard table markup primitives
│   │   │   │   └── ESkeleton.tsx       # Loading shimmer placeholders
│   │   │   │
│   │   │   ├── layout/                 # 🏛️ APPLICATION SHELL & LAYOUT
│   │   │   │   ├── SacredPortalLayout.tsx # Main authenticated page wrapper
│   │   │   │   ├── AdminSidebar.tsx    # Responsive side navigation
│   │   │   │   ├── AdminHeader.tsx     # Top bar with user profile, greeting & search
│   │   │   │   └── SidebarMenuItems.tsx# Menu items definition
│   │   │   │
│   │   │   ├── ui/                     # 🎨 BASE RADIX / SHADCN PRIMITIVES
│   │   │   │   ├── LotusDivider.tsx    # Signature gold lotus divider line
│   │   │   │   ├── badge.tsx           # Status badges
│   │   │   │   ├── dialog.tsx, sheet.tsx, popover.tsx, ... # Radix primitives
│   │   │   │
│   │   │   └── [feature_modules]/      # 📦 FEATURE-SPECIFIC COMPONENTS
│   │   │       ├── travel/             # Travel module components
│   │   │       │   ├── TravelApprovalDrawer.tsx # Admin review & approval drawer
│   │   │       │   ├── TravelWizardForm.tsx     # 5-step travel planning wizard
│   │   │       │   └── wizard/         # Step1Basic, Step2Transport, Step3Stay,
│   │   │       │                       # Step4Attachments, Step5ReviewAndSubmit
│   │   │       ├── task/               # Task & Seva management components
│   │   │       │   ├── CreateTaskDrawer.tsx, TaskDetailDrawer.tsx, ...
│   │   │       ├── users/              # Devotee directory & approval cards
│   │   │       ├── dashboard/          # Dashboard analytics widgets & banners
│   │   │       ├── calendar/           # Calendar views & event cards
│   │   │       └── notifications/      # Notification bell & dropdown
│   │   │
│   │   ├── hooks/                      # 🪝 REACT HOOKS (Organized by domain)
│   │   │   ├── travel/                 # useTravel.ts, useTravelDetail.ts, useTravelWizard.ts
│   │   │   ├── useTasks.ts             # Task management CRUD & filtering
│   │   │   ├── usePermissions.ts       # Role-based access control (RBAC)
│   │   │   └── ...
│   │   │
│   │   ├── types/                      # 🏷️ TYPESCRIPT DOMAIN TYPES
│   │   │   ├── travel.ts               # Travel, Transport, Stay, Attachments interfaces
│   │   │   ├── task.ts                 # Seva task interfaces
│   │   │   ├── auth.ts                 # User profile & JWT payload
│   │   │   └── media.ts                # S3 uploads & media types
│   │   │
│   │   └── lib/                        # 🛠️ CLIENT UTILITIES & SERVICES
│   │       ├── s3-uploader.ts          # Presigned URL & S3/R2 direct upload helper
│   │       ├── api/                    # Axios/Fetch interceptors & API client
│   │       ├── data-manager.ts         # Local storage & session management
│   │       └── utils.ts                # Tailwind classNames merger (`cn()`)
│   │
│   └── backend/                        # NestJS REST API Server
│       └── src/
│           ├── modules/                # 📦 BACKEND FEATURE MODULES (Modular Domain Design)
│           │   ├── travel/             # Travel Module
│           │   │   ├── schemas/        # travel.schema.ts (Mongoose model)
│           │   │   ├── dto/            # create-travel.dto.ts, update-travel.dto.ts
│           │   │   ├── travel.controller.ts # REST endpoints (/travel)
│           │   │   ├── travel.service.ts    # Database business logic
│           │   │   └── travel.module.ts     # NestJS module declaration
│           │   ├── tasks/              # Seva Task Module
│           │   ├── users/              # User management & approvals
│           │   ├── auth/               # JWT authentication, guards & strategies
│           │   ├── notifications/      # Notification dispatch system
│           │   └── health/             # Health check endpoints
│           │
│           ├── common/                 # 🛡️ GLOBAL GUARDS, INTERCEPTORS & DECORATORS
│           │   ├── guards/             # JwtAuthGuard, RolesGuard
│           │   ├── decorators/         # CurrentUser, Roles
│           │   └── filters/            # Global HttpExceptionFilter
│           │
│           ├── app.module.ts           # Root application module
│           └── main.ts                 # NestJS bootstrap entry point
│
├── packages/                           # Shared monorepo packages (optional)
├── COMPONENTS.md                       # 📖 Detailed UI Component Library Documentation
├── turbo.json                          # Turborepo pipeline configuration
├── pnpm-workspace.yaml                 # pnpm workspace definition
├── package.json                        # Root dependencies & monorepo scripts
└── README.md                           # Monorepo overview (this file)
```

---

## Architectural Conventions: Where To Add Code

### 1. Adding a New UI Component
* **Global / Reusable Across Modules**: Place it in `apps/frontend/components/common/` with the standard `E*` (e.g. `ECheckbox.tsx`) or `Sacred*` (e.g. `SacredHeader.tsx`) prefix. Ensure it is documented in [COMPONENTS.md](./COMPONENTS.md).
* **Feature-Specific UI**: Place it in `apps/frontend/components/{module_name}/` (e.g., `components/travel/` or `components/task/`).
* **Base Primitive / Radix Primitives**: Place it in `apps/frontend/components/ui/`.

### 2. Adding a New Backend Feature
* Create a folder in `apps/backend/src/modules/{feature_name}/`.
* Maintain the standard modular pattern:
  - `schemas/{feature}.schema.ts` (Mongoose Schema)
  - `dto/create-{feature}.dto.ts` (Input validation with `class-validator`)
  - `{feature}.controller.ts` (HTTP routing & swagger docs)
  - `{feature}.service.ts` (Database transactions & queries)
  - `{feature}.module.ts` (Module exports & imports)

---

## Getting Started

### Prerequisites
- Node.js >= 18
- pnpm >= 9

### Install dependencies
```bash
pnpm install
```

### Development
```bash
# Run both frontend & backend concurrently
pnpm dev

# Run only backend (port 3001)
pnpm --filter backend dev

# Run only frontend (port 3000)
pnpm --filter frontend dev
```

### Build & Typecheck
```bash
# Build all apps
pnpm build

# Typecheck frontend
cd apps/frontend && npx tsc --noEmit

# Typecheck backend
cd apps/backend && npx tsc --noEmit
```

---

## UI Component Documentation

See [COMPONENTS.md](./COMPONENTS.md) for full interactive documentation, props tables, and code snippets for all 23+ core UI components (`EInput`, `S3Uploader`, `EResponsiveDrawer`, `EModal`, `SacredPortalLayout`, `EDateTimePicker`, `ESelect`, etc.).
