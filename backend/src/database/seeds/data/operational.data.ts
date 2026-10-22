export interface StudentUserSeedItem {
  loginId: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  userType: 'STUDENT' | 'STAFF';
  password: string;
}

export const SEED_USERS: StudentUserSeedItem[] = [
  {
    loginId: 'student01',
    fullName: '김영희',
    phoneNumber: '010-9876-5432',
    email: 'younghee.kim@caregiver24.kr',
    userType: 'STUDENT',
    password: 'password123!',
  },
  {
    loginId: 'student02',
    fullName: '박철수',
    phoneNumber: '010-1234-5678',
    email: 'chulsoo.park@caregiver24.kr',
    userType: 'STUDENT',
    password: 'password123!',
  },
  {
    loginId: 'counselor01',
    fullName: '이수진 상담원',
    phoneNumber: '010-5555-6666',
    email: 'cs.lee@ecare24.kr',
    userType: 'STAFF',
    password: 'counselor1234!',
  },
];

export interface SeedCertificateItem {
  id: string;
  certificateNo: string;
  registryNo: string;
  studentLoginId: string;
  courseId: string;
  categoryId?: number;
  qualificationName: string;
  grade: string;
  score: number;
  qrVerifyToken: string;
  status: 'VALID' | 'RENEWAL_DUE' | 'EXPIRED' | 'REVOKED';
}

export const SEED_CERTIFICATES: SeedCertificateItem[] = [
  {
    id: 'd0000000-0000-0000-0000-000000000001',
    certificateNo: 'EC24-CERT-2026-00892',
    registryNo: 'PQI-2026-0892',
    studentLoginId: 'student01',
    courseId: 'a0000000-0000-0000-0000-000000000001', // 트랙 1: 호흡기계
    categoryId: 1,
    qualificationName: '환자 질환별 전문간병사 (호흡기계·폐질환자)',
    grade: '전문간병사 1급',
    score: 92,
    qrVerifyToken: 'QR-TOKEN-EC24-2026-PULMONARY-892',
    status: 'VALID',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000002',
    certificateNo: 'EC24-CERT-2026-00104',
    registryNo: 'PQI-2026-0104',
    studentLoginId: 'student01',
    courseId: 'a0000000-0000-0000-0000-000000000002', // 트랙 2: 치매
    categoryId: 2,
    qualificationName: '환자 질환별 전문간병사 (인지·정신·치매)',
    grade: '전문간병사 1급',
    score: 95,
    qrVerifyToken: 'QR-TOKEN-EC24-2026-DEMENTIA-104',
    status: 'VALID',
  },
];

export interface SeedCertApplicationItem {
  id: string;
  studentLoginId: string;
  courseId: string;
  eligibilityBasis: string;
  status: 'SUBMITTED' | 'DOC_CHECK' | 'NURSE_EVAL' | 'REVIEW' | 'ISSUED' | 'REJECTED';
}

export const SEED_CERT_APPLICATIONS: SeedCertApplicationItem[] = [
  {
    id: 'e0000000-0000-0000-0000-000000000001',
    studentLoginId: 'student01',
    courseId: 'a0000000-0000-0000-0000-000000000003', // 트랙 3: 근골격계
    eligibilityBasis: '요양보호사 1급 소지자 및 8h 이수',
    status: 'DOC_CHECK',
  },
];

export interface SeedInquiryItem {
  id: string;
  studentLoginId: string;
  category: string;
  title: string;
  content: string;
  status: 'OPEN' | 'ANSWERED' | 'CLOSED';
  answer?: string;
}

export const SEED_INQUIRIES: SeedInquiryItem[] = [
  {
    id: 'f0000000-0000-0000-0000-000000000001',
    studentLoginId: 'student01',
    category: 'COURSE',
    title: '임상간호사 80h 실습평가서 제출 기한 문의드립니다.',
    content: '현재 협약 요양병원에서 7일차 실습을 진행 중입니다. 10일차 종료 후 실습평가서 원본은 언제까지 마이페이지에 업로드해야 다음 회차 자격증 심사에 반영되나요?',
    status: 'ANSWERED',
    answer: '안녕하세요 김영희 수강생님. 실습 종료일로부터 7일 이내에 수간호사 서명이 날인된 평가서 스캔본을 마이페이지에 등록해 주시면, 매주 화요일 정기 자격심사를 통해 즉시 자격증이 발급됩니다. 감사합니다.',
  },
  {
    id: 'f0000000-0000-0000-0000-000000000002',
    studentLoginId: 'student01',
    category: 'CERT',
    title: '신경계 전문자격증 실물 원본 우편 수령 가능한가요?',
    content: '모바일 및 웹 PDF 출력 외에, 직능원 등록 금박 하드커버 실물 자격증 원본을 우편으로 신청하고 싶습니다. 신청 방법 안내 부탁드립니다.',
    status: 'OPEN',
  },
];

export interface SeedCounselingTicketItem {
  id: string;
  studentLoginId: string;
  callerNumber: string;
  category: 'COURSE_INQUIRY' | 'CERT_VERIFICATION' | 'PATIENT_MATCHING' | 'REFUND' | 'TECHNICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  subject: string;
  memo: string;
  durationSeconds: number;
}

export const SEED_COUNSELING_TICKETS: SeedCounselingTicketItem[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    studentLoginId: 'student01',
    callerNumber: '010-9876-5432',
    category: 'COURSE_INQUIRY',
    status: 'RESOLVED',
    subject: '요양병원 임상실습 일정 및 출근 시간 확인',
    memo: '분당 협약병원 돌봄간호팀 배정 일정 확인. 오전 9시 출근 및 간호부 예비소집 안내 완료.',
    durationSeconds: 184,
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    studentLoginId: 'student02',
    callerNumber: '010-1234-5678',
    category: 'COURSE_INQUIRY',
    status: 'RESOLVED',
    subject: '돌봄종사자 경력자 축소과정(80h) 신청 자격 문의',
    memo: '간호조무사 자격증 취득 3년차 대상 경력자 감면 80h 과정 입과 조건 안내. 증빙서류 팩스 안내.',
    durationSeconds: 245,
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    studentLoginId: 'student01',
    callerNumber: '010-9876-5432',
    category: 'CERT_VERIFICATION',
    status: 'RESOLVED',
    subject: '무통장 입금 확인 완료 안내 콜',
    memo: '신한은행 계좌 350,000원 입금 정상 승인 처리 및 마이페이지 동영상 즉시 시청 가능 안내 완료.',
    durationSeconds: 95,
  },
];
