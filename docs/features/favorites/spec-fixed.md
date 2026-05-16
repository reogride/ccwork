# 즐겨찾기 기능 확정 스펙

## 데이터 모델

- `Note` 타입에 `isFavorited: boolean` 필드 추가
- 저장소: DB (`PUT /notes/:id`) — `editNote` 재활용
- 신규 노트: API 레이어에서 `isFavorited: false` 자동 주입
- 기존 데이터: `db.json` 수동 업데이트 (`isFavorited: false`)

## UI

- 사이드바 상단 탭: `[모든 노트]` / `[⭐ 즐겨찾기]`
- 즐겨찾기 토글: NoteItem 내 ☆/⭐ 아이콘 클릭
- 즐겨찾기 탭 빈 상태: "즐겨찾기한 노트가 없습니다" 안내 메시지 표시
- 즐겨찾기 탭에서도 삭제 버튼 노출 (NoteItem 재사용)

## 동작 규칙

- ☆ 해제 시: 노트가 즐겨찾기 탭에서 사라지나 에디터는 그대로 유지
- "+ 새 노트" 클릭 시: 현재 탭 무관하게 "모든 노트" 탭으로 자동 전환
- 삭제 확인: 커스텀 모달 (`ConfirmModal`) — 앱 전체 적용

## 참고

- 원본 요구사항: `spec-original.md`
