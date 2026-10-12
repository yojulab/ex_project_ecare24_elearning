// ============================================================================
// @ecare24/types: eCare24 이러닝 도메인 공통 인터페이스 및 타입 정의
// ============================================================================

export type UserRole = 'STUDENT' | 'AGENT' | 'ADMIN' | 'SUPERVISOR' | 'REVIEWER';

export type StepType = 'THEORY_TEXT' | 'PRACTICAL_VIDEO' | 'MOCK_EXAM' | 'FINAL_EXAM';

export type CertStatus = 'VALID' | 'RENEWAL_DUE' | 'EXPIRED' | 'REVOKED';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export type CallCategory = 'COURSE_INQUIRY' | 'CERT_VERIFICATION' | 'PATIENT_MATCHING' | 'REFUND' | 'TECHNICAL';

export type CurationGrade = 'A' | 'B' | 'C' | 'X';

// 16대 질환군 코드
export type DiseaseCode =
  | '01_NEURO'
  | '02_RESP'
  | '03_CARDIO'
  | '04_ORTHO'
  | '05_GASTRO'
  | '06_URO'
  | '07_ENDO'
  | '08_ONCO'
  | '09_PSYCH'
  | '10_INFECT'
  | '11_ICU'
  | '12_TRAUMA'
  | '13_GERIATRIC'
  | '14_HOSPICE'
  | '15_PEDIATRIC'
  | '16_AIRWAY';

// 16대 질환군 마스터
export interface DiseaseCategory {
  id: number;
  code: DiseaseCode;
  nameKo: string;
  shortDesc: string;
  iconName: string;
  isMvp: boolean;
  coreCarePoints: string[];
  theoryHours: number;
  practicalHours: number;
  practicumHours: number;
  totalRequiredHours: number;
  snubhCreditCapHours: number;
}

// 4단계 과정 세부 스텝
export interface CurriculumStep {
  id: string;
  stepNumber: number; // 1, 2, 3, 4
  stepType: StepType;
  title: string;
  durationMinutes: number;
  description: string;
  contentUrl?: string;
  audioTtsText?: string;
  passScore?: number;
}

// 교육 과정
export interface Course {
  id: string;
  categoryId: number;
  categoryCode: DiseaseCode;
  title: string;
  targetDisease: string;
  summary: string;
  price: number;
  theoryHours: number;
  practicalHours: number;
  practicumHours: number;
  totalHours: number;
  snubhCreditCapHours: number;
  qualificationName: string;
  isMvp: boolean;
  steps: CurriculumStep[];
}

// 간병 임상 전문 용어
export interface CaregiverTerm {
  term: string;
  standardTerm: string;
  category: string;
  definition: string;
  carePoint: string;
  warningAlert?: string;
}

// CBT 문항
export interface ExamQuestion {
  id: string;
  categoryId: number;
  questionNumber: number;
  title: string;
  scenario?: string; // 임상 케이스
  options: { no: number; text: string }[];
  correctAnswer: number;
  explanation: string;
  carePointTag: string; // 예: "탈건착환의 원칙", "유린백 방광 하단 거치"
}

// 디지털 자격증
export interface Certificate {
  id: string;
  certificateNo: string; // 예: "EC24-2026-NEURO-00128"
  registryNo: string;    // 한국직업능력연구원 등록번호
  userName: string;
  birthDate: string;
  courseTitle: string;
  categoryCode: DiseaseCode;
  qualificationName: string;
  grade: string;
  score: number;
  issuedAt: string;
  expiryDate: string;
  qrVerifyToken: string;
  status: CertStatus;
}

// 콜센터 CS 고객 프로필
export interface CustomerProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  maskedPhoneNumber: string;
  birthDate: string;
  caregiverExperienceYears: number;
  hasNurseAideCert: boolean;
  nurseAideCertNo?: string;
  identityVerified: boolean;
  currentCourseId?: string;
  currentCourseTitle?: string;
  currentStep: number;
  stepProgressPercent: number; // 0 ~ 100
  totalCompletedHours: number;
  certificates: Certificate[];
}

// 콜센터 CTI 상담 티켓
export interface CounselingTicket {
  id: string;
  customerId: string;
  customerName: string;
  agentId: string;
  agentName: string;
  inboundNumber: string;
  category: CallCategory;
  status: TicketStatus;
  subject: string;
  content: string;
  durationSeconds: number;
  createdAt: string;
  updatedAt: string;
}

// YouTube / SNUBH 영상 큐레이션 메타
export interface CuratedVideo {
  id: string;
  youtubeId: string;
  title: string;
  lecturer: string;
  curationGrade: CurationGrade;
  durationSeconds: number;
  categoryCode: DiseaseCode;
  stepNumber: number;
  creditEligible: boolean;
  thumbnailUrl: string;
  viewCount?: string;
}

// 의뢰자 소통용 UI 일련번호 메타데이터
export interface UITagMeta {
  serialId: string;   // 예: "P01-SEC01-BTN01"
  pageName: string;   // 예: "홈 (16대 질환군 메인)"
  sectionName: string;// 예: "질환군 그리드"
  elementName: string;// 예: "신경계 질환군 카드 클릭"
  description: string;
}
