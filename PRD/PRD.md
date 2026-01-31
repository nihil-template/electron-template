# PRD (Product Requirements Document) — Electron Template

> **문서 성격**: 이 프로젝트는 **실제 서비스가 아닌 재사용 가능한 Electron 데스크톱 앱 템플릿**입니다.  
> PRD는 템플릿의 목표, 기술 스택, 아키텍처, 데이터 구조를 정의하여 **템플릿을 기반으로 새 프로젝트를 착수할 때** 참조합니다.

---

## 1. Project Overview

* **Goal**: Electron + Vue 3 + TypeScript 기반 데스크톱 앱을 **즉시 착수**할 수 있는 보일러플레이트를 제공한다. 메인 프로세스 내 Hono HTTP API, Controller-Service-DB 3계층, 로컬 SQLite / 원격 Postgres 전환, IPC·API 구분이 이미 갖춰져 있어 **도메인 기능 구현에만 집중**할 수 있게 한다.
* **Target User**: 데스크톱 앱을 Electron으로 개발하려는 개발자. Vue·TypeScript에 익숙하고, 백엔드 스타일(Controller-Service-DB)과 설정 기반 DB 전환을 선호하는 팀.
* **Key Value**:  
  - **일관된 구조**: Main / Preload / Renderer 분리, API는 HTTP(Hono), 설정·앱 단 통신은 IPC.  
  - **이중 DB**: `config/app.json`의 `db.mode`만 바꾸면 로컬(SQLite) ↔ 원격(Postgres) 전환.  
  - **타입 단일 정의**: 공용 DTO·테이블 타입은 루트 `types/`에만 두어 main·renderer 간 중복 제거.

---

## 2. Tech Stack & Environment (Specific Versions)

* **Runtime & Build**: Node.js 18+, **Electron v40**, **electron-vite v5** (Main / Preload / Renderer 분리 빌드)
* **Language & Framework**: **TypeScript 5.9+**, **Vue 3.5+** (Composition API), **Vue Router 5** (Hash 모드)
* **Main Process (API·DB)**: **Hono v4**, **@hono/node-server**, **Drizzle ORM 0.45+**, **better-sqlite3**, **pg**, **Axios**
* **Database**: 로컬 **SQLite**(better-sqlite3), 원격 **PostgreSQL**(pg). 스키마·마이그레이션은 Drizzle Kit(drizzle.config.local.ts / drizzle.config.remote.ts)으로 분리 관리.
* **State/Store**: **Pinia** (Vue 상태 관리, 템플릿에서 필요 시 사용)
* **UI/Styling**: **Tailwind CSS 4**, **class-variance-authority**, **tailwind-merge**. 커스텀 유틸리티는 `renderer/assets/styles/` 에서 관리.
* **Validation & Utils**: **Zod**, **Luxon**, **UUID**
* **Infra**: 로컬 개발은 `pnpm dev`(electron-vite dev). 빌드 산출물은 `out/` (Main/Preload), `dist/` (Renderer).

---

## 3. System Architecture & Features

### 3.1. User Flow (Template 기준)

* **Flow 1 (개발자 — 템플릿 사용)**: 저장소 클론 → `config/app.json` 수정(앱명, API baseURL, db.mode 등) → `pnpm install` → `pnpm dev` 로 기동 → Home / Health / DB 모드 참고용 UI 확인 → 도메인 기능(Controller·Service·Mapper·View) 추가.
* **Flow 2 (최종 사용자 — 앱 실행)**: 앱 실행 → Renderer(Vue) 로드 → 필요한 데이터는 `window.electron.api.*`(IPC 경유) 또는 `window.electron.ipc.*`(설정 조회) 사용. Hono 엔드포인트 호출은 메인 프로세스의 api 레이어(axios)가 담당.

### 3.2. Core Features (Template 범위)

* **Feature A: IPC vs API 구분**
  - **Logic**: 엔드포인트 통신(서버·Hono)은 **API(HTTP)** 로만 수행. 설정·앱 단 통신(base URL, DB 모드, ping 등)은 **IPC**.
  - **Validation**: Vue에서는 API 호출 시 `window.electron.api` 만 사용. IPC는 `window.electron.ipc`.

* **Feature B: Hono API (Controller → Service → DB)**
  - **Logic**: 메인 프로세스 내 Hono 서버가 `config.server`(port/hostname)에서 기동. 라우트는 Controller가 Service 호출, Service가 Mapper(DB) 또는 비즈니스 로직 수행. CORS로 Renderer(localhost:3000) 허용.
  - **Validation**: API 클라이언트는 **axios 단일 인스턴스**(`main/api/clients.ts`의 apiClient). 엔드포인트 추가 시 `main/api/apiGet*.ts` 패턴으로 구현 후 IPC 등록.

* **Feature C: 이중 DB (로컬 / 원격)**
  - **Logic**: `config/app.json`의 `db.mode`(`"local"` | `"remote"`)에 따라 `getDb()`가 SQLite 또는 Postgres 연결 반환. 로컬은 마이그레이션 자동 적용(drizzle/local).
  - **Validation**: `db.mode: "remote"` 일 때 `db.remote.connectionUrl` 필수. Renderer 참고용 UI(DB 모드 표시)는 `window.electron.ipc.getDbMode()`.

* **Feature D: 타입 정의 원칙**
  - **Logic**: 여러 곳에서 쓰는 타입(HealthDto, ExampleDto, ExampleTableGet/Post)은 **루트 `types/`** 에만 정의. Drizzle 테이블 타입은 `InferSelectModel` / `InferInsertModel` 로 스키마에서 추론(`types/table.ts`).
  - **Validation**: Renderer에서 import 후 re-export(import → export) 금지. DTO는 `@/types/dto`, 테이블 타입은 `@/types/table` 에서 직접 참조.

---

## 4. Data Structure (Schema)

### 4.1. 설정 (config/app.json)

```json
{
  "api": {
    "baseURL": "http://localhost:3456",
    "timeout": 10000
  },
  "server": {
    "port": 3456,
    "hostname": "localhost"
  },
  "db": {
    "mode": "local",
    "local": { "path": "./data/app.db" },
    "remote": { "connectionUrl": "" }
  }
}
```

* **api.baseURL**: Hono 서버 주소. 메인 프로세스의 axios 클라이언트와 IPC `getHonoBaseUrl` 반환값과 동일해야 함.
* **db.mode**: `"local"`(SQLite) | `"remote"`(Postgres). 전환 시 앱 재시작 필요.

### 4.2. 공용 DTO (types/dto.ts)

* **HealthDto**: `{ status: string; timestamp: number; }` — Health API 응답.
* **ExampleDto**: `{ exNo: number; exName: string; exDesc: string | null; }` — Example API 응답.

### 4.3. 테이블 타입 (types/table.ts — Drizzle 추론)

* **ExampleTableGet**: `InferSelectModel<typeof exampleTable>` — GET(select) 결과.
* **ExampleTablePost**: `InferInsertModel<typeof exampleTable>` — POST(insert) 시 전달. exNo는 autoIncrement/serial로 생략 가능.

### 4.4. Example 스키마 (참고)

* **로컬(SQLite)**: `ex_no`(integer, PK, autoIncrement), `ex_name`(text, notNull), `ex_desc`(text, nullable).
* **원격(Postgres)**: 동일 필드, `ex_no`는 serial.

---

## 5. Non-Functional Requirements & Risks

* **Performance**: Hono API는 메인 프로세스 내부 호출이므로 지연 최소. Renderer → IPC → Main → axios(Hono) 경로는 한 번의 IPC 왕복.
* **Security**: Context Isolation·Node Integration 비활성화. Preload를 통해서만 `window.electron` 노출. API 키·비밀은 config 또는 환경 변수로 관리하고 코드에 직접 넣지 않음.
* **Risks**:  
  - **템플릿 고정 스택**: Electron·Vue·Hono·Drizzle 버전 업 시 마이그레이션·호환 검증 필요.  
  - **DB 전환 시점**: `db.mode` 변경 후 앱 재시작 전까지는 기존 연결이 유지됨. 필요 시 `closeDb()` 후 재연결 로직은 템플릿 확장 시 추가.

---

*문서 끝*
