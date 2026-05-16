# 구현 패턴

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

## 테스트 환경

- Vitest + jsdom + `@testing-library/react`
- 설정: `vite.config.ts` `test` 블록, setup 파일 `src/test-setup.ts`
