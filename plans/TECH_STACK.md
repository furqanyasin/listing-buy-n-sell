# PW Clone — Tech Stack Decisions

## Frontend — `apps/web`
| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 15.x | App Router, SSR/SSG/ISR, routing |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| shadcn/ui | latest | Accessible component primitives |
| TanStack Query | 5.x | Server state, caching, fetching |
| Zustand | 5.x | Client state (auth, UI) |
| React Hook Form | 7.x | Form management |
| Zod | 3.x | Schema validation |
| Axios | 1.x | HTTP client with interceptors |
| Framer Motion | 11.x | Animations |
| Sonner | 1.x | Toast notifications |
| next-themes | 0.4 | Dark mode |
| date-fns | 4.x | Date formatting |
| lucide-react | latest | Icons |

## Backend — `apps/api`
| Tool | Version | Purpose |
|------|---------|---------|
| NestJS | 10.x | Modular Node.js framework |
| TypeScript | 5.x | Type safety |
| Prisma | 5.x | Type-safe ORM |
| Passport.js | 0.7 | Auth strategies |
| bcrypt | 5.x | Password hashing |
| class-validator | 0.14 | DTO validation |
| @nestjs/swagger | 7.x | Auto-generated API docs |
| @nestjs/throttler | 6.x | Rate limiting |
| nodemailer | 6.x | Email (verification, reset) |
| cloudinary | 2.x | Image upload & management |
| multer | 1.x | Multipart file handling |

## Database
| Tool | Purpose |
|------|---------|
| PostgreSQL 16 | Primary relational database |
| Redis 7 | Session caching, rate limiting |
| Elasticsearch 8 | Full-text search (Phase 5) |

## Infrastructure
| Tool | Purpose |
|------|---------|
| Docker + Compose | Local dev environment |
| Turborepo | Monorepo build system |
| GitHub Actions | CI/CD pipelines |
| Vercel | Next.js frontend hosting |
| Railway / Render | NestJS API hosting |
| Cloudinary | Media CDN + storage |
| Cloudflare | DNS, CDN, DDoS |

## Testing
| Tool | Purpose |
|------|---------|
| Vitest | Frontend unit tests |
| React Testing Library | Component tests |
| Jest + Supertest | Backend unit + integration |
| Playwright | E2E tests |

## Code Quality
| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| Husky | Pre-commit hooks |
| lint-staged | Run checks on staged files |
