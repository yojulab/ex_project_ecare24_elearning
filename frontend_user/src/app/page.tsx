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
  Calculator,
  ChevronRight,
  Flame as HotIcon,
} from 'lucide-react';
import {
  MOCK_DISEASES,
  MOCK_MVP_COURSES,
  MOCK_GOLDEN_RULES,
  MOCK_CURATED_VIDEOS,
  formatPriceKRW,
} from '@ecare24/utils';
import UiBadge from '../components/UiBadge';

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain className="w-6 h-6 text-indigo-600" />,
  Wind: <Wind className="w-6 h-6 text-sky-600" />,
  HeartPulse: <HeartPulse className="w-6 h-6 text-rose-600" />,
  Bone: <Bone className="w-6 h-6 text-amber-600" />,
  Apple: <Apple className="w-6 h-6 text-emerald-600" />,
  Droplet: <Droplet className="w-6 h-6 text-blue-600" />,
  Activity: <Activity className="w-6 h-6 text-purple-600" />,
  ShieldAlert: <ShieldAlert className="w-6 h-6 text-red-600" />,
  UserCheck: <UserCheck className="w-6 h-6 text-violet-600" />,
  Biohazard: <Biohazard className="w-6 h-6 text-orange-600" />,
  Gauge: <Gauge className="w-6 h-6 text-cyan-600" />,
  Flame: <Flame className="w-6 h-6 text-amber-600" />,
  Users: <Users className="w-6 h-6 text-teal-600" />,
  Sun: <Sun className="w-6 h-6 text-amber-500" />,
  Smile: <Smile className="w-6 h-6 text-pink-600" />,
  HelpCircle: <HelpCircle className="w-6 h-6 text-indigo-600" />,
};

export default function HomePage() {
  const [selectedDiseaseTab, setSelectedDiseaseTab] = useState<'ALL' | 'MVP'>('ALL');
  const [calcWorkDays, setCalcWorkDays] = useState(24);

  const displayedDiseases =
    selectedDiseaseTab === 'MVP'
      ? MOCK_DISEASES.filter((d) => d.isMvp)
      : MOCK_DISEASES;

  return (
    <div className="relative pb-24">
      {/* ====================================================================
          [P01-SEC00] 원클릭 이어보기 플로팅 바 (Principle 2. Resume Bar)
          ==================================================================== */}
      <div
        data-serial-id="P01-SEC00-FLT01"
        className="sticky top-[73px] z-30 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white px-4 sm:px-8 py-3 shadow-lg border-b border-indigo-700/50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-200">
              마지막 공부 이력:
            </span>
            <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
              [01. 신경계] 뇌졸중 편마비 실기 4K 영상 (12분 시청 중)
            </span>
          </div>

          <UiBadge serialId="P01-SEC00-BTN01" label="[P01-SEC00-BTN01]">
            <a
              href="/courses/course-01-neuro"
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold transition shadow-md shrink-0"
            >
              <PlayCircle className="w-4 h-4" />
              <span>원클릭 바로 이어보기 ▷</span>
            </a>
          </UiBadge>
        </div>
      </div>

      {/* ====================================================================
          [P01-SEC01] 히어로 섹션
          ==================================================================== */}
      <section
        data-serial-id="P01-SEC01-HERO"
        className="bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-10 pb-16 px-4 sm:px-8 border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto text-center space-y-5">
          <UiBadge serialId="P01-SEC01-BAD01" label="[P01-SEC01-BAD01]">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-900 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-indigo-200">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>한국직업능력연구원(pqi.or.kr) 등록 민간자격 공식 과정</span>
            </div>
          </UiBadge>

          <UiBadge serialId="P01-SEC01-TIT01" label="[P01-SEC01-TIT01]">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
              환자의 질환을 알아야, <br className="sm:hidden" />
              <span className="text-indigo-600 underline decoration-indigo-300 decoration-wavy">
                안전한 케어
              </span>
              가 가능합니다.
            </h1>
          </UiBadge>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            단순 가사보조를 넘어, <strong>16대 질환군 전문간병사</strong>로 거듭나세요.
            <br />
            이론 심화교안, 4K 실습영상, OMR 모의고사, 자격시험까지 100% 원스톱 지원합니다.
          </p>

          {/* 10대 골든 룰 퀵 배너 */}
          <UiBadge serialId="P01-SEC01-CRD01" label="[P01-SEC01-CRD01]">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 max-w-4xl mx-auto text-left mt-8">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  간병 현장 압축 10대 골든 룰 (Golden Rules) 핵심 체크
                </span>
                <span className="text-xs text-indigo-600 font-bold">임상 지침서 수록</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {MOCK_GOLDEN_RULES.slice(0, 5).map((rule) => (
                  <div
                    key={rule.id}
                    className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-400 transition"
                  >
                    <div className="font-extrabold text-slate-800 text-[11px] truncate">
                      {rule.title}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                      {rule.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </UiBadge>
        </div>
      </section>

      {/* ====================================================================
          [P01-SEC02] 16개 질환군 커리큘럼 탐색 그리드 (DIS-01)
          ==================================================================== */}
      <section
        id="courses"
        data-serial-id="P01-SEC02-GRID"
        className="max-w-7xl mx-auto px-4 sm:px-8 pt-16"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <UiBadge serialId="P01-SEC02-TIT01" label="[P01-SEC02-TIT01]">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                16대 질환군 전문간병사 자격 트랙
              </h2>
            </UiBadge>
            <p className="text-sm text-slate-500 mt-1">
              각 질환별 [이론 교안 + 4K 실습 + 모의고사 + 자격시험] 4단계 필수 이수
            </p>
          </div>

          {/* 탭 토글 필터 */}
          <div className="flex items-center gap-2 bg-slate-200 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setSelectedDiseaseTab('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedDiseaseTab === 'ALL'
                  ? 'bg-white text-indigo-900 shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              전체 16개 질환군
            </button>
            <button
              onClick={() => setSelectedDiseaseTab('MVP')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedDiseaseTab === 'MVP'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ★ MVP 선행 5대 과정
            </button>
          </div>
        </div>

        {/* 16개 질환군 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayedDiseases.map((disease) => (
            <UiBadge
              key={disease.id}
              serialId={`P01-SEC02-CRD${disease.id.toString().padStart(2, '0')}`}
              label={`[P01-SEC02-CRD${disease.id.toString().padStart(2, '0')}]`}
              className="w-full"
            >
              <div
                className={`h-full flex flex-col justify-between p-5 rounded-2xl border transition-all ${
                  disease.isMvp
                    ? 'bg-white border-indigo-200 hover:border-indigo-500 hover:shadow-lg'
                    : 'bg-slate-50/70 border-slate-200 opacity-90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                      {iconMap[disease.iconName] || <Brain className="w-6 h-6 text-indigo-600" />}
                    </div>
                    {disease.isMvp ? (
                      <span className="bg-indigo-600 text-white text-[11px] px-2.5 py-0.5 rounded-full font-extrabold shadow-sm">
                        선행 수강 오픈
                      </span>
                    ) : (
                      <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        COMING SOON
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-mono font-bold text-slate-400">
                    {disease.code}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-0.5 leading-snug">
                    {disease.nameKo}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {disease.shortDesc}
                  </p>

                  {/* 차등 이수시간 배지 */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">필수 이수:</span>
                    <span className="font-extrabold text-indigo-700">
                      총 {disease.totalRequiredHours}시간 ({disease.theoryHours}h/
                      {disease.practicalHours}h/{disease.practicumHours}h)
                    </span>
                  </div>

                  {/* 핵심 간병 수칙 칩 */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {disease.coreCarePoints.slice(0, 2).map((cp, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded font-medium"
                      >
                        ✓ {cp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  {disease.isMvp ? (
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
                      className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-xs font-extrabold transition shadow"
                    >
                      <span>4단계 과정 학습하기</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-slate-200 text-slate-400 py-2 rounded-xl text-xs font-bold cursor-not-allowed"
                    >
                      개설 준비 중 (알림신청)
                    </button>
                  )}
                </div>
              </div>
            </UiBadge>
          ))}
        </div>
      </section>

      {/* ====================================================================
          [P01-SEC03] 간병24TV 핫클립 & 숏폼 스와이프 미리보기 (TV-01)
          ==================================================================== */}
      <section
        data-serial-id="P01-SEC03-TV24"
        className="max-w-7xl mx-auto px-4 sm:px-8 pt-20"
      >
        <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-rose-400 text-xs font-extrabold mb-1">
                <HotIcon className="w-4 h-4 animate-bounce" />
                <span>미디어 융합 에듀테크 허브</span>
              </div>
              <UiBadge serialId="P01-SEC03-TIT01" label="[P01-SEC03-TIT01]">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  간병24TV 1분 케어 숏폼 & 전문의 특강
                </h2>
              </UiBadge>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                현장에서 1초 만에 확인하는 핵심 간병 스킬과 대학병원 교수 건강강좌 연동
              </p>
            </div>

            <UiBadge serialId="P01-SEC03-BTN01" label="[P01-SEC03-BTN01]">
              <a
                href="/tv24"
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition shadow-lg shrink-0"
              >
                <span>숏폼 스와이프 플레이어 열기 ▷</span>
              </a>
            </UiBadge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {MOCK_CURATED_VIDEOS.slice(0, 3).map((v) => (
              <div
                key={v.id}
                className="bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700/80 hover:border-indigo-400 transition flex flex-col justify-between"
              >
                <div className="relative aspect-video">
                  <img
                    src={v.thumbnailUrl}
                    alt={v.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                    <PlayCircle className="w-12 h-12 text-white" />
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                    {Math.floor(v.durationSeconds / 60)}분
                  </span>
                  {v.creditEligible && (
                    <span className="absolute top-2 left-2 bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                      이론 이수 인정
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <div className="text-xs text-indigo-400 font-semibold mb-1">
                    {v.lecturer}
                  </div>
                  <div className="font-extrabold text-sm text-white line-clamp-2 leading-snug">
                    {v.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
                    <span>조회수 {v.viewCount}</span>
                    <a
                      href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-300 hover:text-white underline"
                    >
                      YouTube 재생 ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          [P01-SEC04] 전문간병사 기대수익 계산기 (CALC-01)
          ==================================================================== */}
      <section
        data-serial-id="P01-SEC04-CALC"
        className="max-w-7xl mx-auto px-4 sm:px-8 pt-20"
      >
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold mb-2">
              <Calculator className="w-4 h-4" />
              <span>전문성 업그레이드 수익 시뮬레이터</span>
            </div>
            <UiBadge serialId="P01-SEC04-TIT01" label="[P01-SEC04-TIT01]">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                전문간병사 자격 취득 시 <br />
                나의 예상 월 소득은?
              </h2>
            </UiBadge>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              중증·질환별 전문간병사는 일반 범용 간병 대비 일당 <strong>30~50% 우대</strong>
              (일 18만원~22만원)를 적용받아 안정적인 소득을 창출합니다.
            </p>

            <div className="mt-5">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                월 근무 일수 선택: <strong className="text-indigo-600 text-sm">{calcWorkDays}일</strong>
              </label>
              <input
                type="range"
                min="10"
                max="30"
                value={calcWorkDays}
                onChange={(e) => setCalcWorkDays(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="w-full md:w-auto bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center min-w-[280px]">
            <div className="text-xs text-slate-500 font-semibold">월 {calcWorkDays}일 근무 기준</div>
            <div className="mt-3">
              <span className="text-xs text-slate-400 block line-through">
                일반 범용 간병: {formatPriceKRW(calcWorkDays * 130000)}
              </span>
              <span className="text-3xl font-extrabold text-indigo-700 mt-1 block">
                {formatPriceKRW(calcWorkDays * 190000)}
              </span>
              <span className="text-xs text-emerald-600 font-extrabold block mt-1">
                ▲ 매월 약 {formatPriceKRW(calcWorkDays * 60000)} 추가 소득 효과
              </span>
            </div>

            <UiBadge serialId="P01-SEC04-BTN01" label="[P01-SEC04-BTN01]">
              <a
                href="#courses"
                className="block mt-5 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-6 rounded-xl text-xs font-bold transition shadow"
              >
                16대 질환 무료 교안 신청하기
              </a>
            </UiBadge>
          </div>
        </div>
      </section>
    </div>
  );
}
