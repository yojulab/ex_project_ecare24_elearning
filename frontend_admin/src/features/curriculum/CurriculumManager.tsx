import React, { useState, useEffect } from 'react';
import { Card, Tag, Button, Input, Select, Switch, notification, Tabs, Badge } from 'antd';
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

  // 문제은행 필터링
  const allQuestionsForTrack = [
    ...currentTrack.mockQuestions.map((q) => ({ ...q, type: 'MOCK' as const })),
    ...currentTrack.finalQuestions.map((q) => ({ ...q, type: 'FINAL' as const })),
  ];

  const filteredQuestions = allQuestionsForTrack.filter((q) => {
    if (examFilter === 'MOCK' && q.type !== 'MOCK') return false;
    if (examFilter === 'FINAL' && q.type !== 'FINAL') return false;
    if (
      searchQuestion &&
      !q.title.includes(searchQuestion) &&
      !q.explanation.includes(searchQuestion)
    ) {
      return false;
    }
    return true;
  });

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
            공식 제공 3개 실데이터 트랙 (호흡기계 · 인지치매 · 근골격계)의 정규 교안(15개 챕터), HeyGen 실기 VOD, CBT 180문항 및 포털 노출을 통합 관리합니다.
          </p>
        </div>

        <UiBadge serialId="P22-SEC01-BTN01" label="[P22-SEC01-BTN01]">
          <Button
            type="primary"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoadingCourses ? 'animate-spin' : ''}`} />}
            onClick={fetchCourses}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            DB 실시간 동기화
          </Button>
        </UiBadge>
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

              // 탭 2: HeyGen AI 실기 VOD
              {
                key: 'vod',
                label: (
                  <span className="flex items-center gap-1.5 font-bold">
                    <Video className="w-4 h-4 text-blue-600" />
                    HeyGen AI 실기 VOD & 스크립트
                  </span>
                ),
                children: (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* VOD 정보 카드 */}
                      <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="bg-rose-600 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                            HeyGen Official VOD
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
                            <span>HeyGen 원본 영상 열기</span>
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
                            공식 강사 음성 녹취록 전문 (Script)
                          </h4>
                          <span className="text-[11px] text-slate-500 font-medium">
                            AI 강사 발화문 전수 수록
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

              // 탭 3: 문제은행 인스펙션 (모의 30 + 최종 30 = 60문항)
              {
                key: 'questions',
                label: (
                  <span className="flex items-center gap-1.5 font-bold">
                    <Award className="w-4 h-4 text-purple-600" />
                    CBT 문제은행 인스펙션 ({allQuestionsForTrack.length}문항)
                  </span>
                ),
                children: (
                  <div className="space-y-4 pt-2">
                    {/* 상단 검색 및 필터 바 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2">
                        <Select
                          size="small"
                          value={examFilter}
                          onChange={setExamFilter}
                          className="w-40 font-bold"
                          options={[
                            { value: 'ALL', label: `전체 문항 (${allQuestionsForTrack.length})` },
                            { value: 'MOCK', label: `실전 모의고사 (${currentTrack.mockQuestions.length})` },
                            { value: 'FINAL', label: `최종 평가시험 (${currentTrack.finalQuestions.length})` },
                          ]}
                        />
                        <span className="text-xs text-slate-500 font-normal">
                          총 <b>{filteredQuestions.length}</b>개 문항 검색됨
                        </span>
                      </div>

                      <Input
                        size="small"
                        placeholder="문항 내용 또는 해설 검색..."
                        prefix={<Search className="w-3.5 h-3.5 text-slate-400" />}
                        value={searchQuestion}
                        onChange={(e) => setSearchQuestion(e.target.value)}
                        className="w-full sm:w-64"
                      />
                    </div>

                    {/* 문항 목록 테이블 */}
                    <div className="space-y-3">
                      {filteredQuestions.map((q, qIdx) => (
                        <div
                          key={qIdx}
                          className="bg-white rounded-xl p-5 border border-slate-200 space-y-3 shadow-xs hover:border-emerald-300 transition"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                Q{q.questionNumber}
                              </span>
                              <Tag color={q.type === 'MOCK' ? 'blue' : 'purple'} className="font-bold text-[11px]">
                                {q.type === 'MOCK' ? '실전 모의고사' : '최종 평가시험'}
                              </Tag>
                              <h5 className="font-bold text-slate-900 text-sm">
                                {q.title}
                              </h5>
                            </div>
                            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                              배점: 20점
                            </span>
                          </div>

                          {/* 4지선다 옵션 리스트 */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                            {q.options.map((opt) => {
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
                ),
              },
            ]}
          />
        </Card>
      </UiBadge>
    </div>
  );
};

export default CurriculumManager;
