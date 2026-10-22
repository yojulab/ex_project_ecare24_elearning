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
  id: string;
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
  {
    "id": "a0000000-0000-0000-0000-000000000001",
    "categoryId": 1,
    "courseType": "TRACK",
    "title": "ecare24 환자 질환별 전문간병사 자격과정 - 호흡기계·폐질환자 케어 트랙",
    "targetDisease": "만성폐쇄성폐질환(COPD), 폐렴(Pneumonia), 기관지천식(Asthma), 폐색전증, 기관지확장증, 폐결핵, 급/만성 호흡부전",
    "summary": "환자 질환별 전문간병사 (호흡기계·폐질환자) 공식 교육과정. 제1장. 호흡기계 해부생리 및 주요 폐질환의 특성 등 5대 챕터 정규 교안, 폐질환자 전문간병사 교육 · 윤서연 강사 (1분 15초) VOD, 실전 모의고사 30문항, 정규 자격검정 30문항 완비.",
    "price": 120000,
    "theoryHours": 4,
    "practicalHours": 4,
    "practicumHours": 0,
    "snubhCreditCapHours": 2,
    "qualificationName": "환자 질환별 전문간병사 (호흡기계·폐질환자)",
    "isPublished": true,
    "studyPeriodDays": 90,
    "steps": [
      {
        "stepNumber": 1,
        "stepType": "THEORY_TEXT",
        "title": "Step 1. 전문간병사 정규 교안 (5대 챕터 문구형 교안)",
        "durationMinutes": 240,
        "description": "제1장. 호흡기계 해부생리 및 주요 폐질환의 특성 / 제2장. 전문간병사의 역할과 업무 범위 (Scope of Practice) / 제3장. 호흡기 환자 일상 케어 및 체위·호흡 훈련 보조 / 제4장. 이상 징후(Red Flag) 조기 감지 및 응급 대응 / 제5장. 산소요법 및 흡인·기도관리 기구 안전 수칙"
      },
      {
        "stepNumber": 2,
        "stepType": "PRACTICAL_VIDEO",
        "title": "Step 2. 4K 실기 & 실습 시뮬레이션 (폐질환자 전문간병사 교육 · 윤서연 강사 (1분 15초))",
        "durationMinutes": 240,
        "description": "전문강사 핵심 임상 실기 VOD 및 스크립트 기반 실무 시뮬레이션"
      },
      {
        "stepNumber": 3,
        "stepType": "MOCK_EXAM",
        "title": "Step 3. 실전 모의고사 CBT (30문항)",
        "durationMinutes": 60,
        "description": "실무 임상 상황별 문제은행 30문항 및 상세 해설",
        "passScore": 60
      },
      {
        "stepNumber": 4,
        "stepType": "FINAL_EXAM",
        "title": "Step 4. 정규 자격검정 평가시험 (30문항 실시간 통과)",
        "durationMinutes": 60,
        "description": "한국직업능력연구원(pqi.or.kr) 등록 정규 자격 검정 (60점 이상 합격)",
        "passScore": 60
      }
    ],
    "videos": [
      {
        "title": "폐질환자 전문간병사 교육 · 윤서연 강사 (1분 15초)",
        "source": "HEYGEN",
        "externalRef": "1-15-1ea6d589354cb4aadd79a0ce6c9887a9",
        "originalUrl": "https://app.heygen.com/videos/1-15-1ea6d589354cb4aadd79a0ce6c9887a9",
        "embedUrl": "https://app.heygen.com/embeds/1-15-1ea6d589354cb4aadd79a0ce6c9887a9",
        "durationSeconds": 75,
        "displayOrder": 1,
        "isPreview": true
      }
    ]
  },
  {
    "id": "a0000000-0000-0000-0000-000000000002",
    "categoryId": 2,
    "courseType": "TRACK",
    "title": "ecare24 환자 질환별 전문간병사 자격과정 - 인지·정신·치매환자 케어 트랙",
    "targetDisease": "알츠하이머병(Alzheimer's Disease), 혈관성 치매, 루이소체 치매, 전두측두엽 치매, 섬망(Delirium), 경도인지장애(MCI), 노인성 우울증",
    "summary": "환자 질환별 전문간병사 (인지·정신·치매) 공식 교육과정. 제1장. 치매의 병태생리, 유형 및 인지·신체 기능 변화 등 5대 챕터 정규 교안, 치매전문간병사 교육 · 윤서연 강사 (1분 15초) VOD, 실전 모의고사 30문항, 정규 자격검정 30문항 완비.",
    "price": 120000,
    "theoryHours": 4,
    "practicalHours": 4,
    "practicumHours": 0,
    "snubhCreditCapHours": 2,
    "qualificationName": "환자 질환별 전문간병사 (인지·정신·치매)",
    "isPublished": true,
    "studyPeriodDays": 90,
    "steps": [
      {
        "stepNumber": 1,
        "stepType": "THEORY_TEXT",
        "title": "Step 1. 전문간병사 정규 교안 (5대 챕터 문구형 교안)",
        "durationMinutes": 240,
        "description": "제1장. 치매의 병태생리, 유형 및 인지·신체 기능 변화 / 제2장. 인간존엄성 중심 케어와 치료적 의사소통 기법 / 제3장. 일상생활 지원(식사·연하, 이동·낙상, 배설) 안전 지침 / 제4장. 행동심리증상(BPSD) 이해 및 비약물적 중재 / 제5장. 급성 변화(섬망·신체이상) 감지와 의료진 보고 체계"
      },
      {
        "stepNumber": 2,
        "stepType": "PRACTICAL_VIDEO",
        "title": "Step 2. 4K 실기 & 실습 시뮬레이션 (치매전문간병사 교육 · 윤서연 강사 (1분 15초))",
        "durationMinutes": 240,
        "description": "전문강사 핵심 임상 실기 VOD 및 스크립트 기반 실무 시뮬레이션"
      },
      {
        "stepNumber": 3,
        "stepType": "MOCK_EXAM",
        "title": "Step 3. 실전 모의고사 CBT (30문항)",
        "durationMinutes": 60,
        "description": "실무 임상 상황별 문제은행 30문항 및 상세 해설",
        "passScore": 60
      },
      {
        "stepNumber": 4,
        "stepType": "FINAL_EXAM",
        "title": "Step 4. 정규 자격검정 평가시험 (30문항 실시간 통과)",
        "durationMinutes": 60,
        "description": "한국직업능력연구원(pqi.or.kr) 등록 정규 자격 검정 (60점 이상 합격)",
        "passScore": 60
      }
    ],
    "videos": [
      {
        "title": "치매전문간병사 교육 · 윤서연 강사 (1분 15초)",
        "source": "HEYGEN",
        "externalRef": "1-15-ff12fa129347edd33a1cd0325cc13ac7",
        "originalUrl": "https://app.heygen.com/videos/1-15-ff12fa129347edd33a1cd0325cc13ac7",
        "embedUrl": "https://app.heygen.com/embeds/1-15-ff12fa129347edd33a1cd0325cc13ac7",
        "durationSeconds": 75,
        "displayOrder": 1,
        "isPreview": true
      }
    ]
  },
  {
    "id": "a0000000-0000-0000-0000-000000000003",
    "categoryId": 3,
    "courseType": "TRACK",
    "title": "ecare24 환자 질환별 전문간병사 자격과정 - 근골격계질환 및 수술 후 재활 케어 트랙",
    "targetDisease": "경추 및 척수손상(SCI), 요추 추간판 탈출증(허리디스크) 및 척추 수술 후 상태, 퇴행성 관절염(인공관절 치환술 TKA/THA), 고관절 골절 및 사지 골절, 골다공증, 수술 후 조기 재활",
    "summary": "환자 질환별 전문간병사 (근골격계·재활) 공식 교육과정. 제1장. 근골격계 해부생리 및 주요 질환·수술의 임상적 특성 등 5대 챕터 정규 교안, 근골격계질환 전문간병사 교육 전 오리엔테이션 (1분 50초) VOD, 실전 모의고사 30문항, 정규 자격검정 30문항 완비.",
    "price": 120000,
    "theoryHours": 4,
    "practicalHours": 4,
    "practicumHours": 0,
    "snubhCreditCapHours": 2,
    "qualificationName": "환자 질환별 전문간병사 (근골격계·재활)",
    "isPublished": true,
    "studyPeriodDays": 90,
    "steps": [
      {
        "stepNumber": 1,
        "stepType": "THEORY_TEXT",
        "title": "Step 1. 전문간병사 정규 교안 (5대 챕터 문구형 교안)",
        "durationMinutes": 240,
        "description": "제1장. 근골격계 해부생리 및 주요 질환·수술의 임상적 특성 / 제2장. 전문간병사의 역할과 절대 금기 수칙 (신체 보호 원칙) / 제3장. 보조기구 안전 관리 및 환자 이동 기술 / 제4장. 신경학적 이상 징후(Red Flags) 조기 감지와 응급 보고 체계 / 제5장. 객관적 사실 중심 기록(Fact-based) 및 다학제 협업 원칙"
      },
      {
        "stepNumber": 2,
        "stepType": "PRACTICAL_VIDEO",
        "title": "Step 2. 4K 실기 & 실습 시뮬레이션 (근골격계질환 전문간병사 교육 전 오리엔테이션 (1분 50초))",
        "durationMinutes": 240,
        "description": "전문강사 핵심 임상 실기 VOD 및 스크립트 기반 실무 시뮬레이션"
      },
      {
        "stepNumber": 3,
        "stepType": "MOCK_EXAM",
        "title": "Step 3. 실전 모의고사 CBT (30문항)",
        "durationMinutes": 60,
        "description": "실무 임상 상황별 문제은행 30문항 및 상세 해설",
        "passScore": 60
      },
      {
        "stepNumber": 4,
        "stepType": "FINAL_EXAM",
        "title": "Step 4. 정규 자격검정 평가시험 (30문항 실시간 통과)",
        "durationMinutes": 60,
        "description": "한국직업능력연구원(pqi.or.kr) 등록 정규 자격 검정 (60점 이상 합격)",
        "passScore": 60
      }
    ],
    "videos": [
      {
        "title": "근골격계질환 전문간병사 교육 전 오리엔테이션 (1분 50초)",
        "source": "HEYGEN",
        "externalRef": "e2581cd02573b9c5a03f3b4f3e6fa4bc",
        "originalUrl": "https://app.heygen.com/videos/e2581cd02573b9c5a03f3b4f3e6fa4bc",
        "embedUrl": "https://app.heygen.com/embeds/e2581cd02573b9c5a03f3b4f3e6fa4bc",
        "durationSeconds": 110,
        "displayOrder": 1,
        "isPreview": true
      }
    ]
  }
];
