# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 기술 스택

- **React 19** + **TypeScript** (Vite 8 기반)
- 빌드/개발 서버: **Vite**
- 린트: **Oxlint** (ESLint가 아님)
- 패키지 매니저: npm

## 주요 명령어

```bash
npm install       # 의존성 설치
npm run dev       # 개발 서버 실행 (기본 포트 5173)
npm run build     # tsc -b (타입 체크) 후 vite build로 프로덕션 빌드
npm run preview   # 빌드된 결과물 로컬 미리보기
npm run lint      # oxlint 실행
```

타입만 검사하고 싶을 때:
```bash
npx tsc --noEmit -p tsconfig.app.json
```

## 테스트

현재 테스트 프레임워크(Vitest/Jest 등)는 설치되어 있지 않습니다. 테스트 관련 요청이 있을 경우, 먼저 테스트 러너 도입이 필요함을 사용자에게 알려야 합니다. 현재 품질 검증은 `npm run lint`(Oxlint)와 `npm run build`(타입 체크 포함)로만 이루어집니다.

## 아키텍처

- 단일 페이지 구조의 최소 템플릿입니다. 엔트리포인트는 `src/main.tsx` → `src/App.tsx`.
- 프로젝트 루트의 `tsconfig.json`은 `tsconfig.app.json`(앱 소스용)과 `tsconfig.node.json`(Vite 설정 등 Node 환경용) 두 개의 project reference로 분리되어 있습니다.
- `vite.config.ts`는 `@vitejs/plugin-react` 플러그인만 사용하는 기본 설정입니다.
- Oxlint 설정은 `.oxlintrc.json`에 있으며, 타입 인식 린트 규칙(typeAware)은 기본적으로 비활성화되어 있습니다.
