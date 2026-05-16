# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 목적

React 19 + TypeScript + Vite 기반 노트 앱 실습 프로젝트. JSON Server를 백엔드로 사용하는 풀스택 학습용 코드베이스.

## 커맨드

```bash
npm run dev          # 프론트(Vite :5173) + JSON Server(:3001) 동시 실행
npm run server       # JSON Server만 단독 실행
npm run build        # tsc + vite build
npm run lint         # ESLint --fix
npm run format       # Prettier --write
npm test             # Vitest 단일 실행
npm run test:watch   # Vitest 워치 모드
```

## 참고 문서

코드 작업 전 반드시 읽을 것:

- 아키텍처/디렉토리 구조 파악 필요 시 → `docs/arch.md`
- 컴포넌트 작성, 상태 관리, API 호출, 네이밍, 테스트 작성 시 → `docs/patterns.md`

## 스택

React 19, TypeScript 5.7, Vite 6, Tailwind CSS 4 (Vite 플러그인 방식), JSON Server 1.x beta

## 커밋 규칙

Conventional Commits 강제 (commitlint + husky `commit-msg` 훅).  
상세 규칙 및 예시 → [docs/commit-guidelines.md](docs/commit-guidelines.md)

## 도메인 용어집

@docs/CONTEXT.md

## 지식 그래프

@graphify-out/GRAPH_REPORT.md

## 사용자 규칙

- 컴포넌트는 반드시 named export만 사용한다
- 대화와 문서는 한글로 작성한다.
