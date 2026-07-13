# Phase 4-2. 기록 저장

## 목표

- 플레이 기록(점수, 도달 스테이지, 일시) 로컬 저장

## 설계

- `localStorage`의 `pang_scores` 키에 플레이 기록 배열을 JSON으로 저장. 각 기록은 `{ score, stageReached, result, playedAt }` 형태
  - `stageReached`: 몇 번째 스테이지까지 도달했는지 (게임 오버 시 죽은 스테이지, 클리어 시 마지막 스테이지)
  - `result`: `'clear' | 'gameover'`
  - `playedAt`: 게임 종료 시각(ISO 문자열)
- 기록은 최대 50개까지만 보관 (점수 내림차순 정렬 후 상위 50개 유지), 오래되고 낮은 기록은 자동으로 잘림
- 기존 `pang_high_score` 단일 값 대신 기록 배열에서 최고 점수를 계산 (하위 호환 불필요, 아직 배포 전이라 마이그레이션 생략)
