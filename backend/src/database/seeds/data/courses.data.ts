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
  // 1. 메인 정규 통합과정 (총 240시간: 이론 100h + 실기 60h + 현장실습 80h)
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    courseType: 'MAIN',
    title: '돌봄종사자양성자 정규 통합과정',
    targetDisease: '노인성 만성질환 및 16대 표준 질환군 전반',
    summary: '보건복지부 요양보호사 표준 교재 및 대학병원 임상 기준에 맞춘 총 240시간 공인 돌봄종사자 양성과정',
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
        title: '제1단계: 기본간병 및 16대 질환 임상 이론 (100h)',
        durationMinutes: 6000,
        description: '병태생리 이해, 노인복지 법규 및 위험 징후(Red Flag) 감별 이론 교안',
      },
      {
        stepNumber: 2,
        stepType: 'PRACTICAL_VIDEO',
        title: '제2단계: 10대 골든 룰 핵심 실기 시뮬레이션 (60h)',
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
        isPreview: true,
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

  // 2. 경력자 단기과정 (총 80시간: 요양보호사·간호조무사 소지자 감면과정)
  {
    id: 'a0000000-0000-0000-0000-000000000018',
    courseType: 'MAIN',
    title: '돌봄종사자 경력자 축소과정 (80시간)',
    targetDisease: '국가공인 요양보호사 및 간호조무사 자격증 소지자 감면',
    summary: '국가자격 소지자 대상 이론 40h + 실기 30h + 실습 10h 압축 이수 트랙',
    price: 180000,
    theoryHours: 40,
    practicalHours: 30,
    practicumHours: 10,
    snubhCreditCapHours: 20.0,
    qualificationName: '공인 돌봄종사자 (경력자 감면과정)',
    isPublished: true,
    studyPeriodDays: 90,
    steps: [
      {
        stepNumber: 1,
        stepType: 'THEORY_TEXT',
        title: '경력자 특화 임상 의학 및 최신 가이드라인 (40h)',
        durationMinutes: 2400,
        description: '대학병원 표준 임상 술기 및 질환별 주의점 압축 교안',
      },
      {
        stepNumber: 2,
        stepType: 'PRACTICAL_VIDEO',
        title: '중증환자 케어 핵심 시뮬레이션 VOD (30h)',
        durationMinutes: 1800,
        description: '흡인·위루관·배액관 핵심 술기 마스터',
      },
      {
        stepNumber: 3,
        stepType: 'FINAL_EXAM',
        title: '현장 실무 역량 평가',
        durationMinutes: 600,
        description: '요양병원 10h 실습 및 간호사 직무 평가서',
        passScore: 80,
      },
    ],
    videos: [],
  },

  // 3~18. 16대 질환군 전문 자격 트랙 (각 총 8시간: 이론 4h + 실기 4h, 120,000원)
  // TRK-01 (신경계)
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

  // TRK-02 (호흡기계)
  {
    id: 'a0000000-0000-0000-0000-000000000005',
    categoryId: 2,
    courseType: 'TRACK',
    title: '호흡기계 질환 전문간병사 (COPD/T-tube/가정산소 케어 8시간)',
    targetDisease: '만성폐쇄성폐질환(COPD), 기관절개관, 산소요법',
    summary: '기관절개관 드레싱 보조, 저산소혈증 산소포화도 모니터링, 입술오므리기 호흡유도 8시간 특화 트랙',
    price: 120000,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    qualificationName: '환자질환별전문간병사 (호흡기계)',
    isPublished: true,
    studyPeriodDays: 90,
    steps: [
      {
        stepNumber: 1,
        stepType: 'THEORY_TEXT',
        title: '호흡기 병태생리 및 청색증 응급 감별 (4시간)',
        durationMinutes: 240,
        description: 'SpO2 90% 미만 대처, 산소유량계 안전 수칙',
      },
      {
        stepNumber: 2,
        stepType: 'PRACTICAL_VIDEO',
        title: 'T-tube 캐뉼라 주변 청결 및 체위배액 실습 (4시간)',
        durationMinutes: 240,
        description: 'Y거즈 교체 보조 및 상체 거치 체위배액',
      },
    ],
    videos: [],
  },

  // TRK-03 (심혈관계)
  {
    id: 'a0000000-0000-0000-0000-000000000006',
    categoryId: 3,
    courseType: 'TRACK',
    title: '심혈관계 질환 전문간병사 (심부전/부종/혈역학 케어 8시간)',
    targetDisease: '심부전(HF), 협심증, 고혈압, 기립성 저혈압',
    summary: '급성 호흡곤란 파악, 체중 증가 및 하지부종 관찰, 기립성 저혈압 3단계 기립법 8시간 특화 트랙',
    price: 120000,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    qualificationName: '환자질환별전문간병사 (심혈관계)',
    isPublished: true,
    studyPeriodDays: 90,
    steps: [
      {
        stepNumber: 1,
        stepType: 'THEORY_TEXT',
        title: '심부전 악화 징후 및 혈압 변동 모니터링 (4시간)',
        durationMinutes: 240,
        description: '매일 아침 체중 측정 기록, 흉통 응급 콜 절차',
      },
      {
        stepNumber: 2,
        stepType: 'PRACTICAL_VIDEO',
        title: '압박스타킹 착용 및 천천히 일어나기 실습 (4시간)',
        durationMinutes: 240,
        description: '하지 거상 체위 및 단계별 기립 보조 술기',
      },
    ],
    videos: [],
  },

  // TRK-04 (근골격계)
  {
    id: 'a0000000-0000-0000-0000-000000000007',
    categoryId: 4,
    courseType: 'TRACK',
    title: '근골격계 및 재활 전문간병사 (인공관절/고관절골절 케어 8시간)',
    targetDisease: '인공고관절 전치환술, 무릎관절염, 척추압박골절',
    summary: '고관절 90도 이상 굴곡제한 및 외전베개 유지, 다리 꼬기 금지, 보행기(Walker) 이승 보조 8시간 트랙',
    price: 120000,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    qualificationName: '환자질환별전문간병사 (근골격계)',
    isPublished: true,
    studyPeriodDays: 90,
    steps: [
      {
        stepNumber: 1,
        stepType: 'THEORY_TEXT',
        title: '인공관절 탈구 예방 자세 및 낙상 위험도 평가 (4시간)',
        durationMinutes: 240,
        description: '침상 각도 조절 및 탈구 금기 동작 수칙',
      },
      {
        stepNumber: 2,
        stepType: 'PRACTICAL_VIDEO',
        title: '외전베개 착용 및 워커 보행 훈련 보조 (4시간)',
        durationMinutes: 240,
        description: '환측 보폭 유지 및 화장실 이동 보조 실기',
      },
    ],
    videos: [],
  },

  // TRK-05 (소화기계)
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

  // TRK-06 (비뇨기계)
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

  // TRK-07 (내분비계)
  {
    id: 'a0000000-0000-0000-0000-000000000008',
    categoryId: 7,
    courseType: 'TRACK',
    title: '내분비·대사 질환 전문간병사 (당뇨병/저혈당/당뇨발 케어 8시간)',
    targetDisease: '인슐린 요법 당뇨병, 저혈당 응급쇼크, 당뇨발 궤양',
    summary: '저혈당 응급대처(의식 확인, 단당류 섭취), 당뇨발 일자 발톱깎기 및 피부 건조 예방 8시간 특화 트랙',
    price: 120000,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    qualificationName: '환자질환별전문간병사 (내분비계)',
    isPublished: true,
    studyPeriodDays: 90,
    steps: [
      {
        stepNumber: 1,
        stepType: 'THEORY_TEXT',
        title: '당뇨 혈당 변동 및 저혈당 쇼크 감별 (4시간)',
        durationMinutes: 240,
        description: '식은땀·떨림 감지, 응급 음료 제공, 혈당 측정 보조',
      },
      {
        stepNumber: 2,
        stepType: 'PRACTICAL_VIDEO',
        title: '당뇨발 관찰 및 족부 위생 케어 실습 (4시간)',
        durationMinutes: 240,
        description: '발가락 사이 상처 점검, 미온수 족욕, 보습제 도포',
      },
    ],
    videos: [],
  },

  // TRK-08 (종양/암)
  {
    id: 'a0000000-0000-0000-0000-000000000009',
    categoryId: 8,
    courseType: 'TRACK',
    title: '종양·암 질환 전문간병사 (항암부작용/호중구감소 케어 8시간)',
    targetDisease: '항암화학요법 오심/구토, 호중구감소증 발열, 암성 통증',
    summary: '항암 치료 중 무균 청결 관리, 면역저하 감염 차단, 부드러운 소량 빈번 식단 보조 8시간 트랙',
    price: 120000,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    qualificationName: '환자질환별전문간병사 (종양암질환)',
    isPublished: true,
    studyPeriodDays: 90,
    steps: [
      {
        stepNumber: 1,
        stepType: 'THEORY_TEXT',
        title: '항암 후 호중구감소증 발열 응급 수칙 (4시간)',
        durationMinutes: 240,
        description: '37.8도 이상 체온 상승 즉각 보고, 생야채/날음식 제한 수칙',
      },
      {
        stepNumber: 2,
        stepType: 'PRACTICAL_VIDEO',
        title: '구강 점막염 가글 및 암환자 위생 관리 (4시간)',
        durationMinutes: 240,
        description: '생리식염수 구강 세척, 손위생 6단계 엄수',
      },
    ],
    videos: [],
  },

  // TRK-09 (치매/정신)
  {
    id: 'a0000000-0000-0000-0000-000000000010',
    categoryId: 9,
    courseType: 'TRACK',
    title: '치매·정신 질환 전문간병사 (BPSD 이상행동/섬망 대처 8시간)',
    targetDisease: '알츠하이머 치매, 급성 섬망, 배회 및 폭언/망상',
    summary: '비약물적 인지중재, 석양증후군 수면안정, 지남력 강화 및 안심 환경 조성 8시간 특화 트랙',
    price: 120000,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    qualificationName: '환자질환별전문간병사 (치매인지)',
    isPublished: true,
    studyPeriodDays: 90,
    steps: [
      {
        stepNumber: 1,
        stepType: 'THEORY_TEXT',
        title: '치매 BPSD 감별 및 비약물적 대화 기법 (4시간)',
        durationMinutes: 240,
        description: '부정하지 않는 공감 대화, 망상 시 주의 전환 기법',
      },
      {
        stepNumber: 2,
        stepType: 'PRACTICAL_VIDEO',
        title: '배회 예방 스마트 감지 및 환경 안전 실습 (4시간)',
        durationMinutes: 240,
        description: '배회 매트 설치, 야간 안심 조명, 가족 사진 배치',
      },
    ],
    videos: [],
  },

  // TRK-10 (감염성질환)
  {
    id: 'a0000000-0000-0000-0000-000000000011',
    categoryId: 10,
    courseType: 'TRACK',
    title: '감염성 질환 전문간병사 (CRE/VRE 다제내성균 격리 케어 8시간)',
    targetDisease: '다제내성균(CRE/VRE/MRSA), 옴(Scabies), 결핵 음압격리',
    summary: '접촉주의 격리 가운 및 장갑 착탈의 순서, 의료폐기물 분리배출, 환경 소독 8시간 특화 트랙',
    price: 120000,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    qualificationName: '환자질환별전문간병사 (감염관리)',
    isPublished: true,
    studyPeriodDays: 90,
    steps: [
      {
        stepNumber: 1,
        stepType: 'THEORY_TEXT',
        title: '다제내성균 전파경로 및 표준·접촉격리 지침 (4시간)',
        durationMinutes: 240,
        description: '격리실 출입 원칙, 격리물품 단독 사용 규정',
      },
      {
        stepNumber: 2,
        stepType: 'PRACTICAL_VIDEO',
        title: '보호구(PPE) 착탈의 순서 및 오염폐기물 처리 (4시간)',
        durationMinutes: 240,
        description: '가운 탈의 시 안쪽 말아 벗기, 1회용 장갑 멸균 처리',
      },
    ],
    videos: [],
  },

  // TRK-11 (중환자/와상)
  {
    id: 'a0000000-0000-0000-0000-000000000012',
    categoryId: 11,
    courseType: 'TRACK',
    title: '중환자·와상 집중간병사 (욕창 4단계 예방/q2hr 체변 8시간)',
    targetDisease: '장기 와상환자 욕창, 천골/발뒤꿈치 압박 괴사, 관절구축',
    summary: '2시간 주기 체위변경(q2hr) 절대엄수, 에어매트리스 압력 분산, 체위변경 베개 지지 8시간 트랙',
    price: 120000,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    qualificationName: '환자질환별전문간병사 (중환자와상)',
    isPublished: true,
    studyPeriodDays: 90,
    steps: [
      {
        stepNumber: 1,
        stepType: 'THEORY_TEXT',
        title: '욕창 발생 기전 및 NPUAP 4단계 감별 (4시간)',
        durationMinutes: 240,
        description: '발적 부위 마사지 금지 원칙, 피부 건조/보습 수칙',
      },
      {
        stepNumber: 2,
        stepType: 'PRACTICAL_VIDEO',
        title: '앙와위·측위 30도 체위변경 및 욕창방석 적용 (4시간)',
        durationMinutes: 240,
        description: '2인 1조 체위변경, 무릎 사이 베개 지지 실기',
      },
    ],
    videos: [],
  },

  // TRK-12 (외상/화상)
  {
    id: 'a0000000-0000-0000-0000-000000000013',
    categoryId: 12,
    courseType: 'TRACK',
    title: '외상·화상 질환 전문간병사 (피부이식/압박드레싱 케어 8시간)',
    targetDisease: '중증 화상, 피부이식 부위(Donor site), 다발성 외상',
    summary: '이식 부위 쓸림 방지, 무균 거즈 드레싱 보조, 수포 터짐 예방 및 소양증 냉찜질 8시간 트랙',
    price: 120000,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    qualificationName: '환자질환별전문간병사 (외상화상)',
    isPublished: true,
    studyPeriodDays: 90,
    steps: [
      {
        stepNumber: 1,
        stepType: 'THEORY_TEXT',
        title: '화상 피부 관리 및 구축 예방 스트레칭 (4시간)',
        durationMinutes: 240,
        description: '압박옷(Jobst) 착용법, 감염 징후 모니터링',
      },
      {
        stepNumber: 2,
        stepType: 'PRACTICAL_VIDEO',
        title: '무균 환의 교체 및 이식부위 비마찰 케어 (4시간)',
        durationMinutes: 240,
        description: '환의 입고 벗을 때 마찰 최소화 술기',
      },
    ],
    videos: [],
  },

  // TRK-13 (노인성복합)
  {
    id: 'a0000000-0000-0000-0000-000000000014',
    categoryId: 13,
    courseType: 'TRACK',
    title: '노인성 복합만성 질환 전문간병사 (다약제 복용/낙상예방 8시간)',
    targetDisease: '다약제 복용(Polypharmacy), 노인 쇠약증후군, 연하곤란',
    summary: '약물 복용 시간 준수(식전/식후/취침전), 낙상 고위험 환경 개선, 영양죽 식이보조 8시간 트랙',
    price: 120000,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    qualificationName: '환자질환별전문간병사 (노인복합)',
    isPublished: true,
    studyPeriodDays: 90,
    steps: [
      {
        stepNumber: 1,
        stepType: 'THEORY_TEXT',
        title: '노인 약물 상호작용 및 기립 시 어지러움 대처 (4시간)',
        durationMinutes: 240,
        description: '진정제/이뇨제 복용 환자 화장실 이동 집중 감시',
      },
      {
        stepNumber: 2,
        stepType: 'PRACTICAL_VIDEO',
        title: '복용 알림 세팅 및 침상 낙상방지 난간 고정 (4시간)',
        durationMinutes: 240,
        description: '양측 사이드레일 고정 및 호출벨 환자 손닿는 곳 배치',
      },
    ],
    videos: [],
  },

  // TRK-14 (호스피스완화)
  {
    id: 'a0000000-0000-0000-0000-000000000015',
    categoryId: 14,
    courseType: 'TRACK',
    title: '호스피스·완화의료 전문간병사 (임종돌봄/통증안정 케어 8시간)',
    targetDisease: '말기 암 임종기, 임종 징후(체인스톡스 호흡, 가래 끓는 소리)',
    summary: '임종기 호흡 불안 시 측위 전환, 구강 습윤 스펀지 케어, 환자 존엄성 유지 및 가족 정서 지지 8시간 트랙',
    price: 120000,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    qualificationName: '환자질환별전문간병사 (호스피스완화)',
    isPublished: true,
    studyPeriodDays: 90,
    steps: [
      {
        stepNumber: 1,
        stepType: 'THEORY_TEXT',
        title: '임종 징후 판별 및 통증 호소 비언어적 척도 (4시간)',
        durationMinutes: 240,
        description: '청각 유지 원칙(귀는 마지막까지 열려있음), 따뜻한 손길',
      },
      {
        stepNumber: 2,
        stepType: 'PRACTICAL_VIDEO',
        title: '구강 보습 거즈 도포 및 사후 신체 청결 보조 (4시간)',
        durationMinutes: 240,
        description: '입술 바셀린 도포 및 존엄한 사후 수습 보조',
      },
    ],
    videos: [],
  },

  // TRK-15 (소아청소년)
  {
    id: 'a0000000-0000-0000-0000-000000000016',
    categoryId: 15,
    courseType: 'TRACK',
    title: '소아·청소년 특수간병사 (뇌성마비/희귀질환 케어 8시간)',
    targetDisease: '소아 뇌성마비, 발달장애, 선천성 대사질환',
    summary: '소아 연하곤란 특수 식이, 척추 변형 방지 휠체어 피팅, 소아 전용 석션 팁 사용 8시간 트랙',
    price: 120000,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    qualificationName: '환자질환별전문간병사 (소아청소년특수)',
    isPublished: true,
    studyPeriodDays: 90,
    steps: [
      {
        stepNumber: 1,
        stepType: 'THEORY_TEXT',
        title: '소아 신체 발달 특성 및 호흡곤란 감별 (4시간)',
        durationMinutes: 240,
        description: '흉벽 함몰 및 콧날개 벌렁임 등 소아 호흡부전 징후',
      },
      {
        stepNumber: 2,
        stepType: 'PRACTICAL_VIDEO',
        title: '소아 특수 이승기 및 관절 가동범위(ROM) 보조 (4시간)',
        durationMinutes: 240,
        description: '부드러운 관절 운동 및 정서적 놀이 치료 보조',
      },
    ],
    videos: [],
  },

  // TRK-16 (응급기도/석션)
  {
    id: 'a0000000-0000-0000-0000-000000000017',
    categoryId: 16,
    courseType: 'TRACK',
    title: '응급기도·연하장애 전문간병사 (석션 15초/기도폐쇄 응급 8시간)',
    targetDisease: '구강·기도 분비물 저류, 이물질 기도폐쇄, 연하곤란 사래',
    summary: '석션 카테터 1회 흡인 15초 이내 제한 원칙, 하임리히법 응급처치, 점도증진제 농도 조절 8시간 특화 트랙',
    price: 120000,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    qualificationName: '환자질환별전문간병사 (응급기도관리)',
    isPublished: true,
    studyPeriodDays: 90,
    steps: [
      {
        stepNumber: 1,
        stepType: 'THEORY_TEXT',
        title: '기도폐쇄 응급 알고리즘 및 저산소증 예방 수칙 (4시간)',
        durationMinutes: 240,
        description: '1회 흡인 15초 초과 시 부정맥/저산소증 위험성 교육',
      },
      {
        stepNumber: 2,
        stepType: 'PRACTICAL_VIDEO',
        title: '석션 카테터 삽입 및 하임리히법 실기 시뮬레이션 (4시간)',
        durationMinutes: 240,
        description: '무균 장갑 착용, 흡인압 100~120mmHg 설정, 복부 밀어내기',
      },
    ],
    videos: [],
  },
];
