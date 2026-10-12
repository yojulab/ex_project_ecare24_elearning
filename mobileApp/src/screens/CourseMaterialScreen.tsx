import React, { useState } from 'react';
import { MOCK_TERMINOLOGY } from '@ecare24/utils';
import { CaregiverTerm } from '@ecare24/types';
import { UiBadge } from '../components/UiBadge';
import { TermTooltipModal } from '../components/TermTooltipModal';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Download,
  Bookmark,
  Highlighter,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';

interface CourseMaterialScreenProps {
  courseId?: number;
  onBack: () => void;
  isOffline: boolean;
}

export const CourseMaterialScreen: React.FC<CourseMaterialScreenProps> = ({
  courseId = 1,
  onBack,
  isOffline,
}) => {
  const [selectedTerm, setSelectedTerm] = useState<CaregiverTerm | null>(null);
  const [isTtsPlaying, setIsTtsPlaying] = useState<boolean>(false);
  const [ttsSpeed, setTtsSpeed] = useState<number>(1.0);
  const [highlightMode, setHighlightMode] = useState<boolean>(false);
  const [isSavedOffline, setIsSavedOffline] = useState<boolean>(true);

  // Term lookup helper
  const handleTermClick = (termName: string) => {
    const found = MOCK_TERMINOLOGY.find(
      (t) => t.term.includes(termName) || termName.includes(t.term)
    );
    if (found) {
      setSelectedTerm(found);
    } else {
      // Fallback term
      setSelectedTerm({
        term: termName,
        standardTerm: termName,
        category: '간병실무',
        definition: `${termName}은(는) 간병 현장에서 환자의 안전과 직결되는 핵심 임상 절차입니다.`,
        carePoint: '시술 전 환자 의식 확인 및 담당 간호사 오더 필수.',
        warningAlert: '환자 의식 저하 시 즉시 중단 및 노티',
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto no-scrollbar pb-10">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-3 py-2.5 flex items-center justify-between shadow-sm">
        <UiBadge serialId="P47-HDR-BACK">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            <span>이전으로</span>
          </button>
        </UiBadge>

        <span className="text-xs font-black text-slate-900 truncate max-w-[160px]">
          제1장: 신경계 환자 기초 간병 실무
        </span>

        {/* Offline Save Toggle */}
        <UiBadge serialId="P47-SEC03-OFFLINE_SAVE">
          <button
            onClick={() => setIsSavedOffline(!isSavedOffline)}
            className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 ${
              isSavedOffline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="오프라인 교안 캐시 저장"
          >
            <Download size={14} />
            <span className="text-[11px]">{isSavedOffline ? '저장됨' : '저장'}</span>
          </button>
        </UiBadge>
      </div>

      {/* SEC01: TTS Audio Floating Player Bar */}
      <div className="bg-slate-900 text-white px-4 py-2.5 border-b border-slate-800 shadow">
        <UiBadge serialId="P47-SEC01-TTS" className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTtsPlaying(!isTtsPlaying)}
                className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 shadow"
              >
                {isTtsPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <div>
                <span className="text-[10px] font-black text-blue-400 block leading-none">
                  AI 음성 낭독 (TTS)
                </span>
                <span className="text-xs font-bold text-slate-200">
                  {isTtsPlaying ? '본문을 낭독하고 있습니다...' : '교안 음성으로 듣기'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  const s = ttsSpeed === 1.0 ? 1.2 : ttsSpeed === 1.2 ? 0.8 : 1.0;
                  setTtsSpeed(s);
                }}
                className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700"
              >
                {ttsSpeed}x
              </button>
              <button
                onClick={() => setHighlightMode(!highlightMode)}
                className={`p-1.5 rounded text-xs ${
                  highlightMode ? 'bg-yellow-400 text-black' : 'text-slate-400'
                }`}
                title="형광펜 모드"
              >
                <Highlighter size={14} />
              </button>
            </div>
          </div>
        </UiBadge>
      </div>

      {/* SEC02: Textbook Article Body with Terminology Badges */}
      <UiBadge serialId="P47-SEC02-CONTENT" className="p-4 space-y-4">
        {/* Unit Info */}
        <div className="border-b border-slate-200 pb-3">
          <span className="text-xs font-bold text-blue-600 uppercase">
            보건복지부 직능원 표준교안 · 1강
          </span>
          <h1 className="text-lg font-black text-slate-900 mt-1 leading-snug">
            편마비 환자의 체위변경(체변) 및 탈건착환 안전 수칙
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            최종 임상 검수: 분당서울대병원 재활의학센터 / 수석간호사 이영희
          </p>
        </div>

        {/* Section 1 */}
        <div className="space-y-2 text-sm leading-relaxed text-slate-800">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>1. 욕창 예방과 2시간 주기 체위변경(q2hr)</span>
          </h2>
          <p className="font-medium">
            장기 와상 환자는 혈류 장애로 인해 골반과 천골 부위에 단 2시간만 지속 압박이 가해져도{' '}
            <strong className="text-rose-600">욕창(Pressure Sore)</strong>이 발생할 수 있습니다.
            따라서 간병사는 반드시{' '}
            <button
              onClick={() => handleTermClick('체변')}
              className="inline-flex items-center px-2 py-0.5 rounded-lg bg-blue-100 text-blue-800 font-black text-xs border border-blue-300 hover:bg-blue-200"
            >
              #체변 (q2hr) 🔍
            </button>
            을 2시간 주기로 정확히 실시해야 합니다.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs font-bold text-amber-900">
            ⚠️ <strong>골든 룰 주의:</strong> 앙와위(똑바로 누운 자세)에서 측위(옆으로 누운 자세)로 변경 시, 무릎 사이에 베개를 끼워 뼈 돌출부위끼리의 직접 마찰을 방지해야 합니다.
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-2 text-sm leading-relaxed text-slate-800 pt-2 border-t border-slate-100">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>2. 편마비 환자의 의복 착탈: 탈건착환 공식</span>
          </h2>
          <p className="font-medium">
            뇌졸중 편마비 환자의 의복 교체 시 무리하게 마비된 쪽을 당기면 어깨 탈구나 골절 위험이 있습니다. 현장에서는 다음 공식을 엄격히 적용합니다:
          </p>
          <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-4 text-center">
            <span className="text-xs font-bold text-blue-600 block">현장 10대 골든 룰 #1</span>
            <span className="text-lg font-black text-blue-950 mt-1 block tracking-wide">
              "벗을 땐 건강한 쪽부터 (탈건),<br />입힐 땐 마비된 쪽부터 (착환)!"
            </span>
            <p className="text-xs font-medium text-slate-600 mt-2">
              (벗건입환: 벗을 땐 건강한 팔, 입을 땐 아픈 팔 먼저 소매 통과)
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="space-y-2 text-sm leading-relaxed text-slate-800 pt-2 border-t border-slate-100">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>3. 비위관(엘튜브/PEG) 피딩 및 소변줄(폴리/유린백) 관리</span>
          </h2>
          <p className="font-medium">
            환자가 경관영양 상태인 경우{' '}
            <button
              onClick={() => handleTermClick('피딩')}
              className="inline-flex items-center px-2 py-0.5 rounded-lg bg-blue-100 text-blue-800 font-black text-xs border border-blue-300 hover:bg-blue-200"
            >
              #피딩 (비위관) 🔍
            </button>
            주입 전 반드시 상체를 30~45도 거상해야 하며,{' '}
            <button
              onClick={() => handleTermClick('폴리')}
              className="inline-flex items-center px-2 py-0.5 rounded-lg bg-blue-100 text-blue-800 font-black text-xs border border-blue-300 hover:bg-blue-200"
            >
              #유린백 (소변줄) 🔍
            </button>
            은 절대로 환자 방광 높이 위로 올려서는 안 됩니다. 역류 시 요로감염 및 패혈증을 유발할 수 있습니다.
          </p>
        </div>

        {/* Terminology Tooltip Bottom Banner Guide */}
        <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between text-xs text-purple-900 font-bold">
          <div className="flex items-center gap-1.5">
            <HelpCircle size={15} className="text-purple-600" />
            <span>파란색 용어 태그(#피딩, #체변 등)를 누르면 해설이 뜹니다.</span>
          </div>
        </div>
      </UiBadge>

      {/* Terminology Detail Bottom Sheet Modal */}
      <TermTooltipModal
        term={selectedTerm}
        onClose={() => setSelectedTerm(null)}
      />
    </div>
  );
};
export default CourseMaterialScreen;
