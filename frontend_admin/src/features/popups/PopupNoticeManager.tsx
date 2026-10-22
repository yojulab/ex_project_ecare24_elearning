import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Card, Modal, Form, Input, DatePicker, Switch, message } from 'antd';
import { Bell, Plus, RefreshCw, Eye } from 'lucide-react';
import UiBadge from '../../components/UiBadge';
import { ENV } from '../../config/env';

const API_BASE = ENV.API_BASE_URL;

export const PopupNoticeManager: React.FC = () => {
  const [popups, setPopups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchPopups = async () => {
    setLoading(true);
    try {
      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: 'admin', password: 'admin1234!' }),
      });
      const { accessToken } = await loginRes.json();

      const res = await fetch(`${API_BASE}/admin/popups`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPopups(data);
      }
    } catch (err) {
      console.warn('팝업 목록 조회 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopups();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: 'admin', password: 'admin1234!' }),
      });
      const { accessToken } = await loginRes.json();

      const payload = {
        title: values.title,
        contentHtml: values.contentHtml,
        linkUrl: values.linkUrl,
        imageUrl: values.imageUrl,
        startsAt: values.dateRange ? values.dateRange[0].toISOString() : new Date().toISOString(),
        endsAt: values.dateRange ? values.dateRange[1].toISOString() : new Date(Date.now() + 7 * 86400000).toISOString(),
        showOnWeb: values.showOnWeb ?? true,
        showOnMobile: values.showOnMobile ?? true,
        priority: values.priority || 0,
      };

      const res = await fetch(`${API_BASE}/admin/popups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        message.success('신규 팝업 공지가 등록되었습니다.');
        setIsModalOpen(false);
        form.resetFields();
        fetchPopups();
      } else {
        const err = await res.json();
        message.error(err.message || '등록 실패');
      }
    } catch (e: any) {
      message.error('서버 통신 오류: ' + e.message);
    }
  };

  const handleToggleActive = async (popupId: string) => {
    try {
      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: 'admin', password: 'admin1234!' }),
      });
      const { accessToken } = await loginRes.json();

      const res = await fetch(`${API_BASE}/admin/popups/${popupId}/toggle`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.ok) {
        const data = await res.json();
        message.success(data.message || '팝업 상태가 변경되었습니다.');
        fetchPopups();
      } else {
        message.error('상태 변경 실패');
      }
    } catch (e: any) {
      message.error('상태 변경 오류: ' + e.message);
    }
  };

  const handleDelete = async (popupId: string) => {
    if (!window.confirm('정말로 이 팝업 공지를 삭제하시겠습니까?')) return;
    try {
      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: 'admin', password: 'admin1234!' }),
      });
      const { accessToken } = await loginRes.json();

      const res = await fetch(`${API_BASE}/admin/popups/${popupId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.ok) {
        message.success('팝업 공지가 삭제되었습니다.');
        fetchPopups();
      } else {
        message.error('삭제 실패');
      }
    } catch (e: any) {
      message.error('삭제 오류: ' + e.message);
    }
  };

  const [editingPopup, setEditingPopup] = useState<any>(null);
  const [editForm] = Form.useForm();

  const openEditModal = (record: any) => {
    setEditingPopup(record);
    editForm.setFieldsValue({
      title: record.title,
      contentHtml: record.contentHtml,
      linkUrl: record.linkUrl,
      priority: record.priority,
      showOnWeb: record.showOnWeb,
      showOnMobile: record.showOnMobile,
      isActive: record.isActive,
    });
  };

  const handleUpdate = async (values: any) => {
    if (!editingPopup) return;
    try {
      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: 'admin', password: 'admin1234!' }),
      });
      const { accessToken } = await loginRes.json();

      const res = await fetch(`${API_BASE}/admin/popups/${editingPopup.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        message.success('팝업 공지가 수정되었습니다.');
        setEditingPopup(null);
        fetchPopups();
      } else {
        message.error('수정 실패');
      }
    } catch (e: any) {
      message.error('수정 오류: ' + e.message);
    }
  };

  const columns = [
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span className="font-bold text-xs text-slate-800">{text}</span>,
    },
    {
      title: '노출 채널',
      key: 'channel',
      render: (_: any, r: any) => (
        <div className="flex gap-1">
          {r.showOnWeb && <Tag color="blue">웹(Web)</Tag>}
          {r.showOnMobile && <Tag color="green">모바일(App)</Tag>}
        </div>
      ),
    },
    {
      title: '노출 기간',
      key: 'period',
      render: (_: any, r: any) => (
        <span className="text-[11px] text-slate-500">
          {new Date(r.startsAt).toLocaleDateString()} ~ {new Date(r.endsAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: '우선순위',
      dataIndex: 'priority',
      key: 'priority',
      render: (p: number) => <Tag color={p > 0 ? 'red' : 'default'}>{p}</Tag>,
    },
    {
      title: '상태 (토글)',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean, r: any) => (
        <div className="flex items-center gap-2">
          <Switch
            size="small"
            checked={active}
            onChange={() => handleToggleActive(r.id)}
          />
          <span className="text-xs font-bold text-slate-600">
            {active ? '진행중' : '중단'}
          </span>
        </div>
      ),
    },
    {
      title: '관리',
      key: 'actions',
      render: (_: any, r: any) => (
        <div className="flex items-center gap-1.5">
          <Button
            size="small"
            className="text-xs font-semibold px-2"
            onClick={() => openEditModal(r)}
          >
            수정
          </Button>
          <Button
            size="small"
            danger
            className="text-xs font-semibold px-2"
            onClick={() => handleDelete(r.id)}
          >
            삭제
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-60px)]">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            팝업 공지 관리
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            수강생 웹 및 모바일 앱 첫 진입 시 노출할 공지 팝업을 등록, 수정, 상태 전환, 삭제할 수 있습니다.
          </p>
        </div>
        <div className="flex gap-2">
          <UiBadge serialId="P58-NAV01-BTN01" label="[P58-NAV01-BTN01]">
            <Button icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={fetchPopups} loading={loading}>
              새로고침
            </Button>
          </UiBadge>
          <UiBadge serialId="P58-NAV01-BTN02" label="[P58-NAV01-BTN02]">
            <Button
              type="primary"
              icon={<Plus className="w-3.5 h-3.5" />}
              className="bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs"
              onClick={() => setIsModalOpen(true)}
            >
              신규 팝업 등록
            </Button>
          </UiBadge>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <Table columns={columns} dataSource={popups} rowKey="id" loading={loading} />
      </Card>

      {/* 신규 팝업 등록 모달 */}
      <Modal
        title="신규 팝업 공지 등록"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} className="mt-4">
          <Form.Item name="title" label="팝업 제목" rules={[{ required: true, message: '제목을 입력하세요' }]}>
            <Input placeholder="예: 2026년 하반기 돌봄종사자 교육생 정규 모집 안내" />
          </Form.Item>

          <Form.Item name="contentHtml" label="팝업 본문 (텍스트 또는 HTML)">
            <Input.TextArea rows={4} placeholder="공지 내용 요약 및 안내 문구" />
          </Form.Item>

          <Form.Item name="linkUrl" label="클릭 시 이동할 링크 URL">
            <Input placeholder="예: /curriculum 또는 https://..." />
          </Form.Item>

          <Form.Item name="dateRange" label="노출 기간">
            <DatePicker.RangePicker className="w-full" />
          </Form.Item>

          <div className="flex gap-6 mb-4">
            <Form.Item name="showOnWeb" label="웹 노출" valuePropName="checked" initialValue={true}>
              <Switch defaultChecked />
            </Form.Item>
            <Form.Item name="showOnMobile" label="모바일 노출" valuePropName="checked" initialValue={true}>
              <Switch defaultChecked />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalOpen(false)}>취소</Button>
            <Button type="primary" htmlType="submit" className="bg-indigo-600">
              팝업 게시하기
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 팝업 공지 수정 모달 */}
      <Modal
        title="팝업 공지 수정"
        open={!!editingPopup}
        onCancel={() => setEditingPopup(null)}
        footer={null}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate} className="mt-4">
          <Form.Item name="title" label="팝업 제목" rules={[{ required: true, message: '제목을 입력하세요' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="contentHtml" label="팝업 본문 (텍스트 또는 HTML)">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item name="linkUrl" label="클릭 시 이동할 링크 URL">
            <Input />
          </Form.Item>

          <Form.Item name="priority" label="우선순위 (높을수록 상단)">
            <Input type="number" />
          </Form.Item>

          <div className="flex gap-6 mb-4">
            <Form.Item name="showOnWeb" label="웹 노출" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="showOnMobile" label="모바일 노출" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="isActive" label="활성화" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setEditingPopup(null)}>취소</Button>
            <Button type="primary" htmlType="submit" className="bg-indigo-600">
              수정사항 저장
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PopupNoticeManager;
