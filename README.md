# Electron Template

Electron + Vue 3 + TypeScript를 기반으로 한 데스크톱 애플리케이션 개발 템플릿입니다.

## 📋 목차

- [기술 스택](#기술-스택)
- [주요 기능](#주요-기능)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [개발 가이드](#개발-가이드)
- [빌드 및 배포](#빌드-및-배포)
- [문서](#문서)

---

## 🛠 기술 스택

### 핵심 기술

- **Electron** `^39.2.7` - 크로스 플랫폼 데스크톱 애플리케이션 프레임워크
- **Vue 3** `^3.5.26` - 프론트엔드 프레임워크 (Composition API)
- **TypeScript** `^5.9.3` - 타입 안전성을 위한 정적 타입 언어
- **electron-vite** `^5.0.0` - 빠른 개발 및 빌드를 위한 빌드 도구

### UI 및 스타일링

- **Tailwind CSS** `^4.1.18` - 유틸리티 우선 CSS 프레임워크
- **class-variance-authority** `^0.7.1` - 컴포넌트 variant 관리
- **tailwind-merge** `^3.4.0` - Tailwind 클래스 병합 유틸리티

### 상태 관리 및 유틸리티

- **Pinia** `^3.0.4` - Vue 상태 관리 라이브러리
- **Luxon** `^3.7.2` - 날짜/시간 처리 라이브러리
- **Axios** `^1.13.2` - HTTP 클라이언트
- **UUID** `^13.0.0` - 고유 식별자 생성

### 개발 도구

- **ESLint** `^9.39.2` - 코드 품질 및 스타일 검사
- **TypeScript ESLint** `^8.52.0` - TypeScript 전용 린터
- **Vue ESLint Plugin** `^10.6.2` - Vue 전용 린터 규칙

---

## ✨ 주요 기능

### 보안

- ✅ **Context Isolation** 활성화 - 렌더러와 메인 프로세스 격리
- ✅ **Node Integration** 비활성화 - 보안 강화
- ✅ **Content Security Policy (CSP)** 설정 - XSS 공격 방지
- ✅ **Preload Script**를 통한 안전한 API 노출

### 개발 경험

- ⚡ **Hot Module Replacement (HMR)** - 빠른 개발 피드백
- 🔧 **TypeScript** 완전 지원 - 타입 안전성 보장
- 🎨 **Tailwind CSS** 통합 - 빠른 스타일링
- 📝 **ESLint** 설정 - 코드 품질 유지

### IPC 통신

- 🔌 **타입 안전한 IPC 통신** 구조
- 📚 **상세한 IPC 가이드 문서** 제공
- 🛡️ **보안 모범 사례** 적용

---

## 📁 프로젝트 구조

```
electron-template/
├── main/                    # Main Process (Node.js 환경)
│   ├── index.ts            # 앱 진입점 및 윈도우 생성
│   └── ipc/                # IPC 핸들러 모음
│       ├── index.ts        # IPC 핸들러 등록 (통합 파일)
│       └── ipcGetPing.ts   # ping IPC 핸들러 (예시)
├── preload/                # Preload Script
│   └── index.ts           # contextBridge를 통한 API 노출
├── renderer/               # Renderer Process (브라우저 환경)
│   ├── assets/            # 정적 자산
│   │   ├── images/        # 이미지 파일
│   │   └── styles/        # CSS 스타일 파일
│   ├── types/             # TypeScript 타입 정의
│   │   └── electron.d.ts  # Electron API 타입
│   ├── utils/             # 유틸리티 함수
│   ├── App.vue            # 루트 Vue 컴포넌트
│   ├── index.html         # HTML 진입점
│   └── index.ts           # Vue 앱 초기화
├── docs/                  # 문서
│   └── IPC_GUIDE.md      # IPC 통신 가이드
├── out/                   # 빌드 출력 디렉토리
├── electron.vite.config.ts # electron-vite 설정
├── tsconfig.json          # TypeScript 설정
├── eslint.config.mjs      # ESLint 설정
└── package.json           # 프로젝트 메타데이터
```

---

## 🚀 시작하기

### 필수 요구사항

- **Node.js** 18.x 이상
- **pnpm** 10.28.0 (프로젝트에서 지정된 버전)

### 설치

```bash
# 의존성 설치
pnpm install
```

### 개발 모드 실행

```bash
# 개발 서버 시작 (HMR 지원)
pnpm dev
```

개발 모드에서는:
- Main Process와 Preload Script는 자동으로 재빌드됩니다
- Renderer Process는 Vite HMR을 통해 즉시 반영됩니다
- DevTools가 자동으로 열립니다

### 빌드

```bash
# 프로덕션 빌드
pnpm build
```

빌드된 파일은 `out/` 디렉토리에 생성됩니다.

### 미리보기

```bash
# 빌드된 앱 미리보기
pnpm preview
```

---

## 📖 개발 가이드

### IPC 통신 추가하기

새로운 IPC 통신을 추가하려면 다음 4단계를 따르세요:

1. **Main Process에 핸들러 추가** (`main/ipc/ipc<행위><대상>.ts`)
   - 파일명 규칙: `ipc<행위><대상>` (예: `ipcGetUser`, `ipcPostData`, `ipcDeleteFile`, `ipcUpdateConfig`)
   - 함수명 규칙: `ipc<행위><대상>()` (예: `ipcGetUser()`, `ipcPostData()`) - 파일명과 동일
2. **IPC 핸들러 등록** (`main/ipc/index.ts`에 함수 호출 추가)
3. **Preload Script에 API 노출** (`preload/index.ts`)
4. **TypeScript 타입 정의** (`renderer/types/electron.d.ts`)
5. **Renderer에서 사용** (Vue 컴포넌트)

자세한 내용은 [IPC 통신 가이드](./docs/IPC_GUIDE.md)를 참고하세요.

### 스타일링

이 프로젝트는 Tailwind CSS를 사용합니다. 커스텀 스타일은 `renderer/assets/styles/` 디렉토리에 추가할 수 있습니다.

**경로 별칭 (Aliases)**:
- `~/*` → `renderer/*`
- `@main/*` → `main/*`
- `@preload/*` → `preload/*`
- `@/*` → 프로젝트 루트

### 상태 관리

Pinia를 사용하여 전역 상태를 관리할 수 있습니다. Store는 `renderer/stores/` 디렉토리에 생성하세요.

---

## 🏗 빌드 및 배포

### 빌드 설정

빌드 설정은 `electron.vite.config.ts`에서 관리됩니다. Main, Preload, Renderer 프로세스별로 개별 설정이 가능합니다.

### 배포

Electron 앱을 배포하려면 추가 패키징 도구가 필요합니다:
- [electron-builder](https://www.electron.build/)
- [electron-forge](https://www.electronforge.io/)

---

## 📚 문서

- [IPC 통신 가이드](./docs/IPC_GUIDE.md) - IPC 통신 추가 및 사용 방법

---

## 🔧 설정 파일

### TypeScript

- `tsconfig.json` - TypeScript 컴파일러 설정
- DOM 라이브러리 포함으로 `window` 객체 타입 지원

### ESLint

- `eslint.config.mjs` - ESLint 규칙 및 플러그인 설정
- Vue, TypeScript, 접근성 규칙 포함

### Electron Vite

- `electron.vite.config.ts` - Main, Preload, Renderer 빌드 설정
- 경로 별칭 및 플러그인 설정

---

## 🛡️ 보안

이 템플릿은 Electron 보안 모범 사례를 따릅니다:

- **Context Isolation**: 활성화
- **Node Integration**: 비활성화
- **Content Security Policy**: 설정됨
- **Preload Script**: contextBridge를 통한 안전한 API 노출

자세한 내용은 [Electron 보안 가이드](https://www.electronjs.org/docs/latest/tutorial/security)를 참고하세요.

---

## 📝 라이선스

ISC

---

## 🤝 기여

이슈 및 풀 리퀘스트를 환영합니다!

---

**프로젝트 이름**: keyword-manager  
**버전**: 1.0.0  
**패키지 매니저**: pnpm@10.28.0
