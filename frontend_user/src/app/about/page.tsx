'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  HeartHandshake, 
  Users, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Compass, 
  Award,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import UiBadge from '@/components/UiBadge';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<'intro' | 'greeting' | 'org' | 'map' | 'sites'>('intro');

  const tabs = [
    { id: 'intro', label: '1. 교육원소개', icon: Building2, serialId: 'P10-ABOUT-TAB01' },
    { id: 'greeting', label: '2. 대표인사말', icon: HeartHandshake, serialId: 'P10-ABOUT-TAB02' },
    { id: 'org', label: '3. 조직안내', icon: Users, serialId: 'P10-ABOUT-TAB03' },
    { id: 'map', label: '4. 오시는길', icon: MapPin, serialId: 'P10-ABOUT-TAB04' },
    { id: 'sites', label: '5. 관련사이트', icon: ExternalLink, serialId: 'P10-ABOUT-TAB05' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 상단 브레드크럼 및 헤더 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
            <span>홈</span>
            <span>&gt;</span>
            <span className="text-emerald-700">교육원소개</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <UiBadge serialId="P10-ABOUT-TTL01" label="[P10-ABOUT-TTL01]">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                    院
                  </span>
                  한국돌봄종사자양성교육원 소개
                </h1>
              </UiBadge>
              <p className="mt-2 text-slate-600 font-medium text-sm sm:text-base">
                대한민국 노인 장기요양과 중증 환자 돌봄의 새로운 표준, 현장 임상 중심의 전문 교육기관입니다.
              </p>
            </div>
            <UiBadge serialId="P10-ABOUT-BTN01" label="[P10-ABOUT-BTN01]">
              <a
                href="/curriculum"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-extrabold text-sm hover:bg-emerald-700 shadow-sm transition"
              >
                <span>교육체계(16대 트랙) 바로가기</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </UiBadge>
          </div>

          {/* 5대 하위 탭 네비게이션 (ecarecti.co.kr 구조 1:1 매핑) */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-2 border-t border-slate-100 pt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <UiBadge key={tab.id} serialId={tab.serialId} label={`[${tab.serialId}]`}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-md font-extrabold scale-[1.02]'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                </UiBadge>
              );
            })}
          </div>
        </div>

        {/* 탭별 상세 본문 카드 */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          {/* 1. 교육원소개 */}
          {activeTab === 'intro' && (
            <section className="space-y-8 animate-fadeIn">
              <UiBadge serialId="P10-ABOUT-SEC01" label="[P10-ABOUT-SEC01]">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">Overview</span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">교육원 설립 취지 및 비전</h2>
                </div>
              </UiBadge>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-50/70 border border-emerald-100 p-6 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold mb-4 shadow-sm">
                    01
                  </div>
                  <h3 className="font-extrabold text-lg text-emerald-950 mb-2">임상 중심 전문화</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    단순 일상생활 지원을 넘어, 흡인(석션), 경관영양(피딩), 유린백 배액 관리 등 중증 임상 케어가 가능한 전문 돌봄 인력을 양성합니다.
                  </p>
                </div>

                <div className="bg-teal-50/70 border border-teal-100 p-6 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold mb-4 shadow-sm">
                    02
                  </div>
                  <h3 className="font-extrabold text-lg text-teal-950 mb-2">16대 질환별 맞춤 트랙</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    대학병원 표준 임상 가이드라인 및 전문 돌봄 지침서를 기반으로 각 질환별 8시간(이론 4h + 실기 4h) 집중 자격 교육을 제공합니다.
                  </p>
                </div>

                <div className="bg-blue-50/70 border border-blue-100 p-6 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-4 shadow-sm">
                    03
                  </div>
                  <h3 className="font-extrabold text-lg text-blue-950 mb-2">간호사 실습평가 연계</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    전문 간호사 심사관의 대면 실습평가서 합격(70점 이상)을 필수로 하여, 현장에 즉시 투입 가능한 검증된 인력만을 배출합니다.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h4 className="font-extrabold text-base text-slate-900 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  교육원 핵심 행동 강령 (10대 골든 룰)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span><b>탈건착환</b>: 벗을 땐 건강한 쪽, 입을 땐 마비된 쪽</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span><b>q2hr 체위변경</b>: 욕창 예방을 위한 2시간 주기 체변</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span><b>유린백 거치</b>: 소변백은 항상 방광보다 낮게 유지</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span><b>석션 시간</b>: 1회 카테터 흡인은 15초 이내 제한</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 2. 대표인사말 */}
          {activeTab === 'greeting' && (
            <section className="space-y-6 animate-fadeIn">
              <UiBadge serialId="P10-ABOUT-SEC02" label="[P10-ABOUT-SEC02]">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">Greetings</span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">대표인사말</h2>
                </div>
              </UiBadge>

              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 text-slate-700 space-y-4 leading-relaxed font-medium">
                <p className="text-lg font-bold text-slate-900 leading-snug">
                  "어르신과 환자의 존엄성을 지키고, 보호자의 간병 부담을 덜어주는<br className="hidden sm:inline" />
                  따뜻하고 전문성 높은 돌봄 인재의 산실이 되겠습니다."
                </p>
                <p>
                  안녕하십니까. 한국돌봄종사자양성교육원 원장입니다.
                </p>
                <p>
                  우리 사회는 유례없이 빠른 속도로 초고령 사회에 진입하고 있으며, 치매, 뇌졸중, 파킨슨, 암 등 복합 만성질환을 앓고 계신 어르신들에 대한 전문 돌봄 수요가 폭발적으로 증가하고 있습니다.
                </p>
                <p>
                  그러나 기존의 기초 교육만으로는 종합병원 및 재가 현장에서 요구하는 전문 의료 술기 연계 돌봄(튜브 피딩, 석션, 낙상 방지, 욕창 소독 보조 등)을 충족하기 어려웠습니다.
                </p>
                <p>
                  이에 본 교육원은 의료 현장 중심의 <b>'16대 질환별 전문 돌봄 자격 트랙'</b>을 개설하여, 요양보호사 선생님들과 돌봄 종사자분들이 실무에 바로 투입되어 환자의 안전을 책임지는 당당한 전문가로 거듭나도록 전폭적으로 지원하고 있습니다.
                </p>
                <p>
                  교육생 여러분의 따뜻한 손길과 전문성이 환자와 가족에게 가장 큰 희망이 될 수 있도록 최선의 교육 환경을 약속드립니다. 감사합니다.
                </p>
                <div className="pt-6 border-t border-slate-200 text-right">
                  <span className="text-xs text-slate-500 block">한국돌봄종사자양성교육원</span>
                  <span className="text-lg font-black text-slate-900 mt-1">원 장 &nbsp; 이 &nbsp; 케 &nbsp; 어 &nbsp; 배상</span>
                </div>
              </div>
            </section>
          )}

          {/* 3. 조직안내 */}
          {activeTab === 'org' && (
            <section className="space-y-6 animate-fadeIn">
              <UiBadge serialId="P10-ABOUT-SEC03" label="[P10-ABOUT-SEC03]">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">Organization</span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">교육원 조직 구성도</h2>
                </div>
              </UiBadge>

              {/* 조직도 카드 */}
              <div className="space-y-4">
                <div className="max-w-md mx-auto bg-slate-900 text-white rounded-2xl p-5 text-center shadow-md">
                  <div className="text-xs text-emerald-400 font-extrabold mb-1">HEADQUARTERS</div>
                  <div className="text-xl font-black">원장실 (원장 / 부원장)</div>
                  <div className="text-xs text-slate-400 mt-1">교육원 총괄 경영 및 대외 의료기관 협약</div>
                </div>

                <div className="w-0.5 h-6 bg-slate-300 mx-auto" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center mx-auto mb-3">
                      敎
                    </div>
                    <h4 className="font-extrabold text-base text-slate-900">교무기획팀</h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      • 16대 질환 커리큘럼 개발<br />
                      • 교재 및 영상 콘텐츠 감수<br />
                      • 전문 교수진 위촉 및 관리
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-black flex items-center justify-center mx-auto mb-3">
                      運
                    </div>
                    <h4 className="font-extrabold text-base text-slate-900">교육운영팀</h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      • 수강생 학사 및 출결 관리<br />
                      • LMS / 온라인 강의 플랫폼 운영<br />
                      • CBT 모의고사 시스템 관리
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 font-black flex items-center justify-center mx-auto mb-3">
                      實
                    </div>
                    <h4 className="font-extrabold text-base text-slate-900">임상실습지원팀</h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      • 협력 병원 임상실습 배정<br />
                      • 전담 간호사 실습평가서 심사<br />
                      • 실기 시험장(시뮬레이션룸) 관리
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-black flex items-center justify-center mx-auto mb-3">
                      就
                    </div>
                    <h4 className="font-extrabold text-base text-slate-900">취업연계·자격팀</h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      • 직능원 민간자격 등록증 발급<br />
                      • eCare24 간병 매칭 플랫폼 연동<br />
                      • 요양병원·간병협회 1:1 취업 지원
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 4. 오시는길 */}
          {activeTab === 'map' && (
            <section className="space-y-6 animate-fadeIn">
              <UiBadge serialId="P10-ABOUT-SEC04" label="[P10-ABOUT-SEC04]">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">Location</span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">오시는 길 및 교통편 안내</h2>
                </div>
              </UiBadge>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-100 rounded-2xl border border-slate-300 h-72 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                  <MapPin className="w-12 h-12 text-emerald-600 mb-2" />
                  <span className="font-extrabold text-slate-800 text-base">한국돌봄종사자양성교육원 본원</span>
                  <span className="text-xs mt-1 text-slate-600">서울특별시 영등포구 영등포로 150, 이케어교육빌딩 4층</span>
                  <div className="mt-4 flex gap-2">
                    <a
                      href="https://map.naver.com"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
                    >
                      네이버 지도 보기 ↗
                    </a>
                    <a
                      href="https://map.kakao.com"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-yellow-400 text-slate-900 rounded-lg text-xs font-bold hover:bg-yellow-500"
                    >
                      카카오맵 보기 ↗
                    </a>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 mb-2">
                      <Compass className="w-4 h-4 text-emerald-600" />
                      지하철 이용 시
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• <b>5호선 영등포시장역</b> 4번 출구에서 도보 약 3분</li>
                      <li>• <b>1호선 영등포역</b> 5번 출구에서 영등포시장 방면 도보 약 8분</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      고객센터 및 상담 문의
                    </h4>
                    <p className="text-xs text-slate-600">
                      • 대표전화: <b>1588-2424</b> (평일 09:00 ~ 18:00)<br />
                      • 실습 및 자격 상담: <b>02-2630-2400</b><br />
                      • 팩스 번호: 02-2630-2425
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      주차 안내
                    </h4>
                    <p className="text-xs text-slate-600">
                      • 건물 지하 1~2층 주차장 완비 (수강생 및 내방객 2시간 무료 주차 지원)
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 5. 관련사이트 */}
          {activeTab === 'sites' && (
            <section className="space-y-6 animate-fadeIn">
              <UiBadge serialId="P10-ABOUT-SEC05" label="[P10-ABOUT-SEC05]">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">Family Sites</span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">관련 및 패밀리 사이트 안내</h2>
                </div>
              </UiBadge>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="http://www.ecarecti.co.kr"
                  target="_blank"
                  rel="noreferrer"
                  className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition bg-slate-50 group flex items-start justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">교육기관 연계</span>
                    <h4 className="font-extrabold text-base text-slate-900 mt-2 group-hover:text-emerald-700">이케어 평생교육원 (ecarecti)</h4>
                    <p className="text-xs text-slate-600 mt-1">돌봄종사자 직무 보수교육 및 CTI 통합 상담 솔루션</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </a>

                <a
                  href="http://localhost:30011"
                  target="_blank"
                  rel="noreferrer"
                  className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition bg-slate-50 group flex items-start justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">간호사 심사 포털</span>
                    <h4 className="font-extrabold text-base text-slate-900 mt-2 group-hover:text-indigo-700">eCare24 임상평가 관리센터</h4>
                    <p className="text-xs text-slate-600 mt-1">간호사 전용 실습평가서 온라인 채점 및 합격 판정 CTI</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </a>

                <a
                  href="https://www.pqi.or.kr"
                  target="_blank"
                  rel="noreferrer"
                  className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition bg-slate-50 group flex items-start justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">공식 자격 등록</span>
                    <h4 className="font-extrabold text-base text-slate-900 mt-2 group-hover:text-blue-700">한국직업능력연구원 (민간자격정보서비스)</h4>
                    <p className="text-xs text-slate-600 mt-1">16대 질환 전문돌봄관리사 등록 자격 등록원부 조회</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </a>

                <a
                  href="https://www.longtermcare.or.kr"
                  target="_blank"
                  rel="noreferrer"
                  className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition bg-slate-50 group flex items-start justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">공공 복지 정보</span>
                    <h4 className="font-extrabold text-base text-slate-900 mt-2 group-hover:text-amber-700">국민건강보험 노인장기요양보험</h4>
                    <p className="text-xs text-slate-600 mt-1">장기요양 등급 판정 및 급여 기준 수가 포털</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                </a>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
