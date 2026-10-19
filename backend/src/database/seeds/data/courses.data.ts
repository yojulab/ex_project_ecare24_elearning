export interface CourseVideoSeedItem {
  title: string;
  source: 'HEYGEN' | 'YOUTUBE_EMBED' | 'OWN_HLS' | 'VIMEO';
  externalRef: string;
  originalUrl: string;
  embedUrl: string;
  durationSeconds: number;
  displayOrder: number;
  isPreview: boolean;
}

export interface CurriculumStepSeedItem {
  stepNumber: number;
  stepType: 'THEORY_TEXT' | 'PRACTICAL_VIDEO' | 'MOCK_EXAM' | 'FINAL_EXAM';
  title: string;
  durationMinutes: number;
  description: string;
  contentUrl?: string;
  audioTtsText?: string;
  passScore?: number;
}

export interface CourseSeedItem {
  id: string; // 고정 UUID
  categoryId?: number;
  courseType: 'MAIN' | 'TRACK';
  title: string;
  targetDisease: string;
  summary: string;
  price: number;
  theoryHours: number;
  practicalHours: number;
  practicumHours: number;
  snubhCreditCapHours: number;
  qualificationName: string;
  isPublished: boolean;
  studyPeriodDays: number;
  steps: CurriculumStepSeedItem[];
  videos: CourseVideoSeedItem[];
}

export const SEED_COURSES: CourseSeedItem[] = [
  // 1. 메인 단일 교육과정 (총 240시간 규격: 160h 이론실기 + 80h 현장실습)
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    courseType: 'MAIN',
    title: '돌봄종사자양성자 정규 통합과정',
    targetDisease: '노인성 만성질환 및 16대 표준 질환군 전반',
    summary: '보건복지부 요양보호사 표준 교재 및 임상 의료 현장의 기준에 맞춘 총 240시간(이론 100h + 실기 60h + 현장실습 80h) 공인 돌봄종사자 양성과정',
    price: 350000,
    theoryHours: 100,
    practicalHours: 60,
    practicumHours: 80,
    snubhCreditCapHours: 50.0,
    qualificationName: '공인 돌봄종사자 (한국돌봄종사자양성교육원 수료)',
    isPublished: true,
    studyPeriodDays: 180,
    steps: [
      {
        stepNumber: 1,
        stepType: 'THEORY_TEXT',
        title: '제1단계: 기본간병 및 16대 질환 임상 이론',
        durationMinutes: 6000,
        description: '병태생리 이해, 노인복지 법규 및 위험 징후(Red Flag) 감별 이론 교안',
      },
      {
        stepNumber: 2,
        stepType: 'PRACTICAL_VIDEO',
        title: '제2단계: 10대 골든 룰 핵심 실기 시뮬레이션',
        durationMinutes: 3600,
        description: '체위변경, L-tube 피딩, 유린백 거치, 석션 안전 수칙 실습 VOD',
      },
      {
        stepNumber: 3,
        stepType: 'MOCK_EXAM',
        title: '제3단계: 디지털 OMR 모의고사 CBT',
        durationMinutes: 60,
        description: '문제은행 랜덤 출제 및 3초 자동저장 오답노트 모의평가',
        passScore: 60,
      },
      {
        stepNumber: 4,
        stepType: 'FINAL_EXAM',
        title: '제4단계: 임상간호사 80h 현장실습 평가',
        durationMinutes: 4800,
        description: '협약 요양병원 배치 10일간 실습 및 임상간호사 10대 항목 실습평가서 심사',
        passScore: 80,
      },
    ],
    videos: [
      {
        title: '돌봄종사자 양성과정 오리엔테이션 및 임상 첫걸음 (HeyGen AI 전문강사)',
        source: 'HEYGEN',
        externalRef: '1-15-1ea6d589354cb4aadd79a0ce6c9887a9',
        originalUrl: 'https://app.heygen.com/videos/1-15-1ea6d589354cb4aadd79a0ce6c9887a9',
        embedUrl: 'https://app.heygen.com/embeds/1-15-1ea6d589354cb4aadd79a0ce6c9887a9',
        durationSeconds: 185,
        displayOrder: 1,
        isPreview: true, // 비로그인 무료 미리보기 허용
      },
      {
        title: '환자 안전을 지키는 간병 10대 골든 룰 실기 개요 (HeyGen AI 전문강사)',
        source: 'HEYGEN',
        externalRef: '1-15-ff12fa129347edd33a1cd0325cc13ac7',
        originalUrl: 'https://app.heygen.com/videos/1-15-ff12fa129347edd33a1cd0325cc13ac7',
        embedUrl: 'https://app.heygen.com/embeds/1-15-ff12fa129347edd33a1cd0325cc13ac7',
        durationSeconds: 210,
        displayOrder: 2,
        isPreview: true,
      },
    ],
  },

  // 2. 16대 질환군 전문 자격 트랙 (각 총 8시간: 이론 4h + 실기 4h)
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    categoryId: 1,
    courseType: 'TRACK',
    title: '신경계 질환 전문간병사 (뇌졸중/파킨슨 케어 8시간)',
    targetDisease: '뇌졸중 편마비, 파킨슨병 보행장애, 연하곤란',
    summary: '뇌졸중 편마비 환자의 탈건착환 원칙, 파킨슨 동결보행 완화, 연하재활 식이보조 8시간 특화 트랙',
    price: 120000,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    qualificationName: '환자질환별전문간병사 (신경계)',
    isPublished: true,
    studyPeriodDays: 90,
    steps: [
      {
        stepNumber: 1,
        stepType: 'THEORY_TEXT',
        title: '신경계 병태생리 및 뇌졸중 급성기 이상징후 (4시간)',
        durationMinutes: 240,
        description: 'FAST 응급 징후 판별, 뇌압 상승 감시, 편마비 관절 구축 예방',
      },
      {
        stepNumber: 2,
        stepType: 'PRACTICAL_VIDEO',
        title: '편마비 이동보조 및 탈건착환 실기 시뮬레이션 (4시간)',
        durationMinutes: 240,
        description: '마비측 지지 기립, 휠체어 30도 접근 이동, 상하의 탈건착환 실습',
      },
    ],
    videos: [
      {
        title: '신경계 전문돌봄 오리엔테이션',
        source: 'HEYGEN',
        externalRef: '1-15-1ea6d589354cb4aadd79a0ce6c9887a9',
        originalUrl: 'https://app.heygen.com/videos/1-15-1ea6d589354cb4aadd79a0ce6c9887a9',
        embedUrl: 'https://app.heygen.com/embeds/1-15-1ea6d589354cb4aadd79a0ce6c9887a9',
        durationSeconds: 185,
        displayOrder: 1,
        isPreview: true,
      },
    ],
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    categoryId: 5,
    courseType: 'TRACK',
    title: '소화기·간담도 질환 전문간병사 (L-tube/PEG 피딩 케어 8시간)',
    targetDisease: '경관유동식(L-tube), 위루관(PEG), 장루(Stoma)',
    summary: '비위관 주입 시 흡인성 폐렴 예방 상체 30~45도 거치 및 위루관 소독, 장루백 교체 8시간 특화 트랙',
    price: 120000,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    qualificationName: '환자질환별전문간병사 (소화기계)',
    isPublished: true,
    studyPeriodDays: 90,
    steps: [
      {
        stepNumber: 1,
        stepType: 'THEORY_TEXT',
        title: '경관영양 프로토콜 및 복부팽만 위험 감지 (4시간)',
        durationMinutes: 240,
        description: '위 잔류량 확인 수칙, 설사/구토 시 대처법, 튜브 고정법',
      },
      {
        stepNumber: 2,
        stepType: 'PRACTICAL_VIDEO',
        title: 'L-tube 피딩 및 위루관 소독 실기 시뮬레이션 (4시간)',
        durationMinutes: 240,
        description: '반좌위 유지, 주입속도 조절, 주입 후 30분 관찰 실기',
      },
    ],
    videos: [
      {
        title: '10대 골든 룰 실기 개요 - L-tube 피딩 안전',
        source: 'HEYGEN',
        externalRef: '1-15-ff12fa129347edd33a1cd0325cc13ac7',
        originalUrl: 'https://app.heygen.com/videos/1-15-ff12fa129347edd33a1cd0325cc13ac7',
        embedUrl: 'https://app.heygen.com/embeds/1-15-ff12fa129347edd33a1cd0325cc13ac7',
        durationSeconds: 210,
        displayOrder: 1,
        isPreview: true,
      },
    ],
  },
  {
    id: 'a0000000-0000-0000-0000-000000000004',
    categoryId: 6,
    courseType: 'TRACK',
    title: '비뇨기·신장 질환 전문간병사 (유치도뇨관/투석 케어 8시간)',
    targetDisease: '유치도뇨관(Foley), 투석 동정맥루(AVF), 만성신부전',
    summary: '유린백 방광 하단 유지 원칙과 수분 섭취제한, 투석 혈관 진동(Thrill) 촉지 8시간 특화 트랙',
    price: 120000,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    qualificationName: '환자질환별전문간병사 (비뇨기계)',
    isPublished: true,
    studyPeriodDays: 90,
    steps: [
      {
        stepNumber: 1,
        stepType: 'THEORY_TEXT',
        title: '도뇨관 감염(CAUTI) 예방 및 투석환자 식이수칙 (4시간)',
        durationMinutes: 240,
        description: '요로감염 증상 식별, 유린백 배출법, 체중/부종 기록법',
      },
      {
        stepNumber: 2,
        stepType: 'PRACTICAL_VIDEO',
        title: '유린백 안전 거치 및 비우기 실기 시뮬레이션 (4시간)',
        durationMinutes: 240,
        description: '침상 프레임 하단 거치, 소독용 솜 배출구 청결, 소변량 계량 실기',
      },
    ],
    videos: [],
  },
];
