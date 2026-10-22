import React from 'react';
import { UiBadge } from '../components/UiBadge';
import { ShieldCheck, Clock, ChevronRight, Stethoscope, AlertCircle, ArrowRight, BookOpen, Award, Video } from 'lucide-react';
import { REAL_TRACKS } from '@ecare24/utils';

interface CurriculumScreenProps {
  onSelectCourse?: (diseaseId: number) => void;
}

export const CurriculumScreen: React.FC<CurriculumScreenProps> = ({ onSelectCourse }) => {
  const steps = [
    { num: '01', title: '수강 신청', desc: '공식 3대 실데이터 트랙 선택 및 접수', badge: '온라인 접수' },
    { num: '02', title: '이론 교안 (4h)', desc: '5개 챕터 정규 문구형 전문 교안', badge: '모바일 이어보기' },
    { num: '03', title: '실기 훈련 (4h)', desc: 'HeyGen 공식 4K 실기 VOD 시연', badge: '총 8시간 이수' },
    { num: '04', title: '실전 모의평가', desc: '상황별 30문항 CBT 자가진단', badge: '무제한 응시' },
    { num: '05', title: '자격증 발급', desc: '정규 검정 60점 이상 합격 즉시 발급', badge: '공식 배지 발급' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-6">
      {/* 상단 타이틀 */}
      <div className="bg-white p-5 border-b border-slate-200">
        <UiBadge serialId="P40-CURR-TTL01">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
              程
            </span>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              교육 체계 (3대 공식 트랙)
            </h1>
          </div>
        </UiBadge>
        <p className="text-xs text-slate-500 mt-1">
          호흡기계 · 인지치매 · 근골격계 실데이터 트랙 (각 총 8h)
        </p>
      </div>

      <div className="p-4 space-y-5">
        {/* ==================================================================
            수강 신청과 수료 절차 다이어그램
            ================================================================== */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <UiBadge serialId="P40-CURR-SEC01">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900">
                수강 신청 및 수료 절차도
              </h2>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                5단계 표준 절차
              </span>
            </div>
          </UiBadge>

          {/* 5단계 카드 플로우 */}
          <div className="space-y-2 pt-1">
            {steps.map((st) => (
              <div
                key={st.num}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                    {st.num}
                  </span>
                  <div>
                    <div className="font-extrabold text-xs text-slate-900">
                      {st.title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {st.desc}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded shrink-0">
                  {st.badge}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 leading-relaxed mt-2 flex items-start gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              <b>수료 기준:</b> 정규 교안 4h + 실기 VOD 4h 진도율 100% 완료 및 30문항 정규 시험 60점 이상 합격 시 공인 자격증 즉시 발급
            </span>
          </div>
        </div>

        {/* ==================================================================
            3대 공식 전문 자격 트랙 목록 (각 8시간)
            ================================================================== */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <UiBadge serialId="P40-CURR-SEC02">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900">
                3대 공식 전문 자격 트랙 (실데이터)
              </h2>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                이론 4h + 실기 4h
              </span>
            </div>
          </UiBadge>

          <div className="space-y-3">
            {REAL_TRACKS.map((trk) => (
              <button
                key={trk.id}
                onClick={() => onSelectCourse?.(trk.categoryId)}
                className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition flex flex-col justify-between group shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-mono font-black text-white bg-slate-900 px-2 py-0.5 rounded">
                    {trk.trackCode}
                  </span>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    8시간 · 120,000원
                  </span>
                </div>

                <div className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 leading-snug">
                  {trk.title}
                </div>

                <div className="text-[11px] text-slate-500 line-clamp-1">
                  {trk.targetDisease}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 w-full">
                  <div className="flex items-center gap-1 text-emerald-700 font-bold">
                    <BookOpen className="w-3 h-3" />
                    <span>교안 5장 + HeyGen VOD + 시험 60문항</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumScreen;
