import React, { useState } from 'react';
import { MOCK_CURATED_VIDEOS } from '@ecare24/utils';
import { UiBadge } from '../components/UiBadge';
import {
  Heart,
  Bookmark,
  Share2,
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
  ExternalLink,
  Flame,
  ShieldCheck,
} from 'lucide-react';

interface TV24ShortsScreenProps {
  initialClipId?: string;
  onNavigateToCourse: (diseaseId: number) => void;
}

export const TV24ShortsScreen: React.FC<TV24ShortsScreenProps> = ({
  initialClipId,
  onNavigateToCourse,
}) => {
  const shortsList = [
    {
      id: 1,
      title: '🚨 편마비 환자 옷 입힐 때 이것만 기억하세요! 탈건착환 공식',
      tags: ['#편마비', '#탈건착환', '#낙상예방', '#간병24TV'],
      likes: 1240,
      diseaseId: 1,
      hospital: '대학병원 재활의학교육센터',
      highlight: '벗을 땐 건강한 쪽부터, 입힐 땐 마비된 쪽부터!',
    },
    {
      id: 2,
      title: '⚠️ 유린백 소변줄, 절대 방광 위로 올리지 마세요! (요로감염)',
      tags: ['#폴리', '#유린백', '#비뇨기케어', '#골든룰'],
      likes: 890,
      diseaseId: 3,
      hospital: '대학병원 비뇨임상센터',
      highlight: '유린백은 항상 환자 방광(침대) 아래에 거치!',
    },
    {
      id: 3,
      title: '💡 2시간마다 체위변경(q2hr) 안 하면 욕창 4단계 직행합니다',
      tags: ['#체위변경', '#욕창예방', '#측위', '#실버간병'],
      likes: 2150,
      diseaseId: 5,
      hospital: '대학병원 임상간호본부',
      highlight: 'q2hr 체변 + 베개 30도 지지로 골반 압박 분산',
    },
    {
      id: 4,
      title: '🥣 비위관 피딩 시 30~45도 침상 상체 올리기 필수 (흡인 방지)',
      tags: ['#피딩', '#엘튜브', '#PEG', '#흡인성폐렴'],
      likes: 1530,
      diseaseId: 2,
      hospital: '대학병원 소화기임상센터',
      highlight: '피딩 중 및 주입 후 30분간 좌위/반좌위 유지!',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [bookmarked, setBookmarked] = useState<Record<number, boolean>>({});

  const currentShort = shortsList[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < shortsList.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : shortsList.length - 1));
  };

  const toggleLike = () => {
    setLiked((prev) => ({
      ...prev,
      [currentShort.id]: !prev[currentShort.id],
    }));
  };

  const toggleBookmark = () => {
    setBookmarked((prev) => ({
      ...prev,
      [currentShort.id]: !prev[currentShort.id],
    }));
  };

  return (
    <div className="flex-1 flex flex-col bg-black text-white relative overflow-hidden select-none">
      {/* Top Floating Badge */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
        <span className="flex items-center gap-1 text-[11px] font-black bg-rose-600 text-white px-2.5 py-1 rounded-full shadow-lg">
          <Flame size={13} />
          <span>간병24TV 숏폼</span>
        </span>
        <span className="text-[10px] font-bold text-white/80 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
          {currentIndex + 1} / {shortsList.length}
        </span>
      </div>

      {/* Up/Down Switcher Arrows */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1">
        <button
          onClick={handlePrev}
          className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 active:scale-95 border border-white/20"
          title="이전 숏폼 클립"
        >
          <ChevronUp size={18} />
        </button>
        <button
          onClick={handleNext}
          className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 active:scale-95 border border-white/20"
          title="다음 숏폼 클립"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      {/* SEC01: Fullscreen Vertical Video Area */}
      <UiBadge serialId="P46-SEC01-SHORTS" className="w-full flex-1 relative">
        <div
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-full h-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 flex flex-col items-center justify-center cursor-pointer p-6 relative overflow-hidden"
        >
          {/* Simulated Video Visual */}
          <div className="w-24 h-24 rounded-full bg-rose-600/20 border-2 border-rose-500/40 flex items-center justify-center mb-4 animate-pulse">
            <span className="text-4xl">🎬</span>
          </div>

          <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 max-w-xs text-center shadow-2xl">
            <span className="text-xs font-black text-yellow-400 block mb-1">
              {currentShort.hospital}
            </span>
            <p className="text-sm font-black text-white leading-snug">
              "{currentShort.highlight}"
            </p>
          </div>

          {!isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40">
                <Play size={28} />
              </div>
            </div>
          )}

          {/* Video bottom animated progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full bg-rose-600 animate-[progress_15s_linear_infinite]" style={{ width: '60%' }} />
          </div>
        </div>
      </UiBadge>

      {/* Right Interaction Sidebar (Like, Bookmark, Share) */}
      <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-4">
        {/* Heart Like */}
        <UiBadge serialId="P46-SEC02-HEART">
          <button
            onClick={toggleLike}
            className="flex flex-col items-center text-white active:scale-125 transition-transform"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border ${
                liked[currentShort.id]
                  ? 'bg-rose-600 text-white border-rose-500'
                  : 'bg-black/50 text-white border-white/20'
              }`}
            >
              <Heart
                size={22}
                fill={liked[currentShort.id] ? '#ffffff' : 'none'}
              />
            </div>
            <span className="text-[10px] font-bold mt-1 text-white shadow-sm">
              {currentShort.likes + (liked[currentShort.id] ? 1 : 0)}
            </span>
          </button>
        </UiBadge>

        {/* Bookmark */}
        <UiBadge serialId="P46-SEC02-BOOKMARK">
          <button
            onClick={toggleBookmark}
            className="flex flex-col items-center text-white active:scale-125 transition-transform"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border ${
                bookmarked[currentShort.id]
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-black/50 text-white border-white/20'
              }`}
            >
              <Bookmark
                size={22}
                fill={bookmarked[currentShort.id] ? '#020617' : 'none'}
              />
            </div>
            <span className="text-[10px] font-bold mt-1 text-white shadow-sm">
              저장
            </span>
          </button>
        </UiBadge>

        {/* Share */}
        <button className="flex flex-col items-center text-white active:scale-110 transition-transform">
          <div className="w-11 h-11 rounded-full bg-black/50 border border-white/20 flex items-center justify-center backdrop-blur-md">
            <Share2 size={20} />
          </div>
          <span className="text-[10px] font-bold mt-1 text-white shadow-sm">
            공유
          </span>
        </button>
      </div>

      {/* Bottom Information & Deep Link to Disease Course */}
      <div className="absolute bottom-3 left-3 right-16 z-30 space-y-2 pointer-events-auto">
        <div>
          <h2 className="text-sm font-black text-white leading-snug drop-shadow-md">
            {currentShort.title}
          </h2>
          <div className="flex flex-wrap gap-1 mt-1">
            {currentShort.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-bold text-yellow-300 drop-shadow"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* SEC03: Direct Course Deep Link CTA Button */}
        <UiBadge serialId="P46-SEC03-COURSE_LINK" className="w-full">
          <button
            onClick={() => onNavigateToCourse(currentShort.diseaseId)}
            className="w-full min-h-[44px] py-2 px-3 rounded-xl bg-blue-600/90 hover:bg-blue-600 backdrop-blur-md text-white font-black text-xs flex items-center justify-between border border-blue-400/50 shadow-lg active:scale-95 transition-all"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-yellow-400" />
              <span>관련 질환 4단계 전문과정 바로가기</span>
            </div>
            <ExternalLink size={14} />
          </button>
        </UiBadge>
      </div>
    </div>
  );
};
export default TV24ShortsScreen;
