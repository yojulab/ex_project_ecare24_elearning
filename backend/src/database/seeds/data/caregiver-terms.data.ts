export interface CaregiverTermSeedItem {
  term: string;
  standardTerm: string;
  category: string;
  definition: string;
  carePoint: string;
  warningAlert?: string;
}

export const SEED_CAREGIVER_TERMS: CaregiverTermSeedItem[] = [
  {
    term: '피딩',
    standardTerm: 'L-tube(비위관) 경관영양',
    category: '영양/소화기',
    definition: '입으로 음식물을 섭취하지 못하는 환자의 코를 통해 위까지 연결된 튜브로 액상 영양액을 공급하는 행위',
    carePoint: '주입 전 상체를 30~45도 거치(반좌위)하고, 주입 후 30분 이상 자세 유지',
    warningAlert: '앙와위(누운 상태) 주입 시 치명적인 흡인성 폐렴 유발',
  },
  {
    term: '엘튜브',
    standardTerm: 'Levin tube (비위관)',
    category: '의료기구',
    definition: '코를 통해 위 내로 삽입되는 유연한 고무/실리콘 튜브',
    carePoint: '반창고 고정 상태 확인, 튜브 눈금이 입구에서 밀려나오지 않았는지 확인',
    warningAlert: '환자가 무의식적으로 잡아당겨 빠졌을 때 임의로 밀어넣지 말고 즉시 간호사 호출',
  },
  {
    term: 'PEG',
    standardTerm: '경피적 내시경하 위루술 튜브 (위루관)',
    category: '영양/소화기',
    definition: '복벽을 통해 위장으로 직접 연결된 영양 공급 튜브',
    carePoint: '튜브 삽입 부위의 발적, 누출, 삼출물 매일 관찰, 거즈 건조 상태 유지',
    warningAlert: '위루관 주변 피부 괴사 및 복막염 위험',
  },
  {
    term: '폴리',
    standardTerm: 'Foley Catheter (유치도뇨관)',
    category: '배뇨/비뇨기',
    definition: '요도를 통해 방광 내로 삽입하여 소변을 지속적으로 배출시키는 카테터',
    carePoint: '소변백은 항상 방광보다 낮은 위치에 거치, 꼬임 방지, 당김 방지',
    warningAlert: '소변백을 방광보다 높게 둘 경우 요로감염(CAUTI) 및 역류 패혈증 발생',
  },
  {
    term: '유린백',
    standardTerm: 'Urine Drainage Bag (소변 수집백)',
    category: '의료기구',
    definition: '유치도뇨관에 연결되어 배출된 소변을 모아두는 백',
    carePoint: '소변백 배출구가 바닥에 닿지 않도록 침상 프레임에 걸어 거치',
    warningAlert: '비우기 전후 알코올 솜 소독 준수, 소변 색깔/혼탁도/출혈 관찰',
  },
  {
    term: '체변',
    standardTerm: '체위변경 (Repositioning)',
    category: '기본간병/욕창',
    definition: '와상 환자의 압박 부위 혈류 순환을 위해 몸의 자세를 주기적으로 바꾸어주는 행위',
    carePoint: '낮과 밤 구분 없이 최소 2시간(q2hr) 간격으로 앙와위-측위-반좌위 순환',
    warningAlert: '골격 돌출부(천골, 대전자, 발뒤꿈치) 붉은 발적 발생 시 즉시 감압',
  },
  {
    term: '탈건착환',
    standardTerm: '탈의 시 건강한 쪽 먼저, 착의 시 마비된 쪽 먼저',
    category: '환자안전/의복',
    definition: '편마비 또는 거동 불편 환자의 옷을 벗기고 입힐 때 지켜야 하는 필수 원칙',
    carePoint: '벗길 때는 건강한 쪽(건측)부터 벗기고, 입힐 때는 불편한 마비 쪽(환측)부터 입힘',
    warningAlert: '원칙 위반 시 환측 관절 염좌 및 통증, 낙상 사고 유발',
  },
  {
    term: '석션',
    standardTerm: '흡인 (Suction)',
    category: '호흡기/기도',
    definition: '구강이나 기관절개관 내에 고인 객담이나 분비물을 음압기로 빨아내는 행위',
    carePoint: '1회 흡인 시간은 반드시 15초 이내로 제한, 흡인 전후 산소포화도 확인',
    warningAlert: '15초 초과 흡인 시 저산소증, 심장 부정맥 및 기도 점막 손상 발생',
  },
  {
    term: '반좌위',
    standardTerm: 'Fowler Position (상체 30~45도 거상 자세)',
    category: '환자체위',
    definition: '침대 상체 각도를 30~45도 올려 환자가 비스듬히 앉은 자세',
    carePoint: '식사, 피딩, 호흡곤란 환자 케어 시 횡격막 확장을 도와 호흡과 소화를 보조',
    warningAlert: '피딩 중 앙와위로 낮추면 구토 및 질식 유발',
  },
  {
    term: '앙와위',
    standardTerm: 'Supine Position (바로 누운 자세)',
    category: '환자체위',
    definition: '환자가 천장을 바라보고 똑바로 누운 기본 안정 자세',
    carePoint: '무릎 밑이나 허리 뒤에 작은 베개 지지, 발뒤꿈치 감압 패드 거치',
    warningAlert: '천골(꼬리뼈) 부위 욕창 발생 빈도가 가장 높은 자세이므로 2시간 초과 금지',
  },
  {
    term: '아스피레이션',
    standardTerm: '흡인성 폐렴 (Aspiration Pneumonia)',
    category: '합병증/응급',
    definition: '음식물, 침, 위 내용물이 기도로 넘어가 폐로 들어가 염증을 유발하는 중증 질환',
    carePoint: '삼킴장애 환자는 점도증진제 사용, 피딩 시 상체 거상, 수면 전 구강위생 필수',
    warningAlert: '고령 와상 환자의 주요 사망 원인이므로 청색증, 발열, 기침 시 즉각 보고',
  },
];
