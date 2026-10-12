# AGENTS.md — 에이전트 팀 행동 강령 및 표준 지침

본 워크스페이스는 [GEMINI.md](file:///apps/project_ecare24_elearning/GEMINI.md), [.agents/rules/harness-engineering.md](file:///apps/project_ecare24_elearning/.agents/rules/harness-engineering.md), [.agents/rules/ecare24-domain.md](file:///apps/project_ecare24_elearning/.agents/rules/ecare24-domain.md), [.agents/rules/git-workflow.md](file:///apps/project_ecare24_elearning/.agents/rules/git-workflow.md)에 정의된 하네스 엔지니어링 체계를 따릅니다.

---

## 1. 에이전트 필수 준수 사항

1. **상시 룰 참조**: 작업을 시작하기 전 반드시 [GEMINI.md](file:///apps/project_ecare24_elearning/GEMINI.md), 도메인 룰([.agents/rules/ecare24-domain.md](file:///apps/project_ecare24_elearning/.agents/rules/ecare24-domain.md)), Git 워크플로우 룰([.agents/rules/git-workflow.md](file:///apps/project_ecare24_elearning/.agents/rules/git-workflow.md))을 준수한다.
2. **기획/아키텍처 단계 준수 (비개발 원칙)**:
   - **본 단계에서는 소스코드 개발을 진행하지 않습니다.**
   - 아키텍처 다이어그램, DDL 스키마, WBS, 인터페이스 명세, 테스트 시나리오 기획에 집중합니다.
3. **알맞은 업무 종료 시 Git Commit 필수화**:
   - 모든 에이전트는 기획/아키텍처 문서 생성, 스펙 갱신, 검증 완료 등 유의미한 작업 단위 완료 시 **반드시 원자적 Git Commit을 수행**한다.
   - 커밋 메시지 컨벤션을 준수하며, `.env` 등 민감 파일이 스테이징되지 않도록 사전 점검한다.
4. **역할과 스킬의 분리**:
   - 에이전트는 본인의 정의된 책임(Who) 범위를 벗어나지 않는다.
   - 구체적인 실행 절차(How)는 `.agents/skills/`에 정의된 스킬 가이드를 따른다.
5. **루프 엔지니어링과 상태 영속화**:
   - 반복 루프 작업 수행 시 세션 메모리에 의존하지 않고, 항상 디스크의 상태 파일([.agents/loop/state.json](file:///apps/project_ecare24_elearning/.agents/loop/state.json), [.agents/loop/task.md](file:///apps/project_ecare24_elearning/.agents/loop/task.md))과 Git 커밋에 진행 상황을 원자적으로 기록한다.
   - 사전에 정의된 검증 기준과 완료 약속(Completion Promise)이 기계적으로 입증되었을 때에만 약속 토큰을 출력하고 종료한다.
6. **무한 폴링 금지**:
   - 백그라운드 태스크나 메시지를 기다릴 때 루프를 돌며 상태를 조회하지 않는다. Antigravity의 반응형 웨이크업(Reactive Wakeup) 시스템에 맡기고 도구 호출을 종료한다.
7. **자가 진화 참여**:
   - 작업 완료 후 오류 패턴이나 사용자 피드백이 발생하면 [harness-evolve](file:///apps/project_ecare24_elearning/.agents/skills/harness-evolve/SKILL.md) 스킬을 통해 시스템 지식으로 일반화하여 환류한다.
