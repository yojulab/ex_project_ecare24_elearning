export interface ExamQuestionSeedItem {
  categoryId: number;
  subjectCode: string;
  questionType: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'CASE_STUDY';
  title: string;
  scenario?: string;
  points: number;
  options: { no: number; text: string }[];
  correctAnswer: string;
  explanation: string;
  terminologyTags: string[];
  isReviewedByClinician: boolean;
}

export const SEED_EXAM_QUESTIONS: ExamQuestionSeedItem[] = [
  {
    categoryId: 1,
    subjectCode: 'NEURO_CLINICAL',
    questionType: 'CASE_STUDY',
    title: '우측 편마비 환자의 단추 달린 상의를 갈아입힐 때 올바른 순서는?',
    scenario: '뇌경색으로 인해 우측 상하지 마비가 있는 72세 박○○ 환자가 땀으로 젖은 옷을 갈아입으려 한다.',
    points: 10,
    options: [
      { no: 1, text: '벗길 때 우측(환측) 먼저, 입힐 때 좌측(건측) 먼저' },
      { no: 2, text: '벗길 때 좌측(건측) 먼저, 입힐 때 우측(환측) 먼저 (탈건착환)' },
      { no: 3, text: '상의 단추를 모두 잠근 채 머리부터 강제로 벗긴다' },
      { no: 4, text: '좌측과 우측 구분 없이 손에 잡히는 쪽부터 무작위로 당긴다' },
    ],
    correctAnswer: '2',
    explanation: '편마비 환자의 의복 교체 골든 룰은 [탈건착환]입니다. 벗길 때는 자유로운 건강한 쪽(좌측)을 먼저 벗겨 공간을 확보하고, 입힐 때는 움직임이 불편한 마비된 쪽(우측)을 먼저 끼워 넣어야 어깨 탈구와 통증을 예방할 수 있습니다.',
    terminologyTags: ['탈건착환', '편마비', '어깨탈구예방'],
    isReviewedByClinician: true,
  },
  {
    categoryId: 5,
    subjectCode: 'GASTRO_CLINICAL',
    questionType: 'MULTIPLE_CHOICE',
    title: '경관유동식(L-tube 피딩) 주입 시 흡인성 폐렴을 예방하기 위한 올바른 환자 자세는?',
    scenario: '연하곤란으로 비위관을 삽입 중인 80세 이○○ 환자에게 점심 유동식 300ml를 주입하려 한다.',
    points: 10,
    options: [
      { no: 1, text: '편안하게 천장을 보고 똑바로 누운 앙와위 자세' },
      { no: 2, text: '상체를 30~45도 올린 반좌위(Fowler) 자세' },
      { no: 3, text: '베개를 빼고 머리를 침대 밑으로 낮춘 트렌델렌버그 자세' },
      { no: 4, text: '엎드려서 턱을 바닥에 괸 복위 자세' },
    ],
    correctAnswer: '2',
    explanation: '경관영양 주입 시 중력에 의해 음식물이 역류하여 기도로 흡인(Aspiration)되는 것을 방지하기 위해 반드시 상체를 30~45도 거상한 반좌위를 취해야 하며, 주입 후에도 30분 이상 이 자세를 유지해야 합니다.',
    terminologyTags: ['피딩', '엘튜브', '반좌위', '아스피레이션'],
    isReviewedByClinician: true,
  },
  {
    categoryId: 6,
    subjectCode: 'URO_CLINICAL',
    questionType: 'MULTIPLE_CHOICE',
    title: '유치도뇨관(Foley)을 삽입 중인 환자의 유린백(소변백) 관리로 가장 적절한 것은?',
    scenario: '요폐로 유치도뇨관을 유지 중인 68세 환자가 침상에서 휠체어로 이동하려 한다.',
    points: 10,
    options: [
      { no: 1, text: '이동이 편하도록 유린백을 환자 무릎 위나 가슴 위에 올려놓는다' },
      { no: 2, text: '유린백을 침대 난간 가장 높은 곳에 걸어 소변 배출을 확인한다' },
      { no: 3, text: '유린백을 항상 환자의 방광보다 낮은 위치에 유지하며 바닥에 닿지 않게 한다' },
      { no: 4, text: '소변백 관이 꼬이더라도 배출구만 잠그면 상관없다' },
    ],
    correctAnswer: '3',
    explanation: '소변백이 방광보다 높게 위치하면 역류로 인해 요로감염(CAUTI) 및 패혈증이 발생하므로, 유린백은 항상 방광보다 아래에 거치해야 합니다. 또한 감염 예방을 위해 배출구가 바닥에 닿지 않도록 주의합니다.',
    terminologyTags: ['폴리', '유린백', '요로감염예방', '방광하단거치'],
    isReviewedByClinician: true,
  },
  {
    categoryId: 16,
    subjectCode: 'AIRWAY_CLINICAL',
    questionType: 'MULTIPLE_CHOICE',
    title: '기도 내 분비물 흡인(석션) 시 1회 흡인 시간의 안전 기준은?',
    scenario: '기관절개관을 통해 가래 끓는 소리가 심하여 석션을 시행하고자 한다.',
    points: 10,
    options: [
      { no: 1, text: '가래가 완전히 다 나올 때까지 1분 이상 지속한다' },
      { no: 2, text: '환자가 숨을 참을 수 있을 때까지 30~40초간 시행한다' },
      { no: 3, text: '1회 흡인은 반드시 15초 이내로 제한하고 충분한 산소를 공급한다' },
      { no: 4, text: '카테터를 강하게 회전시키며 5초 미만으로 끝낸다' },
    ],
    correctAnswer: '3',
    explanation: '석션 시 폐 내부의 산소도 함께 흡인되므로 1회 흡인 시간은 반드시 15초 이내로 제한해야 합니다. 이를 초과하면 심각한 저산소증, 서맥, 심장 부정맥 및 기도 점막 궤양이 발생할 수 있습니다.',
    terminologyTags: ['석션', '15초원칙', '저산소증예방'],
    isReviewedByClinician: true,
  },
  {
    categoryId: 13,
    subjectCode: 'GERIATRIC_CLINICAL',
    questionType: 'MULTIPLE_CHOICE',
    title: '와상 상태의 노인 환자에게 욕창을 예방하기 위한 체위변경 주기 원칙은?',
    scenario: '뇌출혈 후유증으로 스스로 체위를 변경하지 못하는 85세 와상 환자를 간병하고 있다.',
    points: 10,
    options: [
      { no: 1, text: '하루 3번 식사 시간에만 맞추어 변경한다' },
      { no: 2, text: '밤에는 수면을 방해하지 않도록 아침까지 그대로 둔다' },
      { no: 3, text: '낮과 밤을 불문하고 최소 2시간(q2hr) 간격으로 규칙적으로 변경한다' },
      { no: 4, text: '환자가 아프다고 통증을 호소할 때만 변경한다' },
    ],
    correctAnswer: '3',
    explanation: '지속적인 압박으로 인한 피부 괴사를 막기 위해 와상 환자의 체위변경은 2시간마다(q2hr) 앙와위-측위-반좌위 순으로 규칙적으로 시행해야 합니다.',
    terminologyTags: ['체변', 'q2hr', '욕창예방', '앙와위/측위'],
    isReviewedByClinician: true,
  },
];
