'use client';

import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Play,
  Heart,
  Share2,
  Download,
  ArrowRight,
  Flame,
  Volume2,
} from 'lucide-react';
import { MOCK_CURATED_VIDEOS } from '@ecare24/utils';
import UiBadge from '../../components/UiBadge';

const shortsList = [
  {
    id: 's-01',
    youtubeId: 'tazoLiUlHRI',
    title: '뇌졸중 환자 옷 갈아입힐 때 절대 마비 팔부터 당기지 마세요! (탈건착환 공식)',
    lecturer: '간병24TV 임상 수석간병사',
    category: '신경계 질환군',
    courseId: 'course-01-neuro',
    likes: '1.4만',
    shares: '820회',
    thumbnail: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80',
  },
  {
    id: 's-02',
    youtubeId: 'WIpQfrbOeEA',
    title: '소변 주머니를 환자 배 위에 올리는 순간 역류 패혈증 터집니다! (유린백 거치)',
    lecturer: '간병24TV 임상간호팀',
    category: '비뇨기·신장 질환군',
    courseId: 'course-06-uro',
    likes: '2.1만',
    shares: '1,240회',
    thumbnail: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80',
  },
  {
    id: 's-03',
    youtubeId: 'QS8XCavam0Q',
    title: '콧줄(L-tube) 영양액 누워서 먹이면 바로 폐렴입니다! 30~45도 반좌위 필수',
    lecturer: '간병24TV 영양간호팀',
    category: '소화기·간담도 질환군',
    courseId: 'course-05-gastro',
    likes: '9,800',
    shares: '512회',
    thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80',
  },
];

export default function TV24ShortsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentShort = shortsList[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % shortsList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + shortsList.length) % shortsList.length);
  };

  return (
    <div
      data-serial-id="P10-SEC01-SHORTS"
      className="bg-slate-950 min-h-[calc(100vh-120px)] flex items-center justify-center p-4 relative"
    >
      {/* 세로형 풀스크린 숏폼 컨테이너 */}
      <div className="w-full max-w-sm aspect-[9/16] bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl border border-slate-800 flex flex-col justify-between">
        {/* 영상 배경 썸네일 */}
        <img
          src={currentShort.thumbnail}
          alt={currentShort.title}
          className="absolute inset-0 w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90 pointer-events-none" />

        {/* 상단 헤더 */}
        <div className="relative z-10 p-4 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 bg-rose-600 px-2.5 py-0.5 rounded-full font-bold shadow">
            <Flame className="w-3.5 h-3.5" />
            <span>간병24TV 1분 케어</span>
          </div>
          <span className="font-mono text-slate-300">
            {currentIndex + 1} / {shortsList.length}
          </span>
        </div>

        {/* 중앙 재생 버튼 오버레이 */}
        <div className="relative z-10 flex items-center justify-center">
          <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white flex items-center justify-center shadow-lg transition">
            <Play className="w-8 h-8 ml-1 fill-white" />
          </button>
        </div>

        {/* 우측 사이드 인터랙션 버튼 */}
        <div className="absolute right-3 bottom-28 z-20 flex flex-col items-center gap-4 text-white text-xs">
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur flex items-center justify-center hover:bg-rose-600 transition">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold">{currentShort.likes}</span>
          </div>

          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur flex items-center justify-center hover:bg-indigo-600 transition">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold">{currentShort.shares}</span>
          </div>
        </div>

        {/* 하단 캡션 및 반투명 1초 유입 퍼널 CTA 칩 (Principle 4. Funnel) */}
        <div className="relative z-10 p-5 space-y-3">
          <div className="text-white space-y-1">
            <span className="bg-indigo-600/90 text-white text-[10px] px-2 py-0.5 rounded font-bold">
              {currentShort.category}
            </span>
            <h3 className="font-extrabold text-base leading-snug drop-shadow-md">
              {currentShort.title}
            </h3>
            <p className="text-xs text-slate-300">{currentShort.lecturer}</p>
          </div>

          {/* 반투명 유입 CTA 칩 */}
          <UiBadge serialId="P10-SEC01-BTN01" label="[P10-SEC01-BTN01]" className="w-full">
            <a
              href={`/courses/${currentShort.courseId}`}
              className="w-full flex items-center justify-between bg-gradient-to-r from-emerald-500 to-indigo-600 hover:opacity-95 text-white font-extrabold px-4 py-3 rounded-2xl text-xs shadow-xl transition"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-amber-200" />
                <span>이 질환 심화 교안 1장 무료받기</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </a>
          </UiBadge>
        </div>
      </div>

      {/* 상하 스와이프 조작 컨트롤러 */}
      <div className="absolute right-8 flex flex-col gap-3">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-indigo-600 transition shadow-lg"
          title="이전 숏폼 영상"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-indigo-600 transition shadow-lg"
          title="다음 숏폼 영상"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
