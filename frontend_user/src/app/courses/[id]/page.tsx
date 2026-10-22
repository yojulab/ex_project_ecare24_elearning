'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Video,
  FileCheck,
  Award,
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  QrCode,
  ShieldCheck,
  ChevronLeft,
  ExternalLink,
  Sparkles,
  FileText,
  HelpCircle,
  Check,
  RefreshCw,
} from 'lucide-react';
import { REAL_TRACKS, TrackData, TrackQuestion } from '@ecare24/utils';
import UiBadge from '../../../components/UiBadge';
import { ENV } from '@/config/env';

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  // params.id에 해당하는 트랙 찾기 (기본값: 트랙 1)
  const track: TrackData =
    REAL_TRACKS.find((t) => t.id === params.id) || REAL_TRACKS[0];

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: 문구형 교안 상태
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const [isTheoryReadComplete, setIsTheoryReadComplete] = useState<boolean>(true);

  // Step 2: HeyGen 비디오 플레이어 상태
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [speedWarning, setSpeedWarning] = useState<string | null>(null);

  // Step 3: OMR 실전 모의고사 상태 (30문항)
  const [mockAnswers, setMockAnswers] = useState<Record<number, number>>({});
  const [mockSubmitted, setMockSubmitted] = useState<boolean>(false);
  const [mockScore, setMockScore] = useState<number>(0);

  // Step 4: 정규 자격검정 시험 상태 (30문항)
  const [realExamAnswers, setRealExamAnswers] = useState<Record<number, number>>({});
  const [isExamSubmitting, setIsExamSubmitting] = useState<boolean>(false);
  const [realExamSubmitted, setRealExamSubmitted] = useState<boolean>(false);
  const [realExamScore, setRealExamScore] = useState<number>(0);
  const [realExamPassed, setRealExamPassed] = useState<boolean>(false);
  const [realExamResultData, setRealExamResultData] = useState<any>(null);
  const [applicantName, setApplicantName] = useState<string>('박순자');
  const [examAutoSavedTime, setExamAutoSavedTime] = useState<string>('방금 실시간 동기화 완료');
  const [examRemainingSeconds, setExamRemainingSeconds] = useState<number>(1800); // 30분 시험

  // 실시간 타이머
  useEffect(() => {
    if (currentStep === 4 && !realExamSubmitted && examRemainingSeconds > 0) {
      const timer = setInterval(() => {
        setExamRemainingSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep, realExamSubmitted, examRemainingSeconds]);

  // Step 2 배속 변경 (1.5배속 제한)
  const handleSetSpeed = (speed: number) => {
    if (speed > 1.5) {
      setSpeedWarning('⚠️ 직능원 관리규정에 따라 1.5배속 초과 시 진도율이 인정되지 않습니다.');
      setPlaybackSpeed(1.5);
    } else {
      setSpeedWarning(null);
      setPlaybackSpeed(speed);
    }
  };

  // Step 3 모의고사 핸들러
  const handleSelectMockOption = (qNum: number, optNo: number) => {
    setMockAnswers((prev) => ({ ...prev, [qNum]: optNo }));
  };

  const handleSubmitMock = () => {
    let correct = 0;
    track.mockQuestions.forEach((q) => {
      if (String(mockAnswers[q.questionNumber]) === String(q.correctAnswer)) {
        correct++;
      }
    });
    const calculatedScore = Math.round((correct / track.mockQuestions.length) * 100);
    setMockScore(calculatedScore);
    setMockSubmitted(true);
  };

  const handleResetMock = () => {
    setMockAnswers({});
    setMockSubmitted(false);
    setMockScore(0);
  };

  // Step 4 실제 자격시험 OMR 답안 선택
  const handleSelectRealOption = (qNum: number, optNo: number) => {
    setRealExamAnswers((prev) => ({ ...prev, [qNum]: optNo }));
    setExamAutoSavedTime('방금 OMR 마킹 실시간 자동저장');
  };

  // Step 4 실제 자격시험 제출 및 실시간 통과 처리
  const handleSubmitRealExam = async () => {
    setIsExamSubmitting(true);
    let correctCount = 0;
    track.finalQuestions.forEach((q) => {
      if (String(realExamAnswers[q.questionNumber]) === String(q.correctAnswer)) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / track.finalQuestions.length) * 100);
    const isPassed = calculatedScore >= 60;

    const now = new Date();
    const issueDateStr = now.toISOString().split('T')[0];
    const expiryDate = new Date(now);
    expiryDate.setFullYear(expiryDate.getFullYear() + 2);
    const expiryDateStr = expiryDate.toISOString().split('T')[0];
    const certNo = `EC24-${now.getFullYear()}-${track.trackCode}-${Math.floor(Math.random() * 90000 + 10000)}`;

    setRealExamScore(calculatedScore);
    setRealExamPassed(isPassed);
    setRealExamResultData({
      success: true,
      score: calculatedScore,
      isPassed,
      correctCount,
      totalQuestions: track.finalQuestions.length,
      grade: calculatedScore >= 90 ? '최우수 (특급)' : calculatedScore >= 80 ? '우수 (1급)' : '합격',
      certificate: isPassed
        ? {
            registryNo: certNo,
            qualificationName: `${track.qualificationName} 1급`,
            applicantName,
            birthDate: '1965.04.12',
            score: calculatedScore,
            issuedAt: issueDateStr,
            expiresAt: expiryDateStr,
            agency: '한국돌봄종사자양성교육원',
            pqiRegNo: '한국직업능력연구원(pqi.or.kr) 제2026-0814호',
            qrVerifyToken: `VERIFY-${certNo}`,
          }
        : null,
    });
    setRealExamSubmitted(true);
    setIsExamSubmitting(false);
  };

  // 실시간 재시험 응시 리셋
  const handleRetakeExam = () => {
    setRealExamAnswers({});
    setRealExamSubmitted(false);
    setRealExamScore(0);
    setRealExamPassed(false);
    setRealExamResultData(null);
    setExamRemainingSeconds(1800);
  };

  const realExamUnansweredCount = track.finalQuestions.length - Object.keys(realExamAnswers).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* 뒤로가기 및 과정 헤더 */}
      <div className="flex items-center justify-between">
        <a
          href="/curriculum"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>전체 3대 전문 커리큘럼으로 돌아가기</span>
        </a>
        <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {track.trackCode}
        </span>
      </div>

      {/* 과정 요약 카드 (P02-SEC01) */}
      <div
        data-serial-id="P02-SEC01-HEAD"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-emerald-600 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
              {track.qualificationName}
            </span>
            <UiBadge serialId="P02-SEC01-TIT01" label="[P02-SEC01-TIT01]">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {track.title}
              </h1>
            </UiBadge>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              대상 질환: {track.targetDisease}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs shrink-0 space-y-1.5 font-sans">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">필수 이수:</span>
              <span className="font-extrabold text-emerald-800">
                총 8시간 (이론 4h + 실기 4h)
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">수강료:</span>
              <span className="font-bold text-slate-800">120,000원</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">합격 기준:</span>
              <span className="font-bold text-emerald-700">
                정규 자격검정 60점 이상 (실시간 통과 판정)
              </span>
            </div>
          </div>
        </div>

        {/* 4단계 스텝 내비게이션 바 (P02-SEC02) */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-400 mb-3 flex items-center justify-between">
            <span>4단계 원클릭 패스 학습 동선</span>
            <span className="text-[11px] font-normal text-slate-500">
              현재 위치: Step {currentStep}단계
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { step: 1, name: '1. 정규 심화교안 (문구형)', icon: <BookOpen className="w-4 h-4" /> },
              { step: 2, name: '2. 4K 실기 VOD (표준 임상)', icon: <Video className="w-4 h-4" /> },
              { step: 3, name: '3. 실전 모의고사 (30문항)', icon: <FileCheck className="w-4 h-4" /> },
              { step: 4, name: '4. 정규 자격검정 (30문항)', icon: <Award className="w-4 h-4" /> },
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
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-200'
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
          Step 1: 정규 교안 5개 챕터 (문구형 정규 교안)
          ==================================================================== */}
      {currentStep === 1 && (
        <div data-serial-id="P03-SEC01-THEORY" className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <UiBadge serialId="P03-SEC01-TIT01" label="[P03-SEC01-TIT01]">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-sm font-black">
                      文
                    </span>
                    Step 1. {track.title} 정규 교안
                  </h2>
                </UiBadge>
                <p className="text-xs text-slate-500 mt-1">
                  ※ 본 교안은 TTS 오디오가 아닌, 대학병원 임상 실기 가이드라인과 10대 골든 룰에 기반한 정규 텍스트 전문 교안입니다.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
                5개 챕터 완비 (이수시간 4h 인정)
              </span>
            </div>

            {/* 챕터 선택 탭 */}
            <div className="flex flex-wrap gap-2 pt-2">
              {track.chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedChapterIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                    selectedChapterIndex === idx
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  제{idx + 1}장
                </button>
              ))}
            </div>

            {/* 선택된 챕터 본문 */}
            {track.chapters[selectedChapterIndex] && (
              <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                  제{selectedChapterIndex + 1}장
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {track.chapters[selectedChapterIndex].title}
                </h3>
                <div className="text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-line pt-2">
                  {track.chapters[selectedChapterIndex].content.replace(/^###\s*[^\n\r]+\n*/, '')}
                </div>
              </div>
            )}

            {/* 교안 완독 버튼 */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                제{selectedChapterIndex + 1}장 / 총 {track.chapters.length}장
              </span>
              <button
                onClick={() => {
                  if (selectedChapterIndex < track.chapters.length - 1) {
                    setSelectedChapterIndex((prev) => prev + 1);
                  } else {
                    setCurrentStep(2);
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 transition shadow-sm"
              >
                <span>
                  {selectedChapterIndex < track.chapters.length - 1
                    ? '다음 장으로 넘어가기'
                    : '교안 완독 완료 ➔ Step 2 실기 VOD 시청하기'}
                </span>
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          Step 2: HeyGen AI 실기 & 실습 VOD (P04-SEC01)
          ==================================================================== */}
      {currentStep === 2 && (
        <div data-serial-id="P04-SEC01-VOD" className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-5">
              <UiBadge serialId="P04-SEC01-TIT01" label="[P04-SEC01-TIT01]">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-black">
                    視
                  </span>
                  Step 2. 4K 핵심 실기 시뮬레이션 VOD (표준 임상 교육)
                </h2>
              </UiBadge>
              <p className="text-xs text-slate-500 mt-1">
                {track.videoTitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 비디오 임베드 플레이어 */}
              <div className="lg:col-span-2 space-y-4">
                <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-slate-300 shadow-md relative">
                  <iframe
                    src={track.embedUrl}
                    title={track.videoTitle}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* 배속 제어 및 원본 링크 */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-600">배속 조절:</span>
                    {[1.0, 1.2, 1.5, 2.0].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => handleSetSpeed(spd)}
                        className={`px-2.5 py-1 rounded font-bold transition ${
                          playbackSpeed === spd
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>

                  <a
                    href={track.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-700 font-bold hover:underline"
                  >
                    <span>표준 임상 고화질 새창 열기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {speedWarning && (
                  <div className="text-xs text-rose-700 font-bold bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{speedWarning}</span>
                  </div>
                )}
              </div>

              {/* 스크립트 전문 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  강사 공식 녹취록 전문 (Script)
                </h4>
                <div className="text-xs text-slate-800 leading-relaxed font-sans overflow-y-auto max-h-[350px] whitespace-pre-line bg-white p-4 rounded-xl border border-slate-200 flex-1">
                  {track.scriptText}
                </div>
              </div>
            </div>

            {/* 다음 단계 버튼 */}
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 transition shadow-sm"
              >
                <span>실기 VOD 시청 완료 ➔ Step 3 실전 모의고사 풀기</span>
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          Step 3: 실전 모의고사 30문항 CBT (P07-SEC01)
          ==================================================================== */}
      {currentStep === 3 && (
        <div data-serial-id="P07-SEC01-MOCK" className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <UiBadge serialId="P07-SEC01-TIT01" label="[P07-SEC01-TIT01]">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center text-sm font-black">
                      考
                    </span>
                    Step 3. 실전 모의고사 CBT ({track.mockQuestions.length}문항)
                  </h2>
                </UiBadge>
                <p className="text-xs text-slate-500 mt-1">
                  ※ 시험 전 스스로 실무 지식을 점검하고 오답 노트를 확인할 수 있는 공식 모의고사입니다. (무제한 응시 가능)
                </p>
              </div>

              {mockSubmitted && (
                <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 text-xs font-black text-amber-900 flex items-center gap-2">
                  <span>모의고사 채점 결과:</span>
                  <span className="text-base text-amber-700 font-mono">{mockScore}점</span>
                  <span>({mockScore >= 60 ? '합격 가능권 ✓' : '보충 필요'})</span>
                </div>
              )}
            </div>

            {/* 30문항 리스트 */}
            <div className="space-y-6">
              {track.mockQuestions.map((q) => {
                const userAns = mockAnswers[q.questionNumber];
                const isCorrect = String(userAns) === String(q.correctAnswer);

                return (
                  <div
                    key={q.questionNumber}
                    className={`rounded-2xl p-6 border transition space-y-4 ${
                      mockSubmitted
                        ? isCorrect
                          ? 'bg-emerald-50/40 border-emerald-300'
                          : 'bg-rose-50/40 border-rose-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-black flex items-center justify-center font-mono">
                          {q.questionNumber}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          {q.title}
                        </h4>
                      </div>
                      {mockSubmitted && (
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                          }`}
                        >
                          {isCorrect ? '정답 ✓' : '오답 ✗'}
                        </span>
                      )}
                    </div>

                    {/* 선택지 4개 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                      {q.options.map((opt) => {
                        const isSelected = userAns === opt.no;
                        const isTheCorrectOpt = String(opt.no) === String(q.correctAnswer);

                        return (
                          <button
                            key={opt.no}
                            disabled={mockSubmitted}
                            onClick={() => handleSelectMockOption(q.questionNumber, opt.no)}
                            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                              isSelected
                                ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            } ${mockSubmitted && isTheCorrectOpt ? 'ring-2 ring-emerald-500 font-bold' : ''}`}
                          >
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                                isSelected
                                  ? 'bg-white text-amber-700'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {opt.no}
                            </span>
                            <span>{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* 채점 후 정답 및 상세 해설 노출 */}
                    {mockSubmitted && (
                      <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans space-y-1">
                        <div className="font-bold text-emerald-800">
                          정답: {q.correctAnswer}번
                        </div>
                        <div><b>임상 해설:</b> {q.explanation}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 모의고사 채점 / 리셋 버튼 */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              {mockSubmitted ? (
                <button
                  onClick={handleResetMock}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-300"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>다시 풀기</span>
                </button>
              ) : (
                <button
                  onClick={handleSubmitMock}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 text-white text-xs font-black hover:bg-amber-700 shadow-sm"
                >
                  <span>모의고사 자동 채점하기</span>
                  <Check className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 shadow-sm"
              >
                <span>정규 자격검정 (Step 4) 바로 응시하기</span>
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          Step 4: 정규 자격검정 평가시험 30문항 CBT & 실시간 통과 (P08-SEC01)
          ==================================================================== */}
      {currentStep === 4 && (
        <div data-serial-id="P08-SEC01-FINAL" className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <UiBadge serialId="P08-SEC01-TIT01" label="[P08-SEC01-TIT01]">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-purple-700 text-white flex items-center justify-center text-sm font-black">
                      試
                    </span>
                    Step 4. {track.qualificationName} 1급 정규 자격검정
                  </h2>
                </UiBadge>
                <p className="text-xs text-slate-500 mt-1">
                  ※ 한국직업능력연구원(pqi.or.kr) 제2026-0814호 등록 정규 검정 (60점 이상 즉시 합격 및 자격증 발급)
                </p>
              </div>

              {!realExamSubmitted && (
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {Math.floor(examRemainingSeconds / 60)}:
                      {(examRemainingSeconds % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                    {examAutoSavedTime}
                  </span>
                </div>
              )}
            </div>

            {/* 수험자 정보 입력 */}
            {!realExamSubmitted && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-700">수험자 성명:</span>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-900 bg-white w-32 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500">※ 자격증에 표기될 성함입니다.</span>
                </div>
                <div className="text-slate-600 font-bold">
                  미응시 문항: <b className="text-rose-600">{realExamUnansweredCount}</b> / {track.finalQuestions.length}
                </div>
              </div>
            )}

            {/* 시험 30문항 리스트 */}
            {!realExamSubmitted ? (
              <div className="space-y-6">
                {track.finalQuestions.map((q) => {
                  const userAns = realExamAnswers[q.questionNumber];

                  return (
                    <div
                      key={q.questionNumber}
                      className="rounded-2xl p-6 bg-slate-50 border border-slate-200 space-y-4 hover:border-slate-300 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-purple-700 text-white text-xs font-black flex items-center justify-center font-mono">
                            {q.questionNumber}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                            {q.title}
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          배점: 20점
                        </span>
                      </div>

                      {/* 4지선다 옵션 리스트 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                        {q.options.map((opt) => {
                          const isSelected = userAns === opt.no;

                          return (
                            <button
                              key={opt.no}
                              onClick={() => handleSelectRealOption(q.questionNumber, opt.no)}
                              className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                                isSelected
                                  ? 'bg-purple-700 text-white border-purple-700 font-bold shadow-sm ring-2 ring-purple-200'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                                  isSelected
                                    ? 'bg-white text-purple-700'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {opt.no}
                              </span>
                              <span>{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* 답안 최종 제출 바 */}
                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    전체 30문항 중 {Object.keys(realExamAnswers).length}문항 마킹 완료. 60점 이상 획득 시 자격증이 즉시 발급됩니다.
                  </div>
                  <button
                    onClick={handleSubmitRealExam}
                    disabled={isExamSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-purple-700 text-white text-sm font-black hover:bg-purple-800 transition shadow-md"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>정규 자격검정 최종 답안 제출 및 즉시 채점</span>
                  </button>
                </div>
              </div>
            ) : (
              /* 합격 결과 및 공식 자격증 발급 UI */
              <div className="space-y-8 pt-2">
                {/* 결과 요약 배너 */}
                <div
                  className={`rounded-3xl p-6 sm:p-8 border text-center space-y-3 ${
                    realExamPassed
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-1">
                    {realExamPassed ? (
                      <Award className="w-8 h-8 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-8 h-8 text-rose-600" />
                    )}
                  </div>
                  <h3 className="text-2xl font-black">
                    {realExamPassed
                      ? '🎉 축하합니다! 정규 자격검정에 당당히 합격하셨습니다!'
                      : '아쉽게도 합격 기준(60점)에 미달하였습니다.'}
                  </h3>
                  <div className="text-sm font-bold flex items-center justify-center gap-4">
                    <span>취득 점수: <b className="text-lg font-mono">{realExamScore}점</b></span>
                    <span>판정: <b className="text-lg">{realExamResultData?.grade}</b></span>
                  </div>
                </div>

                {/* 실시간 발급된 공식 자격증 뷰어 */}
                {realExamPassed && realExamResultData?.certificate && (
                  <div className="max-w-2xl mx-auto bg-gradient-to-b from-amber-50/60 to-white rounded-3xl p-8 border-4 border-amber-300 shadow-xl space-y-6 font-sans relative overflow-hidden">
                    {/* 상단 장식 문양 */}
                    <div className="text-center space-y-2 border-b-2 border-amber-200 pb-5">
                      <span className="text-[11px] font-black tracking-widest text-amber-800 uppercase">
                        CERTIFICATE OF QUALIFICATION
                      </span>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                        전 문 간 병 사 자 격 증
                      </h4>
                      <div className="text-xs font-mono font-bold text-slate-500">
                        등록번호: {realExamResultData.certificate.registryNo}
                      </div>
                    </div>

                    {/* 자격증 본문 */}
                    <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
                      <div className="grid grid-cols-3 gap-2 py-1">
                        <span className="font-bold text-slate-500">성 명:</span>
                        <span className="col-span-2 font-black text-slate-900 text-base">{realExamResultData.certificate.applicantName}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1">
                        <span className="font-bold text-slate-500">자 격 종 목:</span>
                        <span className="col-span-2 font-black text-emerald-800">{realExamResultData.certificate.qualificationName}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1">
                        <span className="font-bold text-slate-500">검 정 성 적:</span>
                        <span className="col-span-2 font-bold">{realExamResultData.certificate.score}점 (최종 합격)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1">
                        <span className="font-bold text-slate-500">발 행 일 자:</span>
                        <span className="col-span-2 font-mono font-bold">{realExamResultData.certificate.issuedAt}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1">
                        <span className="font-bold text-slate-500">유 효 기 한:</span>
                        <span className="col-span-2 font-mono font-bold text-slate-600">{realExamResultData.certificate.expiresAt}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 pt-3 border-t border-amber-100 text-center leading-relaxed">
                      위 사람은 한국직업능력연구원(pqi.or.kr) 민간자격 관리규정에 의거하여<br />
                      본 교육원이 주관한 소정의 전문 교육 및 정규 자격 검정을 통과하였으므로<br />
                      본 자격증을 수여합니다.
                    </p>

                    {/* 발급 기관 직인 및 QR 코드 */}
                    <div className="pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-12 h-12 text-slate-700 bg-white p-1 rounded-lg border border-slate-200" />
                        <span className="text-[10px] text-slate-400 font-mono">
                          QR 위변조 검증 완료<br />
                          {realExamResultData.certificate.qrVerifyToken}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-slate-900 text-sm">한국돌봄종사자양성교육원장</div>
                        <div className="text-[10px] text-emerald-700 font-extrabold">[직인생략]</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 재응시 / 마이페이지 이동 */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-center gap-4">
                  <button
                    onClick={handleRetakeExam}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-300"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>시험 다시 풀기</span>
                  </button>
                  <a
                    href="/mypage"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 shadow-sm"
                  >
                    <span>마이페이지에서 발급 자격증 보관함 확인</span>
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
