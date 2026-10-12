import React from 'react';
import { MOCK_DISEASES, MOCK_GOLDEN_RULES, MOCK_CURATED_VIDEOS } from '@ecare24/utils';
import { UiBadge } from '../components/UiBadge';
import { GoldenRuleCard } from '../components/GoldenRuleCard';
import {
  PlayCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Flame,
  CheckCircle2,
  Bell,
  Download,
} from 'lucide-react';

interface HomeScreenProps {
  onNavigateToCourse: (diseaseId?: number) => void;
  onNavigateToExam: () => void;
  onNavigateToTV24: (clipId?: string) => void;
  onNavigateToMaterial: () => void;
  isOffline: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToCourse,
  onNavigateToExam,
  onNavigateToTV24,
  onNavigateToMaterial,
  isOffline,
}) => {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-6 bg-slate-50">
      {/* Offline Banner when offline */}
      {isOffline && (
        <div className="bg-amber-500 text-amber-950 px-4 py-2 text-xs font-black flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Download size={14} />
            <span>오프라인 모드: 저장된 교안 및 영상을 데이터 없이 학습 중</span>
          </div>
          <span className="bg-amber-700 text-white px-2 py-0.5 rounded text-[10px]">
            캐시 가동
          </span>
        </div>
      )}

      {/* Top Banner & Study Status */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white px-4 pt-5 pb-6 shadow-md rounded-b-3xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-blue-200 text-xs font-bold mb-1">
              <Sparkles size={14} className="text-yellow-400" />
              <span>실버 안심 스마트러닝 포털</span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-white leading-tight">
              홍길동 간병사님,<br />
              오늘도 힘찬 케어를 응원합니다!
            </h1>
          </div>
          <div className="relative">
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
              <Bell size={18} />
            </button>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-blue-900" />
          </div>
        </div>

        {/* SEC01: Recent Resume Floating Card */}
        <div className="mt-4">
          <UiBadge serialId="P41-SEC01-RESUME" className="w-full">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-blue-500/80 px-2 py-0.5 rounded-full text-white">
                  최근 이어보기
                </span>
                <span className="text-xs font-bold text-yellow-300 flex items-center gap-1">
                  진도율 85% 완료
                </span>
              </div>

              <h2 className="mt-2 text-base font-black leading-snug">
                신경계(뇌졸중/편마비) Step 2 실기 VOD
              </h2>
              <p className="text-xs text-blue-100 font-medium mt-0.5">
                제3강: 휠체어 이승(Transfer) 및 탈건착환 안전 탈의법
              </p>

              {/* Progress bar */}
              <div className="w-full bg-black/20 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-yellow-400 h-full rounded-full w-[85%]" />
              </div>

              <div className="mt-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-blue-200 font-bold">
                  <Clock size={14} />
                  <span>남은 시간: 8분</span>
                </div>
                <button
                  onClick={() => onNavigateToCourse(1)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 shadow-md active:scale-95 transition-all"
                >
                  <PlayCircle size={15} />
                  <span>지금 바로 이어보기</span>
                </button>
              </div>
            </div>
          </UiBadge>
        </div>
      </section>

      {/* SEC02: 16 Disease Categories Grid */}
      <section className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase">16대 질환군 전문과정</span>
            <h2 className="text-base font-black text-slate-900 leading-tight">
              보건복지부 직능원 공인 과정
            </h2>
          </div>
          <button
            onClick={() => onNavigateToCourse()}
            className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center"
          >
            <span>전체보기</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {MOCK_DISEASES.slice(0, 6).map((disease) => (
            <UiBadge
              key={disease.id}
              serialId={`P41-SEC02-DIS${String(disease.id).padStart(2, '0')}`}
              className="w-full"
            >
              <div
                onClick={() => onNavigateToCourse(disease.id)}
                className={`cursor-pointer rounded-2xl p-3 border transition-all text-left flex flex-col justify-between min-h-[115px] ${
                  disease.isMvp
                    ? 'bg-white border-blue-200 shadow-sm hover:border-blue-500 hover:shadow-md'
                    : 'bg-slate-50 border-slate-200 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      #{disease.code.split('_')[0]}
                    </span>
                    {disease.isMvp ? (
                      <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded">
                        MVP 과정
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400">
                        준비중
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mt-1.5 leading-snug line-clamp-1">
                    {disease.nameKo}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500 line-clamp-1 mt-0.5">
                    {disease.shortDesc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-600 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock size={11} className="text-blue-600" />
                    <span>총 {disease.totalRequiredHours}시간</span>
                  </span>
                  <ChevronRight size={13} className="text-slate-400" />
                </div>
              </div>
            </UiBadge>
          ))}
        </div>
      </section>

      {/* SEC03: 간병24TV 실무 핫클립 (1분 쇼츠 퀵 플레이어) */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-md bg-rose-100 text-rose-600">
              <Flame size={16} />
            </span>
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase">1분 실무 꿀팁</span>
              <h2 className="text-base font-black text-slate-900 leading-tight">
                간병24TV 핫클립 숏폼
              </h2>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTV24()}
            className="text-xs font-bold text-rose-600 hover:underline flex items-center"
          >
            <span>숏폼 모아보기</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {MOCK_CURATED_VIDEOS.slice(0, 4).map((clip) => (
            <UiBadge
              key={clip.id}
              serialId={`P41-SEC03-HOT${clip.id}`}
              className="shrink-0 w-36"
            >
              <div
                onClick={() => onNavigateToTV24(clip.youtubeId)}
                className="cursor-pointer bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-800 text-white group"
              >
                <div className="relative aspect-[9/13] bg-slate-800 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />
                  <div className="w-10 h-10 rounded-full bg-rose-600/90 text-white flex items-center justify-center z-20 group-hover:scale-110 transition-transform">
                    <PlayCircle size={22} />
                  </div>
                  <span className="absolute bottom-2 left-2 z-20 text-[10px] font-black bg-rose-600 px-1.5 py-0.5 rounded">
                    1분 숏폼
                  </span>
                </div>
                <div className="p-2.5">
                  <h3 className="text-xs font-black line-clamp-2 leading-snug">
                    {clip.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                    {clip.lecturer}
                  </p>
                </div>
              </div>
            </UiBadge>
          ))}
        </div>
      </section>

      {/* SEC04: 현장 압축 10대 골든 룰 퀵 뷰어 */}
      <section className="px-4 mt-6">
        <div className="mb-3">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">
              <CheckCircle2 size={16} />
            </span>
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase">임상 안전 필수 지침</span>
              <h2 className="text-base font-black text-slate-900 leading-tight">
                현장 압축 10대 골든 룰 (Golden Rules)
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            간병 현장에서 환자의 생명과 직결되는 절대 수칙을 상시 확인하세요.
          </p>
        </div>

        <div className="space-y-2.5">
          {MOCK_GOLDEN_RULES.slice(0, 4).map((rule, idx) => (
            <GoldenRuleCard
              key={rule.id}
              id={rule.id}
              title={rule.title}
              desc={rule.desc}
              badCase={rule.badCase}
              index={idx}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
export default HomeScreen;
