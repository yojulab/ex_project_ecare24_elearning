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
import {
  MOCK_MVP_COURSES,
  MOCK_EXAM_QUESTIONS,
} from '@ecare24/utils';
import UiBadge from '../../../components/UiBadge';
import { ENV } from '@/config/env';

// HeyGen 사용자 제공 실비디오 목록 (2개 영상)
const HEYGEN_VIDEOS = [
  {
    id: '1-15-ff12fa129347edd33a1cd0325cc13ac7',
    title: '환자 안전을 지키는 간병 10대 골든 룰 실기 개요 (HeyGen AI 전문강사)',
    duration: '3분 30초',
    videoUrl: 'https://app.heygen.com/videos/1-15-ff12fa129347edd33a1cd0325cc13ac7',
    embedUrl: 'https://app.heygen.com/embeds/1-15-ff12fa129347edd33a1cd0325cc13ac7',
    desc: '탈건착환, q2hr 체위변경, 유린백 방광하단 거치, 석션 15초 제한 등 임상 10대 수칙 실기 시연',
  },
  {
    id: '1-15-1ea6d589354cb4aadd79a0ce6c9887a9',
    title: '돌봄종사자 양성과정 오리엔테이션 및 임상 첫걸음 (HeyGen AI 전문강사)',
    duration: '3분 05초',
    videoUrl: 'https://app.heygen.com/videos/1-15-1ea6d589354cb4aadd79a0ce6c9887a9',
    embedUrl: 'https://app.heygen.com/embeds/1-15-1ea6d589354cb4aadd79a0ce6c9887a9',
    desc: '대학병원 표준 임상 술기 가이드라인 및 환자 권리 보호 교육원 수료 오리엔테이션',
  },
];

// 실제 시험 문항 (DB exam_questions 연동 및 기본 실제 임상 5문항)
const REAL_EXAM_QUESTIONS = [
  {
    id: 'exam-q1',
    questionNumber: 1,
    title: '우측 편마비 환자의 단추 달린 상의를 갈아입힐 때 올바른 순서는?',
    scenario: '뇌경색으로 인해 우측 상하지 마비가 있는 72세 박○○ 환자가 땀으로 젖은 옷을 갈아입으려 한다.',
    points: 20,
    options: [
      { no: 1, text: '벗길 때 우측(환측) 먼저, 입힐 때 좌측(건측) 먼저' },
      { no: 2, text: '벗길 때 좌측(건측) 먼저, 입힐 때 우측(환측) 먼저 (탈건착환 공식)' },
      { no: 3, text: '상의 단추를 모두 잠근 채 머리부터 강제로 벗긴다' },
      { no: 4, text: '좌측과 우측 구분 없이 손에 잡히는 쪽부터 무작위로 당긴다' },
    ],
    correctAnswer: 2,
    explanation: '편마비 환자의 의복 교체 골든 룰은 [탈건착환]입니다. 벗길 때는 자유로운 건강한 쪽(좌측)을 먼저 벗겨 공간을 확보하고, 입힐 때는 움직임이 불편한 마비된 쪽(우측)을 먼저 끼워 넣어야 어깨 탈구와 통증을 예방할 수 있습니다.',
    carePointTag: '탈건착환 공식 (골든룰 1)',
  },
  {
    id: 'exam-q2',
    questionNumber: 2,
    title: '경관유동식(L-tube 피딩) 주입 시 흡인성 폐렴을 예방하기 위한 올바른 환자 자세는?',
    scenario: '연하곤란으로 비위관을 삽입 중인 80세 이○○ 환자에게 점심 유동식 300ml를 주입하려 한다.',
    points: 20,
    options: [
      { no: 1, text: '편안하게 천장을 보고 똑바로 누운 앙와위 자세' },
      { no: 2, text: '상체를 30~45도 올린 반좌위(Fowler) 자세' },
      { no: 3, text: '베개를 빼고 머리를 침대 밑으로 낮춘 트렌델렌버그 자세' },
      { no: 4, text: '엎드려서 턱을 바닥에 괸 복위 자세' },
    ],
    correctAnswer: 2,
    explanation: '경관영양 주입 시 중력에 의해 음식물이 역류하여 기도로 흡인(Aspiration)되는 것을 방지하기 위해 반드시 상체를 30~45도 거상한 반좌위를 취해야 하며, 주입 후에도 30분 이상 이 자세를 유지해야 합니다.',
    carePointTag: '상체 30도 반좌위 (골든룰 2)',
  },
  {
    id: 'exam-q3',
    questionNumber: 3,
    title: '유치도뇨관(Foley)을 삽입 중인 환자의 유린백(소변백) 관리로 가장 적절한 것은?',
    scenario: '요폐로 유치도뇨관을 유지 중인 68세 환자가 침상에서 휠체어로 이동하려 한다.',
    points: 20,
    options: [
      { no: 1, text: '이동이 편하도록 유린백을 환자 무릎 위나 가슴 위에 올려놓는다' },
      { no: 2, text: '유린백을 침대 난간 가장 높은 곳에 걸어 소변 배출을 확인한다' },
      { no: 3, text: '유린백을 항상 환자의 방광보다 낮은 위치에 유지하며 바닥에 닿지 않게 한다' },
      { no: 4, text: '소변백 관이 꼬이더라도 배출구만 잠그면 상관없다' },
    ],
    correctAnswer: 3,
    explanation: '소변백이 방광보다 높게 위치하면 역류로 인해 요로감염(CAUTI) 및 패혈증이 발생하므로, 유린백은 항상 방광보다 아래에 거치해야 합니다.',
    carePointTag: '방광 하단 거치 (골든룰 3)',
  },
  {
    id: 'exam-q4',
    questionNumber: 4,
    title: '기도 내 분비물 흡인(석션) 시 1회 흡인 시간의 안전 기준은?',
    scenario: '기관절개관을 통해 가래 끓는 소리가 심하여 석션을 시행하고자 한다.',
    points: 20,
    options: [
      { no: 1, text: '가래가 완전히 다 나올 때까지 1분 이상 지속한다' },
      { no: 2, text: '환자가 숨을 참을 수 있을 때까지 30~40초간 시행한다' },
      { no: 3, text: '1회 흡인은 반드시 15초 이내로 제한하고 충분한 산소를 공급한다' },
      { no: 4, text: '카테터를 강하게 회전시키며 5초 미만으로 끝낸다' },
    ],
    correctAnswer: 3,
    explanation: '석션 시 폐 내부의 산소도 함께 흡인되므로 1회 흡인 시간은 반드시 15초 이내로 제한해야 합니다. 이를 초과하면 심각한 저산소증과 심장 부정맥이 발생할 수 있습니다.',
    carePointTag: '15초 이내 흡인 (골든룰 4)',
  },
  {
    id: 'exam-q5',
    questionNumber: 5,
    title: '와상 상태의 노인 환자에게 욕창을 예방하기 위한 체위변경 주기 원칙은?',
    scenario: '뇌출혈 후유증으로 스스로 체위를 변경하지 못하는 85세 와상 환자를 간병하고 있다.',
    points: 20,
    options: [
      { no: 1, text: '하루 3번 식사 시간에만 맞추어 변경한다' },
      { no: 2, text: '밤에는 수면을 방해하지 않도록 아침까지 그대로 둔다' },
      { no: 3, text: '낮과 밤을 불문하고 최소 2시간(q2hr) 간격으로 규칙적으로 변경한다' },
      { no: 4, text: '환자가 아프다고 통증을 호소할 때만 변경한다' },
    ],
    correctAnswer: 3,
    explanation: '지속적인 압박으로 인한 피부 괴사를 막기 위해 와상 환자의 체위변경은 2시간마다(q2hr) 앙와위-측위 순으로 규칙적으로 시행해야 합니다.',
    carePointTag: 'q2hr 체변 (골든룰 5)',
  },
];

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course =
    MOCK_MVP_COURSES.find((c) => c.id === params.id) || MOCK_MVP_COURSES[0];

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: 문구형 교안 상태
  const [isTheoryReadComplete, setIsTheoryReadComplete] = useState<boolean>(true);

  // Step 2: HeyGen 비디오 플레이어 상태
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [videoProgress, setVideoProgress] = useState<number>(100);
  const [speedWarning, setSpeedWarning] = useState<string | null>(null);

  // Step 3: OMR 모의고사 상태
  const [mockAnswers, setMockAnswers] = useState<Record<string, number>>({});
  const [mockSubmitted, setMockSubmitted] = useState<boolean>(false);
  const [mockScore, setMockScore] = useState<number>(0);

  // Step 4: 실제 시험 항목 및 실시간 통과 상태
  const [realQuestions, setRealQuestions] = useState<any[]>(REAL_EXAM_QUESTIONS);
  const [realExamAnswers, setRealExamAnswers] = useState<Record<string, number>>({});
  const [isExamSubmitting, setIsExamSubmitting] = useState<boolean>(false);
  const [realExamSubmitted, setRealExamSubmitted] = useState<boolean>(false);
  const [realExamScore, setRealExamScore] = useState<number>(0);
  const [realExamPassed, setRealExamPassed] = useState<boolean>(false);
  const [realExamResultData, setRealExamResultData] = useState<any>(null);
  const [applicantName, setApplicantName] = useState<string>('박순자');
  const [examAutoSavedTime, setExamAutoSavedTime] = useState<string>('방금 실시간 동기화 완료');
  const [examRemainingSeconds, setExamRemainingSeconds] = useState<number>(1800); // 30분 시험

  // 백엔드 실제 시험 문항 로드
  useEffect(() => {
    fetch(`${ENV.API_BASE_URL}/exam-questions`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Exam API offline');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((q: any, idx: number) => ({
            id: q.id,
            questionNumber: idx + 1,
            title: q.title,
            scenario: q.scenario,
            points: q.points || 20,
            options: q.options || [],
            correctAnswer: Number(q.correctAnswer) || 2,
            explanation: q.explanation,
            carePointTag: q.terminologyTags?.join(', ') || '임상 핵심',
          }));
          setRealQuestions(formatted);
        }
      })
      .catch(() => {
        // Fallback REAL_EXAM_QUESTIONS 유지
      });
  }, []);

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
  const handleSelectMockOption = (qId: string, optNo: number) => {
    setMockAnswers((prev) => ({ ...prev, [qId]: optNo }));
  };
  const handleSubmitMock = () => {
    let correct = 0;
    MOCK_EXAM_QUESTIONS.forEach((q) => {
      if (mockAnswers[q.id] === q.correctAnswer) correct++;
    });
    setMockScore(Math.round((correct / MOCK_EXAM_QUESTIONS.length) * 100));
    setMockSubmitted(true);
  };

  // Step 4 실제 시험 OMR 답안 선택
  const handleSelectRealOption = (qId: string, optNo: number) => {
    setRealExamAnswers((prev) => ({ ...prev, [qId]: optNo }));
    setExamAutoSavedTime('방금 OMR 마킹 실시간 자동저장');
  };

  // Step 4 실제 시험 제출 및 실시간 통과 처리
  const handleSubmitRealExam = async () => {
    setIsExamSubmitting(true);
    try {
      const res = await fetch(`${ENV.API_BASE_URL}/exams/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: realExamAnswers,
          applicantName,
          courseId: course.id,
          courseTitle: `${course.qualificationName} 1급`,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setRealExamScore(result.score);
        setRealExamPassed(result.isPassed);
        setRealExamResultData(result);
        setRealExamSubmitted(true);
      } else {
        throw new Error('API 응답 에러');
      }
    } catch {
      // 오프라인 fallback 실시간 채점 엔진 가동
      let correctCount = 0;
      realQuestions.forEach((q) => {
        if (realExamAnswers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      });
      const calculatedScore = Math.round((correctCount / realQuestions.length) * 100);
      const isPassed = calculatedScore >= 60;
      const now = new Date();
      const issueDateStr = now.toISOString().split('T')[0];
      const expiryDate = new Date(now);
      expiryDate.setFullYear(expiryDate.getFullYear() + 2);
      const expiryDateStr = expiryDate.toISOString().split('T')[0];
      const certNo = `EC24-${now.getFullYear()}-NEURO-${Math.floor(Math.random() * 90000 + 10000)}`;

      setRealExamScore(calculatedScore);
      setRealExamPassed(isPassed);
      setRealExamResultData({
        success: true,
        score: calculatedScore,
        isPassed,
        correctCount,
        totalQuestions: realQuestions.length,
        grade: calculatedScore >= 90 ? '최우수 (특급)' : calculatedScore >= 80 ? '우수 (1급)' : '합격',
        certificate: isPassed
          ? {
              registryNo: certNo,
              qualificationName: `${course.qualificationName} 1급`,
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
    } finally {
      setIsExamSubmitting(false);
    }
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

  const currentHeygen = HEYGEN_VIDEOS[activeVideoIndex];
  const realExamUnansweredCount = realQuestions.length - Object.keys(realExamAnswers).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* 뒤로가기 및 과정 헤더 */}
      <div className="flex items-center justify-between">
        <a
          href="/curriculum"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>전체 16대 질환군 전문 커리큘럼으로 돌아가기</span>
        </a>
        <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {course.categoryCode || 'TRK-02'}
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
              <span className="font-extrabold text-emerald-800">
                총 {course.totalHours}시간 (이론 {course.theoryHours}h / 실기 {course.practicalHours}h)
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">임상 기준:</span>
              <span className="font-bold text-slate-800">
                대학병원 표준 임상 실기 10대 골든 룰
              </span>
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
              { step: 1, name: '1. 이론 심화교안 (문구형)', icon: <BookOpen className="w-4 h-4" /> },
              { step: 2, name: '2. 4K 실기 & 실습 (HeyGen)', icon: <Video className="w-4 h-4" /> },
              { step: 3, name: '3. OMR 모의고사', icon: <FileCheck className="w-4 h-4" /> },
              { step: 4, name: '4. 정규 자격검정 (실시간 시험)', icon: <Award className="w-4 h-4" /> },
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
          Step 1: TTS 아닌 문구형 교안 (P03-SEC01-TIT01)
          ==================================================================== */}
      {currentStep === 1 && (
        <div data-serial-id="P03-SEC01-THEORY" className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
            {/* 상단 문구형 교안 헤더 */}
            <div className="border-b border-slate-200 pb-5">
              <UiBadge serialId="P03-SEC01-TIT01" label="[P03-SEC01-TIT01]">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-sm font-black">
                    文
                  </span>
                  Step 1. 뇌졸중 병태생리 및 임상 케어 이론 교안 (문구형 정규 교안)
                </h2>
              </UiBadge>
              <p className="text-xs text-slate-500 mt-2">
                ※ 본 교안은 TTS 오디오가 아닌, 대학병원 표준 임상 술기 가이드라인과 10대 골든 룰에 기반한 텍스트 전문 문구형 교안입니다.
              </p>
            </div>

            {/* 문구형 정규 교안 5대 챕터 본문 */}
            <div className="space-y-8 text-slate-800 leading-relaxed font-sans">
              {/* 제1장 */}
              <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                  제1장
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  뇌졸중(뇌경색·뇌출혈) 편마비 환자의 신체 역학 및 견관절 보호 원칙
                </h3>
                <p className="text-sm text-slate-700">
                  뇌졸중으로 인한 편마비(Hemiplegia) 환자는 마비측의 관절을 지지하는 회전근개와 관절낭의 긴장도가 현저히 저하되어 있습니다. 특히 <b>견관절(어깨 관절)</b>은 중력과 외력에 매우 취약하므로, 간병인이 침상 이동이나 체위변경 시 환자의 마비된 팔을 잡아당기면 즉각적인 <b>아탈구(Subluxation)</b>와 비가역적 통증 증후군을 유발합니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <b className="text-indigo-900 block mb-1">허혈성 뇌졸중 (뇌경색)</b>
                    뇌혈관 폐색으로 인한 뇌조직 괴사. 급성기 4.5시간 이내 tPA 혈전용해제 투약 여부 및 출혈성 전환 징후 관찰 필수.
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <b className="text-rose-900 block mb-1">출혈성 뇌졸중 (뇌출혈)</b>
                    뇌혈관 파열로 인한 두개내압(ICP) 상승. 혈압의 급격한 변동 방지 및 배변 시 과도한 복압 상승 억제 케어.
                  </div>
                </div>
              </section>

              {/* 제2장: 핵심 골든룰 탈건착환 */}
              <section className="bg-emerald-50/80 p-6 rounded-2xl border-2 border-emerald-500 space-y-3">
                <span className="text-xs font-black text-emerald-900 bg-emerald-200 px-2.5 py-1 rounded">
                  제2장. 핵심 골든 룰 1
                </span>
                <h3 className="text-lg font-black text-emerald-950">
                  골든 룰 체크: 탈건착환 (脫健着患) 정밀 프로토콜
                </h3>
                <p className="text-sm text-emerald-900">
                  <b>"벗길 때는 건강한 쪽(건측)부터, 입힐 때는 마비된 쪽(환측)부터!"</b>
                </p>
                <div className="bg-white p-4 rounded-xl border border-emerald-300 text-xs text-slate-800 space-y-2">
                  <div className="font-extrabold text-emerald-800">
                    ■ 단추 달린 상의 의복 교체 4단계 순서:
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                    <li>환자의 단추를 위에서부터 아래로 풀고, 옷깃을 정돈합니다.</li>
                    <li>자유롭게 움직일 수 있는 <b>건강한 팔(건측)</b>을 먼저 부드럽게 벗겨내어 옷의 품을 최대한 넓힙니다.</li>
                    <li>상의를 환자의 등 뒤를 거쳐 마비된 어깨 쪽으로 조심스럽게 모아 이동시킵니다.</li>
                    <li>마지막으로 <b>마비된 팔(환측)</b>의 손목과 팔꿈치를 아래에서 받쳐 지지하면서 옷소매를 부드럽게 빼냅니다. (입힐 때는 이의 역순으로 환측 소매 먼저 착용)</li>
                  </ol>
                </div>
              </section>

              {/* 제3장: q2hr 체위변경 */}
              <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-black text-teal-800 bg-teal-100 px-2.5 py-1 rounded">
                  제3장. 핵심 골든 룰 2
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  2시간 주기 체위변경(q2hr) 및 앙와위·측위 관절 정렬
                </h3>
                <p className="text-sm text-slate-700">
                  와상 및 반와상 환자는 동일 자세로 2시간 이상 지속될 경우 천골부와 대전자 부위 모세혈관 폐색으로 욕창(Pressure Ulcer)이 급속히 발생합니다.
                  따라서 <b>낮과 밤을 불문하고 2시간 간격(q2hr)</b>으로 앙와위(똑바로 누운 자세)와 좌·우 측위(옆으로 누운 자세)를 번갈아 변경해야 합니다.
                </p>
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                  💡 <b>주의</b>: 측위 시 양 무릎 사이에 베개를 끼워 골반 비틀림과 무릎 안쪽 뼈 마찰을 방지하며, 마비된 팔 아래에 지지 베개를 바쳐 어깨 관절 아탈구를 예방합니다.
                </div>
              </section>

              {/* 제4장: 연하곤란 & 아스피레이션 */}
              <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-black text-indigo-800 bg-indigo-100 px-2.5 py-1 rounded">
                  제4장. 핵심 골든 룰 3
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  연하곤란(Dysphagia) 환자의 아스피레이션(흡인성 폐렴) 예방 수칙
                </h3>
                <p className="text-sm text-slate-700">
                  뇌졸중 후유증 환자의 다수는 연하반사 저하로 음식물이나 침이 기도로 넘어가는 흡인 위험이 매우 높습니다.
                  경관영양(L-tube 피딩) 또는 경구 식사 시 <b>상체를 30~45도 거상한 반좌위(Fowler)</b>를 취하고, 턱을 가슴 쪽으로 당긴(Chin-tuck) 자세에서 천천히 진행합니다. 주입 완료 후에도 최소 30분간 좌위를 유지합니다.
                </p>
              </section>

              {/* 제5장: FAST 법칙 */}
              <section className="bg-rose-50/60 p-6 rounded-2xl border border-rose-200 space-y-3">
                <span className="text-xs font-black text-rose-800 bg-rose-100 px-2.5 py-1 rounded">
                  제5장. 응급 이상징후 감별
                </span>
                <h3 className="text-lg font-black text-rose-950">
                  급성기 재발 위험 징후: FAST 법칙 및 즉각 구두 노티(Notification)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-rose-200 text-center">
                    <div className="font-black text-rose-700 text-sm">F</div>
                    <div className="font-bold text-slate-800 mt-1">Facial Droop</div>
                    <div className="text-[11px] text-slate-500">한쪽 입꼬리 처짐</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-rose-200 text-center">
                    <div className="font-black text-rose-700 text-sm">A</div>
                    <div className="font-bold text-slate-800 mt-1">Arm Weakness</div>
                    <div className="text-[11px] text-slate-500">한쪽 팔 힘빠짐/저림</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-rose-200 text-center">
                    <div className="font-black text-rose-700 text-sm">S</div>
                    <div className="font-bold text-slate-800 mt-1">Slurred Speech</div>
                    <div className="text-[11px] text-slate-500">발음 이상/언어장애</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-rose-200 text-center">
                    <div className="font-black text-rose-700 text-sm">T</div>
                    <div className="font-bold text-slate-800 mt-1">Time to Notify</div>
                    <div className="text-[11px] text-slate-500">1초도 지체없이 보고</div>
                  </div>
                </div>
              </section>
            </div>

            {/* Step 1 완료 액션 바 */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-800 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                <input
                  type="checkbox"
                  checked={isTheoryReadComplete}
                  onChange={(e) => setIsTheoryReadComplete(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span>이론 문구형 교안 전 단원을 정독하였음을 확인합니다. (이론 4시간 인정)</span>
              </label>

              <UiBadge serialId="P03-SEC01-BTN02" label="[P03-SEC01-BTN02]">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm transition shadow"
                >
                  Step 2. 4K 실기 영상 학습으로 이동 ▷
                </button>
              </UiBadge>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          Step 2: 제공 링크로 등록된 실기 영상 재생 (P02-SEC02-STP02)
          ==================================================================== */}
      {currentStep === 2 && (
        <div data-serial-id="P04-SEC01-VOD" className="space-y-6">
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-6">
            {/* 상단 비디오 헤더 */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <UiBadge serialId="P04-SEC01-TIT01" label="[P04-SEC01-TIT01]">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
                      4K
                    </span>
                    Step 2. 4K 실기 & 실습 (HeyGen 공인 영상 연동)
                  </h2>
                </UiBadge>
                <p className="text-xs text-slate-400 mt-1">
                  제공된 HeyGen 비디오 링크로 등록된 실제 임상 강좌가 재생됩니다.
                </p>
              </div>

              {/* 배속 조절기 */}
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400">재생 속도:</span>
                {[1.0, 1.25, 1.5, 2.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSetSpeed(s)}
                    className={`px-2 py-0.5 rounded font-bold font-mono transition ${
                      playbackSpeed === s
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {speedWarning && (
              <div className="bg-amber-950/80 border border-amber-600 text-amber-200 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{speedWarning}</span>
              </div>
            )}

            {/* 차시 선택 탭 버튼 (HeyGen 제공 2개 영상) */}
            <div className="flex flex-wrap gap-2">
              {HEYGEN_VIDEOS.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVideoIndex(idx)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                    activeVideoIndex === idx
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>제{idx + 1}강: {v.title.slice(0, 24)}... ({v.duration})</span>
                </button>
              ))}
            </div>

            {/* 실제 HeyGen 영상 재생 iframe 플레이어 (P02-SEC02-STP02) */}
            <div className="space-y-2">
              <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden border-2 border-slate-800 relative shadow-2xl">
                <iframe
                  src={currentHeygen.embedUrl}
                  title={currentHeygen.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* 하단 비디오 정보 바 및 외부 원본 링크 */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-900 rounded-xl text-xs">
                <div>
                  <div className="font-extrabold text-white text-sm">
                    {currentHeygen.title}
                  </div>
                  <div className="text-slate-400 text-xs mt-0.5">
                    {currentHeygen.desc}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <UiBadge serialId="P04-SEC01-PLY01" label="[P04-SEC01-PLY01]">
                    <a
                      href={currentHeygen.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold border border-slate-700 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>HeyGen 원본 링크 열기</span>
                    </a>
                  </UiBadge>
                </div>
              </div>
            </div>

            {/* 하단 진도율 및 다음 단계 이동 */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>4K 실기 시뮬레이션 진도율 100% 충족 완료 (실기 4시간 인정)</span>
              </div>

              <UiBadge serialId="P04-SEC01-BTN02" label="[P04-SEC01-BTN02]">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition shadow cursor-pointer"
                >
                  Step 4. 정규 자격검정 (실제 시험) 응시하기 ▷
                </button>
              </UiBadge>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          Step 3: 단원별 OMR 모의고사 (P06-SEC01-CBT)
          ==================================================================== */}
      {currentStep === 3 && (
        <div data-serial-id="P06-SEC01-CBT" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 w-full">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <UiBadge serialId="P06-SEC01-TIT01" label="[P06-SEC01-TIT01]">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Step 3. 신경계 전문간병사 단원별 모의고사
                  </h2>
                </UiBadge>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  모의평가 모드
                </span>
              </div>

              <div className="space-y-6">
                {MOCK_EXAM_QUESTIONS.map((q) => (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-extrabold text-xs shrink-0">
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

                    <div className="space-y-2 pt-2">
                      {q.options.map((opt) => (
                        <div
                          key={opt.no}
                          onClick={() => handleSelectMockOption(q.id, opt.no)}
                          className={`p-3 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold transition flex items-center gap-3 border ${
                            mockAnswers[q.id] === opt.no
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold border ${
                              mockAnswers[q.id] === opt.no
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'border-slate-300 text-slate-400'
                            }`}
                          >
                            {opt.no}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                      ))}
                    </div>

                    {mockSubmitted && (
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

            {/* 모의고사 제출 카드 */}
            <div className="w-full lg:w-72 bg-amber-50/80 rounded-3xl p-5 border-2 border-amber-200 shadow-md sticky top-36 shrink-0 space-y-4">
              <div className="border-b border-amber-200 pb-3">
                <div className="text-xs font-extrabold text-amber-900">
                  모의고사 채점판
                </div>
              </div>
              <button
                onClick={handleSubmitMock}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-xl text-xs transition"
              >
                모의고사 간이 채점
              </button>
              {mockSubmitted && (
                <div className="p-3 bg-white rounded-xl text-center border border-emerald-200 space-y-2">
                  <div className="text-xs text-slate-500">모의 채점 결과</div>
                  <div className="text-2xl font-black text-emerald-700">{mockScore}점</div>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-xl transition"
                  >
                    Step 4. 정규 자격검정 응시 ▷
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          Step 4: 실제 시험 항목으로 변경, 관련 통과는 실시간 (P02-SEC02-STP04)
          ==================================================================== */}
      {currentStep === 4 && (
        <div data-serial-id="P08-SEC01-CERT" className="space-y-6">
          {/* A. 실시간 시험 합격 완료된 경우: 디지털 공적 자격증 즉시 렌더링 */}
          {realExamSubmitted && realExamPassed && realExamResultData ? (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-8 animate-fade-in">
              <div className="text-center space-y-2">
                <UiBadge serialId="P08-SEC01-TIT01" label="[P08-SEC01-TIT01]">
                  <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-black mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>실시간 합격 심사 승인 완료</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    축하합니다! 정규 자격검정 실시간 합격
                  </h2>
                </UiBadge>
                <p className="text-sm text-slate-600">
                  한국직업능력연구원(pqi.or.kr) 등록 민간자격 디지털 공적 자격증이 실시간 발급되었습니다.
                </p>
              </div>

              {/* 디지털 모바일 자격증 카드 (Wallet Card) */}
              <div className="bg-gradient-to-tr from-slate-950 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-400 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase block">
                      ecare24 Certified Specialized Caregiver
                    </span>
                    <div className="text-2xl font-black mt-1">
                      {realExamResultData.certificate?.qualificationName || `${course.qualificationName} 1급`}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      등록번호: {realExamResultData.certificate?.registryNo || 'EC24-2026-NEURO-77492'}
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded-xl shadow shrink-0">
                    <div className="w-16 h-16 bg-slate-900 rounded flex items-center justify-center text-[10px] font-mono text-white text-center leading-tight">
                      [2D QR<br />VERIFY]
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row justify-between text-xs gap-3">
                  <div>
                    <span className="text-slate-400 block">수검자 성명</span>
                    <span className="font-extrabold text-sm text-white">{applicantName} (1965.04.12)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">실시간 취득 점수</span>
                    <span className="font-extrabold text-sm text-emerald-400">
                      {realExamScore}점 ({realExamResultData.grade || '우수 1급'})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">유효 기간 (2년)</span>
                    <span className="font-mono text-slate-200">
                      {realExamResultData.certificate?.issuedAt} ~ {realExamResultData.certificate?.expiresAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* 자격증 출력 및 공적 검증 링크 액션 */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <UiBadge serialId="P08-SEC01-BTN01" label="[P08-SEC01-BTN01]">
                  <button
                    onClick={() => alert(`[${applicantName}] 수검자의 고해상도 PDF 자격인증서가 정상 생성되었습니다.`)}
                    className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition shadow"
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
                    <QrCode className="w-4 h-4 text-emerald-700" />
                    <span>공적 QR 진위검증 페이지 바로가기</span>
                  </a>
                </UiBadge>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={handleRetakeExam}
                  className="text-xs text-slate-400 hover:text-slate-600 underline"
                >
                  [테스트용: 자격검정 다시 응시하기]
                </button>
              </div>
            </div>
          ) : (
            /* B. 시험 응시 모드: 실제 시험 항목 출제 및 실시간 통과 처리 (P02-SEC02-STP04) */
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* 좌측: 실제 시험 항목 문제 풀이 영역 */}
              <div className="flex-1 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <UiBadge serialId="P02-SEC02-STP04" label="[P02-SEC02-STP04]">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        4. 정규 자격검정 (한국돌봄종사자양성교육원 공인 시험)
                      </h2>
                    </UiBadge>
                    <p className="text-xs text-slate-500 mt-1">
                      실제 시험 항목으로 출제되며, 답안 제출 즉시 <b>실시간 통과 판정 및 자격증이 발급</b>됩니다.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">수검자:</span>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg font-bold w-24 text-center focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* 불합격 시 안내 배너 */}
                {realExamSubmitted && !realExamPassed && (
                  <div className="bg-rose-50 border-2 border-rose-400 p-4 rounded-2xl text-rose-900 text-xs flex items-center justify-between">
                    <div>
                      <b>과락 불합격 판정 ({realExamScore}점 / 60점 미만)</b>
                      <p className="mt-0.5 text-rose-700">임상 기준에 미달되었습니다. 오답을 확인하고 재시험에 응시하십시오.</p>
                    </div>
                    <button
                      onClick={handleRetakeExam}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-lg text-xs"
                    >
                      실시간 재응시
                    </button>
                  </div>
                )}

                {/* 실제 시험 항목 목록 */}
                <div className="space-y-8">
                  {realQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-xs shrink-0">
                          {q.questionNumber}
                        </span>
                        <div>
                          <div className="font-black text-base text-slate-900 leading-snug">
                            {q.title}
                            <span className="ml-2 text-xs font-mono font-bold text-emerald-700">
                              [{q.points}점]
                            </span>
                          </div>
                          {q.scenario && (
                            <div className="mt-2 p-3 rounded-xl bg-amber-50 text-amber-900 text-xs font-medium border border-amber-200">
                              <b>[실제 임상 상황]</b> {q.scenario}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 4지선다 보기 */}
                      <div className="space-y-2 pt-2">
                        {q.options.map((opt: any) => (
                          <div
                            key={opt.no}
                            onClick={() => handleSelectRealOption(q.id, opt.no)}
                            className={`p-3.5 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold transition flex items-center gap-3 border ${
                              realExamAnswers[q.id] === opt.no
                                ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold border ${
                                realExamAnswers[q.id] === opt.no
                                  ? 'bg-emerald-700 text-white border-emerald-700'
                                  : 'border-slate-300 text-slate-400'
                              }`}
                            >
                              {opt.no}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                        ))}
                      </div>

                      {/* 시험 제출 후 오답 해설 */}
                      {realExamSubmitted && (
                        <div className={`mt-3 p-3.5 rounded-xl text-xs space-y-1 border ${
                          realExamAnswers[q.id] === q.correctAnswer
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                            : 'bg-rose-50/70 border-rose-300 text-rose-900'
                        }`}>
                          <div className="font-black">
                            {realExamAnswers[q.id] === q.correctAnswer ? '✓ 정답!' : '✗ 오답!'} 정답은 [{q.correctAnswer}번]입니다. (핵심: {q.carePointTag})
                          </div>
                          <div className="text-slate-700 leading-relaxed mt-1">
                            {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 우측: 실제 디지털 OMR 답안 마킹판 & 실시간 통과 제출 버튼 */}
              <div
                data-serial-id="P06-SEC02-OMR"
                className="w-full lg:w-80 bg-amber-50/90 rounded-3xl p-6 border-2 border-amber-300 shadow-lg sticky top-36 shrink-0 space-y-5"
              >
                <div className="border-b border-amber-200 pb-3">
                  <div className="text-xs font-black text-amber-950 flex items-center justify-between">
                    <span>정규 자격검정 OMR 마킹판</span>
                    <span className="font-mono text-[11px] text-emerald-700 font-bold">
                      실시간 채점 연동
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-3 font-bold">
                    <span>미마킹 문항 수:</span>
                    <span className="text-rose-600 font-black text-sm">
                      {realExamUnansweredCount}문항 남음
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1 text-slate-500">
                    <span>남은 시험 시간:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {Math.floor(examRemainingSeconds / 60)}분 {examRemainingSeconds % 60}초
                    </span>
                  </div>
                </div>

                {/* 문항별 OMR 마킹 */}
                <div className="space-y-3 font-mono text-xs">
                  {realQuestions.map((q) => (
                    <div key={q.id} className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 w-8">
                        {q.questionNumber}번
                      </span>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4].map((num) => (
                          <button
                            key={num}
                            onClick={() => handleSelectRealOption(q.id, num)}
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition border ${
                              realExamAnswers[q.id] === num
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

                {/* 실시간 통과 제출 버튼 */}
                <div className="pt-4 border-t border-amber-200 space-y-3">
                  <UiBadge serialId="P06-SEC02-BTN01" label="[P06-SEC02-BTN01]" className="w-full">
                    <button
                      disabled={isExamSubmitting}
                      onClick={handleSubmitRealExam}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3.5 rounded-2xl text-xs sm:text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isExamSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>실시간 채점 및 심사진행 중...</span>
                        </>
                      ) : (
                        <>
                          <Award className="w-4 h-4" />
                          <span>답안 최종 제출 및 실시간 통과 판정</span>
                        </>
                      )}
                    </button>
                  </UiBadge>

                  <div className="text-[11px] text-center text-slate-500">
                    {examAutoSavedTime}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
