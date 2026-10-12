import React, { useState, useEffect } from 'react';
import { MOCK_EXAM_QUESTIONS } from '@ecare24/utils';
import { ExamQuestion } from '@ecare24/types';
import { UiBadge } from '../components/UiBadge';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';

interface ExamScreenProps {
  courseId?: number;
  onNavigateToWallet: () => void;
  onBackToCourse: () => void;
}

export const ExamScreen: React.FC<ExamScreenProps> = ({
  courseId = 1,
  onNavigateToWallet,
  onBackToCourse,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(3600); // 60분
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [omrOpen, setOmrOpen] = useState<boolean>(false);

  // Filter questions for current course or default
  const questions: ExamQuestion[] = MOCK_EXAM_QUESTIONS.slice(0, 5);
  const currentQ = questions[currentIdx];

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const handleSelectAnswer = (qId: string, answerNum: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: answerNum,
    }));
  };

  // Submit and Calculate Score
  const handleSubmit = () => {
    if (Object.keys(userAnswers).length < questions.length) {
      const confirm = window.confirm(
        '아직 답안을 선택하지 않은 문항이 있습니다. 그대로 제출하시겠습니까?'
      );
      if (!confirm) return;
    }
    setIsSubmitted(true);
  };

  // Score Calculation
  let correctCount = 0;
  questions.forEach((q) => {
    if (userAnswers[q.id] === q.correctAnswer) {
      correctCount += 1;
    }
  });
  const score = Math.round((correctCount / questions.length) * 100);
  const isPassed = score >= 60;

  // Format time (MM:SS)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto no-scrollbar pb-10">
      {/* Top Header: Exam Status & Timer */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
            CBT 공식 평가
          </span>
          <span className="text-xs font-bold text-slate-700">
            문항 {currentIdx + 1} / {questions.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
            <Clock size={14} className="text-rose-600" />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
          <button
            onClick={() => setOmrOpen(!omrOpen)}
            className="text-xs font-black text-blue-600 hover:text-blue-800 px-2 py-1 rounded-lg border border-blue-200"
          >
            OMR {Object.keys(userAnswers).length}/{questions.length}
          </button>
        </div>
      </div>

      {/* Result Screen (After Submission) */}
      {isSubmitted ? (
        <div className="p-4 flex-1 animate-in fade-in duration-200">
          <UiBadge serialId="P44-SEC04-RESULT" className="w-full">
            <div
              className={`rounded-3xl p-6 text-center border shadow-lg ${
                isPassed
                  ? 'bg-gradient-to-b from-emerald-50 to-white border-emerald-200'
                  : 'bg-gradient-to-b from-rose-50 to-white border-rose-200'
              }`}
            >
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl shadow-sm mb-3">
                {isPassed ? (
                  <span className="text-emerald-600 bg-emerald-100 w-full h-full rounded-full flex items-center justify-center">
                    <Award size={36} />
                  </span>
                ) : (
                  <span className="text-rose-600 bg-rose-100 w-full h-full rounded-full flex items-center justify-center">
                    <XCircle size={36} />
                  </span>
                )}
              </div>

              <span
                className={`text-xs font-black uppercase px-2.5 py-1 rounded-full ${
                  isPassed
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isPassed ? '최종 합격 (PASSED)' : '불합격 (과락 재응시 요망)'}
              </span>

              <h2 className="text-2xl font-black text-slate-900 mt-2">
                취득 점수: {score}점
              </h2>
              <p className="text-xs font-medium text-slate-600 mt-1">
                정답 문항: {correctCount} / {questions.length} (합격 기준: 60점 이상)
              </p>

              {isPassed ? (
                <div className="mt-5 space-y-2">
                  <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    축하합니다! 보건복지부 직능원 민간자격 기준을 충족하였습니다.<br />
                    모바일 자격증 지갑에서 등록번호를 확인하세요.
                  </p>
                  <button
                    onClick={onNavigateToWallet}
                    className="w-full min-h-[50px] py-3 rounded-2xl bg-blue-600 text-white font-black text-sm shadow-md hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    모바일 자격증 카드 발급 확인하기 →
                  </button>
                </div>
              ) : (
                <div className="mt-5 space-y-2">
                  <p className="text-xs font-bold text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
                    10대 골든 룰 및 필수 과목 기준(40점 미만 과락)을 충족하지 못했습니다.<br />
                    오답노트를 복습 후 다시 응시해주세요.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setUserAnswers({});
                      setCurrentIdx(0);
                    }}
                    className="w-full min-h-[50px] py-3 rounded-2xl bg-rose-600 text-white font-black text-sm shadow-md hover:bg-rose-700 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw size={16} />
                    <span>시험 재응시하기</span>
                  </button>
                </div>
              )}
            </div>
          </UiBadge>

          {/* Answer Breakdown / Explanations */}
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-black text-slate-900">
              문항별 정답 및 골든 룰 해설
            </h3>
            {questions.map((q, idx) => {
              const isCorrect = userAnswers[q.id] === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border bg-white ${
                    isCorrect ? 'border-emerald-200' : 'border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">문항 {idx + 1}</span>
                    <span
                      className={`font-black flex items-center gap-1 ${
                        isCorrect ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      <span>{isCorrect ? '정답' : '오답'}</span>
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mt-1 leading-snug">
                    {q.title}
                  </h4>
                  {q.scenario && (
                    <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg">
                      {q.scenario}
                    </p>
                  )}
                  <div className="mt-2 text-xs font-bold text-slate-700 space-y-1">
                    <div className="p-2 rounded-lg bg-slate-50">
                      <span>내 답안: {userAnswers[q.id] ? `${userAnswers[q.id]}번` : '미응답'}</span>
                      <span className="ml-3 text-blue-600">정답: {q.correctAnswer}번</span>
                    </div>
                    {q.explanation && (
                      <p className="text-slate-600 font-medium p-2 bg-blue-50/50 rounded-lg text-[11px] leading-relaxed">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Question Answering View */
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* SEC01: Question Card */}
            <UiBadge serialId="P44-SEC01-QTEXT" className="w-full">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    문항 {currentIdx + 1}
                  </span>
                  {currentQ.carePointTag && (
                    <span className="text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
                      <ShieldAlert size={11} />
                      <span>{currentQ.carePointTag}</span>
                    </span>
                  )}
                </div>

                {currentQ.scenario && (
                  <div className="p-2.5 mb-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs font-medium text-slate-700 leading-relaxed">
                    <strong>[임상 상황]</strong> {currentQ.scenario}
                  </div>
                )}

                <h2 className="text-base font-black text-slate-900 leading-snug">
                  {currentQ.title}
                </h2>
              </div>
            </UiBadge>

            {/* Answer Choices (1 ~ 4) */}
            <div className="mt-4 space-y-2.5">
              {currentQ.options.map((opt) => {
                const optNum = opt.no;
                const isSelected = userAnswers[currentQ.id] === optNum;

                return (
                  <UiBadge
                    key={optNum}
                    serialId={`P44-SEC01-OPT${optNum}`}
                    className="w-full"
                  >
                    <div
                      onClick={() => handleSelectAnswer(currentQ.id, optNum)}
                      className={`cursor-pointer min-h-[52px] p-3.5 rounded-2xl border text-sm font-bold flex items-center gap-3 transition-all active:scale-[0.99] ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-white text-blue-600'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {optNum}
                      </span>
                      <span className="leading-snug">{opt.text}</span>
                    </div>
                  </UiBadge>
                );
              })}
            </div>
          </div>

          {/* Bottom Navigation Buttons (Prev / Next / Submit) */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
            <button
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
              className={`min-h-[48px] px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 border transition-all ${
                currentIdx === 0
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ChevronLeft size={16} />
              <span>이전 문항</span>
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                className="min-h-[48px] flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-black flex items-center justify-center gap-1 shadow-md hover:bg-blue-700"
              >
                <span>다음 문항</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <UiBadge serialId="P44-SEC03-SUBMIT" className="flex-1">
                <button
                  onClick={handleSubmit}
                  className="w-full min-h-[48px] py-2 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center justify-center gap-1 shadow-md hover:bg-emerald-700 active:scale-95"
                >
                  <CheckCircle2 size={16} />
                  <span>답안 최종 제출 (채점)</span>
                </button>
              </UiBadge>
            )}
          </div>
        </div>
      )}

      {/* Floating OMR Sheet Bottom Drawer */}
      {omrOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center p-0 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h3 className="text-sm font-black text-slate-900">
                  디지털 OMR 답안 마킹 시트
                </h3>
              </div>
              <button
                onClick={() => setOmrOpen(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                닫기
              </button>
            </div>

            <UiBadge serialId="P44-SEC02-OMR" className="w-full mt-3">
              <div className="space-y-2">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    onClick={() => {
                      setCurrentIdx(idx);
                      setOmrOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer"
                  >
                    <span className="text-xs font-bold text-slate-700">
                      #{idx + 1} 문항
                    </span>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4].map((num) => {
                        const isMarked = userAnswers[q.id] === num;
                        return (
                          <span
                            key={num}
                            className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center transition-all ${
                              isMarked
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {num}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </UiBadge>

            <button
              onClick={() => {
                setOmrOpen(false);
                handleSubmit();
              }}
              className="mt-4 w-full py-3 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-md"
            >
              지금 답안 제출하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ExamScreen;
