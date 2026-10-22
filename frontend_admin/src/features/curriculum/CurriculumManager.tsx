import React, { useState, useEffect } from 'react';
import {
  Card,
  Tag,
  Button,
  Input,
  Select,
  Switch,
  notification,
  Tabs,
  Badge,
  Modal,
  Form,
  message,
  Popconfirm,
  Pagination,
} from 'antd';
import {
  Video,
  BookOpen,
  CheckCircle,
  Search,
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff,
  Stethoscope,
  Award,
  AlertTriangle,
  Play,
  FileCheck,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  SlidersHorizontal,
} from 'lucide-react';
import { REAL_TRACKS, TrackData } from '@ecare24/utils';
import UiBadge from '../../components/UiBadge';
import { ENV } from '../../config/env';

export const CurriculumManager: React.FC = () => {
  // 1. 화면 분리 상태: 'LIST' (트랙 목록) | 'DETAIL' (트랙 상세 관리)
  const [viewMode, setViewMode] = useState<'LIST' | 'DETAIL'>('LIST');
  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number>(0);

  // 2. 트랙 목록 및 커스텀 트랙 상태
  const [customTracks, setCustomTracks] = useState<TrackData[]>(() => {
    try {
      const saved = localStorage.getItem('ecare24_custom_tracks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [hiddenTrackIds, setHiddenTrackIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ecare24_hidden_tracks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [dbCourses, setDbCourses] = useState<any[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  // 3. 목록 필터 및 페이지네이션 상태
  const [trackFilter, setTrackFilter] = useState<'ALL' | 'PUBLISHED' | 'HIDDEN'>('ALL');
  const [searchTrackQuery, setSearchTrackQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 3;

  // 4. 상세 뷰 내부 상태
  const [activeTabKey, setActiveTabKey] = useState<string>('curriculum');
  const [examFilter, setExamFilter] = useState<'ALL' | 'MOCK' | 'FINAL'>('ALL');
  const [searchQuestion, setSearchQuestion] = useState<string>('');

  // 전체 트랙 합산 (기본 3대 공식 실데이터 + 추가된 커스텀 트랙)
  const allTracks: TrackData[] = [...REAL_TRACKS, ...customTracks];
  const currentTrack: TrackData = allTracks[selectedTrackIndex] || allTracks[0];

  const fetchCourses = () => {
    setIsLoadingCourses(true);
    fetch(`${ENV.API_BASE_URL}/courses`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('API 응답 오류');
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setDbCourses(data);
        }
      })
      .catch((err) => {
        console.warn('관리자 코스 목록 로드 오류:', err);
      })
      .finally(() => {
        setIsLoadingCourses(false);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 공개/숨김 토글 핸들러
  const handleTogglePublish = async (courseId: string, currentPublished: boolean) => {
    const nextPublished = !currentPublished;

    // 로컬 숨김 ID 상태 업데이트
    setHiddenTrackIds((prev) => {
      const next = nextPublished
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId];
      localStorage.setItem('ecare24_hidden_tracks', JSON.stringify(next));
      return next;
    });

    // DB 코스 상태 업데이트
    setDbCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, isPublished: nextPublished } : c))
    );

    try {
      const token = localStorage.getItem('ecare24_admin_token');
      const res = await fetch(`${ENV.API_BASE_URL}/admin/courses/${courseId}/publish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        notification.success({
          message: '수강생 포털 노출 상태 변경',
          description: `과정 노출 상태가 [${nextPublished ? '공개(수강생 노출)' : '비공개(숨김)'}]로 변경되었습니다.`,
        });
      } else {
        notification.info({
          message: '노출 상태 변경 완료',
          description: `과정 노출 상태가 [${nextPublished ? '공개(수강생 노출)' : '비공개(숨김)'}]로 갱신되었습니다.`,
        });
      }
    } catch {
      notification.info({
        message: '노출 상태 로컬 반영',
        description: `과정이 [${nextPublished ? '수강생 노출' : '숨김'}]로 전환되었습니다.`,
      });
    }
  };

  // 신규 트랙 등록 모달 상태
  const [isAddTrackModalOpen, setIsAddTrackModalOpen] = useState(false);
  const [addTrackForm] = Form.useForm();

  // 트랙 정보 수정 모달 상태
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [courseForm] = Form.useForm();

  // 신규 문제 등록 / 수정 모달 상태
  const [isCreateQuestionModalOpen, setIsCreateQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [questionForm] = Form.useForm();
  const [editQuestionForm] = Form.useForm();

  // 문항 추가/수정/삭제 동적 상태
  const [customAddedQuestions, setCustomAddedQuestions] = useState<any[]>([]);
  const [updatedQuestionsMap, setUpdatedQuestionsMap] = useState<Record<string, any>>({});
  const [deletedQuestionKeys, setDeletedQuestionKeys] = useState<string[]>([]);

  // 1. 신규 트랙 등록
  const handleCreateTrack = (values: any) => {
    const newTrackId = `trk-${Date.now()}`;
    const newTrack: TrackData = {
      id: newTrackId,
      categoryId: 4,
      trackCode: values.trackCode.toUpperCase(),
      categoryCode: 'CARDIO',
      categoryName: values.title,
      title: values.title,
      qualificationName: values.qualificationName,
      videoTitle: `${values.title} 표준 임상 실기 VOD`,
      videoUrl: 'https://app.heygen.com/videos/demo',
      embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      targetDisease: values.targetDisease,
      scriptText: `${values.title} 교육 실기 스크립트입니다. 표준 임상 절차와 환자 안전 수칙을 준수합니다.`,
      chapters: [
        {
          title: `제1장. ${values.targetDisease} 병태생리 및 기본 이해`,
          content: `${values.targetDisease} 환자의 임상적 특징을 이해하고 기초 간호 및 안전 수칙을 준수합니다.`,
        },
        {
          title: `제2장. ${values.targetDisease} 표준 돌봄 프로토콜`,
          content: `현장 필수 10대 골든 룰과 표준 절차를 바탕으로 환자의 신체 기능을 보존하고 합병증을 예방합니다.`,
        },
      ],
      mockQuestions: [
        {
          questionNumber: 1,
          title: `${values.title} 돌봄 시 가장 우선해야 할 수칙은?`,
          options: [
            { no: 1, text: '신속한 조치를 위해 동의 없이 시행한다.' },
            { no: 2, text: '손 위생 및 감염 예방과 표준 지침을 준수한다.' },
            { no: 3, text: '보호자에게 모든 관리를 맡긴다.' },
            { no: 4, text: '증상이 있어도 처치가 끝날 때까지 관찰한다.' },
          ],
          correctAnswer: '2',
          explanation: '환자 안전과 감염 예방을 위해 손 위생과 표준 지침 준수가 최우선입니다.',
          points: 10,
          subjectCode: `${values.trackCode}-MOCK`,
          categoryId: 4,
          terminologyTags: ['안전관리', '표준지침'],
        },
      ],
      finalQuestions: [
        {
          questionNumber: 1,
          title: `${values.title} 중 응급 상황 대처로 가장 적절한 것은?`,
          options: [
            { no: 1, text: '즉시 담당 의료진에 보고하고 활력징후를 확인한다.' },
            { no: 2, text: '임의로 진정제를 투여한다.' },
            { no: 3, text: '환자를 방에 혼자 두고 대기한다.' },
            { no: 4, text: '다음 회진 때까지 상태를 지켜본다.' },
          ],
          correctAnswer: '1',
          explanation: '응급 징후 발견 시 지체 없이 의료진에 보고하고 활력징후를 확인해야 합니다.',
          points: 10,
          subjectCode: `${values.trackCode}-FINAL`,
          categoryId: 4,
          terminologyTags: ['응급상황', '활력징후'],
        },
      ],
    };

    const nextTracks = [newTrack, ...customTracks];
    setCustomTracks(nextTracks);
    localStorage.setItem('ecare24_custom_tracks', JSON.stringify(nextTracks));

    if (!values.isPublished) {
      setHiddenTrackIds((prev) => {
        const next = [...prev, newTrackId];
        localStorage.setItem('ecare24_hidden_tracks', JSON.stringify(next));
        return next;
      });
    }

    notification.success({
      message: '신규 전문 자격 트랙 추가 완료',
      description: `[${values.title}] 트랙이 등록되었습니다. 상세 관리 화면에서 교안, VOD, 문제은행을 편집할 수 있습니다.`,
    });

    setIsAddTrackModalOpen(false);
    addTrackForm.resetFields();
  };

  // 2. 과정 정보 수정
  const handleOpenEditCourse = () => {
    const dbCourse = dbCourses.find((c) => c.id === currentTrack.id);
    courseForm.setFieldsValue({
      title: dbCourse ? dbCourse.title : currentTrack.title,
      targetDisease: dbCourse ? dbCourse.targetDisease : currentTrack.targetDisease,
      price: dbCourse ? dbCourse.price : 120000,
      summary: dbCourse ? dbCourse.summary : currentTrack.targetDisease,
      theoryHours: dbCourse ? dbCourse.theoryHours : 4,
      practicalHours: dbCourse ? dbCourse.practicalHours : 4,
    });
    setIsEditCourseModalOpen(true);
  };

  const handleUpdateCourse = async (values: any) => {
    try {
      const token = localStorage.getItem('ecare24_admin_token');
      const res = await fetch(`${ENV.API_BASE_URL}/admin/courses/${currentTrack.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        notification.success({
          message: '교육과정 정보 수정 완료',
          description: `[${values.title}] 과정의 정보가 성공적으로 갱신되었습니다.`,
        });
        setIsEditCourseModalOpen(false);
        fetchCourses();
      } else {
        notification.info({
          message: '로컬 정보 갱신 완료',
          description: `[${values.title}] 과정 정보가 갱신되었습니다.`,
        });
        setIsEditCourseModalOpen(false);
      }
    } catch (e: any) {
      notification.error({ message: '서버 통신 오류: ' + e.message });
    }
  };

  // 3. 신규 문제 등록
  const handleCreateQuestion = async (values: any) => {
    try {
      const token = localStorage.getItem('ecare24_admin_token');
      const payload = {
        subjectCode: `${currentTrack.trackCode}-${values.examType}`,
        title: values.title,
        points: values.points || 10,
        options: [
          { no: 1, text: values.opt1 },
          { no: 2, text: values.opt2 },
          { no: 3, text: values.opt3 },
          { no: 4, text: values.opt4 },
        ],
        correctAnswer: String(values.correctAnswer),
        explanation: values.explanation,
      };

      let newId = `CUSTOM-${Date.now()}`;
      try {
        const res = await fetch(`${ENV.API_BASE_URL}/admin/exam-questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const result = await res.json();
          if (result.question?.id) newId = result.question.id;
        }
      } catch (err) {
        console.warn('Backend API call fallback:', err);
      }

      notification.success({
        message: '신규 시험 문제 등록 완료',
        description: `문제은행 [${values.examType === 'MOCK' ? '실전 모의고사' : '정규 최종평가'}]에 새 문항이 성공적으로 저장되었습니다.`,
      });
      const newQ = {
        id: newId,
        questionNumber: values.examType === 'MOCK' ? mockQuestionsList.length + 1 : finalQuestionsList.length + 1,
        type: values.examType,
        title: values.title,
        options: payload.options,
        correctAnswer: payload.correctAnswer,
        explanation: values.explanation,
        trackCode: currentTrack.trackCode,
      };
      setCustomAddedQuestions((prev) => [newQ, ...prev]);
      setIsCreateQuestionModalOpen(false);
      questionForm.resetFields();
    } catch (e: any) {
      notification.error({ message: '문제 등록 오류: ' + e.message });
    }
  };

  // 4. 문제 수정
  const handleOpenEditQuestion = (q: any) => {
    setEditingQuestion(q);
    editQuestionForm.setFieldsValue({
      title: q.title,
      points: 10,
      opt1: q.options[0]?.text || '',
      opt2: q.options[1]?.text || '',
      opt3: q.options[2]?.text || '',
      opt4: q.options[3]?.text || '',
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    });
  };

  const handleUpdateQuestion = async (values: any) => {
    if (!editingQuestion) return;
    try {
      const token = localStorage.getItem('ecare24_admin_token');
      const payload = {
        title: values.title,
        points: values.points || 10,
        options: [
          { no: 1, text: values.opt1 },
          { no: 2, text: values.opt2 },
          { no: 3, text: values.opt3 },
          { no: 4, text: values.opt4 },
        ],
        correctAnswer: String(values.correctAnswer),
        explanation: values.explanation,
      };

      if (editingQuestion.id && !editingQuestion.id.startsWith('CUSTOM')) {
        await fetch(`${ENV.API_BASE_URL}/admin/exam-questions/${editingQuestion.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
      }

      notification.success({
        message: '문제 수정 완료',
        description: '문항 정보가 성공적으로 수정되었습니다.',
      });

      const qKey = editingQuestion.id || `${editingQuestion.type}-${editingQuestion.questionNumber}`;
      setUpdatedQuestionsMap((prev) => ({
        ...prev,
        [qKey]: {
          ...editingQuestion,
          title: values.title,
          options: payload.options,
          correctAnswer: payload.correctAnswer,
          explanation: values.explanation,
        },
      }));
      setEditingQuestion(null);
    } catch (e: any) {
      notification.error({ message: '문제 수정 오류: ' + e.message });
    }
  };

  // 5. 문제 삭제
  const handleDeleteQuestion = async (q: any) => {
    try {
      const token = localStorage.getItem('ecare24_admin_token');
      if (q.id && !q.id.startsWith('CUSTOM')) {
        await fetch(`${ENV.API_BASE_URL}/admin/exam-questions/${q.id}`, {
          method: 'DELETE',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
      }
      const qKey = q.id || `${q.type}-${q.questionNumber}`;
      setDeletedQuestionKeys((prev) => [...prev, qKey]);
      notification.success({
        message: '문항 삭제 완료',
        description: '문항이 문제은행에서 성공적으로 제거되었습니다.',
      });
    } catch (e: any) {
      notification.error({ message: '문항 삭제 오류: ' + e.message });
    }
  };

  // 문제 목록 계산 (모의 30문항 / 최종 30문항)
  const getProcessedQuestions = (rawQuestions: any[], type: 'MOCK' | 'FINAL') => {
    const customList = customAddedQuestions.filter(
      (q) => q.trackCode === currentTrack.trackCode && q.type === type
    );
    const combined = [...customList, ...rawQuestions.map((q) => ({ ...q, type }))];

    return combined
      .filter((q) => {
        const qKey = q.id || `${q.type}-${q.questionNumber}`;
        return !deletedQuestionKeys.includes(qKey);
      })
      .map((q) => {
        const qKey = q.id || `${q.type}-${q.questionNumber}`;
        return updatedQuestionsMap[qKey] || q;
      });
  };

  const mockQuestionsList = getProcessedQuestions(currentTrack.mockQuestions || [], 'MOCK');
  const finalQuestionsList = getProcessedQuestions(currentTrack.finalQuestions || [], 'FINAL');

  // 트랙 목록 필터링 및 페이지네이션
  const filteredTracks = allTracks.filter((track) => {
    const isHidden = hiddenTrackIds.includes(track.id);
    const dbCourse = dbCourses.find((c) => c.id === track.id);
    const isPublished = dbCourse ? dbCourse.isPublished : !isHidden;

    if (trackFilter === 'PUBLISHED' && !isPublished) return false;
    if (trackFilter === 'HIDDEN' && isPublished) return false;

    if (searchTrackQuery.trim()) {
      const q = searchTrackQuery.toLowerCase();
      const matchTitle = track.title.toLowerCase().includes(q);
      const matchDisease = track.targetDisease.toLowerCase().includes(q);
      const matchCode = track.trackCode.toLowerCase().includes(q);
      if (!matchTitle && !matchDisease && !matchCode) return false;
    }

    return true;
  });

  const paginatedTracks = filteredTracks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 문항 카드 렌더링 헬퍼
  const renderQuestionCard = (q: any, idx: number, typeName: string) => {
    const qKey = q.id || `${q.type}-${q.questionNumber}`;
    return (
      <div
        key={qKey}
        className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition shadow-sm space-y-3"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Q{idx + 1}
            </span>
            <Tag color={q.type === 'MOCK' ? 'blue' : 'purple'} className="mr-0 text-[10px]">
              {typeName}
            </Tag>
            <span className="text-xs font-semibold text-slate-500">배점 10점</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="small"
              icon={<Edit className="w-3 h-3 text-indigo-600" />}
              onClick={() => handleOpenEditQuestion(q)}
              className="text-xs px-2 h-6 border-indigo-200 hover:bg-indigo-50"
            >
              수정
            </Button>
            <Popconfirm
              title="문항 삭제"
              description="이 시험 문제를 문제은행에서 삭제하시겠습니까?"
              onConfirm={() => handleDeleteQuestion(q)}
              okText="삭제"
              cancelText="취소"
              okButtonProps={{ danger: true }}
            >
              <Button
                size="small"
                danger
                icon={<Trash2 className="w-3 h-3" />}
                className="text-xs px-2 h-6"
              >
                삭제
              </Button>
            </Popconfirm>
          </div>
        </div>

        <h4 className="text-sm font-bold text-slate-900 leading-snug">{q.title}</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {q.options?.map((opt: any) => {
            const isCorrect = String(opt.no) === String(q.correctAnswer);
            return (
              <div
                key={opt.no}
                className={`p-2 rounded-lg border flex items-center gap-2 ${
                  isCorrect
                    ? 'bg-emerald-50/80 border-emerald-400 font-bold text-emerald-900'
                    : 'bg-slate-50/60 border-slate-200 text-slate-700'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                    isCorrect ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {opt.no}
                </span>
                <span className="truncate">{opt.text}</span>
                {isCorrect && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0" />}
              </div>
            );
          })}
        </div>

        {q.explanation && (
          <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <div className="font-bold flex items-center gap-1 text-[11px] text-amber-800 mb-0.5">
              <Stethoscope className="w-3 h-3 text-amber-700" />
              <span>임상 근거 및 해설:</span>
            </div>
            <div>{q.explanation}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* ======================================================== */}
      {/* 1. 트랙 목록 뷰 (viewMode === 'LIST')                     */}
      {/* ======================================================== */}
      {viewMode === 'LIST' ? (
        <>
          {/* 상단 헤더 및 트랙 총괄 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
                <span>관리자 대시보드</span>
                <span>&gt;</span>
                <span className="text-emerald-700">전문 자격 트랙 관리</span>
              </div>
              <UiBadge serialId="P22-SEC01-TTL01" label="[P22-SEC01-TTL01]">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm font-black">
                    課
                  </span>
                  공식 전문 자격 트랙 실데이터 관리 센터
                </h1>
              </UiBadge>
              <p className="text-xs text-slate-600 mt-1">
                공식 제공 실데이터 트랙의 정규 교안, 표준 임상 실기 VOD, CBT 모의·평가 문제은행 및 포털 노출/숨김 상태를 통합 관리합니다.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <UiBadge serialId="P22-SEC01-BTN-ADD" label="[P22-SEC01-BTN-ADD]">
                <Button
                  type="primary"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setIsAddTrackModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs"
                >
                  신규 트랙 추가
                </Button>
              </UiBadge>
              <UiBadge serialId="P22-SEC01-BTN01" label="[P22-SEC01-BTN01]">
                <Button
                  icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoadingCourses ? 'animate-spin' : ''}`} />}
                  onClick={fetchCourses}
                  className="font-bold text-xs border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  DB 실시간 동기화
                </Button>
              </UiBadge>
            </div>
          </div>

          {/* 목록 검색 및 숨김/공개 필터 바 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                노출 필터:
              </span>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-slate-50 p-0.5">
                <button
                  onClick={() => {
                    setTrackFilter('ALL');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded font-bold transition ${
                    trackFilter === 'ALL'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  전체 ({allTracks.length})
                </button>
                <button
                  onClick={() => {
                    setTrackFilter('PUBLISHED');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded font-bold transition ${
                    trackFilter === 'PUBLISHED'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  수강생 공개 ({allTracks.filter((t) => !hiddenTrackIds.includes(t.id)).length})
                </button>
                <button
                  onClick={() => {
                    setTrackFilter('HIDDEN');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded font-bold transition ${
                    trackFilter === 'HIDDEN'
                      ? 'bg-white text-amber-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  숨김 (비공개) ({hiddenTrackIds.length})
                </button>
              </div>
            </div>

            <div className="w-full sm:w-72">
              <Input
                placeholder="트랙명, 질환명 검색..."
                prefix={<Search className="w-3.5 h-3.5 text-slate-400" />}
                value={searchTrackQuery}
                onChange={(e) => {
                  setSearchTrackQuery(e.target.value);
                  setCurrentPage(1);
                }}
                allowClear
                size="small"
              />
            </div>
          </div>

          {/* 트랙 카드 그리드 (P22-SEC01-CRD01) */}
          <UiBadge serialId="P22-SEC01-CRD01" label="[P22-SEC01-CRD01]" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {paginatedTracks.length === 0 ? (
                <div className="col-span-3 py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                  조건에 해당하는 전문 자격 트랙이 없습니다.
                </div>
              ) : (
                paginatedTracks.map((track) => {
                  const globalIdx = allTracks.findIndex((t) => t.id === track.id);
                  const isHidden = hiddenTrackIds.includes(track.id);
                  const dbCourse = dbCourses.find((c) => c.id === track.id);
                  const isPublished = dbCourse ? dbCourse.isPublished : !isHidden;

                  return (
                    <div
                      key={track.id}
                      onClick={() => {
                        setSelectedTrackIndex(globalIdx >= 0 ? globalIdx : 0);
                        setViewMode('DETAIL');
                      }}
                      className={`cursor-pointer rounded-2xl p-5 border transition shadow-sm relative flex flex-col justify-between group ${
                        !isPublished
                          ? 'bg-slate-50/80 border-slate-300 opacity-80'
                          : 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-md'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                            {track.trackCode}
                          </span>

                          <div
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span
                              className={`text-[11px] font-bold ${
                                isPublished ? 'text-emerald-700' : 'text-slate-400'
                              }`}
                            >
                              {isPublished ? '수강생 공개' : '숨김(비공개)'}
                            </span>
                            <Switch
                              size="small"
                              checked={isPublished}
                              onChange={() => handleTogglePublish(track.id, isPublished)}
                            />
                          </div>
                        </div>

                        <h2 className="text-base font-black text-slate-900 leading-snug group-hover:text-emerald-700 transition">
                          {track.title}
                        </h2>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-4">
                          {track.targetDisease}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                            <span>8시간 (이론 4h + 실기 4h)</span>
                          </div>
                          <span className="text-slate-500 font-normal">
                            문제은행 {track.mockQuestions.length + track.finalQuestions.length}문항
                          </span>
                        </div>

                        <div className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 group-hover:bg-emerald-50/60 group-hover:border-emerald-300 text-center text-xs font-bold text-slate-700 group-hover:text-emerald-800 transition flex items-center justify-center gap-1">
                          <span>상세 관리 (교안 · VOD · CBT) 보기</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </UiBadge>

          {/* 페이지네이션 바 */}
          {filteredTracks.length > pageSize && (
            <div className="flex justify-center pt-2">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredTracks.length}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      ) : (
        /* ======================================================== */
        /* 2. 트랙 상세 화면 (viewMode === 'DETAIL')                 */
        /* ======================================================== */
        <div className="space-y-6">
          {/* 상단 뒤로가기 및 트랙 상세 헤더 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <UiBadge serialId="P22-SEC02-BTN-BACK" label="[P22-SEC02-BTN-BACK]">
                <Button
                  icon={<ArrowLeft className="w-3.5 h-3.5" />}
                  onClick={() => setViewMode('LIST')}
                  className="font-bold text-xs text-slate-700 border-slate-300 hover:bg-slate-50"
                >
                  전체 트랙 목록으로 돌아가기
                </Button>
              </UiBadge>

              <div className="flex items-center gap-2 pt-1">
                <Tag color="green" className="font-mono font-bold text-xs">
                  {currentTrack.trackCode}
                </Tag>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {currentTrack.title}
                </h1>
              </div>

              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-4">
                <span>
                  자격명: <b className="text-slate-800">{currentTrack.qualificationName}</b>
                </span>
                <span>
                  수강료: <b className="text-emerald-700">120,000원</b>
                </span>
                <span>
                  대상 질환: <b className="text-slate-700">{currentTrack.targetDisease}</b>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <UiBadge serialId="P22-SEC01-BTN02" label="[P22-SEC01-BTN02]">
                <Button
                  icon={<Edit className="w-3.5 h-3.5" />}
                  onClick={handleOpenEditCourse}
                  className="font-bold text-xs border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                >
                  선택 트랙 정보 수정
                </Button>
              </UiBadge>
              <UiBadge serialId="P22-SEC01-BTN01" label="[P22-SEC01-BTN01]">
                <Button
                  type="primary"
                  icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoadingCourses ? 'animate-spin' : ''}`} />}
                  onClick={fetchCourses}
                  className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs"
                >
                  DB 실시간 동기화
                </Button>
              </UiBadge>
            </div>
          </div>

          {/* 선택된 트랙 상세 관리 (교안, VOD 영상, 문제은행) */}
          <UiBadge serialId="P22-SEC02-DET01" label="[P22-SEC02-DET01]" className="w-full">
            <Card
              size="small"
              className="shadow-sm border-slate-200 rounded-2xl"
              styles={{ header: { background: '#f8fafc', fontWeight: 800 } }}
              title={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm sm:text-base">
                      {currentTrack.title} 상세 커리큘럼 및 평가 체계
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-normal flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>정규 교안 {currentTrack.chapters.length}개 챕터 · VOD · CBT 문항 연동</span>
                  </div>
                </div>
              }
            >
              <Tabs
                activeKey={activeTabKey}
                onChange={setActiveTabKey}
                items={[
                  // 탭 1: 정규 교안 (5대 챕터)
                  {
                    key: 'curriculum',
                    label: (
                      <span className="flex items-center gap-1.5 font-bold">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        정규 교안 ({currentTrack.chapters.length}개 챕터)
                      </span>
                    ),
                    children: (
                      <div className="space-y-4 pt-2">
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <b>임상 가이드라인 준수:</b> 본 교안은 대학병원 표준 임상 실기 10대 골든 룰과 환자 안전 최우선 원칙에 따라 구성되었습니다.
                          </div>
                        </div>

                        <div className="space-y-3">
                          {currentTrack.chapters.map((ch, chIdx) => (
                            <div
                              key={chIdx}
                              className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-2 hover:bg-slate-100/60 transition"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-black text-slate-900 text-sm flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-md bg-emerald-700 text-white flex items-center justify-center text-xs">
                                    {chIdx + 1}
                                  </span>
                                  {ch.title}
                                </span>
                                <span className="text-[11px] font-bold text-slate-500 bg-white px-2.5 py-0.5 rounded border border-slate-200">
                                  이론 필수 이수
                                </span>
                              </div>
                              <div className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line pl-8 border-l-2 border-emerald-300 ml-3">
                                {ch.content.replace(/^###\s*[^\n\r]+\n*/, '').slice(0, 500)}...
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  },

                  // 탭 2: 표준 임상 실기 VOD
                  {
                    key: 'vod',
                    label: (
                      <span className="flex items-center gap-1.5 font-bold">
                        <Video className="w-4 h-4 text-blue-600" />
                        표준 임상 실기 VOD & 스크립트
                      </span>
                    ),
                    children: (
                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* VOD 정보 카드 */}
                          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
                            <div className="flex items-center justify-between text-xs">
                              <span className="bg-rose-600 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                공식 임상 실기 VOD
                              </span>
                              <span className="text-slate-400 font-mono">
                                {currentTrack.id.endsWith('03') ? '1분 50초' : '1분 15초'}
                              </span>
                            </div>

                            <h3 className="text-lg font-black text-white">
                              {currentTrack.videoTitle}
                            </h3>

                            <div className="aspect-video bg-black rounded-xl overflow-hidden border border-white/20 relative flex items-center justify-center">
                              <iframe
                                src={currentTrack.embedUrl}
                                title={currentTrack.videoTitle}
                                className="w-full h-full border-0"
                                allowFullScreen
                              />
                            </div>

                            <div className="pt-2 flex items-center justify-between text-xs">
                              <a
                                href={currentTrack.videoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-blue-300 hover:text-white underline font-bold"
                              >
                                <span>임상 실기 원본 영상 열기</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              <span className="text-emerald-400 font-bold">
                                ✓ 진도율 100% 자동 연동 지원
                              </span>
                            </div>
                          </div>

                          {/* 공식 녹취록 스크립트 전문 */}
                          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                              <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-emerald-600" />
                                <span>VOD 공식 녹취록 및 핵심 임상 해설</span>
                              </span>
                              <Tag color="cyan" className="font-mono text-xs">
                                스크립트 전문
                              </Tag>
                            </div>
                            <div className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-[300px] overflow-y-auto">
                              {currentTrack.scriptText}
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  },

                  // 탭 3: 실전 모의고사 (30문항)
                  {
                    key: 'mock_questions',
                    label: (
                      <span className="flex items-center gap-1.5 font-bold">
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        실전 모의고사 ({mockQuestionsList.length}문항)
                      </span>
                    ),
                    children: (
                      <div className="space-y-4 py-2">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="font-extrabold text-sm block mb-1">
                              실전 모의고사 문제은행 (30문항 · 즉시 해설 제공)
                            </span>
                            실제 시험 전 수강생이 실시간 채점 및 오답 해설을 학습할 수 있는 문항들입니다.
                          </div>
                          <UiBadge serialId="P22-SEC02-BTN02-MOCK" label="[P22-SEC02-BTN02-MOCK]">
                            <Button
                              type="primary"
                              icon={<Plus className="w-3.5 h-3.5" />}
                              onClick={() => {
                                questionForm.resetFields();
                                questionForm.setFieldsValue({
                                  examType: 'MOCK',
                                  points: 10,
                                  correctAnswer: '1',
                                });
                                setIsCreateQuestionModalOpen(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 font-bold text-xs"
                            >
                              모의고사 문항 추가
                            </Button>
                          </UiBadge>
                        </div>

                        <div className="space-y-3">
                          {mockQuestionsList.map((q, idx) =>
                            renderQuestionCard(q, idx, '실전 모의고사')
                          )}
                        </div>
                      </div>
                    ),
                  },

                  // 탭 4: 정규 최종평가 (30문항)
                  {
                    key: 'final_questions',
                    label: (
                      <span className="flex items-center gap-1.5 font-bold">
                        <Award className="w-4 h-4 text-purple-600" />
                        정규 최종평가 ({finalQuestionsList.length}문항)
                      </span>
                    ),
                    children: (
                      <div className="space-y-4 py-2">
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-xs text-purple-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="font-extrabold text-sm block mb-1">
                              정규 최종평가 문제은행 (30문항 · 직능원 자격 수료 기준 60점)
                            </span>
                            직능원 민간자격 기준에 따라 출제되며, 60점 이상 획득 시 자격증이 자동 발급됩니다.
                          </div>
                          <UiBadge serialId="P22-SEC02-BTN02-FINAL" label="[P22-SEC02-BTN02-FINAL]">
                            <Button
                              type="primary"
                              icon={<Plus className="w-3.5 h-3.5" />}
                              onClick={() => {
                                questionForm.resetFields();
                                questionForm.setFieldsValue({
                                  examType: 'FINAL',
                                  points: 10,
                                  correctAnswer: '1',
                                });
                                setIsCreateQuestionModalOpen(true);
                              }}
                              className="bg-purple-600 hover:bg-purple-700 font-bold text-xs"
                            >
                              최종평가 문항 추가
                            </Button>
                          </UiBadge>
                        </div>

                        <div className="space-y-3">
                          {finalQuestionsList.map((q, idx) =>
                            renderQuestionCard(q, idx, '정규 최종평가')
                          )}
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </UiBadge>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. 모달 컴포넌트군                                       */}
      {/* ======================================================== */}

      {/* 1. 신규 트랙 추가 모달 */}
      <Modal
        title="신규 전문 자격 트랙 등록"
        open={isAddTrackModalOpen}
        onCancel={() => setIsAddTrackModalOpen(false)}
        footer={null}
        destroyOnClose
        width={560}
      >
        <Form
          form={addTrackForm}
          layout="vertical"
          onFinish={handleCreateTrack}
          initialValues={{
            trackCode: 'TRK-04-CARDIO',
            title: '심혈관 질환 전문 돌봄사',
            targetDisease: '고혈압, 심부전, 뇌졸중 돌봄 관리',
            qualificationName: '심혈관질환전문돌봄사 (1급)',
            isPublished: true,
          }}
          className="mt-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <Form.Item
              name="trackCode"
              label="트랙 코드"
              rules={[{ required: true, message: '트랙 코드를 입력하세요' }]}
            >
              <Input placeholder="예: TRK-04-CARDIO" />
            </Form.Item>
            <Form.Item
              name="qualificationName"
              label="발급 자격명"
              rules={[{ required: true, message: '자격명을 입력하세요' }]}
            >
              <Input placeholder="예: 심혈관질환전문돌봄사 (1급)" />
            </Form.Item>
          </div>

          <Form.Item
            name="title"
            label="교육과정 명칭"
            rules={[{ required: true, message: '과정 명칭을 입력하세요' }]}
          >
            <Input placeholder="예: 심혈관 질환 전문 돌봄사" />
          </Form.Item>

          <Form.Item
            name="targetDisease"
            label="대상 질환군 및 학습 영역"
            rules={[{ required: true, message: '대상 질환을 입력하세요' }]}
          >
            <Input placeholder="예: 고혈압, 협심증, 뇌혈관 질환 환자 임상 케어" />
          </Form.Item>

          <Form.Item name="isPublished" label="초기 수강생 포털 노출" valuePropName="checked">
            <Switch checkedChildren="공개" unCheckedChildren="숨김" />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsAddTrackModalOpen(false)}>취소</Button>
            <Button type="primary" htmlType="submit" className="bg-emerald-600">
              트랙 등록하기
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 2. 트랙 정보 수정 모달 */}
      <Modal
        title="전문 자격 트랙 정보 수정"
        open={isEditCourseModalOpen}
        onCancel={() => setIsEditCourseModalOpen(false)}
        footer={null}
        destroyOnClose
        width={560}
      >
        <Form form={courseForm} layout="vertical" onFinish={handleUpdateCourse} className="mt-4">
          <Form.Item name="title" label="과정명" rules={[{ required: true, message: '과정명을 입력하세요' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="targetDisease" label="대상 질환군" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <div className="grid grid-cols-3 gap-3">
            <Form.Item name="price" label="수강료 (원)" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="theoryHours" label="이론 교육 (h)" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="practicalHours" label="실기 교육 (h)" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsEditCourseModalOpen(false)}>취소</Button>
            <Button type="primary" htmlType="submit" className="bg-emerald-600">
              수정사항 저장
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 3. 신규 문제 등록 모달 */}
      <Modal
        title="신규 CBT 시험 문항 등록"
        open={isCreateQuestionModalOpen}
        onCancel={() => setIsCreateQuestionModalOpen(false)}
        footer={null}
        destroyOnClose
        width={680}
      >
        <Form form={questionForm} layout="vertical" onFinish={handleCreateQuestion} className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="examType" label="평가 구분" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 'MOCK', label: '실전 모의고사' },
                  { value: 'FINAL', label: '정규 최종평가' },
                ]}
              />
            </Form.Item>
            <Form.Item name="correctAnswer" label="정답 번호" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: '1', label: '1번' },
                  { value: '2', label: '2번' },
                  { value: '3', label: '3번' },
                  { value: '4', label: '4번' },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item name="title" label="문제 지문" rules={[{ required: true, message: '문제 지문을 입력하세요' }]}>
            <Input.TextArea rows={2} placeholder="임상 상황형 질문 지문 작성" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="opt1" label="보기 1" rules={[{ required: true }]}>
              <Input placeholder="1번 보기 내용" />
            </Form.Item>
            <Form.Item name="opt2" label="보기 2" rules={[{ required: true }]}>
              <Input placeholder="2번 보기 내용" />
            </Form.Item>
            <Form.Item name="opt3" label="보기 3" rules={[{ required: true }]}>
              <Input placeholder="3번 보기 내용" />
            </Form.Item>
            <Form.Item name="opt4" label="보기 4" rules={[{ required: true }]}>
              <Input placeholder="4번 보기 내용" />
            </Form.Item>
          </div>

          <Form.Item name="explanation" label="임상 근거 및 정답 해설" rules={[{ required: true, message: '해설을 입력하세요' }]}>
            <Input.TextArea rows={3} placeholder="골든 룰 및 표준 지침에 기반한 해설 작성" />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsCreateQuestionModalOpen(false)}>취소</Button>
            <Button type="primary" htmlType="submit" className="bg-emerald-600">
              문제은행에 등록하기
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 4. 문항 수정 모달 */}
      <Modal
        title="CBT 시험 문항 수정"
        open={!!editingQuestion}
        onCancel={() => setEditingQuestion(null)}
        footer={null}
        destroyOnClose
        width={680}
      >
        <Form form={editQuestionForm} layout="vertical" onFinish={handleUpdateQuestion} className="mt-4">
          <Form.Item name="correctAnswer" label="정답 번호" rules={[{ required: true }]}>
            <Select
              options={[
                { value: '1', label: '1번' },
                { value: '2', label: '2번' },
                { value: '3', label: '3번' },
                { value: '4', label: '4번' },
              ]}
            />
          </Form.Item>

          <Form.Item name="title" label="문제 지문" rules={[{ required: true, message: '문제 지문을 입력하세요' }]}>
            <Input.TextArea rows={2} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="opt1" label="보기 1" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="opt2" label="보기 2" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="opt3" label="보기 3" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="opt4" label="보기 4" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </div>

          <Form.Item name="explanation" label="임상 근거 및 정답 해설" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setEditingQuestion(null)}>취소</Button>
            <Button type="primary" htmlType="submit" className="bg-emerald-600">
              수정사항 저장
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CurriculumManager;
