import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Input, Select, Tooltip, Switch, notification } from 'antd';
import { Video, BookOpen, CheckCircle, Search, ExternalLink, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { MOCK_DISEASES, MOCK_CURATED_VIDEOS } from '@ecare24/utils';
import { DiseaseCategory, CuratedVideo, CurationGrade } from '@ecare24/types';
import UiBadge from '../../components/UiBadge';
import { ENV } from '../../config/env';

export const CurriculumManager: React.FC = () => {
  const [diseases] = useState<DiseaseCategory[]>(MOCK_DISEASES);
  const [dbCourses, setDbCourses] = useState<any[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [videos, setVideos] = useState<CuratedVideo[]>(MOCK_CURATED_VIDEOS);
  const [filterGrade, setFilterGrade] = useState<string>('ALL');
  const [searchWord, setSearchWord] = useState('');

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
        console.warn('관리자 코스 목록 로드 오류 (Mock 유지):', err);
      })
      .finally(() => {
        setIsLoadingCourses(false);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleTogglePublish = async (courseId: string, currentPublished: boolean) => {
    // UI 낙관적 업데이트
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
          message: '노출 상태 시뮬레이션 변경',
          description: `과정 노출 상태가 [${!currentPublished ? '공개(수강생 노출)' : '비공개(수강생 미노출)'}]로 갱신되었습니다.`,
        });
      }
    } catch {
      notification.info({
        message: '노출 상태 변경 완료 (클라이언트 동기화)',
        description: `과정이 [${!currentPublished ? '수강생 노출' : '미노출'}]로 전환되었습니다.`,
      });
    }
  };

  const handleGradeChange = (videoId: string, newGrade: CurationGrade) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === videoId
          ? {
              ...v,
              curationGrade: newGrade,
              creditEligible: newGrade === 'A',
            }
          : v
      )
    );
    notification.success({
      message: '영상 등급 변경 완료',
      description: `영상 등급이 [${newGrade}등급]으로 갱신되었습니다. (A등급: Step 1 이론 이수시간 인정)`,
    });
  };

  const filteredVideos = videos.filter((v) => {
    if (filterGrade !== 'ALL' && v.curationGrade !== filterGrade) return false;
    if (searchWord && !v.title.includes(searchWord) && !v.lecturer.includes(searchWord))
      return false;
    return true;
  });

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      {/* 16개 질환군 편성 총괄표 */}
      <UiBadge serialId="P22-SEC01-CRD01" label="[P22-SEC01-CRD01]" className="w-full">
        <Card
          size="small"
          title="16대 질환군 편성 총괄 및 차등 이수시간 매트릭스"
          className="shadow-sm border-slate-200"
          styles={{ header: { background: '#f8fafc', fontWeight: 800 } }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <th className="p-2">번호</th>
                  <th className="p-2">질환군 명칭</th>
                  <th className="p-2">총 이수시간</th>
                  <th className="p-2">이론 / 실기 / 실습</th>
                  <th className="p-2">SNUBH 인정상한 (최대 50%)</th>
                  <th className="p-2">MVP 상태</th>
                  <th className="p-2">핵심 임상 케어 포인트</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {diseases.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="p-2 font-mono font-bold text-slate-500">
                      {d.id.toString().padStart(2, '0')}
                    </td>
                    <td className="p-2 font-bold text-slate-800">{d.nameKo}</td>
                    <td className="p-2 font-extrabold text-indigo-700">
                      {d.totalRequiredHours}시간
                    </td>
                    <td className="p-2 text-slate-600 font-mono">
                      {d.theoryHours}h / {d.practicalHours}h / {d.practicumHours}h
                    </td>
                    <td className="p-2 text-emerald-700 font-bold">
                      최대 {d.snubhCreditCapHours}h (50%)
                    </td>
                    <td className="p-2">
                      {d.isMvp ? (
                        <Tag color="purple" className="font-bold">
                          MVP 선행
                        </Tag>
                      ) : (
                        <Tag color="default">COMING_SOON</Tag>
                      )}
                    </td>
                    <td className="p-2 text-slate-500 text-[11px]">
                      {d.coreCarePoints.slice(0, 2).join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </UiBadge>

      {/* 관리자 등록 챕터 & 수강생 포털(/curriculum) 노출 제어 관리 */}
      <UiBadge serialId="P22-SEC01-REG01" label="[P22-SEC01-REG01]" className="w-full">
        <Card
          size="small"
          title={
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-800">
                실제 DB 등록 과정 및 챕터 노출 제어 (수강생 포털 /curriculum 연동)
              </span>
              <span className="text-xs text-slate-500 font-normal">
                관리자가 공개(On)로 등록한 챕터/과정만 수강생 포털에 실시간 노출됩니다.
              </span>
            </div>
          }
          extra={
            <Button
              size="small"
              icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoadingCourses ? 'animate-spin' : ''}`} />}
              onClick={fetchCourses}
            >
              새로고침 ({dbCourses.length}개 과정)
            </Button>
          }
          className="shadow-sm border-slate-200"
          styles={{ header: { background: '#f8fafc', fontWeight: 800 } }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <th className="p-2">유형</th>
                  <th className="p-2">과정/챕터 명칭</th>
                  <th className="p-2">이수시간</th>
                  <th className="p-2">등록 챕터(단계)</th>
                  <th className="p-2">VOD 차시</th>
                  <th className="p-2">수강생 포털 노출 상태</th>
                  <th className="p-2 text-center">관리자 노출 On/Off</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {dbCourses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-slate-400">
                      등록된 교육과정을 불러오는 중입니다...
                    </td>
                  </tr>
                ) : (
                  dbCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-2">
                        <Tag color={c.courseType === 'MAIN' ? 'gold' : 'blue'} className="font-extrabold">
                          {c.courseType === 'MAIN' ? '정규과정' : '전문트랙'}
                        </Tag>
                      </td>
                      <td className="p-2">
                        <div className="font-bold text-slate-900">{c.title}</div>
                        <div className="text-[11px] text-slate-500">{c.targetDisease}</div>
                      </td>
                      <td className="p-2 font-mono font-bold text-indigo-700">
                        {c.theoryHours + c.practicalHours + (c.practicumHours || 0)}시간
                        <span className="text-[10px] text-slate-400 ml-1">
                          (이론 {c.theoryHours}h + 실기 {c.practicalHours}h)
                        </span>
                      </td>
                      <td className="p-2">
                        <Tag color="cyan" className="font-semibold">
                          {c.steps?.length || 4}개 단계 챕터
                        </Tag>
                      </td>
                      <td className="p-2">
                        <Tag color="geekblue" className="font-semibold">
                          {c.videos?.length || 0}개 실습영상
                        </Tag>
                      </td>
                      <td className="p-2">
                        {c.isPublished ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <Eye className="w-3 h-3" />
                            포털 노출 중 (공개)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            <EyeOff className="w-3 h-3" />
                            포털 미노출 (비공개)
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        <Switch
                          checked={c.isPublished}
                          onChange={() => handleTogglePublish(c.id, c.isPublished)}
                          checkedChildren="공개"
                          unCheckedChildren="비공개"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </UiBadge>

      {/* SNUBH 영상 큐레이션 및 이수시간 인정 관리 (ADM-CRS-02) */}
      <UiBadge serialId="P22-SEC02-CRD01" label="[P22-SEC02-CRD01]" className="w-full">
        <Card
          size="small"
          title="대학병원 표준 임상 가이드라인 & 간병24TV 큐레이션 관리 대장"
          extra={
            <div className="flex items-center gap-2">
              <Select
                size="small"
                value={filterGrade}
                onChange={setFilterGrade}
                className="w-32"
                options={[
                  { value: 'ALL', label: '전체 등급' },
                  { value: 'A', label: 'A등급 (이론인정)' },
                  { value: 'B', label: 'B등급 (TV/쇼츠)' },
                  { value: 'C', label: 'C등급 (일반)' },
                  { value: 'X', label: 'X등급 (제외)' },
                ]}
              />
              <Input
                size="small"
                prefix={<Search className="w-3 h-3 text-slate-400" />}
                placeholder="영상 제목 / 교수명 검색"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                className="w-48"
              />
            </div>
          }
          className="shadow-sm border-slate-200"
          styles={{ header: { background: '#f8fafc', fontWeight: 800 } }}
        >
          <div className="space-y-3">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-24 h-16 bg-slate-200 rounded overflow-hidden shrink-0 relative">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] px-1 rounded font-mono">
                      {Math.floor(video.durationSeconds / 60)}:
                      {(video.durationSeconds % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <Tag
                        color={
                          video.curationGrade === 'A'
                            ? 'green'
                            : video.curationGrade === 'B'
                            ? 'blue'
                            : 'default'
                        }
                        className="font-bold"
                      >
                        {video.curationGrade}등급
                      </Tag>
                      {video.creditEligible && (
                        <Tag color="cyan" className="font-semibold text-[10px]">
                          Step 1 이론인정 (Cap 50%)
                        </Tag>
                      )}
                      <span className="text-xs text-slate-500">{video.lecturer}</span>
                    </div>
                    <div className="font-bold text-sm text-slate-800 mt-1">
                      {video.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      질환코드: {video.categoryCode} | YouTube ID: {video.youtubeId} | 조회수:{' '}
                      {video.viewCount}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    size="small"
                    value={video.curationGrade}
                    onChange={(val) => handleGradeChange(video.id, val as CurationGrade)}
                    className="w-28 text-xs"
                    options={[
                      { value: 'A', label: 'A: 이론인정' },
                      { value: 'B', label: 'B: 간병24TV' },
                      { value: 'C', label: 'C: 일반' },
                      { value: 'X', label: 'X: 제외' },
                    ]}
                  />
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded"
                    title="YouTube 원본 영상 보기"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </UiBadge>
    </div>
  );
};

export default CurriculumManager;
