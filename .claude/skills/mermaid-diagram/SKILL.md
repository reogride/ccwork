---
name: mermaid-diagram
classification: workflow
classification-reason: "순차적 분석 → 생성 → 실행 단계로 구성된 워크플로우"
deprecation-risk: none
effort: low
description: |
  src/ 디렉토리를 분석하여 Mermaid 다이어그램이 포함된 HTML을 생성하고 브라우저로 실행.
  컴포넌트 의존성 그래프, 상태 흐름, Data Flow(시퀀스), State Map(상태 전이) 4개 다이어그램 시각화.
  Triggers: /mermaid-diagram
  Keywords: 아키텍처 시각화, 컴포넌트 의존성, 상태흐름, data flow, state map, mermaid, architecture, diagram
argument-hint: "출력 경로 (기본값: docs/architecture/index.html)"
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - Bash
---

# mermaid-diagram 스킬

## 목적

`src/` 디렉토리를 분석하여 두 가지 Mermaid 다이어그램이 담긴 HTML 파일을 생성하고 브라우저로 열기.

## 실행 단계

### Step 1. src/ 분석

- `Glob("src/**/*.{tsx,ts}")` 로 전체 파일 목록 수집
- 각 파일의 import 구문 추출 → 의존성 맵 구성
- Context 소비(`useXxx` 훅) 관계 파악
- `useState` / Context 소유 위치 파악 → 상태 소유자 목록 구성

### Step 2. 다이어그램 설계

**Diagram A — 컴포넌트 의존성 (graph TD)**
- 파일 → 파일 import 관계 (실선)
- Context hook 소비 관계 (점선)
- 외부 시스템(JSON Server, db.json) 포함
- 노드 그룹: `subgraph` 로 api / components / context / types 분류

**Diagram B — 상태 흐름 (flowchart LR)**
- 상태 소유자(App, Context) 표시
- 상태가 props/hook으로 흐르는 방향
- API 호출 → 로컬 상태 업데이트 흐름
- 이벤트 핸들러(onSelect, onDone 등) 역방향 흐름

**Diagram C — Data Flow (sequenceDiagram)**
- 사용자 액션(클릭/입력) → 컴포넌트 → Context → API → JSON Server 순서
- 응답 역방향: JSON Server → API → Context 상태 업데이트 → 리렌더
- CRUD 4개 시나리오(fetch/create/update/delete) 각각 표현
- `loop` / `alt` 블록으로 로딩·에러 분기 표시

**Diagram D — State Map (stateDiagram-v2)**
- 앱 전체 UI 상태 전이: `idle` → `creating` / `editing` → `saving` → `idle`
- `loading` / `error` 상태 포함
- NotesContext `notes[]` 배열 변화 트리거(addNote/editNote/removeNote)와 전이 연결
- 각 전이에 트리거 이벤트명 레이블

### Step 3. HTML 생성

출력 경로: `docs/architecture/index.html` (인수로 변경 가능)

- Mermaid CDN 사용 (`https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js`)
- 탭 UI로 4개 다이어그램 전환 (A: 컴포넌트 의존성 / B: 상태 흐름 / C: Data Flow / D: State Map)
- 라이트/다크 테마 토글 버튼
- 반응형 레이아웃

#### ⚠️ Mermaid 탭 렌더링 필수 패턴

`display: none` 패널에서 Mermaid를 렌더링하면 크기 계산 실패 → `translate(undefined, NaN)` 오류 발생.
반드시 아래 패턴 사용:

```js
// 1. startOnLoad: false 필수
mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });

// 2. 각 .mermaid 요소의 원본 코드를 data-src에 보존
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.mermaid').forEach(el => {
    el.setAttribute('data-src', el.textContent.trim());
  });
  renderPanel('첫번째탭ID'); // 첫 탭만 렌더
});

// 3. 렌더된 탭 추적 — 탭 전환 시 미렌더 탭만 처리
const rendered = new Set();
function renderPanel(id) {
  if (rendered.has(id)) return;
  rendered.add(id);
  const nodes = document.getElementById('tab-' + id).querySelectorAll('.mermaid');
  mermaid.run({ nodes: Array.from(nodes) });
}

// 4. 테마 전환 시 원본 코드 복원 후 현재 탭만 재렌더
function toggleTheme() {
  rendered.clear();
  document.querySelectorAll('.mermaid').forEach(el => {
    el.textContent = el.getAttribute('data-src');
    el.removeAttribute('data-processed');
  });
  // mermaid.initialize() 후 현재 활성 탭 renderPanel() 호출
}
```

### Step 4. 브라우저 실행

OS 감지 후 자동 실행:
- Windows: `start docs/architecture/index.html`
- Mac: `open docs/architecture/index.html`
- Linux: `xdg-open docs/architecture/index.html`

## 참고 파일

- `src/App.tsx` — 최상위 상태(selectedNoteId, isCreating)
- `src/context/NotesContext.tsx` — 전역 상태 + CRUD 핸들러
- `src/api/notes.ts` — REST API 레이어
- `src/components/` — UI 컴포넌트
- `CLAUDE.md` — 프로젝트 네이밍/패턴 규칙
