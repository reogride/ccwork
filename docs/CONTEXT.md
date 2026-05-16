# CONTEXT.md

도메인 용어집. 구현 디테일 없음. 확정된 개념 정의만.

---

## 태그 (Tag)

노트에 붙이는 **레이블(Label)**. 현재는 순수 문자열(`string`)로 노트마다 독립 저장. 앱 전체에서 공유되는 엔티티가 아님.

- 동일한 문자열 "react"가 노트 A와 B에 각각 존재해도 서로 다른 값임
- 소문자 기준으로 중복 여부 판단
- 향후 정규화(Tag 엔티티 분리) 전환 가능성 있음

## 태그 칩 (Tag Chip)

확정된 태그의 **시각적 표현 단위**. TagInput 컴포넌트 내부 UI 용어.

- 편집 가능 칩 — NoteEditor에서 사용. [x] 버튼으로 태그 제거 가능
- 읽기 전용 칩 — NoteItem(사이드바)에서 사용. 삭제 불가. 최대 3개 표시, 초과분은 `+N` 배지
- "태그를 추가한다" = 도메인 행위 / "칩이 표시된다" = UI 결과

## 드래프트 태그 (Draft Tags)

저장 버튼 클릭 전 **로컬에만 존재하는 임시 태그 상태**.

- 태그 칩 추가/삭제 → draft tags 변경 (DB 미반영)
- 저장 버튼 클릭 → `PUT /notes/:id` 요청 → 확정
- 노트 이탈 또는 취소 → draft tags 조용히 폐기, 서버 상태로 복원 (경고 없음)
- 기존 제목/본문 전환 패턴과 동일 (`useEffect`로 덮어씀)

## 태그 검증 (Tag Validation)

태그 추가 시 적용되는 규칙 집합.

- 결과 타입: `{ ok: true } | { ok: false; reason: string }`
- 현재 `reason` 미사용 — 알림 컴포넌트 없음
- maxTags 초과 → 입력란 비활성화 / maxTagLength 초과 → input 속성으로 차단
- 알림 컴포넌트 추가 시 `reason` 전달로 확장 (TagInput 인터페이스 변경 불필요)

## 설정 (Settings)

사용자가 앱 동작 값을 변경할 수 있는 기능. 현재 미구현.

- `SettingsPanel` — 설정 변경 UI 컴포넌트
- `SettingsContext` — 설정값 전역 저장소 (`createContext` + `useSettings` hook)
- 추가 시 TagInput이 props 대신 `useSettings()`로 maxTags/maxTagLength 읽음
