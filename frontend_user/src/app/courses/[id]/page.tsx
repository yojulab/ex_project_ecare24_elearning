'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Video,
  FileCheck,
  Award,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Send,
  Download,
  QrCode,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';
import {
  MOCK_MVP_COURSES,
  MOCK_EXAM_QUESTIONS,
  MOCK_TERMINOLOGY,
  checkExamPassing,
} from '@ecare24/utils';
import UiBadge from '../../../components/UiBadge';

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course =
    MOCK_MVP_COURSES.find((c) => c.id === params.id) || MOCK_MVP_COURSES[0];

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: 오디오 TTS 플레이어 상태
  const [isPlayingTts, setIsPlayingTts] = useState(false);

  // Step 2: VOD 플레이어 상태
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [videoProgress, setVideoProgress] = useState<number>(65);
  const [speedWarning, setSpeedWarning] = useState<string | null>(null);

  // Step 3 & 4: CBT OMR 답안 상태 (문항 ID -> 선택 번호 1~4)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [examScore, setExamScore] = useState<number>(0);
  const [autoSavedTime, setAutoSavedTime] = useState<string>('3초 전 자동저장 완료');

  // OMR 답안 선택 핸들러
  const handleSelectOption = (questionId: string, optionNo: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionNo }));
    setAutoSavedTime('방금 자동저장 완료 (임시저장)');
  };

  // CBT 제출 및 채점
  const handleSubmitExam = () => {
    let correctCount = 0;
    MOCK_EXAM_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });
    const calculatedScore = Math.round((correctCount / MOCK_EXAM_QUESTIONS.length) * 100);
    setExamScore(calculatedScore);
    setExamSubmitted(true);
  };

  // 배속 변경 (1.5배속 제한 시뮬레이션)
  const handleSetSpeed = (speed: number) => {
    if (speed > 1.5) {
      setSpeedWarning('⚠️ 직능원 관리규정에 따라 1.5배속 초과 시 진도율이 인정되지 않습니다.');
      setPlaybackSpeed(1.5);
    } else {
      setSpeedWarning(null);
      setPlaybackSpeed(speed);
    }
  };

  // 미응답 문항 수
  const unansweredCount =
    MOCK_EXAM_QUESTIONS.length - Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* 뒤로가기 및 과정 헤더 */}
      <div className="flex items-center justify-between">
        <a
          href="/#courses"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>전체 16개 질환 과정으로 돌아가기</span>
        </a>
        <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
          {course.categoryCode}
        </span>
      </div>

      {/* 과정 요약 카드 (P02-SEC01) */}
      <div
        data-serial-id="P02-SEC01-HEAD"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-indigo-600 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
              {course.qualificationName}
            </span>
            <UiBadge serialId="P02-SEC01-TIT01" label="[P02-SEC01-TIT01]">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {course.title}
              </h1>
            </UiBadge>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              {course.summary}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs shrink-0 space-y-1.5 font-sans">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">필수 이수:</span>
              <span className="font-extrabold text-indigo-700">
                총 {course.totalHours}시간 (이론 {course.theoryHours}h / 실기 {course.practicalHours}h / 실습 {course.practicumHours}h)
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">SNUBH 인정:</span>
              <span className="font-bold text-emerald-700">
                최대 {course.snubhCreditCapHours}시간 (이론의 50%)
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">합격 기준:</span>
              <span className="font-bold text-slate-800">
                평균 60점 이상 (과목별 40점 과락)
              </span>
            </div>
          </div>
        </div>

        {/* 4단계 스텝 내비게이션 바 (P02-SEC02) */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-400 mb-3">
            4단계 원클릭 패스 학습 동선
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { step: 1, name: '1. 이론 심화교안 (TTS)', icon: <BookOpen className="w-4 h-4" /> },
              { step: 2, name: '2. 4K 실기 & 실습', icon: <Video className="w-4 h-4" /> },
              { step: 3, name: '3. OMR 모의고사', icon: <FileCheck className="w-4 h-4" /> },
              { step: 4, name: '4. 정규 자격검정', icon: <Award className="w-4 h-4" /> },
            ].map((s) => (
              <UiBadge
                key={s.step}
                serialId={`P02-SEC02-STP0${s.step}`}
                label={`[P02-SEC02-STP0${s.step}]`}
                className="w-full"
              >
                <button
                  onClick={() => setCurrentStep(s.step)}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold border transition ${
                    currentStep === s.step
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {s.icon}
                  <span>{s.name}</span>
                </button>
              </UiBadge>
            ))}
          </div>
        </div>
      </div>

      {/* ====================================================================
          스텝별 콘텐츠 인터랙티브 영역 (P03, P04, P06, P08)
          ==================================================================== */}

      {/* Step 1: 이론 심화 교안 & 오디오 TTS 음성 읽기 모드 (P03) */}
      {currentStep === 1 && (
        <div data-serial-id="P03-SEC01-THEORY" className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <UiBadge serialId="P03-SEC01-TIT01" label="[P03-SEC01-TIT01]">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Step 1. 뇌졸중 병태생리 및 임상 케어 이론 교안
                  </h2>
                </UiBadge>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pretendard 가독성 최적화 | 워터마크 동적 캡처 방지 적용 중
                </p>
              </div>

              {/* 오디오 TTS 읽어주기 플레이어 (LMS-01) */}
              <UiBadge serialId="P03-SEC01-TTS01" label="[P03-SEC01-TTS01]">
                <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full text-xs font-bold text-indigo-900">
                  <Volume2 className="w-4 h-4 text-indigo-600 animate-pulse" />
                  <span>실버 음성 TTS 오디오:</span>
                  <button
                    onClick={() => setIsPlayingTts(!isPlayingTts)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-0.5 rounded-full text-xs"
                  >
                    {isPlayingTts ? '일시정지 ||' : '듣기 ▷'}
                  </button>
                </div>
              </UiBadge>
            </div>

            {isPlayingTts && (
              <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-2xl text-xs text-emerald-900 flex items-center gap-2 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>
                  <strong>[음성 재생 중]</strong> "뇌졸중 환자 간병 시 가장 중요한 원칙은
                  탈건착환입니다. 옷을 벗길 때는 건강한 쪽부터, 입힐 때는 마비된 쪽부터 천천히
                  진행하여 어깨 탈구를 예방합니다..."
                </span>
              </div>
            )}

            {/* 교안 본문 콘텐츠 및 용어사전 툴팁 하이라이트 */}
            <article className="prose max-w-none text-slate-800 leading-relaxed space-y-4 text-sm sm:text-base">
              <h3 className="text-lg font-extrabold text-slate-900">
                제1장. 뇌졸중(뇌경색·뇌출혈) 편마비 환자의 신체 역학 및 탈건착환
              </h3>
              <p>
                뇌졸중으로 인한 편마비 환자는 환측(마비측)의 관절을 지지하는 근육의 긴장도가
                떨어져 있거나 반대로 과도하게 경직되어 있습니다. 특히 <strong>어깨 관절(견관절)</strong>은
                외력에 매우 취약하여 간병인이 무리하게 팔을 잡아당길 경우 즉각적인 아탈구(Subluxation)와
                극심한 통증을 유발합니다.
              </p>

              <div className="bg-indigo-50/70 p-4 rounded-2xl border-l-4 border-indigo-600 my-4">
                <h4 className="font-extrabold text-indigo-950 text-sm mb-1">
                  골든 룰 체크: 탈건착환 (脫健着患) 공식
                </h4>
                <p className="text-xs sm:text-sm text-indigo-900">
                  <strong>벗길 때는 건강한 쪽(건측)부터, 입힐 때는 마비된 쪽(환측)부터!</strong>
                  <br />
                  건강한 팔을 먼저 벗겨 옷의 여유 공간을 충분히 확보한 뒤, 마비된 팔을 안전하게
                  빼내야 어깨 관절의 회전근개와 관절낭을 보호할 수 있습니다.
                </p>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 mt-6">
                제2장. 급성기 위험 징후(Red Flag) 감지와 즉각 노티(Notification)
              </h3>
              <p>
                환자가 식사 도중 사레가 심하게 들리거나(아스피레이션 위험), 한쪽 입꼬리가
                처지고 말이 어눌해지는 증상(FAST 법칙)이 재발할 경우, <strong>혼자 판단하지 않고
                1초도 지체 없이 담당 간호사에게 구두 보고</strong>해야 합니다.
              </p>
            </article>

            {/* Step 1 완료 및 다음 단계 이동 */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> 이론 교안 100% 열람 완료 (진도율 인정됨)
              </span>
              <UiBadge serialId="P03-SEC01-BTN02" label="[P03-SEC01-BTN02]">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition shadow"
                >
                  Step 2. 4K 실기 영상 학습으로 이동 ▷
                </button>
              </UiBadge>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: 실기·실습 4K 영상 플레이어 (1.5배속 제한, 스킵 방지) (P04) */}
      {currentStep === 2 && (
        <div data-serial-id="P04-SEC01-VOD" className="space-y-6">
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <UiBadge serialId="P04-SEC01-TIT01" label="[P04-SEC01-TIT01]">
                  <h2 className="text-xl font-extrabold text-white">
                    Step 2. 4K 임상 실기: 탈건착환 & 침상-휠체어 이승(Transfer)
                  </h2>
                </UiBadge>
                <p className="text-xs text-slate-400 mt-0.5">
                  직능원 규정: 1.5배속 이내 시청 필수 | 스킵 방지 및 진도율 80% 달성 시 모의고사 활성화
                </p>
              </div>

              {/* 배속 조절기 (LMS-02) */}
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
                <span className="text-slate-400">재생 속도:</span>
                {[1.0, 1.25, 1.5, 2.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSetSpeed(s)}
                    className={`px-2 py-0.5 rounded font-bold font-mono transition ${
                      playbackSpeed === s
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {speedWarning && (
              <div className="bg-amber-950/80 border border-amber-600 text-amber-200 p-3 rounded-xl text-xs flex items-center gap-2 animate-bounce">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{speedWarning}</span>
              </div>
            )}

            {/* 비디오 스트리밍 뷰어 화면 */}
            <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden relative flex items-center justify-center border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80"
                alt="실기 영상"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <UiBadge serialId="P04-SEC01-PLY01" label="[P04-SEC01-PLY01]">
                  <button className="w-16 h-16 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl transition transform hover:scale-110">
                    <Play className="w-8 h-8 ml-1" />
                  </button>
                </UiBadge>
                <span className="text-xs font-semibold bg-black/60 px-3 py-1 rounded-full text-slate-200">
                  [실습 시연] 보행벨트 올바른 착용법 및 마비측 지지 트랜스퍼 (4K Ultra HD)
                </span>
              </div>

              {/* 하단 진도율 바 */}
              <div className="absolute bottom-0 inset-x-0 bg-slate-900/90 p-3 flex items-center justify-between text-xs">
                <span>진행: 12:40 / 20:00</span>
                <span className="font-extrabold text-indigo-400">
                  진도율: {videoProgress}% (80% 이상 수강 시 Step 3 활성화)
                </span>
              </div>
            </div>

            {/* 실습일지 서명 및 다음 단계 */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => setVideoProgress(85)}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold"
              >
                [테스트용: 진도율 85% 즉시 채우기]
              </button>

              <UiBadge serialId="P04-SEC01-BTN02" label="[P04-SEC01-BTN02]">
                <button
                  disabled={videoProgress < 80}
                  onClick={() => setCurrentStep(3)}
                  className={`font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition shadow ${
                    videoProgress >= 80
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Step 3. OMR 모의고사 응시하기 ▷
                </button>
              </UiBadge>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: 단원별 & 종합 CBT 모의고사 (종이 감성 디지털 OMR 카드) (P06) */}
      {currentStep === 3 && (
        <div data-serial-id="P06-SEC01-CBT" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* 좌측: 문제 출제 영역 */}
            <div className="flex-1 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 w-full">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <UiBadge serialId="P06-SEC01-TIT01" label="[P06-SEC01-TIT01]">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Step 3. 신경계 전문간병사 CBT 모의고사
                  </h2>
                </UiBadge>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {autoSavedTime}
                </span>
              </div>

              {/* 5문항 렌더링 */}
              <div className="space-y-8">
                {MOCK_EXAM_QUESTIONS.map((q) => (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xs shrink-0">
                        {q.questionNumber}
                      </span>
                      <div>
                        <div className="font-extrabold text-base text-slate-900 leading-snug">
                          {q.title}
                        </div>
                        {q.scenario && (
                          <div className="mt-1.5 p-3 rounded-xl bg-amber-50 text-amber-900 text-xs font-medium border border-amber-200">
                            {q.scenario}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 객관식 4지선다 */}
                    <div className="space-y-2 pt-2">
                      {q.options.map((opt) => (
                        <div
                          key={opt.no}
                          onClick={() => handleSelectOption(q.id, opt.no)}
                          className={`p-3 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold transition flex items-center gap-3 border ${
                            selectedAnswers[q.id] === opt.no
                              ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold border ${
                              selectedAnswers[q.id] === opt.no
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'border-slate-300 text-slate-400'
                            }`}
                          >
                            {opt.no}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* 시험 제출 후 해설 및 임상 케어 포인트 표시 */}
                    {examSubmitted && (
                      <div className="mt-4 p-3 bg-slate-100 rounded-xl text-xs space-y-1 border border-slate-300">
                        <div className="font-bold text-slate-900">
                          정답: {q.correctAnswer}번 | 핵심 케어: {q.carePointTag}
                        </div>
                        <div className="text-slate-600 leading-relaxed">
                          {q.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 우측: 실제 종이 감성 디지털 OMR 카드 (Principle 3. OMR) */}
            <div
              data-serial-id="P06-SEC02-OMR"
              className="w-full lg:w-72 bg-amber-50/80 rounded-3xl p-5 border-2 border-amber-200 shadow-md sticky top-36 shrink-0"
            >
              <div className="border-b border-amber-200 pb-3 mb-4">
                <div className="text-xs font-extrabold text-amber-900 flex items-center justify-between">
                  <span>디지털 OMR 답안 마킹판</span>
                  <span className="font-mono text-[10px]">CBT 3초 자동저장</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-2 font-bold">
                  <span>미마킹 문항 수:</span>
                  <span className="text-rose-600 font-extrabold text-sm">
                    {unansweredCount}문항 남음
                  </span>
                </div>
              </div>

              {/* OMR 번호 마킹 리스트 */}
              <div className="space-y-3 font-mono text-xs">
                {MOCK_EXAM_QUESTIONS.map((q) => (
                  <div key={q.id} className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 w-6">
                      {q.questionNumber}번
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleSelectOption(q.id, num)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition border ${
                            selectedAnswers[q.id] === num
                              ? 'bg-slate-900 text-white border-slate-900 shadow'
                              : 'bg-white text-slate-400 border-amber-300 hover:border-slate-500'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 제출 CTA */}
              <div className="mt-6 pt-4 border-t border-amber-200 space-y-2">
                <UiBadge serialId="P06-SEC02-BTN01" label="[P06-SEC02-BTN01]" className="w-full">
                  <button
                    onClick={handleSubmitExam}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-2xl text-xs sm:text-sm transition shadow-lg"
                  >
                    OMR 답안 최종 제출 및 즉시 채점
                  </button>
                </UiBadge>

                {examSubmitted && (
                  <div className="mt-3 p-3 bg-white rounded-xl text-center border border-indigo-200">
                    <div className="text-xs text-slate-500">채점 결과</div>
                    <div className="text-2xl font-extrabold text-indigo-700">
                      {examScore}점
                    </div>
                    <div className="text-[11px] font-bold text-emerald-600 mt-1">
                      {examScore >= 60 ? '★ 합격 기준(60점) 통과!' : '과락 불합격'}
                    </div>

                    {examScore >= 60 && (
                      <button
                        onClick={() => setCurrentStep(4)}
                        className="mt-3 w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-xl transition"
                      >
                        Step 4. 자격증 발급 센터로 이동 ▷
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: 정규 자격검정 완료 & 디지털 자격증 지갑 카드 (P08) */}
      {currentStep === 4 && (
        <div data-serial-id="P08-SEC01-CERT" className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <UiBadge serialId="P08-SEC01-TIT01" label="[P08-SEC01-TIT01]">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  축하합니다! 민간자격 인증 완료
                </h2>
              </UiBadge>
              <p className="text-sm text-slate-500">
                한국직업능력연구원(pqi.or.kr) 등록 민간자격 디지털 공적 자격증이 발급되었습니다.
              </p>
            </div>

            {/* 디지털 모바일 자격증 카드 (Wallet Card) */}
            <div className="bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border-2 border-indigo-400 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-indigo-400 text-xs font-mono font-bold tracking-wider uppercase block">
                    ecare24 Certified Specialized Caregiver
                  </span>
                  <div className="text-2xl font-black mt-1">
                    {course.qualificationName} 1급
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    등록번호: EC24-2026-NEURO-00084
                  </div>
                </div>

                <div className="bg-white p-2 rounded-xl shadow shrink-0">
                  <div className="w-16 h-16 bg-slate-900 rounded flex items-center justify-center text-[10px] font-mono text-white text-center">
                    [2D QR<br />VERIFY]
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row justify-between text-xs gap-3">
                <div>
                  <span className="text-slate-400 block">수검자 성명</span>
                  <span className="font-extrabold text-sm text-white">박순자 (1965.04.12)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">취득 점수</span>
                  <span className="font-extrabold text-sm text-emerald-400">88점 (우수)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">유효 기간 (2년)</span>
                  <span className="font-mono text-slate-200">2026.10.12 ~ 2028.10.11</span>
                </div>
              </div>
            </div>

            {/* 자격증 출력 및 공적 검증 링크 액션 */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <UiBadge serialId="P08-SEC01-BTN01" label="[P08-SEC01-BTN01]">
                <button
                  onClick={() => alert('PDF 자격인증서 다운로드 기능이 가동되었습니다.')}
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>고해상도 PDF 자격인증서 인쇄/저장</span>
                </button>
              </UiBadge>

              <UiBadge serialId="P08-SEC01-BTN02" label="[P08-SEC01-BTN02]">
                <a
                  href="/verify"
                  className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition border border-slate-300"
                >
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>공적 QR 진위검증 페이지 바로가기</span>
                </a>
              </UiBadge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
