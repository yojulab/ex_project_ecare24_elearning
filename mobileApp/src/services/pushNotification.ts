// Push Notification Service Simulator for eCare24 Mobile

export interface PushNotificationItem {
  id: string;
  title: string;
  body: string;
  receivedAt: string;
  type: 'STUDY_REMINDER' | 'CERT_ISSUED' | 'EXAM_ALERT';
  read: boolean;
}

export const pushNotificationService = {
  getNotifications: (): PushNotificationItem[] => {
    return [
      {
        id: 'push-01',
        title: '📢 [오늘의 골든 룰 복습]',
        body: '편마비 환자 옷 입고 벗기 공식: 벗을 땐 건강한 쪽부터, 입을 땐 마비된 쪽부터(탈건착환)!',
        receivedAt: '10분 전',
        type: 'STUDY_REMINDER',
        read: false,
      },
      {
        id: 'push-02',
        title: '🎉 민간자격증 발급 승인 완료',
        body: '신경계 전문간병사 자격증(제2026-004821호)이 발급되었습니다. 지갑에서 확인하세요.',
        receivedAt: '어제',
        type: 'CERT_ISSUED',
        read: true,
      },
    ];
  },
};
