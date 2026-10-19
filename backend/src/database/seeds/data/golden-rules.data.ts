export interface GoldenRuleSeedItem {
  ruleNo: number;
  title: string;
  description: string;
  badCase: string;
  isActive: boolean;
}

export const SEED_GOLDEN_RULES: GoldenRuleSeedItem[] = [
  {
    ruleNo: 1,
    title: '체위변경 2시간 원칙 (q2hr 체변)',
    description: '와상 환자는 2시간마다 체위를 변경(앙와위-측위-반좌위 순환)하여 골격 돌출부 욕창을 예방합니다.',
    badCase: '장시간 방치 시 천골·대전자 부위 3단계 욕창 발생 위험',
    isActive: true,
  },
  {
    ruleNo: 2,
    title: '탈건착환 (벗을 때 건강한 쪽, 입을 때 마비된 쪽)',
    description: '편마비 환자의 의복 교체 시 탈의는 건강한 쪽 먼저, 착의는 마비된 환측 먼저 진행합니다.',
    badCase: '순서 위반 시 환측 관절 아탈구 및 낙상 통증 유발',
    isActive: true,
  },
  {
    ruleNo: 3,
    title: '경관유동식(L-tube) 상체 30~45도 거치',
    description: '비위관 피딩 시 상체를 30~45도 올리고, 주입 후 30분 이상 좌위를 유지하여 역류를 방지합니다.',
    badCase: '앙와위 주입 시 치명적인 흡인성 폐렴(Aspiration) 발생',
    isActive: true,
  },
  {
    ruleNo: 4,
    title: '유린백(소변백)은 항상 방광보다 아래',
    description: '유치도뇨관(Foley) 유린백은 항상 환자의 방광보다 낮은 위치에 거치하고 바닥에 닿지 않게 합니다.',
    badCase: '역류로 인한 요로감염(CAUTI) 및 패혈증 쇼크 위험',
    isActive: true,
  },
  {
    ruleNo: 5,
    title: '석션 1회 15초 이내 제한',
    description: '구강 및 기관절개관 분비물 흡인 시 1회 15초를 넘기지 않으며 멸균 카테터를 1회 사용합니다.',
    badCase: '과도한 석션 시 저산소증, 심장 부정맥 및 기도 점막 손상',
    isActive: true,
  },
  {
    ruleNo: 6,
    title: '휠체어 이동 시 침상 난간 체결 및 브레이크',
    description: '환자를 이동시키기 전 휠체어 바퀴 잠금장치를 체결하고 발받침대를 접어 발이 걸리지 않게 합니다.',
    badCase: '잠금장치 미체결로 휠체어 밀림 및 고관절 골절 낙상 사고',
    isActive: true,
  },
  {
    ruleNo: 7,
    title: '개인위생 시 프라이버시 유지와 보온',
    description: '침상 세발 및 목욕 시 커튼이나 스크린으로 노출 부위를 최소화하고 미온수 온도를 확인합니다.',
    badCase: '수치심 유발 및 급격한 체온 저하로 인한 오한/저체온증',
    isActive: true,
  },
  {
    ruleNo: 8,
    title: '접촉격리 보호구(PPE) 및 손위생 30초',
    description: 'CRE/VRE 등 감염 환자 병실 진입 전 장갑/가운을 착용하고 퇴실 전 병실 안에서 폐기합니다.',
    badCase: '보호구 미착용 및 재사용으로 인한 병동 내 교차감염 전파',
    isActive: true,
  },
  {
    ruleNo: 9,
    title: '활력징후 이상치 감지 즉시 간호사 인계',
    description: '혈압 급상승/저하, 체온 38도 이상, SpO2 90% 미만 시 지체 없이 의료진에게 구두 보고합니다.',
    badCase: '간병인 자의적 판단으로 보고 지연 시 뇌출혈/패혈성 쇼크 진행',
    isActive: true,
  },
  {
    ruleNo: 10,
    title: '치매 환자 존중 및 현실 지남력 자극',
    description: '환각이나 망상 발생 시 논쟁하거나 비난하지 않고 안심시킨 뒤 주의를 부드럽게 전환합니다.',
    badCase: '억압하거나 거짓말로 훈계 시 BPSD 폭력성 공격행동 격화',
    isActive: true,
  },
];
