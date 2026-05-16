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

## 아키텍처

**데이터 흐름**: `src/api/notes.ts` → `src/context/NotesContext.tsx` → 컴포넌트

- `src/api/notes.ts` — JSON Server REST API 호출 4개 (fetch/create/update/delete). `updatedAt`은 API 레이어에서 자동 주입.
- `src/context/NotesContext.tsx` — 전역 상태. `notes[]`, `loading`, `error` + `addNote/editNote/removeNote`. Context null 체크 강제(`useNotes` throw).
- `src/App.tsx` — `selectedNoteId` / `isCreating` 두 상태로 NoteList ↔ NoteEditor 조율. NotesProvider 루트.
- `src/components/Layout.tsx` — 사이드바 + 메인 2분할 레이아웃. `sidebar`/`main` prop으로 조합.
- `src/types/note.ts` — `Note` 인터페이스. `tags` 필드는 의도적으로 미구현(강의 진행 예정).

**백엔드**: `db.json` — JSON Server가 파일 기반 REST API 제공. `/notes` 엔드포인트.

## 디렉토리 구조

```
src/
├── api/            # REST API 호출 함수 (사이드이펙트만, 상태 없음)
├── components/     # UI 컴포넌트 (순수 표현 또는 Context 소비)
├── context/        # 전역 상태 (Provider + custom hook 쌍으로 구성)
├── types/          # 공유 TypeScript 인터페이스
├── App.tsx         # 라우팅 없이 selectedNoteId/isCreating으로 뷰 분기
├── main.tsx        # ReactDOM 진입점
└── index.css       # Tailwind 전역 스타일
db.json             # JSON Server 데이터 파일 (로컬 DB)
```

## 컴포넌트 구현 패턴

- **named export** 고정 (`export function Foo`, default export 없음)
- Props 인터페이스는 파일 상단에 `interface XxxProps` 로 선언
- 컴포넌트 내부 상태(`useState`)는 Context 없이 해결 가능한 범위만 보유
- 로딩/에러/빈 상태 early return → 메인 JSX 마지막에 위치
- 이벤트 버블링 차단 필요 시 `e.stopPropagation()` 인라인 처리 (NoteItem 삭제 버튼 참고)
- Tailwind 조건부 클래스는 템플릿 리터럴 `${}` 내에서 삼항연산자로 처리

## 상태 관리 방식

- **Context + custom hook 패턴**: `NotesContext.tsx` 가 Provider와 `useNotes()` 훅을 단일 파일에서 export
- Context null 가드: `useNotes()` 에서 null 체크 후 throw — Provider 외부 사용 방지
- **낙관적 업데이트 없음**: API 성공 후 로컬 `setNotes`로 동기화 (`addNote` → spread append, `editNote` → map replace, `removeNote` → filter)
- 로컬 UI 상태(`selectedNoteId`, `isCreating`, `saving`)는 App 또는 컴포넌트에서 직접 관리

## API 호출 패턴

- `src/api/notes.ts` 에서 fetch 래퍼 함수만 export (클래스/인스턴스 없음)
- 모든 함수 반환 타입 명시: `Promise<Note>`, `Promise<Note[]>`, `Promise<void>`
- `!res.ok` → `throw new Error(메시지)` 패턴 일관 적용
- `updatedAt` 타임스탬프는 API 레이어(`createNote`, `updateNote`)에서 주입 — Context/컴포넌트에서 건드리지 않음
- `createNote` 입력 타입: `Omit<Note, 'id' | 'createdAt' | 'updatedAt'>`

## 네이밍 패턴

| 대상           | 규칙                | 예시                                                   |
| -------------- | ------------------- | ------------------------------------------------------ |
| 컴포넌트 파일  | PascalCase          | `NoteEditor.tsx`                                       |
| API 함수       | 동사+명사 camelCase | `fetchNotes`, `createNote`, `updateNote`, `deleteNote` |
| Context 핸들러 | 동사+명사 camelCase | `createNote`, `updateNote`, `deleteNote`               |
| Props 이벤트   | `on` 접두사         | `onSelect`, `onDelete`, `onDone`, `onNewNote`          |
| 로컬 핸들러    | `handle` 접두사     | `handleSave`, `handleSelectNote`, `handleNewNote`      |
| 상태 불리언    | 형용사형            | `loading`, `saving`, `isCreating`, `isSelected`        |

## 알려진 네이밍 불일치 (미해결)

**`onNewNote` — `on+동사` 패턴 위반** — 나머지 props(`onSelect`, `onDelete`, `onDone`)와 달리 형용사+명사 구조. `onCreate`가 패턴에 맞음.

## 테스트 환경

- Vitest + jsdom + `@testing-library/react`
- 설정: `vite.config.ts` `test` 블록, setup 파일 `src/test-setup.ts`

## 스택

React 19, TypeScript 5.7, Vite 6, Tailwind CSS 4 (Vite 플러그인 방식), JSON Server 1.x beta

## 커밋 규칙

Conventional Commits 강제 (commitlint + husky `commit-msg` 훅).  
상세 규칙 및 예시 → [docs/commit-guidelines.md](docs/commit-guidelines.md)

## 사용자 규칙

- 컴포넌트는 반드시 named export만 사용한다
