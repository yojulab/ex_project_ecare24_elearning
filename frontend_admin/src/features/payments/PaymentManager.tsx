import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Card, message, Modal, Input } from 'antd';
import { CreditCard, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import UiBadge from '../../components/UiBadge';

const API_BASE = 'http://localhost:30014/api/v1';

export const PaymentManager: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: 'admin', password: 'admin1234!' }),
      });
      const { accessToken } = await loginRes.json();

      const res = await fetch(`${API_BASE}/admin/payments`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      }
    } catch (err) {
      console.warn('결제 목록 조회 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleConfirm = async (paymentId: string, depositorName: string, amount: number) => {
    Modal.confirm({
      title: '무통장 입금확인 승인',
      content: `입금자 [${depositorName}]님의 ${amount.toLocaleString()}원 입금을 확인하고 수강을 활성화하시겠습니까?`,
      okText: '입금확인 완료',
      cancelText: '취소',
      okButtonProps: { className: 'bg-emerald-600' },
      onOk: async () => {
        try {
          const loginRes = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ loginId: 'admin', password: 'admin1234!' }),
          });
          const { accessToken } = await loginRes.json();

          const res = await fetch(`${API_BASE}/admin/payments/${paymentId}/confirm`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (res.ok) {
            message.success('입금확인이 정상 처리되어 수강이 활성화되었습니다.');
            fetchPayments();
          } else {
            const err = await res.json();
            message.error(err.message || '승인 처리 실패');
          }
        } catch (e: any) {
          message.error('서버 통신 오류: ' + e.message);
        }
      },
    });
  };

  const columns = [
    {
      title: '주문번호',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text: string) => <span className="font-mono font-bold text-xs">{text}</span>,
    },
    {
      title: '수강생',
      key: 'user',
      render: (_: any, record: any) => (
        <div>
          <div className="font-bold text-slate-800 text-xs">{record.user?.fullName || '회원'}</div>
          <div className="text-[11px] text-slate-400">{record.user?.phoneNumber || '-'}</div>
        </div>
      ),
    },
    {
      title: '신청 과정',
      key: 'course',
      render: (_: any, record: any) => (
        <span className="text-xs text-slate-700 font-medium">
          {record.enrollment?.course?.title || record.memo || '과정'}
        </span>
      ),
    },
    {
      title: '입금자명',
      dataIndex: 'depositorName',
      key: 'depositorName',
      render: (text: string) => <span className="font-semibold text-xs">{text || '-'}</span>,
    },
    {
      title: '청구금액',
      dataIndex: 'amount',
      key: 'amount',
      render: (amt: number) => (
        <span className="font-bold text-slate-900 text-xs">{(amt || 0).toLocaleString()}원</span>
      ),
    },
    {
      title: '결제상태',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'PAID') return <Tag color="green">입금완료</Tag>;
        if (status === 'PENDING') return <Tag color="orange">입금대기</Tag>;
        if (status === 'REFUND_REQUESTED') return <Tag color="purple">환불요청</Tag>;
        return <Tag>{status}</Tag>;
      },
    },
    {
      title: '신청일시',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d: string) => <span className="text-[11px] text-slate-400">{new Date(d).toLocaleString()}</span>,
    },
    {
      title: '관리 액션',
      key: 'action',
      render: (_: any, record: any) => (
        <UiBadge serialId="P56-SEC01-BTN01" label="[P56-SEC01-BTN01]">
          {record.status === 'PENDING' ? (
            <Button
              size="small"
              type="primary"
              className="bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold"
              icon={<CheckCircle className="w-3.5 h-3.5" />}
              onClick={() => handleConfirm(record.id, record.depositorName, record.amount)}
            >
              입금확인
            </Button>
          ) : (
            <span className="text-xs text-emerald-700 font-semibold">✓ 승인완료</span>
          )}
        </UiBadge>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-60px)]">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            수강료 납부 및 무통장 입금확인 관리
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            수강생이 신청한 무통장 입금 내역을 대조하고 1클릭으로 입금을 승인하여 수강을 활성화합니다.
          </p>
        </div>
        <UiBadge serialId="P56-NAV01-BTN01" label="[P56-NAV01-BTN01]">
          <Button
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={fetchPayments}
            loading={loading}
            className="text-xs font-semibold"
          >
            새로고침
          </Button>
        </UiBadge>
      </div>

      <Card className="shadow-sm border-slate-200">
        <Table
          columns={columns}
          dataSource={payments}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default PaymentManager;
