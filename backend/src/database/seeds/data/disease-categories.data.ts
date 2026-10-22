export interface DiseaseCategorySeedItem {
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
