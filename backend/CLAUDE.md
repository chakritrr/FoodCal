# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start:dev   # run in watch mode (port 3030)
npm run build       # compile TypeScript
npm run seed        # insert 20 food items into DB (run once after first start)
npm run lint        # ESLint with auto-fix
npm run test        # Jest unit tests
```

MySQL runs via Docker (local dev only):
```bash
docker-compose up -d   # start MySQL container (port 3306)
```

Full deployment (root-level docker-compose):
```bash
cd /Users/chakritsuntarekanon/FoodCal
docker-compose up -d --build   # build + start all 3 services
docker-compose exec backend npm run seed  # seed DB (first time only)
```

Swagger UI available at `http://localhost:3030/doc` (dev) or `http://localhost/doc` (Docker).

## Architecture

Follows **Clean Architecture** with NestJS, modelled after the GreenHouse project pattern. Each feature is split across four layers:

```
Controller → UseCase → IRepository (abstract) → Repository (concrete) → Entity
```

### Layer responsibilities

- **`src/core/`** — framework-agnostic centre. Contains entities (TypeORM), abstract repository classes (`IFoodRepository`, `IUserRepository`), and DTOs. Nothing here imports from other src layers.
- **`src/repositories/`** — TypeORM implementations of the abstract repositories.
- **`src/frameworks/data-services/`** — NestJS module that binds `IXxxRepository` tokens to their concrete classes via DI. `TypeOrmDataServicesModule` is the only place that wires abstracts to concretes.
- **`src/use-case/<action>/`** — one folder per action. Each contains three files:
  - `*-use-case.ts` — orchestrates the action (calls repository, calls factory)
  - `*-factory.service.ts` — transforms data (entity → DTO, hash passwords, etc.)
  - `*-use-case.module.ts` — NestJS module; imports `DataServicesModule` and exports the use case
- **`src/controller/`** — thin HTTP layer. Injects use cases directly; no business logic here.
- **`src/frameworks/guards/`** — `JwtAuthGuard` and `JwtStrategy`. Apply with `@UseGuards(JwtAuthGuard)`.
- **`src/frameworks/middlewares/`** — `LoggerMiddleware` applied globally in `AppModule`. Logs `METHOD /path STATUS — Xms — ip` with colour-coded status codes (2xx green, 3xx cyan, 4xx yellow, 5xx red).

### Adding a new feature checklist

1. Entity in `src/core/entities/` → export from `index.ts`
2. Abstract repository in `src/core/abstracts/` → export from `index.ts`
3. DTO(s) in `src/core/dto/<feature>/` → export from `src/core/dto/index.ts`
4. Concrete repository in `src/repositories/` → export from `index.ts`
5. Register entity + bind abstract→concrete in `TypeOrmDataServicesModule`
6. Create use-case folder with the three files above
7. Register use-case module in `AppModule`
8. Add controller method; register controller in `AppModule`

### Pagination

`GET /api/v1/foods` supports server-side pagination via query params:

| Param | Default | Description |
|---|---|---|
| `page` | `1` | Page number |
| `limit` | `8` | Items per page |
| `category` | — | `vegetable` or `fruit` (omit for all) |

Response shape: `{ data, total, page, limit, totalPages }`.

Implemented via `IFoodRepository.findPaginated()` which uses TypeORM `findAndCount`. The factory (`FoodGetAllFactoryService`) has two methods: `constructResponse` (array) and `constructPaginatedResponse` (paginated shape).

Frontend (`src/services/foodApi.ts`) calls `fetchFoodsPaginated(page, limit, category?)` — filter tab and page-size changes trigger a new API request instead of client-side slicing.

### Auth

- `POST /api/v1/register` and `POST /api/v1/login` are public.
- `GET /api/v1/me` is a protected example — add `@UseGuards(JwtAuthGuard)` to protect any route.
- JWT payload shape: `{ userId: string, email: string }` (available via `@Request() req` → `req.user`).

### Database

- MySQL via TypeORM with `synchronize: true` (auto-migrates on start — change to `false` for production).
- `FoodEntity` uses a string slug as primary key (e.g. `'broccoli'`). `UserEntity` uses UUID.
- Seed script: `src/database/seed.ts` — uses a standalone TypeORM `DataSource`, safe to re-run (skips existing rows).

### Environment variables

Defined in `src/constants/env.ts` as string keys; consumed via `ConfigService` in `src/configulations/index.ts`. Required vars: `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`.
