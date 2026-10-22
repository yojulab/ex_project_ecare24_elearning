const fs = require('fs');
const path = require('path');

const parsedTracks = require('../packages/utils/src/parsed_tracks.json');

// 1. packages/utils/src/tracksData.ts 생성
const tracksDataTs = `// 3개 실데이터 트랙 공용 데이터 정의 (제공 문서 기반)
export interface TrackChapter {
  title: string;
  content: string;
}

export interface TrackQuestionOption {
  no: number;
  text: string;
}

export interface TrackQuestion {
  questionNumber: number;
  title: string;
  options: TrackQuestionOption[];
  correctAnswer: string;
  explanation: string;
  points: number;
  subjectCode: string;
  categoryId: number;
  terminologyTags: string[];
}

export interface TrackData {
  id: string;
  categoryId: number;
  trackCode: string;
  categoryCode: string;
  categoryName: string;
  title: string;
  qualificationName: string;
  videoTitle: string;
  videoUrl: string;
  embedUrl: string;
  targetDisease: string;
  scriptText: string;
  file?: string;
  chapters: TrackChapter[];
  mockQuestions: TrackQuestion[];
  finalQuestions: TrackQuestion[];
}

export const REAL_TRACKS: TrackData[] = ${JSON.stringify(parsedTracks, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../packages/utils/src/tracksData.ts'), tracksDataTs, 'utf8');
console.log('Generated packages/utils/src/tracksData.ts');

// 2. backend/src/database/seeds/data/disease-categories.data.ts 생성
const diseaseCategoriesTs = `export interface DiseaseCategorySeedItem {
  id: number;
  code: string;
  nameKo: string;
  nameEn: string;
  description: string;
  iconUrl: string;
  totalRequiredHours: number;
  theoryHours: number;
  practicalHours: number;
  practicumHours: number;
  snubhCreditCapHours: number;
  iconName: string;
  themeColor: string;
  displayOrder: number;
  isMvp: boolean;
  isActive: boolean;
  coreCarePoints: string[];
}

export const SEED_DISEASE_CATEGORIES: DiseaseCategorySeedItem[] = [
  {
    id: 1,
    code: 'PULMONARY',
    nameKo: '호흡기계·폐질환 케어 트랙',
    nameEn: 'Pulmonary Care Track',
    description: 'COPD, 폐렴, 천식, 산소요법 및 흡인 기구 안전 수칙',
    iconUrl: '/icons/pulmonary.svg',
    totalRequiredHours: 8,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    iconName: 'Wind',
    themeColor: '#0ea5e9',
    displayOrder: 1,
    isMvp: true,
    isActive: true,
    coreCarePoints: ['의료진 지시 준수', '청색증·빈호흡 감시', '산소유량 임의변경 절대금기', '반좌위 및 입술오므리기 호흡'],
  },
  {
    id: 2,
    code: 'DEMENTIA',
    nameKo: '인지·정신·치매환자 케어 트랙',
    nameEn: 'Dementia Care Track',
    description: '알츠하이머, 혈관성 치매, BPSD 감정 수용, 낙상·연하 안전 및 섬망 감별',
    iconUrl: '/icons/dementia.svg',
    totalRequiredHours: 8,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    iconName: 'Brain',
    themeColor: '#8b5cf6',
    displayOrder: 2,
    isMvp: true,
    isActive: true,
    coreCarePoints: ['인간존엄성 및 익숙한 리듬', '지남력 일상안내', '타당화 감정수용 및 관심전환', '낙상·연하 안전 및 섬망감별'],
  },
  {
    id: 3,
    code: 'MUSCULOSKELETAL',
    nameKo: '근골격계질환 및 수술 후 재활 케어 트랙',
    nameEn: 'Musculoskeletal Care Track',
    description: '척추손상, 디스크, 인공관절, 골절, 마비측 팔 견인 금지 및 기구 5대 점검',
    iconUrl: '/icons/musculoskeletal.svg',
    totalRequiredHours: 8,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    iconName: 'Bone',
    themeColor: '#10b981',
    displayOrder: 3,
    isMvp: true,
    isActive: true,
    coreCarePoints: ['통증·가동범위 한계확인', '마비측 팔 견인 절대금기', '보조기구 5대 점검원칙', '통나무 굴리기 및 외전베개'],
  },
];
`;

fs.writeFileSync(
  path.join(__dirname, '../backend/src/database/seeds/data/disease-categories.data.ts'),
  diseaseCategoriesTs,
  'utf8'
);
console.log('Generated backend/src/database/seeds/data/disease-categories.data.ts');

// 3. backend/src/database/seeds/data/courses.data.ts 생성
// 오직 제공된 3개 트랙만 포함!
const coursesDataItems = parsedTracks.map((t, idx) => {
  const steps = [
    {
      stepNumber: 1,
      stepType: 'THEORY_TEXT',
      title: `Step 1. 전문간병사 정규 교안 (5대 챕터 문구형 교안)`,
      durationMinutes: 240,
      description: t.chapters.map(c => c.title).join(' / '),
    },
    {
      stepNumber: 2,
      stepType: 'PRACTICAL_VIDEO',
      title: `Step 2. 4K 실기 & 실습 시뮬레이션 (${t.videoTitle})`,
      durationMinutes: 240,
      description: `전문강사 핵심 임상 실기 VOD 및 스크립트 기반 실무 시뮬레이션`,
    },
    {
      stepNumber: 3,
      stepType: 'MOCK_EXAM',
      title: `Step 3. 실전 모의고사 CBT (30문항)`,
      durationMinutes: 60,
      description: `실무 임상 상황별 문제은행 30문항 및 상세 해설`,
      passScore: 60,
    },
    {
      stepNumber: 4,
      stepType: 'FINAL_EXAM',
      title: `Step 4. 정규 자격검정 평가시험 (30문항 실시간 통과)`,
      durationMinutes: 60,
      description: `한국직업능력연구원(pqi.or.kr) 등록 정규 자격 검정 (60점 이상 합격)`,
      passScore: 60,
    },
  ];

  const videos = [
    {
      title: t.videoTitle,
      source: 'HEYGEN',
      externalRef: t.videoUrl.split('/videos/')[1] || `heygen-${idx + 1}`,
      originalUrl: t.videoUrl,
      embedUrl: t.embedUrl,
      durationSeconds: idx === 2 ? 110 : 75,
      displayOrder: 1,
      isPreview: true,
    },
  ];

  return {
    id: t.id,
    categoryId: t.categoryId,
    courseType: 'TRACK',
    title: t.title,
    targetDisease: t.targetDisease,
    summary: `${t.qualificationName} 공식 교육과정. ${t.chapters[0]?.title} 등 5대 챕터 정규 교안, ${t.videoTitle} VOD, 실전 모의고사 30문항, 정규 자격검정 30문항 완비.`,
    price: 120000,
    theoryHours: 4,
    practicalHours: 4,
    practicumHours: 0,
    snubhCreditCapHours: 2.0,
    qualificationName: t.qualificationName,
    isPublished: true,
    studyPeriodDays: 90,
    steps,
    videos,
  };
});

const coursesDataTs = `export interface CourseVideoSeedItem {
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

export const SEED_COURSES: CourseSeedItem[] = ${JSON.stringify(coursesDataItems, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../backend/src/database/seeds/data/courses.data.ts'), coursesDataTs, 'utf8');
console.log('Generated backend/src/database/seeds/data/courses.data.ts');

// 4. backend/src/database/seeds/data/exam-questions.data.ts 생성
// 3개 트랙의 모의고사 30문항 + 최종 30문항 = 총 180문항
const allExamQuestions = [];
for (const t of parsedTracks) {
  // Mock questions
  for (const q of t.mockQuestions) {
    allExamQuestions.push({
      categoryId: t.categoryId,
      subjectCode: q.subjectCode,
      questionType: 'MULTIPLE_CHOICE',
      title: q.title,
      scenario: `[${t.qualificationName} 모의평가] 문항 ${q.questionNumber}`,
      points: 20,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      terminologyTags: q.terminologyTags,
      isReviewedByClinician: true,
    });
  }
  // Final questions
  for (const q of t.finalQuestions) {
    allExamQuestions.push({
      categoryId: t.categoryId,
      subjectCode: q.subjectCode,
      questionType: 'CASE_STUDY',
      title: q.title,
      scenario: `[${t.qualificationName} 정규 자격검정] 문항 ${q.questionNumber}`,
      points: 20,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      terminologyTags: q.terminologyTags,
      isReviewedByClinician: true,
    });
  }
}

const examQuestionsDataTs = `export interface ExamQuestionSeedItem {
  categoryId: number;
  subjectCode: string;
  questionType: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'CASE_STUDY';
  title: string;
  scenario: string;
  points: number;
  options: { no: number; text: string }[];
  correctAnswer: string;
  explanation: string;
  terminologyTags: string[];
  isReviewedByClinician: boolean;
}

export const SEED_EXAM_QUESTIONS: ExamQuestionSeedItem[] = ${JSON.stringify(allExamQuestions, null, 2)};
`;

fs.writeFileSync(
  path.join(__dirname, '../backend/src/database/seeds/data/exam-questions.data.ts'),
  examQuestionsDataTs,
  'utf8'
);
console.log(`Generated backend/src/database/seeds/data/exam-questions.data.ts (${allExamQuestions.length} items)`);
