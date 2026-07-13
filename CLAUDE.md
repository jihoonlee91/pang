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

## 작업 방식

- 새로운 요구사항이 들어오면 코드를 바로 수정하지 않고, 먼저 관련 설계 문서(`docs/PRD.md`, `docs/PLAN.md`, `docs/design/*.md`)를 갱신한 다음 구현한다.
- 커밋은 기능 단위로 잘게 나누고, 매 커밋마다 원격(`origin master`)에 즉시 푸시한다.

## 커밋 컨벤션

[Conventional Commits](https://www.conventionalcommits.org/) 형식을 따른다.

```
<type>: <설명 (영문, 명령형, 소문자 시작)>
```

- `feat`: 새로운 기능/게임플레이 요소 추가
- `fix`: 버그 수정
- `docs`: `docs/` 이하 설계 문서 변경 (코드 변경 없음)
- `style`: 시각적/스타일 변경 (동작 변화 없음, 예: 색상·폰트·레이아웃)
- `refactor`: 동작 변화 없는 코드 구조 개선
- `chore`: 빌드 설정, 의존성 등 기타 잡무

예: `feat: add power-up drops and effects`, `docs: design phase3-4 power-ups`

본문(body)이 필요하면 제목 아래 빈 줄을 두고 설명을 추가한다. 커밋 메시지 마지막 줄에는 `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`를 남긴다.

## 기획 문서

- `docs/PRD.md` — 게임 전체 요구사항 개요
- `docs/FEATURES/main.md` — 메인 화면 기능
- `docs/FEATURES/game_rule.md` — 게임 규칙
- `docs/FEATURES/mission1.md` — 미션 1 (튜토리얼 스테이지)
- `docs/PLAN.md` — Phase별 목표를 세운 파일
- `docs/design/` — PLAN.md의 세부 Phase(1-1~1-4, 2-1~2-7, 3-1~3-4, 4-1~4-4) 별 설계문서
