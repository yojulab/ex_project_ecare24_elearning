import React, { useState, useEffect } from 'react';
import { Card, Table, Checkbox, Button, Tag, message, Alert } from 'antd';
import { ShieldCheck, Save, RefreshCw, KeyRound } from 'lucide-react';
import UiBadge from '../../components/UiBadge';

const API_BASE = 'http://localhost:30014/api/v1';

export const PermissionMatrix: React.FC = () => {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: 'admin', password: 'admin1234!' }),
      });
      const loginData = await loginRes.json();
      setAdminUser(loginData.user);
      const token = loginData.accessToken;

      // 1. 전체 권한 25개 마스터
      const permRes = await fetch(`${API_BASE}/admin/permissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (permRes.ok) {
        const pList = await permRes.json();
        setPermissions(pList);
      }

      // 2. 현재 관리자의 보유 권한 목록
      if (loginData.user?.id) {
        const userPermRes = await fetch(`${API_BASE}/admin/users/${loginData.user.id}/permissions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userPermRes.ok) {
          const userP = await userPermRes.json();
          setSelectedPerms(userP);
        }
      }
    } catch (e) {
      console.warn('권한 데이터 조회 오류:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = (code: string) => {
    setSelectedPerms((prev) =>
      prev.includes(code) ? prev.filter((p) => p !== code) : [...prev, code]
    );
  };

  const handleSave = async () => {
    if (!adminUser?.id) return;
    setSaving(true);
    try {
      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: 'admin', password: 'admin1234!' }),
      });
      const { accessToken } = await loginRes.json();

      const res = await fetch(`${API_BASE}/admin/users/${adminUser.id}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ permissions: selectedPerms }),
      });

      if (res.ok) {
        message.success(`권한 ${selectedPerms.length}건이 성공적으로 저장되었습니다.`);
      } else {
        message.error('권한 저장 실패');
      }
    } catch (e: any) {
      message.error('오류: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: '권한 코드',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <span className="font-mono font-bold text-xs text-indigo-700">{code}</span>,
    },
    {
      title: '분류',
      dataIndex: 'groupName',
      key: 'groupName',
      render: (g: string) => <Tag color="blue">{g}</Tag>,
    },
    {
      title: '권한명',
      dataIndex: 'nameKo',
      key: 'nameKo',
      render: (n: string) => <span className="font-semibold text-xs text-slate-900">{n}</span>,
    },
    {
      title: '상세 설명',
      dataIndex: 'description',
      key: 'description',
      render: (d: string) => <span className="text-xs text-slate-500">{d}</span>,
    },
    {
      title: '부여 여부',
      key: 'assigned',
      render: (_: any, record: any) => (
        <Checkbox
          checked={selectedPerms.includes(record.code)}
          onChange={() => handleToggle(record.code)}
        />
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-60px)]">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            사용자별 권한 매트릭스 관리
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            역할(Role) 대신 행 단위 리스트로 각 관리자에게 필요한 최소 권한만을 안전하게 부여합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <UiBadge serialId="P59-NAV01-BTN01" label="[P59-NAV01-BTN01]">
            <Button icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={fetchData} loading={loading}>
              새로고침
            </Button>
          </UiBadge>
          <UiBadge serialId="P59-NAV01-BTN02" label="[P59-NAV01-BTN02]">
            <Button
              type="primary"
              icon={<Save className="w-3.5 h-3.5" />}
              className="bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs"
              onClick={handleSave}
              loading={saving}
            >
              권한 변경 저장
            </Button>
          </UiBadge>
        </div>
      </div>

      <Alert
        message="현재 대상 계정: 시스템관리자 (admin)"
        description={`총 25개 권한 중 ${selectedPerms.length}개 부여 중. 체크박스를 수정하고 [권한 변경 저장] 버튼을 누르면 즉시 세션에 적용됩니다.`}
        type="info"
        showIcon
        className="text-xs"
      />

      <Card className="shadow-sm border-slate-200">
        <Table
          columns={columns}
          dataSource={permissions}
          rowKey="code"
          loading={loading}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
};

export default PermissionMatrix;
