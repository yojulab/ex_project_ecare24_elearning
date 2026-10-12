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
        <title>ecare24 환자 질환별 전문간병사 통합 플랫폼</title>
        <meta
          name="description"
          content="16대 질환군 전문간병사 자격과정 및 실버 친화적 에듀테크 포털"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
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

          <div className="flex items-center gap-3">
            <span className="text-slate-400 hidden sm:inline">
              보건복지부 소관 직능원 등록 민간자격 과정
            </span>
            <a
              href="http://localhost:30011"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline"
            >
              상담원/관리자 콜센터 포털 (:30011) ↗
            </a>
          </div>
        </div>

        {/* ==================================================================
            글로벌 내비게이션 바 (GNB)
            ================================================================== */}
        <header
          data-serial-id="P00-SEC01-GNB01"
          className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-sm"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* 로고 */}
            <UiBadge serialId="P00-SEC01-LOG01" label="[P00-SEC01-LOG01]">
              <a href="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center font-extrabold text-white text-lg shadow-md">
                  eC
                </div>
                <div>
                  <span className="font-extrabold text-xl text-slate-900 tracking-tight block leading-none">
                    ecare<span className="text-indigo-600">24</span>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 tracking-wider">
                    환자 질환별 전문간병사
                  </span>
                </div>
              </a>
            </UiBadge>

            {/* 메인 메뉴 링크 */}
            <nav className="flex items-center gap-6 text-sm font-bold text-slate-700">
              <UiBadge serialId="P00-SEC01-LNK01" label="[P00-SEC01-LNK01]">
                <a
                  href="/#courses"
                  className="flex items-center gap-1.5 hover:text-indigo-600 transition"
                >
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  <span>16대 질환 과정</span>
                </a>
              </UiBadge>

              <UiBadge serialId="P00-SEC01-LNK02" label="[P00-SEC01-LNK02]">
                <a
                  href="/tv24"
                  className="flex items-center gap-1.5 hover:text-indigo-600 transition"
                >
                  <Video className="w-4 h-4 text-rose-500" />
                  <span>간병24TV 숏폼</span>
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    HOT
                  </span>
                </a>
              </UiBadge>

              <UiBadge serialId="P00-SEC01-LNK03" label="[P00-SEC01-LNK03]">
                <a
                  href="/verify"
                  className="flex items-center gap-1.5 hover:text-indigo-600 transition"
                >
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>자격증 진위검증</span>
                </a>
              </UiBadge>
            </nav>

            {/* 수강생 프로필 / 빠른 액션 */}
            <div className="flex items-center gap-3">
              <UiBadge serialId="P00-SEC01-BTN03" label="[P00-SEC01-BTN03]">
                <div className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>박순자 간병사님</span>
                </div>
              </UiBadge>
            </div>
          </div>
        </header>

        {/* 본문 콘텐츠 */}
        <main className="flex-1">{children}</main>

        {/* 푸터 */}
        <footer className="bg-slate-900 text-slate-400 py-10 px-4 text-xs border-t border-slate-800 mt-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="font-extrabold text-white text-base mb-2">
                ecare24 환자 질환별 전문간병사 자격연수원
              </div>
              <p className="leading-relaxed text-slate-400 max-w-md">
                주식회사 이케어24 | 한국직업능력연구원(pqi.or.kr) 등록 민간자격 관리기관
                <br />
                주소: 서울특별시 강남구 테헤란로 427 위워크타워 14층 | 대표전화: 1588-2424
                <br />
                본 플랫폼의 모든 임상 간병 콘텐츠는 대학병원 전문의 및 임상간호사의 자문을 거쳐
                편성되었습니다.
              </p>
            </div>
            <div className="flex flex-col gap-1 text-slate-500">
              <span className="font-bold text-slate-300">고객센터 & CTI 상담지원</span>
              <span className="text-lg font-extrabold text-indigo-400 font-mono">
                1588-2424
              </span>
              <span>운영시간: 평일 09:00 ~ 18:00 (주말/공휴일 휴무)</span>
              <span>상담원 3분할 CTI 시스템 상시 가동 중</span>
            </div>
          </div>
        </footer>

        {/* ==================================================================
            의뢰자 소통용 UI 인스펙터 플로팅 독 버튼
            ================================================================== */}
        <div
          className={`ui-inspector-floating-dock ${isInspectorActive ? 'active' : ''}`}
          onClick={toggleInspector}
          title="클릭하거나 Alt+I 단축키를 눌러 화면 요소별 일련번호 뱃지를 표시/숨김 토글합니다."
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>
            UI 인스펙터 [Alt + I]:{' '}
            <strong className={isInspectorActive ? 'text-emerald-300' : 'text-amber-200'}>
              {isInspectorActive ? 'ON (뱃지 클릭시 ID 복사)' : 'OFF'}
            </strong>
          </span>
        </div>
      </body>
    </html>
  );
}
