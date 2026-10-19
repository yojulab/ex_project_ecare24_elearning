export interface PopupNoticeSeedItem {
  id: string;
  title: string;
  contentHtml: string;
  imageUrl?: string;
  linkUrl?: string;
  target: 'ALL' | 'GUEST' | 'STUDENT' | 'STAFF';
  showOnWeb: boolean;
  showOnMobile: boolean;
  positionX: number;
  positionY: number;
  width: number;
  priority: number;
  allowHideToday: boolean;
  startsAt: Date;
  endsAt: Date;
  isActive: boolean;
}

export const SEED_POPUPS: PopupNoticeSeedItem[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    title: '2026년 전문간병사 정규 통합과정 1기 모집 안내',
    contentHtml: `<div class="p-3 text-slate-800 space-y-2">
      <div class="font-bold text-base text-emerald-800">🎓 보건복지부 요양보호 표준 및 임상 기준 부합</div>
      <p class="text-sm text-slate-600">한국돌봄종사자양성교육원 2026년도 상반기 정규 240시간 교육생을 모집합니다. HeyGen AI 가상강사 VOD 시청 및 대학병원 협약 요양병원 1:1 실습 연계 혜택을 누려보세요!</p>
      <div class="bg-emerald-50 border border-emerald-200 rounded p-2 text-xs text-emerald-900 font-semibold">
        • 접수 기간: 상시 접수 (기수별 선착순 마감)<br/>
        • 혜택: CBT 모의고사 무제한 및 실습평가서 무료 심사
      </div>
    </div>`,
    linkUrl: '/curriculum',
    target: 'ALL',
    showOnWeb: true,
    showOnMobile: true,
    positionX: 40,
    positionY: 100,
    width: 480,
    priority: 100,
    allowHideToday: true,
    startsAt: new Date('2026-01-01T00:00:00Z'),
    endsAt: new Date('2026-12-31T23:59:59Z'),
    isActive: true,
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    title: '간병 10대 골든 룰 숏폼 실기 무료 시청',
    contentHtml: `<div class="p-3 text-slate-800 space-y-2">
      <div class="font-bold text-base text-indigo-800">📱 탈건착환, q2hr 체변 핵심 1분 요약</div>
      <p class="text-sm text-slate-600">현장 임상에서 가장 중요한 10대 골든 룰을 HeyGen AI 전문강사 영상으로 무료 시청하실 수 있습니다.</p>
    </div>`,
    linkUrl: '/tv24',
    target: 'ALL',
    showOnWeb: true,
    showOnMobile: true,
    positionX: 540,
    positionY: 100,
    width: 420,
    priority: 80,
    allowHideToday: true,
    startsAt: new Date('2026-01-01T00:00:00Z'),
    endsAt: new Date('2026-12-31T23:59:59Z'),
    isActive: true,
  },
];
