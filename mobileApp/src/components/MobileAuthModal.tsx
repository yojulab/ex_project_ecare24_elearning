import React, { useState } from 'react';
import { X, User, Lock, Phone, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { UiBadge } from './UiBadge';
import { ENV } from '../config/env';

interface MobileAuthModalProps {
  isOpen: boolean;
  initialTab?: 'LOGIN' | 'SIGNUP';
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const MobileAuthModal: React.FC<MobileAuthModalProps> = ({
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

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginId || !password) {
      setErrorMessage('아이디와 비밀번호를 입력해 주세요.');
      return;
    }

    setLoading(true);
    try {
      const executeLogin = async (baseUrl: string) => {
        const res = await fetch(`${baseUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ loginId, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || '로그인 실패');
        return data;
      };

      let data;
      try {
        data = await executeLogin(ENV.API_BASE_URL);
      } catch (err: any) {
        if (err.name === 'TypeError' || err.message?.includes('fetch')) {
          const fallback = 'http://localhost:30014/api/v1';
          if (ENV.API_BASE_URL !== fallback) {
            data = await executeLogin(fallback);
          } else {
            throw err;
          }
        } else {
          throw err;
        }
      }

      localStorage.setItem('mobile_token', data.accessToken);
      localStorage.setItem('mobile_user_info', JSON.stringify(data.user));
      setSuccessMessage(`${data.user.fullName} 교육생님 환영합니다!`);
      setTimeout(() => {
        onSuccess(data.user);
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || '로그인 오류');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signupLoginId || !signupFullName || !signupPhone || !signupPassword) {
      setErrorMessage('모든 필수 항목을 입력해 주세요.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        loginId: signupLoginId,
        fullName: signupFullName,
        phoneNumber: signupPhone,
        password: signupPassword,
      };

      const executeSignup = async (baseUrl: string) => {
        const res = await fetch(`${baseUrl}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || '회원가입 실패');
        return data;
      };

      let data;
      try {
        data = await executeSignup(ENV.API_BASE_URL);
      } catch (err: any) {
        if (err.name === 'TypeError' || err.message?.includes('fetch')) {
          const fallback = 'http://localhost:30014/api/v1';
          if (ENV.API_BASE_URL !== fallback) {
            data = await executeSignup(fallback);
          } else {
            throw err;
          }
        } else {
          throw err;
        }
      }

      if (data.accessToken) {
        localStorage.setItem('mobile_token', data.accessToken);
        localStorage.setItem('mobile_user_info', JSON.stringify(data.user));
      }

      setSuccessMessage('회원가입이 완료되었습니다!');
      setTimeout(() => {
        onSuccess(data.user);
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || '회원가입 오류');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (id: string, pw: string) => {
    setLoginId(id);
    setPassword(pw);
    setLoading(true);
    setErrorMessage('');

    const executeLogin = async (baseUrl: string) => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: id, password: pw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '로그인 실패');
      return data;
    };

    try {
      let data;
      try {
        data = await executeLogin(ENV.API_BASE_URL);
      } catch (err: any) {
        if (err.name === 'TypeError' || err.message?.includes('fetch')) {
          const fallback = 'http://localhost:30014/api/v1';
          if (ENV.API_BASE_URL !== fallback) {
            data = await executeLogin(fallback);
          } else {
            throw err;
          }
        } else {
          throw err;
        }
      }

      localStorage.setItem('mobile_token', data.accessToken);
      localStorage.setItem('mobile_user_info', JSON.stringify(data.user));
      setSuccessMessage(`${data.user.fullName} 교육생님, 로그인되었습니다.`);
      setTimeout(() => {
        onSuccess(data.user);
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || '로그인 오류');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('LOGIN')}
              className={`text-sm font-black pb-1 transition ${
                activeTab === 'LOGIN' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => setActiveTab('SIGNUP')}
              className={`text-sm font-black pb-1 transition ${
                activeTab === 'SIGNUP' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'
              }`}
            >
              간편 회원가입
            </button>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
            <X size={18} />
          </button>
        </div>

        {errorMessage && (
          <div className="mx-5 mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mx-5 mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5 font-bold">
            <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="p-5 overflow-y-auto">
          {activeTab === 'LOGIN' ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">아이디 / 휴대폰</label>
                <div className="relative">
                  <User size={15} className="text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="student01"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-indigo-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">비밀번호</label>
                <div className="relative">
                  <Lock size={15} className="text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-indigo-600"
                    required
                  />
                </div>
              </div>

              <UiBadge serialId="P48-BTN-LOGIN" label="[P48-BTN-LOGIN]" className="w-full">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-md mt-2 transition active:scale-95"
                >
                  {loading ? '로그인 중...' : '모바일 로그인'}
                </button>
              </UiBadge>

              <div className="pt-2 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                  <Sparkles size={12} className="text-amber-500" />
                  <span>원클릭 데모:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('student01', 'password123!')}
                    className="p-1.5 bg-slate-100 hover:bg-indigo-50 border border-slate-200 rounded-lg text-left"
                  >
                    <div className="font-bold text-[11px] text-indigo-900">김영희 교육생</div>
                    <div className="text-[9px] text-slate-500 font-mono">student01</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('student02', 'password123!')}
                    className="p-1.5 bg-slate-100 hover:bg-indigo-50 border border-slate-200 rounded-lg text-left"
                  >
                    <div className="font-bold text-[11px] text-indigo-900">이철수 교육생</div>
                    <div className="text-[9px] text-slate-500 font-mono">student02</div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  아이디 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="영문, 숫자"
                  value={signupLoginId}
                  onChange={(e) => setSignupLoginId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  수강생 성명 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 홍길동"
                  value={signupFullName}
                  onChange={(e) => setSignupFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  휴대폰번호 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  비밀번호 <span className="text-rose-500">* (6자 이상)</span>
                </label>
                <input
                  type="password"
                  placeholder="6자 이상"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-indigo-600"
                  required
                  minLength={6}
                />
              </div>

              <UiBadge serialId="P48-BTN-SIGNUP" label="[P48-BTN-SIGNUP]" className="w-full">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-md mt-2 transition active:scale-95"
                >
                  {loading ? '가입 중...' : '회원가입 완료'}
                </button>
              </UiBadge>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileAuthModal;
