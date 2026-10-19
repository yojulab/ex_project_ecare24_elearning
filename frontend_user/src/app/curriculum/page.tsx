'use client';

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  Award, 
  ArrowRight, 
  ClipboardCheck, 
  ShieldCheck, 
  BookOpen, 
  Sparkles, 
  Stethoscope, 
  AlertCircle,
  ChevronRight,
  UserCheck,
  Database
} from 'lucide-react';
import UiBadge from '@/components/UiBadge';
import { ENV } from '@/config/env';

export default function CurriculumPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dbCourseCount, setDbCourseCount] = useState<number>(16);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  const [adminCourses, setAdminCourses] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${ENV.API_BASE_URL}/courses`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('API offline');
      })
      .then((data) => {
        if (Array.isArray(data)) {
          // 관리자 등록 및 공개(isPublished) 활성화된 트랙만 필터링
          const publishedTracks = data.filter((c: any) => c.isPublished !== false && c.courseType === 'TRACK');
          setAdminCourses(publishedTracks);
          setDbCourseCount(publishedTracks.length);
          setIsDbConnected(true);
        }
      })
      .catch(() => {
        setIsDbConnected(false);
      });
  }, []);

  // 16대 질환군 전문 자격 트랙 기본 메타데이터 (각 총 8시간: 이론 4h + 실기 4h)
  const defaultTracks = [
    { id: 'a0000000-0000-0000-0000-000000000002', category: 'neuro', name: '신경계 질환 전문간병사 (뇌졸중/파킨슨 케어 8시간)', code: 'TRK-01', theory: 4, practice: 4, skills: '건측 중심 휠체어 이승, 보행보조, 탈건착환', goldenRule: '탈건착환 (벗을땐 건강, 입을땐 마비)' },
    { id: 'a0000000-0000-0000-0000-000000000003', category: 'clinical', name: '소화기·간담도 질환 전문간병사 (L-tube/PEG 피딩 케어 8시간)', code: 'TRK-02', theory: 4, practice: 4, skills: 'L-tube/PEG 피딩, 반좌위 30분 유지', goldenRule: '피딩 전 소화확인, 상체 30도 거치' },
    { id: 'a0000000-0000-0000-0000-000000000004', category: 'clinical', name: '비뇨기·신장 질환 전문간병사 (유치도뇨관/투석 케어 8시간)', code: 'TRK-03', theory: 4, practice: 4, skills: 'Foley 카테터 잠김 확인, 유린백 비우기', goldenRule: '소변백은 방광보다 아래 거치' },
    { id: 'a0000000-0000-0000-0000-000000000005', category: 'clinical', name: '호흡기계 질환 전문간병사 (COPD/T-tube/가정산소 케어 8시간)', code: 'TRK-04', theory: 4, practice: 4, skills: '구강/비강 카테터 흡인, 거즈교체', goldenRule: '1회 흡인 15초 이내 제한' },
    { id: 'a0000000-0000-0000-0000-000000000006', category: 'chronic', name: '심혈관계 질환 전문간병사 (심부전/부종/혈역학 케어 8시간)', code: 'TRK-05', theory: 4, practice: 4, skills: '기립성 저혈압 예방, 하지부종 관찰', goldenRule: '천천히 일어나기 3단계 수칙' },
    { id: 'a0000000-0000-0000-0000-000000000007', category: 'ortho', name: '근골격계 및 재활 전문간병사 (인공관절/고관절골절 케어 8시간)', code: 'TRK-06', theory: 4, practice: 4, skills: '고관절 외전베개, 탈구예방 각도유지', goldenRule: '다리 꼬기 금지, 90도 이상 굴곡제한' },
    { id: 'a0000000-0000-0000-0000-000000000008', category: 'chronic', name: '내분비·대사 질환 전문간병사 (당뇨병/저혈당/당뇨발 케어 8시간)', code: 'TRK-07', theory: 4, practice: 4, skills: '저혈당 응급대처, 족부 미세상처 관찰', goldenRule: '발톱 일자 깎기 및 보습' },
    { id: 'a0000000-0000-0000-0000-000000000009', category: 'palliative', name: '종양·암 질환 전문간병사 (항암부작용/호중구감소 케어 8시간)', code: 'TRK-08', theory: 4, practice: 4, skills: '마약성 진통제 부작용 모니터링, 임종돌봄', goldenRule: '통증 호소 기록 및 영적지지' },
    { id: 'a0000000-0000-0000-0000-000000000010', category: 'neuro', name: '치매·정신 질환 전문간병사 (BPSD 이상행동/섬망 대처 8시간)', code: 'TRK-09', theory: 4, practice: 4, skills: 'BPSD 대처, 인지자극, 배회예방', goldenRule: '탈건착환 및 인지안정화' },
    { id: 'a0000000-0000-0000-0000-000000000011', category: 'clinical', name: '감염성 질환 전문간병사 (CRE/VRE 다제내성균 격리 케어 8시간)', code: 'TRK-10', theory: 4, practice: 4, skills: '접촉주의 격리 가운/장갑 착탈, 폐기물 분리', goldenRule: '환자 접촉 전후 6단계 손위생' },
    { id: 'a0000000-0000-0000-0000-000000000012', category: 'bedridden', name: '중환자·와상 집중간병사 (욕창 4단계 예방/q2hr 체변 8시간)', code: 'TRK-11', theory: 4, practice: 4, skills: 'q2hr 체위변경(측위/앙와위), 에어매트', goldenRule: '2시간 주기 체변(q2hr) 절대엄수' },
    { id: 'a0000000-0000-0000-0000-000000000013', category: 'ortho', name: '외상·화상 질환 전문간병사 (피부이식/압박드레싱 케어 8시간)', code: 'TRK-12', theory: 4, practice: 4, skills: '무균 소독 보조, 구축 방지 스트레칭', goldenRule: '드레싱 환부 마찰 금지' },
    { id: 'a0000000-0000-0000-0000-000000000014', category: 'chronic', name: '자가면역 및 알레르기 질환 전문간병사 (아나필락시스 케어 8시간)', code: 'TRK-13', theory: 4, practice: 4, skills: '알레르겐 차단 식단, 응급키트 확인', goldenRule: '호흡곤란 시 에피네프린 즉각 노티' },
    { id: 'a0000000-0000-0000-0000-000000000015', category: 'chronic', name: '감각기계 및 이비인후 질환 전문간병사 (시각·청각장애 케어 8시간)', code: 'TRK-14', theory: 4, practice: 4, skills: '시각단서 안내, 보청기 관리', goldenRule: '정면 눈높이 대화 원칙' },
    { id: 'a0000000-0000-0000-0000-000000000016', category: 'palliative', name: '소아·청소년 중증환자 전문돌봄사 (발달특화 케어 8시간)', code: 'TRK-15', theory: 4, practice: 4, skills: '소아 활력징후, 성장발달 정서지지', goldenRule: '체중 비례 수분섭취 점검' },
    { id: 'a0000000-0000-0000-0000-000000000017', category: 'palliative', name: '호스피스 완화임종 전문간병사 (사별가족 지지 케어 8시간)', code: 'TRK-16', theory: 4, practice: 4, skills: '체인스토크스 호흡 간호, 임종위생', goldenRule: '청각 마지막 소실 고려한 위로' },
  ];

  // DB에서 불러온 관리자 등록 코스가 있으면 이를 매핑하여 사용, 없으면 defaultTracks 사용
  const displayTracks = (adminCourses.length > 0 ? adminCourses : defaultTracks).map((item, idx) => {
    // DB CourseEntity 형태인 경우
    if (item.targetDisease || item.steps) {
      const catCode = item.category?.code || (idx % 5 === 0 ? 'neuro' : idx % 5 === 1 ? 'clinical' : idx % 5 === 2 ? 'chronic' : idx % 5 === 3 ? 'bedridden' : 'ortho');
      return {
        id: item.id,
        category: catCode,
        name: item.title,
        code: `TRK-${(idx + 1).toString().padStart(2, '0')}`,
        theory: item.theoryHours || 4,
        practice: item.practicalHours || 4,
        stepCount: item.steps?.length || 4,
        skills: item.summary || item.targetDisease || '임상 표준 프로토콜 실기',
        goldenRule: item.steps?.[0]?.description || '탈건착환 및 10대 골든 룰 준수',
      };
    }
    return {
      ...item,
      stepCount: 4,
    };
  });

  const filteredTracks = selectedCategory === 'all' 
    ? displayTracks 
    : displayTracks.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* 상단 브레드크럼 및 헤더 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
            <span>홈</span>
            <span>&gt;</span>
            <span className="text-emerald-700">교육체계</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <UiBadge serialId="P20-CURR-TTL01" label="[P20-CURR-TTL01]">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                    程
                  </span>
                  한국돌봄종사자양성교육원 교육 체계
                </h1>
              </UiBadge>
              <p className="mt-2 text-slate-600 font-medium text-sm sm:text-base">
                16대 중증 질환별 전문 돌봄 자격 트랙(각 총 8시간 이수)과 엄격한 간호사 임상 실습평가 체계를 제공합니다.
              </p>
            </div>
            <UiBadge serialId="P20-CURR-BTN01" label="[P20-CURR-BTN01]">
              <a
                href="#flow"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-extrabold text-sm hover:bg-emerald-700 shadow-sm transition"
              >
                <span>수강신청 바로가기</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </UiBadge>
          </div>
        </div>

        {/* ==================================================================
            1. 핵심: 수강 신청과 수료 절차 다이어그램 (P20-SEC01-FLOW)
            ================================================================== */}
        <div id="flow" className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <UiBadge serialId="P20-CURR-SEC01" label="[P20-CURR-SEC01]">
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">Roadmap</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">수강 신청 및 자격증 수료 절차 다이어그램</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                직능원 민간자격 관리규정 준수
              </span>
            </div>
          </UiBadge>

          {/* 시각적 단계별 플로우차트 / 다이어그램 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1: 수강 신청 */}
            <div className="bg-slate-50 border-2 border-emerald-500 rounded-2xl p-5 flex flex-col justify-between relative shadow-sm hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                    01
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    접수단계
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-1">수강 신청 및 접수</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  • 16대 트랙 중 희망 과정 선택<br />
                  • 본인 확인 및 수강 등록
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-slate-500">
                소요: 온라인 3분
              </div>
            </div>

            {/* Step 2: 이론 교육 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between relative shadow-sm hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-sm flex items-center justify-center">
                    02
                  </span>
                  <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                    온라인 이론
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-1">질환별 이론 (4시간)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  • 임상 해부·병태생리 이해<br />
                  • 10대 골든 룰 및 투약 주의사항<br />
                  • PC/모바일 이어보기 지원
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-indigo-600">
                이수: 4시간 (진도율 100%)
              </div>
            </div>

            {/* Step 3: 실기/시뮬레이션 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between relative shadow-sm hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-lg bg-teal-600 text-white font-black text-sm flex items-center justify-center">
                    03
                  </span>
                  <span className="text-[11px] font-extrabold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                    대면/모의실기
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-1">현장 실기 (4시간)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  • 피딩·석션 마네킹 시뮬레이션<br />
                  • q2hr 체위변경 및 휠체어 이승<br />
                  • 돌봄지침서 표준 술기 반복
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-teal-600">
                이수: 4시간 (총 8시간 완료)
              </div>
            </div>

            {/* Step 4: 간호사 실습평가 심사 */}
            <div className="bg-amber-50/80 border-2 border-amber-500 rounded-2xl p-5 flex flex-col justify-between relative shadow-sm hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-lg bg-amber-600 text-white font-black text-sm flex items-center justify-center">
                    04
                  </span>
                  <span className="text-[11px] font-extrabold text-amber-800 bg-amber-200 px-2 py-0.5 rounded">
                    필수 심사
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-amber-950 mb-1">간호사 실습평가서</h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  • 심사 간호사 1:1 술기 평가<br />
                  • <b>70점 이상 통과 필수</b> (과락제)<br />
                  • 탈건착환, 석션 등 10개 항목
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-200 text-[11px] font-black text-amber-800">
                기준: 평가서 서명 날인 제출
              </div>
            </div>

            {/* Step 5: 자격증 발급 */}
            <div className="bg-emerald-50/80 border-2 border-emerald-600 rounded-2xl p-5 flex flex-col justify-between relative shadow-sm hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-black text-sm flex items-center justify-center">
                    05
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded">
                    최종 발급
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-emerald-950 mb-1">민간자격증 발급</h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  • 직능원(pqi.or.kr) 등록 자격<br />
                  • 디지털 배지 및 실물 카드 발급<br />
                  • eCare24 간병 매칭 우대
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-200 text-[11px] font-black text-emerald-800">
                온라인 즉시 조회 및 출력
              </div>
            </div>
          </div>

          {/* 자격증 신청 요건 요약 안내 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <h4 className="font-extrabold text-base text-slate-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-indigo-600" />
              자격증 신청 필수 요건 (신청 조건 2가지 중 택1 + 실습평가 필수)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="font-extrabold text-emerald-700 block mb-1">조건 A: 본원 정규 교육 수료자</span>
                본원 온라인 이론 4시간 + 대면 실기 4시간(총 8시간) 진도율 100% 이수 완료자
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="font-extrabold text-indigo-700 block mb-1">조건 B: 요양보호사 자격증 소지자</span>
                보건복지부 요양보호사 자격증 기취득자 (해당 질환 8시간 심화 단기 이수 연계)
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-600 bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span><b>공통 필수 조건</b>: 협력 요양병원 또는 본원 지정 간호사가 날인한 <b>'현장 실습평가서(70점 이상 합격)'</b> 제출이 완료되어야 최종 자격증이 인쇄 발급됩니다.</span>
            </div>
          </div>
        </div>

        {/* ==================================================================
            2. 16대 전문 돌봄 자격 트랙 목록 (각 총 8시간)
            ================================================================== */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <UiBadge serialId="P20-CURR-SEC02" label="[P20-CURR-SEC02]">
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">Tracks</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">16대 질환군 전문 자격 트랙 (각 총 8시간)</h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  모든 트랙은 <b>이론 4시간 + 실기 4시간(총 8시간)</b>으로 압축 표준화되어 있습니다.
                </p>
              </div>

              {/* 카테고리 필터 */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: '전체 (16개)' },
                  { id: 'neuro', label: '뇌신경계' },
                  { id: 'clinical', label: '임상술기' },
                  { id: 'chronic', label: '만성질환' },
                  { id: 'bedridden', label: '와상/욕창' },
                  { id: 'ortho', label: '정형/재활' },
                  { id: 'palliative', label: '완화의료' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </UiBadge>

          {/* 16대 트랙 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTracks.map(trk => (
              <div
                key={trk.id}
                className="bg-slate-50 border border-slate-200 hover:border-emerald-500 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {trk.code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                        관리자 등록 {trk.stepCount || 4}챕터
                      </span>
                      <span className="text-[11px] font-extrabold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        총 8시간
                      </span>
                    </div>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition leading-snug">
                    {trk.name}
                  </h3>
                  <div className="mt-2 text-xs text-slate-600 space-y-1">
                    <div className="text-[11px] text-slate-500">
                      이론 {trk.theory}h + 실기 {trk.practice}h (실시간 관리자 승인과정)
                    </div>
                    <div className="line-clamp-2">
                      <b>주요 술기:</b> {trk.skills}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="text-[10px] text-emerald-800 font-bold bg-emerald-50 p-2 rounded-lg mb-3">
                    골든룰: {trk.goldenRule}
                  </div>
                  <a
                    href={`/courses/${trk.id}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-emerald-500 text-emerald-700 text-xs font-black hover:bg-emerald-600 hover:text-white transition shadow-sm"
                  >
                    <span>상세 강의 계획서</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
