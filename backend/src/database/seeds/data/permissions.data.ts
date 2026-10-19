export interface PermissionItem {
  code: string;
  groupName: string;
  nameKo: string;
  description: string;
  displayOrder: number;
}

export const SEED_PERMISSIONS: PermissionItem[] = [
  // 1. 공통 / 대시보드
  {
    code: 'ADMIN_PORTAL_ACCESS',
    groupName: '공통',
    nameKo: '관리자 포털 접속',
    description: '관리자 웹 포털(:30011)에 로그인하고 진입할 수 있는 기본 권한',
    displayOrder: 10,
  },
  {
    code: 'DASHBOARD_VIEW',
    groupName: '공통',
    nameKo: '통합 대시보드 조회',
    description: 'KPI 지표, 실시간 현황 카드, 대기 큐 통계 열람',
    displayOrder: 20,
  },

  // 2. 수강생 관리
  {
    code: 'STUDENT_READ',
    groupName: '수강생',
    nameKo: '수강생 목록/상세 조회',
    description: '수강생 프로필, 수강 이력, 진도율 목록 조회',
    displayOrder: 30,
  },
  {
    code: 'STUDENT_WRITE',
    groupName: '수강생',
    nameKo: '수강생 정보 수정',
    description: '수강생 기본정보 수정, 상태 변경 (활성/잠금/휴면)',
    displayOrder: 40,
  },
  {
    code: 'STUDENT_PII_UNMASK',
    groupName: '수강생',
    nameKo: '수강생 개인정보 마스킹 해제',
    description: '전화번호, 주민번호 등 민감정보 마스킹 해제 열람 (사유 기록 및 감사로그 대상)',
    displayOrder: 50,
  },
  {
    code: 'ENROLLMENT_MANAGE',
    groupName: '수강생',
    nameKo: '수강 등록/기간 연장 관리',
    description: '수강생 과정 수동 등록, 수강 기한 연장, 수강 취소',
    displayOrder: 60,
  },

  // 3. 교육 과정 & 영상
  {
    code: 'COURSE_READ',
    groupName: '과정관리',
    nameKo: '교육과정/트랙 조회',
    description: '단일 과정 및 16대 질환군 트랙 상세/차시 목록 조회',
    displayOrder: 70,
  },
  {
    code: 'COURSE_WRITE',
    groupName: '과정관리',
    nameKo: '교육과정 생성/수정',
    description: '과정 정보, 트랙, 이수시간 규격, 게시 여부 변경',
    displayOrder: 80,
  },
  {
    code: 'VIDEO_MANAGE',
    groupName: '과정관리',
    nameKo: '교육 영상(HeyGen/YouTube) 관리',
    description: '차시별 영상 등록, HeyGen 임베드 URL 바인딩, 미리보기 설정',
    displayOrder: 90,
  },
  {
    code: 'EXAM_MANAGE',
    groupName: '과정관리',
    nameKo: 'CBT 문제은행 관리',
    description: 'CBT 시험 문항 등록/수정, 임상 검수 승인, 정답/해설 관리',
    displayOrder: 100,
  },

  // 4. 납부 / 환불
  {
    code: 'PAYMENT_READ',
    groupName: '납부관리',
    nameKo: '수강료 결제/입금 내역 조회',
    description: '무통장 입금대기, 입금완료, 결제 상세 내역 조회',
    displayOrder: 110,
  },
  {
    code: 'PAYMENT_CONFIRM',
    groupName: '납부관리',
    nameKo: '무통장 입금확인 승인',
    description: '입금 내역 대조 후 수동 입금확인 처리 (수강 활성화 자동 연동)',
    displayOrder: 120,
  },
  {
    code: 'PAYMENT_REFUND',
    groupName: '납부관리',
    nameKo: '환불 승인 및 처리',
    description: '수강생 환불 요청 검토, 환불액 산정, 승인/반려',
    displayOrder: 130,
  },

  // 5. 실습 & 간호사 평가
  {
    code: 'PRACTICUM_REVIEW',
    groupName: '실습자격',
    nameKo: '현장 실습일지 검토/승인',
    description: '수강생이 제출한 모바일 실습일지 및 사진 검토 승인',
    displayOrder: 140,
  },
  {
    code: 'NURSE_EVAL_WRITE',
    groupName: '실습자격',
    nameKo: '임상간호사 현장 실습평가서 작성',
    description: '간호사 10대 골든 룰 임상 채점표 작성 및 Pass 판정 (간호사 전용)',
    displayOrder: 150,
  },

  // 6. 자격증 관리
  {
    code: 'CERT_REVIEW',
    groupName: '자격증',
    nameKo: '자격증 발급 신청 심사',
    description: '이론 수료 + 간호사 평가 Pass 적격성 심사 및 승인/반려',
    displayOrder: 160,
  },
  {
    code: 'CERT_ISSUE',
    groupName: '자격증',
    nameKo: '공인 자격증 발급 처리',
    description: '직능원 등록번호 부여, QR 위변조 방지 토큰 및 PDF 생성',
    displayOrder: 170,
  },
  {
    code: 'CERT_REVOKE',
    groupName: '자격증',
    nameKo: '자격증 취소/만료 처리',
    description: '부정행위 또는 갱신 미이수 자격증 효력 정지/취소',
    displayOrder: 180,
  },

  // 7. 콜센터 CS
  {
    code: 'COUNSEL_HANDLE',
    groupName: '콜센터',
    nameKo: '콜센터 CTI 상담 처리',
    description: '인입 전화 매칭, 상담 티켓 작성, 템플릿 안내 발송 (Alt+1~3, Alt+S)',
    displayOrder: 190,
  },
  {
    code: 'COUNSEL_READ_ALL',
    groupName: '콜센터',
    nameKo: '전체 상담 이력/통계 조회',
    description: '상담원별 실적, 미처리 상담 큐, 통화 메모 전수 조회',
    displayOrder: 200,
  },

  // 8. 공지 / 팝업
  {
    code: 'NOTICE_MANAGE',
    groupName: '공지팝업',
    nameKo: '공지사항 관리',
    description: '수강생 포털 공지사항 등록, 수정, 고정 공지 설정',
    displayOrder: 210,
  },
  {
    code: 'POPUP_MANAGE',
    groupName: '공지팝업',
    nameKo: '팝업 공지 관리',
    description: '로그인/홈 팝업 등록, 기간/위치/대상 설정, 긴급 공지 제어',
    displayOrder: 220,
  },

  // 9. 시스템 / 감사
  {
    code: 'PERMISSION_MANAGE',
    groupName: '시스템',
    nameKo: '관리자 권한 매트릭스 관리',
    description: '관리자별 권한 리스트 부여/회수, 권한 묶음 복사',
    displayOrder: 230,
  },
  {
    code: 'AUDIT_READ',
    groupName: '시스템',
    nameKo: '보안 감사로그 조회',
    description: '개인정보 열람, 권한 변경, 주요 상태 전이 감사로그 열람',
    displayOrder: 240,
  },
  {
    code: 'SYSTEM_SETTING',
    groupName: '시스템',
    nameKo: '기관 운영 설정 관리',
    description: '입금계좌, 고객센터 연락처, 교육원 기본정보 설정',
    displayOrder: 250,
  },
];
