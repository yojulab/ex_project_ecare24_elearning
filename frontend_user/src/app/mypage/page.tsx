'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  Award,
  Headphones,
  User,
  PlayCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Copy,
} from 'lucide-react';
import UiBadge from '../../components/UiBadge';

const API_BASE = 'http://localhost:30013/api/v1';

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'COURSES' | 'PAYMENTS' | 'CERTS' | 'INQUIRY' | 'PROFILE'>('SUMMARY');
  const [summary, setSummary] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 데모 학생 계정 로그인 세션 획득
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ loginId: 'student01', password: 'password123!' }),
        });
        if (loginRes.ok) {
          const { accessToken } = await loginRes.json();
          const headers = { Authorization: `Bearer ${accessToken}` };

          // 1. 요약
          const sRes = await fetch(`${API_BASE}/me/summary`, { headers });
          if (sRes.ok) setSummary(await sRes.json());

          // 2. 수강 과정
          const cRes = await fetch(`${API_BASE}/me/courses`, { headers });
          if (cRes.ok) setCourses(await cRes.json());

          // 3. 납부 내역
          const pRes = await fetch(`${API_BASE}/me/payments`, { headers });
          if (pRes.ok) setPayments(await pRes.json());

          // 4. 자격증 내역
          const certRes = await fetch(`${API_BASE}/me/certificates`, { headers });
          if (certRes.ok) {
            const certData = await certRes.json();
            setCerts(certData.certificates || []);
          }
        }
      } catch (e) {
        console.warn('API 연동 대기 (오프라인 모드):', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const copyAccount = () => {
    navigator.clipboard.writeText('신한은행 110-542-889900 (예금주: 한국돌봄종사자양성교육원)');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPageInfo = () => {
    switch (activeTab) {
      case 'SUMMARY': return { name: '마이페이지 현황 요약', code: 'P10' };
      case 'COURSES': return { name: '수강 진행 상황', code: 'P11' };
      case 'PAYMENTS': return { name: '수강료 납부 상황', code: 'P12' };
      case 'CERTS': return { name: '자격증 발급 상황', code: 'P13' };
      case 'INQUIRY': return { name: '상담/문의 내역', code: 'P14' };
      case 'PROFILE': return { name: '회원정보 관리', code: 'P15' };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div
      className="max-w-7xl mx-auto px-4 py-8"
      data-service-name="한국돌봄종사자양성교육원"
      data-page-name={`${pageInfo.name} (${pageInfo.code})`}
    >
      {/* 1. 상단 환영 및 요약 배너 */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl mb-8 border border-indigo-900/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold">
              돌봄 수강생 전용 포털
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: student01</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {summary?.user?.fullName || '김영희'} 돌봄교육생님의 마이페이지
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            수강 진행률, 무통장 납부 상태, 현장 실습평가 및 공인 자격증 발급 현황을 한곳에서 관리합니다.
          </p>
        </div>

        {summary?.recentEnrollment && (
          <UiBadge serialId="P10-SEC01-BTN01" label="[P10-SEC01-BTN01]">
            <a
              href="/curriculum"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 transition"
            >
              <PlayCircle className="w-5 h-5" />
              <span>최근 강의 1초 이어보기</span>
            </a>
          </UiBadge>
        )}
      </div>

      {/* 2. 메인 2열 레이아웃 (좌측 서브 메뉴 탭 + 우측 콘텐츠) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 좌측 서브 메뉴 사이드바 */}
        <div className="lg:col-span-1 space-y-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm space-y-1">
            <UiBadge serialId="P10-TAB-SUMMARY" label="[P10-TAB-SUMMARY]">
              <button
                onClick={() => setActiveTab('SUMMARY')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition ${
                  activeTab === 'SUMMARY'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>나의 현황 요약</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            </UiBadge>

            <UiBadge serialId="P11-TAB-COURSES" label="[P11-TAB-COURSES]">
              <button
                onClick={() => setActiveTab('COURSES')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition ${
                  activeTab === 'COURSES'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4" />
                  <span>수강 진행 상황</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            </UiBadge>

            <UiBadge serialId="P12-TAB-PAYMENTS" label="[P12-TAB-PAYMENTS]">
              <button
                onClick={() => setActiveTab('PAYMENTS')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition ${
                  activeTab === 'PAYMENTS'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4" />
                  <span>수강료 납부 상황</span>
                </div>
                {summary?.stats?.pendingPaymentCount > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {summary.stats.pendingPaymentCount}
                  </span>
                )}
              </button>
            </UiBadge>

            <UiBadge serialId="P13-TAB-CERTS" label="[P13-TAB-CERTS]">
              <button
                onClick={() => setActiveTab('CERTS')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition ${
                  activeTab === 'CERTS'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4" />
                  <span>자격증 발급 상황</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            </UiBadge>

            <UiBadge serialId="P14-TAB-INQUIRY" label="[P14-TAB-INQUIRY]">
              <button
                onClick={() => setActiveTab('INQUIRY')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition ${
                  activeTab === 'INQUIRY'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Headphones className="w-4 h-4" />
                  <span>1:1 상담 / 문의 내역</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            </UiBadge>

            <UiBadge serialId="P15-TAB-PROFILE" label="[P15-TAB-PROFILE]">
              <button
                onClick={() => setActiveTab('PROFILE')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition ${
                  activeTab === 'PROFILE'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" />
                  <span>회원정보 & 실버설정</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            </UiBadge>
          </div>

          {/* 고객센터 안내 카드 */}
          <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-indigo-600" />
              <span>돌봄 수강생 핫라인</span>
            </div>
            <p>수강 신청 및 입금 확인 문의:</p>
            <div className="text-base font-extrabold text-indigo-700">1588-2424</div>
            <p className="text-[11px] text-slate-400">평일 09:00 ~ 18:00 (점심 12:00~13:00)</p>
          </div>
        </div>

        {/* 우측 메인 콘텐츠 뷰 */}
        <div className="lg:col-span-3 space-y-6">
          {/* TAB 1: 나의 현황 요약 */}
          {activeTab === 'SUMMARY' && (
            <div className="space-y-6">
              {/* 3대 요약 통계 카드 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 mb-1">수강 중인 교육과정</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {summary?.stats?.enrolledCount || 1}개
                  </div>
                  <div className="text-xs text-emerald-600 font-medium mt-1">
                    정규 240시간 교육과정 진행 중
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 mb-1">무통장 납부 상태</div>
                  <div className="text-2xl font-bold text-amber-600">
                    {summary?.stats?.pendingPaymentCount > 0 ? '입금대기 1건' : '완납 승인'}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">입금확인 시 자동 수강 승인</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 mb-1">취득 자격증</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {summary?.stats?.certificateCount || 0}건
                  </div>
                  <div className="text-xs text-slate-400 mt-1">현장 실습평가 80점 이상 시 발급</div>
                </div>
              </div>

              {/* 현재 학습 중인 대표 과정 카드 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100">
                      정규 공인과정
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2">
                      {summary?.recentEnrollment?.course?.title || '돌봄종사자양성자 정규 통합과정'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      총 240시간 규격 (이론 100시간 + 실기 60시간 + 요양병원 현장실습 80시간)
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                    학습 진행 중
                  </span>
                </div>

                {/* 진도율 프로그레스 바 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">전체 학습 진도율</span>
                    <span className="text-indigo-600">1단계 이론 이수 중 (45%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-indigo-600 h-3 rounded-full transition-all duration-500" style={{ width: '45%' }}></div>
                  </div>
                </div>

                {/* HeyGen AI 실습영상 안내 */}
                <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">
                        대학병원 임상 간호사 AI 튜터 (HeyGen 교육영상)
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        10대 골든 룰(체변, L-tube 피딩, 유린백 거치, 석션 15초) 실기 VOD
                      </div>
                    </div>
                  </div>
                  <a
                    href="/curriculum"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg font-bold text-xs shrink-0"
                  >
                    강의실 입장
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 수강 진행 상황 */}
          {activeTab === 'COURSES' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span>내 수강 과정 목록 ({courses.length || 1}개)</span>
                </h3>

                <div className="divide-y divide-slate-100">
                  <div className="py-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-indigo-600">총 240시간 규격</span>
                        <h4 className="text-base font-bold text-slate-900">돌봄종사자양성자 정규 통합과정</h4>
                        <p className="text-xs text-slate-500">수강 기간: 180일 (2026.10.19 ~ 2027.04.19)</p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                        이수 진행 중
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <div className="text-slate-500 text-[11px]">Step 1. 이론교안</div>
                        <div className="font-bold text-indigo-600 mt-1">45% 완료</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <div className="text-slate-500 text-[11px]">Step 2. 실기 VOD</div>
                        <div className="font-bold text-slate-700 mt-1">HeyGen 시청 중</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <div className="text-slate-500 text-[11px]">Step 3. 모의고사</div>
                        <div className="font-bold text-slate-400 mt-1">미응시 (대기)</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <div className="text-slate-500 text-[11px]">Step 4. 현장실습</div>
                        <div className="font-bold text-slate-400 mt-1">간호사 평가 대기</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 수강료 납부 상황 */}
          {activeTab === 'PAYMENTS' && (
            <div className="space-y-6">
              {/* 무통장 입금 계좌 안내 카드 */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                      수강료 무통장 입금계좌 안내
                    </span>
                    <h4 className="text-lg font-bold text-amber-950 mt-1">
                      신한은행 110-542-889900
                    </h4>
                    <p className="text-xs text-amber-900 mt-0.5">
                      예금주: <span className="font-bold">(주)한국돌봄종사자양성교육원</span>
                    </p>
                  </div>
                  <UiBadge serialId="P12-SEC01-BTN01" label="[P12-SEC01-BTN01]">
                    <button
                      onClick={copyAccount}
                      className="bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? '복사완료! ✓' : '계좌번호 복사'}</span>
                    </button>
                  </UiBadge>
                </div>
                <div className="text-[11px] text-amber-800/80 mt-3 border-t border-amber-200 pt-3">
                  ※ 반드시 신청 시 입력한 입금자명으로 입금해 주셔야 30분 이내 자동 승인됩니다.
                </div>
              </div>

              {/* 납부 및 청구 내역 리스트 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <span>수강료 청구 및 결제 내역</span>
                </h3>

                {payments.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    청구 내역이 없습니다.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {payments.map((p) => (
                      <div key={p.id} className="py-4 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{p.memo || '정규 수강료'}</div>
                          <div className="text-slate-400 text-[11px] mt-0.5">주문번호: {p.orderNo}</div>
                          <div className="text-slate-500 text-[11px]">입금자명: {p.depositorName}</div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="text-base font-bold text-slate-900">
                            {p.amount.toLocaleString()}원
                          </div>
                          {p.status === 'PAID' ? (
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                              ✓ 입금확인 완료
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px]">
                              입금대기 (7일 이내)
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: 자격증 발급 상황 */}
          {activeTab === 'CERTS' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <span>공인 자격증 발급 단계 타임라인</span>
              </h3>

              {/* 5단계 타임라인 인포그래픽 */}
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <div className="font-bold text-slate-900">1. 신청 접수</div>
                  <div className="text-[10px] text-emerald-700">완료</div>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <div className="font-bold text-slate-900">2. 수강료 확인</div>
                  <div className="text-[10px] text-emerald-700">입금완료</div>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <Clock className="w-5 h-5 text-indigo-600 mx-auto mb-1 animate-pulse" />
                  <div className="font-bold text-indigo-900">3. 실습 평가</div>
                  <div className="text-[10px] text-indigo-700">간호사 심사진행</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl opacity-60">
                  <div className="w-5 h-5 rounded-full border border-slate-300 mx-auto mb-1 flex items-center justify-center font-bold text-[10px]">4</div>
                  <div className="font-bold text-slate-700">4. 적격 심사</div>
                  <div className="text-[10px] text-slate-400">대기</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl opacity-60">
                  <div className="w-5 h-5 rounded-full border border-slate-300 mx-auto mb-1 flex items-center justify-center font-bold text-[10px]">5</div>
                  <div className="font-bold text-slate-700">5. 자격증 발급</div>
                  <div className="text-[10px] text-slate-400">모바일 QR/지갑</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">★ 자격증 발급 필수 게이트 안내:</div>
                <p>
                  160시간 이론·실기 수료(또는 요양보호사 자격증 소지) 후, 협약 요양병원 현장실습에서 담당 수간호사의
                  <strong>「임상 실습평가서 80점 이상(Pass)」</strong>을 획득해야 직능원 공인 등록번호와 위변조 방지 QR코드가 부착된 자격증이 발급됩니다.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: 1:1 상담 / 문의 */}
          {activeTab === 'INQUIRY' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Headphones className="w-5 h-5 text-indigo-600" />
                <span>1:1 상담 및 문의 내역</span>
              </h3>
              <p className="text-xs text-slate-500">
                수강 과정, 교안, 실습 병원 배정 관련 궁금하신 점을 작성하시면 전문 상담원이 콜센터 시스템을 통해 신속히 답변드립니다.
              </p>
              <div className="py-8 text-center text-slate-400 text-xs">
                현재 등록된 문의 내역이 없습니다. (전화상담 1588-2424)
              </div>
            </div>
          )}

          {/* TAB 6: 회원정보 & 실버설정 */}
          {activeTab === 'PROFILE' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                <span>회원 기본 정보 및 실버 맞춤 설정</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">성명</label>
                  <input
                    type="text"
                    disabled
                    value={summary?.user?.fullName || '김영희'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">로그인 아이디</label>
                  <input
                    type="text"
                    disabled
                    value={summary?.user?.loginId || 'student01'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-mono text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
