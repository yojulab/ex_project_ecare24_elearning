'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';
import {
  Sparkles,
  BookOpen,
  Award,
  Video,
  Eye,
  Type,
  Headphones,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { initUiInspectorGlobalListener } from '@ecare24/utils';
import UiBadge from '../components/UiBadge';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fontScale, setFontScale] = useState<'normal' | 'large' | 'larger'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [isInspectorActive, setIsInspectorActive] = useState(false);

  useEffect(() => {
    const cleanup = initUiInspectorGlobalListener();

    const observer = new MutationObserver(() => {
      setIsInspectorActive(document.body.classList.contains('ui-inspect-active'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      cleanup();
      observer.disconnect();
    };
  }, []);

  const changeFontScale = (scale: 'normal' | 'large' | 'larger') => {
    setFontScale(scale);
    document.body.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-larger');
    document.body.classList.add(`font-scale-${scale}`);
  };

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    document.body.classList.toggle('high-contrast', next);
  };

  const toggleInspector = () => {
    const nextState = !document.body.classList.contains('ui-inspect-active');
    document.body.classList.toggle('ui-inspect-active', nextState);
    setIsInspectorActive(nextState);
  };

  return (
    <html lang="ko">
      <head>
        <title>한국돌봄종사자양성교육원 - 16대 전문 돌봄 자격 교육포털</title>
        <meta
          name="description"
          content="16대 전문 돌봄 자격 트랙 및 간호사 실습평가 연계, 대학병원 표준 임상 돌봄 지침서 기반 전문 교육기관"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="font-scale-normal bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased">
        {/* ==================================================================
            실버 접근성 보조 탑바 (P00-SEC00) - WCAG AAA 준수
            ================================================================== */}
        <div
          data-serial-id="P00-SEC00-BAR01"
          className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs border-b border-slate-800"
        >
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium">실버 접근성 안심 모드:</span>

            {/* 글자 크기 3단계 조절기 (UX-01) */}
            <UiBadge serialId="P00-SEC00-BTN01" label="[P00-SEC00-BTN01]">
              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                <button
                  onClick={() => changeFontScale('normal')}
                  className={`px-2 py-0.5 rounded text-xs font-bold transition ${
                    fontScale === 'normal'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="보통 글자 크기 (16px)"
                >
                  가- (보통)
                </button>
                <button
                  onClick={() => changeFontScale('large')}
                  className={`px-2 py-0.5 rounded text-sm font-bold transition ${
                    fontScale === 'large'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="큰 글자 크기 (18px)"
                >
                  가 (크게)
                </button>
                <button
                  onClick={() => changeFontScale('larger')}
                  className={`px-2 py-0.5 rounded text-base font-extrabold transition ${
                    fontScale === 'larger'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="가장 큰 글자 크기 (20px)"
                >
                  가+ (최대)
                </button>
              </div>
            </UiBadge>

            {/* 고대비 모드 토글 (UX-02) */}
            <UiBadge serialId="P00-SEC00-BTN02" label="[P00-SEC00-BTN02]">
              <button
                onClick={toggleHighContrast}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition ${
                  highContrast
                    ? 'bg-amber-400 text-black border-amber-300'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{highContrast ? '고대비 켜짐' : '고대비 모드'}</span>
              </button>
            </UiBadge>
          </div>

          {/* 우측: 한국돌봄종사자양성교육원 공식 교육포털 (기존 링크/설명 삭제 후 배치) */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-700/60 text-xs shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>한국돌봄종사자양성교육원 공식 교육포털</span>
            </span>
          </div>
        </div>

        {/* ==================================================================
            글로벌 내비게이션 바 (GNB) - 한국돌봄종사자양성교육원
            ================================================================== */}
        <header
          data-serial-id="P00-SEC01-GNB01"
          className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-sm"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* 로고 */}
            <UiBadge serialId="P00-SEC01-LOG01" label="[P00-SEC01-LOG01]">
              <a href="/" className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center font-extrabold text-white text-base shadow-md tracking-tighter">
                  돌봄
                </div>
                <div>
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight block leading-none">
                    한국돌봄종사자<span className="text-emerald-600">양성교육원</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 tracking-wider">
                    보건복지부 요양보호사·임상간호 연계 16대 전문자격 공식 교육기관
                  </span>
                </div>
              </a>
            </UiBadge>

            {/* 메인 메뉴 링크 (드롭다운 제거 및 독립 페이지 연계) */}
            <nav className="flex items-center gap-6 lg:gap-8 text-sm font-bold text-slate-700">
              {/* 1. 교육원소개 (별도 페이지 /about) */}
              <UiBadge serialId="P00-SEC01-LNK01" label="[P00-SEC01-LNK01]">
                <a
                  href="/about"
                  className="flex items-center gap-1 hover:text-emerald-600 transition py-1"
                >
                  <span>교육원소개</span>
                </a>
              </UiBadge>

              {/* 2. 교육 체계 (별도 페이지 /curriculum, 상단 수강신청~수료 절차 다이어그램) */}
              <UiBadge serialId="P00-SEC01-LNK03" label="[P00-SEC01-LNK03]">
                <a
                  href="/curriculum"
                  className="flex items-center gap-1.5 hover:text-emerald-600 transition"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>교육 체계</span>
                </a>
              </UiBadge>

              {/* 3. 돌봄 지침서 (간결화) */}
              <UiBadge serialId="P00-SEC01-LNK04" label="[P00-SEC01-LNK04]">
                <a
                  href="/tv24"
                  className="flex items-center gap-1.5 hover:text-emerald-600 transition"
                >
                  <Video className="w-4 h-4 text-indigo-500" />
                  <span>돌봄 지침서</span>
                </a>
              </UiBadge>

              {/* 4. 자격증 신청/검증 */}
              <UiBadge serialId="P00-SEC01-LNK05" label="[P00-SEC01-LNK05]">
                <a
                  href="/verify"
                  className="flex items-center gap-1.5 hover:text-emerald-600 transition"
                >
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>자격증 신청/검증</span>
                </a>
              </UiBadge>
            </nav>

            {/* 수강생 프로필 / 빠른 액션 */}
            <div className="flex items-center gap-3">
              <UiBadge serialId="P00-SEC01-BTN03" label="[P00-SEC01-BTN03]">
                <div className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>박순자 돌봄교육생님</span>
                </div>
              </UiBadge>
            </div>
          </div>
        </header>

        {/* 본문 콘텐츠 (기본 바탕색 통일) */}
        <main className="flex-1 bg-slate-50">{children}</main>

        {/* 푸터 */}
        <footer className="bg-slate-900 text-slate-400 py-10 px-4 text-xs border-t border-slate-800 mt-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="font-extrabold text-white text-base mb-2">
                한국돌봄종사자양성교육원
              </div>
              <p className="leading-relaxed text-slate-400 max-w-md">
                보건복지부 요양보호 표준 커리큘럼 및 임상간호 실습 연계 전문 돌봄 교육기관
                <br />
                전문 자격 트랙 (각 총 8시간 이수제: 이론 4h + 실기 4h)
                <br />
                주소: 서울특별시 영등포구 영등포로 150 이케어교육빌딩 4층 | 대표전화: 1588-2424
                <br />
                본 교육원의 모든 임상 실무 지침서는 대학병원 표준 임상 간호 가이드라인을 기반으로 운영됩니다.
              </p>
            </div>
            <div className="flex flex-col gap-1 text-slate-500">
              <span className="font-bold text-slate-300">입학 상담 및 실습 배정 안내</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">
                1588-2424
              </span>
              <span>운영시간: 평일 09:00 ~ 18:00 (주말/공휴일 휴무)</span>
              <span>수간호사 및 전담 임상지도관 상시 배치</span>
            </div>
          </div>
        </footer>

        {/* ==================================================================
            의뢰자 소통용 UI inspect 플로팅 토글 버튼
            ================================================================== */}
        <div
          className={`ui-inspector-floating-dock ${isInspectorActive ? 'active' : ''}`}
          onClick={toggleInspector}
          title="단축키 Alt+I 로 UI inspect 모드를 켜고 끌 수 있습니다"
        >
          <span className="font-semibold text-xs tracking-tight">
            {isInspectorActive ? '🏷️ UI inspect ON (Alt+I)' : '🏷️ UI inspect (Alt+I)'}
          </span>
        </div>
      </body>
    </html>
  );
}
