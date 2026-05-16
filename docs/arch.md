# 아키텍처

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
