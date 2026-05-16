# 태그 기능 정의서 (확정)

## 기능 개요

- 노트에 태그를 추가할 수 있다
- 노트에 추가된 태그를 삭제할 수 있다
- 태그 목록을 노트 상세 화면(제목 아래)에서 확인할 수 있다
- 태그 목록을 노트 목록(NoteItem)에서도 확인할 수 있다

## 데이터 구조

```ts
// src/types/note.ts
interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[]; // 추가
  createdAt: string;
  updatedAt: string;
}
```

- 태그는 문자열 배열로 저장 (`string[]`)
- JSON Server `/notes` 엔드포인트에서 그대로 관리

## 입력 방식

- 텍스트 입력 후 **Enter** 키로 태그 확정
- 확정된 태그는 칩(chip) 형태로 즉시 표시
- 칩의 [x] 버튼으로 태그 삭제

## 전처리 규칙

```ts
const tag = input.trim().toLowerCase();
```

| 규칙           | 처리                                |
| -------------- | ----------------------------------- |
| 앞뒤 공백      | 제거                                |
| 대소문자       | 소문자로 정규화                     |
| 단어 사이 공백 | 허용 (`"type script"` 유효)         |
| 특수문자       | 허용 (`"c++"`, `"vue.js"` 유효)     |
| 빈 문자열      | 추가 거부                           |
| 중복 태그      | 소문자 기준 비교, 중복 시 추가 거부 |

## 한글 IME 처리

한글 입력 중 Enter 오발동 방지:

```tsx
const [isComposing, setIsComposing] = useState(false);

<input
  onCompositionStart={() => setIsComposing(true)}
  onCompositionEnd={() => setIsComposing(false)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && !isComposing) addTag();
  }}
/>;
```

## 제한값

| 항목           | 기본값 | prop 이름      |
| -------------- | ------ | -------------- |
| 태그 최대 개수 | 10     | `maxTags`      |
| 태그 최대 길이 | 20자   | `maxTagLength` |

### 초과 시 동작

- `maxTags` 도달 → 입력란 `disabled`
- `maxTagLength` → `<input maxLength={n}>` 속성으로 조용히 차단

### 검증 로직

```ts
type ValidationResult = { ok: true } | { ok: false; reason: string };
```

현재는 `reason` 미사용 (UI 피드백 컴포넌트 없음). `disabled`/`maxLength`로만 동작.

> **TODO**: 알림 컴포넌트(Toast 등) 추가 시 `reason`을 해당 컴포넌트에 전달하도록 확장. TagInput 인터페이스 변경 없이 소비 방식만 교체.

## 저장 시점

- 태그는 **노트 저장 버튼 클릭 시** 본문/제목과 함께 저장
- `PUT /notes/:id` 요청에 `tags` 필드 포함
- `updatedAt`은 기존 패턴대로 API 레이어에서 주입

## UI 배치

### NoteEditor (노트 상세)

```
[제목 입력란              ]
[react] [x]  [typescript] [x]  [태그 입력...] ← TagInput 컴포넌트
[본문 입력란...           ]
```

### NoteItem (사이드바 목록)

```
📄 노트 제목
   [react]  [typescript]  +N  ← 읽기 전용 표시, 최대 3개 + 초과 시 +N 배지
```

- 태그 3개까지 칩 표시
- 초과분은 `+N` 배지 (예: 태그 5개 → 칩 3개 + `+2`)

## 컴포넌트 설계

### TagInput

```tsx
interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number; // default: 10
  maxTagLength?: number; // default: 20
}

// TODO: SettingsPanel 컴포넌트 + SettingsContext 추가 시,
//       props 대신 useSettings()로 maxTags/maxTagLength 읽도록 변경 예정
export function TagInput({ tags, onChange, maxTags = 10, maxTagLength = 20 }: TagInputProps);
```

- `src/components/TagInput.tsx` 신규 생성
- IME 처리, 검증, 칩 UI 모두 이 컴포넌트에서 담당

### 수정 대상 파일

| 파일                            | 변경 내용                                          |
| ------------------------------- | -------------------------------------------------- |
| `src/types/note.ts`             | `tags: string[]` 필드 추가                         |
| `src/api/notes.ts`              | `createNote`, `updateNote` 입력 타입에 `tags` 포함 |
| `src/context/NotesContext.tsx`  | `addNote`, `editNote` 태그 처리                    |
| `src/components/NoteEditor.tsx` | `TagInput` 컴포넌트 사용, 저장 시 `tags` 포함      |
| `src/components/NoteItem.tsx`   | 태그 칩 읽기 전용 표시 추가                        |
| `src/components/TagInput.tsx`   | 신규 생성                                          |
| `db.json`                       | 기존 노트에 `tags: []` 추가                        |

## 확장성 고려

정규화(`Tag` 엔티티 분리) 전환 시 주요 변경 지점:

- `src/types/note.ts` — `tags: string[]` → `tagIds: string[]` + `Tag` 인터페이스 추가
- `src/api/notes.ts` — 태그 CRUD API 추가
- `src/context/NotesContext.tsx` — 태그 전역 상태 추가
- `TagInput` 내부만 수정, `NoteEditor` props 인터페이스 변경 최소

## 비고

- 태그는 문자열로 저장 (정규화 없음)
- 중복 태그 불허 (소문자 기준 비교)
- 태그 검색: `GET /notes?tags_like=키워드` (JSON Server 지원)
