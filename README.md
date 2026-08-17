# LDMS Monorepo

A full-stack monorepo powered by **Turborepo**, **NestJS** (backend), and **Next.js** (frontend).

## Structure

```
LDMS/
├── apps/
│   ├── backend/       # NestJS API server
│   └── frontend/      # Next.js web application
├── packages/          # Shared packages (types, utils, etc.)
├── turbo.json         # Turborepo pipeline configuration
├── pnpm-workspace.yaml
└── package.json
```

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
# Run all apps in dev mode
pnpm dev

# Run only backend
pnpm --filter backend dev

# Run only frontend
pnpm --filter frontend dev
```

### Build
```bash
pnpm build
```

### Lint
```bash
pnpm lint
```

## Apps

| App | Tech | Port |
|-----|------|------|
| `backend` | NestJS | 3001 |
| `frontend` | Next.js | 3000 |
