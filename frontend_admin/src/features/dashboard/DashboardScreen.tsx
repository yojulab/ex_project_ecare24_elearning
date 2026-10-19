import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Button, Alert, message } from 'antd';
import {
  Users,
  CreditCard,
  BookOpen,
  Headphones,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import UiBadge from '../../components/UiBadge';
import { ENV } from '../../config/env';

const API_BASE = ENV.API_BASE_URL;

export const DashboardScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({
    kpis: {
      totalStudents: 1,
      activeEnrollments: 1,
      pendingPaymentCount: 0,
      pendingPaymentAmount: 0,
      openInquiries: 0,
    },
    queues: {
      pendingPayments: [],
    },
  });

  const fetchKpis = async () => {
    setLoading(true);
    try {
      // 1. 관리자 토큰 로그인 (데모/로컬 세션)
      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: 'admin', password: 'admin1234!' }),
      });
      const loginData = await loginRes.json();
      const token = loginData.accessToken;

      // 2. KPI 및 큐 조회
      const res = await fetch(`${API_BASE}/admin/dashboard/kpis`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const kpiJson = await res.json();
        setData(kpiJson);
      }
    } catch (err) {
      console.warn('API 서버 연결 대기 중 (기본값 표시):', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpis();
  }, []);

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-60px)]">
      {/* 상단 환영 배너 */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-5 shadow-lg flex justify-between items-center border border-indigo-900/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">
              한국돌봄종사자양성교육원 통합 관리자 대시보드
            </h1>
          </div>
          <p className="text-xs text-slate-300">
            실시간 수강생 현황, 무통장 입금확인 대기, 16대 질환 커리큘럼 및 팝업 공지를 한눈에 관제합니다.
          </p>
        </div>
        <UiBadge serialId="P50-SEC01-BTN01" label="[P50-SEC01-BTN01]">
          <Button
            type="primary"
            onClick={fetchKpis}
            loading={loading}
            className="bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs"
          >
            새로고침
          </Button>
        </UiBadge>
      </div>

      {/* 4대 핵심 KPI 카드 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <UiBadge serialId="P50-KPI-CARD01" label="[P50-KPI-CARD01]">
            <Card className="shadow-sm border-slate-200 hover:shadow-md transition">
              <Statistic
                title={<span className="font-bold text-slate-600">총 수강생</span>}
                value={data.kpis.totalStudents}
                suffix="명"
                prefix={<Users className="w-5 h-5 text-indigo-600 mr-2 inline" />}
                valueStyle={{ color: '#1e293b', fontWeight: 'bold' }}
              />
              <div className="text-[11px] text-slate-400 mt-2">정규 및 16대 트랙 학습자 누적</div>
            </Card>
          </UiBadge>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <UiBadge serialId="P50-KPI-CARD02" label="[P50-KPI-CARD02]">
            <Card className="shadow-sm border-slate-200 hover:shadow-md transition">
              <Statistic
                title={<span className="font-bold text-slate-600">진행 중인 수강</span>}
                value={data.kpis.activeEnrollments}
                suffix="건"
                prefix={<BookOpen className="w-5 h-5 text-emerald-600 mr-2 inline" />}
                valueStyle={{ color: '#059669', fontWeight: 'bold' }}
              />
              <div className="text-[11px] text-slate-400 mt-2">이러닝 이론 및 실기 수강 중</div>
            </Card>
          </UiBadge>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <UiBadge serialId="P50-KPI-CARD03" label="[P50-KPI-CARD03]">
            <Card className="shadow-sm border-amber-200 bg-amber-50/30 hover:shadow-md transition">
              <Statistic
                title={<span className="font-bold text-amber-900">무통장 입금대기</span>}
                value={data.kpis.pendingPaymentCount}
                suffix="건"
                prefix={<Clock className="w-5 h-5 text-amber-600 mr-2 inline" />}
                valueStyle={{ color: '#d97706', fontWeight: 'bold' }}
              />
              <div className="text-[11px] text-amber-700 font-semibold mt-2">
                대기 금액: {(data.kpis.pendingPaymentAmount || 0).toLocaleString()}원
              </div>
            </Card>
          </UiBadge>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <UiBadge serialId="P50-KPI-CARD04" label="[P50-KPI-CARD04]">
            <Card className="shadow-sm border-slate-200 hover:shadow-md transition">
              <Statistic
                title={<span className="font-bold text-slate-600">미답변 1:1 상담/문의</span>}
                value={data.kpis.openInquiries}
                suffix="건"
                prefix={<Headphones className="w-5 h-5 text-sky-600 mr-2 inline" />}
                valueStyle={{ color: '#0284c7', fontWeight: 'bold' }}
              />
              <div className="text-[11px] text-slate-400 mt-2">콜센터 CTI 및 웹 1:1 인입</div>
            </Card>
          </UiBadge>
        </Col>
      </Row>

      {/* 처리 대기 큐 및 주요 안내 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title={
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>실시간 입금확인 처리 대기 큐</span>
            </div>
          }
          className="shadow-sm border-slate-200"
        >
          {data.queues.pendingPayments.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              현재 대기 중인 무통장 입금 건이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {data.queues.pendingPayments.map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{p.depositorName || '미지정'} ({p.orderNo})</div>
                    <div className="text-slate-500 text-[11px]">{p.memo}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-amber-700">{p.amount.toLocaleString()}원</div>
                    <Tag color="orange" className="mr-0 text-[10px]">입금대기</Tag>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card
          title={
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>eCare24 백엔드 & 시스템 운영 현황</span>
            </div>
          }
          className="shadow-sm border-slate-200 text-xs space-y-3 text-slate-700"
        >
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">API 엔드포인트:</span>
            <span className="font-mono font-semibold text-indigo-600">{ENV.API_BASE_URL}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Swagger API 문서:</span>
            <a href={ENV.API_DOCS_URL} target="_blank" rel="noreferrer" className="text-indigo-600 underline font-semibold">
              /api/docs 바로가기 ↗
            </a>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">인증 및 권한 모드:</span>
            <span className="font-semibold text-emerald-700">역할(Role) 없음 · 25개 행단위 권한 리스트 (Active)</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-500">교육 영상 연동:</span>
            <span className="font-semibold text-slate-800">HeyGen AI 비디오 2편 (embedUrl 바인딩 완료)</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardScreen;
