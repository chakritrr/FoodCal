# FoodCal 🥦🍎

แอปติดตามแคลอรีสำหรับผักและผลไม้ — เลือกดูสินค้าตามประเภท vegetable / fruit ดูข้อมูลแคลอรีต่อ 100 กรัม และจัดการตะกร้า

## Tech Stack

| Layer | เทคโนโลยี |
|-------|-----------|
| **Backend** | NestJS + TypeORM + MySQL (port 3030) |
| **Frontend** | React 19 + TypeScript + Vite (port 5173) |
| **Container** | Docker Compose (3 services) |

## Quick Start (Docker Compose)

```bash
# 1. Build + start ทั้ง 3 services
docker-compose up -d --build

# 2. รอให้ backend พร้อม แล้ว seed ข้อมูล (ครั้งแรกเท่านั้น)
docker-compose exec backend npm run seed

# 3. เปิด browser ที่ http://localhost
```

คำสั่งนี้จะ start:
- **MySQL** (`foodcal-mysql`) — พอร์ต 3306
- **Backend API** (`foodcal-backend`) — NestJS รันอยู่ภายใน
- **Frontend** (`foodcal-frontend`) — nginx เสิร์ฟที่พอร์ต 80

**Swagger UI**: `http://localhost/doc`

> ⚠️ **สำคัญ:** หลังจาก `docker-compose up` ครั้งแรก Database จะว่างเปล่า — **ต้องรัน `npm run seed`** เพื่อใส่ข้อมูลผักผลไม้ 20 อย่างให้พร้อมใช้งาน

## Local Development (ไม่ใช้ Docker)

### 1. Start MySQL

```bash
cd backend
docker-compose up -d           # รัน MySQL container (port 3306)
```

### 2. Start Backend

```bash
cd backend
npm install
npm run start:dev              # dev server ที่ http://localhost:3030

# ใน terminal แยก — Seed ข้อมูล (ครั้งแรกเท่านั้น)
npm run seed
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev                    # dev server ที่ http://localhost:5173
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/register` | สมัครสมาชิก |
| `POST` | `/api/v1/login` | เข้าสู่ระบบ (รับ JWT token) |
| `GET` | `/api/v1/foods?page=&limit=&category=` | ดูรายการอาหาร (แบ่งหน้า) |
| `GET` | `/api/v1/me` | ดูข้อมูลผู้ใช้ (ต้องใช้ token) |

### Pagination — `GET /api/v1/foods`

| Param | Default | Description |
|-------|---------|-------------|
| `page` | `1` | เลขหน้า |
| `limit` | `8` | จำนวนรายการต่อหน้า |
| `category` | — | `vegetable` หรือ `fruit` (ไม่ส่ง = ทั้งหมด) |

Response shape: `{ data: Food[], total, page, limit, totalPages }`

## Seed Data

ข้อมูลเริ่มต้น 20 รายการ — ผัก 10 อย่าง ผลไม้ 10 อย่าง:

```
🥦 บรอกโคลี      🥕 แครอท         🌿 ผักโขม        🍅 มะเขือเทศ
🥒 แตงกวา        🌽 ข้าวโพด       🥬 กะหล่ำปลี      🫘 ถั่วฝักยาว
🍄 เห็ดหอม       🎃 ฟักทอง        🍎 แอปเปิ้ล       🍌 กล้วย
🍊 ส้ม            🍇 องุ่น          🥭 มะม่วง         🍓 สตรอว์เบอร์รี่
🍉 แตงโม         🍈 มะละกอ        🍍 สับปะรด        🟡 ทุเรียน
```

รัน seed ซ้ำได้ — รายการที่ซ้ำจะถูกข้ามไป (ไม่ลงซ้ำ)

## Project Structure

```
FoodCal/
├── docker-compose.yml           # 3 services (MySQL + Backend + Frontend)
├── backend/
│   ├── Dockerfile
│   ├── docker-compose.yml       # MySQL standalone (local dev)
│   ├── src/
│   │   ├── core/                # Entities, abstractions, DTOs
│   │   ├── use-case/            # Business logic per action
│   │   ├── controller/          # HTTP layer
│   │   ├── repositories/        # TypeORM implementations
│   │   └── database/seed.ts     # Seed script
│   └── package.json
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── context/             # AuthContext (JWT management)
│   │   ├── services/            # API calls (foodApi, authApi)
│   │   ├── components/          # UI components
│   │   └── data/foods.ts        # Food type contract
│   └── package.json
└── README.md
```
