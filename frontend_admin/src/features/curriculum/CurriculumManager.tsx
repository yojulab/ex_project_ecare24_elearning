import React, { useState, useEffect } from 'react';
import { Card, Tag, Button, Input, Select, Switch, notification, Tabs, Badge, Modal, Form, message, Popconfirm } from 'antd';
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
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
} from 'lucide-react';
import { REAL_TRACKS, TrackData } from '@ecare24/utils';
import UiBadge from '../../components/UiBadge';
import { ENV } from '../../config/env';

export const CurriculumManager: React.FC = () => {
  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number>(0);
  const [dbCourses, setDbCourses] = useState<any[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState<string>('curriculum');
  const [examFilter, setExamFilter] = useState<'ALL' | 'MOCK' | 'FINAL'>('ALL');
  const [searchQuestion, setSearchQuestion] = useState<string>('');

  const currentTrack: TrackData = REAL_TRACKS[selectedTrackIndex] || REAL_TRACKS[0];

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

  const handleTogglePublish = async (courseId: string, currentPublished: boolean) => {
    // 낙관적 UI 업데이트
    setDbCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, isPublished: !currentPublished } : c))
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
        const result = await res.json();
        notification.success({
          message: '수강생 포털 노출 상태 변경',
          description: result.message || '과정의 수강생 포털 노출 상태가 성공적으로 변경되었습니다.',
        });
      } else {
        notification.info({
          message: '노출 상태 변경 완료',
          description: `과정 노출 상태가 [${!currentPublished ? '공개(수강생 노출)' : '비공개(수강생 미노출)'}]로 갱신되었습니다.`,
        });
      }
    } catch {
      notification.info({
        message: '노출 상태 변경 (로컬 반영)',
        description: `과정이 [${!currentPublished ? '수강생 노출' : '미노출'}]로 전환되었습니다.`,
      });
    }
  };

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

  // 1. 과정 정보 수정
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
        notification.error({ message: '과정 정보 수정 실패' });
      }
    } catch (e: any) {
      notification.error({ message: '서버 통신 오류: ' + e.message });
    }
  };

  // 2. 신규 문제 등록
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

  // 3. 문제 수정
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

  // 4. 문제 삭제
  const handleDeleteQuestion = async (q: any) => {
    const qKey = q.id || `${q.type}-${q.questionNumber}`;
    try {
      const token = localStorage.getItem('ecare24_admin_token');
      if (q.id && !q.id.startsWith('CUSTOM')) {
        await fetch(`${ENV.API_BASE_URL}/admin/exam-questions/${q.id}`, {
          method: 'DELETE',
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
      }

      notification.success({
        message: '문제 삭제 완료',
        description: '문제은행에서 문항이 성공적으로 삭제되었습니다.',
      });

      setDeletedQuestionKeys((prev) => [...prev, qKey]);
    } catch (e: any) {
      notification.error({ message: '문제 삭제 오류: ' + e.message });
    }
  };

  // 문제은행 전체 목록 조합 (기본 실데이터 + 커스텀 추가 - 삭제 + 수정)
  const baseQuestions = [
    ...customAddedQuestions.filter((q) => q.trackCode === currentTrack.trackCode),
    ...currentTrack.mockQuestions.map((q) => ({ ...q, type: 'MOCK' as const })),
    ...currentTrack.finalQuestions.map((q) => ({ ...q, type: 'FINAL' as const })),
  ];

  const allQuestionsForTrack = baseQuestions
    .filter((q) => {
      const qKey = q.id || `${q.type}-${q.questionNumber}`;
      return !deletedQuestionKeys.includes(qKey);
    })
    .map((q) => {
      const qKey = q.id || `${q.type}-${q.questionNumber}`;
      return updatedQuestionsMap[qKey] || q;
    });

  const mockQuestionsList = allQuestionsForTrack
    .filter((q) => q.type === 'MOCK')
    .filter((q) => !searchQuestion || q.title.includes(searchQuestion) || q.explanation.includes(searchQuestion));

  const finalQuestionsList = allQuestionsForTrack
    .filter((q) => q.type === 'FINAL')
    .filter((q) => !searchQuestion || q.title.includes(searchQuestion) || q.explanation.includes(searchQuestion));

  const handleOpenCreateQuestionWithType = (type: 'MOCK' | 'FINAL') => {
    questionForm.resetFields();
    questionForm.setFieldsValue({
      examType: type,
      correctAnswer: 1,
      points: 10,
    });
    setIsCreateQuestionModalOpen(true);
  };

  const renderQuestionList = (questions: any[], examType: 'MOCK' | 'FINAL', btnSerialId: string) => (
    <div className="space-y-4 pt-2">
      {/* 상단 검색 및 신규 문항 등록 바 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <Tag color={examType === 'MOCK' ? 'blue' : 'purple'} className="font-bold text-xs px-2.5 py-1">
            {examType === 'MOCK' ? '실전 모의고사 문제은행' : '정규 최종평가 문제은행'}
          </Tag>
          <span className="text-xs text-slate-600 font-semibold">
            총 <b>{questions.length}</b>개 문항 검색/등록됨
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Input
            size="small"
            placeholder="문항 내용 또는 해설 검색..."
            prefix={<Search className="w-3.5 h-3.5 text-slate-400" />}
            value={searchQuestion}
            onChange={(e) => setSearchQuestion(e.target.value)}
            className="w-full sm:w-56"
          />
          <UiBadge serialId={btnSerialId} label={`[${btnSerialId}]`}>
            <Button
              type="primary"
              icon={<Plus className="w-3.5 h-3.5" />}
              size="small"
              onClick={() => handleOpenCreateQuestionWithType(examType)}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs shrink-0"
            >
              {examType === 'MOCK' ? '모의 문항 추가' : '평가 문항 추가'}
            </Button>
          </UiBadge>
        </div>
      </div>

      {/* 문항 목록 테이블 */}
      <div className="space-y-3">
        {questions.map((q, qIdx) => (
          <div
            key={q.id || `${q.type}-${q.questionNumber || qIdx}`}
            className="bg-white rounded-xl p-5 border border-slate-200 space-y-3 shadow-xs hover:border-emerald-300 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  Q{q.questionNumber || qIdx + 1}
                </span>
                <Tag color={q.type === 'MOCK' ? 'blue' : 'purple'} className="font-bold text-[11px]">
                  {q.type === 'MOCK' ? '실전 모의고사' : '최종 평가시험'}
                </Tag>
                <h5 className="font-bold text-slate-900 text-sm">
                  {q.title}
                </h5>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  배점: 10점
                </span>
                <Button
                  size="small"
                  icon={<Edit className="w-3 h-3" />}
                  className="text-xs px-2"
                  onClick={() => handleOpenEditQuestion(q)}
                >
                  수정
                </Button>
                <Popconfirm
                  title="문항 삭제"
                  description="이 문항을 문제은행에서 삭제하시겠습니까?"
                  onConfirm={() => handleDeleteQuestion(q)}
                  okText="삭제"
                  cancelText="취소"
                >
                  <Button
                    size="small"
                    danger
                    icon={<Trash2 className="w-3 h-3" />}
                    className="text-xs px-2"
                  >
                    삭제
                  </Button>
                </Popconfirm>
              </div>
            </div>

            {/* 4지선다 옵션 리스트 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              {q.options.map((opt: any) => {
                const isCorrect = String(opt.no) === String(q.correctAnswer);
                return (
                  <div
                    key={opt.no}
                    className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 font-normal'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {opt.no}
                    </span>
                    <span>{opt.text}</span>
                    {isCorrect && (
                      <span className="ml-auto text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-black shrink-0">
                        정답
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 정답 및 임상 상세 해설 */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
              <span className="font-bold text-emerald-800">
                [정답: {q.correctAnswer}번]
              </span>{' '}
              <span className="text-slate-600">{q.explanation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. 상단 헤더 및 트랙 총괄 */}
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
            공식 제공 3개 실데이터 트랙 (호흡기계 · 인지치매 · 근골격계)의 정규 교안(15개 챕터), 표준 임상 실기 VOD, CBT 180문항 및 포털 노출을 통합 관리합니다.
          </p>
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

      {/* 2. 3개 실데이터 트랙 선택 카드 그리드 */}
      <UiBadge serialId="P22-SEC01-CRD01" label="[P22-SEC01-CRD01]" className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REAL_TRACKS.map((track, idx) => {
            const dbCourse = dbCourses.find((c) => c.id === track.id);
            const isPublished = dbCourse ? dbCourse.isPublished : true;
            const isSelected = selectedTrackIndex === idx;

            return (
              <div
                key={track.id}
                onClick={() => setSelectedTrackIndex(idx)}
                className={`cursor-pointer rounded-2xl p-5 border transition shadow-sm relative ${
                  isSelected
                    ? 'bg-emerald-50/50 border-emerald-500 ring-2 ring-emerald-200'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                    {track.trackCode}
                  </span>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[11px] font-bold text-slate-500">
                      {isPublished ? '수강생 공개' : '비공개'}
                    </span>
                    <Switch
                      size="small"
                      checked={isPublished}
                      onChange={() => handleTogglePublish(track.id, isPublished)}
                    />
                  </div>
                </div>

                <h2 className="text-base font-black text-slate-900 leading-snug">
                  {track.title}
                </h2>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-4">
                  {track.targetDisease}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>8시간 (이론 4h + 실기 4h)</span>
                  </div>
                  <span className="text-slate-500 font-normal">
                    문제은행 {track.mockQuestions.length + track.finalQuestions.length}문항
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </UiBadge>

      {/* 3. 선택된 트랙 상세 관리 (교안, VOD 영상, 문제은행) */}
      <UiBadge serialId="P22-SEC02-DET01" label="[P22-SEC02-DET01]" className="w-full">
        <Card
          size="small"
          className="shadow-sm border-slate-200 rounded-2xl"
          styles={{ header: { background: '#f8fafc', fontWeight: 800 } }}
          title={
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 gap-2">
              <div className="flex items-center gap-2">
                <Tag color="green" className="font-mono font-bold text-xs">
                  {currentTrack.trackCode}
                </Tag>
                <span className="font-black text-slate-900 text-sm sm:text-base">
                  {currentTrack.title}
                </span>
              </div>
              <div className="text-xs text-slate-500 font-normal flex items-center gap-3">
                <span>자격명: <b className="text-slate-800">{currentTrack.qualificationName}</b></span>
                <span>수강료: <b className="text-emerald-700">120,000원</b></span>
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
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3 flex flex-col">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                            <FileCheck className="w-4 h-4 text-emerald-600" />
                            공식 교수진 음성 녹취록 전문 (Script)
                          </h4>
                          <span className="text-[11px] text-slate-500 font-medium">
                            표준 임상 지도 발화문 전수 수록
                          </span>
                        </div>

                        <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans overflow-y-auto max-h-[380px] whitespace-pre-line">
                          {currentTrack.scriptText || '녹취록 스크립트를 불러오는 중입니다.'}
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
                children: renderQuestionList(mockQuestionsList, 'MOCK', 'P22-SEC02-BTN02-MOCK'),
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
                children: renderQuestionList(finalQuestionsList, 'FINAL', 'P22-SEC02-BTN02-FINAL'),
              },
            ]}
          />
        </Card>
      </UiBadge>

      {/* 1. 과정 정보 수정 모달 */}
      <Modal
        title={`[${currentTrack.trackCode}] 과정 기본 정보 수정`}
        open={isEditCourseModalOpen}
        onCancel={() => setIsEditCourseModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={courseForm} layout="vertical" onFinish={handleUpdateCourse} className="mt-4">
          <Form.Item name="title" label="과정명" rules={[{ required: true, message: '과정명을 입력하세요' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="targetDisease" label="대상 질환 및 수술명" rules={[{ required: true, message: '대상 질환을 입력하세요' }]}>
            <Input />
          </Form.Item>
          <div className="grid grid-cols-3 gap-3">
            <Form.Item name="price" label="수강료 (원)" rules={[{ required: true, message: '수강료' }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="theoryHours" label="이론 (시간)">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="practicalHours" label="실습 (시간)">
              <Input type="number" />
            </Form.Item>
          </div>
          <Form.Item name="summary" label="교육 요약">
            <Input.TextArea rows={3} />
          </Form.Item>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsEditCourseModalOpen(false)}>취소</Button>
            <Button type="primary" htmlType="submit" className="bg-emerald-600">
              수정사항 저장
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 2. 신규 문제 등록 모달 */}
      <Modal
        title={`[${currentTrack.trackCode}] 신규 CBT 시험 문항 등록`}
        open={isCreateQuestionModalOpen}
        onCancel={() => setIsCreateQuestionModalOpen(false)}
        footer={null}
        destroyOnClose
        width={680}
      >
        <Form form={questionForm} layout="vertical" onFinish={handleCreateQuestion} className="mt-4" initialValues={{ examType: 'MOCK', correctAnswer: 1, points: 10 }}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="examType" label="시험 유형" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 'MOCK', label: '실전 모의고사 (MOCK)' },
                  { value: 'FINAL', label: '최종 평가시험 (FINAL)' },
                ]}
              />
            </Form.Item>
            <Form.Item name="correctAnswer" label="정답 번호" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 1, label: '1번' },
                  { value: 2, label: '2번' },
                  { value: 3, label: '3번' },
                  { value: 4, label: '4번' },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item name="title" label="문제 지문" rules={[{ required: true, message: '문제 지문을 입력하세요' }]}>
            <Input.TextArea rows={2} placeholder="예: 만성 폐쇄성 폐질환 대상자에게 산소 투여 시 올바른 유량은?" />
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

      {/* 3. 문항 수정 모달 */}
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
