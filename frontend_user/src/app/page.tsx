'use client';

import React, { useState } from 'react';
import {
  Brain,
  Wind,
  HeartPulse,
  Bone,
  Apple,
  Droplet,
  Activity,
  ShieldAlert,
  UserCheck,
  Biohazard,
  Gauge,
  Flame,
  Users,
  Sun,
  Smile,
  HelpCircle,
  PlayCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  MapPin,
  Building2,
  ExternalLink,
  ChevronRight,
  Search,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import {
  MOCK_DISEASES,
  MOCK_GOLDEN_RULES,
  formatPriceKRW,
} from '@ecare24/utils';
import UiBadge from '../components/UiBadge';

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain className="w-5 h-5 text-indigo-600" />,
  Wind: <Wind className="w-5 h-5 text-sky-600" />,
  HeartPulse: <HeartPulse className="w-5 h-5 text-rose-600" />,
  Bone: <Bone className="w-5 h-5 text-amber-600" />,
  Apple: <Apple className="w-5 h-5 text-emerald-600" />,
  Droplet: <Droplet className="w-5 h-5 text-blue-600" />,
  Activity: <Activity className="w-5 h-6 text-purple-600" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5 text-red-600" />,
  UserCheck: <UserCheck className="w-5 h-5 text-violet-600" />,
  Biohazard: <Biohazard className="w-5 h-5 text-orange-600" />,
  Gauge: <Gauge className="w-5 h-5 text-cyan-600" />,
  Flame: <Flame className="w-5 h-5 text-amber-600" />,
  Users: <Users className="w-5 h-5 text-teal-600" />,
  Sun: <Sun className="w-5 h-5 text-amber-500" />,
  Smile: <Smile className="w-5 h-5 text-pink-600" />,
  HelpCircle: <HelpCircle className="w-5 h-5 text-indigo-600" />,
};

export default function HomePage() {
  const [guideSearchQuery, setGuideSearchQuery] = useState('');

  // 16대 자격 트랙 검색 필터
  const filteredDiseases = MOCK_DISEASES.filter(
    (d) =>
      d.nameKo.includes(guideSearchQuery) ||
      d.shortDesc.includes(guideSearchQuery) ||
      d.code.toLowerCase().includes(guideSearchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-900">
      {/* ====================================================================
          [P01-SEC00] 원클릭 이어보기 바 (단순화)
          ==================================================================== */}
      <div
        data-serial-id="P01-SEC00-FLT01"
        className="bg-slate-900 text-white px-4 sm:px-8 py-2.5 shadow-md border-b border-slate-800"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">최근 학습 이어보기:</span>
            <strong className="text-emerald-300 font-semibold truncate max-w-[280px] sm:max-w-md">
              [01. 신경계 돌봄 트랙] 뇌졸중 편마비 q2hr 체위변경 실기 VOD
            </strong>
          </div>

          <UiBadge serialId="P01-SEC00-BTN01" label="[P01-SEC00-BTN01]">
            <a
              href="/courses/course-01-neuro"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow shrink-0"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>학습 이어하기 ▷</span>
            </a>
          </UiBadge>
        </div>
      </div>

      {/* ====================================================================
          [P01-SEC01] 히어로 섹션 (단순화 & 핵심 강조)
          ==================================================================== */}
      <section
        data-serial-id="P01-SEC01-HERO"
        className="bg-gradient-to-b from-emerald-50/60 via-slate-50 to-slate-50 pt-12 pb-14 px-4 sm:px-8 border-b border-slate-200"
      >
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <UiBadge serialId="P01-SEC01-BAD01" label="[P01-SEC01-BAD01]">
            <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-900 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>한국돌봄종사자양성교육원 공식 교육포털</span>
            </div>
          </UiBadge>

          <UiBadge serialId="P01-SEC01-TIT01" label="[P01-SEC01-TIT01]">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
              환자의 질환을 정확히 알아야, <br className="hidden sm:inline" />
              <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy">
                안전하고 존엄한 돌봄
              </span>
              이 완성됩니다.
            </h1>
          </UiBadge>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed pt-1">
            <strong>16대 질환군 전문 돌봄 자격 트랙 (각 총 8시간 이수)</strong>
            <br />
            분당서울대학교병원 의학 커리큘럼 기반 돌봄 지침서 및 임상간호사 실습평가 연계
          </p>

          {/* 원클릭 핵심 액션 버튼 */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <UiBadge serialId="P01-SEC01-BTN01" label="[P01-SEC01-BTN01]">
              <a
                href="#courses"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-lg transition text-base"
              >
                <span>돌봄종사자 단일 수강신청 바로가기</span>
                <ChevronRight className="w-5 h-5" />
              </a>
            </UiBadge>

            <UiBadge serialId="P01-SEC01-BTN02" label="[P01-SEC01-BTN02]">
              <a
                href="tel:1588-2424"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-bold px-6 py-3.5 rounded-xl border border-slate-300 transition text-sm shadow-sm"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>입학 전화상담 (1588-2424)</span>
              </a>
            </UiBadge>
          </div>
        </div>
      </section>

      {/* ====================================================================
          [P01-SEC02] 교육체계 안내: 16대 자격 트랙 (각 총 8시간 이수)
          ==================================================================== */}
      <section
        id="curriculum"
        data-serial-id="P01-SEC02-CURR"
        className="max-w-7xl mx-auto px-4 sm:px-8 pt-14"
      >
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>체계적인 임상 돌봄 교육과정</span>
            </div>
            <UiBadge serialId="P01-SEC02-TIT01" label="[P01-SEC02-TIT01]">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                16대 전문 돌봄 자격 트랙 <span className="text-emerald-700">(각 총 8시간)</span>
              </h2>
            </UiBadge>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              각 트랙은 <strong>이론 4시간 + 실기 4시간 = 총 8시간</strong>으로 구성되어 질환별 핵심 임상케어를 단기 집중 이수합니다.
            </p>
          </div>

          {/* 질환 검색 필터창 & 교육체계 상세 바로가기 */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
            <a
              href="/curriculum"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <span>교육 체계 &amp; 수료 절차도 보기</span>
              <ChevronRight className="w-4 h-4" />
            </a>
            <div className="w-full sm:w-64 relative">
              <input
                type="text"
                value={guideSearchQuery}
                onChange={(e) => setGuideSearchQuery(e.target.value)}
                placeholder="질환명 검색 (예: 뇌졸중, 치매)"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* 16대 질환군 트랙 카드 그리드 (각 총 8시간 명시) */}
        <div id="courses" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDiseases.map((disease) => (
            <UiBadge
              key={disease.id}
              serialId={`P01-SEC02-CRD${disease.id.toString().padStart(2, '0')}`}
              label={`[P01-SEC02-CRD${disease.id.toString().padStart(2, '0')}]`}
              className="w-full"
            >
              <div className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      {iconMap[disease.iconName] || <Brain className="w-5 h-5 text-emerald-600" />}
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                      총 8시간 이수
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 font-semibold">{disease.code}</div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug mt-0.5">
                    {disease.nameKo}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {disease.shortDesc}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs flex justify-between text-slate-600">
                    <span>이론 4h + 실기 4h</span>
                    <strong className="text-emerald-700">8시간 트랙</strong>
                  </div>
                </div>

                <div className="mt-3.5 pt-2 border-t border-slate-100">
                  <a
                    href={`/courses/course-${disease.code.slice(0, 2).toLowerCase()}-${
                      disease.code.includes('NEURO')
                        ? 'neuro'
                        : disease.code.includes('GASTRO')
                        ? 'gastro'
                        : disease.code.includes('URO')
                        ? 'uro'
                        : disease.code.includes('PSYCH')
                        ? 'psych'
                        : 'geriatric'
                    }`}
                    className="w-full flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    <span>수강신청 & 과정보기</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </UiBadge>
          ))}
        </div>
      </section>

      {/* ====================================================================
          [P01-SEC03] 교육원 소개 섹션 (ecarecti.co.kr 참조 5대 하위메뉴 포함 관계)
          ==================================================================== */}
      {/* ====================================================================
          [P01-SEC03] 교육원 소개 배너 (/about 별도 페이지 연계)
          ==================================================================== */}
      <section
        id="about"
        data-serial-id="P01-SEC03-ABOUT"
        className="max-w-7xl mx-auto px-4 sm:px-8 pt-16"
      >
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              기관 정보 및 설립 비전
            </span>
            <UiBadge serialId="P01-SEC03-TIT01" label="[P01-SEC03-TIT01]">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                한국돌봄종사자양성교육원 소개
              </h2>
            </UiBadge>
            <p className="text-sm text-slate-600 leading-relaxed pt-1">
              보건복지부 요양보호 표준과 대학병원 임상 전문 간호를 연계하여, 16대 중증 질환별 전문 돌봄 인력을 양성하는 공인 교육기관입니다. 
              (1. 교육원소개 · 2. 대표인사말 · 3. 조직안내 · 4. 오시는길 · 5. 관련사이트)
            </p>
          </div>
          <UiBadge serialId="P01-SEC03-BTN01" label="[P01-SEC03-BTN01]">
            <a
              href="/about"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-3.5 rounded-xl shadow transition text-sm shrink-0"
            >
              <span>교육원소개 전체보기</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </UiBadge>
        </div>
      </section>

      {/* ====================================================================
          [P01-SEC04] 10대 골든 룰 & 돌봄 지침서 퀵 가이드
          ==================================================================== */}
      <section
        data-serial-id="P01-SEC04-GOLD"
        className="max-w-7xl mx-auto px-4 sm:px-8 pt-14"
      >
        <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-emerald-800">
            <div>
              <span className="text-xs font-bold text-emerald-300">필수 임상 안전 원칙</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                현장 압축 10대 골든 룰 (Golden Rules)
              </h2>
            </div>
            <a
              href="/tv24"
              className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              분당서울대병원 690편 지침서 전체보기 ▷
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
            {MOCK_GOLDEN_RULES.map((rule) => (
              <div
                key={rule.id}
                className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800 hover:border-emerald-600 transition"
              >
                <div className="font-extrabold text-emerald-200 text-xs truncate">
                  {rule.title}
                </div>
                <p className="text-[11px] text-emerald-100/70 mt-1 line-clamp-2 leading-tight">
                  {rule.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
