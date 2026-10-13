import React, { useState, useEffect } from 'react';
import { UiBadge } from '../components/UiBadge';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Subtitles,
  Volume2,
  ShieldAlert,
  CheckCircle,
  Bookmark,
  Share2,
} from 'lucide-react';

interface VideoPlayerScreenProps {
  videoInfo?: {
    title: string;
    diseaseName: string;
  };
  onBack: () => void;
  onCompleteWatch?: () => void;
}

export const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({
  videoInfo = {
    title: '신경계(편마비) 임상 실기 트레이닝 - 휠체어 이승 & 탈건착환',
    diseaseName: '신경계 질환군',
  },
  onBack,
  onCompleteWatch,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(45); // percentage
  const [speed, setSpeed] = useState<number>(1.0);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [showGoldenTip, setShowGoldenTip] = useState<boolean>(true);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  // Playback timer simulation
  useEffect(() => {
    let timer: any;
    if (isPlaying && progress < 100) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            setCompleted(true);
            return 100;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, progress, speed]);

  const handleComplete = () => {
    setProgress(100);
    setIsPlaying(false);
    setCompleted(true);
    if (onCompleteWatch) onCompleteWatch();
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white overflow-y-auto no-scrollbar pb-8">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between p-3 bg-slate-900 border-b border-slate-800">
        <UiBadge serialId="P43-HDR-BACK">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white"
          >
            <ArrowLeft size={18} />
            <span>과정 상세로</span>
          </button>
        </UiBadge>
        <span className="text-xs font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
          대학병원 표준 임상 간호 큐레이션 A등급
        </span>
      </div>

      {/* Video Player Display Area (16:9) */}
      <div className="relative aspect-video bg-black flex flex-col justify-between overflow-hidden shadow-2xl border-b border-slate-800">
        <UiBadge serialId="P43-SEC01-VPLAYER" className="absolute inset-0">
          {/* Simulated Video Content Background */}
          <div className="w-full h-full bg-gradient-to-t from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center mb-2 animate-pulse">
              <span className="text-2xl">🩺</span>
            </div>
            <p className="text-sm font-black text-slate-200 text-center px-4">
              {videoInfo.title}
            </p>
            <span className="text-[11px] text-slate-400 mt-1">
              [대학병원 임상센터] 재활의학센터 전문간호 교육영상
            </span>
          </div>
        </UiBadge>

        {/* Golden Rule Tip Overlay Warning Bar */}
        {showGoldenTip && (
          <div className="absolute top-2 left-2 right-2 z-30 bg-amber-950/90 border border-amber-500/80 rounded-xl p-2.5 backdrop-blur-md animate-in slide-in-from-top-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <ShieldAlert size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-black uppercase text-yellow-300 tracking-wider">
                    골든 룰 #1 탈건착환 (벗건입환) 공식
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5 leading-snug">
                    환자 옷을 벗길 때는 <strong>건강한 쪽</strong>부터, 입힐 때는 <strong>마비된 환측</strong>부터 먼저 소매를 끼웁니다.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGoldenTip(false)}
                className="text-slate-400 hover:text-white text-xs font-bold ml-2"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Live Subtitle Overlay */}
        {showCaptions && (
          <div className="absolute bottom-12 left-4 right-4 z-20 text-center pointer-events-none">
            <span className="inline-block bg-black/80 text-yellow-300 text-xs sm:text-sm font-black px-3 py-1.5 rounded-lg border border-yellow-500/30 shadow-lg">
              "사이드레일을 안전하게 올린 후, 건강한 손으로 반대편 침대 난간을 짚게 합니다."
            </span>
          </div>
        )}

        {/* Video Player Controls Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/80 to-transparent p-2.5">
          {/* Progress Bar */}
          <div className="w-full bg-slate-700 h-1.5 rounded-full mb-2 cursor-pointer overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            {/* Play/Pause & Skip */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 rounded-full text-white hover:text-blue-400"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={() => setProgress((p) => Math.max(0, p - 5))}
                className="text-slate-400 hover:text-white"
                title="10초 뒤로"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setProgress((p) => Math.min(100, p + 5))}
                className="text-slate-400 hover:text-white"
                title="10초 앞으로"
              >
                <RotateCw size={16} />
              </button>
              <span className="text-[11px] font-mono text-slate-300">
                {Math.floor((progress * 12) / 60)}:
                {String(Math.floor((progress * 12) % 60)).padStart(2, '0')} / 20:00
              </span>
            </div>

            {/* Speed & Caption Buttons */}
            <div className="flex items-center gap-2">
              <UiBadge serialId="P43-SEC02-SPEED">
                <button
                  onClick={() => {
                    const next = speed === 1.0 ? 1.2 : speed === 1.2 ? 0.8 : 1.0;
                    setSpeed(next);
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-bold text-slate-200 border border-slate-700 hover:bg-slate-700"
                >
                  {speed}x
                </button>
              </UiBadge>

              <UiBadge serialId="P43-SEC03-CAPTIONS">
                <button
                  onClick={() => setShowCaptions(!showCaptions)}
                  className={`p-1 rounded ${
                    showCaptions ? 'text-yellow-400 bg-yellow-400/20' : 'text-slate-400'
                  }`}
                  title="자막 켜기/끄기"
                >
                  <Subtitles size={16} />
                </button>
              </UiBadge>
            </div>
          </div>
        </div>
      </div>

      {/* Video Information & Chapters */}
      <div className="p-4 space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400">{videoInfo.diseaseName}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                  bookmarked
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                <Bookmark size={13} />
                <span>{bookmarked ? '저장됨' : '북마크'}</span>
              </button>
              <button className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1">
                <Share2 size={13} />
              </button>
            </div>
          </div>
          <h1 className="text-base font-black mt-1 leading-snug">
            {videoInfo.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            환자 낙상 방지 및 이승 간 휠체어 풋레스트 정리, 브레이크 고정, 그리고 환측 체중 지지 보조 기술을 학습합니다.
          </p>
        </div>

        {/* Completion Action */}
        <div className="pt-2">
          <UiBadge serialId="P43-SEC04-COMPLETE" className="w-full">
            <button
              onClick={handleComplete}
              disabled={completed}
              className={`w-full min-h-[50px] py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                completed
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
              }`}
            >
              <CheckCircle size={18} />
              <span>
                {completed
                  ? '실기 VOD 100% 이수 완료 처리됨 ✓'
                  : '본 영상 학습 완료 처리 (진도율 100% 반영)'}
              </span>
            </button>
          </UiBadge>
        </div>

        {/* Video Chapters List */}
        <div>
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">
            강의 챕터 목록 (총 4개 챕터)
          </h3>
          <div className="space-y-2">
            {[
              { num: 1, title: '이승 전 침대 높이 조절 및 브레이크 점검', time: '04:12', done: true },
              { num: 2, title: '편마비 환자 탈건착환 의복 갈아입히기', time: '06:40', done: true },
              { num: 3, title: '휠체어 각도 45도 접근 및 회전 이승', time: '05:30', current: true },
              { num: 4, title: '이승 후 자세 안정화 및 비상벨 거치', time: '03:38', done: false },
            ].map((chap) => (
              <div
                key={chap.num}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                  chap.current
                    ? 'bg-blue-900/30 border-blue-500/50 text-blue-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                      chap.done
                        ? 'bg-emerald-600 text-white'
                        : chap.current
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {chap.done ? '✓' : chap.num}
                  </span>
                  <span>{chap.title}</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">{chap.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default VideoPlayerScreen;
