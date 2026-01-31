# Coding Rules & Guidelines — Electron Template

> **문서 성격**: 템플릿 기반 프로젝트에서 **코드 구조·명명·에러 처리·로깅**을 일관되게 유지하기 위한 규칙입니다.

---

## 1. Architectural Principles

* **Design Pattern**: **Controller → Service → DB(Mapper)** 3계층. Hono Controller는 HTTP 요청/응답만 담당하고, 비즈니스 로직은 Service, 데이터 접근은 Mapper(Drizzle)에서 수행. **선택 이유**: 백엔드(Spring 등)와 유사한 책임 분리로, 팀이 익숙한 패턴으로 확장 가능.
* **IPC vs API**: **엔드포인트 통신 = API(HTTP)**. Hono·외부 서버 호출은 axios(메인) 또는 fetch(렌더러 honoClient)로만 수행. **설정·앱 단 통신 = IPC**. base URL, DB 모드 등은 IPC로 제공.
* **Directory Strategy**: Main / Preload / Renderer 분리. 공용 타입은 **루트 `types/`** 에만 두고, main·renderer 모두 `@/types/*` 로 참조. DTO·테이블 타입 중복 정의 금지.

---

## 2. Folder Structure (Tree View)

```
electron-template/
├── config/                     # 설정 (앱 전역)
│   ├── app.json               # api.baseURL, server(port/hostname), db(mode/local/remote)
│   └── types.ts               # AppConfig, ServerConfig, ApiConfig, DbConfig
├── types/                      # 공용 타입 (main·renderer 공유)
│   ├── dto.ts                 # HealthDto, ExampleDto
│   └── table.ts               # Drizzle 추론 타입 (ExampleTableGet, ExampleTablePost)
├── main/                       # Main Process
│   ├── index.ts               # 앱 진입점, IPC·Hono·DB context·윈도우
│   ├── api/                   # Hono API (axios 단일 인스턴스)
│   │   ├── index.ts           # API 함수·IPC re-export
│   │   ├── clients.ts         # apiClient 생성·인터셉터
│   │   ├── apiGetExample.ts
│   │   └── apiGetHealth.ts
│   ├── ipc/                   # IPC 핸들러
│   │   ├── index.ts           # 핸들러 등록
│   │   ├── ipcGetPing.ts
│   │   ├── ipcGetHonoBaseUrl.ts
│   │   └── ipcGetDbMode.ts
│   ├── server/                # Hono 서버 (Controller → Service → DB)
│   │   ├── index.ts           # startHonoServer, closeHonoServer
│   │   ├── honoApp.ts         # Hono 앱, CORS, 라우트 마운트
│   │   ├── controller/        # HTTP 요청/응답
│   │   ├── service/           # 비즈니스 로직
│   │   ├── db/                # getDb, context, mapper
│   │   │   ├── context.ts
│   │   │   ├── client/        # local.ts, remote.ts
│   │   │   └── mapper/
│   │   └── schema/            # Drizzle 스키마 (local | remote)
│   └── window/
├── preload/
│   └── index.ts               # ipc·api 노출 (contextBridge)
├── renderer/                  # Renderer Process (Vue)
│   ├── api/                   # Hono API 클라이언트 (fetch, 필요 시)
│   ├── assets/styles/         # Tailwind·커스텀 CSS
│   ├── types/
│   │   └── electron.d.ts       # Window.electron 타입 (import → re-export 금지)
│   ├── views/                 # 페이지 컴포넌트
│   ├── router/
│   ├── App.vue
│   └── index.html
├── drizzle/                   # Drizzle 마이그레이션 (local | remote)
├── docs/                      # IPC 가이드 등
├── PRD/                       # PRD 문서 및 Plan & Result
│   ├── PRD.md
│   ├── Coding Rules & Guidelines.md
│   ├── Development Task List.md
│   └── plans/                 # Plan & Result (플랜·결과 같은 폴더)
│       └── YYYY-MM-DD/
│           ├── *_PLAN.md
│           └── *_RESULT.md
├── electron.vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Naming Conventions (Strict)

* **Files**:  
  - IPC: `ipc<행위><대상>.ts` (예: `ipcGetHealth.ts`, `ipcGetDbMode.ts`).  
  - API: `apiGet<대상>.ts` (예: `apiGetHealth.ts`, `apiGetExample.ts`).  
  - Controller/Service: `*Controller.ts`, `*Service.ts`.  
  - 컴포넌트: `PascalCase.vue`.
* **Variables**: `camelCase`. boolean은 `is*`, `has*` 접두사 권장.
* **Constants**: `UPPER_SNAKE_CASE` (전역 상수). 설정은 `config/app.json` 사용.
* **Types/Interfaces**: `PascalCase`. DTO는 `*Dto`, 테이블 get/post는 `*TableGet`, `*TablePost`.
* **Commits**: Conventional Commits 권장 (`feat:`, `fix:`, `docs:`, `refactor:` 등).

---

## 4. Coding Standards

* **Type Safety**: `any` 사용 금지. 공용 타입은 루트 `types/` 에 한 곳만 정의하고, main·renderer에서 import.
* **Error Handling**:  
  - **Global**: Renderer에서 API 호출 실패 시 try/catch로 메시지 표시. 메인 프로세스에서 예외는 IPC 응답으로 전달하지 않고, API 레이어에서 catch 후 적절한 응답/로그 처리.  
  - **API**: axios 인터셉터에서 에러 로그 출력. 표준 에러 응답 포맷은 Hono Controller에서 `c.json({ error: string }, status)` 등으로 통일 권장.
* **Logging**:  
  - **Main**: `console.log` / `console.error` (개발 시). API 요청/응답은 `main/api/clients.ts` 인터셉터에서 로그.  
  - **Renderer**: DevTools Console. 프로덕션에서는 필요 시 로깅 레벨·전송 정책을 확장.

---

## 5. Template-Specific Rules

* **Vue에서 API 호출**: 반드시 `window.electron.api.*` 로만 접근. `window.electron.ipc.*` 는 설정·ping 등 비엔드포인트 통신용.
* **타입 import → re-export 금지**: `renderer/types/electron.d.ts` 에서 DTO를 import한 뒤 export 하지 않음. 뷰에서는 `@/types/dto` 등에서 직접 import.
* **Drizzle 테이블 타입**: `types/table.ts` 에서 스키마(`@main/server/schema/local` 등)를 import한 뒤 `InferSelectModel` / `InferInsertModel` 로만 타입 생성. 수동 interface 중복 정의 금지.

---

*문서 끝*
