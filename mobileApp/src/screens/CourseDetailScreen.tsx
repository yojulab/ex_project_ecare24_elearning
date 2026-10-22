import React, { useState } from 'react';
import { REAL_TRACKS, TrackData } from '@ecare24/utils';
import { UiBadge } from '../components/UiBadge';
import {
  BookOpen,
  Video,
  FileSpreadsheet,
  Award,
  Clock,
  CheckCircle,
  Download,
  AlertCircle,
  Play,
  FileText,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface CourseDetailScreenProps {
  initialDiseaseId?: number;
  onOpenVideoPlayer: (videoInfo: any) => void;
  onOpenMaterial: (courseId: number) => void;
  onOpenExam: (courseId: number) => void;
  isOffline: boolean;
}

export const CourseDetailScreen: React.FC<CourseDetailScreenProps> = ({
  initialDiseaseId = 1,
  onOpenVideoPlayer,
  onOpenMaterial,
  onOpenExam,
  isOffline,
}) => {
  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number>(
    initialDiseaseId >= 1 && initialDiseaseId <= 3 ? initialDiseaseId - 1 : 0
  );
  const [downloaded, setDownloaded] = useState<boolean>(true);

  const track: TrackData = REAL_TRACKS[selectedTrackIndex] || REAL_TRACKS[0];

  const handleDownload = () => {
    setDownloaded(!downloaded);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-8 bg-slate-50">
      {/* 3대 실데이터 트랙 가로 탭 */}
      <div className="bg-white border-b border-slate-200 px-3 py-2.5 overflow-x-auto no-scrollbar sticky top-0 z-20">
        <div className="flex gap-2 min-w-max">
          {REAL_TRACKS.map((t, idx) => (
            <UiBadge key={t.id} serialId={`P42-TRK-TAB0${idx + 1}`}>
              <button
                onClick={() => setSelectedTrackIndex(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  selectedTrackIndex === idx
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span className="font-mono text-[10px] opacity-80">{t.trackCode}</span>
                <span>{t.categoryName}</span>
              </button>
            </UiBadge>
          ))}
        </div>
      </div>

      {/* Course Hero Card */}
      <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black bg-emerald-600 px-2 py-0.5 rounded text-white">
            직능원 민간자격 공식 트랙
          </span>
          <UiBadge serialId="P42-SEC00-DL">
            <button
              onClick={handleDownload}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                downloaded
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              <Download size={13} />
              <span>{downloaded ? '오프라인 저장됨' : '교안 다운로드'}</span>
            </button>
          </UiBadge>
        </div>

        <h1 className="text-lg font-black mt-2 leading-snug">
          {track.title}
        </h1>
        <p className="text-xs text-slate-300 font-medium mt-1 line-clamp-2">
          대상: {track.targetDisease}
        </p>

        {/* Requirements info pills */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
            <span className="text-[10px] text-slate-300 block">이론 교안</span>
            <span className="font-black text-yellow-300">4시간 (5개 장)</span>
          </div>
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
            <span className="text-[10px] text-slate-300 block">실기 VOD</span>
            <span className="font-black text-yellow-300">4시간 (HeyGen)</span>
          </div>
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
            <span className="text-[10px] text-slate-300 block">시험 검정</span>
            <span className="font-black text-yellow-300">60문항 (60점 합격)</span>
          </div>
        </div>
      </div>

      {/* HeyGen VOD 및 공식 강사 안내 */}
      <div className="p-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-black text-emerald-900 flex items-center gap-1">
              <Video size={15} className="text-emerald-700" />
              <span>HeyGen AI 공식 실기 교육 VOD</span>
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
              {track.id.endsWith('03') ? '1분 50초' : '1분 15초'}
            </span>
          </div>
          <p className="text-xs text-emerald-950 font-bold">
            {track.videoTitle}
          </p>
          <div className="text-[11px] text-emerald-800 line-clamp-2 leading-relaxed bg-white/70 p-2 rounded-xl border border-emerald-100">
            "{track.scriptText.slice(0, 150)}..."
          </div>
        </div>
      </div>

      {/* 4단계 이수 커리큘럼 */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900">
            4단계 원클릭 패스 학습 동선
          </h2>
          <span className="text-xs font-bold text-emerald-700">총 8시간 완비</span>
        </div>

        {/* Step 1: 문구형 정규 교안 */}
        <UiBadge serialId="P42-SEC01-STEP1" className="w-full">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                  <BookOpen size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                    Step 1 · 이론 교안
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5">
                    정규 교안 ({track.chapters.length}개 챕터 전문)
                  </h3>
                </div>
              </div>
              <CheckCircle size={20} className="text-emerald-500 shrink-0" />
            </div>

            <p className="mt-2 text-xs font-medium text-slate-600 line-clamp-2">
              {track.chapters.map((c) => c.title).join(' • ')}
            </p>

            <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Clock size={13} />
                <span>4시간 필수 이수</span>
              </span>
              <button
                onClick={() => onOpenMaterial(track.categoryId)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 active:scale-95 shadow-sm"
              >
                <FileText size={14} />
                <span>교안 열람</span>
              </button>
            </div>
          </div>
        </UiBadge>

        {/* Step 2: HeyGen 4K VOD */}
        <UiBadge serialId="P42-SEC01-STEP2" className="w-full">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                  <Video size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                    Step 2 · 실기 VOD
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5">
                    4K 핵심 실기 시연 VOD
                  </h3>
                </div>
              </div>
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                100% 연동
              </span>
            </div>

            <p className="mt-2 text-xs font-medium text-slate-600">
              {track.videoTitle} (HeyGen 공식 실기 시뮬레이션)
            </p>

            <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Clock size={13} />
                <span>4시간 필수 이수</span>
              </span>
              <button
                onClick={() =>
                  onOpenVideoPlayer({
                    title: track.videoTitle,
                    videoUrl: track.videoUrl,
                    embedUrl: track.embedUrl,
                  })
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 active:scale-95 shadow-sm"
              >
                <Play size={14} />
                <span>VOD 재생</span>
              </button>
            </div>
          </div>
        </UiBadge>

        {/* Step 3: 실전 모의고사 30문항 */}
        <UiBadge serialId="P42-SEC01-STEP3" className="w-full">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                  <FileSpreadsheet size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                    Step 3 · 모의평가
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5">
                    실전 모의고사 ({track.mockQuestions.length}문항)
                  </h3>
                </div>
              </div>
              <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                무제한 응시
              </span>
            </div>

            <p className="mt-2 text-xs font-medium text-slate-600">
              실무 상황별 4지선다 30문항 CBT 및 오답노트 해설 확인
            </p>

            <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500">배점 20점 · 60점 합격선</span>
              <button
                onClick={() => onOpenExam(track.categoryId)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 active:scale-95 shadow-sm"
              >
                <Award size={14} />
                <span>모의평가 응시</span>
              </button>
            </div>
          </div>
        </UiBadge>

        {/* Step 4: 정규 자격검정 30문항 */}
        <UiBadge serialId="P42-SEC01-STEP4" className="w-full">
          <div className="bg-white rounded-2xl p-4 border-2 border-purple-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                  <Award size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded">
                    Step 4 · 최종 검정
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5">
                    정규 자격검정 ({track.finalQuestions.length}문항)
                  </h3>
                </div>
              </div>
              <span className="text-xs font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                즉시 합격증 발급
              </span>
            </div>

            <p className="mt-2 text-xs font-medium text-slate-600">
              한국직업능력연구원(pqi.or.kr) 등록 공인 자격증 실시간 발급
            </p>

            <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500">60점 이상 합격 시 공식 배지 부여</span>
              <button
                onClick={() => onOpenExam(track.categoryId)}
                className="bg-purple-700 hover:bg-purple-800 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 active:scale-95 shadow-sm"
              >
                <Award size={14} />
                <span>자격시험 응시</span>
              </button>
            </div>
          </div>
        </UiBadge>
      </div>
    </div>
  );
};

export default CourseDetailScreen;
