'use client';

import React, { useState } from 'react';
import { X, User, Lock, Phone, Mail, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { ENV } from '../config/env';
import UiBadge from './UiBadge';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'LOGIN' | 'SIGNUP';
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'LOGIN',
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'SIGNUP'>(initialTab);

  // 로그인 폼
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  // 회원가입 폼
  const [signupLoginId, setSignupLoginId] = useState('');
  const [signupFullName, setSignupFullName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginId || !password) {
      setErrorMessage('아이디와 비밀번호를 모두 입력해 주세요.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${ENV.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || '로그인에 실패했습니다.');
      }

      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('user_info', JSON.stringify(data.user));
      setSuccessMessage(`${data.user.fullName} 교육생님, 환영합니다!`);
      setTimeout(() => {
        onSuccess(data.user);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || '서버 통신 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (id: string, pw: string) => {
    setLoginId(id);
    setPassword(pw);
    setLoading(true);
    fetch(`${ENV.API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginId: id, password: pw }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || '로그인 실패');
        localStorage.setItem('access_token', data.accessToken);
        localStorage.setItem('user_info', JSON.stringify(data.user));
        setSuccessMessage(`${data.user.fullName} 교육생님, 로그인되었습니다.`);
        setTimeout(() => {
          onSuccess(data.user);
          onClose();
        }, 600);
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => setLoading(false));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signupLoginId || !signupFullName || !signupPhone || !signupPassword) {
      setErrorMessage('필수 항목(아이디, 성명, 휴대폰번호, 비밀번호)을 모두 입력해 주세요.');
      return;
    }

    if (signupPassword.length < 6) {
      setErrorMessage('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${ENV.API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginId: signupLoginId,
          fullName: signupFullName,
          phoneNumber: signupPhone,
          password: signupPassword,
          email: signupEmail || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || '회원가입에 실패했습니다.');
      }

      if (data.accessToken) {
        localStorage.setItem('access_token', data.accessToken);
        localStorage.setItem('user_info', JSON.stringify(data.user));
      }

      setSuccessMessage('회원가입이 성공적으로 완료되었습니다! 자동 로그인됩니다.');
      setTimeout(() => {
        onSuccess(data.user);
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* 상단 탭 헤더 */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('LOGIN');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`text-base font-black pb-1 transition-all ${
                activeTab === 'LOGIN'
                  ? 'text-emerald-700 border-b-2 border-emerald-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              수강생 로그인
            </button>
            <button
              onClick={() => {
                setActiveTab('SIGNUP');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`text-base font-black pb-1 transition-all ${
                activeTab === 'SIGNUP'
                  ? 'text-emerald-700 border-b-2 border-emerald-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              신규 회원가입
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 안내 메시지 */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="p-6">
          {activeTab === 'LOGIN' ? (
            /* 1. 로그인 탭 */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  아이디 또는 휴대폰번호
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="student01 또는 010-0000-0000"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-emerald-600 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  비밀번호
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    placeholder="비밀번호 입력"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-emerald-600 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <UiBadge serialId="P00-SEC01-BTN-LOGIN" label="[P00-SEC01-BTN-LOGIN]" className="w-full">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md text-sm transition active:scale-98 disabled:opacity-50"
                >
                  {loading ? '로그인 처리 중...' : '돌봄 수강생 로그인'}
                </button>
              </UiBadge>

              {/* 빠른 데모 로그인 지원 */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>체험용 1초 원클릭 계정:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('student01', 'password123!')}
                    className="p-2 bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-slate-700 font-semibold transition text-left"
                  >
                    <div className="font-bold text-emerald-800">김영희 교육생</div>
                    <div className="text-[10px] text-slate-500 font-mono">student01</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('student02', 'password123!')}
                    className="p-2 bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-slate-700 font-semibold transition text-left"
                  >
                    <div className="font-bold text-emerald-800">이철수 교육생</div>
                    <div className="text-[10px] text-slate-500 font-mono">student02</div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* 2. 신규 회원가입 탭 */
            <form onSubmit={handleSignup} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  로그인 아이디 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="영문, 숫자 조합 아이디"
                    value={signupLoginId}
                    onChange={(e) => setSignupLoginId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-emerald-600 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  수강생 성명 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 홍길동"
                  value={signupFullName}
                  onChange={(e) => setSignupFullName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-emerald-600 focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  휴대폰번호 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    placeholder="010-0000-0000"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-emerald-600 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  비밀번호 <span className="text-rose-500">* (6자 이상)</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    placeholder="6자 이상 입력"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-emerald-600 focus:bg-white transition"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  이메일 (선택)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="example@ecare24.kr"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-emerald-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="pt-2">
                <UiBadge serialId="P00-SEC01-BTN-SIGNUP" label="[P00-SEC01-BTN-SIGNUP]" className="w-full">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md text-sm transition active:scale-98 disabled:opacity-50"
                  >
                    {loading ? '가입 처리 중...' : '돌봄교육원 회원가입 완료'}
                  </button>
                </UiBadge>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
