import React, { useState, useEffect } from 'react';
import {
  Card,
  Input,
  Button,
  Tag,
  Progress,
  Badge,
  Select,
  Modal,
  notification,
  Tooltip,
} from 'antd';
import {
  PhoneCall,
  PhoneOff,
  User,
  ShieldCheck,
  Award,
  Clock,
  Send,
  Save,
  Search,
  Eye,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import {
  MOCK_CUSTOMER_PROFILES,
  MOCK_COUNSELING_TICKETS,
  maskPhoneNumber,
  formatPriceKRW,
} from '@ecare24/utils';
import { CustomerProfile, CounselingTicket, CallCategory } from '@ecare24/types';
import UiBadge from '../../components/UiBadge';

export const CallCenterScreen: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>(MOCK_CUSTOMER_PROFILES);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [unmaskedMap, setUnmaskedMap] = useState<Record<string, boolean>>({});

  // CTI 전화 상태 (IDLE, RINGING, CONNECTED)
  const [ctiState, setCtiState] = useState<'IDLE' | 'RINGING' | 'CONNECTED'>('IDLE');
  const [callDuration, setCallDuration] = useState(0);

  // 티켓 작성 폼
  const [ticketCategory, setTicketCategory] = useState<CallCategory>('COURSE_INQUIRY');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMemo, setTicketMemo] = useState('');
  const [ticketLogs, setTicketLogs] = useState<CounselingTicket[]>(MOCK_COUNSELING_TICKETS);

  const selectedCustomer =
    customers.find((c) => c.id === selectedCustomerId) || customers[0];

  // 통화 타이머
  useEffect(() => {
    let timer: any;
    if (ctiState === 'CONNECTED') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [ctiState]);

  // 키보드 단축키 핸들러 (Alt+1, Alt+2, Alt+3, Alt+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key === '1') {
          e.preventDefault();
          applyTemplate('REFUND');
        } else if (e.key === '2') {
          e.preventDefault();
          applyTemplate('ELIGIBILITY');
        } else if (e.key === '3') {
          e.preventDefault();
          applyTemplate('CERT_RESEND');
        } else if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          handleSaveTicket();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCustomer, ticketCategory, ticketSubject, ticketMemo]);

  // CTI 가상 전화 인입 시뮬레이터
  const simulateInboundCall = (targetIndex = 1) => {
    const incomingCustomer = customers[targetIndex % customers.length];
    setSelectedCustomerId(incomingCustomer.id);
    setCtiState('RINGING');
    notification.info({
      message: '📞 [CTI 인입] 전화가 걸려왔습니다!',
      description: `발신번호: ${incomingCustomer.phoneNumber} (${incomingCustomer.fullName} 수강생) 매칭 성공!`,
      duration: 3,
    });
  };

  const handleAnswerCall = () => {
    setCtiState('CONNECTED');
    setTicketSubject(`[인입 상담] ${selectedCustomer.fullName} 회원 과정 문의`);
  };

  const handleHangupCall = () => {
    setCtiState('IDLE');
    notification.success({
      message: '통화 종료',
      description: `총 통화시간: ${Math.floor(callDuration / 60)}분 ${callDuration % 60}초`,
    });
  };

  // 템플릿 자동 적용
  const applyTemplate = (type: 'REFUND' | 'ELIGIBILITY' | 'CERT_RESEND') => {
    if (type === 'REFUND') {
      setTicketCategory('REFUND');
      setTicketSubject('[환불 문의] 수강료 환불 규정 및 결제 취소 안내');
      setTicketMemo(
        `[수강료 환불 안내 템플릿 적용]\n- 수강 시작 전: 100% 전액 환불\n- Step 1 진도율 3분의 1 미만: 3분의 2 환불\n- Step 1 진도율 2분의 1 초과: 환불 불가 규정 구두 안내 완료.\n- 환불 계좌 확인 및 신청서 접수 대기 중.`
      );
      notification.info({ message: 'Alt+1 환불 템플릿 적용됨' });
    } else if (type === 'ELIGIBILITY') {
      setTicketCategory('COURSE_INQUIRY');
      setTicketSubject('[응시자격 미달] Step 2 실기 진도율 및 실습일지 미충족 안내');
      setTicketMemo(
        `[자격시험 응시요건 미충족 안내 템플릿 적용]\n- 고객 현황: 현재 ${selectedCustomer.currentCourseTitle} 수강 중\n- 미충족 사유: Step 2 실기 진도율 80% 미달(현재 ${selectedCustomer.stepProgressPercent}%) 및 지도자 서명 실습일지 미제출\n- 안내 내용: 실기 4K 영상 1.5배속 이내 완강 후 실습일지 업로드 요망 안내함.`
      );
      notification.info({ message: 'Alt+2 응시자격 미달 템플릿 적용됨' });
    } else if (type === 'CERT_RESEND') {
      setTicketCategory('CERT_VERIFICATION');
      setTicketSubject('[알림톡 재발송] 모바일 자격증 QR 검증 링크 재전송');
      setTicketMemo(
        `[카카오 알림톡 재발송 템플릿 적용]\n- 발급된 자격증 번호: ${selectedCustomer.certificates[0]?.certificateNo || '신규 발급'}\n- 수신 번호: ${selectedCustomer.phoneNumber}\n- 2D QR 모바일 지갑 검증 링크(https://ecare24.kr/v/...) 즉시 전송 완료.`
      );
      notification.info({ message: 'Alt+3 모바일 자격증 알림톡 발송 완료' });
    }
  };

  // 상담 티켓 저장 (Alt + S)
  const handleSaveTicket = () => {
    if (!ticketSubject.trim()) {
      notification.warning({ message: '상담 제목을 입력해 주세요.' });
      return;
    }
    const newTicket: CounselingTicket = {
      id: `ticket-${Date.now()}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.fullName,
      agentId: 'agent-01',
      agentName: '김상담 상담원',
      inboundNumber: selectedCustomer.phoneNumber,
      category: ticketCategory,
      status: 'RESOLVED',
      subject: ticketSubject,
      content: ticketMemo || '특이사항 없음',
      durationSeconds: callDuration || 45,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    setTicketLogs([newTicket, ...ticketLogs]);
    setTicketSubject('');
    setTicketMemo('');
    setCtiState('IDLE');
    notification.success({
      message: '✅ [Alt+S] 상담 티켓이 성공적으로 저장되었습니다!',
      description: '고객 히스토리에 반영되었으며 다음 호 인입 대기 상태로 전환되었습니다.',
    });
  };

  // 전화번호 마스킹 해제 (감사 로그 대상)
  const toggleUnmask = (customerId: string) => {
    setUnmaskedMap((prev) => ({ ...prev, [customerId]: !prev[customerId] }));
    notification.warning({
      message: '🔒 [보안 감사 로그] 개인정보 열람 기록',
      description: `상담원(agent-01)이 고객(${selectedCustomer.fullName})의 실제 전화번호를 마스킹 해제하여 조회했습니다.`,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden text-slate-800">
      {/* ====================================================================
          글로벌 헤더 바 (P21-SEC00)
          ==================================================================== */}
      <header
        data-serial-id="P21-SEC00-BAR01"
        className="bg-slate-900 text-white px-5 py-2.5 flex items-center justify-between border-b border-slate-800 shadow-md shrink-0"
      >
        <div className="flex items-center gap-4">
          <UiBadge serialId="P21-SEC00-TIT01" label="[P21-SEC00-TIT01]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow">
                eC
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                ecare24 콜센터 CS 원스크린
              </span>
            </div>
          </UiBadge>

          {/* 통합 검색창 */}
          <UiBadge serialId="P21-SEC00-INP01" label="[P21-SEC00-INP01]">
            <Input
              prefix={<Search className="w-4 h-4 text-slate-400" />}
              placeholder="회원명 / 전화번호 / 자격증 번호 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-72 bg-slate-800 border-slate-700 text-white placeholder-slate-400"
              style={{ background: '#1e293b', color: '#fff', borderColor: '#334155' }}
            />
          </UiBadge>
        </div>

        {/* CTI 상태 컨트롤 & 시뮬레이터 */}
        <div className="flex items-center gap-3">
          <UiBadge serialId="P21-SEC00-BTN01" label="[P21-SEC00-BTN01]">
            <Button
              type="primary"
              size="small"
              onClick={() => simulateInboundCall(1)}
              className="bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold"
            >
              📞 CTI 가상 전화 인입 시뮬레이션
            </Button>
          </UiBadge>

          <UiBadge serialId="P21-SEC00-STA01" label="[P21-SEC00-STA01]">
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  ctiState === 'CONNECTED'
                    ? 'bg-emerald-400 animate-pulse'
                    : ctiState === 'RINGING'
                    ? 'bg-amber-400 animate-ping'
                    : 'bg-slate-400'
                }`}
              />
              <span className="text-xs font-bold text-slate-200">
                {ctiState === 'CONNECTED'
                  ? `통화중 (${Math.floor(callDuration / 60)}:${(callDuration % 60)
                      .toString()
                      .padStart(2, '0')})`
                  : ctiState === 'RINGING'
                  ? '전화 벨 울림...'
                  : 'CTI 대기중'}
              </span>

              {ctiState === 'RINGING' && (
                <Button
                  size="small"
                  type="primary"
                  className="bg-emerald-500 hover:bg-emerald-400 text-xs px-2 h-6"
                  onClick={handleAnswerCall}
                >
                  수신
                </Button>
              )}
              {ctiState === 'CONNECTED' && (
                <Button
                  size="small"
                  danger
                  type="primary"
                  className="text-xs px-2 h-6"
                  onClick={handleHangupCall}
                >
                  종료
                </Button>
              )}
            </div>
          </UiBadge>

          {/* 단축키 가이드 툴팁 */}
          <Tooltip title="단축키 안내: Alt+1(환불), Alt+2(응시자격), Alt+3(알림톡), Alt+S(저장), Alt+I(UI inspect)">
            <Tag color="purple" className="cursor-pointer text-xs font-mono font-bold">
              단축키: Alt+1~3 / Alt+S
            </Tag>
          </Tooltip>

          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700 text-xs text-slate-300">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>상담 1팀 김상담 (내선 104)</span>
          </div>
        </div>
      </header>

      {/* ====================================================================
          3분할 원스크린 레이아웃 본문 (P21)
          ==================================================================== */}
      <div className="flex-1 flex overflow-hidden p-3 gap-3">
        {/* ------------------------------------------------------------------
            1열: 회원 / 환자 통합 프로필 (30%) - P21-SEC01
            ------------------------------------------------------------------ */}
        <div
          data-serial-id="P21-SEC01-COL01"
          className="w-[30%] flex flex-col gap-3 overflow-y-auto"
        >
          {/* 수강생 선택 탭 리스트 */}
          <UiBadge serialId="P21-SEC01-CRD01" label="[P21-SEC01-CRD01]" className="w-full">
            <Card
              size="small"
              title="인입 수강생 목록 (0.5초 매칭)"
              className="shadow-sm border-slate-200"
              styles={{ header: { background: '#f1f5f9', fontWeight: 700 } }}
            >
              <div className="flex flex-col gap-1.5">
                {customers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCustomerId(c.id)}
                    className={`p-2 rounded-lg cursor-pointer transition flex items-center justify-between border ${
                      c.id === selectedCustomerId
                        ? 'bg-indigo-50 border-indigo-300 font-semibold'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        {c.fullName}
                        <Tag color="blue" className="text-[10px]">
                          경력 {c.caregiverExperienceYears}년
                        </Tag>
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {unmaskedMap[c.id] ? c.phoneNumber : c.maskedPhoneNumber}
                      </div>
                    </div>
                    {c.certificates.length > 0 && (
                      <Tag color="green" className="text-[10px]">
                        자격보유
                      </Tag>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </UiBadge>

          {/* 선택된 수강생 상세 프로필 카드 */}
          <UiBadge serialId="P21-SEC01-CRD02" label="[P21-SEC01-CRD02]" className="w-full">
            <Card
              size="small"
              title="수강생 기본 정보"
              extra={
                <Button
                  size="small"
                  type="text"
                  icon={<Eye className="w-3.5 h-3.5 text-indigo-600" />}
                  onClick={() => toggleUnmask(selectedCustomer.id)}
                  className="text-xs text-indigo-600"
                >
                  {unmaskedMap[selectedCustomer.id] ? '마스킹 처리' : '마스킹 해제 (감사)'}
                </Button>
              }
              className="shadow-sm border-slate-200"
              styles={{ header: { background: '#f8fafc', fontWeight: 700 } }}
            >
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">성명 / 생년월일</span>
                  <span className="font-bold text-slate-800">
                    {selectedCustomer.fullName} ({selectedCustomer.birthDate})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">연락처 (CTI 매칭)</span>
                  <span className="font-mono font-bold text-indigo-700">
                    {unmaskedMap[selectedCustomer.id]
                      ? selectedCustomer.phoneNumber
                      : selectedCustomer.maskedPhoneNumber}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">PASS 본인인증</span>
                  <span>
                    {selectedCustomer.identityVerified ? (
                      <Tag color="success" className="text-[10px]">
                        인증 완료 (CI 정상)
                      </Tag>
                    ) : (
                      <Tag color="warning" className="text-[10px]">
                        미인증
                      </Tag>
                    )}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">요양보호사 자격</span>
                  <span className="font-semibold text-slate-700">
                    {selectedCustomer.hasNurseAideCert
                      ? `보유 (${selectedCustomer.nurseAideCertNo})`
                      : '미보유'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">총 누적 이수시간</span>
                  <span className="font-bold text-emerald-600">
                    {selectedCustomer.totalCompletedHours}시간 이수 완료
                  </span>
                </div>
              </div>
            </Card>
          </UiBadge>

          {/* 최근 통화 / 상담 히스토리 요약 */}
          <UiBadge serialId="P21-SEC01-CRD03" label="[P21-SEC01-CRD03]" className="w-full">
            <Card
              size="small"
              title="최근 상담 이력 (히스토리)"
              className="shadow-sm border-slate-200"
              styles={{ header: { background: '#f8fafc', fontWeight: 700 } }}
            >
              <div className="space-y-2 text-xs">
                {ticketLogs
                  .filter((t) => t.customerId === selectedCustomer.id)
                  .slice(0, 3)
                  .map((t) => (
                    <div
                      key={t.id}
                      className="p-2 bg-slate-50 rounded border border-slate-200"
                    >
                      <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                        <span>{t.createdAt}</span>
                        <Tag color="cyan" className="text-[9px]">
                          {t.category}
                        </Tag>
                      </div>
                      <div className="font-bold text-slate-800 mt-0.5">{t.subject}</div>
                      <div className="text-slate-600 text-[11px] mt-1 line-clamp-2">
                        {t.content}
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </UiBadge>
        </div>

        {/* ------------------------------------------------------------------
            2열: 16대 질환 수강 / 자격 현황 (40%) - P21-SEC02
            ------------------------------------------------------------------ */}
        <div
          data-serial-id="P21-SEC02-COL02"
          className="w-[40%] flex flex-col gap-3 overflow-y-auto"
        >
          {/* 현재 수강 과정 & 4단계 진도율 바 */}
          <UiBadge serialId="P21-SEC02-CRD01" label="[P21-SEC02-CRD01]" className="w-full">
            <Card
              size="small"
              title="현재 수강 과정 및 4단계 실시간 진도율"
              className="shadow-sm border-slate-200"
              styles={{ header: { background: '#e0e7ff', fontWeight: 800 } }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-indigo-900">
                    {selectedCustomer.currentCourseTitle || '수강 중인 과정 없음'}
                  </span>
                  <Tag color="purple">
                    현재 Step {selectedCustomer.currentStep} 진행 중
                  </Tag>
                </div>

                {/* 4단계 스텝 인디케이터 바 */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded bg-emerald-50 border border-emerald-300">
                    <div className="text-[11px] text-emerald-800 font-bold">Step 1 교안</div>
                    <div className="text-emerald-600 font-extrabold">100% 완료</div>
                    <div className="text-[9px] text-slate-500">SNUBH 인정: 18.5h</div>
                  </div>
                  <div
                    className={`p-2 rounded border ${
                      selectedCustomer.currentStep >= 2
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="text-[11px] font-bold">Step 2 실기</div>
                    <div className="font-extrabold">
                      {selectedCustomer.currentStep >= 2
                        ? `${selectedCustomer.stepProgressPercent}%`
                        : '미시작'}
                    </div>
                    <div className="text-[9px] text-slate-500">4K 영상+실습일지</div>
                  </div>
                  <div
                    className={`p-2 rounded border ${
                      selectedCustomer.currentStep >= 3
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="text-[11px] font-bold">Step 3 모의고사</div>
                    <div className="font-extrabold">
                      {selectedCustomer.currentStep >= 3 ? '85점 (통과)' : '대기'}
                    </div>
                    <div className="text-[9px] text-slate-500">OMR CBT 풀이</div>
                  </div>
                  <div
                    className={`p-2 rounded border ${
                      selectedCustomer.currentStep >= 4
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="text-[11px] font-bold">Step 4 자격시험</div>
                    <div className="font-extrabold">
                      {selectedCustomer.certificates.length > 0 ? '합격' : '미응시'}
                    </div>
                    <div className="text-[9px] text-slate-500">과락(40점) 판정</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>전체 필수 이수시간 진행률 (80시간 기준)</span>
                    <span className="font-bold text-indigo-700">
                      {selectedCustomer.totalCompletedHours} / 80시간 (
                      {Math.round((selectedCustomer.totalCompletedHours / 80) * 100)}%)
                    </span>
                  </div>
                  <Progress
                    percent={Math.round((selectedCustomer.totalCompletedHours / 80) * 100)}
                    strokeColor="#4f46e5"
                    size="small"
                  />
                </div>
              </div>
            </Card>
          </UiBadge>

          {/* 취득 민간자격증 및 직능원 공적 검증 뱃지 */}
          <UiBadge serialId="P21-SEC02-CRD02" label="[P21-SEC02-CRD02]" className="w-full">
            <Card
              size="small"
              title="취득 자격증 진위 및 직능원(pqi.or.kr) 등록 현황"
              className="shadow-sm border-slate-200"
              styles={{ header: { background: '#f8fafc', fontWeight: 700 } }}
            >
              {selectedCustomer.certificates.length > 0 ? (
                <div className="space-y-3">
                  {selectedCustomer.certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-3 bg-gradient-to-r from-slate-50 to-indigo-50/50 rounded-lg border border-indigo-200 relative"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900">
                              {cert.qualificationName}
                            </span>
                            {cert.status === 'VALID' ? (
                              <Tag color="success" className="font-bold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> 정상 인증
                              </Tag>
                            ) : (
                              <Tag color="warning" className="font-bold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> 보수교육 갱신 대상
                              </Tag>
                            )}
                          </div>
                          <div className="text-xs font-mono text-slate-600 mt-1">
                            등록번호: {cert.certificateNo}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                            직능원 공적번호: {cert.registryNo} | 취득점수: {cert.score}점
                          </div>
                        </div>

                        {/* 2D QR 검증 링크 */}
                        <div className="text-center">
                          <div className="w-12 h-12 bg-white p-1 border border-slate-300 rounded shadow-sm flex items-center justify-center font-mono text-[8px] text-slate-400">
                            [2D QR]
                          </div>
                          <span className="text-[10px] text-indigo-600 block mt-0.5">
                            검증 토큰
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 text-xs">
                        <span className="text-slate-500">
                          유효기간: {cert.issuedAt} ~ {cert.expiryDate} (2년)
                        </span>
                        <Button
                          size="small"
                          type="link"
                          onClick={() => applyTemplate('CERT_RESEND')}
                          className="text-xs text-indigo-600 p-0 font-semibold"
                        >
                          📲 알림톡 QR 링크 재전송
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  현재 취득 완료된 자격증이 없습니다. (자격시험 응시 대기 중)
                </div>
              )}
            </Card>
          </UiBadge>

          {/* 16개 질환군 편성 매트릭스 간략 조회 */}
          <UiBadge serialId="P21-SEC02-CRD03" label="[P21-SEC02-CRD03]" className="w-full">
            <Card
              size="small"
              title="16개 질환군 커리큘럼 이수 가이드 (상담 참고용)"
              className="shadow-sm border-slate-200"
              styles={{ header: { background: '#f8fafc', fontWeight: 700 } }}
            >
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-800">01. 신경계 (뇌졸중)</div>
                  <div className="text-[11px] text-slate-500">80h (이론40/실기20/실습20)</div>
                  <div className="text-[10px] text-indigo-600">핵심: 탈건착환, 휠체어이승</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-800">05. 소화기 (경관유동식)</div>
                  <div className="text-[11px] text-slate-500">90h (이론40/실기25/실습25)</div>
                  <div className="text-[10px] text-indigo-600">핵심: 30~45도 반좌위, 잔류량</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-800">06. 비뇨기 (신부전/폴리)</div>
                  <div className="text-[11px] text-slate-500">80h (이론40/실기20/실습20)</div>
                  <div className="text-[10px] text-indigo-600">핵심: 유린백 방광 하단 거치</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-800">13. 노인성 (와상환자)</div>
                  <div className="text-[11px] text-slate-500">80h (이론40/실기20/실습20)</div>
                  <div className="text-[10px] text-indigo-600">핵심: q2hr 체변, 욕창방지</div>
                </div>
              </div>
            </Card>
          </UiBadge>
        </div>

        {/* ------------------------------------------------------------------
            3열: 실시간 상담 티켓 / 메모 작성 (30%) - P21-SEC03
            ------------------------------------------------------------------ */}
        <div
          data-serial-id="P21-SEC03-COL03"
          className="w-[30%] flex flex-col gap-3 overflow-y-auto"
        >
          <UiBadge serialId="P21-SEC03-CRD01" label="[P21-SEC03-CRD01]" className="w-full">
            <Card
              size="small"
              title="실시간 상담 티켓 작성 & 템플릿"
              extra={
                <Tag color={ctiState === 'CONNECTED' ? 'green' : 'default'}>
                  {ctiState === 'CONNECTED' ? '통화 중 작성' : '일반 메모'}
                </Tag>
              }
              className="shadow-sm border-slate-200"
              styles={{ header: { background: '#f1f5f9', fontWeight: 800 } }}
            >
              <div className="space-y-3">
                {/* 1클릭 템플릿 버튼 모음 */}
                <div>
                  <div className="text-xs font-bold text-slate-600 mb-1.5 flex items-center justify-between">
                    <span>원클릭 상담 템플릿</span>
                    <span className="text-[10px] text-slate-400">단축키 지원</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <UiBadge serialId="P21-SEC03-BTN01" label="[Alt+1]">
                      <Button
                        size="small"
                        onClick={() => applyTemplate('REFUND')}
                        className="text-[11px] w-full"
                      >
                        환불 규정
                      </Button>
                    </UiBadge>
                    <UiBadge serialId="P21-SEC03-BTN02" label="[Alt+2]">
                      <Button
                        size="small"
                        onClick={() => applyTemplate('ELIGIBILITY')}
                        className="text-[11px] w-full"
                      >
                        응시자격
                      </Button>
                    </UiBadge>
                    <UiBadge serialId="P21-SEC03-BTN03" label="[Alt+3]">
                      <Button
                        size="small"
                        onClick={() => applyTemplate('CERT_RESEND')}
                        className="text-[11px] w-full"
                      >
                        알림톡 QR
                      </Button>
                    </UiBadge>
                  </div>
                </div>

                {/* 임상 전문 약어 자동삽입 칩 */}
                <div>
                  <div className="text-[11px] text-slate-500 mb-1">임상 약어 칩 (클릭 시 삽입)</div>
                  <div className="flex flex-wrap gap-1">
                    {['[NPO 금식]', '[q2hr 체변]', '[피딩 반좌위]', '[유린백 방광하단]', '[탈건착환]'].map(
                      (tag) => (
                        <span
                          key={tag}
                          onClick={() => setTicketMemo((prev) => prev + ` ${tag} `)}
                          className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.5 rounded border border-slate-300 font-mono"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* 티켓 유형 선택 */}
                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-1">통화 유형</div>
                  <Select
                    value={ticketCategory}
                    onChange={(val) => setTicketCategory(val)}
                    className="w-full text-xs"
                    options={[
                      { value: 'COURSE_INQUIRY', label: '수강 및 커리큘럼 문의' },
                      { value: 'CERT_VERIFICATION', label: '민간자격증 진위 및 발급' },
                      { value: 'PATIENT_MATCHING', label: '환자 질환별 간병사 매칭' },
                      { value: 'REFUND', label: '수강료 환불 및 결제 취소' },
                      { value: 'TECHNICAL', label: '앱/웹 접속 및 CTI 기술지원' },
                    ]}
                  />
                </div>

                {/* 상담 제목 */}
                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-1">상담 제목</div>
                  <UiBadge serialId="P21-SEC03-INP01" label="[P21-SEC03-INP01]" className="w-full">
                    <Input
                      size="small"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="상담 요약 제목 입력 (예: 환불 규정 안내)"
                    />
                  </UiBadge>
                </div>

                {/* 상담 상세 메모 */}
                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-1">상담 상세 내용</div>
                  <UiBadge serialId="P21-SEC03-TXT01" label="[P21-SEC03-TXT01]" className="w-full">
                    <Input.TextArea
                      rows={7}
                      value={ticketMemo}
                      onChange={(e) => setTicketMemo(e.target.value)}
                      placeholder="상담 세부 내용을 입력하세요... (Alt+1~3 템플릿 사용 가능)"
                      className="text-xs font-sans leading-relaxed"
                    />
                  </UiBadge>
                </div>

                {/* 저장 CTA 버튼 (Alt + S) */}
                <UiBadge serialId="P21-SEC03-BTN04" label="[P21-SEC03-BTN04]" className="w-full">
                  <Button
                    type="primary"
                    block
                    icon={<Save className="w-4 h-4" />}
                    onClick={handleSaveTicket}
                    className="bg-indigo-600 hover:bg-indigo-500 font-bold h-9 text-xs"
                  >
                    [Alt + S] 상담 저장 및 대기 전환
                  </Button>
                </UiBadge>
              </div>
            </Card>
          </UiBadge>
        </div>
      </div>
    </div>
  );
};

export default CallCenterScreen;
