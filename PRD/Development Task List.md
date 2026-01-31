# Development Task List — Electron Template

> **문서 성격**: 이 템플릿을 **기반으로 새 프로젝트를 착수하거나, 템플릿 자체를 유지·확장할 때** 순차적으로 수행할 태스크 목록입니다.  
> 템플릿이 이미 구축된 상태이므로, **Phase 1~2**는 “템플릿 클론 후 초기 설정”, **Phase 3~4**는 “도메인 기능 추가·검증”에 맞춰 작성했습니다.

---

## Phase 1: Environment & Foundation

- [ ] **Init**: 저장소 클론 및 의존성 설치 (`pnpm install`). `.gitignore` 확인.
- [ ] **Config**: `config/app.json` 수정 — `api.baseURL`, `server.port`/`hostname`, `db.mode`/`db.local.path`/`db.remote.connectionUrl` 등 프로젝트에 맞게 설정.
- [ ] **Base Architecture**: 필요 시 `main/server/controller`, `main/server/service`, `main/server/db/mapper`, `main/api`, `main/ipc`, `renderer/views`, `types/` 구조 유지. 새 라우트·API·IPC는 기존 명명 규칙(ipcGet*, apiGet*, *Controller, *Service) 준수.

---

## Phase 2: Core Domain & Database

- [ ] **Schema**: `main/server/schema/local`·`remote` 에 도메인 테이블 추가. Drizzle 스키마 정의 후 `drizzle.config.local.ts` / `drizzle.config.remote.ts` 로 마이그레이션 생성 (`pnpm db:generate`, `pnpm db:generate:remote`).
- [ ] **Models**: 루트 `types/table.ts` 에 Drizzle `InferSelectModel` / `InferInsertModel` 로 GET(select)·POST(insert) 타입 추가. `types/dto.ts` 에 API 응답 DTO 추가 시 main·renderer 공용으로 한 곳만 정의.
- [ ] **Mapper**: `main/server/db/mapper/` 에 새 Mapper 추가. `getDb()` 로 연결 취득 후 Drizzle 쿼리 수행. 로컬/원격 스키마는 `main/server/schema/local`·`remote` 에서 import.

---

## Phase 3: Feature Implementation (Iteration)

- [ ] **Hono 라우트**: `main/server/controller/` 에 새 Controller 추가 후 `main/server/controller/index.ts` 에 라우트 등록. Service 호출 후 `c.json()` 반환.
- [ ] **Service**: `main/server/service/` 에 비즈니스 로직 구현. Mapper 결과를 DTO로 가공.
- [ ] **API 레이어**: `main/api/apiGet*.ts` (또는 apiPost* 등) 추가. `apiClient`(axios)로 Hono 엔드포인트 호출. 동일 파일 내 `ipcGet*()` 로 IPC 핸들러 등록. `main/api/index.ts` 에 export 추가.
- [ ] **IPC 등록**: `main/ipc/index.ts` 에 `ipcGet*` 등록. Preload에 `window.electron.api.*` 노출. `renderer/types/electron.d.ts` 에 반환 타입만 참조(import → re-export 금지).
- [ ] **Renderer UI**: `renderer/views/` 에 Vue 페이지 추가. `window.electron.api.*` 로만 API 호출. DTO 타입은 `@/types/dto` 에서 import. 라우터에 경로 등록, App.vue 네비 링크 추가.

---

## Phase 4: Verification & Polish

- [ ] **Test**: `pnpm dev` 로 앱 기동 후 Home / Health / DB 모드 등 참고용 화면 동작 확인. 새로 추가한 API·IPC·뷰 수동 검증.
- [ ] **Optimization**: 번들 크기·Drizzle 쿼리 필요 시 점검. 로컬 마이그레이션은 앱 기동 시 자동 적용됨 확인.
- [ ] **Final Review**: PRD·Coding Rules 대비 누락 기능·명명 규칙·타입 정의 위치 점검. `docs/IPC_GUIDE.md` 등 문서 필요 시 갱신.

---

## Template Maintenance (선택)

- [ ] **의존성 업데이트**: Electron·Vue·Hono·Drizzle·electron-vite 등 메이저 업데이트 시 호환성 검증 및 마이그레이션 가이드 반영.
- [ ] **Plan & Result**: 구조 변경·버그 수정 시 `PRD/plans/YYYY-MM-DD/` 에 계획(PLAN)·결과(RESULT) 문서 작성(같은 폴더에 생성, 프로젝트 규칙에 따름).

---

*문서 끝*
