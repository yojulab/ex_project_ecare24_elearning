import React, { useState } from 'react';
import { MOCK_DISEASES, MOCK_MVP_COURSES } from '@ecare24/utils';
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
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<number>(initialDiseaseId);
  const [downloaded, setDownloaded] = useState<boolean>(true);

  const disease = MOCK_DISEASES.find((d) => d.id === selectedDiseaseId) || MOCK_DISEASES[0];
  const course = MOCK_MVP_COURSES.find((c) => c.categoryId === selectedDiseaseId) || MOCK_MVP_COURSES[0];

  const handleDownload = () => {
    setDownloaded(!downloaded);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-8 bg-slate-50">
      {/* Disease Category Horizontal Tabs */}
      <div className="bg-white border-b border-slate-200 px-3 py-2.5 overflow-x-auto no-scrollbar sticky top-0 z-20">
        <div className="flex gap-1.5 min-w-max">
          {MOCK_DISEASES.filter((d) => d.isMvp).map((d) => (
            <UiBadge key={d.id} serialId={`P42-DIS-TAB${String(d.id).padStart(2, '0')}`}>
              <button
                onClick={() => setSelectedDiseaseId(d.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedDiseaseId === d.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d.nameKo}
              </button>
            </UiBadge>
          ))}
        </div>
      </div>

      {/* Course Hero Card */}
      <div className="p-4 bg-gradient-to-br from-slate-900 to-blue-950 text-white">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black bg-blue-500/80 px-2 py-0.5 rounded text-white">
            직능원 민간자격 과정
          </span>
          <UiBadge serialId="P42-SEC00-DL">
            <button
              onClick={handleDownload}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                downloaded
                  ? 'bg-emerald-600/90 text-white border-emerald-500'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              <Download size={13} />
              <span>{downloaded ? '오프라인 저장됨' : '교안 다운로드'}</span>
            </button>
          </UiBadge>
        </div>

        <h1 className="text-lg font-black mt-2 leading-snug">
          {disease.nameKo} 집중 간병전문과정
        </h1>
        <p className="text-xs text-slate-300 font-medium mt-1">
          {disease.shortDesc}
        </p>

        {/* Requirements info pills */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
            <span className="text-[10px] text-slate-300 block">이론 시간</span>
            <span className="font-black text-yellow-300">{disease.theoryHours}시간</span>
          </div>
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
            <span className="text-[10px] text-slate-300 block">실기 VOD</span>
            <span className="font-black text-yellow-300">{disease.practicalHours}시간</span>
          </div>
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
            <span className="text-[10px] text-slate-300 block">실습 평가</span>
            <span className="font-black text-yellow-300">{disease.practicumHours}시간</span>
          </div>
        </div>
      </div>

      {/* Core Clinical Care Points Alert */}
      <div className="p-4">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-blue-900 font-black text-sm">
            <AlertCircle size={16} />
            <span>핵심 임상 케어 포인트 (Care Points)</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {disease.coreCarePoints.map((point, idx) => (
              <span
                key={idx}
                className="text-[11px] font-bold text-blue-800 bg-white/80 px-2 py-1 rounded-lg border border-blue-100 flex items-center gap-1"
              >
                <span className="text-blue-500 font-black">•</span>
                <span className="truncate">{point}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SEC01: 4-Step Interactive Curriculum Stepper */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900">
            4단계 이수 커리큘럼 (필수 단계별 이수제)
          </h2>
          <span className="text-xs font-bold text-blue-600">진도율 85%</span>
        </div>

        {/* Step 1: Theory Materials */}
        <UiBadge serialId="P42-SEC01-STEP1" className="w-full">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                  <BookOpen size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                    Step 1 · 이론 교안
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5">
                    전문 교안 뷰어 & TTS 음성강의
                  </h3>
                </div>
              </div>
              <CheckCircle size={20} className="text-emerald-500 shrink-0" />
            </div>

            <p className="mt-2 text-xs font-medium text-slate-600">
              간병 실무 전문 용어(피딩, 엘튜브, PEG, 체변 등) 하이라이트 및 음성 듣기 지원.
            </p>

            <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Clock size={13} />
                <span>총 {disease.theoryHours}시간 이수 완료</span>
              </span>
              <button
                onClick={() => onOpenMaterial(disease.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 active:scale-95 shadow-sm"
              >
                <FileText size={14} />
                <span>교안 열람하기</span>
              </button>
            </div>
          </div>
        </UiBadge>

        {/* Step 2: Practical Videos (SNUBH Curated) */}
        <UiBadge serialId="P42-SEC01-STEP2" className="w-full">
          <div className="bg-white rounded-2xl p-4 border border-blue-300 ring-2 ring-blue-500/20 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                  <Video size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                    Step 2 · 실기 VOD
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5">
                    임상 실기 VOD (SNUBH 큐레이션)
                  </h3>
                </div>
              </div>
              <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                학습 진행중
              </span>
            </div>

            <p className="mt-2 text-xs font-medium text-slate-600">
              분당서울대병원 공식 임상 간호 실기 영상 연계. 골든 룰 팁 팝업 제공.
            </p>

            <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Clock size={13} />
                <span>인정 상한 {disease.snubhCreditCapHours}시간 반영</span>
              </span>
              <button
                onClick={() =>
                  onOpenVideoPlayer({
                    title: `${disease.nameKo} 임상 실기 트레이닝`,
                    diseaseName: disease.nameKo,
                  })
                }
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 active:scale-95 shadow-sm"
              >
                <Play size={14} />
                <span>실기 영상 재생</span>
              </button>
            </div>
          </div>
        </UiBadge>

        {/* Step 3: Practicum Log */}
        <UiBadge serialId="P42-SEC01-STEP3" className="w-full">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                  <FileSpreadsheet size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-50 px-1.5 py-0.2 rounded">
                    Step 3 · 실습일지
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5">
                    현장 실습일지 및 지도자 승인
                  </h3>
                </div>
              </div>
              <CheckCircle size={20} className="text-emerald-500 shrink-0" />
            </div>

            <p className="mt-2 text-xs font-medium text-slate-600">
              환자 상태 관찰 기록, 체위변경(q2hr) 기록표 작성 및 지도간호사 서명 완료.
            </p>

            <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs font-bold text-slate-500">
              <span>서명 완료 (수석간호사 이영희)</span>
              <span className="text-emerald-600 font-black">승인 완료 ✓</span>
            </div>
          </div>
        </UiBadge>

        {/* Step 4: CBT Exam */}
        <UiBadge serialId="P42-SEC01-STEP4" className="w-full">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
                  <Award size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
                    Step 4 · 최종 평가
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5">
                    디지털 OMR CBT 자격시험 응시
                  </h3>
                </div>
              </div>
              <span className="text-xs font-black text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full animate-pulse">
                응시 가능
              </span>
            </div>

            <p className="mt-2 text-xs font-medium text-slate-600">
              10대 골든 룰 및 임상 실무 시험. 합격 기준: 평균 60점 이상 (과목 과락 40점).
            </p>

            <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-blue-200">
              <span className="text-xs font-bold text-slate-600">
                시험 시간: 60분 (총 40문항)
              </span>
              <button
                onClick={() => onOpenExam(disease.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 active:scale-95 shadow-md"
              >
                <span>시험 응시하기</span>
              </button>
            </div>
          </div>
        </UiBadge>
      </div>
    </div>
  );
};
export default CourseDetailScreen;
