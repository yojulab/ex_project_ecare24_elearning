import React, { useState } from 'react';
import { Modal, Form, Input, Button, Tabs, message, Tag } from 'antd';
import { User, Lock, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { ENV } from '../../config/env';
import { UiBadge } from '../../components/UiBadge';

interface AdminAuthModalProps {
  open: boolean;
  onCancel: () => void;
  onLoginSuccess: (user: any) => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  open,
  onCancel,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [loginForm] = Form.useForm();
  const [signupForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${ENV.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || '로그인에 실패했습니다.');
      }

      localStorage.setItem('ecare24_admin_token', data.accessToken);
      localStorage.setItem('admin_user_info', JSON.stringify(data.user));
      message.success(`${data.user.fullName} 관리자님, 로그인되었습니다.`);
      onLoginSuccess(data.user);
      onCancel();
    } catch (e: any) {
      message.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${ENV.API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginId: values.loginId,
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
          password: values.password,
          email: values.email || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || '계정 생성에 실패했습니다.');
      }

      if (data.accessToken) {
        localStorage.setItem('ecare24_admin_token', data.accessToken);
        localStorage.setItem('admin_user_info', JSON.stringify(data.user));
      }

      message.success('신규 관리자/임직원 계정이 등록되었습니다. 즉시 접속됩니다.');
      onLoginSuccess(data.user);
      onCancel();
    } catch (e: any) {
      message.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={460}
      title={
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span className="font-extrabold text-base text-slate-900">
            한국돌봄종사자양성교육원 관리자 인증
          </span>
        </div>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={(k) => setActiveTab(k as any)}
        items={[
          {
            key: 'LOGIN',
            label: <span className="font-bold">관리자 로그인</span>,
            children: (
              <Form
                form={loginForm}
                layout="vertical"
                onFinish={handleLogin}
                initialValues={{ loginId: 'admin', password: 'admin1234!' }}
                className="mt-3"
              >
                <Form.Item
                  name="loginId"
                  label="관리자 아이디"
                  rules={[{ required: true, message: '아이디를 입력하세요' }]}
                >
                  <Input prefix={<User className="w-4 h-4 text-slate-400" />} />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="비밀번호"
                  rules={[{ required: true, message: '비밀번호를 입력하세요' }]}
                >
                  <Input.Password prefix={<Lock className="w-4 h-4 text-slate-400" />} />
                </Form.Item>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-4 text-xs text-slate-600 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-700">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>초기 관리자 계정:</span>
                  </div>
                  <Tag color="indigo" className="font-mono font-bold mr-0">
                    admin / admin1234!
                  </Tag>
                </div>

                <UiBadge serialId="P50-SEC01-BTN-LOGIN" label="[P50-SEC01-BTN-LOGIN]" className="w-full">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    className="bg-indigo-600 hover:bg-indigo-700 font-extrabold h-10"
                  >
                    관리자 포털 로그인
                  </Button>
                </UiBadge>
              </Form>
            ),
          },
          {
            key: 'SIGNUP',
            label: <span className="font-bold">임직원 계정 등록 (회원가입)</span>,
            children: (
              <Form
                form={signupForm}
                layout="vertical"
                onFinish={handleSignup}
                className="mt-3"
              >
                <Form.Item
                  name="loginId"
                  label="관리자/직원 아이디"
                  rules={[{ required: true, message: '아이디를 입력하세요' }]}
                >
                  <Input placeholder="영문/숫자 아이디" prefix={<User className="w-4 h-4 text-slate-400" />} />
                </Form.Item>

                <Form.Item
                  name="fullName"
                  label="임직원 성명"
                  rules={[{ required: true, message: '성명을 입력하세요' }]}
                >
                  <Input placeholder="예: 박관리" />
                </Form.Item>

                <Form.Item
                  name="phoneNumber"
                  label="휴대폰번호"
                  rules={[{ required: true, message: '휴대폰번호를 입력하세요' }]}
                >
                  <Input placeholder="010-0000-0000" prefix={<Phone className="w-4 h-4 text-slate-400" />} />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="비밀번호 (6자 이상)"
                  rules={[{ required: true, min: 6, message: '6자 이상 입력하세요' }]}
                >
                  <Input.Password prefix={<Lock className="w-4 h-4 text-slate-400" />} />
                </Form.Item>

                <UiBadge serialId="P50-SEC01-BTN-SIGNUP" label="[P50-SEC01-BTN-SIGNUP]" className="w-full">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    className="bg-indigo-600 hover:bg-indigo-700 font-extrabold h-10"
                  >
                    신규 임직원 등록 완료
                  </Button>
                </UiBadge>
              </Form>
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default AdminAuthModal;
