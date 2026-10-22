import React, { useState } from 'react';
import { UiBadge } from '../components/UiBadge';
import {
  User,
  BookOpen,
  CreditCard,
  Award,
  PlayCircle,
  Copy,
  CheckCircle,
  Clock,
  PhoneCall,
  Sparkles,
  LogOut,
  LogIn,
} from 'lucide-react';
import { MobileAuthModal } from '../components/MobileAuthModal';

interface MyScreenProps {
  onNavigateCourse?: () => void;
}

export const MyScreen: React.FC<MyScreenProps> = ({ onNavigateCourse }) => {
  const [copied, setCopied] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>({
    fullName: '김영희',
    loginId: 'student01',
    userType: 'STUDENT',
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  const copyAccount = () => {
    navigator.clipboard.writeText('신한은행 110-542-889900 (예금주: 한국돌봄종사자양성교육원)');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="p-4 space-y-4 pb-20 bg-slate-50 min-h-screen"
      data-service-name="eCare24 스마트러닝"
      data-page-name="모바일 마이페이지 (P48)"
    >
      {/* 1. 상단 프로필 카드 */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-lg border border-indigo-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-extrabold text-lg shadow-inner">
              {currentUser?.fullName?.[0] || '김'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base">
                  {currentUser ? `${currentUser.fullName} 교육생님` : '로그인이 필요합니다'}
                </span>
                {currentUser && (
                  <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-200 text-[10px] rounded-full font-mono">
                    {currentUser.loginId}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                {currentUser ? '공인 돌봄종사자 양성과정 수강 중' : '수강 및 자격증 관리를 위해 로그인하세요'}
              </div>
            </div>
          </div>

          <div className="shrink-0">
            {currentUser ? (
              <UiBadge serialId="P48-SEC01-BTN-LOGOUT" label="[P48-SEC01-BTN-LOGOUT]">
                <button
                  onClick={() => {
                    localStorage.removeItem('mobile_token');
                    localStorage.removeItem('mobile_user_info');
                    setCurrentUser(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1 border border-slate-700"
                >
                  <LogOut size={12} />
                  <span>로그아웃</span>
                </button>
              </UiBadge>
            ) : (
              <div className="flex items-center gap-1.5">
                <UiBadge serialId="P48-SEC01-BTN-LOGIN" label="[P48-SEC01-BTN-LOGIN]">
                  <button
                    onClick={() => {
                      setAuthModalTab('LOGIN');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1"
                  >
                    <LogIn size={12} />
                    <span>로그인</span>
                  </button>
                </UiBadge>
                <UiBadge serialId="P48-SEC01-BTN-SIGNUP" label="[P48-SEC01-BTN-SIGNUP]">
                  <button
                    onClick={() => {
                      setAuthModalTab('SIGNUP');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                  >
                    회원가입
                  </button>
                </UiBadge>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-indigo-900/60 text-center text-xs">
          <div className="bg-slate-800/60 p-2 rounded-xl">
            <div className="text-[10px] text-slate-400">수강 과정</div>
            <div className="font-bold text-white mt-0.5">1개</div>
          </div>
          <div className="bg-slate-800/60 p-2 rounded-xl">
            <div className="text-[10px] text-slate-400">납부 상태</div>
            <div className="font-bold text-amber-400 mt-0.5">입금대기</div>
          </div>
          <div className="bg-slate-800/60 p-2 rounded-xl">
            <div className="text-[10px] text-slate-400">자격증</div>
            <div className="font-bold text-indigo-300 mt-0.5">심사 중</div>
          </div>
        </div>
      </div>

      {/* 2. 수강 진행 상황 카드 */}
      <UiBadge serialId="P48-SEC01-CRD01" label="[P48-SEC01-CRD01]">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded">
                정규 240시간 규격
              </span>
              <h3 className="font-bold text-sm text-slate-900 mt-1">
                돌봄종사자양성자 정규 통합과정
              </h3>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full">
              45% 완료
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
          </div>

          {/* 실습영상 안내 */}
          <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-slate-800 font-semibold text-[11px]">
                표준 임상 간호사 실습 VOD 이어보기
              </span>
            </div>
            <button
              onClick={onNavigateCourse}
              className="px-2.5 py-1 bg-indigo-600 text-white font-bold rounded-lg text-[11px] shrink-0"
            >
              재생
            </button>
          </div>
        </div>
      </UiBadge>

      {/* 3. 수강료 납부 상황 카드 */}
      <UiBadge serialId="P48-SEC02-CRD01" label="[P48-SEC02-CRD01]">
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 shadow-sm space-y-2.5">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                무통장 입금계좌 안내
              </div>
              <div className="font-bold text-sm text-amber-950 mt-0.5">
                신한은행 110-542-889900
              </div>
              <div className="text-[11px] text-amber-900">
                (주)한국돌봄종사자양성교육원
              </div>
            </div>
            <button
              onClick={copyAccount}
              className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-sm"
            >
              <Copy className="w-3 h-3" />
              <span>{copied ? '복사완료!' : '계좌복사'}</span>
            </button>
          </div>
          <div className="text-[11px] text-amber-800/80 border-t border-amber-200/80 pt-2 flex justify-between">
            <span>청구 금액: 350,000원</span>
            <span className="font-bold text-amber-700">입금확인 대기</span>
          </div>
        </div>
      </UiBadge>

      {/* 4. 자격증 발급 상황 타임라인 */}
      <UiBadge serialId="P48-SEC03-CRD01" label="[P48-SEC03-CRD01]">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>자격증 발급 5단계 진행 현황</span>
          </h3>

          <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
            <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mx-auto mb-0.5" />
              <div className="font-semibold text-slate-800">1.신청</div>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mx-auto mb-0.5" />
              <div className="font-semibold text-slate-800">2.입금</div>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-200">
              <Clock className="w-3.5 h-3.5 text-indigo-600 mx-auto mb-0.5 animate-pulse" />
              <div className="font-bold text-indigo-900">3.실습평가</div>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 opacity-50">
              <div className="font-semibold text-slate-500">4.심사</div>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 opacity-50">
              <div className="font-semibold text-slate-500">5.발급</div>
            </div>
          </div>
        </div>
      </UiBadge>

      {/* 5. 전화상담 바로걸기 배너 */}
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
        <div>
          <div className="font-bold text-slate-800">전화 입학/수강 문의</div>
          <div className="text-indigo-700 font-extrabold text-sm">1588-2424</div>
        </div>
        <a
          href="tel:1588-2424"
          className="px-3 py-2 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-1 shadow-sm"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>전화연결</span>
        </a>
      </div>

      {/* 모바일 로그인 및 간편 회원가입 모달 */}
      <MobileAuthModal
        isOpen={isAuthModalOpen}
        initialTab={authModalTab}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => setCurrentUser(user)}
      />
    </div>
  );
};

export default MyScreen;
