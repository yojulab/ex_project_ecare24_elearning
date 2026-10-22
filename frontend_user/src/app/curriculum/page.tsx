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
  Video,
  FileCheck
} from 'lucide-react';
import UiBadge from '@/components/UiBadge';
import { ENV } from '@/config/env';
import { REAL_TRACKS, TrackData } from '@ecare24/utils';

export default function CurriculumPage() {
  const [dbCourses, setDbCourses] = useState<any[]>([]);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);

  useEffect(() => {
    fetch(`${ENV.API_BASE_URL}/courses`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('API offline');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDbCourses(data.filter((c: any) => c.isPublished !== false));
          setIsDbConnected(true);
        }
      })
      .catch(() => {
        setIsDbConnected(false);
      });
  }, []);

  // 실데이터 3개 트랙 표시 (DB 연결 시 DB 코스 또는 기본 REAL_TRACKS)
  const displayTracks: TrackData[] = REAL_TRACKS;

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
                  한국돌봄종사자양성교육원 3대 공식 전문 자격 트랙
                </h1>
              </UiBadge>
              <p className="mt-2 text-slate-600 font-medium text-sm sm:text-base">
                호흡기계 · 인지치매 · 근골격계 3대 중증 질환별 전문 돌봄 자격 트랙(각 총 8시간 이수)과 엄격한 임상 검정 체계를 제공합니다.
              </p>
            </div>
            <UiBadge serialId="P20-CURR-BTN01" label="[P20-CURR-BTN01]">
              <a
                href="#tracks"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-extrabold text-sm hover:bg-emerald-700 shadow-sm transition"
              >
                <span>3대 트랙 수강하기</span>
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

          {/* 시각적 단계별 플로우차트 / 다이어그램 (5단계) */}
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
                  • 3대 실데이터 트랙 중 희망 과정 선택<br />
                  • 본인 확인 및 수강 등록
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-slate-500">
                소요: 온라인 3분
              </div>
            </div>

            {/* Step 2: 이론 심화 교안 */}
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
                <h3 className="font-extrabold text-base text-slate-900 mb-1">정규 교안 (4시간)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  • 5개 장 정규 텍스트 전문 교안<br />
                  • 병태생리, 금기수칙, 이상징후<br />
                  • PC/모바일 이어보기 지원
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-indigo-600">
                이수: 4시간 (진도율 100%)
              </div>
            </div>

            {/* Step 3: 4K 실기 영상 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between relative shadow-sm hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-lg bg-teal-600 text-white font-black text-sm flex items-center justify-center">
                    03
                  </span>
                  <span className="text-[11px] font-extrabold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                    실기 시뮬레이션
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-1">임상 실기 VOD (4시간)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  • 전문강사 핵심 임상 실기 시연<br />
                  • 환자 안전 및 소통 기법<br />
                  • 공식 스크립트 기반 실무 학습
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-teal-600">
                이수: 4시간 (총 8시간 완료)
              </div>
            </div>

            {/* Step 4: 실전 모의고사 */}
            <div className="bg-amber-50/80 border-2 border-amber-500 rounded-2xl p-5 flex flex-col justify-between relative shadow-sm hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-lg bg-amber-600 text-white font-black text-sm flex items-center justify-center">
                    04
                  </span>
                  <span className="text-[11px] font-extrabold text-amber-800 bg-amber-200 px-2 py-0.5 rounded">
                    모의 검정
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-amber-950 mb-1">실전 모의고사 (30문항)</h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  • 실무 상황별 30문항 CBT<br />
                  • 오답노트 및 상세 임상 해설<br />
                  • 60점 이상 합격선 자가진단
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-200 text-[11px] font-black text-amber-800">
                모의평가 무료 무제한 응시
              </div>
            </div>

            {/* Step 5: 최종 자격검정 & 발급 */}
            <div className="bg-emerald-50/80 border-2 border-emerald-600 rounded-2xl p-5 flex flex-col justify-between relative shadow-sm hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-black text-sm flex items-center justify-center">
                    05
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded">
                    최종 합격
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-emerald-950 mb-1">정규 자격검정 (30문항)</h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  • 60점 이상 통과 시 즉시 발급<br />
                  • 직능원(pqi.or.kr) 등록 자격증<br />
                  • 모바일 배지 및 PDF 출력
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-200 text-[11px] font-black text-emerald-800">
                실시간 채점 및 즉시 발급
              </div>
            </div>
          </div>

          {/* 자격증 취득 규정 안내 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <h4 className="font-extrabold text-base text-slate-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-indigo-600" />
              자격증 취득 및 수료 기준 (한국직업능력연구원 민간자격 관리규정)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="font-extrabold text-emerald-700 block mb-1">요건 1: 총 8시간 교육 이수</span>
                온라인 이론 4시간(정규 교안) + 실기 영상 4시간(임상 실습 VOD) 진도율 100% 완료 필수
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="font-extrabold text-indigo-700 block mb-1">요건 2: 자격시험 60점 이상</span>
                최종 평가시험 30문항 중 18문항 이상 정답(60점 이상) 시 실시간 합격 판정 및 공인 자격증 번호 자동 발급
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================
            2. 공식 제공 3대 전문 자격 트랙 목록 (실데이터)
            ================================================================== */}
        <div id="tracks" className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <UiBadge serialId="P20-CURR-SEC02" label="[P20-CURR-SEC02]">
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">Official Tracks</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">공식 제공 3대 전문 자격 트랙 (각 총 8시간)</h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  모든 트랙은 <b>정규 교안 5개 챕터 + 4K 실기 VOD + 모의고사 30문항 + 자격시험 30문항</b>으로 구성됩니다.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                실데이터 3개 트랙 전용
              </span>
            </div>
          </UiBadge>

          {/* 3대 트랙 상세 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayTracks.map((trk) => (
              <div
                key={trk.id}
                className="bg-slate-50 border-2 border-slate-200 hover:border-emerald-500 rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition group relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-white bg-slate-900 px-3 py-1 rounded-full font-mono">
                      {trk.trackCode}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      수강료 120,000원
                    </span>
                  </div>

                  <h3 className="font-black text-lg text-slate-900 group-hover:text-emerald-700 transition leading-snug">
                    {trk.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {trk.targetDisease}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><b>정규 교안:</b> {trk.chapters.length}개 챕터 전문 수록</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-blue-600 shrink-0" />
                      <span><b>실기 VOD:</b> {trk.videoTitle}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-600 shrink-0" />
                      <span><b>평가시험:</b> 모의 30문항 + 최종 30문항</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 space-y-2">
                  <a
                    href={`/courses/${trk.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 transition shadow-sm"
                  >
                    <span>강의실 입장 및 자격시험 응시</span>
                    <ChevronRight className="w-4 h-4" />
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
